"""Characterization tests for trigger_subscriptions.TriggerSubscriptionsMixin.

Covers the subscription/timer plumbing layer only — no source changes.
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime, timedelta
from types import SimpleNamespace
from typing import Any
from unittest.mock import MagicMock, patch

from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions._common import tenure_held
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_SINKS,
    DOMAIN,
)
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.trace import CauseKind, TraceEvent
from custom_components.ambience.trigger_engine import AutoTriggerEngine
from custom_components.ambience.triggers import DurationGate, TriggerSpec


@dataclass(frozen=True)
class _ForSnap:
    """Gate-aware fake snapshot (mirrors the real condition snapshots so
    `attach_tenure`/`dataclasses.replace` work)."""

    value: str | None
    changed: Any = None
    now: Any = None
    tenure: Mapping[str, datetime] | None = None


def _gate(entity_id: str, seconds: float) -> DurationGate:
    return DurationGate(
        key=f"gate:{entity_id}", seconds=seconds, label=entity_id, entity_id=entity_id
    )

# ---------------------------------------------------------------------------
# Shared test doubles (from test_trigger_engine.py patterns)
# ---------------------------------------------------------------------------


class FakeStore:
    """Minimal store: scope configs and scope getters."""

    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        categories: list[dict] | None = None,
    ) -> None:
        self._scopes = scopes
        self._by_key = {(kind, sid): cfg for kind, sid, cfg in scopes}
        self._categories = categories or []
        self._scope_enabled: dict[tuple[str, str | None], bool] = {}

    def get_scope_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        return self._scope_enabled.get((scope_kind, scope_id), True)

    async def async_set_scope_enabled(
        self, scope_kind: str, scope_id: str | None, enabled: bool
    ) -> None:
        self._scope_enabled[(scope_kind, scope_id)] = enabled

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return list(self._scopes)

    def categories(self) -> list[dict]:
        return list(self._categories)

    def get_area(self, area_id: str) -> dict | None:
        return self._by_key.get(("area", area_id))

    def get_floor(self, floor_id: str) -> dict | None:
        return self._by_key.get(("floor", floor_id))

    def get_house(self) -> dict:
        return self._by_key.get(("house", None), {"scenes": []})


class _FakeExposedStorage:
    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions: list[dict] = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


def _exposed_store_with(*service_ids):
    return ExposedActionsStore(
        _FakeExposedStorage(
            [{"id": sid, "label": "", "visible_fields": [], "defaults": {}} for sid in service_ids]
        )
    )


class SimpleEntityCondition:
    """Condition that watches a fixed entity; matches when snapshot == predicate."""

    def __init__(self, entity_id: str) -> None:
        self._entity_id = entity_id

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(entities=frozenset({self._entity_id}))

    async def snapshot(self, hass: Any) -> Any:
        state = hass.states.get(self._entity_id)
        return state.state if state else None

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any, predicate=None) -> str | None:
        return snapshot


def _minimal_engine(hass, scopes, conditions=None, switches=None, last_applied=None):
    """Build a minimal engine with given scopes and conditions."""
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: conditions or {},
        DATA_SWITCHES: switches or {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    if last_applied is not None:
        hass.data[DOMAIN][DATA_LAST_APPLIED] = last_applied
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine


# ---------------------------------------------------------------------------
# _fire: empty-set guard (line 59->exit)
# ---------------------------------------------------------------------------


async def test_fire_does_nothing_when_fired_set_is_empty(hass) -> None:
    """_fire() must not schedule a task when the set of predicates is empty."""
    engine = _minimal_engine(hass, [])
    evaluate_calls: list = []

    async def spy_evaluate(fired, cause=None):
        evaluate_calls.append(fired)

    engine.async_evaluate = spy_evaluate  # type: ignore[method-assign]
    engine._fire(set())
    await hass.async_block_till_done()
    # async_evaluate was never called because fired was empty.
    assert evaluate_calls == []


# ---------------------------------------------------------------------------
# async_subscribe: no-entity path (line 86) and midnight path (line 99)
# ---------------------------------------------------------------------------


async def test_subscribe_skips_entity_subscription_when_no_entities(hass) -> None:
    """When the index has no entity deps, no state-change sub is registered."""
    engine = _minimal_engine(hass, [])
    engine.async_subscribe()
    # _unsubs contains only non-entity subscriptions; with an empty index that means
    # nothing at all was added.
    assert engine._unsubs == []
    engine._teardown()


async def test_subscribe_registers_clock_time_subscription(hass) -> None:
    """A clock_times entry in the index creates an async_track_time_change subscription."""

    class ClockCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(clock_times=frozenset({(9, 0)}))

        async def snapshot(self, hass: Any) -> Any:
            return "v"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return True

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return None

    scopes = [("area", "a", {"scenes": [{"when": {"clk": "x"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"clk": ClockCondition()},
        DATA_SWITCHES: {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    assert (9, 0) in engine._index.clock_times
    engine.async_subscribe()
    # One subscription for the clock time was added.
    assert len(engine._unsubs) == 1
    engine._teardown()
    assert engine._unsubs == []


async def test_subscribe_registers_midnight_when_index_has_midnight(hass) -> None:
    """Midnight clock subscription is created when the index carries midnight preds."""

    # Inject midnight directly into the built index via a spec with date_rollover=True
    class MidnightCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(entities=frozenset(), date_rollover=True)

        async def snapshot(self, hass: Any) -> Any:
            return "v"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return True

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return None

    scopes = [("area", "a", {"scenes": [{"when": {"mid": "x"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"mid": MidnightCondition()},
        DATA_SWITCHES: {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    assert engine._index.midnight  # confirmed: midnight pred in index
    engine.async_subscribe()
    # One subscription for midnight was added (only subscription — no entity dep).
    assert len(engine._unsubs) == 1
    engine._teardown()
    assert engine._unsubs == []


# ---------------------------------------------------------------------------
# _on_state_event: no-pred early return (line 149)
# ---------------------------------------------------------------------------


async def test_on_state_event_ignores_entity_not_in_index(hass) -> None:
    """_on_state_event returns early when the entity isn't in the current index."""
    from homeassistant.core import Event, EventOrigin

    engine = _minimal_engine(
        hass,
        [("area", "a", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})],
        conditions={"x": SimpleEntityCondition("binary_sensor.x")},
        switches={("area", "a"): SimpleNamespace(is_on=True)},
        last_applied={},
    )

    fired_keys: list = []
    original_fire = engine._fire

    def spy_fire(fired_set, cause=None):
        fired_keys.append(fired_set)
        original_fire(fired_set, cause)

    engine._fire = spy_fire  # type: ignore[method-assign]

    # Craft a state-change event for an entity that is NOT in by_entity.
    fake_event = Event(
        "state_changed",
        {"entity_id": "binary_sensor.not_in_index", "old_state": None, "new_state": None},
        origin=EventOrigin.local,
    )
    # Call _on_state_event directly; it must exit before calling _fire.
    engine._on_state_event(fake_event)
    assert fired_keys == []


