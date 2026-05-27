"""ambience.apply_scene service handler."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from custom_components.ambience.const import (
    DATA_ACTIONS,
    DATA_MATCHERS,
    DATA_STORE,
    DOMAIN,
)
from custom_components.ambience.matchers.scene import SceneMatcher
from custom_components.ambience.service import async_apply_scene, async_resolve_only


class FixedMatcher:
    name = "tod"

    def __init__(self, current: str) -> None:
        self._current = current

    async def snapshot(self, hass):
        return self._current

    def matches(self, predicate, snapshot):
        if predicate is None:
            return True
        return predicate == snapshot

    def describe(self, snapshot):
        return snapshot

    def validate_predicate(self, predicate):
        return


class FailingMatcher:
    name = "weather"

    async def snapshot(self, hass):
        raise RuntimeError("weather snapshot failed")

    def matches(self, predicate, snapshot):
        return False

    def describe(self, snapshot):
        return None

    def validate_predicate(self, predicate):
        return


class RecordingAction:
    name = "record"
    domains = ("light",)

    def __init__(self) -> None:
        self.executions: list[tuple] = []

    async def execute(self, hass, entity_ids, params, script=None):
        self.executions.append((list(entity_ids), dict(params)))

    def validate_target_params(self, entity_ids, params, script=None):
        return


class FakeStore:
    def __init__(self, areas: dict) -> None:
        self._areas = areas

    def get_area(self, area_id):
        return self._areas.get(area_id)


def _install(hass: HomeAssistant, *, areas: dict, matchers: dict, actions: dict) -> None:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeStore(areas)
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher(), **matchers}
    hass.data[DOMAIN][DATA_ACTIONS] = actions


async def test_unknown_area_raises(hass: HomeAssistant) -> None:
    _install(hass, areas={}, matchers={}, actions={})
    with pytest.raises(ServiceValidationError, match="unknown_area"):
        await async_apply_scene(hass, "area", "missing", "movie")


async def test_happy_path_executes_matching_rule(hass: HomeAssistant) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie", "tod": "morning"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 10},
                        }
                    ],
                },
                {
                    "when": {"scene": "movie", "tod": "evening"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.b"],
                            "params": {"brightness": 30},
                        }
                    ],
                },
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})

    await async_apply_scene(hass, "area", "lr", "movie")

    assert action.executions == [(["light.b"], {"brightness": 30})]


async def test_no_match_is_silent_noop(hass: HomeAssistant) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {"when": {"scene": "movie", "tod": "morning"}, "actions": []},
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})
    await async_apply_scene(hass, "area", "lr", "movie")
    assert action.executions == []


async def test_snapshot_failure_treats_matcher_as_unresolved(
    hass: HomeAssistant,
) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening"), "weather": FailingMatcher()}
    areas = {
        "lr": {
            "matchers": ["tod", "weather"],
            "rules": [
                {
                    "when": {"scene": "movie", "weather": "rainy"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 10},
                        }
                    ],
                },
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.b"],
                            "params": {"brightness": 20},
                        }
                    ],
                },
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})

    await async_apply_scene(hass, "area", "lr", "movie")

    assert action.executions == [(["light.b"], {"brightness": 20})]


async def test_unknown_action_skipped_other_actions_run(
    hass: HomeAssistant,
) -> None:
    recorded = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {"action": "nonexistent", "entity_ids": ["x.y"], "params": {}},
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 50},
                        },
                    ],
                }
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": recorded})

    await async_apply_scene(hass, "area", "lr", "movie")

    assert recorded.executions == [(["light.a"], {"brightness": 50})]


async def test_action_failure_does_not_block_other_actions(
    hass: HomeAssistant,
) -> None:
    class FailingAction:
        name = "fail"
        domains = ("light",)

        async def execute(self, hass, entity_ids, params, script=None):
            raise RuntimeError("boom")

        def validate_target_params(self, entity_ids, params, script=None):
            return

    recorded = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {"action": "fail", "entity_ids": ["x.y"], "params": {}},
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 50},
                        },
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        matchers=matchers,
        actions={"record": recorded, "fail": FailingAction()},
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert recorded.executions == [(["light.a"], {"brightness": 50})]


async def test_cancellation_treated_as_failure_isolation(
    hass: HomeAssistant,
) -> None:
    """A CancelledError (BaseException, not Exception) must still be isolated."""

    class CancelledMatcher:
        name = "tod"

        async def snapshot(self, hass):
            import asyncio

            raise asyncio.CancelledError()

        def matches(self, predicate, snapshot):
            return False

        def describe(self, snapshot):
            return None

        def validate_predicate(self, predicate):
            return

    action = RecordingAction()
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 10},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        matchers={"tod": CancelledMatcher()},
        actions={"record": action},
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    # Wildcard rule should still match (cancelled snapshot becomes None).
    assert action.executions == [(["light.a"], {"brightness": 10})]


async def test_apply_scene_threads_script_kwarg_to_action(hass: HomeAssistant) -> None:
    class ScriptRecordingAction:
        name = "fake"
        domains = ()

        def __init__(self) -> None:
            self.executions: list[dict] = []

        async def execute(self, hass, entity_ids, params, script=None):
            self.executions.append(
                {"entity_ids": list(entity_ids), "params": dict(params), "script": script}
            )

        def validate_target_params(self, entity_ids, params, script=None):
            return

    fake = ScriptRecordingAction()
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "fake",
                            "script": "script.foo",
                            "entity_ids": ["light.a"],
                            "params": {"x": 1},
                        }
                    ],
                }
            ],
        }
    }
    _install(hass, areas=areas, matchers={}, actions={"fake": fake})

    await async_apply_scene(hass, "area", "lr", "movie")

    assert fake.executions == [
        {"entity_ids": ["light.a"], "params": {"x": 1}, "script": "script.foo"}
    ]


async def test_resolve_only_describes_activating_scene(hass: HomeAssistant) -> None:
    """The activating scene is injected as the `scene` snapshot and described."""
    areas = {
        "lr": {
            "matchers": [],
            "rules": [{"when": {"scene": "movie"}, "actions": []}],
        }
    }
    _install(hass, areas=areas, matchers={}, actions={})

    result = await async_resolve_only(hass, "area", "lr", "movie")

    assert result["snapshots_described"]["scene"] == "movie"
    assert result["matched_rule_index"] == 0


async def test_apply_scene_without_scene_treats_scene_predicates_as_wildcard(
    hass: HomeAssistant,
) -> None:
    """Calling apply_scene without scene should match rules whose scene
    predicate would otherwise constrain them — i.e. the scene predicate
    is stripped (treated as wildcard) for this resolve."""
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "matchers": ["tod"],
            "rules": [
                {
                    "name": "always-on rule",
                    "when": {"scene": "movie_night", "tod": "evening"},
                    "actions": [
                        {
                            "action": "record",
                            "entity_ids": ["light.a"],
                            "params": {"brightness": 42},
                        }
                    ],
                }
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})

    await async_apply_scene(hass, "area", "lr", None)

    assert action.executions == [(["light.a"], {"brightness": 42})]


class FakeScopeStore:
    """In-memory store with area/floor/house accessors. Mirrors AmbienceStore's
    API surface used by the service layer."""

    def __init__(
        self,
        areas: dict | None = None,
        floors: dict | None = None,
        house: dict | None = None,
    ) -> None:
        self._areas = areas or {}
        self._floors = floors or {}
        self._house = house or {"rules": [], "auto_sort": True}

    def get_area(self, area_id):
        return self._areas.get(area_id)

    def get_floor(self, floor_id):
        return self._floors.get(floor_id)

    def get_house(self):
        return dict(self._house)


async def test_async_resolve_only_floor_routes_to_floor_store(hass: HomeAssistant) -> None:
    """Calling with scope_kind='floor' resolves against the floor's rules."""
    floors = {
        "upstairs": {
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [],
                }
            ],
            "auto_sort": True,
        }
    }
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeScopeStore(floors=floors)
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher()}
    hass.data[DOMAIN][DATA_ACTIONS] = {}

    plan = await async_resolve_only(hass, "floor", "upstairs", "movie")
    assert plan["rule_name"] == "movie"


