"""AutoTriggerEngine evaluation core — index build + flip detection."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime, timedelta
from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.ambience.conditions._common import tenure_held, tenure_within
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_SINKS,
    DOMAIN,
    SIGNAL_UNIT_APPLIED,
)
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.trace import TraceEvent
from custom_components.ambience.trigger_engine import AutoTriggerEngine
from custom_components.ambience.triggers import EMPTY, DurationGate, TriggerSpec


@dataclass(frozen=True)
class _GateSnap:
    """A gate-aware fake snapshot: an instant value + an anchor (last change),
    plus the engine-injected tenure. Mirrors the real condition snapshots so
    `attach_tenure`/`dataclasses.replace` work against it."""

    value: str | None
    changed: Any = None
    now: Any = None
    tenure: Mapping[str, datetime] | None = None


class GateCondition:
    """Fake with one predicate-level `for:` gate over a single entity. Matches
    when the entity's state equals the predicate; gates off engine tenure when
    attached, else (legacy) matches the instant value."""

    def __init__(self, entity_id: str, seconds: float) -> None:
        self._entity_id = entity_id
        self._seconds = seconds
        self._key = f"gate:{entity_id}"

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(
            entities=frozenset({self._entity_id}),
            duration_gates=frozenset(
                {
                    DurationGate(
                        key=self._key,
                        seconds=self._seconds,
                        label=f"{self._entity_id} is {predicate}",
                        entity_id=self._entity_id,
                    )
                }
            ),
        )

    async def snapshot(self, hass: Any, **_: Any) -> _GateSnap:
        state = hass.states.get(self._entity_id)
        return _GateSnap(
            value=state.state if state else None,
            changed=state.last_changed if state else None,
            now=dt_util.utcnow(),
        )

    def gate_states(self, predicate: Any, snap: _GateSnap) -> dict[str, tuple[bool, Any]]:
        anchor = snap.changed if snap.changed is not None else snap.now
        return {self._key: (snap.value == predicate, anchor)}

    def matches(self, predicate: Any, snap: _GateSnap) -> bool:
        if snap.value != predicate:
            return False
        if snap.tenure is None:
            return True  # legacy: no engine tenure → instant value match
        return tenure_held(snap.tenure, self._key, snap.now, self._seconds)

    def describe(self, snap: _GateSnap, predicate: Any = None) -> str | None:
        return snap.value


class FakeStore:
    """Minimal store: scope configs and scope getters."""

    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        categories: list[dict] | None = None,
        reapply: dict | None = None,
    ) -> None:
        self._scopes = scopes
        self._by_key = {(kind, sid): cfg for kind, sid, cfg in scopes}
        self._categories = categories or []
        self._enabled: dict[tuple[str, str | None], bool] = {}
        self._reapply = reapply or {"enabled": False, "interval_seconds": 5400}

    def get_reapply_settings(self) -> dict:
        return dict(self._reapply)

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return list(self._scopes)

    def get_scope_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        return self._enabled.get((scope_kind, scope_id), True)

    async def async_set_scope_enabled(
        self, scope_kind: str, scope_id: str | None, enabled: bool
    ) -> None:
        self._enabled[(scope_kind, scope_id)] = bool(enabled)

    def categories(self) -> list[dict]:
        return list(self._categories)

    def get_area(self, area_id: str) -> dict | None:
        return self._by_key.get(("area", area_id))

    def get_floor(self, floor_id: str) -> dict | None:
        return self._by_key.get(("floor", floor_id))

    def get_house(self) -> dict:
        return self._by_key.get(("house", None), {"scenes": []})


class DepsCondition:
    """Condition stub: trigger_deps returns a fixed spec; matches compares equality."""

    def __init__(self, spec: TriggerSpec) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot


def _engine(hass, scopes, conditions) -> AutoTriggerEngine:
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: conditions,
    }
    return AutoTriggerEngine(hass)


async def test_rebuild_indexes_enabled_scope_predicate(hass) -> None:
    scopes = [
        ("area", "kitchen", {"scenes": [{"when": {"state": "x"}}]}),
    ]
    conditions = {"state": DepsCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    idx = engine.index
    assert idx.by_entity["binary_sensor.motion"] == frozenset({("area", "kitchen", 0, "state")})


async def test_rebuild_watches_every_scope_unconditionally(hass) -> None:
    """Auto-triggers are always on: legacy ``auto_triggers_enabled`` /
    ``disabled_triggers`` keys in a scope's config are inert — every watch a
    scope's scenes imply is still registered."""
    scopes = [
        (
            "area",
            "kitchen",
            {
                "scenes": [{"when": {"state": "x"}}],
                "auto_triggers_enabled": False,
                "disabled_triggers": ["entity:binary_sensor.motion"],
            },
        )
    ]
    conditions = {"state": DepsCondition(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    assert engine.index.by_entity["binary_sensor.motion"] == frozenset(
        {("area", "kitchen", 0, "state")}
    )


async def test_rebuild_skips_none_predicate_and_empty_deps(hass) -> None:
    scopes = [
        (
            "house",
            None,
            {
                "scenes": [
                    {"when": {"state": None, "weather": "w"}},
                ]
            },
        )
    ]
    conditions = {
        "state": DepsCondition(TriggerSpec(entities=frozenset({"sensor.a"}))),
        "weather": DepsCondition(EMPTY),
    }
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    assert engine.index.by_entity == {}
    assert engine.index.entities == frozenset()


async def test_rebuild_unknown_condition_is_skipped(hass) -> None:
    scopes = [("area", "a", {"scenes": [{"when": {"mystery": "p"}}]})]
    engine = _engine(hass, scopes, {})
    engine.async_rebuild()
    assert engine.index.entities == frozenset()


async def test_rebuild_condition_without_trigger_deps_is_opaque(hass) -> None:
    class NoDeps:
        def matches(self, predicate, snapshot):
            return True

    scopes = [("area", "a", {"scenes": [{"when": {"legacy": "p"}}]})]
    engine = _engine(hass, scopes, {"legacy": NoDeps()})
    engine.async_rebuild()
    assert engine.index.opaque == frozenset({("area", "a", 0, "legacy")})


def _engine_with_state(hass) -> AutoTriggerEngine:
    # One scope, one scene in category "g": tod predicate "evening", deps on sensor.x.
    scopes = [
        ("area", "a", {"scenes": [{"when": {"tod": "evening"}, "category": "g"}]}),
    ]
    conditions = {"tod": DepsCondition(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    return engine


async def test_recompute_first_eval_is_a_flip(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    dirty = engine._recompute({key}, {"tod": "evening"})  # matches -> True (was unset)
    assert dirty == {("area", "a", "g")}


async def test_recompute_unchanged_value_is_not_a_flip(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # seed True
    dirty = engine._recompute({key}, {"tod": "evening"})  # still True
    assert dirty == set()


async def test_recompute_changed_value_is_a_flip(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # True
    dirty = engine._recompute({key}, {"tod": "morning"})  # now False
    assert dirty == {("area", "a", "g")}


async def test_recompute_none_snapshot_evaluates_false(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # True
    dirty = engine._recompute({key}, {"tod": None})  # snapshot None -> False -> flip
    assert dirty == {("area", "a", "g")}
    assert engine._predicate_state[key] is False


async def test_recompute_stale_key_is_ignored(hass) -> None:
    engine = _engine_with_state(hass)
    stale = ("area", "a", 9, "tod")  # scene index out of range
    dirty = engine._recompute({stale}, {"tod": "evening"})
    assert dirty == set()


async def test_recompute_one_flip_among_two_predicates_marks_scope_once(hass) -> None:
    # Two predicates in one scope+category; only one flips → unit appears once.
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"tod": "evening"}, "category": "g"},
                    {"when": {"tod": "night"}, "category": "g"},
                ]
            },
        ),
    ]
    conditions = {"tod": DepsCondition(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    k0 = ("area", "a", 0, "tod")
    k1 = ("area", "a", 1, "tod")
    engine._recompute({k0, k1}, {"tod": "evening"})  # seed: k0 True, k1 False
    dirty = engine._recompute({k0, k1}, {"tod": "night"})  # k0 True→False, k1 False→True
    assert dirty == {("area", "a", "g")}


async def test_recompute_marks_only_flipped_categories_dirty(hass) -> None:
    # Two scenes in two categories; flip ONLY the predicate of scene idx0 (category
    # "lighting"). The dirty unit set must name only that scope+category.
    scopes = [
        (
            "area",
            "lr",
            {
                "scenes": [
                    {"when": {"tod": "evening"}, "category": "lighting"},
                    {"when": {"tod": "night"}, "category": "blinds"},
                ]
            },
        ),
    ]
    conditions = {"tod": DepsCondition(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    k0 = ("area", "lr", 0, "tod")
    k1 = ("area", "lr", 1, "tod")
    engine._recompute({k0, k1}, {"tod": "morning"})  # seed: both False
    dirty = engine._recompute({k0, k1}, {"tod": "evening"})  # k0 flips True; k1 unchanged
    assert dirty == {("area", "lr", "lighting")}


async def test_tier_executor_applies_areas_then_floors_then_house(hass) -> None:
    scopes = [("area", "a", {"scenes": []})]
    conditions: dict = {}
    engine = _engine(hass, scopes, conditions)
    recorded: list[str] = []

    async def _spy(scope_kind, scope_id, category_id, *, force=False, cause=None):
        recorded.append(scope_kind)

    engine._resolve_and_apply = _spy  # type: ignore[assignment]
    units = [
        ("house", None, "g"),
        ("area", "a", "g"),
        ("floor", "f", "g"),
    ]
    await engine._apply_units(units)
    assert recorded == ["area", "floor", "house"]


async def test_recompute_key_for_removed_scope_is_ignored(hass) -> None:
    engine = _engine_with_state(hass)
    gone = ("area", "ghost", 0, "tod")  # scope not in _scope_cfgs
    dirty = engine._recompute({gone}, {"tod": "evening"})
    assert dirty == set()


async def test_category_for_returns_scene_category(hass) -> None:
    engine = _engine_with_state(hass)  # area a, scene0 in category "g"
    assert engine._category_for("area", "a", 0) == "g"


async def test_recompute_drops_units_for_missing_scene(hass) -> None:
    # A flipping predicate whose scene resolves to a None category (here: a scene
    # with no category, but the same holds for a stale/out-of-range scene) must be
    # DROPPED, never added as a (kind, id, None) unit — a None category would
    # wrongly resolve the whole list in the apply path.
    scopes = [
        ("area", "a", {"scenes": [{"when": {"tod": "evening"}}]}),  # no category on the scene
    ]
    conditions = {"tod": DepsCondition(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()
    key = ("area", "a", 0, "tod")  # live predicate, flips True; category is None
    dirty = engine._recompute({key}, {"tod": "evening"})
    assert all(unit[2] is not None for unit in dirty)
    assert dirty == set()


class CacheCondition:
    """trigger_deps + equality matches + a mutable snapshot value."""

    def __init__(self, deps: TriggerSpec, value: Any) -> None:
        self._deps = deps
        self.value = value

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._deps

    async def snapshot(self, hass: Any, **_) -> Any:
        return self.value

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot

    def describe(self, snapshot: Any, predicate=None) -> str:
        return str(snapshot)


class _FakeExposedStorage:
    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions: list[dict] = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


def _light_action(hass):
    """Register a no-op `light.turn_on` and return a one-action list using it, so
    a scene carrying it exercises the real ACTED / last-applied path."""
    hass.services.async_register("light", "turn_on", lambda call: None)
    return [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {}}]


def _apply_engine(hass, *, switch_on: bool = True):
    """Engine over one area 'a' with scenes [evening->idx0, morning->idx1], the
    'tod' condition watching sensor.x, switch on, one exposed action per scene.

    The scenes carry a real (exposed) action so the winner exercises the ACTED /
    last-applied path; a no-action winner is a distinct (blocker) case covered by
    its own tests.
    """
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    act = _light_action(hass)
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"tod": "evening"}, "category": "g", "actions": act},
                    {"when": {"tod": "morning"}, "category": "g", "actions": act},
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=switch_on)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine, tod


async def test_initial_sync_applies_winning_scene(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()  # tod="evening" -> scene 0 wins
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_evaluate_no_flip_does_not_reapply(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 99  # sentinel
    await engine.async_evaluate({("area", "a", 0, "tod"), ("area", "a", 1, "tod")})
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 99  # untouched (no flip)


async def test_evaluate_flip_to_other_scene_reapplies(hass) -> None:
    engine, tod = _apply_engine(hass)
    await engine.async_initial_sync()
    tod.value = "morning"  # scene 1 now wins
    await engine.async_evaluate({("area", "a", 0, "tod"), ("area", "a", 1, "tod")})
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 1


async def test_evaluate_switch_off_does_not_apply(hass) -> None:
    engine, _tod = _apply_engine(hass, switch_on=False)
    await engine.async_initial_sync()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_resolve_and_apply_force_reapplies_unchanged_winner(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 0
    await engine._resolve_and_apply("area", "a", "g", force=True)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def _apply_engine_with_service(hass, handler) -> AutoTriggerEngine:
    """Engine over one area 'a' (scene 'evening' in category 'g', switch on) with
    `handler` registered as light.turn_on and the 'tod' snapshot populated — ready
    for a direct _resolve_and_apply with last_applied still empty."""
    hass.services.async_register("light", "turn_on", handler)
    act = [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {}}]
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    scopes = [
        ("area", "a", {"scenes": [{"when": {"tod": "evening"}, "category": "g", "actions": act}]})
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_snapshots({"tod"})
    return engine


async def test_concurrent_apply_of_same_unit_runs_winner_once(hass) -> None:
    """Two triggers re-evaluating the same (scope, category) concurrently must
    coalesce: the winning scene's actions run once, not once per trigger.

    Models the reported race — a burst of triggers (e.g. several lights flipping
    on) lands on one unit, each spawning its own apply task. Without per-unit
    serialization both tasks read the same stale last_applied, both pass the
    debounce, and both fire the same scene.
    """
    calls = 0

    async def _counting_turn_on(call) -> None:
        nonlocal calls
        calls += 1
        # Yield mid-apply so the second task interleaves in the read->write gap.
        await asyncio.sleep(0)

    engine = await _apply_engine_with_service(hass, _counting_turn_on)

    await asyncio.gather(
        engine._resolve_and_apply("area", "a", "g"),
        engine._resolve_and_apply("area", "a", "g"),
    )

    assert calls == 1
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_last_applied_recorded_before_actions_run(hass) -> None:
    """The winning scene is recorded as last-applied BEFORE its actions execute,
    so a cascade that re-triggers the same unit mid-apply sees it as already
    applied and debounces. (We don't track per-action success, so the record
    reflects the decision, not action outcomes.)"""
    seen: list[int | None] = []

    async def _record_turn_on(call) -> None:
        seen.append(hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).get(("area", "a", "g")))

    engine = await _apply_engine_with_service(hass, _record_turn_on)

    await engine._resolve_and_apply("area", "a", "g")

    assert seen == [0]  # already recorded by the time the action fired


async def _apply_engine_with_mode(hass, mode, handler) -> AutoTriggerEngine:
    """One area 'a', a single scene 'evening'->idx0 (category 'g') carrying
    apply=`mode` (omitted when None), `handler` registered as light.turn_on,
    switch on, snapshot pre-populated — ready for a direct _resolve_and_apply."""
    hass.services.async_register("light", "turn_on", handler)
    act = [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {}}]
    scene = {"when": {"tod": "evening"}, "category": "g", "actions": act}
    if mode is not None:
        scene["apply"] = mode
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "a", {"scenes": [scene]})]),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_snapshots({"tod"})
    return engine


async def test_apply_config_for_returns_scene_apply_mode(hass) -> None:
    engine = await _apply_engine_with_mode(hass, "always", lambda call: None)
    assert engine._apply_config_for("area", "a", 0) == "always"


async def test_apply_config_for_absent_is_none(hass) -> None:
    engine = await _apply_engine_with_mode(hass, None, lambda call: None)
    assert engine._apply_config_for("area", "a", 0) is None


async def test_resolve_and_apply_always_reapplies_unchanged_winner(hass) -> None:
    calls = 0

    async def _turn_on(call) -> None:
        nonlocal calls
        calls += 1

    engine = await _apply_engine_with_mode(hass, "always", _turn_on)
    await engine._resolve_and_apply("area", "a", "g")  # first apply
    await engine._resolve_and_apply("area", "a", "g")  # same winner — always re-fires
    assert calls == 2
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_resolve_and_apply_once_debounces_unchanged_winner(hass) -> None:
    calls = 0

    async def _turn_on(call) -> None:
        nonlocal calls
        calls += 1

    engine = await _apply_engine_with_mode(hass, None, _turn_on)  # absent = once
    await engine._resolve_and_apply("area", "a", "g")
    await engine._resolve_and_apply("area", "a", "g")  # same winner — debounced
    assert calls == 1


async def test_global_force_still_reapplies_once_winner(hass) -> None:
    """Model 2: the global re-run (force=True) re-applies even a 'once' winner."""
    calls = 0

    async def _turn_on(call) -> None:
        nonlocal calls
        calls += 1

    engine = await _apply_engine_with_mode(hass, None, _turn_on)  # once
    await engine._resolve_and_apply("area", "a", "g")             # calls == 1
    await engine._resolve_and_apply("area", "a", "g", force=True)  # force re-run
    assert calls == 2


async def test_lock_serializes_ordering_when_winner_changes_mid_apply(hass) -> None:
    """The lock holds a second trigger off until the first apply's actions finish.
    When the winner flips mid-apply, the two scenes' actions run in order rather
    than interleaving — the guarantee that justifies holding the lock across the
    action run. Fails if the lock is removed: the early last_applied write alone
    prevents a duplicate same-scene fire but does NOT order overlapping applies.
    """
    events: list[str] = []
    gate = asyncio.Event()

    async def _ordered_turn_on(call) -> None:
        marker = call.data["brightness"]
        events.append(f"start{marker}")
        if marker == 0:
            await gate.wait()  # scene 0's action blocks, holding the unit lock
        events.append(f"end{marker}")

    hass.services.async_register("light", "turn_on", _ordered_turn_on)
    a0 = [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {"brightness": 0}}]
    a1 = [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {"brightness": 1}}]
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"tod": "evening"}, "category": "g", "actions": a0},
                    {"when": {"tod": "morning"}, "category": "g", "actions": a1},
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_snapshots({"tod"})  # evening -> scene 0 wins

    task_a = asyncio.create_task(engine._resolve_and_apply("area", "a", "g"))
    for _ in range(100):  # let A resolve scene 0 and reach its (blocking) action
        if "start0" in events:
            break
        await asyncio.sleep(0)
    assert events == ["start0"], "scene 0's action never started"  # fail fast, don't hang

    tod.value = "morning"  # winner flips to scene 1 while A is still applying
    await engine._refresh_snapshots({"tod"})
    task_b = asyncio.create_task(engine._resolve_and_apply("area", "a", "g"))
    for _ in range(5):  # B makes no progress: it is queued on the unit lock
        await asyncio.sleep(0)
    assert events == ["start0"]

    gate.set()  # let scene 0 finish; B may now proceed
    await asyncio.gather(task_a, task_b)

    assert events == ["start0", "end0", "start1", "end1"]