# ---------------------------------------------------------------------------
# _reapply_scope: cfg is None guard (line 202)
# ---------------------------------------------------------------------------


async def test_reapply_scope_skips_when_scope_config_is_missing(hass) -> None:
    """_reapply_scope must return early if the scope config isn't found."""
    calls: list = []
    hass.services.async_register("light", "turn_on", lambda c: calls.append(c))
    action = {
        "service": "light.turn_on",
        "entity_ids": ["light.a"],
        "params": {},
        "reapply_seconds": 10,
    }
    scene = {"when": {}, "category": "g", "actions": [action]}
    # Build an engine for area "k", then tamper: remove the scope config so
    # _reapply_scope will not find it.
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"scenes": [scene]})]),
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        DATA_SWITCHES: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    # Directly remove the scope config to exercise the cfg-is-None branch.
    engine._scope_cfgs.pop(("area", "k"), None)

    await engine._reapply_scope(("area", "k"), 10)
    # No action was fired because cfg lookup returned None.
    assert calls == []


async def test_disabled_scope_skips_reapply(hass) -> None:
    """_reapply_scope must return early when the scope is disabled (switch ON)."""
    calls: list = []
    hass.services.async_register("light", "turn_on", lambda c: calls.append(c))
    action = {
        "service": "light.turn_on",
        "entity_ids": ["light.a"],
        "params": {},
        "reapply_seconds": 10,
    }
    scene = {"when": {}, "category": "g", "actions": [action]}
    store = FakeStore([("area", "k", {"scenes": [scene]})])
    hass.data[DOMAIN] = {
        DATA_STORE: store,
        DATA_CONDITIONS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        # Switch left ON so only the disabled gate can prevent the reapply.
        DATA_SWITCHES: {("area", "k"): SimpleNamespace(is_on=True)},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    # Disable the scope while leaving the switch on.
    await store.async_set_scope_enabled("area", "k", False)

    await engine._reapply_scope(("area", "k"), 10)
    # No action was fired because the scope is disabled.
    assert calls == []


# ---------------------------------------------------------------------------
# _schedule_for_rechecks: predicate has no durations (line 251)
# ---------------------------------------------------------------------------


async def test_schedule_for_rechecks_cancels_existing_handles(hass) -> None:
    """Existing for-recheck handles for a key must be cancelled before new ones are set."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g"}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    # Inject a gate directly into the index, and seed its tenure so the gate is
    # pending (instant true, not yet matured) — the precondition for arming.
    from custom_components.ambience.trigger_index import TriggerIndex

    gate = _gate("binary_sensor.x", 10.0)
    engine._index = TriggerIndex(
        by_entity={"binary_sensor.x": frozenset({key})},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key: frozenset({gate})},
        opaque=frozenset(),
    )
    engine._tenure["fc"] = {gate.key: dt_util.utcnow()}  # just became true → ~10s pending

    # Plant an existing cancel handle, keyed by its (gate_key, seconds) pair.
    cancelled: list[bool] = []
    fake_cancel = MagicMock(side_effect=lambda: cancelled.append(True))
    engine._for_handles[key] = {(gate.key, 10.0): fake_cancel}

    fake_unsub = MagicMock()
    with patch.object(_ts_mod, "async_call_later", return_value=fake_unsub):
        engine._schedule_for_rechecks(frozenset({key}))

    # Old handle was cancelled before rescheduling.
    assert cancelled == [True]
    # New handle was registered under its (gate_key, seconds) pair.
    assert key in engine._for_handles
    assert engine._for_handles[key] == {(gate.key, 10.0): fake_unsub}


async def test_schedule_for_rechecks_skips_pred_without_durations(hass) -> None:
    """Predicates with no for-durations must be silently skipped."""

    class NoDurationCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(entities=frozenset({"binary_sensor.x"}))  # no durations

        async def snapshot(self, hass: Any) -> Any:
            return "v"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return True

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return None

    scopes = [("area", "a", {"scenes": [{"when": {"nd": "x"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"nd": NoDurationCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "nd")
    # The pred exists in the index but carries no durations entry.
    assert key not in engine._index.durations
    # Directly call _schedule_for_rechecks — no subscription needed, no timers created.
    engine._schedule_for_rechecks(frozenset({key}))
    # Nothing was scheduled (the `if not durations: continue` branch was taken).
    assert engine._for_handles == {}


# ---------------------------------------------------------------------------
# _make_for_recheck callback (lines 260-261)
# ---------------------------------------------------------------------------


async def test_for_recheck_callback_fires_and_clears_handle(hass) -> None:
    """When the for-recheck timer fires, it removes its own handle and fires the
    pred. It does NOT self-re-arm — re-arming happens inside the evaluation the
    fire triggers (which refreshes snapshots and updates tenure first)."""
    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"fc": _ForCondition("binary_sensor.x", 30.0)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    gate = _gate("binary_sensor.x", 30.0)
    # Plant a fake cancel handle (keyed by its (gate_key, seconds) pair).
    fake_cancel = MagicMock()
    engine._for_handles[key] = {(gate.key, 30.0): fake_cancel}

    import custom_components.ambience.trigger_subscriptions as _ts_mod

    with patch.object(_ts_mod, "async_call_later", return_value=MagicMock()):
        recheck_cb = engine._make_for_recheck(key, gate)
        recheck_cb(None)  # invoke as if the timer fired

    # The consumed handle is dropped (not cancelled), and — since it was the only
    # one — the whole key is removed. No self-re-arm here.
    fake_cancel.assert_not_called()
    assert key not in engine._for_handles


async def test_for_recheck_callback_schedules_evaluate(hass) -> None:
    """The for-recheck callback fires a DURATION evaluation for the key, naming
    the entity and how long it has held its state."""
    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"fc": _ForCondition("binary_sensor.x", 300.0)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    gate = _gate("binary_sensor.x", 300.0)
    fired_keys: list = []

    # Spy on _fire to confirm it receives the correct pred key with DURATION cause.
    original_fire = engine._fire

    def spy_fire(fired_set, cause=None):
        fired_keys.append((set(fired_set), cause))
        original_fire(fired_set, cause)

    engine._fire = spy_fire  # type: ignore[method-assign]

    hass.states.async_set("binary_sensor.x", "on")
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    recheck_cb = engine._make_for_recheck(key, gate)
    with patch.object(_ts_mod, "async_call_later", return_value=MagicMock()):
        recheck_cb(None)
        # The fire spawns an evaluate task that re-arms; drain it under the mock
        # so no real timer lingers, then tear down.
        await hass.async_block_till_done()

    assert any(key in f for f, _cause in fired_keys)
    duration_causes = [c for _f, c in fired_keys if c is not None and c.kind == CauseKind.DURATION]
    assert duration_causes, "expected a DURATION cause"
    cause = duration_causes[0]
    assert cause.entity_id == "binary_sensor.x"
    assert cause.new == "on"  # the held state, read at recheck time
    assert cause.detail == "5m"  # 300s humanised (compact, matching occupancy/people traces)
    engine._teardown()


async def test_for_recheck_fire_does_not_orphan_sibling_timers(hass) -> None:
    """A predicate with several (entity, seconds) rechecks arms one timer each.
    When one fires it must drop ONLY its own handle, leaving siblings tracked so
    a later state change (or teardown) can still cancel them — otherwise stale
    rechecks fire long after the triggering state changed."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod
    from custom_components.ambience.trigger_index import TriggerIndex

    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g"}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    gate_x = _gate("binary_sensor.x", 30.0)
    gate_y = _gate("binary_sensor.y", 60.0)
    # Two gates on the same predicate, both pending (tenure seeded just now).
    engine._index = TriggerIndex(
        by_entity={"binary_sensor.x": frozenset({key}), "binary_sensor.y": frozenset({key})},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key: frozenset({gate_x, gate_y})},
        opaque=frozenset(),
    )
    now = dt_util.utcnow()
    engine._tenure["fc"] = {gate_x.key: now, gate_y.key: now}

    captured: list = []  # (seconds, callback)

    def fake_call_later(_hass, seconds, cb):
        captured.append((seconds, cb))
        return MagicMock(name=f"cancel-{seconds}")

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        engine._schedule_for_rechecks(frozenset({key}))

        assert len(captured) == 2
        assert len(engine._for_handles[key]) == 2

        # Fire the first timer's callback (whichever gate it was for).
        captured[0][1](None)

    # The fired timer drops ONLY its own handle (no self-re-arm); the sibling
    # stays tracked and cancellable — no handle is orphaned.
    assert key in engine._for_handles
    assert len(engine._for_handles[key]) == 1
    remaining = set(engine._for_handles[key])
    assert remaining < {(gate_x.key, 30.0), (gate_y.key, 60.0)}


