"""SetLightAction — new entity_ids/params signature."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.actions.set_light import SetLightAction


def test_validate_rejects_empty_entity_ids() -> None:
    action = SetLightAction()
    with pytest.raises(ValueError, match="at least one target"):
        action.validate_target_params([], {"brightness": 50})


def test_validate_rejects_missing_brightness() -> None:
    action = SetLightAction()
    with pytest.raises(ValueError, match="brightness"):
        action.validate_target_params(["light.a"], {})


def test_validate_rejects_unknown_keys() -> None:
    action = SetLightAction()
    with pytest.raises(ValueError, match="unknown param"):
        action.validate_target_params(["light.a"], {"brightness": 50, "color": "red"})


def test_validate_accepts_valid_shape() -> None:
    SetLightAction().validate_target_params(
        ["light.a", "light.b"],
        {"brightness": 80, "transition": 1.0},
    )


def test_validate_brightness_bounds() -> None:
    action = SetLightAction()
    with pytest.raises(ValueError, match="0..100"):
        action.validate_target_params(["light.a"], {"brightness": 150})
    with pytest.raises(ValueError, match="0..100"):
        action.validate_target_params(["light.a"], {"brightness": -10})


def test_validate_transition_nonnegative() -> None:
    action = SetLightAction()
    with pytest.raises(ValueError, match="transition"):
        action.validate_target_params(["light.a"], {"brightness": 50, "transition": -1})


async def test_execute_turns_on_each_entity(hass: HomeAssistant) -> None:
    on_calls = async_mock_service(hass, "light", "turn_on")
    action = SetLightAction()
    await action.execute(hass, ["light.a", "light.b"], {"brightness": 80, "transition": 0.5})
    assert len(on_calls) == 2
    entities = {c.data["entity_id"] for c in on_calls}
    assert entities == {"light.a", "light.b"}
    # Check params on the first call (both share the same params)
    call_a = next(c for c in on_calls if c.data["entity_id"] == "light.a")
    assert call_a.data["brightness_pct"] == 80
    assert call_a.data["transition"] == 0.5


async def test_execute_zero_brightness_turns_off(hass: HomeAssistant) -> None:
    on_calls = async_mock_service(hass, "light", "turn_on")
    off_calls = async_mock_service(hass, "light", "turn_off")
    action = SetLightAction()
    await action.execute(hass, ["light.a"], {"brightness": 0})
    assert len(on_calls) == 0
    assert len(off_calls) == 1
    assert off_calls[0].data["entity_id"] == "light.a"