class RecordingCondition:
    """Records the ``entities`` hint passed to snapshot()."""

    def __init__(self, spec: TriggerSpec) -> None:
        self._spec = spec
        self.received: Any = "UNSET"

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec

    async def snapshot(self, hass: Any, *, now=None, entities=None) -> Any:
        self.received = entities
        return {}

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot

    def describe(self, snapshot: Any, predicate=None) -> str | None:
        return None


async def test_refresh_snapshots_passes_referenced_entities(hass) -> None:
    """The engine snapshots each condition with the entities its scenes reference
    (unioned across scopes), so sensor-backed conditions can target instead of
    scanning their whole domain."""
    scopes = [
        ("area", "a", {"scenes": [{"when": {"rec": {"sensors": ["sensor.x"]}}, "actions": []}]}),
        ("area", "b", {"scenes": [{"when": {"rec": {"sensors": ["sensor.y"]}}, "actions": []}]}),
    ]

    # The engine must union referenced entities across both scopes' predicates, so
    # derive each predicate's entities from its own `sensors` list.
    def _deps(predicate):
        return TriggerSpec(entities=frozenset(predicate.get("sensors", [])))

    rec = RecordingCondition(TriggerSpec())
    rec.trigger_deps = _deps  # type: ignore[method-assign]
    engine = _engine(hass, scopes, {"rec": rec})
    engine.async_rebuild()
    await engine._refresh_all_snapshots()
    assert rec.received == frozenset({"sensor.x", "sensor.y"})


