"""Tests for the Ambience integration setup."""

from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components import ambience as ambience_init
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES_PENDING,
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


async def test_setup_clears_a_stale_pending_switch_claim(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """hass.data[DOMAIN] outlives a setup that raised, so a pending-add claim
    from the failed attempt must not survive into the next one — it would block
    that scope's switch until the claim's TTL expired."""
    # Claimed just now, so reconcile's TTL sweep would not clear it either.
    hass.data[DOMAIN] = {DATA_SWITCHES_PENDING: {("house", None): time.monotonic()}}
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert hass.states.get("switch.house_ambience") is not None
    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES_PENDING]


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
    # ExposedActionsStore is wired up; fresh setup seeds the built-in on/off actions.
    assert DATA_EXPOSED_ACTIONS in data
    seeded_ids = {e["id"] for e in data[DATA_EXPOSED_ACTIONS].list()}
    assert {"ambience.turn_on", "ambience.turn_off"} <= seeded_ids


async def test_setup_labels_builtin_actions_from_service_catalog(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Seeded built-ins get their service-catalog name as the label — the same
    source (and thus the same localized name / English fallback) a manual add
    uses — so they're no longer stored with an empty label."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    labels = {e["id"]: e["label"] for e in hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].list()}
    assert labels["ambience.turn_on"] == "Turn on"
    assert labels["ambience.turn_off"] == "Turn off"


async def test_setup_leaves_label_empty_when_catalog_has_no_name(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Degraded catalog (no name resolved) → label left empty (the frontend
    falls back to a derived name), and the one-time flag is not set so a later
    start retries."""
    mock_config_entry.add_to_hass(hass)
    with patch("custom_components.ambience.get_service_schema", return_value={"name": None}):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    labels = {e["id"]: e["label"] for e in hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].list()}
    assert labels["ambience.turn_on"] == ""
    assert labels["ambience.turn_off"] == ""


async def test_setup_skips_catalog_lookups_once_labelled(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Once the built-ins are labelled, a later setup must not resolve service
    names from the catalog again (no catalog-build work pulled into setup)."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    with patch("custom_components.ambience.get_service_schema") as mock_schema:
        assert await hass.config_entries.async_reload(mock_config_entry.entry_id)
        await hass.async_block_till_done()
    mock_schema.assert_not_called()

    labels = {e["id"]: e["label"] for e in hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].list()}
    assert labels["ambience.turn_on"] == "Turn on"  # label survived the reload


async def test_script_condition_is_registered(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    assert "script" in conditions
    assert conditions["script"].priority == 975


async def test_unavailable_condition_has_highest_priority(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Unavailable outranks every other condition — including script and
    template — because whether an entity is observable at all is the most
    fundamental world-fact, so it leads the linearisation tiebreaker."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    priorities = {name: cond.priority for name, cond in conditions.items()}
    assert priorities["unavailable"] > priorities["script"]
    assert priorities["unavailable"] > priorities["template"]
    assert priorities["unavailable"] == max(priorities.values())


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


async def test_remove_entry_deletes_persisted_store(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Removing the integration (delete, not just unload) deletes the persisted
    store, so a later re-add starts clean instead of resurrecting old config.
    Unlike async_unload_entry (reload/restart), async_remove_entry runs only on a
    genuine delete, so wiping the single global store file is safe."""
    from homeassistant.helpers.storage import Store

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {"scenes": [{"when": {}, "category": "g", "name": "Evening", "actions": []}]}
    )
    # Sanity: the config is actually on disk before removal.
    assert await Store(hass, 1, "ambience").async_load() is not None

    # async_remove returns {"require_restart": bool} (always truthy), so there's
    # nothing meaningful to assert on it — the store check below is the real test.
    await hass.config_entries.async_remove(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    # The persisted file is gone — a fresh load sees nothing to resurrect.
    assert await Store(hass, 1, "ambience").async_load() is None


async def test_remove_not_resurrected_by_pending_delayed_save(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A delayed save pending at removal time must not fire afterwards and
    recreate the store file. Switch pause/off writes use async_delay_save (1s),
    scheduled on the setup-time Store instance; async_remove_entry deletes the
    file via a *fresh* instance that can't cancel that pending write, so without
    an unload-time flush the orphaned write resurrects .storage/ambience ~1s
    after deletion and a re-add silently restores the old config."""
    from datetime import timedelta

    from homeassistant.helpers.storage import Store
    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {"scenes": [{"when": {}, "category": "g", "name": "Evening", "actions": []}]}
    )
    # Schedule a delayed write the way a switch pause does (async_delay_save, 1s).
    await store.async_set_scope_switch_off_at("house", None, "2099-01-01T00:00:00+00:00")

    # async_remove returns {"require_restart": bool} (always truthy), so there's
    # nothing meaningful to assert on it — the store check below is the real test.
    await hass.config_entries.async_remove(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    # Fire any delayed write that outlived the removal.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()

    assert await Store(hass, 1, "ambience").async_load() is None


async def test_remove_entry_clears_repairs_issues(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Repairs issues raised by Ambience must be cleared on removal. HA's config-
    entry cleanup clears the device and entity registries but NOT the issue
    registry, so without this a deleted integration leaves stale warnings in
    Settings -> Repairs — contradicting the clean-slate intent of removal."""
    from homeassistant.helpers import issue_registry as ir

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    ir.async_create_issue(
        hass,
        DOMAIN,
        "missing_entity_test",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="missing_entity",
    )
    assert any(dom == DOMAIN for dom, _iid in ir.async_get(hass).issues)

    await hass.config_entries.async_remove(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert not any(dom == DOMAIN for dom, _iid in ir.async_get(hass).issues)


async def test_unload_keeps_persisted_store(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A plain unload (reload/restart) must NOT delete the store — only a genuine
    remove does."""
    from homeassistant.helpers.storage import Store

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    await hass.data[DOMAIN][DATA_STORE].async_save_house(
        {"scenes": [{"when": {}, "category": "g", "name": "Evening", "actions": []}]}
    )

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert await Store(hass, 1, "ambience").async_load() is not None


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
        KNOWN_ASSISTANTS,
    )
    from custom_components.ambience.store import DEFAULT_EXPOSED_ASSISTANTS

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
    (data survives); the resulting ConfigEntryState is HA-internal
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


async def test_setup_does_not_stash_create_switches_in_domain_data(hass):
    """create_switches was removed; domain_data must not carry any create_switches key."""
    from custom_components.ambience.const import DATA_STORE

    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="amb_cs",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    # The store (not domain_data) is the source of truth
    assert "create_switches_enabled" not in hass.data[DOMAIN]
    # create_switches is no longer a field in switch defaults
    assert "create_switches" not in hass.data[DOMAIN][DATA_STORE].get_switch_defaults()


def test_manifest_orders_setup_after_frontend() -> None:
    """The integration registers a sidebar panel, websocket commands, and a
    Lovelace resource — frontend must be set up first when it is present.
    after_dependencies (not dependencies) so a stripped/minimal install
    without hass_frontend can still load the integration."""
    manifest = json.loads(MANIFEST_PATH.read_text())
    assert "frontend" in manifest["after_dependencies"]
    assert "frontend" not in manifest["dependencies"]


async def test_unit_applied_signal_arms_reapply_timer(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Dispatching SIGNAL_UNIT_APPLIED after setup should arm the idle-reapply timer."""
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.ambience.const import DATA_ENGINE, SIGNAL_UNIT_APPLIED

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    engine = hass.data[DOMAIN][DATA_ENGINE]
    store = hass.data[DOMAIN][DATA_STORE]

    # Seed the house scope with a scene that has a category so _all_units() is non-empty.
    await store.async_save_house(
        {"scenes": [{"when": {}, "category": "g", "name": "Evening", "actions": []}]}
    )
    engine.async_rebuild()

    # Enable the feature before dispatching the signal.
    await store.async_save_reapply_settings({"enabled": True, "interval_seconds": 60})

    unit = next(iter(engine._all_units()))
    async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, unit)
    await hass.async_block_till_done()

    assert unit in engine._reapply_timers

    # Clean up timers to avoid post-test noise.
    engine._cancel_all_reapply_timers()


async def test_commands_registered_after_engine_stored(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Websocket commands must not be live before the engine is in hass.data.

    A command that reaches for DATA_ENGINE would KeyError in the window between
    registration and the engine being stored.
    """
    from custom_components.ambience import const as ambience_const

    order: list[str] = []
    real_engine_cls = ambience_init.AutoTriggerEngine
    real_register = ambience_init.async_register_commands
    engine_present_at_registration: list[bool] = []

    def _record_engine(*args: object, **kwargs: object) -> object:
        order.append("engine")
        return real_engine_cls(*args, **kwargs)

    def _record_register(hass_arg: HomeAssistant) -> None:
        order.append("commands")
        engine_present_at_registration.append(
            ambience_const.DATA_ENGINE in hass_arg.data.get(DOMAIN, {})
        )
        real_register(hass_arg)

    mock_config_entry.add_to_hass(hass)
    with (
        patch.object(ambience_init, "AutoTriggerEngine", side_effect=_record_engine),
        patch.object(ambience_init, "async_register_commands", side_effect=_record_register),
    ):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()

    assert order == ["engine", "commands"]
    assert engine_present_at_registration == [True]


async def test_static_path_registered_once_per_process(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The panel static path is a process-wide aiohttp resource: reloading the
    entry must not register it again."""
    # Set http up first so hass.http is the instance the integration will use
    # (setting up the entry would otherwise replace the conftest stub mid-test).
    assert await async_setup_component(hass, "http", {})
    register = AsyncMock()
    mock_config_entry.add_to_hass(hass)
    with patch.object(hass.http, "async_register_static_paths", register):
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()

    assert register.call_count == 1


async def test_setup_prewarms_exception_translations(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """The en.json read behind error rendering happens in the executor at setup,
    not on the event loop the first time an error is raised."""
    from custom_components.ambience.errors import _en_exceptions

    _en_exceptions.cache_clear()
    assert _en_exceptions.cache_info().currsize == 0

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert _en_exceptions.cache_info().currsize == 1


# --- Config-health rescans: filtered + debounced -----------------------------


async def _settle_health(hass: HomeAssistant) -> None:
    """Drain any pending config-health debounce."""
    from datetime import timedelta

    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed

    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()


async def _install_with_referenced(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, entity_ids: list[str]
) -> None:
    """Set the entry up with a house scene acting on *entity_ids*, then settle."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {
            "scenes": [
                {
                    "name": "referenced",
                    "when": {},
                    "actions": [{"service": "light.turn_on", "entity_ids": entity_ids}],
                }
            ]
        }
    )
    await _settle_health(hass)


async def test_registry_event_for_unreferenced_entity_does_not_rescan(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A registry event for an entity no Ambience scope references must not
    trigger a config-health scan — HA fires thousands of these at boot."""
    from homeassistant.helpers import entity_registry as er

    await _install_with_referenced(hass, mock_config_entry, ["light.referenced"])

    with patch("custom_components.ambience.config_health_issues.scan", return_value=[]) as spy:
        er.async_get(hass).async_get_or_create(
            "light", "test", "unref-1", suggested_object_id="unreferenced"
        )
        await _settle_health(hass)
        assert spy.call_count == 0


async def test_registry_event_for_referenced_entity_rescans(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A registry event for a referenced entity still reconciles — a returned
    device must clear its Repairs issue."""
    from homeassistant.helpers import entity_registry as er

    await _install_with_referenced(hass, mock_config_entry, ["light.referenced"])

    with patch("custom_components.ambience.config_health_issues.scan", return_value=[]) as spy:
        er.async_get(hass).async_get_or_create(
            "light", "test", "ref-1", suggested_object_id="referenced"
        )
        await _settle_health(hass)
        assert spy.call_count == 1


async def test_rapid_referenced_registry_events_coalesce_into_one_rescan(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Ten referenced-entity registry events inside the cooldown produce one scan."""
    from homeassistant.helpers import entity_registry as er

    referenced = [f"light.ref{i}" for i in range(10)]
    await _install_with_referenced(hass, mock_config_entry, referenced)

    with patch("custom_components.ambience.config_health_issues.scan", return_value=[]) as spy:
        registry = er.async_get(hass)
        for i in range(10):
            registry.async_get_or_create("light", "test", f"ref-{i}", suggested_object_id=f"ref{i}")
        await _settle_health(hass)
        assert spy.call_count == 1


async def test_rename_away_from_referenced_entity_rescans(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """A rename fires under the NEW entity id, so the filter must also match
    `old_entity_id` — otherwise renaming a referenced entity away never raises
    its missing-entity issue."""
    from homeassistant.helpers import entity_registry as er

    await _install_with_referenced(hass, mock_config_entry, ["light.referenced"])
    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        "light", "test", "ref-rename", suggested_object_id="referenced"
    )
    await _settle_health(hass)

    with patch("custom_components.ambience.config_health_issues.scan", return_value=[]) as spy:
        registry.async_update_entity(entry.entity_id, new_entity_id="light.renamed_away")
        await _settle_health(hass)
        assert spy.call_count == 1


async def test_unreadable_storage_raises_a_repairs_issue_and_a_clean_load_clears_it(
    hass: HomeAssistant,
    hass_storage,
) -> None:
    """A malformed payload is left on disk for recovery, so Repairs is the only
    user-visible signal; a later clean load must take the issue back down."""
    from homeassistant.helpers import issue_registry as ir

    from custom_components.ambience.const import STORAGE_KEY, STORAGE_VERSION

    bad = {"not": "a config"}
    stored = {"version": STORAGE_VERSION, "key": STORAGE_KEY, "data": bad}
    hass_storage[STORAGE_KEY] = dict(stored)
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={}, options={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    issue = ir.async_get(hass).async_get_issue(DOMAIN, "storage_unreadable")
    assert issue is not None
    assert issue.severity == ir.IssueSeverity.ERROR
    assert issue.is_fixable is False
    assert issue.translation_placeholders == {"path": f".storage/{STORAGE_KEY}"}

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    # The damaged file must survive setup and unload untouched, and unload must
    # not take the issue down — only a clean load may.
    assert hass_storage[STORAGE_KEY] == stored
    assert ir.async_get(hass).async_get_issue(DOMAIN, "storage_unreadable") is not None

    hass_storage[STORAGE_KEY] = {
        "version": STORAGE_VERSION,
        "key": STORAGE_KEY,
        "data": {"areas": {}},
    }
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    assert ir.async_get(hass).async_get_issue(DOMAIN, "storage_unreadable") is None
