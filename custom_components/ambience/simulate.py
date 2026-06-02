"""What-if rule simulator: synthesize a hypothetical world and resolve it.

A `SimulatedWorld` (a `now` plus per-entity full-state overrides) is turned into
the `{matcher_name: snapshot}` dict the engine consumes, so `evaluate_explained`
runs unchanged against a world the user described instead of the live one.
Read-only: nothing here writes to Home Assistant.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State

from .const import DATA_MATCHERS, DATA_STORE, DATA_SWITCHES, DOMAIN
from .engine import evaluate_explained
from .matchers.script import ScriptSnapshot, _cache_key
from .matchers.template import TemplateSnapshot
from .matchers.weather import WEATHER_CONDITIONS
from .naming import group_names, scope_display_name
from .scope_triggers import iter_predicate_specs, scope_trigger_spec
from .state_options import known_states_for
from .sun_position import synthetic_sun_state
from .trace import (
    BufferedUnit,
    CauseKind,
    Outcome,
    TriggerCause,
    UnitTrace,
    buffered_unit_to_dict,
)

_LOGGER = logging.getLogger(__name__)

# Matchers whose predicates evaluate live (call a real script / render a
# template) and so cannot honour entity overrides. The simulator drives them
# with explicit per-predicate verdicts instead of running them.
_OPAQUE_MATCHERS = ("script", "template")


@dataclass(frozen=True)
class SimulatedWorld:
    """The hypothetical world to resolve against.

    `overrides` maps entity_id -> {"state": str, "attributes": {name: value}};
    `attributes` is optional and merged over the entity's live attributes.
    `verdicts` maps an opaque matcher_key -> {result_key: bool}, forcing each
    `script`/`template` predicate's result (the simulator computes the keys).
    """

    now: datetime
    overrides: dict[str, dict[str, Any]] = field(default_factory=dict)
    verdicts: dict[str, dict[str, bool]] = field(default_factory=dict)


class _SimulatedStates:
    """Read-only states view: overridden states win, else the live state."""

    def __init__(self, real: Any, overrides: dict[str, State]) -> None:
        self._real = real
        self._overrides = overrides

    def get(self, entity_id: str) -> State | None:
        return self._overrides.get(entity_id) or self._real.get(entity_id)

    def async_all(self, domain: Any = None) -> list[State]:
        merged: dict[str, State] = {s.entity_id: s for s in self._real.async_all(domain)}
        for entity_id, state in self._overrides.items():
            if _in_domain(entity_id, domain):
                merged[entity_id] = state
        return list(merged.values())


def _in_domain(entity_id: str, domain: Any) -> bool:
    if domain is None:
        return True
    prefix = entity_id.split(".", 1)[0]
    if isinstance(domain, str):
        return prefix == domain
    # HA also accepts an iterable of domains.
    return prefix in set(domain)


class _SimulatedHass:
    """Wraps the real hass, replacing only `.states`; everything else delegates."""

    def __init__(self, real: HomeAssistant, states: _SimulatedStates) -> None:
        self._real = real
        self.states = states

    def __getattr__(self, name: str) -> Any:
        return getattr(self._real, name)


def _build_override_states(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, State]:
    """Materialise overrides as State objects (attributes merged over live), and
    inject a synthetic sun.sun unless the user overrode it explicitly."""
    overrides: dict[str, State] = {}
    for entity_id, spec in world.overrides.items():
        live = hass.states.get(entity_id)
        attributes = dict(live.attributes) if live is not None else {}
        attributes.update(spec.get("attributes") or {})
        fallback = live.state if live is not None else STATE_UNKNOWN
        overrides[entity_id] = State(entity_id, spec.get("state", fallback), attributes)
    if "sun.sun" not in overrides:
        overrides["sun.sun"] = synthetic_sun_state(hass, world.now)
    return overrides


def _verdict_snapshot(matcher_key: str, verdicts: dict[str, bool]) -> Any:
    """Build an opaque matcher's snapshot from forced verdicts.

    Both script and template snapshots are a `results: dict[str, bool]` looked
    up by `matches()`, so a verdict map is a complete snapshot."""
    if matcher_key == "script":
        return ScriptSnapshot(results=dict(verdicts))
    if matcher_key == "template":
        return TemplateSnapshot(results=dict(verdicts))
    raise ValueError(f"no verdict snapshot for opaque matcher {matcher_key!r}")


async def build_simulated_snapshots(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, Any]:
    """Snapshot every registered matcher against the simulated world.

    Entity-reading matchers snapshot against the overlay (with injected `now`);
    opaque matchers (script/template) are built from `world.verdicts` so no real
    script runs and overrides are honoured. A live matcher whose snapshot raises
    degrades to None (same policy as `_snapshot_all`)."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    overlay = _SimulatedHass(
        hass,
        _SimulatedStates(hass.states, _build_override_states(hass, world)),
    )
    live = {name: m for name, m in matchers.items() if name not in _OPAQUE_MATCHERS}
    results = await asyncio.gather(
        *[m.snapshot(overlay, now=world.now) for m in live.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(live.keys(), results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: simulated snapshot for %r failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
    for name in matchers:
        if name in _OPAQUE_MATCHERS:
            snapshots[name] = _verdict_snapshot(name, world.verdicts.get(name, {}))
    return snapshots


def _group_config(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, group: str
) -> dict[str, Any]:
    """The scope config narrowed to one group's rules: {"rules": [...]}."""
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = store.scope_config(scope_kind, scope_id)
    return {"rules": [r for r in cfg.get("rules", []) if r.get("group") == group]}


def _referenced_attributes(hass: HomeAssistant, group_cfg: dict[str, Any]) -> dict[str, list[str]]:
    """entity_id -> attribute names the group's predicates read beyond `state`.

    Only the weather matcher reads attributes (its numeric thresholds), so this
    is weather-specific by design; promote to a matcher protocol method if a
    second attribute-consuming matcher appears.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    weather_entity = store.get_matcher_config("weather").get("entity")
    if not weather_entity:
        return {}
    names: set[str] = set()
    for rule in group_cfg["rules"]:
        predicate = (rule.get("when") or {}).get("weather")
        if isinstance(predicate, dict):
            for threshold in predicate.get("thresholds") or []:
                if isinstance(threshold, dict) and threshold.get("attribute"):
                    names.add(threshold["attribute"])
    return {weather_entity: sorted(names)} if names else {}


_TIME_DERIVED_MATCHERS = ("day", "sun", "time_of_day")


def _time_derived_entities(matchers: dict[str, Any], group_cfg: dict[str, Any]) -> set[str]:
    """Entities contributed by the date/sun/time matchers — folded under the
    `When` field, so they are not shown as separate knobs."""
    out: set[str] = set()
    for _idx, matcher_key, spec in iter_predicate_specs(matchers, group_cfg):
        if matcher_key in _TIME_DERIVED_MATCHERS:
            out |= spec.entities
    return out


def _is_number(value: str | None) -> bool:
    if value is None:
        return False
    try:
        float(value)
        return True
    except ValueError:
        return False


def _entity_knob(
    hass: HomeAssistant, entity_id: str, attr_names: list[str], weather_entity: str | None
) -> dict[str, Any]:
    live = hass.states.get(entity_id)
    live_state = live.state if live is not None else None
    options: list[str] | None
    if entity_id == weather_entity:
        control, options = "select", list(WEATHER_CONDITIONS)
    else:
        opts = known_states_for(hass, entity_id)
        # If the only "options" are all numeric (e.g. a sensor whose live state
        # was echoed back by known_states_for), treat it as a number control.
        # (Edge: a select whose options are all numeric strings becomes a number
        # field too — acceptable for v1, a number still yields a valid value.)
        categorical = [o for o in opts if not _is_number(o)]
        if categorical:
            control, options = "select", opts
        elif _is_number(live_state):
            control, options = "number", None
        else:
            control, options = "text", None
    knob: dict[str, Any] = {
        "kind": "entity",
        "entity_id": entity_id,
        "control": control,
        "live_state": live_state,
        "attributes": [
            {
                "name": name,
                "control": "number",
                "live_value": (live.attributes.get(name) if live is not None else None),
            }
            for name in attr_names
        ],
    }
    if options is not None:
        knob["options"] = options
    return knob


def simulate_inputs_entities(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, group: str
) -> list[dict[str, Any]]:
    """The entity knobs for a group's panel (date/sun/time entities excluded),
    each with a control hint + options. Verdict knobs are added separately."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    store = hass.data[DOMAIN][DATA_STORE]
    group_cfg = _group_config(hass, scope_kind, scope_id, group)
    spec = scope_trigger_spec(matchers, group_cfg)
    excluded = _time_derived_entities(matchers, group_cfg)
    attrs_by_entity = _referenced_attributes(hass, group_cfg)
    weather_entity = store.get_matcher_config("weather").get("entity")
    return [
        _entity_knob(hass, entity_id, attrs_by_entity.get(entity_id, []), weather_entity)
        for entity_id in sorted(spec.entities - excluded)
    ]


def _verdict_identity(
    matcher_key: str, predicate: dict[str, Any], rule: dict[str, Any]
) -> tuple[str, str | None, str]:
    """(result_key, entity_id|None, label) for an opaque predicate's verdict knob."""
    if matcher_key == "script":
        script = predicate.get("script")
        args = predicate.get("args") or {}
        key = _cache_key(
            script if isinstance(script, str) else "",
            args if isinstance(args, dict) else {},
        )
        label = script if isinstance(script, str) else "script"
        return key, (script if isinstance(script, str) else None), label
    tmpl = predicate.get("template")
    key = tmpl if isinstance(tmpl, str) else ""
    return key, None, (rule.get("name") or "Template")


async def _verdict_knobs(
    hass: HomeAssistant, matchers: dict[str, Any], group_cfg: dict[str, Any]
) -> list[dict[str, Any]]:
    """One true/false knob per opaque (script/template) predicate in the group,
    defaulting to its live verdict (computed once per opaque matcher)."""
    live_snaps: dict[str, Any] = {}
    for name in _OPAQUE_MATCHERS:
        matcher = matchers.get(name)
        if matcher is not None:
            try:
                live_snaps[name] = await matcher.snapshot(hass)
            except Exception as exc:  # noqa: BLE001 — a failing live verdict defaults to False
                _LOGGER.warning("ambience: live verdict snapshot for %r failed: %s", name, exc)
                live_snaps[name] = None
    knobs: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for rule in group_cfg["rules"]:
        when = rule.get("when") or {}
        for name in _OPAQUE_MATCHERS:
            predicate = when.get(name)
            if not isinstance(predicate, dict):
                continue
            key, entity_id, label = _verdict_identity(name, predicate, rule)
            if (name, key) in seen:
                continue
            seen.add((name, key))
            matcher, snap = matchers.get(name), live_snaps.get(name)
            live_value = (
                bool(matcher.matches(predicate, snap)) if (matcher and snap is not None) else False
            )
            knob: dict[str, Any] = {
                "kind": "verdict",
                "matcher": name,
                "key": key,
                "label": label,
                "live_value": live_value,
            }
            if entity_id:
                knob["entity_id"] = entity_id
            knobs.append(knob)
    return knobs


async def simulate_inputs(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, group: str
) -> dict[str, Any]:
    """The editable inputs for a group's simulator panel: entity knobs (with
    control hints) plus verdict knobs for opaque predicates. `has_time` is True
    when the group depends on the clock/sun (the panel shows a date+time picker;
    the day/sun/time entities themselves are folded under it, not listed)."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    group_cfg = _group_config(hass, scope_kind, scope_id, group)
    spec = scope_trigger_spec(matchers, group_cfg)
    knobs = simulate_inputs_entities(hass, scope_kind, scope_id, group)
    knobs.extend(await _verdict_knobs(hass, matchers, group_cfg))
    has_time = bool(spec.clock_times or spec.has_time or spec.date_rollover or spec.sun_events)
    return {"knobs": knobs, "has_time": has_time}


def _switch_state(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """The scope switch's on/off state, or 'unknown' when unavailable. Mirrors
    service._switch_state but tolerates a missing switch registry (simulations
    can run before switches register)."""
    switches = hass.data.get(DOMAIN, {}).get(DATA_SWITCHES, {})
    switch = switches.get((scope_kind, scope_id))
    if switch is None:
        return "unknown"
    return "on" if switch.is_on else "off"


def _safe_scope_name(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str | None:
    try:
        return scope_display_name(hass, scope_kind, scope_id)
    except Exception:  # noqa: BLE001 — test doubles may lack registries
        return None


def _safe_group_name(hass: HomeAssistant, group: str) -> str | None:
    # group_names() already tolerates a missing store (returns {}); this guard
    # only protects against a present-but-broken store, and keeps symmetry with
    # _safe_scope_name.
    try:
        return group_names(hass).get(group)
    except Exception:  # noqa: BLE001 — test doubles may lack a full store
        return None


async def run_simulation(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    group: str,
    world: SimulatedWorld,
) -> dict[str, Any]:
    """Resolve one group against the simulated world and return a BufferedUnit
    dict (the shape `renderEvaluation()` consumes), with a `simulated` cause."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    candidates = _group_config(hass, scope_kind, scope_id, group)["rules"]
    snapshots = await build_simulated_snapshots(hass, world)
    explanation = evaluate_explained(candidates, snapshots, matchers, describe=True)

    switch_state = _switch_state(hass, scope_kind, scope_id)
    scope_name = _safe_scope_name(hass, scope_kind, scope_id)
    group_name = _safe_group_name(hass, group)

    winner = explanation.winner_index
    if winner is None:
        unit = UnitTrace(
            scope_kind,
            scope_id,
            group,
            switch_state,
            Outcome.NO_MATCH,
            explanation,
            group_name=group_name,
            scope_name=scope_name,
        )
    else:
        rule = candidates[winner]
        unit = UnitTrace(
            scope_kind,
            scope_id,
            group,
            switch_state,
            Outcome.ACTED,
            explanation,
            winner_name=rule.get("name"),
            actions=rule.get("actions", []),
            group_name=group_name,
            scope_name=scope_name,
        )
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail=world.now.isoformat())
    record = BufferedUnit(event_id=None, timestamp=world.now.isoformat(), cause=cause, unit=unit)
    return buffered_unit_to_dict(record)
