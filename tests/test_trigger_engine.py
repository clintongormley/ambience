"""AutoTriggerEngine evaluation core — index build + flip detection."""

from __future__ import annotations

import logging
from datetime import timedelta
from types import SimpleNamespace
from typing import Any

from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_SINKS,
    DOMAIN,
)
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.trace import TraceEvent
from custom_components.ambience.trigger_engine import AutoTriggerEngine
from custom_components.ambience.triggers import EMPTY, TriggerSpec


class FakeStore:
    """Minimal store: scope configs, enabled flags, and scope getters."""

    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        enabled: dict[tuple[str, str | None], bool] | None = None,
        disabled: dict[tuple[str, str | None], set[str]] | None = None,
    ) -> None:
        self._scopes = scopes
        self._enabled = enabled or {}
        self._disabled = disabled or {}
        self._by_key = {(kind, sid): cfg for kind, sid, cfg in scopes}

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return list(self._scopes)

    def auto_triggers_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        return self._enabled.get((scope_kind, scope_id), True)

    def auto_triggers_disabled(self, scope_kind: str, scope_id: str | None) -> frozenset[str]:
        return frozenset(self._disabled.get((scope_kind, scope_id), set()))

    def get_area(self, area_id: str) -> dict | None:
        return self._by_key.get(("area", area_id))

    def get_floor(self, floor_id: str) -> dict | None:
        return self._by_key.get(("floor", floor_id))

    def get_house(self) -> dict:
        return self._by_key.get(("house", None), {"rules": []})


class DepsMatcher:
    """Matcher stub: trigger_deps returns a fixed spec; matches compares equality."""

    def __init__(self, spec: TriggerSpec) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot


def _engine(hass, scopes, matchers, enabled=None, disabled=None) -> AutoTriggerEngine:
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes, enabled, disabled),
        DATA_MATCHERS: matchers,
    }
    return AutoTriggerEngine(hass)


