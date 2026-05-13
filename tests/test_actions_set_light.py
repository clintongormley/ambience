"""SetLightAction tests."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.actions.set_light import SetLightAction


async def test_set_light_calls_turn_on_with_brightness(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    action = SetLightAction()
    await action.execute(hass, {"light.lamp": {"brightness": 30, "transition": 3}})
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == "light.lamp"
    assert calls[0].data["brightness_pct"] == 30
    assert calls[0].data["transition"] == 3


async def test_set_light_default_transition_zero(hass: HomeAssistant) -> None:
    calls = async_mock_service(hass, "light", "turn_on")
    action = SetLightAction()
    await action.execute(hass, {"light.lamp": {"brightness": 50}})
    assert len(calls) == 1
    assert calls[0].data["transition"] == 0


async def test_set_light_brightness_zero_calls_turn_off(hass: HomeAssistant) -> None:
    on_calls = async_mock_service(hass, "light", "turn_on")
    off_calls = async_mock_service(hass, "light", "turn_off")
    action = SetLightAction()
    await action.execute(hass, {"light.lamp": {"brightness": 0, "transition": 2}})
    assert len(on_calls) == 0
    assert len(off_calls) == 1
    assert off_calls[0].data["entity_id"] == "light.lamp"
    assert off_calls[0].data["transition"] == 2


async def test_set_light_multiple_targets_independent_params(
    hass: HomeAssistant,
) -> None:
    on_calls = async_mock_service(hass, "light", "turn_on")
    off_calls = async_mock_service(hass, "light", "turn_off")
    action = SetLightAction()
    await action.execute(
        hass,
        {
            "light.a": {"brightness": 30, "transition": 1},
            "light.b": {"brightness": 0, "transition": 1},
            "light.c": {"brightness": 80},
        },
    )
    assert len(on_calls) == 2
    assert len(off_calls) == 1
    on_entities = {c.data["entity_id"] for c in on_calls}
    assert on_entities == {"light.a", "light.c"}
    assert off_calls[0].data["entity_id"] == "light.b"


def test_validate_target_params_ok() -> None:
    SetLightAction().validate_target_params("light.x", {"brightness": 50, "transition": 3})
    SetLightAction().validate_target_params("light.x", {"brightness": 0})
    SetLightAction().validate_target_params("light.x", {"brightness": 100})


@pytest.mark.parametrize(
    "params",
    [
        {},
        {"brightness": -1},
        {"brightness": 101},
        {"brightness": "bright"},
        {"brightness": 50, "transition": -1},
        {"brightness": 50, "transition": "slow"},
        {"brightness": 50, "extra": True},
    ],
)
def test_validate_target_params_rejects_bad(params: dict) -> None:
    with pytest.raises(ValueError):
        SetLightAction().validate_target_params("light.x", params)
