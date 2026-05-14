"""WebSocket command API."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


@pytest.fixture
def area_id(hass: HomeAssistant) -> str:
    """Register an HA area so area/save accepts it; returns its registry id."""
    return ar.async_get(hass).async_create("Living Room").id


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


async def test_areas_list_empty(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True
    assert resp["result"] == []


async def test_areas_list_returns_all_ha_areas(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """areas/list reflects every area in HA's registry, configured in Ambience or not."""
    reg = ar.async_get(hass)
    kitchen = reg.async_create("Kitchen")
    bedroom = reg.async_create("Bedroom")
    # Only one has Ambience config — both must still be listed, sorted by name.
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(kitchen.id, {"matchers": [], "rules": [], "auto_sort": True})
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True
    assert resp["result"] == [
        {"area_id": bedroom.id, "name": "Bedroom"},
        {"area_id": kitchen.id, "name": "Kitchen"},
    ]


async def test_matchers_list(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/matchers/list")
    assert resp["success"] is True
    by_name = {m["name"]: m for m in resp["result"]}

    # scene is always-on and not toggleable, with its own input widget
    assert by_name["scene"]["toggleable"] is False
    assert by_name["scene"]["input"] == "scene_combobox"

    tod = by_name["time_of_day"]
    assert tod["toggleable"] is True
    assert tod["input"] == "text"
    assert tod["description"].strip() != ""
    assert tod["predicate_help"].strip() != ""


async def test_actions_list(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/actions/list")
    assert resp["success"] is True
    by_name = {a["name"]: a for a in resp["result"]}
    assert "set_light" in by_name
    entry = by_name["set_light"]
    assert entry["description"].strip() != ""
    assert entry["domains"] == ["light"]
    assert isinstance(entry["target_params"], list)
    param_names = {p["name"] for p in entry["target_params"]}
    assert {"brightness", "transition"} <= param_names


async def test_area_get_unknown(hass: HomeAssistant, installed, hass_ws_client) -> None:
    """area/get errors when the area_id is not in HA's registry at all."""
    resp = await _ws_send(hass_ws_client, type="ambience/area/get", area_id="nope")
    assert resp["success"] is False
    assert resp["error"]["code"] == "unknown_area"


async def test_area_get_unconfigured_returns_empty_config(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Opening a real HA area with no stored Ambience config yields a blank config."""
    resp = await _ws_send(hass_ws_client, type="ambience/area/get", area_id=area_id)
    assert resp["success"] is True
    assert resp["result"] == {"matchers": [], "rules": [], "auto_sort": True}


async def test_area_save_then_get(hass: HomeAssistant, installed, area_id, hass_ws_client) -> None:
    config = {
        "matchers": ["time_of_day"],
        "auto_sort": False,
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
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    assert save["result"]["ok"] is True
    assert save["result"]["config"] == config

    get = await _ws_send(hass_ws_client, id=2, type="ambience/area/get", area_id=area_id)
    assert get["success"] is True
    assert get["result"] == config


async def test_area_save_rejects_area_id_not_in_registry(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """area/save only accepts area_ids that exist in HA's area registry."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="not_a_real_area",
        config={"matchers": [], "rules": [], "auto_sort": True},
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "not_a_real_area" in resp["error"]["message"]


async def test_area_save_rejects_invalid_predicate(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    config = {
        "matchers": ["time_of_day"],
        "auto_sort": True,
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
        area_id=area_id,
        config=config,
    )
    assert resp["success"] is False
    assert "garbage_predicate" in resp["error"]["message"]


async def test_area_save_rejects_invalid_action_params(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    config = {
        "matchers": [],
        "auto_sort": True,
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
        area_id=area_id,
        config=config,
    )
    assert resp["success"] is False
    assert "brightness" in resp["error"]["message"]


async def test_validate_ok(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={"matchers": [], "auto_sort": True, "rules": []},
    )
    assert resp["success"] is True
    assert resp["result"] == {"ok": True}


async def test_validate_rejects_bad_scene_predicate(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={
            "matchers": [],
            "auto_sort": True,
            "rules": [{"when": {"scene": ""}, "actions": []}],
        },
    )
    assert resp["success"] is False
    assert "scene" in resp["error"]["message"]


async def test_dry_run_returns_matched_rule(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "matchers": [],
            "rules": [
                {
                    "name": "movie default",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "set_light",
                            "targets": {"light.lamp": {"brightness": 30}},
                        }
                    ],
                }
            ],
        },
    )
    assert save["success"] is True
    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
        scene="movie",
    )
    assert resp["success"] is True
    assert resp["result"]["matched_rule_index"] == 0
    assert resp["result"]["rule_name"] == "movie default"
    assert resp["result"]["actions"][0]["action"] == "set_light"


async def test_dry_run_no_match(hass: HomeAssistant, installed, area_id, hass_ws_client) -> None:
    await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "matchers": [],
            "rules": [],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
        scene="movie",
    )
    assert resp["success"] is True
    assert resp["result"]["matched_rule_index"] is None
    assert resp["result"]["actions"] == []


async def test_area_save_sorts_rules_when_auto_sort_on(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """With auto_sort on, the stored rules come back sorted by specificity."""
    config = {
        "matchers": ["time_of_day"],
        "auto_sort": True,
        "rules": [
            {"when": {"scene": "movie", "time_of_day": "10:00-14:00"}, "actions": []},
            {"when": {"scene": "movie", "time_of_day": "12:00-13:00"}, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    sorted_rules = save["result"]["config"]["rules"]
    # narrower predicate (12:00-13:00) sorts first
    assert sorted_rules[0]["when"]["time_of_day"] == "12:00-13:00"
    assert sorted_rules[1]["when"]["time_of_day"] == "10:00-14:00"


async def test_area_save_preserves_order_when_auto_sort_off(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """With auto_sort off, the stored rule order is preserved as submitted."""
    config = {
        "matchers": ["time_of_day"],
        "auto_sort": False,
        "rules": [
            {"when": {"scene": "movie", "time_of_day": "10:00-14:00"}, "actions": []},
            {"when": {"scene": "movie", "time_of_day": "12:00-13:00"}, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    rules = save["result"]["config"]["rules"]
    assert rules[0]["when"]["time_of_day"] == "10:00-14:00"
    assert rules[1]["when"]["time_of_day"] == "12:00-13:00"


async def test_unload_deregisters_ws_commands(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
    hass_ws_client,
) -> None:
    """After unload, ambience/* WS commands should no longer be registered."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    # Confirm command works before unload.
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True

    # Unload.
    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    # After unload, calling the command should now fail (unknown command).
    resp = await _ws_send(hass_ws_client, id=99, type="ambience/areas/list")
    assert resp["success"] is False


async def test_area_save_sorts_by_default_when_auto_sort_absent(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """A config submitted without `auto_sort` sorts by specificity (default on)."""
    config = {
        "matchers": ["time_of_day"],
        "rules": [
            {"when": {"scene": "movie", "time_of_day": "10:00-14:00"}, "actions": []},
            {"when": {"scene": "movie", "time_of_day": "12:00-13:00"}, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    sorted_rules = save["result"]["config"]["rules"]
    assert sorted_rules[0]["when"]["time_of_day"] == "12:00-13:00"
    assert sorted_rules[1]["when"]["time_of_day"] == "10:00-14:00"
