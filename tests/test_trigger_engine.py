"""AutoTriggerEngine evaluation core — index build + flip detection."""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.trigger_engine import AutoTriggerEngine
from custom_components.ambience.triggers import EMPTY, TriggerSpec


class FakeStore:
    """Minimal store: scope configs, enabled flags, and scope getters."""

    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        enabled: dict[tuple[str, str | None], bool] | None = None,
    ) -> None:
        self._scopes = scopes
        self._enabled = enabled or {}
        self._by_key = {(kind, sid): cfg for kind, sid, cfg in scopes}

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return list(self._scopes)

    def auto_triggers_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        return self._enabled.get((scope_kind, scope_id), True)

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


def _engine(hass, scopes, matchers, enabled=None) -> AutoTriggerEngine:
    hass.data[DOMAIN] = {DATA_STORE: FakeStore(scopes, enabled), DATA_MATCHERS: matchers}
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
    # One scope, one rule: tod predicate "evening", deps on sensor.x.
    scopes = [
        ("area", "a", {"rules": [{"when": {"tod": "evening"}}]}),
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    return engine


async def test_recompute_first_eval_is_a_flip(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    dirty = engine._recompute({key}, {"tod": "evening"})  # matches -> True (was unset)
    assert dirty == {("area", "a")}


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
    assert dirty == {("area", "a")}


async def test_recompute_none_snapshot_evaluates_false(hass) -> None:
    engine = _engine_with_state(hass)
    key = ("area", "a", 0, "tod")
    engine._recompute({key}, {"tod": "evening"})  # True
    dirty = engine._recompute({key}, {"tod": None})  # snapshot None -> False -> flip
    assert dirty == {("area", "a")}
    assert engine._predicate_state[key] is False


async def test_recompute_stale_key_is_ignored(hass) -> None:
    engine = _engine_with_state(hass)
    stale = ("area", "a", 9, "tod")  # rule index out of range
    dirty = engine._recompute({stale}, {"tod": "evening"})
    assert dirty == set()


async def test_recompute_one_flip_among_two_predicates_marks_scope_once(hass) -> None:
    # Two predicates in one scope; only one flips → scope appears once in dirty.
    scopes = [
        ("area", "a", {"rules": [{"when": {"tod": "evening"}}, {"when": {"tod": "night"}}]}),
    ]
    matchers = {"tod": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.x"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    k0 = ("area", "a", 0, "tod")
    k1 = ("area", "a", 1, "tod")
    engine._recompute({k0, k1}, {"tod": "evening"})  # seed: k0 True, k1 False
    dirty = engine._recompute({k0, k1}, {"tod": "night"})  # k0 True→False, k1 False→True
    assert dirty == {("area", "a")}


async def test_recompute_key_for_removed_scope_is_ignored(hass) -> None:
    engine = _engine_with_state(hass)
    gone = ("area", "ghost", 0, "tod")  # scope not in _scope_cfgs
    dirty = engine._recompute({gone}, {"tod": "evening"})
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
    def __init__(self) -> None:
        self._actions: list[dict] = []

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
                    {"when": {"tod": "evening"}, "actions": []},
                    {"when": {"tod": "morning"}, "actions": []},
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
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] == 0


async def test_evaluate_no_flip_does_not_reapply(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] = 99  # sentinel
    await engine.async_evaluate({("area", "a", 0, "tod"), ("area", "a", 1, "tod")})
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] == 99  # untouched (no flip)


async def test_evaluate_flip_to_other_rule_reapplies(hass) -> None:
    engine, tod = _apply_engine(hass)
    await engine.async_initial_sync()
    tod.value = "morning"  # rule 1 now wins
    await engine.async_evaluate({("area", "a", 0, "tod"), ("area", "a", 1, "tod")})
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] == 1


async def test_evaluate_switch_off_does_not_apply(hass) -> None:
    engine, _tod = _apply_engine(hass, switch_on=False)
    await engine.async_initial_sync()
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_resolve_and_apply_force_reapplies_unchanged_winner(hass) -> None:
    engine, _tod = _apply_engine(hass)
    await engine.async_initial_sync()
    hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] = 0
    await engine._resolve_and_apply(("area", "a"), force=True)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] == 0


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
