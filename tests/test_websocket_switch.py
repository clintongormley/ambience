"""WS commands for switch defaults + per-scope override."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import (
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)


@pytest.fixture
async def installed(hass, mock_config_entry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


@pytest.fixture
def area_id(hass):
    return ar.async_get(hass).async_create("Living Room").id


@pytest.fixture
def floor_id(hass):
    return fr.async_get(hass).async_create("Upstairs").floor_id


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


# --- defaults ---------------------------------------------------------------


async def test_switch_defaults_list(hass, hass_ws_client):
    # Use a fresh entry (no pre-seeded store) to exercise the defaults.
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="ws_defaults"
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    resp = await _ws_send(hass_ws_client, type="ambience/switch_defaults/list")
    assert resp["success"]
    assert resp["result"] == {
        "name": "Ambience",
        "auto_on_delay_seconds": 0,
    }


async def test_switch_defaults_save_fires_None(hass, installed, hass_ws_client):
    fired: list[Any] = []

    # @callback so async_dispatcher_send runs the listener synchronously inline —
    # a bare lambda is dispatched as an executor job and `fired` may not be
    # populated before the assert below (see the dispatcher-test-callback-flake lesson).
    @callback
    def _record(payload: Any) -> None:
        fired.append(payload)

    unsub = async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, _record)
    try:
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/switch_defaults/save",
            name="Master",
            auto_on_delay_seconds=600,
            create_switches=False,
        )
        assert resp["success"]
        assert hass.data[DOMAIN][DATA_STORE].get_switch_defaults() == {
            "name": "Master",
            "auto_on_delay_seconds": 600,
        }
        assert fired == [None]
    finally:
        unsub()


async def test_switch_defaults_save_validation_error(hass, installed, hass_ws_client):
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/switch_defaults/save",
        name="",
        auto_on_delay_seconds=0,
        create_switches=False,
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


# --- per-scope save ---------------------------------------------------------


# --- switches/list ----------------------------------------------------------


async def test_switches_list_returns_entity_id_per_scope(hass, installed, hass_ws_client):
    aid = ar.async_get(hass).async_create("Living Room").id
    fid = fr.async_get(hass).async_create("Upstairs").floor_id
    await hass.async_block_till_done()

    resp = await _ws_send(hass_ws_client, type="ambience/switches/list")
    assert resp["success"]
    by_key = {(e["scope_kind"], e["scope_id"]): e["entity_id"] for e in resp["result"]}
    assert by_key[("house", None)] == "switch.house_ambience"
    assert by_key[("floor", fid)] == "switch.upstairs_floor_ambience"
    assert by_key[("area", aid)] == "switch.living_room_ambience"


async def test_switches_list_reflects_renamed_entity_id(hass, installed, hass_ws_client):
    from homeassistant.helpers import entity_registry as er

    aid = ar.async_get(hass).async_create("Living Room").id
    await hass.async_block_till_done()
    er.async_get(hass).async_update_entity(
        "switch.living_room_ambience", new_entity_id="switch.renamed_lr"
    )
    await hass.async_block_till_done()

    resp = await _ws_send(hass_ws_client, type="ambience/switches/list")
    assert resp["success"]
    by_key = {(e["scope_kind"], e["scope_id"]): e["entity_id"] for e in resp["result"]}
    assert by_key[("area", aid)] == "switch.renamed_lr"


# --- dry_run integration ----------------------------------------------------


async def test_dry_run_includes_switch_state_for_house(hass, installed, hass_ws_client):
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", house=True)
    assert resp["success"]
    assert resp["result"]["switch_state"] in ("on", "off", "unknown")


# --- set_scope_enabled ------------------------------------------------------


async def test_set_scope_enabled_deletes_switch_on_disable(hass, installed, hass_ws_client):
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=False
    )
    assert resp["success"]
    await hass.async_block_till_done()

    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert dr.async_get(hass).async_get_device(identifiers={(DOMAIN, "ambience")}) is None
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is False


async def test_set_scope_enabled_recreates_switch_on_reenable(hass, installed, hass_ws_client):
    from homeassistant.helpers import entity_registry as er

    for enabled in (False, True):
        resp = await _ws_send(
            hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=enabled
        )
        assert resp["success"]
        await hass.async_block_till_done()

    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None
    assert ("house", None) in hass.data[DOMAIN][DATA_SWITCHES]
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is True


async def test_set_scope_enabled_persists_flag_on_fresh_entry(hass, hass_ws_client):
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    # A fresh entry (no pre-seeded store) starts with house enabled by default.
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="ws_fresh",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Disable the house and verify the flag is persisted.
    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=False
    )
    assert resp["success"]
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("house", None) is False


async def test_set_scope_enabled_noop_when_switch_unregistered(hass, installed, hass_ws_client):
    # A real registry area whose ambience switch entity has been removed from
    # the entity registry: the hide/heal block is skipped (entity_id is None)
    # and the call still succeeds + persists the flag.
    from homeassistant.helpers import area_registry as ar
    from homeassistant.helpers import entity_registry as er

    area = ar.async_get(hass).async_create("Switchless Room")
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    entity_id = reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_area_{area.id}")
    if entity_id is not None:
        reg.async_remove(entity_id)
    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", area_id=area.id, enabled=False
    )
    assert resp["success"]
    assert hass.data[DOMAIN][DATA_STORE].get_scope_enabled("area", area.id) is False


async def test_set_scope_enabled_rejects_unregistered_area_id(hass, installed, hass_ws_client):
    # A typo'd/stale area id must be rejected before the store setdefaults a
    # permanent junk scope bucket.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/set_scope_enabled",
        area_id="ghost_area_without_switch",
        enabled=False,
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


async def test_set_scope_enabled_enable_already_enabled_applies_no_heal(
    hass, installed, hass_ws_client
):
    # Enabling a scope whose switch already exists: call succeeds and the switch
    # entity is still present (no spurious create or delete).
    from homeassistant.helpers import entity_registry as er

    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=True
    )
    assert resp["success"]
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None


async def test_set_scope_enabled_requires_one_scope(hass, installed, hass_ws_client):
    resp = await _ws_send(hass_ws_client, type="ambience/set_scope_enabled", enabled=False)
    assert not resp["success"]


async def test_set_scope_enabled_enable_no_recreate_when_add_entities_missing(
    hass, installed, hass_ws_client
):
    # Enable path with the add-entities callback absent: the recreate is skipped
    # (defensive guard) and the call still succeeds.
    from homeassistant.helpers import entity_registry as er

    from custom_components.ambience.const import DATA_SWITCH_ADD_ENTITIES

    reg = er.async_get(hass)
    entity_id = reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house")
    reg.async_remove(entity_id)
    await hass.async_block_till_done()
    hass.data[DOMAIN].pop(DATA_SWITCH_ADD_ENTITIES, None)

    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", house=True, enabled=True
    )
    assert resp["success"]
    await hass.async_block_till_done()
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None


async def test_set_scope_enabled_rejects_unregistered_floor_id(hass, installed, hass_ws_client):
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/set_scope_enabled",
        floor_id="ghost_floor_without_switch",
        enabled=False,
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"