# ---------------------------------------------------------------------------
# Startup / reload sync must (re)arm `for:` rechecks for entities already
# in-state — otherwise a "switch on for 2h" rule whose timer was armed before a
# restart/reconfigure is silently dropped and only re-evaluates when some
# unrelated event happens to wake the category. (radiator-left-on bug.)
# ---------------------------------------------------------------------------


class _ForCondition:
    """Condition with one predicate-level `for:` gate over one entity. Seeds
    tenure from the entity's last_changed; matches off engine tenure when
    attached, else the instant value."""

    def __init__(self, entity_id: str, seconds: float) -> None:
        self._entity_id = entity_id
        self._seconds = seconds
        self._key = f"gate:{entity_id}"

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(
            entities=frozenset({self._entity_id}),
            duration_gates=frozenset({_gate(self._entity_id, self._seconds)}),
        )

    async def snapshot(self, hass: Any, entities: Any = None) -> _ForSnap:
        state = hass.states.get(self._entity_id)
        return _ForSnap(
            value=state.state if state else None,
            changed=state.last_changed if state else None,
            now=dt_util.utcnow(),
        )

    def gate_states(self, predicate: Any, snap: _ForSnap) -> dict[str, tuple[bool, Any]]:
        anchor = snap.changed if snap.changed is not None else snap.now
        return {self._key: (snap.value == predicate, anchor)}

    def matches(self, predicate: Any, snap: _ForSnap) -> bool:
        if snap.value != predicate:
            return False
        if snap.tenure is None:
            return True
        return tenure_held(snap.tenure, self._key, snap.now, self._seconds)

    def describe(self, snap: _ForSnap, predicate=None) -> str | None:
        return snap.value


