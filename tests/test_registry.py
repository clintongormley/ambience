"""Public registry helpers for matchers and actions."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import DATA_ACTIONS, DATA_MATCHERS, DOMAIN
from custom_components.ambience.registry import register_action, register_matcher


class StubMatcher:
    name = "stub"

    async def snapshot(self, hass):  # pragma: no cover
        return None

    def matches(self, predicate, snapshot):  # pragma: no cover
        return False

    def describe(self, snapshot):  # pragma: no cover
        return None

    def validate_predicate(self, predicate):  # pragma: no cover
        return


class StubAction:
    name = "stub_action"
    domains = ("light",)

    async def execute(self, hass, targets):  # pragma: no cover
        pass

    def validate_target_params(self, entity_id, params):  # pragma: no cover
        return


async def test_register_matcher_stores_in_hass_data(hass: HomeAssistant) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_MATCHERS] = {}
    register_matcher(hass, StubMatcher())
    assert hass.data[DOMAIN][DATA_MATCHERS]["stub"].name == "stub"


async def test_register_matcher_rejects_duplicate(hass: HomeAssistant) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_MATCHERS] = {}
    register_matcher(hass, StubMatcher())
    with pytest.raises(ValueError, match="already registered"):
        register_matcher(hass, StubMatcher())


async def test_register_action_stores_in_hass_data(hass: HomeAssistant) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_ACTIONS] = {}
    register_action(hass, StubAction())
    assert hass.data[DOMAIN][DATA_ACTIONS]["stub_action"].name == "stub_action"


async def test_register_action_rejects_duplicate(hass: HomeAssistant) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_ACTIONS] = {}
    register_action(hass, StubAction())
    with pytest.raises(ValueError, match="already registered"):
        register_action(hass, StubAction())
