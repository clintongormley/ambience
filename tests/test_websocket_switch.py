"""WS commands for switch defaults + per-scope override."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from custom_components.ambience.const import DATA_STORE, DOMAIN, SIGNAL_SWITCH_CONFIG_UPDATED


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


async def test_switch_defaults_list(hass, installed, hass_ws_client):
    resp = await _ws_send(hass_ws_client, type="ambience/switch_defaults/list")
    assert resp["success"]
    assert resp["result"] == {"name": "Ambience", "auto_on_delay_seconds": 7200}


async def test_switch_defaults_save_fires_None(hass, installed, hass_ws_client):
    fired: list[Any] = []
    unsub = async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, lambda p: fired.append(p))
    try:
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/switch_defaults/save",
            name="Master",
            auto_on_delay_seconds=600,
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