def _for_engine(hass, seconds: float):
    scopes = [("area", "a", {"scenes": [{"when": {"rad": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"rad": _ForCondition("switch.radiator", seconds)},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
        DATA_LAST_APPLIED: {},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    return engine


def _age_switch_state(hass, monkeypatch, age: timedelta) -> None:
    """Set switch.radiator on, then pin dt_util.utcnow() `age` past the state's
    real last_updated so the engine sees the switch as having been on that long.
    (hass.states.get is read-only, so we move the clock rather than the state.)"""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    hass.states.async_set("switch.radiator", "on")
    last_updated = hass.states.get("switch.radiator").last_updated
    monkeypatch.setattr(_ts_mod.dt_util, "utcnow", lambda: last_updated + age)


async def test_startup_sync_arms_for_recheck_for_remaining_time(hass, monkeypatch) -> None:
    """A `for: 2h` whose switch is ALREADY on at startup gets a recheck armed for
    the REMAINING time (2h minus how long it has been on), not a fresh 2h."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    # Switch has been on for 26 minutes when the integration starts.
    _age_switch_state(hass, monkeypatch, timedelta(minutes=26))
    engine = _for_engine(hass, 7200.0)

    captured: list[float] = []

    def fake_call_later(_hass, seconds, cb):
        captured.append(seconds)
        return MagicMock()

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        await engine.async_initial_sync()

    key = ("area", "a", 0, "rad")
    # A recheck WAS armed (the bug left _for_handles empty here)...
    assert key in engine._for_handles
    # ...for the remaining 2h - 26m = 5640s, not the full 7200s.
    assert captured == [5640.0]
    engine._teardown()


async def test_reload_sync_arms_for_recheck(hass, monkeypatch) -> None:
    """A config reload (RELOADED) must also re-arm `for:` rechecks it tore down."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    _age_switch_state(hass, monkeypatch, timedelta(minutes=10))
    engine = _for_engine(hass, 7200.0)

    captured: list[float] = []

    def fake_call_later(_hass, seconds, cb):
        captured.append(seconds)
        return MagicMock()

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        engine.note_config_changed(None)  # global reload
        await engine._async_refresh()

    key = ("area", "a", 0, "rad")
    assert key in engine._for_handles
    assert captured == [6600.0]  # 7200 - 600
    engine._teardown()


async def test_startup_sync_skips_recheck_when_duration_already_elapsed(hass, monkeypatch) -> None:
    """When the entity has already held its state past the `for:` window, no
    recheck is armed — the sync's immediate evaluation already covers it, and a
    timer for a moment in the past would fire instantly for nothing."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    _age_switch_state(hass, monkeypatch, timedelta(hours=3))  # past the 2h window
    engine = _for_engine(hass, 7200.0)

    captured: list[float] = []

    def fake_call_later(_hass, seconds, cb):
        captured.append(seconds)
        return MagicMock()

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        await engine.async_initial_sync()

    key = ("area", "a", 0, "rad")
    assert captured == []  # nothing armed (delay would be negative)
    assert key not in engine._for_handles
    engine._teardown()


async def test_switch_resync_rearms_for_rechecks(hass, monkeypatch) -> None:
    """A scope switch off→on resync must re-arm the scope's pending `for:`
    rechecks from the live tenure. A duration timer that matured while the switch
    was off was consumed as a no-op, so without re-arming on switch-on the rule
    would never fire again — but the tenure (in-memory) persists, so the re-arm
    uses the original since."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    _age_switch_state(hass, monkeypatch, timedelta(minutes=26))
    engine = _for_engine(hass, 7200.0)
    # Tenure persists across the switch-off window (kept live by state events and
    # the last sync); only the one-shot timer was consumed.
    since = hass.states.get("switch.radiator").last_changed
    engine._tenure["rad"] = {"gate:switch.radiator": since}
    assert engine._for_handles == {}

    captured: list[float] = []

    def fake_call_later(_hass, seconds, cb):
        captured.append(seconds)
        return MagicMock()

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        await engine._force_resync_scope(("area", "a"), "switch.ambience_a")

    key = ("area", "a", 0, "rad")
    assert key in engine._for_handles  # re-armed for the remaining 2h - 26m
    assert captured == [5640.0]
    engine._teardown()


async def test_rearm_scope_rechecks_only_touches_its_own_scope(hass, monkeypatch) -> None:
    """rearm_scope_rechecks (used by switch-on resync and scope re-enable) must
    re-arm only the named scope's pending duration predicates, leaving other
    scopes' live timers untouched."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod
    from custom_components.ambience.trigger_index import TriggerIndex

    _age_switch_state(hass, monkeypatch, timedelta(minutes=26))
    engine = _for_engine(hass, 7200.0)

    key_a = ("area", "a", 0, "rad")
    key_b = ("area", "b", 0, "rad")
    gate = _gate("switch.radiator", 7200.0)
    engine._index = TriggerIndex(
        by_entity={"switch.radiator": frozenset({key_a, key_b})},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key_a: frozenset({gate}), key_b: frozenset({gate})},
        opaque=frozenset(),
    )
    # Both predicates share the gate fingerprint (same entity); seed its tenure.
    engine._tenure["rad"] = {gate.key: hass.states.get("switch.radiator").last_changed}

    armed: list = []

    def fake_call_later(_hass, seconds, cb):
        armed.append(seconds)
        return MagicMock()

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        engine.rearm_scope_rechecks("area", "a")

    assert key_a in engine._for_handles  # only area a re-armed
    assert key_b not in engine._for_handles  # area b untouched
    assert armed == [5640.0]
    engine._teardown()


# ---------------------------------------------------------------------------
# _on_switch_event: new_state is None / not "on" (line 273)
# ---------------------------------------------------------------------------


async def test_on_switch_event_ignores_transition_to_off(hass) -> None:
    """_on_switch_event must not resync when the switch goes to any non-on state."""
    from homeassistant.core import Event, EventOrigin

    switch = SimpleNamespace(is_on=False, entity_id="switch.ambience_a")
    scopes = [("area", "a", {"scenes": [{"when": {}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {("area", "a"): switch},
        DATA_EXPOSED_ACTIONS: _exposed_store_with(),
        DATA_LAST_APPLIED: {("area", "a", "g"): 0},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    # Confirm the switch entity is tracked.
    assert "switch.ambience_a" in engine._switch_scopes

    resync_calls: list = []
    original_resync = engine._force_resync_scope

    async def spy_resync(scope, switch_entity_id=None):
        resync_calls.append(scope)
        await original_resync(scope, switch_entity_id)

    engine._force_resync_scope = spy_resync  # type: ignore[method-assign]

    # Fire a switch event where new_state.state == "off" (NOT "on").
    from homeassistant.core import State

    fake_event = Event(
        "state_changed",
        {
            "entity_id": "switch.ambience_a",
            "old_state": State("switch.ambience_a", "on"),
            "new_state": State("switch.ambience_a", "off"),
        },
        origin=EventOrigin.local,
    )
    engine._on_switch_event(fake_event)
    await hass.async_block_till_done()
    # Resync was NOT called because new_state is "off".
    assert resync_calls == []
    engine._teardown()


# ---------------------------------------------------------------------------
# _on_switch_event: already-on guard (line 275->exit)
# ---------------------------------------------------------------------------


async def test_on_switch_event_ignores_unknown_entity(hass) -> None:
    """_on_switch_event must not resync for an entity not in _switch_scopes."""
    from homeassistant.core import Event, EventOrigin, State

    engine = _minimal_engine(hass, [])
    # _switch_scopes is empty — "switch.unknown" is not mapped to any scope.
    assert engine._switch_scopes == {}

    resync_calls: list = []
    original_resync = engine._force_resync_scope

    async def spy_resync(scope, switch_entity_id=None):
        resync_calls.append(scope)
        await original_resync(scope, switch_entity_id)

    engine._force_resync_scope = spy_resync  # type: ignore[method-assign]

    # Fire an off→on event for a switch not tracked by any scope.
    fake_event = Event(
        "state_changed",
        {
            "entity_id": "switch.unknown",
            "old_state": State("switch.unknown", "off"),
            "new_state": State("switch.unknown", "on"),
        },
        origin=EventOrigin.local,
    )
    engine._on_switch_event(fake_event)
    await hass.async_block_till_done()
    # No resync because scope lookup returned None.
    assert resync_calls == []


async def test_on_switch_event_ignores_on_to_on_transition(hass) -> None:
    """Already-on → on must NOT trigger a resync (not a real transition)."""
    from homeassistant.core import Event, EventOrigin, State

    switch = SimpleNamespace(is_on=True, entity_id="switch.ambience_b")
    scopes = [("area", "b", {"scenes": [{"when": {}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {("area", "b"): switch},
        DATA_EXPOSED_ACTIONS: _exposed_store_with(),
        DATA_LAST_APPLIED: {("area", "b", "g"): 99},
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    assert "switch.ambience_b" in engine._switch_scopes

    resync_calls: list = []
    original_resync = engine._force_resync_scope

    async def spy_resync(scope, switch_entity_id=None):
        resync_calls.append(scope)
        await original_resync(scope, switch_entity_id)

    engine._force_resync_scope = spy_resync  # type: ignore[method-assign]

    # Fire a switch event where BOTH old and new state are "on" (already-on guard).
    fake_event = Event(
        "state_changed",
        {
            "entity_id": "switch.ambience_b",
            "old_state": State("switch.ambience_b", "on"),
            "new_state": State("switch.ambience_b", "on"),
        },
        origin=EventOrigin.local,
    )
    engine._on_switch_event(fake_event)
    await hass.async_block_till_done()
    # Resync was NOT called because old_state was already "on".
    assert resync_calls == []
    # Sentinel is untouched.
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "b", "g")] == 99
    engine._teardown()


# ---------------------------------------------------------------------------
# _force_resync_scope: empty traces path (line 288)
# ---------------------------------------------------------------------------


async def test_force_resync_scope_no_trace_when_no_categories(hass) -> None:
    """_force_resync_scope must not call emit_trace when traces is empty."""
    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    switch = SimpleNamespace(is_on=True, entity_id="switch.ambience_c")
    # Scope has no scenes → no categories → _apply_units returns [] → traces empty.
    scopes = [("area", "c", {"scenes": []})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {("area", "c"): switch},
        DATA_EXPOSED_ACTIONS: _exposed_store_with(),
        DATA_LAST_APPLIED: {},
        DATA_TRACE_SINKS: [CaptureSink()],
    }
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine = AutoTriggerEngine(hass)
        engine.async_rebuild()
        engine.async_subscribe()
        await engine._force_resync_scope(("area", "c"), "switch.ambience_c")
        # No units were processed → emit_trace was never called.
        assert captured == []
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    engine._teardown()


async def test_force_resync_scope_emits_trace_when_scenes_applied(hass) -> None:
    """_force_resync_scope calls emit_trace (line 288) when units were applied."""
    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    hass.states.async_set("binary_sensor.x", "on")
    switch = SimpleNamespace(is_on=True, entity_id="switch.ambience_d")
    scopes = [("area", "d", {"scenes": [{"when": {"x": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"x": SimpleEntityCondition("binary_sensor.x")},
        DATA_SWITCHES: {("area", "d"): switch},
        DATA_EXPOSED_ACTIONS: _exposed_store_with(),
        DATA_LAST_APPLIED: {},
        DATA_TRACE_SINKS: [CaptureSink()],
    }
    logging.getLogger("custom_components.ambience.trace").setLevel(logging.DEBUG)
    try:
        engine = AutoTriggerEngine(hass)
        engine.async_rebuild()
        engine.async_subscribe()
        # Initial sync to seed predicate state.
        await engine.async_initial_sync()
        # Force resync — this should apply the winning scene and emit a trace.
        await engine._force_resync_scope(("area", "d"), "switch.ambience_d")
        switch_events = [e for e in captured if e.cause.kind == CauseKind.SWITCH]
        assert switch_events, "expected a SWITCH trace event from force_resync_scope"
    finally:
        logging.getLogger("custom_components.ambience.trace").setLevel(logging.NOTSET)
    engine._teardown()


# ---------------------------------------------------------------------------
# _next_sun_fire: sun.sun state missing (line 303)
# ---------------------------------------------------------------------------


async def test_next_sun_fire_returns_none_when_sun_state_missing(hass) -> None:
    """_next_sun_fire must return None when sun.sun entity is absent."""
    engine = _minimal_engine(hass, [])
    # Ensure sun.sun is not set.
    assert hass.states.get("sun.sun") is None
    result = engine._next_sun_fire("sunset", 0)
    assert result is None


async def test_next_sun_fire_returns_none_when_attr_missing(hass) -> None:
    """_next_sun_fire returns None when the sun state exists but the attribute is absent."""
    hass.states.async_set("sun.sun", "above_horizon", {})  # no next_setting attribute
    engine = _minimal_engine(hass, [])
    result = engine._next_sun_fire("sunset", 0)
    assert result is None


async def test_next_sun_fire_returns_none_when_anchor_unknown(hass) -> None:
    """_next_sun_fire returns None for an anchor not in ANCHOR_ATTR."""
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=1)).isoformat()},
    )
    engine = _minimal_engine(hass, [])
    result = engine._next_sun_fire("totally_unknown_anchor", 0)
    assert result is None


# ---------------------------------------------------------------------------
# _schedule_sun: fire_at is None guard (line 314)
# ---------------------------------------------------------------------------


async def test_schedule_sun_does_nothing_when_fire_at_is_none(hass) -> None:
    """_schedule_sun must not register a handle when _next_sun_fire returns None."""
    engine = _minimal_engine(hass, [])
    # sun.sun absent → _next_sun_fire returns None → no handle registered.
    assert hass.states.get("sun.sun") is None
    engine._schedule_sun(("sunset", 0))
    assert engine._sun_unsubs == {}


# ---------------------------------------------------------------------------
# _schedule_sun: _handler callback fires preds and re-arms (lines 318-324)
# ---------------------------------------------------------------------------


async def test_schedule_sun_handler_fires_preds_and_reschedules(hass) -> None:
    """When the sun point-in-time fires, it fires predicates and re-arms itself.

    We patch async_track_point_in_time in the trigger_subscriptions module so
    no real wall-clock timer is registered, then invoke the captured handler
    directly to exercise lines 318-324.
    """

    class SunDepCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(sun_events=frozenset({("sunset", 0)}))

        async def snapshot(self, hass: Any) -> Any:
            return "v"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return True

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return None

    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=2)).isoformat()},
    )
    scopes = [("area", "a", {"scenes": [{"when": {"sun": "x"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"sun": SunDepCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    import custom_components.ambience.trigger_subscriptions as _ts_mod

    captured_handlers: list = []
    fake_unsub = MagicMock()

    def fake_atpit(hass_inner, action, point_in_time):
        captured_handlers.append(action)
        return fake_unsub  # return a fake unsubscribe so no real timer is created

    fired_keys: list = []
    original_fire = engine._fire

    def spy_fire(fired_set, cause=None):
        fired_keys.append((set(fired_set), cause))
        original_fire(fired_set, cause)

    engine._fire = spy_fire  # type: ignore[method-assign]

    with patch.object(_ts_mod, "async_track_point_in_time", side_effect=fake_atpit):
        engine.async_subscribe()

        sun_event = ("sunset", 0)
        assert sun_event in engine._sun_unsubs

        # We now have the handler registered during async_subscribe. Invoke it
        # while still inside the patch so re-arming also uses the fake.
        assert captured_handlers, "expected async_subscribe to call async_track_point_in_time"
        handler = captured_handlers[-1]
        handler(None)

        # The handler must have fired the predicates for this sun event.
        sun_cause_kinds = [c.kind for _k, c in fired_keys if c is not None]
        assert CauseKind.SUN in sun_cause_kinds
        # Re-arming calls async_track_point_in_time again (self._schedule_sun).
        assert len(captured_handlers) >= 2

    engine._teardown()


# ---------------------------------------------------------------------------
# _schedule_sun: cancels previous handle when one already exists (line 328)
# ---------------------------------------------------------------------------


async def test_schedule_sun_handler_skips_fire_when_no_preds(hass) -> None:
    """_schedule_sun's _handler must not call _fire when by_sun has no preds for the event."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=2)).isoformat()},
    )
    engine = _minimal_engine(hass, [])

    captured_handlers: list = []
    fake_unsub = MagicMock()

    def fake_atpit(hass_inner, action, point_in_time):
        captured_handlers.append(action)
        return fake_unsub

    fired_keys: list = []
    original_fire = engine._fire

    def spy_fire(fired_set, cause=None):
        fired_keys.append(fired_set)
        original_fire(fired_set, cause)

    engine._fire = spy_fire  # type: ignore[method-assign]

    sun_event = ("sunset", 0)
    # The index has NO sun preds (by_sun is empty).
    assert sun_event not in engine._index.by_sun

    with patch.object(_ts_mod, "async_track_point_in_time", side_effect=fake_atpit):
        engine._schedule_sun(sun_event)

    assert captured_handlers
    handler = captured_handlers[-1]

    # Invoke handler while _ts_mod is still patched for the re-arm call.
    with patch.object(_ts_mod, "async_track_point_in_time", side_effect=fake_atpit):
        handler(None)

    # _fire was NOT called because preds was empty/None.
    assert fired_keys == []


async def test_schedule_sun_cancels_existing_handle_on_rearm(hass) -> None:
    """Rescheduling a sun event must cancel the previous handle."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=2)).isoformat()},
    )
    engine = _minimal_engine(hass, [])

    cancelled: list[bool] = []
    fake_cancel = MagicMock(side_effect=lambda: cancelled.append(True))
    new_fake_unsub = MagicMock()

    sun_event = ("sunset", 0)
    engine._sun_unsubs[sun_event] = fake_cancel  # inject an existing handle

    with patch.object(_ts_mod, "async_track_point_in_time", return_value=new_fake_unsub):
        engine._schedule_sun(sun_event)

    # The old handle must have been called (cancelled).
    assert cancelled == [True]
    # A new handle must be in place.
    assert sun_event in engine._sun_unsubs
    assert engine._sun_unsubs[sun_event] is not fake_cancel
    engine._teardown()


# ---------------------------------------------------------------------------
# _next_sun_fire: negative offsets must not arm a past time (busy-spin)
# ---------------------------------------------------------------------------


async def test_next_sun_fire_negative_offset_past_falls_forward_to_anchor(hass) -> None:
    """With a negative offset, once the offset moment has fired, sun.sun's
    next_* attribute hasn't rolled over yet — re-arming at the (past) offset
    time would fire on the next loop iteration and spin until the anchor
    advances. The next fire must fall forward to just after the un-offset
    anchor instead."""
    anchor = dt_util.utcnow() + timedelta(minutes=10)
    hass.states.async_set("sun.sun", "above_horizon", {"next_setting": anchor.isoformat()})
    engine = _minimal_engine(hass, [])
    result = engine._next_sun_fire("sunset", -30)  # offset moment is 20m in the past
    assert result == anchor + timedelta(seconds=1)


async def test_next_sun_fire_stale_anchor_polls_instead_of_past(hass) -> None:
    """If even the anchor itself is in the past (attribute-update race), poll
    again shortly rather than arming a past time."""
    anchor = dt_util.utcnow() - timedelta(minutes=5)
    hass.states.async_set("sun.sun", "above_horizon", {"next_setting": anchor.isoformat()})
    engine = _minimal_engine(hass, [])
    result = engine._next_sun_fire("sunset", 0)
    assert result is not None
    assert result > dt_util.utcnow()


# ---------------------------------------------------------------------------
# _schedule_for_rechecks: arms off gate tenure (since + seconds)
# ---------------------------------------------------------------------------


def _index_with_gate(key, gate):
    from custom_components.ambience.trigger_index import TriggerIndex

    return TriggerIndex(
        by_entity={gate.entity_id: frozenset({key})} if gate.entity_id else {},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key: frozenset({gate})},
        opaque=frozenset(),
    )


async def test_schedule_for_rechecks_arms_remaining_tenure(hass) -> None:
    """A pending gate (instant true, not matured) arms for since+seconds minus
    elapsed — e.g. recorded 60s ago with a 100s gate → ~40s remaining."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    engine = _minimal_engine(hass, [])
    key = ("area", "a", 0, "state")
    gate = _gate("sensor.x", 100.0)
    engine._index = _index_with_gate(key, gate)
    now = dt_util.utcnow()
    engine._tenure["state"] = {gate.key: now - timedelta(seconds=60)}

    captured: list[float] = []
    with patch.object(
        _ts_mod, "async_call_later", side_effect=lambda _h, s, _cb: captured.append(s) or MagicMock()
    ):
        engine._schedule_for_rechecks([key])
    assert len(captured) == 1 and abs(captured[0] - 40.0) < 1.0
    engine._teardown()


async def test_schedule_for_rechecks_skips_matured_and_untracked_gates(hass) -> None:
    """A gate already matured (since+seconds in the past) and a gate with no
    tenure entry (instant test currently false) both arm no timer."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    engine = _minimal_engine(hass, [])
    matured = ("area", "a", 0, "state")
    untracked = ("area", "b", 0, "state")
    g_matured = _gate("sensor.x", 100.0)
    g_untracked = _gate("sensor.y", 100.0)
    from custom_components.ambience.trigger_index import TriggerIndex

    engine._index = TriggerIndex(
        by_entity={},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={matured: frozenset({g_matured}), untracked: frozenset({g_untracked})},
        opaque=frozenset(),
    )
    now = dt_util.utcnow()
    # matured gate's window has fully elapsed; untracked gate has no tenure.
    engine._tenure["state"] = {g_matured.key: now - timedelta(seconds=200)}

    captured: list[float] = []
    with patch.object(
        _ts_mod, "async_call_later", side_effect=lambda _h, s, _cb: captured.append(s) or MagicMock()
    ):
        engine._schedule_for_rechecks([matured, untracked])
    assert captured == []
    assert engine._for_handles == {}


async def test_attribute_churn_does_not_move_the_recheck(hass) -> None:
    """An attribute-only update fires an evaluation; the gate's instant stays
    true, so its tenure `since` is untouched and the re-armed delay still targets
    the ORIGINAL since+seconds (replaces the old last_changed/last_updated
    dual-clock heuristic)."""
    import custom_components.ambience.trigger_subscriptions as _ts_mod

    engine = _minimal_engine(hass, [])
    key = ("area", "a", 0, "state")
    gate = _gate("person.alice", 100.0)
    engine._index = _index_with_gate(key, gate)
    now = dt_util.utcnow()
    # Tenure recorded 60s ago (the predicate became true then).
    engine._tenure["state"] = {gate.key: now - timedelta(seconds=60)}

    captured: list[float] = []
    with patch.object(
        _ts_mod, "async_call_later", side_effect=lambda _h, s, _cb: captured.append(s) or MagicMock()
    ):
        # Re-arming after an attribute churn (tenure unchanged) → same ~40s.
        engine._schedule_for_rechecks([key])
        engine._schedule_for_rechecks([key])  # a second churn must not push it out
    assert len(captured) == 2
    assert all(abs(s - 40.0) < 1.0 for s in captured)
    engine._teardown()


async def test_recheck_fire_does_not_self_rearm(hass) -> None:
    """The recheck callback fires the predicate but does NOT call
    _schedule_for_rechecks itself — re-arming is the triggered evaluation's job
    (it refreshes snapshots and updates tenure first)."""
    engine = _minimal_engine(hass, [])
    key = ("area", "a", 0, "state")
    recheck = engine._make_for_recheck(key, _gate("sensor.x", 100.0))
    rearmed: list = []
    with (
        patch.object(
            engine, "_schedule_for_rechecks", side_effect=lambda preds: rearmed.append(list(preds))
        ),
        patch.object(engine, "_fire"),
    ):
        recheck(None)
    assert rearmed == []  # no self-re-arm


async def test_recheck_callback_noop_after_teardown(hass) -> None:
    """A recheck timer that fires after teardown must not evaluate."""
    engine = _minimal_engine(hass, [])
    engine._running = False
    recheck = engine._make_for_recheck(("area", "a", 0, "state"), _gate("sensor.x", 100.0))
    fired: list = []
    with patch.object(engine, "_fire", side_effect=lambda *a, **k: fired.append(a)):
        recheck(None)
    assert fired == []  # short-circuited on not self._running


async def test_recheck_cause_names_label_for_multi_entity_gate(hass) -> None:
    """A multi-entity gate (entity_id None) names the gate's label in the
    DURATION cause instead of a single entity/state."""
    engine = _minimal_engine(hass, [])
    key = ("area", "a", 0, "people")
    gate = DurationGate(key="nobody:home:0:*", seconds=1800.0, label="nobody home", entity_id=None)
    fired: list = []
    with patch.object(engine, "_fire", side_effect=lambda f, c=None: fired.append(c)):
        engine._make_for_recheck(key, gate)(None)
    assert len(fired) == 1
    cause = fired[0]
    assert cause.kind == CauseKind.DURATION
    assert cause.entity_id is None
    assert cause.new == "nobody home"
    assert cause.detail == "30m"


async def test_for_recheck_does_not_rearm_for_deleted_entity(hass) -> None:
    """A deleted entity falls back to the full delay in _for_recheck_delay, so
    an unconditional re-arm would fire-and-re-arm forever — the handler must
    stop re-arming once the entity is gone."""
    engine = _minimal_engine(hass, [])  # sensor.x intentionally absent from states
    key = ("area", "a", 0, "state")
    recheck = engine._make_for_recheck(key, "sensor.x", 100.0)
    rearmed: list = []
    with (
        patch.object(
            engine,
            "_schedule_for_rechecks",
            side_effect=lambda preds: rearmed.append(list(preds)),
        ),
        patch.object(engine, "_fire"),
    ):
        recheck(None)
    assert rearmed == []


# ---------------------------------------------------------------------------
# teardown: queued handlers must not fire/re-arm into a dead engine
# ---------------------------------------------------------------------------


async def test_fire_noop_after_teardown(hass) -> None:
    """A handler already queued when teardown runs must not spawn evaluate
    tasks into a dead engine (after unload, hass.data[DOMAIN] is gone)."""
    engine = _minimal_engine(hass, [])
    engine.async_subscribe()
    engine._teardown()
    created: list = []
    with patch.object(hass, "async_create_task", side_effect=lambda c: created.append(c)):
        engine._fire({("area", "a", 0, "state")})
    assert created == []


async def test_schedule_sun_handler_noop_after_teardown(hass) -> None:
    """A sun handler in the loop's ready queue at teardown must not insert a
    fresh live timer into the torn-down engine."""
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {"next_setting": (dt_util.utcnow() + timedelta(hours=2)).isoformat()},
    )
    engine = _minimal_engine(hass, [])
    engine.async_subscribe()

    import custom_components.ambience.trigger_subscriptions as _ts_mod

    captured: list = []

    def fake_atpit(_hass, action, _point):
        captured.append(action)
        return MagicMock()

    with patch.object(_ts_mod, "async_track_point_in_time", side_effect=fake_atpit):
        engine._schedule_sun(("sunset", 0))
    assert len(captured) == 1
    engine._teardown()
    with patch.object(_ts_mod, "async_track_point_in_time", side_effect=fake_atpit):
        captured[0](None)  # the already-queued handler runs after teardown
    assert engine._sun_unsubs == {}
    assert len(captured) == 1  # no re-arm happened
