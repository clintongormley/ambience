"""What-if rule simulator: synthesize a hypothetical world and resolve it.

A `SimulatedWorld` (a `now` plus per-entity full-state overrides) is turned into
the `{condition_name: snapshot}` dict the engine consumes, so `evaluate_explained`
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

from .conditions.script import ScriptSnapshot
from .conditions.template import TemplateSnapshot
from .conditions.weather import WEATHER_CONDITIONS
from .const import DATA_CONDITIONS, DATA_STORE, DATA_SWITCHES, DOMAIN
from .engine import evaluate_explained
from .naming import category_names, scope_display_name
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

# Conditions whose predicates evaluate live (call a real script / render a
# template) and so cannot honour entity overrides. The simulator drives them
# with explicit per-predicate verdicts instead of running them.
_OPAQUE_CONDITIONS = ("script", "template")


@dataclass(frozen=True)
class SimulatedWorld:
    """The hypothetical world to resolve against.

    `overrides` maps entity_id -> {"state": str, "attributes": {name: value}};
    `attributes` is optional and merged over the entity's live attributes.
    `verdicts` maps an opaque condition_key -> {result_key: bool}, forcing each
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


def _verdict_snapshot(condition_key: str, verdicts: dict[str, bool]) -> Any:
    """Build an opaque condition's snapshot from forced verdicts.

    Both script and template snapshots are a `results: dict[str, bool]` looked
    up by `matches()`, so a verdict map is a complete snapshot."""
    if condition_key == "script":
        return ScriptSnapshot(results=dict(verdicts))
    if condition_key == "template":
        return TemplateSnapshot(results=dict(verdicts))
    raise ValueError(f"no verdict snapshot for opaque condition {condition_key!r}")


async def build_simulated_snapshots(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, Any]:
    """Snapshot every registered condition against the simulated world.

    Entity-reading conditions snapshot against the overlay (with injected `now`);
    opaque conditions (script/template) are built from `world.verdicts` so no real
    script runs and overrides are honoured. A live condition whose snapshot raises
    degrades to None (same policy as `_snapshot_all`)."""
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    overlay = _SimulatedHass(
        hass,
        _SimulatedStates(hass.states, _build_override_states(hass, world)),
    )
    live = {name: m for name, m in conditions.items() if name not in _OPAQUE_CONDITIONS}
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
    for name in conditions:
        if name in _OPAQUE_CONDITIONS:
            snapshots[name] = _verdict_snapshot(name, world.verdicts.get(name, {}))
    return snapshots


def _category_config(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> dict[str, Any]:
    """The scope config narrowed to one category's rules: {"rules": [...]}."""
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = store.scope_config(scope_kind, scope_id)
    return {"rules": [r for r in cfg.get("rules", []) if r.get("category") == category]}


# state-predicate atom kinds that compare numerically (so the attribute is a
# number); any other comparison (`is`/`is_not`) treats the attribute as text.
_STATE_NUMERIC_KINDS = (">", ">=", "<", "<=")


def _record_attr(out: dict[str, dict[str, str]], entity_id: str, name: str, control: str) -> None:
    """Record an entity attribute and its control, preferring `text` when an
    attribute is read both numerically and as a string (text holds either)."""
    attrs = out.setdefault(entity_id, {})
    if attrs.get(name) != "text":
        attrs[name] = control


def _collect_state_attributes(node: Any, out: dict[str, dict[str, str]]) -> None:
    """Walk a state predicate tree, recording every `(entity_id, attribute)` an
    atom reads (mirrors StateCondition's own tree walk)."""
    if not isinstance(node, dict):
        return
    kind = node.get("kind")
    if kind in ("and", "or"):
        for item in node.get("items") or []:
            _collect_state_attributes(item, out)
        return
    if kind == "not":
        _collect_state_attributes(node.get("item"), out)
        return
    attribute = node.get("attribute")
    entity_id = node.get("entity_id")
    if attribute and isinstance(entity_id, str):
        control = "number" if kind in _STATE_NUMERIC_KINDS else "text"
        _record_attr(out, entity_id, attribute, control)


def _referenced_attributes(
    hass: HomeAssistant, category_cfg: dict[str, Any]
) -> dict[str, list[dict[str, str]]]:
    """entity_id -> [{name, control}] for attributes the category's predicates read
    beyond `state`: the weather condition's numeric thresholds and any attribute a
    `state` predicate atom references (string via is/is_not, numeric via >/<)."""
    out: dict[str, dict[str, str]] = {}
    store = hass.data[DOMAIN][DATA_STORE]
    weather_entity = store.get_condition_config("weather").get("entity")
    for rule in category_cfg["rules"]:
        when = rule.get("when") or {}
        weather = when.get("weather")
        if weather_entity and isinstance(weather, dict):
            for threshold in weather.get("thresholds") or []:
                if isinstance(threshold, dict) and threshold.get("attribute"):
                    _record_attr(out, weather_entity, threshold["attribute"], "number")
        _collect_state_attributes(when.get("state"), out)
    return {
        entity_id: [{"name": name, "control": control} for name, control in sorted(attrs.items())]
        for entity_id, attrs in out.items()
    }


_TIME_DERIVED_CONDITIONS = ("day", "sun", "time_of_day")


def _time_derived_entities(conditions: dict[str, Any], category_cfg: dict[str, Any]) -> set[str]:
    """Entities contributed by the date/sun/time conditions — folded under the
    `When` field, so they are not shown as separate knobs."""
    out: set[str] = set()
    for _idx, condition_key, spec in iter_predicate_specs(conditions, category_cfg):
        if condition_key in _TIME_DERIVED_CONDITIONS:
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
    hass: HomeAssistant,
    entity_id: str,
    attr_specs: list[dict[str, str]],
    weather_entity: str | None,
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
                "name": spec["name"],
                "control": spec["control"],
                "live_value": (live.attributes.get(spec["name"]) if live is not None else None),
            }
            for spec in attr_specs
        ],
    }
    if options is not None:
        knob["options"] = options
    return knob


