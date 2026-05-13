"""Tests for the Ambience integration setup."""

from __future__ import annotations

import json
from pathlib import Path

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_ACTIONS,
    DATA_MATCHERS,
    DATA_STORE,
    DOMAIN,
)

MANIFEST_PATH = Path(__file__).parent.parent / "custom_components" / "ambience" / "manifest.json"


def test_manifest_has_required_keys() -> None:
    """manifest.json must contain HA's required keys with correct domain."""
    manifest = json.loads(MANIFEST_PATH.read_text())
    assert manifest["domain"] == DOMAIN
    assert manifest["name"]
    assert manifest["version"]
    assert manifest["config_flow"] is True


async def test_setup_and_unload_entry(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Setting up the config entry should succeed and unloading should clean up."""
    mock_config_entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.LOADED

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.NOT_LOADED


async def test_setup_seeds_registries_and_store(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    data = hass.data[DOMAIN]
    assert DATA_STORE in data
    assert "time_of_day" in data[DATA_MATCHERS]
    assert "set_light" in data[DATA_ACTIONS]


async def test_setup_registers_apply_scene_service(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert hass.services.has_service(DOMAIN, "apply_scene")


async def test_unload_clears_data(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert not hass.services.has_service(DOMAIN, "apply_scene")