async def test_async_resolve_only_house_routes_to_house_store(hass: HomeAssistant) -> None:
    house = {
        "rules": [{"name": "away", "when": {"scene": "away"}, "actions": []}],
        "auto_sort": True,
    }
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeScopeStore(house=house)
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher()}
    hass.data[DOMAIN][DATA_ACTIONS] = {}

    plan = await async_resolve_only(hass, "house", None, "away")
    assert plan["rule_name"] == "away"


async def test_async_resolve_only_unknown_floor_raises(hass: HomeAssistant) -> None:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeScopeStore()
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher()}
    hass.data[DOMAIN][DATA_ACTIONS] = {}

    with pytest.raises(ServiceValidationError, match="unknown_floor"):
        await async_resolve_only(hass, "floor", "nonexistent", None)


async def test_async_apply_scene_floor_runs_floor_actions(hass: HomeAssistant) -> None:
    """apply_scene with scope_kind='floor' executes the matched floor rule's actions."""
    recording = RecordingAction()
    floors = {
        "upstairs": {
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [
                        {"action": "record", "entity_ids": ["light.up_a"], "params": {"x": 1}}
                    ],
                }
            ],
            "auto_sort": True,
        }
    }
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeScopeStore(floors=floors)
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher()}
    hass.data[DOMAIN][DATA_ACTIONS] = {"record": recording}

    await async_apply_scene(hass, "floor", "upstairs", "movie")
    assert recording.executions == [(["light.up_a"], {"x": 1})]
