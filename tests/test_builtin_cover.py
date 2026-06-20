"""Safe cover built-in handlers — read-before-write skip matrix."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience.builtin_services import (
    SERVICE_COVER_SAFE_CLOSE,
    SERVICE_COVER_SAFE_OPEN,
    SERVICE_COVER_SAFE_SET_POSITION,
    SERVICE_COVER_SAFE_SET_TILT_POSITION,
)
from custom_components.ambience.const import DOMAIN


def _set(hass: HomeAssistant, entity_id: str, state: str, **attrs: object) -> None:
    hass.states.async_set(entity_id, state, dict(attrs))


# --- open ---------------------------------------------------------------


async def test_open_skips_fully_open_by_position(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "open", current_position=100)
    calls = async_mock_service(hass, "cover", "open_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_OPEN, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert calls == []


async def test_open_sends_when_partially_open(hass: HomeAssistant, builtin: None) -> None:
    # 40% still reports "open" — must check position, not state.
    _set(hass, "cover.a", "open", current_position=40)
    calls = async_mock_service(hass, "cover", "open_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_OPEN, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["cover.a"]


async def test_open_sends_when_in_motion(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "opening", current_position=100)
    calls = async_mock_service(hass, "cover", "open_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_OPEN, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert len(calls) == 1


async def test_open_no_position_uses_state(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.open", "open")  # no current_position attr → skip
    _set(hass, "cover.closed", "closed")  # → send
    calls = async_mock_service(hass, "cover", "open_cover")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_OPEN,
        {},
        target={"entity_id": ["cover.open", "cover.closed"]},
        blocking=True,
    )
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["cover.closed"]


async def test_open_sends_when_indeterminate(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "unavailable")
    calls = async_mock_service(hass, "cover", "open_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_OPEN, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert len(calls) == 1


# --- close --------------------------------------------------------------


async def test_close_skips_closed_by_position(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "closed", current_position=0)
    calls = async_mock_service(hass, "cover", "close_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_CLOSE, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert calls == []


async def test_close_no_position_uses_state(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.closed", "closed")  # skip
    _set(hass, "cover.open", "open")  # send
    calls = async_mock_service(hass, "cover", "close_cover")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_CLOSE,
        {},
        target={"entity_id": ["cover.closed", "cover.open"]},
        blocking=True,
    )
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["cover.open"]


async def test_close_sends_when_in_motion(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "closing", current_position=0)
    calls = async_mock_service(hass, "cover", "close_cover")
    await hass.services.async_call(
        DOMAIN, SERVICE_COVER_SAFE_CLOSE, {}, target={"entity_id": ["cover.a"]}, blocking=True
    )
    assert len(calls) == 1


# --- set position -------------------------------------------------------


async def test_set_position_skips_when_already_there(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "open", current_position=50)
    calls = async_mock_service(hass, "cover", "set_cover_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_POSITION,
        {"position": 50},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert calls == []


async def test_set_position_sends_when_different(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "open", current_position=30)
    calls = async_mock_service(hass, "cover", "set_cover_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_POSITION,
        {"position": 50},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert len(calls) == 1
    assert calls[0].data["entity_id"] == ["cover.a"]
    assert calls[0].data["position"] == 50


async def test_set_position_sends_when_in_motion(hass: HomeAssistant, builtin: None) -> None:
    # In motion → destination may be changing → fire even if current == target.
    _set(hass, "cover.a", "opening", current_position=50)
    calls = async_mock_service(hass, "cover", "set_cover_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_POSITION,
        {"position": 50},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert len(calls) == 1


async def test_set_position_passthrough_when_no_position_attr(
    hass: HomeAssistant, builtin: None
) -> None:
    _set(hass, "cover.a", "open")  # no current_position → can't compare → send
    calls = async_mock_service(hass, "cover", "set_cover_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_POSITION,
        {"position": 50},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert len(calls) == 1


# --- set tilt -----------------------------------------------------------


async def test_set_tilt_skips_when_already_there(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "open", current_tilt_position=75)
    calls = async_mock_service(hass, "cover", "set_cover_tilt_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_TILT_POSITION,
        {"tilt_position": 75},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert calls == []


async def test_set_tilt_sends_when_different(hass: HomeAssistant, builtin: None) -> None:
    _set(hass, "cover.a", "open", current_tilt_position=10)
    calls = async_mock_service(hass, "cover", "set_cover_tilt_position")
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COVER_SAFE_SET_TILT_POSITION,
        {"tilt_position": 75},
        target={"entity_id": ["cover.a"]},
        blocking=True,
    )
    assert len(calls) == 1
    assert calls[0].data["tilt_position"] == 75
