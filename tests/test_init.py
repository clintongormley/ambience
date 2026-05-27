"""Tests for the Ambience integration setup."""

from __future__ import annotations

import json
import logging
from pathlib import Path

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_EXPOSED_ACTIONS,
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
    assert "scene" in data[DATA_MATCHERS]
    assert "time_of_day" in data[DATA_MATCHERS]
    # ExposedActionsStore is wired up; fresh setup starts empty.
    assert DATA_EXPOSED_ACTIONS in data
    assert data[DATA_EXPOSED_ACTIONS].list() == []


async def test_script_matcher_is_registered(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    matchers = hass.data[DOMAIN][DATA_MATCHERS]
    assert "script" in matchers
    assert matchers["script"].priority == 25


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


async def test_panel_is_registered(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The Ambience panel should appear under /ambience after setup."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    panels = hass.data.get("frontend_panels", {})
    assert "ambience" in panels
    panel = panels["ambience"]
    assert panel.frontend_url_path == "ambience"
    assert panel.config["_panel_custom"]["name"] == "ambience-panel"


async def test_panel_url_has_cache_buster(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The panel module_url carries a content hash so browsers reload after a rebuild."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    panels = hass.data.get("frontend_panels", {})
    module_url = panels["ambience"].config["_panel_custom"]["module_url"]
    assert module_url.startswith("/ambience-panel/ambience-panel.js?hash=")
    assert len(module_url.split("?hash=")[1]) > 0


async def test_area_registry_removal_deletes_ambience_config(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Deleting an HA area removes the matching Ambience config automatically."""
    area = ar.async_get(hass).async_create("Garage")
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(area.id, {"scenes": [], "matchers": [], "rules": []})
    assert store.get_area(area.id) is not None

    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()

    assert store.get_area(area.id) is None


async def test_floor_remove_event_deletes_floor_config(
    hass: HomeAssistant, mock_config_entry
) -> None:
    """Removing a floor from HA's registry drops its Ambience config."""
    from homeassistant.helpers import floor_registry as fr

    from custom_components.ambience.const import DATA_STORE

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    reg = fr.async_get(hass)
    entry = reg.async_create("Upstairs")
    store = hass.data["ambience"][DATA_STORE]
    await store.async_save_floor(entry.floor_id, {"rules": [], "auto_sort": True})
    assert store.get_floor(entry.floor_id) is not None

    reg.async_delete(entry.floor_id)
    await hass.async_block_till_done()

    assert store.get_floor(entry.floor_id) is None


async def test_startup_reconciliation_drops_orphan_area(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """An area_id in storage that has no entry in HA's registry is dropped on setup."""
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {"ghost_area": {"rules": [], "auto_sort": True}},
            "floors": {},
            "house": {"rules": [], "auto_sort": True},
            "matchers": {},
        }
    )

    caplog.set_level(logging.INFO)
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_area("ghost_area") is None
    assert "ghost_area" in caplog.text


async def test_startup_reconciliation_drops_orphan_floor(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    caplog: pytest.LogCaptureFixture,
) -> None:
    """A floor_id in storage that has no entry in HA's registry is dropped on setup."""
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {"ghost_floor": {"rules": [], "auto_sort": True}},
            "house": {"rules": [], "auto_sort": True},
            "matchers": {},
        }
    )

    caplog.set_level(logging.INFO)
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_floor("ghost_floor") is None
    assert "ghost_floor" in caplog.text


async def test_panel_is_removed_on_unload(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    panels = hass.data.get("frontend_panels", {})
    assert "ambience" not in panels


async def test_setup_migrates_old_action_shape_and_auto_exposes(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A stored area with an old-shape set_light action is rewritten and
    the implied service is auto-added to the exposed-actions list."""
    from homeassistant.helpers.storage import Store

    area = ar.async_get(hass).async_create("Lounge")

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {
                area.id: {
                    "rules": [
                        {
                            "name": "movie",
                            "when": {"scene": "movie"},
                            "actions": [
                                {
                                    "action": "set_light",
                                    "entity_ids": ["light.a"],
                                    "params": {"brightness": 60, "transition": 1},
                                }
                            ],
                        }
                    ],
                    "auto_sort": True,
                }
            },
            "floors": {},
            "house": {"rules": [], "auto_sort": True},
            "matchers": {},
            "exposed_actions": [],
        }
    )

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    cfg = store.get_area(area.id)
    assert cfg is not None
    new_action = cfg["rules"][0]["actions"][0]
    # Old shape rewritten in place.
    assert "action" not in new_action
    assert new_action["service"] == "light.turn_on"
    assert new_action["params"] == {"brightness_pct": 60, "transition": 1}

    # Service auto-exposed with sensible default visible_fields.
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    entries = {e["id"]: e for e in exposed_store.list()}
    assert "light.turn_on" in entries
    assert set(entries["light.turn_on"]["visible_fields"]) == {
        "brightness_pct",
        "transition",
    }