async def test_rebuild_indexes_enabled_scope_predicate(hass) -> None:
    scopes = [
        ("area", "kitchen", {"rules": [{"when": {"state": "x"}}]}),
    ]
    matchers = {"state": DepsMatcher(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    idx = engine.index
    assert idx.by_entity["binary_sensor.motion"] == frozenset({("area", "kitchen", 0, "state")})


async def test_rebuild_skips_disabled_scope(hass) -> None:
    scopes = [("area", "kitchen", {"rules": [{"when": {"state": "x"}}]})]
    matchers = {"state": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.a"})))}
    engine = _engine(hass, scopes, matchers, enabled={("area", "kitchen"): False})
    engine.async_rebuild()
    assert engine.index.by_entity == {}


async def test_rebuild_filters_disabled_trigger(hass) -> None:
    """A disabled trigger key drops that watch but keeps the rest of the scope."""
    scopes = [("area", "kitchen", {"rules": [{"when": {"state": "x"}}]})]
    spec = TriggerSpec(entities=frozenset({"binary_sensor.motion", "sensor.lux"}))
    matchers = {"state": DepsMatcher(spec)}
    engine = _engine(
        hass,
        scopes,
        matchers,
        disabled={("area", "kitchen"): {"entity:binary_sensor.motion"}},
    )
    engine.async_rebuild()
    assert "binary_sensor.motion" not in engine.index.by_entity
    assert engine.index.by_entity["sensor.lux"] == frozenset({("area", "kitchen", 0, "state")})


async def test_rebuild_disabling_all_watches_drops_predicate(hass) -> None:
    scopes = [("area", "kitchen", {"rules": [{"when": {"state": "x"}}]})]
    matchers = {"state": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.lux"})))}
    engine = _engine(hass, scopes, matchers, disabled={("area", "kitchen"): {"entity:sensor.lux"}})
    engine.async_rebuild()
    assert engine.index.by_entity == {}
    assert engine.index.all_predicates() == frozenset()


async def test_rebuild_skips_none_predicate_and_empty_deps(hass) -> None:
    scopes = [
        (
            "house",
            None,
            {
                "rules": [
                    {"when": {"state": None, "weather": "w"}},
                ]
            },
        )
    ]
    matchers = {
        "state": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.a"}))),
        "weather": DepsMatcher(EMPTY),
    }
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    assert engine.index.by_entity == {}
    assert engine.index.entities == frozenset()


async def test_rebuild_unknown_matcher_is_skipped(hass) -> None:
    scopes = [("area", "a", {"rules": [{"when": {"mystery": "p"}}]})]
    engine = _engine(hass, scopes, {})
    engine.async_rebuild()
    assert engine.index.entities == frozenset()


async def test_rebuild_matcher_without_trigger_deps_is_opaque(hass) -> None:
    class NoDeps:
        def matches(self, predicate, snapshot):
            return True

    scopes = [("area", "a", {"rules": [{"when": {"legacy": "p"}}]})]
    engine = _engine(hass, scopes, {"legacy": NoDeps()})
    engine.async_rebuild()
    assert engine.index.opaque == frozenset({("area", "a", 0, "legacy")})


def _engine_with_state(hass) -> AutoTriggerEngine:
    # One scope, one rule in group "g": tod predicate "evening", deps on sensor.x.
    scopes = [
        ("area", "a", {"rules": [{"when": {"tod": "evening"}, "group": "g"}]}),
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
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
    stale = ("area", "a", 9, "tod")  # rule index out of range
    dirty = engine._recompute({stale}, {"tod": "evening"})
    assert dirty == set()


async def test_recompute_one_flip_among_two_predicates_marks_scope_once(hass) -> None:
    # Two predicates in one scope+group; only one flips → unit appears once.
    scopes = [
        (
            "area",
            "a",
            {
                "rules": [
                    {"when": {"tod": "evening"}, "group": "g"},
                    {"when": {"tod": "night"}, "group": "g"},
                ]
            },
        ),
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    k0 = ("area", "a", 0, "tod")
    k1 = ("area", "a", 1, "tod")
    engine._recompute({k0, k1}, {"tod": "evening"})  # seed: k0 True, k1 False
    dirty = engine._recompute({k0, k1}, {"tod": "night"})  # k0 True→False, k1 False→True
    assert dirty == {("area", "a", "g")}


async def test_recompute_marks_only_flipped_groups_dirty(hass) -> None:
    # Two rules in two groups; flip ONLY the predicate of rule idx0 (group
    # "lighting"). The dirty unit set must name only that scope+group.
    scopes = [
        (
            "area",
            "lr",
            {
                "rules": [
                    {"when": {"tod": "evening"}, "group": "lighting"},
                    {"when": {"tod": "night"}, "group": "blinds"},
                ]
            },
        ),
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    k0 = ("area", "lr", 0, "tod")
    k1 = ("area", "lr", 1, "tod")
    engine._recompute({k0, k1}, {"tod": "morning"})  # seed: both False
    dirty = engine._recompute({k0, k1}, {"tod": "evening"})  # k0 flips True; k1 unchanged
    assert dirty == {("area", "lr", "lighting")}


async def test_tier_executor_applies_areas_then_floors_then_house(hass) -> None:
    scopes = [("area", "a", {"rules": []})]
    matchers: dict = {}
    engine = _engine(hass, scopes, matchers)
    recorded: list[str] = []

    async def _spy(scope_kind, scope_id, group_id, *, force=False):
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


async def test_group_for_returns_rule_group(hass) -> None:
    engine = _engine_with_state(hass)  # area a, rule0 in group "g"
    assert engine._group_for("area", "a", 0) == "g"


async def test_recompute_drops_units_for_missing_rule(hass) -> None:
    # A flipping predicate whose rule resolves to a None group (here: a rule
    # with no group, but the same holds for a stale/out-of-range rule) must be
    # DROPPED, never added as a (kind, id, None) unit — a None group would
    # wrongly resolve the whole list in the apply path.
    scopes = [
        ("area", "a", {"rules": [{"when": {"tod": "evening"}}]}),  # no group on the rule
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    key = ("area", "a", 0, "tod")  # live predicate, flips True; group is None
    dirty = engine._recompute({key}, {"tod": "evening"})
    assert all(unit[2] is not None for unit in dirty)
    assert dirty == set()


class CacheMatcher:
    """trigger_deps + equality matches + a mutable snapshot value."""

    def __init__(self, deps: TriggerSpec, value: Any) -> None:
        self._deps = deps
        self.value = value

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._deps

    async def snapshot(self, hass: Any) -> Any:
        return self.value

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot

    def describe(self, snapshot: Any) -> str:
        return str(snapshot)


class _FakeExposedStorage:
    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions: list[dict] = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


def _apply_engine(hass, *, switch_on: bool = True):
    """Engine over one area 'a' with rules [evening->idx0, morning->idx1], the
    'tod' matcher watching sensor.x, switch on, empty exposed actions."""
    tod = CacheMatcher(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    scopes = [
        (
            "area",
            "a",
            {
                "rules": [
                    {"when": {"tod": "evening"}, "group": "g", "actions": []},
                    {"when": {"tod": "morning"}, "group": "g", "actions": []},
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"tod": tod},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=switch_on)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine, tod


async def test_initial_sync_applies_winning_rule(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()  # tod="evening" -> rule 0 wins
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0


async def test_evaluate_no_flip_does_not_reapply(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 99  # sentinel
    await engine.async_evaluate({("area", "a", 0, "tod"), ("area", "a", 1, "tod")})
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 99  # untouched (no flip)


async def test_evaluate_flip_to_other_rule_reapplies(hass) -> None:
    engine, tod = _apply_engine(hass)
    await engine.async_initial_sync()
    tod.value = "morning"  # rule 1 now wins
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


class SpyMatcher:
    """Counts snapshot() calls — to prove unfired matchers aren't re-snapshotted."""

    def __init__(self, deps: TriggerSpec) -> None:
        self._deps = deps
        self.snapshot_calls = 0

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._deps

    async def snapshot(self, hass: Any) -> Any:
        self.snapshot_calls += 1
        return {}

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return False

    def describe(self, snapshot: Any) -> str | None:
        return None


async def test_evaluate_does_not_refresh_unfired_matchers(hass) -> None:
    # The gating invariant: firing the 'tod' predicate must not re-snapshot the
    # (expensive/opaque) 'script' matcher, even though both are indexed and the
    # tod flip triggers a scope resolve.
    tod = CacheMatcher(TriggerSpec(entities=frozenset({"sensor.x"})), "evening")
    script = SpyMatcher(TriggerSpec(entities=frozenset({"sensor.y"}), opaque=True))
    scopes = [
        (
            "area",
            "a",
            {
                "rules": [
                    {"when": {"tod": "evening", "script": {"script": "script.s"}}, "actions": []}
                ]
            },
        )
    ]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"tod": tod, "script": script},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine.async_evaluate({("area", "a", 0, "tod")})  # fire ONLY the tod predicate
    assert script.snapshot_calls == 0


class StateReadMatcher:
    """A matcher whose snapshot reads binary_sensor.x's state from hass."""

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(entities=frozenset({"binary_sensor.x"}))

    async def snapshot(self, hass: Any) -> Any:
        state = hass.states.get("binary_sensor.x")
        return state.state if state else None

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot

    def describe(self, snapshot: Any) -> str | None:
        return snapshot


def _live_engine(hass) -> AutoTriggerEngine:
    """Engine: area 'a', rule0 fires when binary_sensor.x == 'on'. Switch on."""
    scopes = [("area", "a", {"rules": [{"when": {"x": "on"}, "group": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"x": StateReadMatcher()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    return engine


async def test_state_change_fires_and_applies(hass) -> None:
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    engine.async_subscribe()
    await engine.async_initial_sync()  # x=off, rule needs "on" -> no match -> no apply
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

    class HasTimeMatcher:
        def trigger_deps(self, predicate):
            return TriggerSpec(entities=frozenset(), has_time=True)

        async def snapshot(self, hass):
            return "v"

        def matches(self, predicate, snapshot):
            calls.append(1)
            return True

        def describe(self, snapshot):
            return None

    scopes = [("area", "a", {"rules": [{"when": {"tmpl": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"tmpl": HasTimeMatcher()},
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

    class SunDepMatcher:
        def trigger_deps(self, predicate):
            return TriggerSpec(sun_events=frozenset({("sunset", 0)}))

        async def snapshot(self, hass):
            return "v"

        def matches(self, predicate, snapshot):
            return True

        def describe(self, snapshot):
            return None

    scopes = [("area", "a", {"rules": [{"when": {"sun": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"sun": SunDepMatcher()},
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

    class ForMatcher:
        def trigger_deps(self, predicate):
            return TriggerSpec(
                entities=frozenset({"binary_sensor.x"}),
                entity_durations=frozenset({("binary_sensor.x", 600.0)}),
            )

        async def snapshot(self, hass):
            state = hass.states.get("binary_sensor.x")
            return state.state if state else None

        def matches(self, predicate, snapshot):
            return snapshot == "on"

        def describe(self, snapshot):
            return snapshot

    scopes = [("area", "a", {"rules": [{"when": {"x": "on"}, "group": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"x": ForMatcher()},
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


async def test_async_start_builds_subscribes_and_syncs(hass) -> None:
    hass.states.async_set("binary_sensor.x", "on")
    scopes = [("area", "a", {"rules": [{"when": {"x": "on"}, "group": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"x": StateReadMatcher()},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    await engine.async_start()  # build + subscribe + initial sync
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0
    assert engine.index.entities == frozenset({"binary_sensor.x"})
    engine.async_shutdown()
    assert engine._unsubs == []


async def test_switch_off_to_on_force_resyncs(hass) -> None:
    hass.states.async_set("binary_sensor.x", "on")
    switch = SimpleNamespace(is_on=True, entity_id="switch.ambience_a")
    scopes = [("area", "a", {"rules": [{"when": {"x": "on"}, "group": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"x": StateReadMatcher()},
        DATA_SWITCHES: {("area", "a"): switch},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    engine.async_subscribe()
    await engine.async_initial_sync()  # applies rule 0
    # Seed a WRONG last_applied: only a force-resync (which bypasses the
    # unchanged-winner guard) will correct it back to 0.
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] = 99
    hass.states.async_set("switch.ambience_a", "off")
    hass.states.async_set("switch.ambience_a", "on")  # off->on transition
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "g")] == 0  # force-resync ran
    engine._teardown()


async def test_initial_sync_skips_rule_with_unregistered_matcher(hass) -> None:
    # A rule whose `when` names a matcher that isn't registered (e.g. a stale
    # config key) cannot be evaluated, so the engine must NOT auto-apply it.
    scopes = [("area", "a", {"rules": [{"when": {"nonexistent": "x"}, "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {},
        DATA_SWITCHES: {("area", "a"): SimpleNamespace(is_on=True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    engine = AutoTriggerEngine(hass)
    engine.async_rebuild()
    await engine.async_initial_sync()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_rebuild_prunes_stale_predicate_state(hass) -> None:
    engine = _engine_with_state(hass)  # area a, rule0 {tod: evening}
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # seed flip-state for the key
    assert key in engine._predicate_state
    # Rebuild over a store where that scope now has no rules.
    hass.data[DOMAIN][DATA_STORE] = FakeStore([("area", "a", {"rules": []})])
    engine.async_rebuild()
    assert key not in engine._predicate_state  # stale key pruned


async def test_config_refresh_is_debounced(hass) -> None:
    # Two rapid refresh requests coalesce into a single rebuild+sync.
    spy = SpyMatcher(TriggerSpec(entities=frozenset({"sensor.y"})))
    scopes = [("area", "a", {"rules": [{"when": {"x": "on"}, "group": "g", "actions": []}]})]
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(scopes),
        DATA_MATCHERS: {"x": spy},
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


async def test_reapply_fires_due_action_for_winning_rule(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    action = {
        "service": "light.turn_on",
        "entity_ids": ["light.a"],
        "params": {"brightness": 7},
        "reapply_seconds": 10,
    }
    rule = {"when": {}, "group": "g", "actions": [action]}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"rules": [rule]})]),
        DATA_MATCHERS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        DATA_SWITCHES: {},
    }
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()

    assert len(calls) == 1 and calls[0]["brightness"] == 7
    eng._teardown()


async def test_reapply_skips_when_switch_off(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    rule = {
        "when": {},
        "group": "g",
        "actions": [
            {
                "service": "light.turn_on",
                "entity_ids": ["light.a"],
                "params": {},
                "reapply_seconds": 10,
            }
        ],
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"rules": [rule]})]),
        DATA_MATCHERS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        DATA_SWITCHES: {("area", "k"): SimpleNamespace(is_on=False)},
    }
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()

    assert calls == []
    eng._teardown()


async def test_reapply_skips_when_rule_is_not_the_winner(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    rule0 = {"when": {}, "group": "g", "actions": []}
    rule1 = {
        "when": {},
        "group": "g",
        "actions": [
            {
                "service": "light.turn_on",
                "entity_ids": ["light.a"],
                "params": {},
                "reapply_seconds": 10,
            }
        ],
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"rules": [rule0, rule1]})]),
        DATA_MATCHERS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        # winner is rule 0; the re-applying action lives in rule 1
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        DATA_SWITCHES: {},
    }
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_reapply_skips_when_no_rule_active(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    rule = {
        "when": {},
        "group": "g",
        "actions": [
            {
                "service": "light.turn_on",
                "entity_ids": ["light.a"],
                "params": {},
                "reapply_seconds": 10,
            }
        ],
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"rules": [rule]})]),
        DATA_MATCHERS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on"),
        DATA_LAST_APPLIED: {},  # nothing applied
        DATA_SWITCHES: {},
    }
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()
    assert calls == []
    eng._teardown()


async def test_state_change_emits_trace_event_to_sink(hass) -> None:
    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event):
            captured.append(event)

    # Use the same setup as _live_engine / test_state_change_fires_and_applies:
    # area 'a', rule0 fires when binary_sensor.x == 'on', switch on.
    hass.states.async_set("binary_sensor.x", "off")
    engine = _live_engine(hass)
    # Install the capture sink BEFORE subscribing so it is present at emit time.
    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    engine.async_subscribe()
    await engine.async_initial_sync()  # x=off -> no match, no apply

    trace_logger = logging.getLogger("custom_components.ambience.trace")
    trace_logger.setLevel(logging.DEBUG)
    try:
        # Flip the sensor so rule0 wins and the engine ACTs.
        hass.states.async_set("binary_sensor.x", "on")
        await hass.async_block_till_done()

        assert captured, "expected a TraceEvent to be emitted"
        event = captured[-1]
        assert event.cause.kind == "entity"
        assert any(u.outcome == "acted" for u in event.units)
    finally:
        trace_logger.setLevel(logging.NOTSET)


async def test_reapply_distinct_intervals_fire_independently(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda c: calls.append(("on", c.data)))
    hass.services.async_register("light", "turn_off", lambda c: calls.append(("off", c.data)))
    rule = {
        "when": {},
        "group": "g",
        "actions": [
            {
                "service": "light.turn_on",
                "entity_ids": ["light.a"],
                "params": {},
                "reapply_seconds": 10,
            },
            {
                "service": "light.turn_off",
                "entity_ids": ["light.b"],
                "params": {},
                "reapply_seconds": 20,
            },
        ],
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore([("area", "k", {"rules": [rule]})]),
        DATA_MATCHERS: {},
        DATA_EXPOSED_ACTIONS: _exposed_store_with("light.turn_on", "light.turn_off"),
        DATA_LAST_APPLIED: {("area", "k", "g"): 0},
        DATA_SWITCHES: {},
    }
    eng = AutoTriggerEngine(hass)
    eng.async_rebuild()
    eng.async_subscribe()

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()
    kinds = [c[0] for c in calls]
    assert "on" in kinds and "off" not in kinds
    eng._teardown()
