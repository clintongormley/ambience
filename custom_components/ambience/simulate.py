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
from .naming import group_names, scope_display_name
from .scope_triggers import scope_trigger_spec
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


@dataclass(frozen=True)
class SimulatedWorld:
    """The hypothetical world to resolve against.

    `overrides` maps entity_id -> {"state": str, "attributes": {name: value}};
    `attributes` is optional and merged over the entity's live attributes.
    """

    now: datetime
    overrides: dict[str, dict[str, Any]] = field(default_factory=dict)


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


async def build_simulated_snapshots(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, Any]:
    """Snapshot every registered matcher against the simulated world.

    Returns {matcher_name: snapshot}; a matcher whose snapshot raises degrades
    to None (same policy as the live `_snapshot_all`)."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    overlay = _SimulatedHass(
        hass,
        _SimulatedStates(hass.states, _build_override_states(hass, world)),
    )
    results = await asyncio.gather(
        *[m.snapshot(overlay, now=world.now) for m in matchers.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(matchers.keys(), results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: simulated snapshot for %r failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
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


def simulate_inputs(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, group: str
) -> dict[str, Any]:
    """The editable inputs for a group's simulator panel.

    Returns {knobs, has_time, opaque}. Each entity knob carries its live state
    and any referenced-attribute sub-rows pre-filled live. `has_time` is True
    when the group depends on the clock/sun (the panel shows a date+time
    picker). `opaque` flags incomplete deps (e.g. a template rule).
    """
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    group_cfg = _group_config(hass, scope_kind, scope_id, group)
    spec = scope_trigger_spec(matchers, group_cfg)
    attrs_by_entity = _referenced_attributes(hass, group_cfg)

    knobs: list[dict[str, Any]] = []
    for entity_id in sorted(spec.entities):
        live = hass.states.get(entity_id)
        knobs.append(
            {
                "kind": "entity",
                "entity_id": entity_id,
                "live_state": live.state if live is not None else None,
                "attributes": [
                    {
                        "name": name,
                        "live_value": (live.attributes.get(name) if live is not None else None),
                    }
                    for name in attrs_by_entity.get(entity_id, [])
                ],
            }
        )
    has_time = bool(spec.clock_times or spec.has_time or spec.date_rollover or spec.sun_events)
    return {"knobs": knobs, "has_time": has_time, "opaque": spec.opaque}


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
