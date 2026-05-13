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


async def test_area_get_unknown(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/area/get", area_id="nope")
    assert resp["success"] is False
    assert resp["error"]["code"] == "unknown_area"


async def test_area_save_then_get(hass: HomeAssistant, installed, hass_ws_client) -> None:
    config = {
        "name": "Living Room",
        "scenes": ["movie", "reading"],
        "matchers": ["time_of_day"],
        "rules": [
            {
                "when": {"scene": "movie", "time_of_day": "evening"},
                "actions": [
                    {
                        "action": "set_light",
                        "targets": {"light.lamp": {"brightness": 30}},
                    }
                ],
            }
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="lr",
        config=config,
    )
    assert save["success"] is True

    get = await _ws_send(hass_ws_client, id=2, type="ambience/area/get", area_id="lr")
    assert get["success"] is True
    assert get["result"] == config


async def test_area_save_rejects_invalid_predicate(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    config = {
        "name": "X",
        "scenes": ["movie"],
        "matchers": ["time_of_day"],
        "rules": [
            {
                "when": {"scene": "movie", "time_of_day": "garbage_predicate"},
                "actions": [],
            }
        ],
    }
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="lr",
        config=config,
    )
    assert resp["success"] is False
    assert "garbage_predicate" in resp["error"]["message"]


async def test_area_save_rejects_invalid_action_params(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    config = {
        "name": "X",
        "scenes": ["movie"],
        "matchers": [],
        "rules": [
            {
                "when": {"scene": "movie"},
                "actions": [
                    {
                        "action": "set_light",
                        "targets": {"light.x": {"brightness": 200}},  # out of range
                    }
                ],
            }
        ],
    }
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="lr",
        config=config,
    )
    assert resp["success"] is False
    assert "brightness" in resp["error"]["message"]


async def test_area_save_rejects_duplicate_scene_names(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="lr",
        config={
            "name": "X",
            "scenes": ["a", "a"],
            "matchers": [],
            "rules": [],
        },
    )
    assert resp["success"] is False
    assert "duplicate" in resp["error"]["message"].lower()


async def test_area_delete_removes_area(hass: HomeAssistant, installed, hass_ws_client) -> None:
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="lr",
        config={"name": "X", "scenes": [], "matchers": [], "rules": []},
    )
    assert save["success"] is True

    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/delete",
        area_id="lr",
    )
    assert resp["success"] is True

    listing = await _ws_send(hass_ws_client, id=3, type="ambience/areas/list")
    assert listing["result"] == []


async def test_area_delete_unknown_is_ok(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/area/delete", area_id="nope")
    assert resp["success"] is True


async def test_validate_ok(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={"name": "X", "scenes": ["a"], "matchers": [], "rules": []},
    )
    assert resp["success"] is True
    assert resp["result"] == {"ok": True}


async def test_validate_error(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={
            "name": "X",
            "scenes": ["a", "a"],
            "matchers": [],
            "rules": [],
        },
    )
    assert resp["success"] is False
    assert "duplicate" in resp["error"]["message"].lower()
