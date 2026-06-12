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
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
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
    assert "time_of_day" in data[DATA_CONDITIONS]
    assert "scene" not in data[DATA_CONDITIONS]
    # ExposedActionsStore is wired up; fresh setup starts empty.
    assert DATA_EXPOSED_ACTIONS in data
    assert data[DATA_EXPOSED_ACTIONS].list() == []


async def test_script_condition_is_registered(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    assert "script" in conditions
    assert conditions["script"].priority == 975


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
    await store.async_save_area(area.id, {"extra": [], "conditions": [], "scenes": []})
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
    await store.async_save_floor(entry.floor_id, {"scenes": []})
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
            "areas": {"ghost_area": {"scenes": []}},
            "floors": {},
            "house": {"scenes": []},
            "conditions": {},
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
            "floors": {"ghost_floor": {"scenes": []}},
            "house": {"scenes": []},
            "conditions": {},
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


def test_hash_bundle_returns_missing_on_oserror(tmp_path: Path) -> None:
    """_hash_bundle returns 'missing' when the file does not exist (OSError path)."""
    from custom_components.ambience import _hash_bundle

    absent = tmp_path / "no_such_file.js"
    assert _hash_bundle(absent) == "missing"


async def test_setup_without_sidebar_panel_does_not_register_panel(
    hass: HomeAssistant,
) -> None:
    """When CONF_SHOW_SIDEBAR_PANEL is False the panel is not registered (256->279 false branch)."""
    from custom_components.ambience.const import CONF_SHOW_SIDEBAR_PANEL

    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_SHOW_SIDEBAR_PANEL: False},
        unique_id="ambience_no_panel",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    panels = hass.data.get("frontend_panels", {})
    assert "ambience" not in panels


async def test_update_listener_triggers_reload(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Updating config entry options reloads the entry (line 307 — _async_update_listener body)."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert mock_config_entry.state is ConfigEntryState.LOADED

    # Trigger the update listener by updating options on the entry.
    hass.config_entries.async_update_entry(mock_config_entry, options={"show_sidebar_panel": True})
    await hass.async_block_till_done()

    # After the reload the entry should still be loaded.
    assert mock_config_entry.state is ConfigEntryState.LOADED


def test_exposure_constants_shape():
    from custom_components.ambience.const import (
        ASSISTANT_FIELDS,
        DEFAULT_EXPOSED_ASSISTANTS,
        KNOWN_ASSISTANTS,
    )

    assert KNOWN_ASSISTANTS == ("conversation", "cloud.google_assistant", "cloud.alexa")
    # Assist exposed by default; Google/Alexa off.
    assert DEFAULT_EXPOSED_ASSISTANTS == {
        "conversation": True,
        "cloud.google_assistant": False,
        "cloud.alexa": False,
    }
    # Every known assistant has a safe (dot-free) form field name.
    assert set(ASSISTANT_FIELDS) == set(KNOWN_ASSISTANTS)
    assert all("." not in field for field in ASSISTANT_FIELDS.values())


async def test_unload_aborts_when_platform_unload_fails(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """If the switch platform fails to unload, async_unload_entry must return
    False (so it does NOT tear down hass.data[DOMAIN]) — that would leave live
    entities referencing a missing store. We assert what our code controls
    (data + the service survive); the resulting ConfigEntryState is HA-internal
    bookkeeping that differs across versions (FAILED_UNLOAD on recent, LOADED on
    the min pin), so we only require the entry was NOT cleanly unloaded."""
    from unittest.mock import AsyncMock, patch

    mock_config_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    with patch.object(
        hass.config_entries, "async_unload_platforms", new=AsyncMock(return_value=False)
    ):
        await hass.config_entries.async_unload(mock_config_entry.entry_id)
        await hass.async_block_till_done()

    assert mock_config_entry.state is not ConfigEntryState.NOT_LOADED
    assert DOMAIN in hass.data
    assert hass.services.has_service(DOMAIN, "apply_scene")


async def test_setup_stashes_create_switches_flag(hass):
    from custom_components.ambience.const import CONF_CREATE_SWITCHES, DATA_CREATE_SWITCHES, DOMAIN

    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_CREATE_SWITCHES: True},
        unique_id="amb_cs",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_CREATE_SWITCHES] is True


async def test_setup_create_switches_defaults_false(hass):
    from custom_components.ambience.const import DATA_CREATE_SWITCHES, DOMAIN

    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="amb_cs_default"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_CREATE_SWITCHES] is False


def test_manifest_orders_setup_after_frontend() -> None:
    """The integration registers a sidebar panel, websocket commands, and a
    Lovelace resource — frontend must be set up first when it is present.
    after_dependencies (not dependencies) so a stripped/minimal install
    without hass_frontend can still load the integration."""
    manifest = json.loads(MANIFEST_PATH.read_text())
    assert "frontend" in manifest["after_dependencies"]
    assert "frontend" not in manifest["dependencies"]
