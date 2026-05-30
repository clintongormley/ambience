"""ambience.apply_scene service handler — generic service dispatch."""

from __future__ import annotations

from types import SimpleNamespace

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.matchers.scene import SceneMatcher
from custom_components.ambience.service import (
    async_apply_scene,
    async_resolve_only,
    async_resolve_with_snapshots,
)


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


class FakeStore:
    def __init__(self, areas: dict | None = None) -> None:
        self._areas = areas or {}

    def get_area(self, area_id):
        return self._areas.get(area_id)


class _FakeExposedStorage:
    """Minimal storage backing for ExposedActionsStore in tests."""

    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions = list(initial or [])

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)


def _install(
    hass: HomeAssistant,
    *,
    areas: dict | None = None,
    matchers: dict | None = None,
    exposed: list[dict] | None = None,
    store: object | None = None,
) -> None:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = store if store is not None else FakeStore(areas or {})
    hass.data[DOMAIN][DATA_MATCHERS] = {"scene": SceneMatcher(), **(matchers or {})}
    hass.data[DOMAIN][DATA_EXPOSED_ACTIONS] = ExposedActionsStore(
        _FakeExposedStorage(exposed or [])
    )


def _exposed(sid: str, *, visible: list[str] | None = None, defaults: dict | None = None) -> dict:
    return {
        "id": sid,
        "label": "",
        "visible_fields": list(visible or []),
        "defaults": dict(defaults or {}),
    }


async def test_unknown_area_raises(hass: HomeAssistant) -> None:
    _install(hass)
    with pytest.raises(ServiceValidationError, match="unknown_area"):
        await async_apply_scene(hass, "area", "missing", "movie")


async def test_happy_path_calls_service_for_matching_rule(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie", "tod": "morning"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 10},
                        }
                    ],
                },
                {
                    "when": {"scene": "movie", "tod": "evening"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.b"],
                            "params": {"brightness_pct": 30},
                        }
                    ],
                },
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        matchers=matchers,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.b"]
    assert calls[0].data["brightness_pct"] == 30


async def test_defaults_merged_with_rule_params(hass: HomeAssistant) -> None:
    """Settings defaults are applied even when the rule doesn't set them."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 60},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[
            _exposed(
                "light.turn_on",
                visible=["brightness_pct"],
                defaults={"transition": 1.5},
            )
        ],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert len(calls) == 1
    assert calls[0].data["brightness_pct"] == 60
    assert calls[0].data["transition"] == 1.5


async def test_rule_params_override_defaults(hass: HomeAssistant) -> None:
    """If both defaults + rule params set a key, the rule wins (later-wins via spread)."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"transition": 3.0},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[
            _exposed(
                "light.turn_on",
                visible=["transition"],
                defaults={"transition": 1.0},
            )
        ],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert calls[0].data["transition"] == 3.0


async def test_no_match_is_silent_noop(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "rules": [
                {"when": {"scene": "movie", "tod": "morning"}, "actions": []},
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers)
    await async_apply_scene(hass, "area", "lr", "movie")
    assert calls == []


async def test_snapshot_failure_treats_matcher_as_unresolved(
    hass: HomeAssistant,
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    matchers = {"tod": FixedMatcher("evening"), "weather": FailingMatcher()}
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie", "weather": "rainy"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 10},
                        }
                    ],
                },
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.b"],
                            "params": {"brightness_pct": 20},
                        }
                    ],
                },
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        matchers=matchers,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.b"]
    assert calls[0].data["brightness_pct"] == 20


async def test_malformed_action_skipped_other_actions_run(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        # Missing dot in service id → malformed.
                        {"service": "nope", "entity_ids": [], "params": {}},
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 50},
                        },
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    import logging

    caplog.set_level(logging.WARNING)
    await async_apply_scene(hass, "area", "lr", "movie")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]
    assert "malformed action" in caplog.text


