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


async def test_options_flow_no_enable_ai_tab_field(hass, mock_config_entry):
    """The AI authoring tab is always shown now, so the options flow no longer
    carries an enable_ai_tab toggle."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    schema_keys = {str(k) for k in result["data_schema"].schema}
    assert "enable_ai_tab" not in schema_keys


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


async def test_options_flow_no_expose_fields(hass, mock_config_entry):
    """Voice-assistant exposure now lives in the store (Advanced page), not options."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    schema_keys = {str(k) for k in result["data_schema"].schema}
    assert {"expose_assist", "expose_google", "expose_alexa"}.isdisjoint(schema_keys)


async def test_card_resource_registered_on_setup(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.async_register_card_resource") as mock_register:
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_register.assert_called_once()
    base_url, card_url = mock_register.call_args.args[1], mock_register.call_args.args[2]
    assert base_url == "/ambience-panel/ambience-card.js"
    assert "ambience-card.js" in card_url
    assert "fe=" in card_url  # frontend chunk hash forwarded for cache-busting


async def test_card_resource_registered_even_when_panel_off(
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
    with patch("custom_components.ambience.async_register_card_resource") as mock_register:
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    mock_register.assert_called_once()


async def test_card_resource_removed_on_unload(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.async_register_card_resource"):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    with patch("custom_components.ambience.async_unregister_card_resource") as mock_unregister:
        assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_unregister.assert_called_once()
    assert "ambience-card.js" in mock_unregister.call_args.args[1]


async def test_options_flow_no_create_switches_field(hass, mock_config_entry):
    """The options flow never carried a create_switches field (switch settings live in the panel)."""  # noqa: E501
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    result = await hass.config_entries.options.async_init(mock_config_entry.entry_id)
    schema_keys = {str(k) for k in result["data_schema"].schema}
    assert "create_switches" not in schema_keys
