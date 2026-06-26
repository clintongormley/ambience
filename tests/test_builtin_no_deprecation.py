"""Built-in services must not trip the deprecated `hass` arg of async_extract_entity_ids.

HA Core deprecated passing ``hass`` to ``async_extract_entity_ids`` (removed in
2026.10); the helper now derives hass from ``call.hass``.  Each built-in that
extracts entity ids is exercised here and the call must produce no deprecation
warning from ``homeassistant.helpers.service``.
"""

from __future__ import annotations

import logging
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.ambience import builtin_services
from custom_components.ambience.builtin_services import (
    SERVICE_COVER_SAFE_CLOSE,
    SERVICE_COVER_SAFE_OPEN,
    SERVICE_COVER_SAFE_SET_POSITION,
    SERVICE_COVER_SAFE_SET_TILT_POSITION,
    SERVICE_TURN_OFF,
    SERVICE_TURN_ON,
    _extract_entity_ids,
)
from custom_components.ambience.const import DOMAIN

# (service, extra service-call data) for every built-in that extracts entity ids.
_CASES = [
    (SERVICE_TURN_ON, {}),
    (SERVICE_TURN_OFF, {}),
    (SERVICE_COVER_SAFE_OPEN, {}),
    (SERVICE_COVER_SAFE_CLOSE, {}),
    (SERVICE_COVER_SAFE_SET_POSITION, {"position": 50}),
    (SERVICE_COVER_SAFE_SET_TILT_POSITION, {"tilt_position": 50}),
]


@pytest.mark.parametrize(("service", "data"), _CASES)
async def test_builtin_does_not_pass_deprecated_hass_arg(
    hass: HomeAssistant,
    builtin: None,
    caplog: pytest.LogCaptureFixture,
    service: str,
    data: dict[str, object],
) -> None:
    # A state that is "not at goal" for every service (position/tilt 30 differs
    # from the open=100, close=0 and set=50 goals) so each one actually extracts
    # entity ids and forwards a command.
    hass.states.async_set("cover.x", "open", {"current_position": 30, "current_tilt_position": 30})
    # Absorb the downstream homeassistant/cover commands so the call completes.
    for domain, svc in (
        ("homeassistant", "turn_on"),
        ("homeassistant", "turn_off"),
        ("cover", "open_cover"),
        ("cover", "close_cover"),
        ("cover", "set_cover_position"),
        ("cover", "set_cover_tilt_position"),
    ):
        async_mock_service(hass, domain, svc)

    with caplog.at_level(logging.WARNING, logger="homeassistant.helpers.service"):
        await hass.services.async_call(
            DOMAIN, service, dict(data), target={"entity_id": ["cover.x"]}, blocking=True
        )

    offending = [r for r in caplog.records if "async_extract_entity_ids" in r.getMessage()]
    assert not offending, offending[0].getMessage() if offending else ""


# The two unit tests below force each branch of the wrapper with a fake helper to
# assert the forwarding shape (which positional args reach HA's helper). Real
# extraction against the installed HA is covered by the parametrized test above.
async def test_extract_omits_hass_on_modern_ha(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """On HA where hass is deprecated, the wrapper calls the helper with call only."""
    fake = AsyncMock(return_value={"light.a"})
    monkeypatch.setattr(builtin_services, "_ha_extract_entity_ids", fake)
    monkeypatch.setattr(builtin_services, "_EXTRACT_WANTS_HASS", False)
    call = object()

    result = await _extract_entity_ids(hass, call)

    assert result == {"light.a"}
    fake.assert_awaited_once_with(call)


async def test_extract_passes_hass_on_min_ha(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """On min HA (2025.2) the helper still requires hass as the first positional arg."""
    fake = AsyncMock(return_value={"light.a"})
    monkeypatch.setattr(builtin_services, "_ha_extract_entity_ids", fake)
    monkeypatch.setattr(builtin_services, "_EXTRACT_WANTS_HASS", True)
    call = object()

    result = await _extract_entity_ids(hass, call)

    assert result == {"light.a"}
    fake.assert_awaited_once_with(hass, call)
