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


async def test_house_switch_save_fires_house_key(hass, installed, hass_ws_client):
    fired: list[Any] = []
    unsub = async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, lambda p: fired.append(p))
    try:
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/house/switch/save",
            name="All",
            auto_on_delay_seconds=None,
        )
        assert resp["success"]
        assert hass.data[DOMAIN][DATA_STORE].get_scope_switch_config("house", None) == {
            "name": "All",
            "auto_on_delay_seconds": None,
            "off_at": None,
        }
        assert fired == [("house", None)]
    finally:
        unsub()


async def test_floor_switch_save_round_trip(hass, installed, floor_id, hass_ws_client):
    fired: list[Any] = []
    unsub = async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, lambda p: fired.append(p))
    try:
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/floor/switch/save",
            floor_id=floor_id,
            name="Upstairs",
            auto_on_delay_seconds=300,
        )
        assert resp["success"]
        cfg = hass.data[DOMAIN][DATA_STORE].get_scope_switch_config("floor", floor_id)
        assert cfg["name"] == "Upstairs"
        assert cfg["auto_on_delay_seconds"] == 300
        assert fired == [("floor", floor_id)]
    finally:
        unsub()


async def test_floor_switch_save_rejects_unknown_floor(hass, installed, hass_ws_client):
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/floor/switch/save",
        floor_id="not_real",
        name="X",
        auto_on_delay_seconds=None,
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


async def test_area_switch_save_round_trip(hass, installed, area_id, hass_ws_client):
    fired: list[Any] = []
    unsub = async_dispatcher_connect(hass, SIGNAL_SWITCH_CONFIG_UPDATED, lambda p: fired.append(p))
    try:
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/area/switch/save",
            area_id=area_id,
            name="Living",
            auto_on_delay_seconds=None,
        )
        assert resp["success"]
        cfg = hass.data[DOMAIN][DATA_STORE].get_scope_switch_config("area", area_id)
        assert cfg == {"name": "Living", "auto_on_delay_seconds": None, "off_at": None}
        assert fired == [("area", area_id)]
    finally:
        unsub()


async def test_area_switch_save_rejects_unknown_area(hass, installed, hass_ws_client):
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/switch/save",
        area_id="not_real",
        name="X",
        auto_on_delay_seconds=None,
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


# --- dry_run integration ----------------------------------------------------


async def test_dry_run_includes_switch_state_for_house(hass, installed, hass_ws_client):
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", house=True)
    assert resp["success"]
    assert resp["result"]["switch_state"] in ("on", "off", "unknown")
