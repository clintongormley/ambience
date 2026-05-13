"""WebSocket command API."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


async def test_areas_list_empty(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True
    assert resp["result"] == []


async def test_areas_list_returns_saved_areas(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {"name": "Living Room", "scenes": [], "matchers": [], "rules": []},
    )
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True
    assert resp["result"] == [{"area_id": "lr", "name": "Living Room"}]


async def test_matchers_list(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/matchers/list")
    assert resp["success"] is True
    names = [m["name"] for m in resp["result"]]
    assert "time_of_day" in names


async def test_actions_list(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/actions/list")
    assert resp["success"] is True
    items = {a["name"]: a for a in resp["result"]}
    assert "set_light" in items
    assert items["set_light"]["domains"] == ["light"]
