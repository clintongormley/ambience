"""ambience.apply_scene service handler — generic service dispatch."""

from __future__ import annotations

import logging
from types import SimpleNamespace

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import async_mock_service

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
from custom_components.ambience.service import (
    async_apply_scene,
    async_execute_actions,
    async_execute_plan,
    async_resolve_categories_only,
    async_resolve_only,
    async_resolve_with_snapshots,
    async_run_scene_actions,
    category_ids,
    clear_last_applied,
    effective_reapply_seconds,
    scope_reapply_intervals,
)
from custom_components.ambience.trace import TraceEvent


def test_category_ids_returns_only_real_ids():
    assert category_ids({"scenes": [{"category": "a"}, {"category": "b"}, {"category": "a"}]}) == {
        "a",
        "b",
    }


class FixedCondition:
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


class FailingCondition:
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

    def categories(self):
        return []


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
    conditions: dict | None = None,
    exposed: list[dict] | None = None,
    store: object | None = None,
) -> None:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = store if store is not None else FakeStore(areas or {})
    hass.data[DOMAIN][DATA_CONDITIONS] = dict(conditions or {})
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
        await async_apply_scene(hass, "area", "missing")


async def test_happy_path_calls_service_for_matching_scene(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    conditions = {"tod": FixedCondition("evening")}
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {"tod": "morning"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 10},
                        }
                    ],
                },
                {
                    "category": "lighting",
                    "when": {"tod": "evening"},
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
        conditions=conditions,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.b"]
    assert calls[0].data["brightness_pct"] == 30


async def test_defaults_merged_with_scene_params(hass: HomeAssistant) -> None:
    """Settings defaults are applied even when the scene doesn't set them."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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

    await async_apply_scene(hass, "area", "lr")

    assert len(calls) == 1
    assert calls[0].data["brightness_pct"] == 60
    assert calls[0].data["transition"] == 1.5


async def test_scene_params_override_defaults(hass: HomeAssistant) -> None:
    """If both defaults + scene params set a key, the scene wins (later-wins via spread)."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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

    await async_apply_scene(hass, "area", "lr")

    assert calls[0].data["transition"] == 3.0


async def test_no_match_is_silent_noop(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    conditions = {"tod": FixedCondition("evening")}
    areas = {
        "lr": {
            "scenes": [
                {"when": {"tod": "morning"}, "actions": []},
            ],
        }
    }
    _install(hass, areas=areas, conditions=conditions)
    await async_apply_scene(hass, "area", "lr")
    assert calls == []


async def test_snapshot_failure_treats_condition_as_unresolved(
    hass: HomeAssistant,
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    conditions = {"tod": FixedCondition("evening"), "weather": FailingCondition()}
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {"weather": "rainy"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 10},
                        }
                    ],
                },
                {
                    "category": "lighting",
                    "when": {},
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
        conditions=conditions,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.b"]
    assert calls[0].data["brightness_pct"] == 20


async def test_malformed_action_skipped_other_actions_run(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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
    await async_apply_scene(hass, "area", "lr")

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]
    assert "malformed action" in caplog.text


async def test_unexposed_service_skipped_with_warning(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """A scene referencing a not-exposed service should be skipped and warned."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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
    await async_apply_scene(hass, "area", "lr")

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
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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

    await async_apply_scene(hass, "area", "lr")

    # The failing turn_on raised, but turn_off still completed.
    assert len(off_calls) == 1
    assert off_calls[0].data["entity_id"] == ["light.b"]


async def test_cancellation_treated_as_failure_isolation(
    hass: HomeAssistant,
) -> None:
    """A CancelledError (BaseException, not Exception) must still be isolated."""

    class CancelledCondition:
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
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
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
        conditions={"tod": CancelledCondition()},
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "area", "lr")

    # Wildcard scene should still match (cancelled snapshot becomes None).
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.a"]


async def test_apply_scene_with_no_entity_ids_omits_target(
    hass: HomeAssistant,
) -> None:
    """Actions with no entity_ids should be dispatched without a target."""
    calls = async_mock_service(hass, "script", "foo")
    areas = {
        "lr": {
            "scenes": [
                {
                    "category": "scripts",
                    "when": {},
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

    await async_apply_scene(hass, "area", "lr")

    assert len(calls) == 1
    assert calls[0].data.get("entity_id") is None
    assert calls[0].data["message"] == "hi"


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
        self._house = house or {"scenes": []}

    def get_area(self, area_id):
        return self._areas.get(area_id)

    def get_floor(self, floor_id):
        return self._floors.get(floor_id)

    def get_house(self):
        return dict(self._house)

    def categories(self):
        return []


async def test_async_resolve_only_floor_routes_to_floor_store(hass: HomeAssistant) -> None:
    """Calling with scope_kind='floor' resolves against the floor's scenes."""
    floors = {
        "upstairs": {
            "scenes": [
                {
                    "name": "movie",
                    "when": {},
                    "actions": [],
                }
            ],
        }
    }
    _install(hass, store=FakeScopeStore(floors=floors))

    plan = await async_resolve_only(hass, "floor", "upstairs")
    assert plan["scene_name"] == "movie"


async def test_async_resolve_only_house_routes_to_house_store(hass: HomeAssistant) -> None:
    house = {
        "scenes": [{"name": "away", "when": {}, "actions": []}],
    }
    _install(hass, store=FakeScopeStore(house=house))

    plan = await async_resolve_only(hass, "house", None)
    assert plan["scene_name"] == "away"


async def test_async_resolve_only_unknown_floor_raises(hass: HomeAssistant) -> None:
    _install(hass, store=FakeScopeStore())

    with pytest.raises(ServiceValidationError, match="unknown_floor"):
        await async_resolve_only(hass, "floor", "nonexistent")


async def test_async_apply_scene_floor_runs_floor_actions(hass: HomeAssistant) -> None:
    """apply_scene with scope_kind='floor' executes the matched floor scene's actions."""
    calls = async_mock_service(hass, "light", "turn_on")
    floors = {
        "upstairs": {
            "scenes": [
                {
                    "name": "movie",
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.up_a"],
                            "params": {"brightness_pct": 25},
                        }
                    ],
                }
            ],
        }
    }
    _install(
        hass,
        store=FakeScopeStore(floors=floors),
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    await async_apply_scene(hass, "floor", "upstairs")

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

    areas = {"a": {"scenes": [{"name": "r", "when": {"tod": "evening"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": ExplodingSnapshot()},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(hass, "area", "a", {"tod": "evening"})
    assert plan["matched_scene_index"] == 0
    assert plan["scene_name"] == "r"
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

    areas = {"a": {"scenes": [{"name": "r", "when": {"tod": "morning"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": T()},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(hass, "area", "a", {"tod": "evening"})
    assert plan["matched_scene_index"] is None
    assert plan["actions"] == []


def _switch(on: bool) -> SimpleNamespace:
    return SimpleNamespace(is_on=on)


async def test_apply_scene_records_last_applied_scene(hass: HomeAssistant) -> None:
    areas = {
        "a": {
            "scenes": [
                {"name": "r", "category": "lighting", "when": {"tod": "evening"}, "actions": []}
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "lighting")] == 0


async def test_apply_scene_switch_off_does_not_record(hass: HomeAssistant) -> None:
    areas = {"a": {"scenes": [{"name": "r", "when": {"tod": "evening"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "a"): _switch(False)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_apply_scene_no_match_does_not_record(hass: HomeAssistant) -> None:
    areas = {"a": {"scenes": [{"name": "r", "when": {"tod": "morning"}, "actions": []}]}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    await async_apply_scene(hass, "area", "a")
    assert ("area", "a") not in hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})


async def test_execute_plan_dispatches_actions_and_records_last_applied(
    hass: HomeAssistant,
) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    exposed = ExposedActionsStore(_FakeExposedStorage([_exposed("light.turn_on")]))
    hass.data[DOMAIN] = {DATA_EXPOSED_ACTIONS: exposed, DATA_STORE: FakeStore({})}
    plan = {
        "matched_scene_index": 3,
        "scene_name": None,
        "actions": [
            {"service": "light.turn_on", "entity_ids": ["light.a"], "params": {"brightness": 50}}
        ],
    }
    await async_execute_plan(hass, "area", "a", plan, "lighting")
    assert len(calls) == 1
    assert calls[0].data["brightness"] == 50
    assert calls[0].data["entity_id"] == ["light.a"]
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "lighting")] == 3


async def test_resolve_with_snapshots_category_filters_to_category_scenes(
    hass: HomeAssistant,
) -> None:
    """Resolving with category= returns the first match within that category only,
    and matched_scene_index is the GLOBAL index in the scope's scenes list."""
    areas = {
        "lr": {
            "scenes": [
                {
                    "name": "lighting-scene",
                    "category": "lighting",
                    "when": {},
                    "actions": [],
                },
                {
                    "name": "blinds-scene",
                    "category": "blinds",
                    "when": {},
                    "actions": [],
                },
            ],
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
    }

    plan_blinds = await async_resolve_with_snapshots(hass, "area", "lr", {}, category="blinds")
    assert plan_blinds["matched_scene_index"] == 1
    assert plan_blinds["scene_name"] == "blinds-scene"

    plan_lighting = await async_resolve_with_snapshots(hass, "area", "lr", {}, category="lighting")
    assert plan_lighting["matched_scene_index"] == 0
    assert plan_lighting["scene_name"] == "lighting-scene"


async def test_resolve_with_snapshots_no_category_returns_first_overall_match(
    hass: HomeAssistant,
) -> None:
    """Without a category argument, the first overall match wins (existing behavior)."""
    areas = {
        "lr": {
            "scenes": [
                {
                    "name": "lighting-scene",
                    "category": "lighting",
                    "when": {},
                    "actions": [],
                },
                {
                    "name": "blinds-scene",
                    "category": "blinds",
                    "when": {},
                    "actions": [],
                },
            ],
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
    }

    plan = await async_resolve_with_snapshots(hass, "area", "lr", {})
    assert plan["matched_scene_index"] == 0
    assert plan["scene_name"] == "lighting-scene"


async def test_last_applied_is_keyed_by_category(hass: HomeAssistant) -> None:
    from custom_components.ambience.const import DATA_LAST_APPLIED, DOMAIN
    from custom_components.ambience.service import get_last_applied

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_LAST_APPLIED] = {("area", "lr", "lighting"): 3}
    assert get_last_applied(hass, "area", "lr", "lighting") == 3
    assert get_last_applied(hass, "area", "lr", "blinds") is None


async def test_execute_plan_records_last_applied_even_when_all_actions_skip(
    hass: HomeAssistant,
) -> None:
    # No actions exposed → every action is skipped, but the scene was still the
    # winner, so last_applied must record it (the guard tracks selection).
    calls = async_mock_service(hass, "light", "turn_on")
    exposed = ExposedActionsStore(_FakeExposedStorage([]))  # nothing exposed
    hass.data[DOMAIN] = {DATA_EXPOSED_ACTIONS: exposed, DATA_STORE: FakeStore({})}
    plan = {
        "matched_scene_index": 2,
        "scene_name": None,
        "actions": [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {}}],
    }
    await async_execute_plan(hass, "area", "a", plan, "lighting")
    assert calls == []  # action skipped (unexposed)
    assert hass.data[DOMAIN][DATA_LAST_APPLIED][("area", "a", "lighting")] == 2


class _ExposedStub:
    def __init__(self, entries: dict[str, dict]) -> None:
        self._entries = entries

    def get(self, service_id: str):
        return self._entries.get(service_id)


def test_effective_reapply_uses_action_key_when_present():
    exposed = _ExposedStub({"light.turn_on": {"reapply_seconds": 300}})
    action = {"service": "light.turn_on", "reapply_seconds": 60}
    assert effective_reapply_seconds(action, exposed) == 60


def test_effective_reapply_inherits_exposed_default_when_key_absent():
    exposed = _ExposedStub({"light.turn_on": {"reapply_seconds": 300}})
    action = {"service": "light.turn_on"}
    assert effective_reapply_seconds(action, exposed) == 300


def test_effective_reapply_action_zero_overrides_exposed_default():
    exposed = _ExposedStub({"light.turn_on": {"reapply_seconds": 300}})
    action = {"service": "light.turn_on", "reapply_seconds": 0}
    assert effective_reapply_seconds(action, exposed) == 0


def test_effective_reapply_off_when_nothing_set():
    exposed = _ExposedStub({"light.turn_on": {}})
    action = {"service": "light.turn_on"}
    assert effective_reapply_seconds(action, exposed) == 0


def test_effective_reapply_below_floor_is_off():
    assert effective_reapply_seconds({"service": "x.y", "reapply_seconds": 9}, None) == 0


def test_effective_reapply_bool_value_is_off():
    # bool is a subclass of int; True must not be read as the integer 1.
    assert effective_reapply_seconds({"service": "x.y", "reapply_seconds": True}, None) == 0


def test_effective_reapply_handles_missing_exposed_store():
    action = {"service": "x.y", "reapply_seconds": 30}
    assert effective_reapply_seconds(action, None) == 30


# ---------------------------------------------------------------------------
# scope_reapply_intervals
# ---------------------------------------------------------------------------


def test_scope_reapply_intervals_returns_sorted_distinct():
    cfg = {
        "scenes": [
            {"actions": [{"service": "x.y", "reapply_seconds": 600}]},
            {"actions": [{"service": "x.y", "reapply_seconds": 300}]},
            {"actions": [{"service": "x.y", "reapply_seconds": 600}]},  # duplicate
        ]
    }
    assert scope_reapply_intervals(cfg, None) == [300, 600]


def test_scope_reapply_intervals_empty_when_none():
    cfg = {
        "scenes": [
            {"actions": [{"service": "x.y"}]},
        ]
    }
    assert scope_reapply_intervals(cfg, None) == []


def test_scope_reapply_intervals_empty_when_no_scenes():
    assert scope_reapply_intervals({}, None) == []


def test_scope_reapply_intervals_skips_zero_and_below_floor():
    cfg = {
        "scenes": [
            {"actions": [{"service": "x.y", "reapply_seconds": 0}]},
            {"actions": [{"service": "x.y", "reapply_seconds": 9}]},  # below floor
            {"actions": [{"service": "x.y", "reapply_seconds": 300}]},
        ]
    }
    assert scope_reapply_intervals(cfg, None) == [300]


def test_scope_reapply_intervals_uses_exposed_default():
    exposed = _ExposedStub({"light.turn_on": {"reapply_seconds": 300}})
    cfg = {
        "scenes": [
            {"actions": [{"service": "light.turn_on"}]},  # inherits exposed default
        ]
    }
    assert scope_reapply_intervals(cfg, exposed) == [300]


def test_scope_reapply_intervals_action_zero_suppresses_exposed():
    exposed = _ExposedStub({"light.turn_on": {"reapply_seconds": 300}})
    cfg = {
        "scenes": [
            {"actions": [{"service": "light.turn_on", "reapply_seconds": 0}]},
        ]
    }
    assert scope_reapply_intervals(cfg, exposed) == []


async def test_apply_scene_emits_manual_trace_event(hass: HomeAssistant) -> None:
    """apply_scene must emit a manual-cause TraceEvent with at least one acted unit."""
    # Mirror setup from test_apply_scene_records_last_applied_scene: area 'a',
    # one lighting scene that matches tod=evening, switch on.
    areas = {
        "a": {
            "scenes": [
                {
                    "name": "evening-lights",
                    "category": "lighting",
                    "when": {"tod": "evening"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }

    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    trace_logger = logging.getLogger("custom_components.ambience.trace")
    trace_logger.setLevel(logging.DEBUG)
    try:
        await async_apply_scene(hass, "area", "a")
        assert captured, "expected a manual TraceEvent"
        assert captured[-1].cause.kind == "manual"
        assert any(u.outcome == "acted" for u in captured[-1].units)
    finally:
        trace_logger.setLevel(logging.NOTSET)


async def test_apply_scene_manual_trace_includes_no_match_category(hass: HomeAssistant) -> None:
    """apply_scene must emit a manual TraceEvent with a no_match unit when no scene wins."""
    # Area 'b' has one lighting scene that requires tod=morning, but the condition
    # returns 'evening', so resolution yields no winner → no_match unit.
    areas = {
        "b": {
            "scenes": [
                {
                    "name": "morning-lights",
                    "category": "lighting",
                    "when": {"tod": "morning"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "b"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }

    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    trace_logger = logging.getLogger("custom_components.ambience.trace")
    trace_logger.setLevel(logging.DEBUG)
    try:
        await async_apply_scene(hass, "area", "b")
        assert captured, "expected a manual TraceEvent"
        assert captured[-1].cause.kind == "manual"
        assert any(u.outcome == "no_match" for u in captured[-1].units)
    finally:
        trace_logger.setLevel(logging.NOTSET)


async def test_resolve_with_snapshots_includes_explanation_when_explain(
    hass: HomeAssistant,
) -> None:
    """When explain=True, plan['explanation'] is an Explanation with at least one scene eval."""
    areas = {
        "a": {
            "scenes": [
                {
                    "name": "r",
                    "when": {"tod": "evening"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(
        hass, "area", "a", {"tod": "evening"}, category=None, describe=False, explain=True
    )
    assert plan["explanation"] is not None
    assert len(plan["explanation"].scenes) >= 1
    assert plan["explanation"].winner_index == plan["matched_scene_index"]


async def test_resolve_with_snapshots_omits_explanation_by_default(
    hass: HomeAssistant,
) -> None:
    """When explain is not passed (default False), plan['explanation'] is None."""
    areas = {
        "a": {
            "scenes": [
                {
                    "name": "r",
                    "when": {"tod": "evening"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {},
    }
    plan = await async_resolve_with_snapshots(hass, "area", "a", {"tod": "evening"})
    assert plan.get("explanation") is None


async def test_execute_actions_dispatches_and_leaves_last_applied_untouched(hass):
    calls = []
    hass.services.async_register("light", "turn_on", lambda call: calls.append(call.data))
    entry = {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}
    hass.data[DOMAIN] = {
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage([entry])),
        DATA_LAST_APPLIED: {("area", "kitchen", None): 2},
    }

    await async_execute_actions(
        hass,
        "area",
        "kitchen",
        [{"service": "light.turn_on", "entity_ids": ["light.a"], "params": {"brightness": 5}}],
    )
    await hass.async_block_till_done()

    assert len(calls) == 1
    assert calls[0]["brightness"] == 5
    # Re-apply must NOT change the dedup state.
    assert hass.data[DOMAIN][DATA_LAST_APPLIED] == {("area", "kitchen", None): 2}


# ---------------------------------------------------------------------------
# _scope_config — unknown scope kind (line 58)
# ---------------------------------------------------------------------------


async def test_unknown_scope_kind_raises(hass: HomeAssistant) -> None:
    """A scope_kind that is neither 'area', 'floor', nor 'house' raises ServiceValidationError."""
    _install(hass)
    with pytest.raises(ServiceValidationError, match="unknown_scope_kind"):
        await async_resolve_only(hass, "room", "x")


# ---------------------------------------------------------------------------
# async_resolve_categories_only (lines 205-207, 219-220)
# ---------------------------------------------------------------------------


async def test_resolve_categories_only_returns_plan_per_category(hass: HomeAssistant) -> None:
    """async_resolve_categories_only returns one entry per category, keyed by category id."""
    areas = {
        "lr": {
            "scenes": [
                {"name": "lighting-scene", "category": "lighting", "when": {}, "actions": []},
                {"name": "blinds-scene", "category": "blinds", "when": {}, "actions": []},
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
    }

    result = await async_resolve_categories_only(hass, "area", "lr")

    assert set(result.keys()) == {"lighting", "blinds"}
    assert result["lighting"]["matched_scene_index"] == 0
    assert result["lighting"]["scene_name"] == "lighting-scene"
    assert result["blinds"]["matched_scene_index"] == 1
    assert result["blinds"]["scene_name"] == "blinds-scene"


async def test_resolve_categories_only_empty_scope_returns_empty(hass: HomeAssistant) -> None:
    """A scope with no scenes produces an empty dict."""
    areas = {"lr": {"scenes": []}}
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {},
        DATA_SWITCHES: {},
    }

    result = await async_resolve_categories_only(hass, "area", "lr")

    assert result == {}


# ---------------------------------------------------------------------------
# async_apply_scene — no-match with tracing inactive (line 274)
# ---------------------------------------------------------------------------


async def test_apply_scene_no_match_no_trace_emits_no_event(hass: HomeAssistant) -> None:
    """When tracing is off and no scene matches, _apply_category returns None so no
    TraceEvent is emitted. Covers the `return None` branch at line 274.

    Tracing is inactive: no DATA_TRACE_BUFFER, trace logger clamped to WARNING.
    A CaptureSink installed but not reachable via emit_trace verifies no event fires.
    """
    areas = {
        "a": {
            "scenes": [
                {
                    "name": "morning",
                    "category": "lighting",
                    "when": {"tod": "morning"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"tod": FixedCondition("evening")},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }
    # Ensure tracing is inactive: no DATA_TRACE_BUFFER, trace logger NOT at DEBUG.
    import logging as _logging

    trace_logger = _logging.getLogger("custom_components.ambience.trace")
    original_level = trace_logger.level
    trace_logger.setLevel(_logging.WARNING)

    captured: list[TraceEvent] = []

    class CaptureSink:
        def emit(self, event: TraceEvent) -> None:
            captured.append(event)

    hass.data[DOMAIN][DATA_TRACE_SINKS] = [CaptureSink()]
    try:
        await async_apply_scene(hass, "area", "a")
    finally:
        trace_logger.setLevel(original_level)

    # No match + tracing inactive → _apply_category returned None → no trace emitted.
    assert captured == []


# ---------------------------------------------------------------------------
# async_apply_scene — category exception in gather (line 297)
# ---------------------------------------------------------------------------


async def test_apply_scene_category_exception_logged_not_raised(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """An exception inside _apply_category is caught by asyncio.gather and warned,
    not re-raised. The remaining categories are unaffected (line 297)."""

    class BoomCondition:
        name = "boom"

        async def snapshot(self, hass):
            return "x"

        def matches(self, predicate, snapshot):
            raise RuntimeError("boom in matches")

        def describe(self, snapshot):
            return None

        def validate_predicate(self, predicate):
            return

    areas = {
        "a": {
            "scenes": [
                {
                    "name": "always",
                    "category": "lighting",
                    "when": {"boom": "x"},
                    "actions": [],
                }
            ]
        }
    }
    hass.data[DOMAIN] = {
        DATA_STORE: FakeStore(areas),
        DATA_CONDITIONS: {"boom": BoomCondition()},
        DATA_SWITCHES: {("area", "a"): _switch(True)},
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_FakeExposedStorage()),
    }

    caplog.set_level(logging.WARNING)
    # Must not raise even though _apply_category raises internally.
    await async_apply_scene(hass, "area", "a")
    assert "category apply failed" in caplog.text


# ---------------------------------------------------------------------------
# async_run_scene_actions (lines 371-385)
# ---------------------------------------------------------------------------


async def test_run_scene_actions_executes_matched_scene_by_index(hass: HomeAssistant) -> None:
    """async_run_scene_actions runs the actions of the named scene index unconditionally."""
    calls = async_mock_service(hass, "light", "turn_on")
    areas = {
        "lr": {
            "scenes": [
                {
                    "name": "evening",
                    "category": "lighting",
                    "when": {"tod": "morning"},  # would normally not match
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 80},
                        }
                    ],
                }
            ]
        }
    }
    _install(
        hass,
        areas=areas,
        exposed=[_exposed("light.turn_on", visible=["brightness_pct"])],
    )

    result = await async_run_scene_actions(hass, "area", "lr", 0)

    assert result == {"ran": 1, "scene_name": "evening"}
    assert len(calls) == 1
    assert calls[0].data["brightness_pct"] == 80


async def test_run_scene_actions_out_of_range_raises(hass: HomeAssistant) -> None:
    """A scene_index that is out of range raises ServiceValidationError."""
    areas = {
        "lr": {
            "scenes": [
                {"name": "only", "when": {}, "actions": []},
            ]
        }
    }
    _install(hass, areas=areas)

    with pytest.raises(ServiceValidationError, match="scene_index out of range"):
        await async_run_scene_actions(hass, "area", "lr", 5)


async def test_run_scene_actions_negative_index_raises(hass: HomeAssistant) -> None:
    """A negative scene_index also raises ServiceValidationError."""
    areas = {
        "lr": {
            "scenes": [
                {"name": "only", "when": {}, "actions": []},
            ]
        }
    }
    _install(hass, areas=areas)

    with pytest.raises(ServiceValidationError, match="scene_index out of range"):
        await async_run_scene_actions(hass, "area", "lr", -1)


async def test_run_scene_actions_no_actions_returns_zero_ran(hass: HomeAssistant) -> None:
    """A scene with no actions returns ran=0; context is None so no logbook call."""
    areas = {
        "lr": {
            "scenes": [
                {"name": "empty-scene", "when": {}, "actions": []},
            ]
        }
    }
    _install(hass, areas=areas)

    result = await async_run_scene_actions(hass, "area", "lr", 0)

    assert result == {"ran": 0, "scene_name": "empty-scene"}


async def test_run_scene_actions_does_not_record_last_applied(hass: HomeAssistant) -> None:
    """async_run_scene_actions must NOT touch DATA_LAST_APPLIED (it is not a resolution)."""
    areas = {
        "lr": {
            "scenes": [
                {
                    "name": "r",
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {},
                        }
                    ],
                }
            ]
        }
    }
    _install(hass, areas=areas, exposed=[_exposed("light.turn_on")])
    async_mock_service(hass, "light", "turn_on")

    await async_run_scene_actions(hass, "area", "lr", 0)

    assert DATA_LAST_APPLIED not in hass.data[DOMAIN]


# ---------------------------------------------------------------------------
# clear_last_applied (lines 427-429)
# ---------------------------------------------------------------------------


def test_clear_last_applied_removes_all_entries_for_scope(hass: HomeAssistant) -> None:
    """clear_last_applied drops every (scope_kind, scope_id, *) entry, leaving others."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_LAST_APPLIED] = {
        ("area", "lr", "lighting"): 0,
        ("area", "lr", "blinds"): 1,
        ("area", "kitchen", "lighting"): 2,  # different scope — must survive
    }

    clear_last_applied(hass, "area", "lr")

    remaining = hass.data[DOMAIN][DATA_LAST_APPLIED]
    assert ("area", "lr", "lighting") not in remaining
    assert ("area", "lr", "blinds") not in remaining
    assert remaining[("area", "kitchen", "lighting")] == 2


def test_clear_last_applied_is_noop_when_key_absent(hass: HomeAssistant) -> None:
    """clear_last_applied is a safe no-op when DATA_LAST_APPLIED has no matching entries."""
    hass.data.setdefault(DOMAIN, {})
    # No DATA_LAST_APPLIED key at all.
    clear_last_applied(hass, "area", "lr")  # must not raise

    hass.data[DOMAIN][DATA_LAST_APPLIED] = {}
    clear_last_applied(hass, "area", "lr")  # must not raise
