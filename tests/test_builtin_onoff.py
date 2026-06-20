"""Built-in ambience.turn_on / ambience.turn_off handlers."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.builtin_services import (
    SERVICE_TURN_OFF,
    SERVICE_TURN_ON,
    async_register_builtin_services,
)
from custom_components.ambience.const import DOMAIN


@pytest.fixture
def builtin(hass: HomeAssistant) -> None:
    async_register_builtin_services(hass)


async def _call(hass: HomeAssistant, service: str, entity_ids: list[str]) -> None:
    await hass.services.async_call(
        DOMAIN, service, {}, target={"entity_id": entity_ids}, blocking=True
    )


async def test_turn_on_skips_entities_already_on(hass: HomeAssistant, builtin: None) -> None:
    hass.states.async_set("light.a", "on")
    hass.states.async_set("light.b", "off")
    calls = async_mock_service(hass, "homeassistant", "turn_on")

    await _call(hass, SERVICE_TURN_ON, ["light.a", "light.b"])

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.b"]


async def test_turn_on_all_already_on_makes_no_call(hass: HomeAssistant, builtin: None) -> None:
    hass.states.async_set("light.a", "on")
    calls = async_mock_service(hass, "homeassistant", "turn_on")

    await _call(hass, SERVICE_TURN_ON, ["light.a"])

    assert calls == []


async def test_turn_on_sends_when_state_missing(hass: HomeAssistant, builtin: None) -> None:
    calls = async_mock_service(hass, "homeassistant", "turn_on")

    await _call(hass, SERVICE_TURN_ON, ["light.ghost"])

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["light.ghost"]


async def test_turn_on_sends_when_unavailable(hass: HomeAssistant, builtin: None) -> None:
    hass.states.async_set("light.a", "unavailable")
    calls = async_mock_service(hass, "homeassistant", "turn_on")

    await _call(hass, SERVICE_TURN_ON, ["light.a"])

    assert len(calls) == 1


async def test_turn_on_sends_to_fuzzy_active_domain(hass: HomeAssistant, builtin: None) -> None:
    # media_player "playing" is not literally "on" → falls through and is sent.
    hass.states.async_set("media_player.tv", "playing")
    calls = async_mock_service(hass, "homeassistant", "turn_on")

    await _call(hass, SERVICE_TURN_ON, ["media_player.tv"])

    assert len(calls) == 1


async def test_turn_off_skips_entities_already_off(hass: HomeAssistant, builtin: None) -> None:
    hass.states.async_set("switch.a", "off")
    hass.states.async_set("switch.b", "on")
    calls = async_mock_service(hass, "homeassistant", "turn_off")

    await _call(hass, SERVICE_TURN_OFF, ["switch.a", "switch.b"])

    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["switch.b"]


async def test_turn_off_sends_when_state_missing(hass: HomeAssistant, builtin: None) -> None:
    calls = async_mock_service(hass, "homeassistant", "turn_off")

    await _call(hass, SERVICE_TURN_OFF, ["switch.ghost"])

    assert len(calls) == 1


async def test_turn_off_all_already_off_makes_no_call(hass: HomeAssistant, builtin: None) -> None:
    hass.states.async_set("switch.a", "off")
    calls = async_mock_service(hass, "homeassistant", "turn_off")

    await _call(hass, SERVICE_TURN_OFF, ["switch.a"])

    assert calls == []