class SpyCondition:
    """Counts snapshot() calls — to prove unfired conditions aren't re-snapshotted."""

    def __init__(self, deps: TriggerSpec) -> None:
        self._deps = deps
        self.snapshot_calls = 0

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._deps

    async def snapshot(self, hass: Any, **_) -> Any:
        self.snapshot_calls += 1
        return {}

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return False

    def describe(self, snapshot: Any, predicate=None) -> str | None:
        return None


async def test_evaluate_does_not_refresh_unfired_conditions(hass) -> None:
    # The gating invariant: firing the 'tod' predicate must not re-snapshot the
    # (expensive/opaque) 'script' condition, even though both are indexed and the
    # tod flip triggers a scope resolve.
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    script = SpyCondition(TriggerSpec(entities=frozenset({"sensor.y"}), opaque=True))
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"tod": "evening", "script": {"script": "script.s"}}, "actions": []}
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod, "script": script},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine.async_evaluate({("area", "a", 0, "tod")})  # fire ONLY the tod predicate
    assert script.snapshot_calls == 0


class StateReadCondition:
    """A condition whose snapshot reads binary_sensor.x's state from hass."""

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(entities=frozenset({"binary_sensor.x"}))

    async def snapshot(self, hass: Any, **_) -> Any:
        state = hass.states.get("binary_sensor.x")
        return state.state if state else None

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any, predicate=None) -> str | None:
        return snapshot


def _live_engine(hass) -> AutoTriggerEngine:
    """Engine: area 'a', scene0 (with one exposed action) fires when
    binary_sensor.x == 'on'. Switch on."""
    act = _light_action(hass)
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": act}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": StateReadCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine


