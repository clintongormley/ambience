"""Characterization tests for trigger_subscriptions.TriggerSubscriptionsMixin.

Covers the subscription/timer plumbing layer only — no source changes.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from types import SimpleNamespace
from typing import Any
from unittest.mock import MagicMock, patch

from homeassistant.util import dt as dt_util

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
from custom_components.ambience.triggers import TriggerSpec

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
    # Inject a duration directly into the index so _schedule_for_rechecks sees it.
    from custom_components.ambience.trigger_index import TriggerIndex

    engine._index = TriggerIndex(
        by_entity={"binary_sensor.x": frozenset({key})},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key: frozenset({("binary_sensor.x", 10.0)})},
        opaque=frozenset(),
    )

    # Plant an existing cancel handle, keyed by its (entity, seconds) pair.
    cancelled: list[bool] = []
    fake_cancel = MagicMock(side_effect=lambda: cancelled.append(True))
    engine._for_handles[key] = {("binary_sensor.x", 10.0): fake_cancel}

    fake_unsub = MagicMock()
    with patch.object(_ts_mod, "async_call_later", return_value=fake_unsub):
        engine._schedule_for_rechecks(frozenset({key}))

    # Old handle was cancelled before rescheduling.
    assert cancelled == [True]
    # New handle was registered under its pair.
    assert key in engine._for_handles
    assert engine._for_handles[key] == {("binary_sensor.x", 10.0): fake_unsub}


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
    """When the for-recheck timer fires, it removes the handle and fires the pred.

    We don't trigger a real state change (which would schedule a live
    async_call_later timer and leave it lingering). Instead we directly call
    _schedule_for_rechecks with a fake handle and then invoke the callback.
    """

    class ForCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(
                entities=frozenset({"binary_sensor.x"}),
                entity_durations=frozenset({("binary_sensor.x", 30.0)}),
            )

        async def snapshot(self, hass: Any) -> Any:
            return "off"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return snapshot == "on"

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return snapshot

    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"fc": ForCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    # Manually plant a fake cancel handle (keyed by its pair) so we can test the
    # self-removal without spawning a real async_call_later timer.
    fake_cancel = MagicMock()
    engine._for_handles[key] = {("binary_sensor.x", 30.0): fake_cancel}

    recheck_cb = engine._make_for_recheck(key, "binary_sensor.x", 30.0)
    recheck_cb(None)  # invoke as if the timer fired

    # After the only timer fires, the key is cleared from _for_handles.
    assert key not in engine._for_handles


async def test_for_recheck_callback_schedules_evaluate(hass) -> None:
    """The for-recheck callback fires a DURATION evaluation for the key, naming
    the entity and how long it has held its state."""

    class ForCondition:
        def trigger_deps(self, predicate: Any) -> TriggerSpec:
            return TriggerSpec(
                entities=frozenset({"binary_sensor.x"}),
                entity_durations=frozenset({("binary_sensor.x", 30.0)}),
            )

        async def snapshot(self, hass: Any) -> Any:
            return "on"

        def matches(self, predicate: Any, snapshot: Any) -> bool:
            return snapshot == "on"

        def describe(self, snapshot: Any, predicate=None) -> str | None:
            return snapshot

    scopes = [("area", "a", {"scenes": [{"when": {"fc": "on"}, "category": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_CONDITIONS: {"fc": ForCondition()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()

    key = ("area", "a", 0, "fc")
    fired_keys: list = []

    # Spy on _fire to confirm it receives the correct pred key with HAS_TIME cause.
    original_fire = engine._fire

    def spy_fire(fired_set, cause=None):
        fired_keys.append((set(fired_set), cause))
        original_fire(fired_set, cause)

    engine._fire = spy_fire  # type: ignore[method-assign]

    hass.states.async_set("binary_sensor.x", "on")
    recheck_cb = engine._make_for_recheck(key, "binary_sensor.x", 300.0)
    recheck_cb(None)

    assert any(key in f for f, _cause in fired_keys)
    duration_causes = [c for _f, c in fired_keys if c is not None and c.kind == CauseKind.DURATION]
    assert duration_causes, "expected a DURATION cause"
    cause = duration_causes[0]
    assert cause.entity_id == "binary_sensor.x"
    assert cause.new == "on"  # the held state, read at recheck time
    assert cause.detail == "5m"  # 300s humanised (compact, matching occupancy/people traces)


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
    # Two entities sharing the predicate, each with its own `for:` duration.
    engine._index = TriggerIndex(
        by_entity={"binary_sensor.x": frozenset({key}), "binary_sensor.y": frozenset({key})},
        by_clock={},
        by_sun={},
        midnight=frozenset(),
        has_time=frozenset(),
        durations={key: frozenset({("binary_sensor.x", 30.0), ("binary_sensor.y", 60.0)})},
        opaque=frozenset(),
    )

    captured: list = []  # (seconds, callback)

    def fake_call_later(_hass, seconds, cb):
        captured.append((seconds, cb))
        return MagicMock(name=f"cancel-{seconds}")

    with patch.object(_ts_mod, "async_call_later", side_effect=fake_call_later):
        engine._schedule_for_rechecks(frozenset({key}))

    assert len(captured) == 2
    assert len(engine._for_handles[key]) == 2

    # Fire the first timer's callback.
    captured[0][1](None)

    # Its own handle is gone, but the sibling stays tracked and cancellable.
    assert key in engine._for_handles
    assert len(engine._for_handles[key]) == 1


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
