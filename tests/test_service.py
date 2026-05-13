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
from custom_components.ambience.service import async_apply_scene


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
        self.executions: list[dict] = []

    async def execute(self, hass, targets):
        self.executions.append(dict(targets))

    def validate_target_params(self, entity_id, params):
        return


class FakeStore:
    def __init__(self, areas: dict) -> None:
        self._areas = areas

    def get_area(self, area_id):
        return self._areas.get(area_id)


def _install(hass: HomeAssistant, *, areas: dict, matchers: dict, actions: dict) -> None:
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_STORE] = FakeStore(areas)
    hass.data[DOMAIN][DATA_MATCHERS] = matchers
    hass.data[DOMAIN][DATA_ACTIONS] = actions


async def test_unknown_area_raises(hass: HomeAssistant) -> None:
    _install(hass, areas={}, matchers={}, actions={})
    with pytest.raises(ServiceValidationError, match="unknown_area"):
        await async_apply_scene(hass, "missing", "movie")


async def test_unknown_scene_raises(hass: HomeAssistant) -> None:
    _install(
        hass,
        areas={"lr": {"name": "LR", "scenes": ["movie"], "matchers": [], "rules": []}},
        matchers={},
        actions={},
    )
    with pytest.raises(ServiceValidationError, match="unknown_scene"):
        await async_apply_scene(hass, "lr", "reading")


async def test_happy_path_executes_matching_rule(hass: HomeAssistant) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie", "tod": "morning"},
                    "actions": [{"action": "record", "targets": {"light.a": {"brightness": 10}}}],
                },
                {
                    "when": {"scene": "movie", "tod": "evening"},
                    "actions": [{"action": "record", "targets": {"light.b": {"brightness": 30}}}],
                },
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})

    await async_apply_scene(hass, "lr", "movie")

    assert action.executions == [{"light.b": {"brightness": 30}}]


async def test_no_match_is_silent_noop(hass: HomeAssistant) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod"],
            "rules": [
                {"when": {"scene": "movie", "tod": "morning"}, "actions": []},
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})
    await async_apply_scene(hass, "lr", "movie")
    assert action.executions == []


async def test_snapshot_failure_treats_matcher_as_unresolved(
    hass: HomeAssistant,
) -> None:
    action = RecordingAction()
    matchers = {"tod": FixedMatcher("evening"), "weather": FailingMatcher()}
    areas = {
        "lr": {
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod", "weather"],
            "rules": [
                {
                    "when": {"scene": "movie", "weather": "rainy"},
                    "actions": [{"action": "record", "targets": {"light.a": {"brightness": 10}}}],
                },
                {
                    "when": {"scene": "movie"},
                    "actions": [{"action": "record", "targets": {"light.b": {"brightness": 20}}}],
                },
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": action})

    await async_apply_scene(hass, "lr", "movie")

    assert action.executions == [{"light.b": {"brightness": 20}}]


async def test_unknown_action_skipped_other_actions_run(
    hass: HomeAssistant,
) -> None:
    recorded = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {"action": "nonexistent", "targets": {"x.y": {}}},
                        {
                            "action": "record",
                            "targets": {"light.a": {"brightness": 50}},
                        },
                    ],
                }
            ],
        }
    }
    _install(hass, areas=areas, matchers=matchers, actions={"record": recorded})

    await async_apply_scene(hass, "lr", "movie")

    assert recorded.executions == [{"light.a": {"brightness": 50}}]


async def test_action_failure_does_not_block_other_actions(
    hass: HomeAssistant,
) -> None:
    class FailingAction:
        name = "fail"
        domains = ("light",)

        async def execute(self, hass, targets):
            raise RuntimeError("boom")

        def validate_target_params(self, entity_id, params):
            return

    recorded = RecordingAction()
    matchers = {"tod": FixedMatcher("evening")}
    areas = {
        "lr": {
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {"action": "fail", "targets": {"x.y": {}}},
                        {
                            "action": "record",
                            "targets": {"light.a": {"brightness": 50}},
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

    await async_apply_scene(hass, "lr", "movie")

    assert recorded.executions == [{"light.a": {"brightness": 50}}]


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
            "name": "LR",
            "scenes": ["movie"],
            "matchers": ["tod"],
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [{"action": "record", "targets": {"light.a": {"brightness": 10}}}],
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

    await async_apply_scene(hass, "lr", "movie")

    # Wildcard rule should still match (cancelled snapshot becomes None).
    assert action.executions == [{"light.a": {"brightness": 10}}]