def simulate_inputs_entities(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> list[dict[str, Any]]:
    """The entity knobs for a category's panel (date/sun/time entities excluded),
    each with a control hint + options. Verdict knobs are added separately."""
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    store = hass.data[DOMAIN][DATA_STORE]
    category_cfg = _category_config(hass, scope_kind, scope_id, category)
    spec = scope_trigger_spec(conditions, category_cfg)
    excluded = _time_derived_entities(conditions, category_cfg)
    attrs_by_entity = _referenced_attributes(hass, category_cfg)
    weather_entity = store.get_condition_config("weather").get("entity")
    return [
        _entity_knob(hass, entity_id, attrs_by_entity.get(entity_id, []), weather_entity)
        for entity_id in sorted(spec.entities - excluded)
    ]


def _verdict_identity(
    condition: Any, condition_key: str, predicate: dict[str, Any], rule: dict[str, Any]
) -> tuple[str, str | None, str]:
    """(result_key, entity_id|None, label) for an opaque predicate's verdict knob.

    The result key comes from the condition's own `result_key()` so the simulator
    and `matches()` always agree on the identity."""
    key = condition.result_key(predicate) if condition is not None else ""
    if condition_key == "script":
        script = predicate.get("script")
        label = script if isinstance(script, str) else "script"
        return key, (script if isinstance(script, str) else None), label
    return key, None, (rule.get("name") or "Template")


async def _verdict_knobs(
    hass: HomeAssistant, conditions: dict[str, Any], category_cfg: dict[str, Any]
) -> list[dict[str, Any]]:
    """One true/false knob per opaque (script/template) predicate in the category,
    defaulting to its live verdict (computed once per opaque condition)."""
    live_snaps: dict[str, Any] = {}
    for name in _OPAQUE_CONDITIONS:
        condition = conditions.get(name)
        if condition is not None:
            try:
                live_snaps[name] = await condition.snapshot(hass)
            except Exception as exc:  # noqa: BLE001 — a failing live verdict defaults to False
                _LOGGER.warning("ambience: live verdict snapshot for %r failed: %s", name, exc)
                live_snaps[name] = None
    knobs: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for rule in category_cfg["rules"]:
        when = rule.get("when") or {}
        for name in _OPAQUE_CONDITIONS:
            predicate = when.get(name)
            if not isinstance(predicate, dict):
                continue
            condition = conditions.get(name)
            key, entity_id, label = _verdict_identity(condition, name, predicate, rule)
            if (name, key) in seen:
                continue
            seen.add((name, key))
            snap = live_snaps.get(name)
            live_value = (
                bool(condition.matches(predicate, snap))
                if (condition and snap is not None)
                else False
            )
            knob: dict[str, Any] = {
                "kind": "verdict",
                "condition": name,
                "key": key,
                "label": label,
                "live_value": live_value,
            }
            if entity_id:
                knob["entity_id"] = entity_id
            knobs.append(knob)
    return knobs


async def simulate_inputs(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> dict[str, Any]:
    """The editable inputs for a category's simulator panel: entity knobs (with
    control hints) plus verdict knobs for opaque predicates. `has_time` is True
    when the category depends on the clock/sun (the panel shows a date+time picker;
    the day/sun/time entities themselves are folded under it, not listed)."""
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    category_cfg = _category_config(hass, scope_kind, scope_id, category)
    spec = scope_trigger_spec(conditions, category_cfg)
    knobs = simulate_inputs_entities(hass, scope_kind, scope_id, category)
    knobs.extend(await _verdict_knobs(hass, conditions, category_cfg))
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


def _safe_category_name(hass: HomeAssistant, category: str) -> str | None:
    # category_names() already tolerates a missing store (returns {}); this guard
    # only protects against a present-but-broken store, and keeps symmetry with
    # _safe_scope_name.
    try:
        return category_names(hass).get(category)
    except Exception:  # noqa: BLE001 — test doubles may lack a full store
        return None


async def run_simulation(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str,
    world: SimulatedWorld,
) -> dict[str, Any]:
    """Resolve one category against the simulated world and return a BufferedUnit
    dict (the shape `renderEvaluation()` consumes), with a `simulated` cause."""
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    candidates = _category_config(hass, scope_kind, scope_id, category)["rules"]
    snapshots = await build_simulated_snapshots(hass, world)
    explanation = evaluate_explained(candidates, snapshots, conditions, describe=True)

    switch_state = _switch_state(hass, scope_kind, scope_id)
    scope_name = _safe_scope_name(hass, scope_kind, scope_id)
    category_name = _safe_category_name(hass, category)

    winner = explanation.winner_index
    if winner is None:
        unit = UnitTrace(
            scope_kind,
            scope_id,
            category,
            switch_state,
            Outcome.NO_MATCH,
            explanation,
            category_name=category_name,
            scope_name=scope_name,
        )
    else:
        rule = candidates[winner]
        unit = UnitTrace(
            scope_kind,
            scope_id,
            category,
            switch_state,
            Outcome.ACTED,
            explanation,
            winner_name=rule.get("name"),
            actions=rule.get("actions", []),
            category_name=category_name,
            scope_name=scope_name,
        )
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail=world.now.isoformat())
    record = BufferedUnit(event_id=None, timestamp=world.now.isoformat(), cause=cause, unit=unit)
    return buffered_unit_to_dict(record)
