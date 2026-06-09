"""Tests for the Ambience config flow (user-initiated setup)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DOMAIN


async def test_user_step_creates_entry(hass: HomeAssistant) -> None:
    """Initiating the user flow with no existing entry creates a config entry."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})

    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Ambience"
    assert result["data"] == {}


async def test_user_step_aborts_when_already_configured(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A second setup attempt is aborted with single_instance_allowed."""
    mock_config_entry.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})

    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_async_step_user_guard_aborts_when_called_directly(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Defense-in-depth: the step's own single-instance guard aborts even when
    reached directly. HA's single_config_entry manager check normally aborts
    before the step runs, so this exercises the in-step guard explicitly."""
    from custom_components.ambience.config_flow import AmbienceConfigFlow

    mock_config_entry.add_to_hass(hass)
    flow = AmbienceConfigFlow()
    flow.hass = hass
    flow.handler = DOMAIN

    result = await flow.async_step_user()

    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"