async def test_state_change_fires_and_applies(hass) -> None:
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    engine.async_subscribe()
    await engine.async_initial_sync()  # x=off, scene needs "on" -> no match -> no apply
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})

    hass.states.async_set("binary_sensor.x", "on")
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_teardown_stops_reacting(hass) -> None:
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    engine.async_subscribe()
    await engine.async_initial_sync()
    engine._teardown()
    hass.states.async_set("binary_sensor.x", "on")
    await hass.async_block_till_done()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_unrelated_entity_change_is_ignored(hass) -> None:
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    engine.async_subscribe()
    await engine.async_initial_sync()
    hass.states.async_set("binary_sensor.other", "on")  # not watched
    await hass.async_block_till_done()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_has_time_tick_fires(hass) -> None:
    calls: list = []

    class HasTimeCondition:
        def trigger_deps(self, predicate):
            return TriggerSpec(entities=frozenset(), has_time=True)

        async def snapshot(self, hass, **_):
            return "v"

        def matches(self, predicate, snapshot):
            calls.append(1)
            return True

        def describe(self, snapshot, predicate=None):
            return None

    scopes = [("area", "a", {"scenes": [{"when": {"tmpl": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tmpl": HasTimeCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    await engine.async_initial_sync()
    calls.clear()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=61))
    await hass.async_block_till_done()
    assert calls  # the has_time predicate was recomputed on the tick
    engine._teardown()


async def test_sun_event_scheduled_when_sun_available(hass) -> None:
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=2)).isoformat()},
    )

    class SunDepCondition:
        def trigger_deps(self, predicate):
            return TriggerSpec(sun_events=frozenset({("sunset", 0)}))

        async def snapshot(self, hass, **_):
            return "v"

        def matches(self, predicate, snapshot):
            return True

        def describe(self, snapshot, predicate=None):
            return None

    scopes = [("area", "a", {"scenes": [{"when": {"sun": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"sun": SunDepCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()  # must not raise; schedules the sunset point-in-time
    assert engine._sun_unsubs  # the sunset point-in-time was scheduled
    engine._teardown()
    assert engine._sun_unsubs == {}  # teardown cancels sun handles too


async def test_for_recheck_scheduled_on_state_change(hass) -> None:
    hass.states.async_set("binary_sensor.x", "off")

    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": GateCondition("binary_sensor.x", 600.0)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    await engine.async_initial_sync()
    hass.states.async_set("binary_sensor.x", "on")
    await hass.async_block_till_done()
    key = ("area", "a", 0, "x")
    assert key in engine._for_handles  # a +600s recheck was scheduled for the for: predicate
    engine._teardown()


# ---------------------------------------------------------------------------
# Predicate tenure: the engine records instant-flips, seeds from anchors at
# startup, prunes dead gates in place, and injects a live tenure view into the
# snapshot cache so `for:` clocks off predicate tenure.
# ---------------------------------------------------------------------------


def _gate_engine(hass, seconds: float = 600.0) -> AutoTriggerEngine:
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": GateCondition("binary_sensor.x", seconds)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine


async def test_recompute_records_tenure_on_flip_and_clears_on_drop(hass) -> None:
    engine = _gate_engine(hass)
    key = ("area", "a", 0, "x")
    now = dt_util.utcnow()
    # Instant true → tenure recorded at ~now (live flip, not seeded).
    engine._recompute(
        {key}, {"x": _GateSnap(value="on", changed=now - timedelta(minutes=5), now=now)}
    )
    since = engine.tenure["x"]["gate:binary_sensor.x"]
    assert abs((dt_util.utcnow() - since).total_seconds()) < 2  # ~now, NOT 5m ago
    # Instant false → tenure dropped.
    engine._recompute({key}, {"x": _GateSnap(value="off", changed=now, now=now)})
    assert "gate:binary_sensor.x" not in engine.tenure["x"]


async def test_recompute_seed_mode_uses_anchor(hass) -> None:
    engine = _gate_engine(hass)
    key = ("area", "a", 0, "x")
    now = dt_util.utcnow()
    anchor = now - timedelta(minutes=5)
    engine._recompute({key}, {"x": _GateSnap(value="on", changed=anchor, now=now)}, seed=True)
    # Seeded from the anchor (last_changed), not now.
    assert engine.tenure["x"]["gate:binary_sensor.x"] == anchor
    engine._teardown()  # cancel the recheck timer _recompute armed


async def test_recompute_keeps_existing_since_across_reseeds(hass) -> None:
    engine = _gate_engine(hass)
    key = ("area", "a", 0, "x")
    now = dt_util.utcnow()
    first_anchor = now - timedelta(minutes=5)
    engine._recompute({key}, {"x": _GateSnap(value="on", changed=first_anchor, now=now)}, seed=True)
    # A later seed with a newer anchor must NOT overwrite an existing entry.
    engine._recompute({key}, {"x": _GateSnap(value="on", changed=now, now=now)}, seed=True)
    assert engine.tenure["x"]["gate:binary_sensor.x"] == first_anchor
    engine._teardown()  # cancel the recheck timer _recompute armed


async def test_rebuild_prunes_dead_gate_keys_in_place(hass) -> None:
    engine = _gate_engine(hass)
    tenure_obj = engine.tenure.setdefault("x", {})
    tenure_obj["gate:binary_sensor.x"] = dt_util.utcnow()
    tenure_obj["gate:stale"] = dt_util.utcnow()  # no longer in the index
    engine.async_rebuild()
    # Same dict object (in-place prune so attached snapshots keep their ref)...
    assert engine.tenure["x"] is tenure_obj
    # ...with the dead fingerprint dropped, the live one kept.
    assert "gate:stale" not in tenure_obj
    assert "gate:binary_sensor.x" in tenure_obj


async def test_refresh_snapshots_attaches_live_tenure_view(hass) -> None:
    hass.states.async_set("binary_sensor.x", "on")
    engine = _gate_engine(hass)
    await engine._refresh_snapshots({"x"})
    snap = engine._snapshots["x"]
    # The snapshot's tenure IS the engine's inner dict (shared by reference).
    assert snap.tenure is engine.tenure["x"]


async def test_zone_hop_does_not_reset_tenure_end_to_end(hass) -> None:
    """End-to-end with the real PeopleCondition: a person moving zone.a → zone.b
    while a 'nobody home for 30m' window is open must NOT reset the tenure — the
    recorded `since` is unchanged across the two evaluations (the headline bug)."""
    from custom_components.ambience.conditions.people import PeopleCondition

    pred = {"quant": "nobody", "where": "home", "for": {"h": 0, "m": 30, "s": 0}}
    scopes = [
        ("area", "a", {"scenes": [{"when": {"people": pred}, "category": "g", "actions": []}]})
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"people": PeopleCondition(hass)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    key = ("area", "a", 0, "people")
    gate_key = PeopleCondition._gate_key(pred)

    # Bob is in zone.a (away from home).
    hass.states.async_set("person.bob", "ZoneA", {"in_zones": ["zone.a"]})
    await engine.async_evaluate({key})
    since_before = engine.tenure["people"][gate_key]

    # Bob hops zone.a → zone.b (still not home). 'nobody home' held throughout.
    hass.states.async_set("person.bob", "ZoneB", {"in_zones": ["zone.b"]})
    await engine.async_evaluate({key})
    since_after = engine.tenure["people"][gate_key]

    assert since_after == since_before  # clock did NOT reset on the zone hop
    engine._teardown()


async def test_recompute_gated_key_with_none_snapshot_skips_tenure(hass) -> None:
    """A gated predicate whose snapshot failed (None) must not touch tenure, but
    still counts toward the recheck re-arm pass."""
    engine = _gate_engine(hass)
    key = ("area", "a", 0, "x")
    dirty = engine._recompute({key}, {"x": None})
    assert "x" not in engine.tenure or engine.tenure["x"] == {}
    # None snapshot → predicate evaluates False; first-seen so it flips.
    assert dirty == {("area", "a", "g")}
    engine._teardown()


async def test_update_tenure_skips_condition_without_gate_states(hass) -> None:
    """A duration-gated condition lacking gate_states (defensive) is skipped."""

    class _NoGateStates:
        def trigger_deps(self, predicate):
            return TriggerSpec(
                entities=frozenset({"binary_sensor.x"}),
                duration_gates=frozenset({DurationGate(key="k", seconds=60.0, label="x")}),
            )

        def matches(self, predicate, snap):
            return True

    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": _NoGateStates()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    key = ("area", "a", 0, "x")
    engine._recompute({key}, {"x": "on"})  # must not raise; tenure stays empty
    assert engine.tenure.get("x", {}) == {}
    engine._teardown()


async def test_update_tenure_swallows_gate_states_error(hass) -> None:
    """A gate_states that raises is logged and skipped (mirrors the match policy)."""

    class _BoomGateStates(GateCondition):
        def gate_states(self, predicate, snap):
            raise RuntimeError("boom")

    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    cond = _BoomGateStates("binary_sensor.x", 60.0)
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": cond},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    key = ("area", "a", 0, "x")
    now = dt_util.utcnow()
    engine._recompute({key}, {"x": _GateSnap(value="on", changed=now, now=now)})
    assert engine.tenure.get("x", {}) == {}  # nothing recorded
    engine._teardown()


async def test_async_start_builds_subscribes_and_syncs(hass) -> None:
    hass.states.async_set("binary_sensor.x", "on")
    act = _light_action(hass)
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": act}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": StateReadCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    await engine.async_start()  # build + subscribe + initial sync
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0
    assert engine.index.entities == frozenset({"binary_sensor.x"})
    engine.async_shutdown()
    assert engine._unsubs == []


async def test_switch_off_to_on_force_resyncs(hass) -> None:
    hass.states.async_set("binary_sensor.x", "on")
    act = _light_action(hass)
    switch = SimpleNamespace(is_on=True, entity_id="switch.ambience_a")
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": act}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": StateReadCondition()},
        DATA_SWITCHES: {("area", "a"): switch},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    await engine.async_initial_sync()  # applies scene 0
    # Seed a WRONG last_applied: only a force-resync (which bypasses the
    # unchanged-winner guard) will correct it back to 0.
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 99
    hass.states.async_set("switch.ambience_a", "off")
    hass.states.async_set("switch.ambience_a", "on")  # off->on transition
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0  # force-resync ran
    engine._teardown()


async def test_initial_sync_skips_scene_with_unregistered_condition(hass) -> None:
    # A scene whose `when` names a condition that isn't registered (e.g. a stale
    # config key) cannot be evaluated, so the engine must NOT auto-apply it.
    scopes = [("area", "a", {"scenes": [{"when": {"nonexistent": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine.async_initial_sync()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_rebuild_prunes_stale_predicate_state(hass) -> None:
    engine = _engine_with_state(hass)  # area a, scene0 {tod: evening}
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # seed flip-state for the key
    assert key in engine._predicate_state
    # Rebuild over a store where that scope now has no scenes.
    hass.data[DOMAIN][DATA_STORE] = FakeStore([("area", "a", {"scenes": []})])
    engine.async_rebuild()
    assert key not in engine._predicate_state  # stale key pruned


async def test_config_refresh_is_debounced(hass) -> None:
    # Two rapid refresh requests coalesce into a single rebuild+sync.
    spy = SpyCondition(TriggerSpec(entities=frozenset({"sensor.y"})))
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": spy},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    await engine.async_request_refresh()
    await engine.async_request_refresh()  # within cooldown → coalesced
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert spy.snapshot_calls == 1  # exactly one refresh ran, not two
    engine.async_shutdown()


def _exposed_store_with(*service_ids):
    return ExposedActionsStore(
        _FakeExposedStorage(
            [{"id": sid, "label": "", "visible_fields": [], "defaults": {}} for sid in service_ids]
        )
    )


async def test_state_change_emits_trace_event_to_sink(hass) -> None:
    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event):
            captured.append(event)

    # Use the same setup as _live_engine / test_state_change_fires_and_applies:
    # area 'a', scene0 fires when binary_sensor.x == 'on', switch on.
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    # Install the capture sink BEFORE subscribing so it is present at emit time.
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    engine.async_subscribe()
    await engine.async_initial_sync()  # x=off -> no match, no apply

    trace_logger = logging.getLogger("custom_components.ambience.trace")
    trace_logger.setLevel(logging.DEBUG)
    try:
        # Flip the sensor so scene0 wins and the engine ACTs.
        hass.states.async_set("binary_sensor.x", "on")
        await hass.async_block_till_done()

        assert captured, "expected a TraceEvent to be emitted"
        event = captured[-1]
        assert event.cause.kind == "entity"
        assert any(u.outcome == "acted" for u in event.units)
    finally:
        trace_logger.setLevel(logging.NOTSET)


# ---------------------------------------------------------------------------
# Lines 159, 163 — _category_for: None-scope and out-of-range scene_index
# ---------------------------------------------------------------------------


async def test_category_for_returns_none_for_unknown_scope(hass) -> None:
    """Line 159: _category_for returns None when the scope is not in _scope_cfgs."""
    engine = _engine_with_state(hass)  # only has ("area", "a")
    result = engine._category_for("area", "ghost", 0)
    assert result is None


async def test_category_for_returns_none_for_out_of_range_scene(hass) -> None:
    """Line 163: _category_for returns None when scene_index >= len(scenes)."""
    engine = _engine_with_state(hass)  # area "a" has exactly 1 scene (index 0)
    result = engine._category_for("area", "a", 99)
    assert result is None


# ---------------------------------------------------------------------------
# Line 180 — _recompute: condition key present in fired predicate but
#             missing from the conditions registry → skip without crashing
# ---------------------------------------------------------------------------


async def test_recompute_missing_condition_key_is_skipped(hass) -> None:
    """Line 180: a predicate whose condition key is not in DATA_CONDITIONS is skipped."""
    # Build engine with scope that has a 'tod' predicate but clear conditions.
    engine = _engine_with_state(hass)
    # Wipe conditions so 'tod' is no longer registered.
    hass.data[DOMAIN][DATA_CONDITIONS] = {}
    key = ("area", "a", 0, "tod")
    dirty = engine._recompute({key}, {"tod": "evening"})
    assert dirty == set()
    assert key not in engine._predicate_state


# ---------------------------------------------------------------------------
# Lines 197, 200-202 — _refresh_snapshots: condition absent / snapshot raises
# ---------------------------------------------------------------------------


async def test_refresh_snapshots_skips_unknown_condition_key(hass) -> None:
    """Line 197: condition key absent from DATA_CONDITIONS → no crash, no entry."""
    engine = _engine_with_state(hass)
    # 'nonexistent' is not in conditions; should be silently skipped.
    await engine._refresh_snapshots({"nonexistent"})
    assert "nonexistent" not in engine._snapshots


async def test_refresh_snapshots_stores_none_on_snapshot_exception(hass) -> None:
    """Lines 200-202: snapshot() raises → warning logged, snapshot stored as None."""

    class BrokenCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(entities=frozenset())

        async def snapshot(self, hass: Any, **_) -> Any:
            raise RuntimeError("simulated snapshot failure")

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return False

    scopes = [("area", "a", {"scenes": [{"when": {"bad": "p"}, "category": "g"}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"bad": BrokenCondition()},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_snapshots({"bad"})
    # The exception must have been caught and None stored.
    assert "bad" in engine._snapshots
    assert engine._snapshots["bad"] is None


# ---------------------------------------------------------------------------
# Line 217 — _resolve_and_apply: switch off AND tracing active → UnitTrace
# ---------------------------------------------------------------------------


async def test_resolve_and_apply_returns_unit_trace_when_switch_off_and_tracing(hass) -> None:
    """Line 217: switch is off and tracing is active → returns a SKIPPED_SWITCH_OFF UnitTrace."""
    from custom_components.ambience.trace import Outcome

    engine, _tod = _apply_engine(hass, switch_on=False)
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
        assert result is not None
        assert result.outcome == Outcome.SKIPPED_SWITCH_OFF
        assert result.scope_kind == "area"
        assert result.scope_id == "a"
        assert result.category == "g"
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


# ---------------------------------------------------------------------------
# _resolve_and_apply: disabled scope AND tracing active → SKIPPED_SCOPE_DISABLED
# ---------------------------------------------------------------------------


async def test_disabled_scope_skips_with_trace(hass) -> None:
    """Disabled scope (switch still on) and tracing active → SKIPPED_SCOPE_DISABLED."""
    from custom_components.ambience.trace import Outcome

    engine, _tod = _apply_engine(hass, switch_on=True)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", "a", False)
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
        assert result is not None
        assert result.outcome is Outcome.SKIPPED_SCOPE_DISABLED
        assert result.scope_kind == "area"
        assert result.scope_id == "a"
        assert result.category == "g"
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_disabled_scope_returns_none_without_trace(hass) -> None:
    """Line 247: disabled scope and tracing NOT active → silent skip (None)."""
    engine, _tod = _apply_engine(hass, switch_on=True)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", "a", False)
    # Pin tracing inactive (logger below DEBUG) so active=False regardless of any
    # ancestor logger level — the disabled-scope-with-trace sibling sets DEBUG.
    trace_logger = logging.getLogger("custom_components.ambience.trace")
    original_level = trace_logger.level
    trace_logger.setLevel(logging.WARNING)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
    finally:
        trace_logger.setLevel(original_level)
    assert result is None


# ---------------------------------------------------------------------------
# Line 239 — _resolve_and_apply: no match AND tracing active → NO_MATCH UnitTrace
# ---------------------------------------------------------------------------


async def test_resolve_and_apply_returns_no_match_trace_when_no_scene_matches(hass) -> None:
    """Line 239: no scene matches (index is None) and tracing active → NO_MATCH UnitTrace."""
    from custom_components.ambience.trace import Outcome

    # tod condition returns "afternoon"; neither scene matches (they need "evening"/"morning").
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "afternoon")
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"tod": "evening"}, "category": "g", "actions": []},
                    {"when": {"tod": "morning"}, "category": "g", "actions": []},
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    # Seed a snapshot so resolution sees "afternoon".
    engine._snapshots = {"tod": "afternoon"}
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
        assert result is not None
        assert result.outcome == Outcome.NO_MATCH
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


# ---------------------------------------------------------------------------
# _resolve_and_apply: a winner unchanged since last apply (and with actions) is
# DEBOUNCED — its identical actions are suppressed, distinct from a no-action
# (blocker) winner, which is NO_OP.
# ---------------------------------------------------------------------------


async def test_resolve_and_apply_returns_debounced_trace_when_winner_unchanged(hass) -> None:
    """Winner == last-applied, has actions, tracing active → DEBOUNCED UnitTrace
    (the identical re-fire is suppressed)."""
    from custom_components.ambience.trace import Outcome

    engine, _tod = _apply_engine(hass)
    # tod="evening" → scene 0 wins; mark scene 0 as already applied.
    engine._snapshots = {"tod": "evening"}
    hass.data[DOMAIN].setdefault(DATA_LAST_APPLIED, {})[("area", "a", "g")] = 0
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
        assert result is not None
        assert result.outcome == Outcome.DEBOUNCED
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_resolve_and_apply_no_match_clears_last_applied(hass) -> None:
    """A no-match drops the unit's last-applied, so a later win of the *same*
    scene re-applies instead of being suppressed."""
    engine, tod = _apply_engine(hass)
    await engine.async_initial_sync()  # tod="evening" → scene 0 applied
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0
    tod.value = "afternoon"  # neither scene matches now
    engine._snapshots = {"tod": "afternoon"}
    await engine._resolve_and_apply("area", "a", "g")
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_resolve_and_apply_no_action_winner_is_no_op_transparent_to_last_applied(
    hass,
) -> None:
    """A winner with no actions (a pure blocker) is NO_OP and leaves last-applied
    untouched — it neither records itself nor clears a prior real winner."""
    from custom_components.ambience.trace import Outcome

    blocker = {"when": {"tod": "evening"}, "category": "g", "actions": []}
    tod = CacheCondition(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "a", {"scenes": [blocker]})]),
        DATA_CONDITIONS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {("area", "a", "g"): 5},  # a prior real winner
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine._snapshots = {"tod": "evening"}
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g")
        assert result is not None
        assert result.outcome == Outcome.NO_OP
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    # The blocker did not overwrite or clear the prior real winner.
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 5


async def test_resolve_and_apply_returns_none_when_winner_unchanged_and_tracing_inactive(
    hass,
) -> None:
    """Line 254: winner == last-applied, not forced, tracing inactive → returns None."""
    engine, _tod = _apply_engine(hass)
    # tod="evening" → scene 0 wins; mark scene 0 as already applied.
    engine._snapshots = {"tod": "evening"}
    hass.data[DOMAIN].setdefault(DATA_LAST_APPLIED, {})[("area", "a", "g")] = 0
    # Force tracing OFF. We can't rely on the default logger level: under the HA
    # test harness (notably in CI) the ambience trace logger inherits DEBUG, so
    # `tracing_active` would return True. Patch it to isolate the inactive path.
    with patch("custom_components.ambience.trigger_engine.tracing_active", return_value=False):
        result = await engine._resolve_and_apply("area", "a", "g")
    assert result is None


# ---------------------------------------------------------------------------
# Line 286 — _apply_units: exception from _resolve_and_apply → warning logged
# ---------------------------------------------------------------------------


async def test_apply_units_logs_warning_on_exception(hass) -> None:
    """Line 286: if _resolve_and_apply raises, the exception is logged as a warning
    rather than propagating, and other units are still processed."""
    engine, _tod = _apply_engine(hass)
    call_count = 0

    async def _exploding(scope_kind, scope_id, category_id, *, force=False, cause=None):
        nonlocal call_count
        call_count += 1
        raise RuntimeError("boom")

    engine._resolve_and_apply = _exploding  # type: ignore[assignment]

    # Must not raise — the warning branch silently absorbs the exception.
    traces = await engine._apply_units([("area", "a", "g")])
    assert traces == []
    assert call_count == 1


# ---------------------------------------------------------------------------
# Line 296 — async_evaluate: empty fired set → early return, no snapshots taken
# ---------------------------------------------------------------------------


async def test_evaluate_empty_fired_set_returns_immediately(hass) -> None:
    """Line 296: async_evaluate with an empty fired set returns without doing work."""
    engine, tod = _apply_engine(hass)
    await engine.async_initial_sync()
    # Mark a sentinel so we can detect any unwanted side-effect.
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 99
    await engine.async_evaluate(set())  # empty → early return
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 99  # untouched


# ---------------------------------------------------------------------------
# Line 335 — async_initial_sync: startup trace emitted when tracing is active
# ---------------------------------------------------------------------------


async def test_initial_sync_emits_startup_trace_when_tracing_active(hass) -> None:
    """Line 335: when tracing is active and there are units to apply, async_initial_sync
    emits a STARTUP TraceEvent."""
    from custom_components.ambience.trace import CauseKind

    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    engine, _tod = _apply_engine(hass)
    # tod="evening" → scene 0 wins; engine hasn't applied anything yet.
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        await engine.async_initial_sync()
        assert captured, "expected a STARTUP TraceEvent"
        event = captured[-1]
        assert event.cause.kind == CauseKind.STARTUP
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_note_config_changed_accumulates_pending(hass) -> None:
    engine = _engine(hass, [], {})
    engine.note_config_changed(("area", "a"))
    engine.note_config_changed(("floor", "f"))
    assert engine._pending_affected == {("area", "a"), ("floor", "f")}
    assert engine._pending_all is False
    # A global change upgrades the batch to "reapply all".
    engine.note_config_changed(None)
    assert engine._pending_all is True


async def test_units_for_orders_scopes_deterministically(hass) -> None:
    # A set has no stable iteration order; _units_for must sort so trace/apply
    # ordering doesn't vary run to run (house's None scope_id must not break the sort).
    scene = {"category": "g", "when": {}, "actions": []}
    scopes = [
        ("area", "c", {"scenes": [scene]}),
        ("area", "a", {"scenes": [scene]}),
        ("floor", "b", {"scenes": [scene]}),
        ("house", None, {"scenes": [scene]}),
    ]
    engine = _engine(hass, scopes, {})
    engine.async_rebuild()
    units = engine._units_for({("area", "c"), ("floor", "b"), ("area", "a"), ("house", None)})
    assert [(kind, sid) for (kind, sid, _cid) in units] == [
        ("area", "a"),
        ("area", "c"),
        ("floor", "b"),
        ("house", None),
    ]


class _Capture:
    def __init__(self) -> None:
        self.events: list[TraceEvent] = []

    def emit(self, event: TraceEvent) -> None:
        self.events.append(event)


async def test_initial_sync_still_emits_startup_cause(hass) -> None:
    from custom_components.ambience.trace import CauseKind

    engine, _tod = _apply_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        await engine.async_initial_sync()
        assert cap.events[-1].cause.kind == CauseKind.STARTUP
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_global_refresh_emits_reloaded_cause(hass) -> None:
    from custom_components.ambience.trace import CauseKind

    engine, _tod = _apply_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine.note_config_changed(None)  # global
        await engine._async_refresh()
        assert cap.events[-1].cause.kind == CauseKind.RELOADED
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


def _two_area_engine(hass):
    """Two areas, each with one always-matching action scene; switches on."""

    def scene():
        return {
            "when": {},
            "category": "g",
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.x"], "params": {}}],
        }

    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(
            [
                ("area", "a", {"scenes": [scene()]}),
                ("area", "b", {"scenes": [scene()]}),
            ]
        ),
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_SWITCHES: {
            ("area", "a"): SimpleNamespace(is_on=True),
            ("area", "b"): SimpleNamespace(is_on=True),
        },
        DATA_LAST_APPLIED: {},
        DATA_TRACE_SINKS: [],
    }
    hass.services.async_register("light", "turn_on", lambda call: None)
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    return engine


async def test_scope_local_refresh_applies_only_that_scope(hass) -> None:
    engine = _two_area_engine(hass)
    cap = _Capture()
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [cap]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine.note_config_changed(("area", "a"))  # only area a changed
        await engine._async_refresh()
        units = {(u.scope_kind, u.scope_id) for ev in cap.events for u in ev.units}
        assert units == {("area", "a")}  # area b not re-applied
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


async def test_scope_local_refresh_reapplies_unchanged_winner(hass) -> None:
    """A scope-local refresh force-applies, so an edited scene whose winning index
    is unchanged still re-fires (last-applied tracks the index, not the content)."""
    engine = _two_area_engine(hass)
    # Both areas already at their current winner; without force every unit would
    # be DEBOUNCED, so any service call proves the scope-local refresh forced.
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 0
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "b", "g")] = 0
    calls: list = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    engine.note_config_changed(("area", "a"))
    await engine._async_refresh()
    assert calls, "force-applied scope a should have re-fired its action"


async def test_recompute_contains_matches_exception(hass, caplog) -> None:
    """One raising predicate must not kill the whole fire-and-forget evaluate
    task — treat it as False (mirroring the snapshot-failure policy) and keep
    evaluating the other fired predicates."""

    class BoomCondition:
        def trigger_deps(self, predicate):
            return TriggerSpec(entities=frozenset({"sensor.boom"}))

        def matches(self, predicate, snapshot):
            raise ValueError("malformed predicate")

    class OkCondition:
        def trigger_deps(self, predicate):
            return TriggerSpec(entities=frozenset({"sensor.ok"}))

        def matches(self, predicate, snapshot):
            return True

    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {"when": {"boom": "p"}, "category": "g"},
                    {"when": {"ok": "q"}, "category": "g2"},
                ]
            },
        )
    ]
    engine = _engine(hass, scopes, {"boom": BoomCondition(), "ok": OkCondition()})
    engine.async_rebuild()
    fired = {("area", "a", 0, "boom"), ("area", "a", 1, "ok")}
    dirty = engine._recompute(fired, {"boom": "snap", "ok": "snap"})
    assert ("area", "a", "g2") in dirty  # the healthy predicate still evaluates
    assert engine._predicate_state[("area", "a", 0, "boom")] is False
    assert "match failed" in caplog.text


async def test_sync_applies_units_flipped_by_seeding_recompute(hass) -> None:
    """A flip consumed by _sync's seeding recompute (it runs over ALL
    predicates and discards the result) must still be applied even when its
    unit isn't in the passed list — otherwise a flip landing during the
    debounce window for an unaffected scope is silently lost."""
    from unittest.mock import AsyncMock

    from custom_components.ambience.trace import CauseKind, TriggerCause

    scopes = [
        ("area", "a", {"scenes": [{"when": {"state": "x"}, "category": "g"}]}),
        ("area", "b", {"scenes": [{"when": {"state": "y"}, "category": "h"}]}),
    ]
    conditions = {"state": DepsCondition(TriggerSpec(entities=frozenset({"sensor.a"})))}
    engine = _engine(hass, scopes, conditions)
    engine.async_rebuild()

    applied: list = []

    async def fake_apply(units, *, force=False, cause=None):
        applied.append((list(units), force))
        return []

    with (
        patch.object(engine, "_apply_units", side_effect=fake_apply),
        patch.object(engine, "_refresh_all_snapshots", new=AsyncMock()),
        patch.object(engine, "_recompute", return_value={("area", "b", "h")}),
        patch.object(engine, "_schedule_for_rechecks"),
    ):
        await engine._sync([("area", "a", "g")], TriggerCause(kind=CauseKind.RELOADED), force=True)

    forced = {u: force for units, force in applied for u in units}
    assert forced.get(("area", "a", "g")) is True  # the requested unit keeps force
    assert forced.get(("area", "b", "h")) is False  # the seeded flip is applied, unforced


# ---------------------------------------------------------------------------
# Idle-reapply: per-unit one-shot timers in the engine
# ---------------------------------------------------------------------------


def _reapply_hass_data(reapply, *, last_applied=True, switches=None):
    scene = {
        "when": {},
        "category": "g",
        "name": "Evening",
        "actions": [
            {
                "service": "light.turn_on",
                "entity_ids": ["light.a"],
                "params": {"brightness": 7},
            }
        ],
    }
    return {
        DATA_STORE: FakeStore([("area", "k", {"scenes": [scene]})], reapply=reapply),
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0} if last_applied else {},
        DATA_SWITCHES: switches or {},
    }


async def test_idle_reapply_force_redispatches_unchanged_winner(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()  # arms the idle timer for the applied unit
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert len(calls) == 1 and calls[0]["brightness"] == 7
    eng._teardown()


async def test_idle_reapply_rearms_after_firing(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    # The re-arm closes through SIGNAL_UNIT_APPLIED: a forced dispatch in
    # _reapply_due re-emits it via async_execute_plan, which (once connected to
    # note_unit_applied — done in __init__ at setup) re-arms the timer. This
    # engine-only test stands in for that wiring so the self-perpetuating loop
    # can be exercised in isolation.
    eng.async_rebuild()
    async_dispatcher_connect(hass, SIGNAL_UNIT_APPLIED, eng.note_unit_applied)
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=120))
    await hass.async_block_till_done()
    assert len(calls) == 2  # re-armed by its own dispatch
    eng._teardown()


async def test_idle_reapply_rearm_cancels_prior_timer(hass):
    # A second note_unit_applied before the first timer fires must cancel the
    # already-armed timer and replace it (covers the `old is not None` branch in
    # _arm_reapply_timer). Only the latest timer survives, so exactly one dispatch
    # happens at the interval.
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()  # arms the applied unit once
    unit = ("area", "k", "g")
    first = eng._reapply_timers[unit]
    eng.note_unit_applied(unit)  # re-arm: cancels `first`, installs a new timer
    assert eng._reapply_timers[unit] is not first
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert len(calls) == 1
    eng._teardown()


async def test_idle_reapply_disabled_does_not_fire(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": False, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=600))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_skips_when_switch_off(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data(
        {"enabled": True, "interval_seconds": 60},
        switches={("area", "k"): SimpleNamespace(is_on=False)},
    )
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_skips_when_scope_disabled(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    await hass.data[DOMAIN][DATA_STORE].async_set_scope_enabled("area", "k", False)
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_config_disable_cancels_timer(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    # operator turns the feature off; engine handler cancels armed timers
    eng._store()._reapply = {"enabled": False, "interval_seconds": 60}
    eng.note_reapply_config_changed(None)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_idle_reapply_enable_via_config_arms_timer(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": False, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()  # disabled at start → arms nothing
    eng._store()._reapply = {"enabled": True, "interval_seconds": 60}
    eng.note_reapply_config_changed(None)  # enable → arms the already-applied unit
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
    await hass.async_block_till_done()
    assert len(calls) == 1
    eng._teardown()


async def test_idle_reapply_due_callback_noop_after_teardown(hass):
    # Covers the `if self._running` guard in the one-shot callback: a timer whose
    # callback was already queued when teardown ran must not start an apply.
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    due = eng._make_reapply_due(("area", "k", "g"), 60)
    eng._teardown()  # sets _running False
    due(None)  # must not raise and must not create a task
    await hass.async_block_till_done()


async def test_idle_reapply_emits_reapply_trace(hass):
    captured = []

    class CaptureSink:
        def emit(self, event):
            captured.append(event)

    hass.services.async_register("light", "turn_on", lambda call: None)
    hass.data[DOMAIN] = _reapply_hass_data({"enabled": True, "interval_seconds": 60})
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        eng = AutoTriggerEngine(hass)
        eng.async_rebuild()
        eng.async_subscribe()
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=60))
        await hass.async_block_till_done()
        assert any(e.cause.kind == "reapply" for e in captured)
        eng._teardown()
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)


# ---------------------------------------------------------------------------
# Drop-out suppression: an entity going unavailable/unknown must NOT trigger a
# scene change. The engine recomputes but skips applying, recording
# Outcome.SKIPPED_UNAVAILABLE.
# ---------------------------------------------------------------------------


async def test_dropout_to_unavailable_is_suppressed(hass) -> None:
    """Cause = entity → unavailable: skip applying, record SKIPPED_UNAVAILABLE."""
    from custom_components.ambience.trace import CauseKind, Outcome, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    cause = TriggerCause(kind=CauseKind.ENTITY, entity_id="binary_sensor.x", new="unavailable")
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
        assert result is not None
        assert result.outcome == Outcome.SKIPPED_UNAVAILABLE
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_dropout_to_unknown_is_suppressed(hass) -> None:
    """Cause = entity → unknown: skip applying, record SKIPPED_UNAVAILABLE."""
    from custom_components.ambience.trace import CauseKind, Outcome, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    cause = TriggerCause(kind=CauseKind.ENTITY, entity_id="binary_sensor.x", new="unknown")
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
        assert result is not None
        assert result.outcome == Outcome.SKIPPED_UNAVAILABLE
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_dropout_to_removed_entity_is_suppressed(hass) -> None:
    """Cause = entity removed entirely (cause.new is None): also a drop-out —
    the `unavailable` condition counts an absent entity as unavailable, so the
    engine must not re-apply on removal either."""
    from custom_components.ambience.trace import CauseKind, Outcome, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    cause = TriggerCause(kind=CauseKind.ENTITY, entity_id="binary_sensor.x", old="off", new=None)
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
        assert result is not None
        assert result.outcome == Outcome.SKIPPED_UNAVAILABLE
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_dropout_returns_none_when_tracing_inactive(hass) -> None:
    """Drop-out suppression with tracing OFF returns None (no UnitTrace built)."""
    from custom_components.ambience.trace import CauseKind, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    cause = TriggerCause(kind=CauseKind.ENTITY, entity_id="binary_sensor.x", new="unavailable")
    # Pin the trace logger below DEBUG so tracing_active is False (no buffer is
    # registered by _apply_engine either) — the suppression path returns None.
    trace_logger = logging.getLogger("custom_components.ambience.trace")
    original_level = trace_logger.level
    trace_logger.setLevel(logging.WARNING)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
    finally:
        trace_logger.setLevel(original_level)
    assert result is None
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_dropout_runs_an_unavailable_guard_with_actions(hass) -> None:
    """On a drop-out, an `unavailable`-guard winner still ACTS (its actions run);
    only a non-guard fall-through winner is suppressed. 'Run just the blocker.'"""
    from custom_components.ambience.conditions.unavailable import UnavailableCondition
    from custom_components.ambience.trace import CauseKind, Outcome, TriggerCause

    hass.states.async_set("binary_sensor.x", "unavailable")
    act = _light_action(hass)
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {
                        "when": {"unavailable": {"entities": ["binary_sensor.x"]}},
                        "category": "g",
                        "actions": act,
                    },
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"unavailable": UnavailableCondition(hass=hass)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_all_snapshots()
    cause = TriggerCause(
        kind=CauseKind.ENTITY, entity_id="binary_sensor.x", old="off", new="unavailable"
    )
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
        assert result is not None
        assert result.outcome == Outcome.ACTED
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_dropout_suppresses_a_non_guard_fall_through_winner(hass) -> None:
    """On a drop-out, a winner that does NOT carry an `unavailable` predicate is
    still suppressed (a sensor blip must not drive an unrelated scene)."""
    from custom_components.ambience.trace import CauseKind, Outcome, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    engine._snapshots = {"tod": "evening"}  # scene 0 (tod=evening, no unavailable) would win
    cause = TriggerCause(kind=CauseKind.ENTITY, entity_id="binary_sensor.x", new="unavailable")
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        result = await engine._resolve_and_apply("area", "a", "g", cause=cause)
        assert result is not None
        assert result.outcome == Outcome.SKIPPED_UNAVAILABLE
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    assert ("area", "a", "g") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


def test_winner_has_unavailable_guard_detection(hass) -> None:
    """`_winner_has_unavailable` is True only for a winner whose `when` carries a
    non-wildcard `unavailable` predicate; False for no winner, an unknown scope,
    an out-of-range index (config drift between rebuild and resolve), or a
    non-guard winner."""
    engine = AutoTriggerEngine(hass)
    engine._scope_cfgs = {
        ("area", "a"): {
            "scenes": [
                {"when": {"unavailable": {"entities": ["binary_sensor.x"]}}, "category": "g"},
                {"when": {"tod": "evening"}, "category": "g"},
            ]
        }
    }
    assert engine._winner_has_unavailable("area", "a", 0) is True  # the guard
    assert engine._winner_has_unavailable("area", "a", 1) is False  # non-guard winner
    assert engine._winner_has_unavailable("area", "a", None) is False  # no winner
    assert engine._winner_has_unavailable("area", "ghost", 0) is False  # scope gone (cfg None)
    assert engine._winner_has_unavailable("area", "a", 9) is False  # index out of range


async def test_recovery_from_unavailable_is_not_suppressed(hass) -> None:
    """Cause = entity → a real state: evaluates and applies normally."""
    from custom_components.ambience.trace import CauseKind, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    engine._snapshots = {"tod": "evening"}  # scene 0 wins
    cause = TriggerCause(
        kind=CauseKind.ENTITY, entity_id="binary_sensor.x", old="unavailable", new="off"
    )
    await engine._resolve_and_apply("area", "a", "g", cause=cause)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_non_entity_cause_not_suppressed(hass) -> None:
    """A clock-driven change with an unavailable entity elsewhere is not a drop-out."""
    from custom_components.ambience.trace import CauseKind, TriggerCause

    engine, _tod = _apply_engine(hass, switch_on=True)
    engine._snapshots = {"tod": "evening"}
    cause = TriggerCause(kind=CauseKind.CLOCK, detail="20:00")
    await engine._resolve_and_apply("area", "a", "g", cause=cause)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_no_cause_not_suppressed(hass) -> None:
    """Back-compat: a direct call with no cause applies normally."""
    engine, _tod = _apply_engine(hass, switch_on=True)
    engine._snapshots = {"tod": "evening"}
    await engine._resolve_and_apply("area", "a", "g")
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


# ---------------------------------------------------------------------------
# Integration: `unavailable` guard blocks a lower scene on a non-dropout tick.
# A pinned `unavailable` guard (no actions) wins on a clock tick and prevents
# the lower time scene from applying — proving A+B combine correctly.
# ---------------------------------------------------------------------------


async def test_unavailable_guard_blocks_lower_scene_on_clock_tick(hass) -> None:
    """While a sensor is unavailable, a pinned `unavailable` guard (no actions)
    wins on a clock tick and blocks the lower time scene from applying."""
    from custom_components.ambience.conditions.unavailable import UnavailableCondition
    from custom_components.ambience.trace import CauseKind, TriggerCause

    hass.states.async_set("binary_sensor.x", "unavailable")
    tod = CacheCondition(TriggerSpec(entities=frozenset()), "evening")
    act = _light_action(hass)
    scopes = [
        (
            "area",
            "a",
            {
                "scenes": [
                    {
                        "when": {"unavailable": {"entities": ["binary_sensor.x"]}},
                        "category": "g",
                        "actions": [],
                    },
                    {"when": {"tod": "evening"}, "category": "g", "actions": act},
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"tod": tod, "unavailable": UnavailableCondition(hass=hass)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine._refresh_all_snapshots()
    cause = TriggerCause(kind=CauseKind.CLOCK, detail="20:00")
    await engine._resolve_and_apply("area", "a", "g", cause=cause)
    # The guard (scene 0, no actions) won -> a no-op that stays transparent to
    # last-applied: nothing is recorded, and the lower time scene (index 1)
    # never applies.
    assert ("area", "a", "g") not in hass.data[DOMAIN][DATA_LAST_APPLIED]


# ---------------------------------------------------------------------------
# `for_mode: "less_than"` end-to-end through the trigger machinery — regression
# guard that the trigger/auto-re-evaluation layer needs NO changes for the new
# mode. The gate, its tenure clock, and the single one-shot recheck timer armed
# at `since + seconds` are identical to the at_least case; only the duration
# verdict (tenure_within vs tenure_held) differs, and that lives entirely in the
# condition's `matches`, not in trigger_subscriptions.py / triggers.py.
# ---------------------------------------------------------------------------


class LessThanGateCondition(GateCondition):
    """A `for: ... for_mode: less_than` mirror of GateCondition. Identical gate
    fingerprint, snapshot, and gate_states (so the engine arms the SAME recheck
    timer) — only the duration verdict is inverted: matches while the instant
    test has held for LESS than `seconds` (boundary exclusive), exactly as the
    real StateCondition does for an atom with for_mode == "less_than"."""

    def matches(self, predicate: Any, snap: _GateSnap) -> bool:
        if snap.value != predicate:
            return False
        if snap.tenure is None:
            return True  # legacy: no engine tenure → instant value match
        return tenure_within(snap.tenure, self._key, snap.now, self._seconds)


def _less_than_engine(hass, seconds: float) -> AutoTriggerEngine:
    """Engine: area 'a', scene0 (with one exposed action) fires when
    binary_sensor.x == 'on' AND has been on for LESS than `seconds`. Switch on.
    A win sets DATA_LAST_APPLIED[("area","a","g")] = 0 (active); no win leaves it
    absent (inactive) — the same activation signal as test_state_change_fires."""
    act = _light_action(hass)
    scopes = [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": act}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": LessThanGateCondition("binary_sensor.x", seconds)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine


async def test_less_than_activates_immediately_then_deactivates_at_maturity(hass, freezer) -> None:
    """`for: 5m`, `for_mode: less_than` STATE atom, end-to-end, with ZERO trigger
    machinery changes:

      1. binary_sensor.x flips on → the predicate becomes active RIGHT AWAY
         (elapsed ~0 < 5m), recorded as the winning scene — well before the 5m
         timer. This is the watched state-change event flipping the instant test
         true; tenure_within reads true at ~0 elapsed.
      2. The SAME one-shot recheck timer that at_least uses (armed at
         `since + 5m`) fires; advancing the clock past the threshold fires it →
         the predicate is now FALSE (elapsed ≥ 5m → tenure_within false), and the
         winning scene is withdrawn (last-applied cleared).

    The `freezer` fixture (pytest-freezer, pulled in by
    pytest-homeassistant-custom-component) freezes the clock so the engine's
    tenure `since`, the snapshot's `now`, and the armed recheck timer all advance
    together when we tick forward — exactly how real wall-clock time would pass
    between the state change and maturity."""
    seconds = 300.0  # for: {m: 5}
    last_applied_key = ("area", "a", "g")
    pred_key = ("area", "a", 0, "x")

    hass.states.async_set("binary_sensor.x", "off")
    engine = _less_than_engine(hass, seconds)
    engine.async_subscribe()
    await engine.async_initial_sync()  # x=off → no match → not active
    assert last_applied_key not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})

    # (1) Activates immediately: the watched entity enters the desired state.
    hass.states.async_set("binary_sensor.x", "on")
    await hass.async_block_till_done()
    # The less_than predicate is active right away (elapsed ~0 < 5m) — the
    # winning scene applied. This is well before the 5-minute timer.
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][last_applied_key] == 0

    # A single recheck timer was armed at since + 5m — the EXACT same
    # mechanism at_least uses (no less_than-specific arming).
    assert pred_key in engine._for_handles
    assert len(engine._for_handles[pred_key]) == 1  # one gate, one one-shot

    # (2) Deactivates at maturity: advance the frozen clock past the 5m threshold
    # and let the armed timer fire. The duration verdict flips (elapsed ≥ 5m →
    # tenure_within false) and the winning scene is withdrawn.
    freezer.tick(timedelta(seconds=seconds + 1))
    async_fire_time_changed(hass, dt_util.utcnow())
    await hass.async_block_till_done()
    assert last_applied_key not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})

    engine._teardown()
