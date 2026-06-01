"""Tests for the Ambience options flow and panel/card frontend wiring."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    CONF_SHOW_SIDEBAR_PANEL,
    DOMAIN,
)


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


async def test_panel_registered_by_default(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.async_register_built_in_panel") as mock_register:
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_register.assert_called_once()


async def test_panel_not_registered_when_option_off(
    hass: HomeAssistant,
) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_SHOW_SIDEBAR_PANEL: False},
        unique_id="ambience_unique",
    )
    entry.add_to_hass(hass)
    with patch("custom_components.ambience.async_register_built_in_panel") as mock_register:
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    mock_register.assert_not_called()


async def test_toggling_option_reloads_entry(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    with patch(
        "homeassistant.config_entries.ConfigEntries.async_reload",
        new_callable=AsyncMock,
    ) as mock_reload:
        result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
        await hass.config_entries.options.async_configure(
            result["flow_id"], {CONF_SHOW_SIDEBAR_PANEL: False}
        )
        await hass.async_block_till_done()
    mock_reload.assert_called_once_with(mock_config_entry.entry_id)


async def test_card_loader_registered_via_extra_js(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.add_extra_js_url") as mock_add:
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_add.assert_called_once()
    url = mock_add.call_args.args[1]
    assert "ambience-card.js" in url
    assert "fe=" in url  # frontend chunk hash forwarded for cache-busting


async def test_card_loader_registered_even_when_panel_off(
    hass: HomeAssistant,
) -> None:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_SHOW_SIDEBAR_PANEL: False},
        unique_id="ambience_unique",
    )
    entry.add_to_hass(hass)
    with patch("custom_components.ambience.add_extra_js_url") as mock_add:
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    mock_add.assert_called_once()


async def test_card_loader_removed_on_unload(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.add_extra_js_url"):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    with patch("custom_components.ambience.remove_extra_js_url") as mock_remove:
        assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_remove.assert_called_once()
