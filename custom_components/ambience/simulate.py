"""What-if scene simulator: synthesize a hypothetical world and resolve it.

A `SimulatedWorld` (a `now` plus per-entity full-state overrides) is turned into
the `{condition_name: snapshot}` dict the engine consumes, so `evaluate_explained`
runs unchanged against a world the user described instead of the live one.
Read-only: nothing here writes to Home Assistant.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any

from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State
from homeassistant.util import dt as dt_util

from .conditions._common import dur_seconds
from .conditions.script import ScriptSnapshot
from .conditions.template import TemplateSnapshot
from .conditions.weather import WEATHER_CONDITIONS
from .const import DATA_CONDITIONS, DATA_EXPOSED_ACTIONS, DATA_STORE, DOMAIN
from .engine import evaluate_explained
from .errors import AmbienceError
from .naming import category_names, scope_display_name
from .scope_triggers import iter_predicate_specs, referenced_entities, scope_trigger_spec
from .service import _switch_state, category_config
from .state_options import known_attribute_values_for, known_states_for
from .sun_position import ANCHOR_NAMES, anchor_datetimes, synthetic_sun_state
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

    `overrides` maps entity_id -> {"state": str, "attributes": {name: value},
    "for": {"h","m","s"}}; `attributes` is optional and merged over the entity's
    live attributes; `for` is optional and backdates the state's clock so `for:`
    conditions see the entity as having held this state for that long.
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
        # Backdate the state clock by `for` so duration conditions see the entity
        # as having held this state that long; absent (0s) it reads just-changed
        # at the simulated `now`. Set both timestamps: state-mode `for:` atoms
        # clock off last_changed, attribute-mode atoms off last_updated.
        # Simulated snapshots carry NO engine tenure, so conditions fall back to
        # this legacy exact-state clock — which is exactly what these backdated
        # timestamps drive. (A consequence: multi-entity tenure scenarios — a
        # person hopping away zones, a sensor handover — can't be expressed in
        # the simulator, which approximates by backdating each entity's clock.)
        # Clamp negatives (never backdate into the future) and guard an absurd
        # duration that would underflow datetime — that just reads as "forever".
        seconds = max(0.0, dur_seconds(spec.get("for")))
        try:
            since = world.now - timedelta(seconds=seconds)
        except OverflowError:
            since = datetime.min.replace(tzinfo=world.now.tzinfo)
        overrides[entity_id] = State(
            entity_id,
            spec.get("state", fallback),
            attributes,
            last_changed=since,
            last_updated=since,
        )
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
    raise AmbienceError("no_verdict_snapshot", condition_key=condition_key)


async def build_simulated_snapshots(
    hass: HomeAssistant,
    world: SimulatedWorld,
    *,
    referenced: dict[str, frozenset[str]] | None = None,
) -> dict[str, Any]:
    """Snapshot every registered condition against the simulated world.

    Entity-reading conditions snapshot against the overlay (with injected `now`);
    opaque conditions (script/template) are built from `world.verdicts` so no real
    script runs and overrides are honoured. A live condition whose snapshot raises
    degrades to None (same policy as `async_snapshot_all`).

    `referenced` (condition_key -> entity_ids the simulated scenes use, from
    `scope_triggers.referenced_entities`) narrows sensor-backed conditions to
    those entities; a condition absent from the map gets an empty set. `None`
    means "no hint, scan as before" — the back-compat default for direct callers.
    """
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    overlay = _SimulatedHass(
        hass,
        _SimulatedStates(hass.states, _build_override_states(hass, world)),
    )
    live = {name: m for name, m in conditions.items() if name not in _OPAQUE_CONDITIONS}

    def _entities(name: str) -> frozenset[str] | None:
        return None if referenced is None else referenced.get(name, frozenset())

    results = await asyncio.gather(
        *[m.snapshot(overlay, now=world.now, entities=_entities(name)) for name, m in live.items()],
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
    """The scope config narrowed to one category's scenes: {"scenes": [...]}."""
    store = hass.data[DOMAIN][DATA_STORE]
    return category_config(store.scope_config(scope_kind, scope_id), category)


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
    for scene in category_cfg["scenes"]:
        when = scene.get("when") or {}
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


def _attribute_knob(
    hass: HomeAssistant, entity_id: str, live: State | None, spec: dict[str, str]
) -> dict[str, Any]:
    """One editable attribute sub-row. A string attribute backed by a companion
    option-list (e.g. a remote's `current_activity` reads `activity_list`) becomes
    a select seeded with those values — the same lookup the scene editor's value
    dropdown uses — so the user picks rather than retypes. A bare current value
    (no list to choose from) stays free text; a native select offers no escape
    hatch, so trapping the user on the live value would be worse than free text.
    Numeric attributes (compared via >/<) keep their number field."""
    name = spec["name"]
    control = spec["control"]
    live_value = live.attributes.get(name) if live is not None else None
    knob: dict[str, Any] = {"name": name, "control": control, "live_value": live_value}
    if control == "text":
        opts = known_attribute_values_for(hass, entity_id, name)
        # ≥2 categorical values means a real list to pick from; a lone current
        # value stays free text (see docstring) so a native select can't trap it.
        if sum(1 for o in opts if not _is_number(o)) >= 2:
            knob["control"] = "select"
            knob["options"] = opts
    return knob


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
        "attributes": [_attribute_knob(hass, entity_id, live, spec) for spec in attr_specs],
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
    condition: Any, condition_key: str, predicate: dict[str, Any], scene: dict[str, Any]
) -> tuple[str, str | None, str]:
    """(result_key, entity_id|None, label) for an opaque predicate's verdict knob.

    The result key comes from the condition's own `result_key()` so the simulator
    and `matches()` always agree on the identity."""
    key = condition.result_key(predicate) if condition is not None else ""
    if condition_key == "script":
        script = predicate.get("script")
        label = script if isinstance(script, str) else "script"
        return key, (script if isinstance(script, str) else None), label
    return key, None, (scene.get("name") or "Template")


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
    for scene in category_cfg["scenes"]:
        when = scene.get("when") or {}
        for name in _OPAQUE_CONDITIONS:
            predicate = when.get(name)
            if not isinstance(predicate, dict):
                continue
            condition = conditions.get(name)
            key, entity_id, label = _verdict_identity(condition, name, predicate, scene)
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


