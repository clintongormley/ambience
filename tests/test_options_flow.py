"""Tests for the Ambience options flow and panel/card frontend wiring."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import CONF_SHOW_SIDEBAR_PANEL


async def test_options_flow_shows_form_and_saves(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "init"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_SHOW_SIDEBAR_PANEL: False}
    )
    await hass.async_block_till_done()

    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert mock_config_entry.options[CONF_SHOW_SIDEBAR_PANEL] is False