async def test_unexposed_service_skipped_with_warning(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """A rule referencing a not-exposed service should be skipped and warned."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 50},
                        }
                    ],
                }
            ],
        }
    }
    # exposed is empty → service not exposed
    _install(hass, areas=areas, exposed=[])

    import logging

    caplog.set_level(logging.WARNING)
    await async_apply_scene(hass, "area", "lr", "movie")

    assert calls == []
    assert "not exposed" in caplog.text


async def test_action_failure_does_not_block_other_actions(
    hass: HomeAssistant,
) -> None:
    """A failing first service call must not prevent the second one from running."""

    async def _boom(_call):
        raise RuntimeError("boom")

    hass.services.async_register("light", "turn_on", _boom)
    off_calls = async_mock_service(hass, "light", "turn_off")

    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {},
                        },
                        {
                            "service": "light.turn_off",
                            "entity_ids": ["light.b"],
                            "params": {},
                        },
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[
            _exposed("light.turn_on", visible=[]),
            _exposed("light.turn_off", visible=[]),
        ],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    # The failing turn_on raised, but turn_off still completed.
    assert len(off_calls) == 1
    assert off_calls[0].data["entity_id"] == ["light.b"]


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

    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 10},
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
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    # Wildcard rule should still match (cancelled snapshot becomes None).
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]


async def test_apply_scene_with_no_entity_ids_omits_target(
    hass: HomeAssistant,
) -> None:
    """Actions with no entity_ids should be dispatched without a target."""
    calls = async_mock_service(hass, "script", "foo")
    areas = {
        "lr": {
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "script.foo",
                            "entity_ids": [],
                            "params": {"message": "hi"},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[_exposed("script.foo", visible=["message"])],
    )

    await async_apply_scene(hass, "area", "lr", "movie")

    assert len(calls) == 1
    assert calls[0].data.get("entity_id") is None
    assert calls[0].data["message"] == "hi"


async def test_resolve_only_describes_activating_scene(hass: HomeAssistant) -> None:
    """The activating scene is injected as the `scene` snapshot and described."""
    areas = {
        "lr": {
            "rules": [{"when": {"scene": "movie"}, "actions": []}],
        }
    }
    _install(hass, areas=areas)

    result = await async_resolve_only(hass, "area", "lr", "movie")

    assert result["snapshots_described"]["scene"] == "movie"
    assert result["matched_rule_index"] == 0


async def test_apply_scene_without_scene_treats_scene_predicates_as_wildcard(
    hass: HomeAssistant,
) -> None:
    """Calling apply_scene without scene should match rules whose scene
    predicate would otherwise constrain them — i.e. the scene predicate
    is stripped (treated as wildcard) for this resolve."""
    calls = async_mock_service(hass, "light", "turn_on")
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "rules": [
                {
                    "name": "always-on rule",
                    "when": {"scene": "movie_night", "tod": "evening"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 42},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        areas=areas,
        matchers=matchers,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr", None)

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]
    assert calls[0].data["brightness_pct"] == 42


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
    _install(hass, store=FakeScopeStore(floors=floors))

    plan = await async_resolve_only(hass, "floor", "upstairs", "movie")
    assert plan["rule_name"] == "movie"


async def test_async_resolve_only_house_routes_to_house_store(hass: HomeAssistant) -> None:
    house = {
        "rules": [{"name": "away", "when": {"scene": "away"}, "actions": []}],
        "auto_sort": True,
    }
    _install(hass, store=FakeScopeStore(house=house))

    plan = await async_resolve_only(hass, "house", None, "away")
    assert plan["rule_name"] == "away"


async def test_async_resolve_only_unknown_floor_raises(hass: HomeAssistant) -> None:
    _install(hass, store=FakeScopeStore())

    with pytest.raises(ServiceValidationError, match="unknown_floor"):
        await async_resolve_only(hass, "floor", "nonexistent", None)


async def test_async_apply_scene_floor_runs_floor_actions(hass: HomeAssistant) -> None:
    """apply_scene with scope_kind='floor' executes the matched floor rule's actions."""
    calls = async_mock_service(hass, "light", "turn_on")
    floors = {
        "upstairs": {
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.up_a"],
                            "params": {"brightness_pct": 25},
                        }
                    ],
                }
            ],
            "auto_sort": True,
        }
    }
    _install(
        hass,
        store=FakeScopeStore(floors=floors),
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "floor", "upstairs", "movie")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.up_a"]
    assert calls[0].data["brightness_pct"] == 25


async def test_resolve_with_snapshots_does_not_call_snapshot(hass: HomeAssistant) -> None:
    class ExplodingSnapshot:
        name = "tod"

        async def snapshot(self, hass):
            raise AssertionError("snapshot() must not be called by resolve_with_snapshots")

        def matches(self, predicate, snapshot):
            return predicate is None or predicate == snapshot

        def describe(self, snapshot):
            return snapshot

        def validate_predicate(self, predicate):
            return

    areas = {"a": {"rules": [{"name": "r", "when": {"tod": "evening"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_MATCHERS: {"tod": ExplodingSnapshot(), "scene": SceneMatcher()},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(hass, "area", "a", {"tod": "evening"})
    assert plan["matched_rule_index"] == 0
    assert plan["rule_name"] == "r"
    assert plan["switch_state"] == "unknown"


async def test_resolve_with_snapshots_no_match(hass: HomeAssistant) -> None:
    class T:
        name = "tod"

        def matches(self, predicate, snapshot):
            return predicate is None or predicate == snapshot

        def describe(self, snapshot):
            return snapshot

        def validate_predicate(self, predicate):
            return

    areas = {"a": {"rules": [{"name": "r", "when": {"tod": "morning"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_MATCHERS: {"tod": T(), "scene": SceneMatcher()},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(hass, "area", "a", {"tod": "evening"})
    assert plan["matched_rule_index"] is None
    assert plan["actions"] == []


def _switch(on: bool) -> SimpleNamespace:
    return SimpleNamespace(is_on=on)


async def test_apply_scene_records_last_applied_rule(hass: HomeAssistant) -> None:
    areas = {"a": {"rules": [{"name": "r", "when": {"tod": "evening"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_MATCHERS: {"tod": FixedMatcher("evening"), "scene": SceneMatcher()},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a")] == 0


async def test_apply_scene_switch_off_does_not_record(hass: HomeAssistant) -> None:
    areas = {"a": {"rules": [{"name": "r", "when": {"tod": "evening"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_MATCHERS: {"tod": FixedMatcher("evening"), "scene": SceneMatcher()},
        DATA_SWITCHES: {("area", "a"): _switch(False)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_apply_scene_no_match_does_not_record(hass: HomeAssistant) -> None:
    areas = {"a": {"rules": [{"name": "r", "when": {"tod": "morning"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_MATCHERS: {"tod": FixedMatcher("evening"), "scene": SceneMatcher()},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})