def sun_anchors(hass: HomeAssistant, date_str: str) -> dict[str, str | None]:
    """The six sun anchors for `date_str` (YYYY-MM-DD) at the home's location.

    Each value is that solar event's occurrence on the given local date as a UTC
    ISO string, or None where the anchor is undefined at the date/location (polar
    day/night). The simulator's Sun-mode "When" resolves `anchor ± offset` against
    these to build the instant it sends to `ambience/simulate`.
    """
    try:
        parsed = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError as exc:
        raise AmbienceError("unparseable_date", date=date_str) from exc
    # anchor_datetimes reads only now's local *date*; a tz-aware local noon
    # materialises the date unambiguously (no DST-fold edge at noon).
    now = parsed.replace(hour=12, tzinfo=dt_util.DEFAULT_TIME_ZONE)
    resolved = anchor_datetimes(hass, now, allow_missing=True)
    return {
        name: (resolved[name].isoformat() if name in resolved else None) for name in ANCHOR_NAMES
    }


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


def _simulate_outcome(
    prev_applied: int | None,
    winner_index: int | None,
    has_actions: bool,
    apply_mode: str | None,
) -> tuple[Outcome, int | None]:
    """Decide the outcome + the next last-applied index for one simulate step,
    mirroring the production debounce in trigger_engine._resolve_and_apply.

    prev_applied is the winning scene index the previous step *acted* on (None if
    none). Rules, in order:
      - no winner            -> NO_MATCH, forget (next = None)
      - winner has no actions -> NO_OP, transparent (next = prev_applied)
      - winner == prev_applied and apply != "always" -> DEBOUNCED (next = prev_applied)
      - otherwise            -> ACTED (next = winner)
    """
    if winner_index is None:
        return Outcome.NO_MATCH, None
    if not has_actions:
        return Outcome.NO_OP, prev_applied
    if winner_index == prev_applied and apply_mode != "always":
        return Outcome.DEBOUNCED, prev_applied
    return Outcome.ACTED, winner_index


async def run_simulation(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str,
    world: SimulatedWorld,
    *,
    prev_applied: int | None = None,
) -> tuple[dict[str, Any], int | None]:
    """Resolve one category against the simulated world and return
    (BufferedUnit dict, next applied index).

    `prev_applied` is the winning scene index the previous simulate step acted on
    (None to start). The outcome + next index follow production's debounce
    (see `_simulate_outcome`), so repeated steps reproduce ACTED/NO_OP/DEBOUNCED/
    NO_MATCH exactly as the live engine would. A `simulated` cause is used.
    """
    conditions: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    candidates = _category_config(hass, scope_kind, scope_id, category)["scenes"]
    # Narrow each condition's snapshot to the entities the simulated category's
    # scenes actually reference (the simulated scene set), mirroring production.
    referenced = referenced_entities(conditions, [{"scenes": candidates}])
    snapshots = await build_simulated_snapshots(hass, world, referenced=referenced)
    explanation = evaluate_explained(candidates, snapshots, conditions, describe=True)

    switch_state = _switch_state(hass, scope_kind, scope_id)
    scope_name = _safe_scope_name(hass, scope_kind, scope_id)
    category_name = _safe_category_name(hass, category)

    winner = explanation.winner_index
    scene = candidates[winner] if winner is not None else None
    actions = scene.get("actions", []) if scene is not None else []
    apply_mode = scene.get("apply") if scene is not None else None
    outcome, next_applied = _simulate_outcome(prev_applied, winner, bool(actions), apply_mode)

    if scene is None:
        unit = UnitTrace(
            scope_kind,
            scope_id,
            category,
            switch_state,
            outcome,
            explanation,
            category_name=category_name,
            scope_name=scope_name,
        )
    else:
        # Only an ACTED step records its actions; DEBOUNCED and NO_OP carry none —
        # exactly what production records when a scene is not (re)applied. (ACTED is
        # only returned when the winner has actions, so no extra emptiness check.)
        recorded = (
            hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].annotate_unexposed(actions)
            if outcome is Outcome.ACTED
            else []
        )
        unit = UnitTrace(
            scope_kind,
            scope_id,
            category,
            switch_state,
            outcome,
            explanation,
            winner_name=scene.get("name"),
            actions=recorded,
            category_name=category_name,
            scope_name=scope_name,
        )
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail=world.now.isoformat())
    record = BufferedUnit(event_id=None, timestamp=world.now.isoformat(), cause=cause, unit=unit)
    return buffered_unit_to_dict(record), next_applied
