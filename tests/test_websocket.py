"""WebSocket command API."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.triggers import TriggerSpec


def _seed_services_catalog(hass: HomeAssistant) -> None:
    """Register stub services with descriptions so catalog validation passes.

    We register light.turn_on, light.turn_off and script.foo with realistic
    field schemas (via async_set_service_schema, which seeds the description
    cache so async_get_all_descriptions skips the on-disk yaml loader — that
    loader can fail in stripped test envs).
    """
    from homeassistant.helpers.service import async_set_service_schema

    catalog = {
        ("light", "turn_on"): {
            "fields": {
                "brightness_pct": {"selector": {"number": {"min": 0, "max": 100}}},
                "transition": {"selector": {"number": {"min": 0}}},
                "effect": {"selector": {"text": {}}},
            },
            "target": {"entity": [{"domain": "light"}]},
        },
        ("light", "turn_off"): {
            "fields": {"transition": {"selector": {"number": {"min": 0}}}},
            "target": {"entity": [{"domain": "light"}]},
        },
        ("script", "foo"): {
            "fields": {
                "x": {"selector": {"text": {}}},
                "brightness_pct": {"selector": {"number": {"min": 0, "max": 100}}},
            },
        },
    }
    for (domain, name), schema in catalog.items():
        if not hass.services.has_service(domain, name):
            hass.services.async_register(domain, name, lambda _call: None)
        async_set_service_schema(hass, domain, name, schema)


async def _seed_exposed_actions(hass: HomeAssistant) -> None:
    """Pre-expose the services the tests' scenes reference."""
    store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await store.save(
        [
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct", "transition"],
                "defaults": {},
            },
            {
                "id": "light.turn_off",
                "label": "",
                "visible_fields": ["transition"],
                "defaults": {},
            },
            {
                "id": "script.foo",
                "label": "",
                "visible_fields": ["x", "brightness_pct"],
                "defaults": {},
            },
        ]
    )


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


@pytest.fixture
async def installed_with_actions(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry
) -> MockConfigEntry:
    """Like `installed` but with `light.turn_on/off` and `script.foo` exposed
    and registered in the HA service catalog. Tests that build scenes
    referencing these services should use this fixture."""
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    _seed_services_catalog(hass)
    await _seed_exposed_actions(hass)
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
    await store.async_save_area(kitchen.id, {"conditions": [], "scenes": []})
    resp = await _ws_send(hass_ws_client, type="ambience/areas/list")
    assert resp["success"] is True
    assert resp["result"] == [
        {"area_id": bedroom.id, "name": "Bedroom"},
        {"area_id": kitchen.id, "name": "Kitchen"},
    ]


async def test_conditions_list(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/conditions/list")
    assert resp["success"] is True
    by_name = {m["name"]: m for m in resp["result"]}

    # the scene condition has been removed; it must not appear in the list.
    assert "scene" not in by_name

    # day sorts before time_of_day in the linearisation tiebreaker.
    day = by_name["day"]
    assert "toggleable" not in day
    assert day["input"] == "day_predicate"
    assert day["priority"] == 900

    tod = by_name["time_of_day"]
    assert "toggleable" not in tod
    assert tod["input"] == "time_of_day"
    assert tod["priority"] == 800
    assert tod["description"].strip() != ""
    assert tod["predicate_help"].strip() != ""

    lux = by_name["lux"]
    assert lux["input"] == "lux"
    assert lux["priority"] == 775
    assert lux["description"].strip() != ""
    assert lux["predicate_help"].strip() != ""


async def test_conditions_list_includes_unavailable(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/conditions/list")
    assert resp["success"] is True
    result = resp["result"]
    names = {c["name"] for c in result}
    assert "unavailable" in names
    info = next(c for c in result if c["name"] == "unavailable")
    assert info["input"] == "unavailable_predicate"


# ---------------------------------------------------------------------------
# services/list, services/get_schema, exposed_actions/list, exposed_actions/save
# ---------------------------------------------------------------------------


async def test_services_list_returns_ha_services(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """services/list returns the HA service catalog (id, description, target)."""
    _seed_services_catalog(hass)
    resp = await _ws_send(hass_ws_client, type="ambience/services/list")
    assert resp["success"] is True
    ids = {item["id"] for item in resp["result"]}
    assert {"light.turn_on", "light.turn_off", "script.foo"} <= ids


async def test_services_get_schema_returns_fields_and_target(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    _seed_services_catalog(hass)
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/services/get_schema",
        service="light.turn_on",
    )
    assert resp["success"] is True
    assert "fields" in resp["result"]


async def test_services_get_schema_unknown_service_errors(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/services/get_schema",
        service="nope.nope",
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "unknown_service"


async def test_services_get_schema_malformed_service_id_errors(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/services/get_schema",
        service="no_dot",
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_exposed_actions_list_empty_initially(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/exposed_actions/list")
    assert resp["success"] is True
    assert resp["result"] == []


async def test_exposed_actions_save_and_list_round_trip(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    _seed_services_catalog(hass)
    actions = [
        {
            "id": "light.turn_on",
            "label": "Set brightness",
            "visible_fields": ["brightness_pct"],
            "defaults": {"transition": 1},
        }
    ]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=actions,
    )
    assert resp["success"] is True, resp
    assert resp["result"]["ok"] is True
    assert "warnings" not in resp["result"]

    resp2 = await _ws_send(hass_ws_client, type="ambience/exposed_actions/list")
    assert resp2["success"] is True
    assert resp2["result"] == actions


async def test_exposed_actions_save_rejects_shape_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[{"id": "no_dot", "label": "", "visible_fields": [], "defaults": {}}],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_exposed_actions_save_rejects_unknown_service(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """Catalog validation rejects a service not present in HA."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.does_not_exist",
                "label": "",
                "visible_fields": [],
                "defaults": {},
            }
        ],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


# ---------------------------------------------------------------------------
# Area save / get with the new action shape
# ---------------------------------------------------------------------------


async def test_area_save_accepts_valid_script_action(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "script.foo",
                        "entity_ids": ["light.a"],
                        "params": {"x": 1},
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
    assert resp["success"] is True
    assert resp["result"]["ok"] is True


async def test_area_save_rejects_missing_service(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Validator rejects an action that has no `service` key."""
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [{"entity_ids": [], "params": {}}],
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
    assert resp["error"]["code"] == "validation_error"
    assert "service" in resp["error"]["message"]


async def test_area_save_rejects_malformed_service(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Validator rejects an action whose `service` has no dot."""
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [{"service": "no_dot", "entity_ids": [], "params": {}}],
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
    assert resp["error"]["code"] == "validation_error"


async def test_area_save_allows_unexposed_service_and_badges_it(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Saving a scene with an unexposed action no longer fails — it surfaces as a
    per-scene config_issues badge (and a Repairs issue) instead."""
    # switch.turn_on is not in our seeded exposed list.
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "switch.turn_on",
                        "entity_ids": ["switch.a"],
                        "params": {},
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
    # Saving a scene with an unexposed action no longer fails — it surfaces as a
    # per-scene config_issues badge (and a Repairs issue) instead.
    assert resp["success"] is True
    scene0 = resp["result"]["config"]["scenes"][0]
    assert {"kind": "unexposed_action", "ref": "switch.turn_on"} in scene0["config_issues"]


async def test_area_save_rejects_non_list_entity_ids(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": "light.a",  # should be a list
                        "params": {},
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
    assert "entity_ids" in resp["error"]["message"]


async def test_area_save_rejects_non_dict_params(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.a"],
                        "params": [],  # should be a dict
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
    assert "params" in resp["error"]["message"]


async def test_area_save_rejects_non_string_entity_id_element(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.a", 123],  # element must be a string
                        "params": {},
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
    assert "entity_ids" in resp["error"]["message"]


async def test_area_save_accepts_param_not_in_visible_fields(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """A scene param key is NOT whitelisted against visible_fields any more —
    extra params (e.g. left over from a settings edit) are accepted; the
    dispatcher still sends them at execution."""
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.a"],
                        "params": {"effect": "bouncy"},  # not in visible_fields — OK
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
    assert resp["success"] is True
    assert resp["result"]["ok"] is True


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
    assert resp["result"] == {"scenes": []}


async def test_area_save_then_get(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "scenes": [
            {
                "when": {"time_of_day": {"period": "evening"}},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.lamp"],
                        "params": {"brightness_pct": 30},
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
    assert "auto_sort" not in save["result"]["config"]
    assert len(save["result"]["config"]["scenes"]) == 1

    get = await _ws_send(hass_ws_client, id=2, type="ambience/area/get", area_id=area_id)
    assert get["success"] is True
    assert "auto_sort" not in get["result"]
    assert len(get["result"]["scenes"]) == 1


async def test_scope_save_coerces_unknown_category_to_general(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """A scene referencing a category id not in the categories list (or with no category key)
    is rewritten to the General category — scenes are always categorised."""
    from custom_components.ambience.const import GENERAL_CATEGORY_ID

    config = {
        "auto_sort": False,
        "scenes": [
            {
                "name": "ghost scene",
                "category": "nonexistent",
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": ["light.lamp"],
                        "params": {"brightness_pct": 30},
                    }
                ],
            },
            {
                "name": "no category key",
                "when": {},
                "actions": [
                    {
                        "service": "light.turn_off",
                        "entity_ids": ["light.lamp"],
                        "params": {},
                    }
                ],
            },
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True, save

    get = await _ws_send(hass_ws_client, id=2, type="ambience/area/get", area_id=area_id)
    assert get["success"] is True
    scenes = get["result"]["scenes"]
    assert scenes[0]["category"] == GENERAL_CATEGORY_ID
    assert scenes[1]["category"] == GENERAL_CATEGORY_ID


async def test_area_save_rejects_area_id_not_in_registry(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """area/save only accepts area_ids that exist in HA's area registry."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="not_a_real_area",
        config={"conditions": [], "scenes": []},
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "not_a_real_area" in resp["error"]["message"]


async def test_area_save_rejects_invalid_predicate(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    config = {
        "conditions": ["time_of_day"],
        "scenes": [
            {
                "when": {"time_of_day": "garbage_predicate"},
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


async def test_validate_ok(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={"conditions": [], "scenes": []},
    )
    assert resp["success"] is True
    assert resp["result"] == {"ok": True}


async def test_dry_run_returns_matched_scene(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "conditions": [],
            "scenes": [
                {
                    "name": "movie default",
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 30},
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
    )
    assert resp["success"] is True
    assert resp["result"]["matched_scene_index"] == 0
    assert resp["result"]["scene_name"] == "movie default"
    assert resp["result"]["actions"][0]["service"] == "light.turn_on"


async def test_dry_run_returns_per_category_results(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    categories_resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[
            {"id": "lighting", "name": "Lighting"},
            {"id": "blinds", "name": "Blinds"},
        ],
    )
    assert categories_resp["success"] is True
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "conditions": [],
            "scenes": [
                {
                    "name": "lights movie",
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 30},
                        }
                    ],
                },
                {
                    "name": "blinds movie",
                    "category": "blinds",
                    "when": {},
                    "actions": [],
                },
            ],
        },
    )
    assert save["success"] is True
    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
    )
    assert resp["success"] is True
    result = resp["result"]
    assert "categories" in result
    assert result["categories"]["lighting"]["matched_scene_index"] == 0
    assert result["categories"]["blinds"]["matched_scene_index"] == 1


async def test_dry_run_no_match(hass: HomeAssistant, installed, area_id, hass_ws_client) -> None:
    await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "conditions": [],
            "scenes": [],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
    )
    assert resp["success"] is True
    assert resp["result"]["matched_scene_index"] is None
    assert resp["result"]["actions"] == []


async def test_dry_run_with_floor_resolves_against_floor_scenes(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_floor(
        floor_id,
        {
            "scenes": [{"name": "movie", "when": {}, "actions": []}],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/dry_run",
        floor_id=floor_id,
    )
    assert resp["success"] is True
    assert resp["result"]["scene_name"] == "movie"


async def test_dry_run_with_house_resolves_against_house_scenes(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {
            "scenes": [{"name": "away", "when": {}, "actions": []}],
        },
    )
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", house=True)
    assert resp["success"] is True
    assert resp["result"]["scene_name"] == "away"


async def test_dry_run_rejects_multiple_scope_fields(
    hass: HomeAssistant, installed, hass_ws_client, area_id, floor_id
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/dry_run",
        area_id=area_id,
        floor_id=floor_id,
    )
    assert resp["success"] is False


async def test_area_save_sorts_scenes_by_specificity(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Scenes always come back sorted narrower predicate first."""
    wide = {
        "from": {"kind": "time", "hh": 10, "mm": 0},
        "to": {"kind": "time", "hh": 14, "mm": 0},
    }
    narrow = {
        "from": {"kind": "time", "hh": 12, "mm": 0},
        "to": {"kind": "time", "hh": 13, "mm": 0},
    }
    config = {
        "conditions": ["time_of_day"],
        "scenes": [
            {"when": {"time_of_day": wide}, "actions": []},
            {"when": {"time_of_day": narrow}, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    sorted_scenes = save["result"]["config"]["scenes"]
    # narrower predicate (12:00-13:00) sorts first
    assert sorted_scenes[0]["when"]["time_of_day"] == narrow
    assert sorted_scenes[1]["when"]["time_of_day"] == wide


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


async def test_area_save_pins_and_resolves(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Save assigns integer priority + pinned=False and returns scenes in resolved order
    (more-specific predicate first). No auto_sort in the returned config."""
    config = {
        "scenes": [
            {
                "name": "general",
                "when": {},
                "actions": [],
            },
            {
                "name": "specific",
                "when": {
                    "time_of_day": {"period": "evening"},
                },
                "actions": [],
            },
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    cfg = save["result"]["config"]
    scenes = cfg["scenes"]
    assert all(isinstance(r["priority"], int) for r in scenes)
    assert all(r["pinned"] is False for r in scenes)
    assert [r["name"] for r in scenes] == ["specific", "general"]
    assert "auto_sort" not in cfg


# ---------------------------------------------------------------------------
# B7: ambience/time_of_day_periods/list
# ---------------------------------------------------------------------------


async def test_ws_periods_list_returns_builtins_custom_hidden(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """The list command returns the full {builtins, custom, hidden} view."""
    resp = await _ws_send(hass_ws_client, type="ambience/time_of_day_periods/list")

    assert resp["success"]
    result = resp["result"]
    assert set(result["builtins"]) == {"morning", "afternoon", "evening", "nighttime", "daytime"}
    assert result["custom"] == {}
    assert result["hidden"] == []


# ---------------------------------------------------------------------------
# B8: ambience/time_of_day_periods/save
# ---------------------------------------------------------------------------


async def test_ws_periods_save_persists_payload(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    payload = {
        "custom": {
            "wind_down": {
                "from": {"kind": "time", "hh": 20, "mm": 0},
                "to": {"kind": "time", "hh": 22, "mm": 0},
                "label": "Wind down",
            }
        },
        "hidden": ["daytime"],
    }
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/time_of_day_periods/save", **payload})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["ok"] is True
    assert "warnings" not in msg["result"]

    await client.send_json({"id": 2, "type": "ambience/time_of_day_periods/list"})
    msg = await client.receive_json()
    assert msg["result"]["custom"] == payload["custom"]
    assert msg["result"]["hidden"] == payload["hidden"]


async def test_ws_periods_save_rejects_malformed(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/time_of_day_periods/save",
            "custom": {"bad": {"from": {"kind": "time", "hh": 25, "mm": 0}}},
            "hidden": [],
        }
    )
    msg = await client.receive_json()
    assert msg["success"] is False
    assert msg["error"]["code"] == "validation_error"


# ---------------------------------------------------------------------------
# B9: ambience/time_of_day_periods/reset
# ---------------------------------------------------------------------------


async def test_ws_periods_reset_clears_custom_and_hidden(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    # First save some custom + hidden
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/time_of_day_periods/save",
            "custom": {
                "wind_down": {
                    "from": {"kind": "time", "hh": 20, "mm": 0},
                    "to": {"kind": "time", "hh": 22, "mm": 0},
                }
            },
            "hidden": ["daytime"],
        }
    )
    msg = await client.receive_json()
    assert msg["success"]

    # Reset
    await client.send_json({"id": 2, "type": "ambience/time_of_day_periods/reset"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["ok"] is True

    # Verify via list
    await client.send_json({"id": 3, "type": "ambience/time_of_day_periods/list"})
    msg = await client.receive_json()
    assert msg["result"]["custom"] == {}
    assert msg["result"]["hidden"] == []


# ---------------------------------------------------------------------------
# ambience/lux_ranges/{list,save,reset}
# ---------------------------------------------------------------------------


async def test_ws_lux_ranges_list_returns_builtins_custom_hidden(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/lux_ranges/list")
    assert resp["success"]
    result = resp["result"]
    assert set(result["builtins"]) == {"dark", "dim", "normal", "bright", "very_bright"}
    assert result["custom"] == {}
    assert result["hidden"] == []


async def test_ws_lux_ranges_save_persists_payload(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    payload = {"custom": {"gloomy": {"min": 5, "max": 30, "label": "Gloomy"}}, "hidden": ["dark"]}
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/lux_ranges/save", **payload})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["ok"] is True
    assert "warnings" not in msg["result"]

    await client.send_json({"id": 2, "type": "ambience/lux_ranges/list"})
    msg = await client.receive_json()
    assert msg["result"]["custom"] == payload["custom"]
    assert msg["result"]["hidden"] == payload["hidden"]


async def test_ws_lux_ranges_save_rejects_malformed(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/lux_ranges/save",
        custom={"bad": {"min": 50, "max": 10}},
        hidden=[],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_ws_lux_ranges_reset_clears_custom_and_hidden(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/lux_ranges/save",
            "custom": {"gloomy": {"min": 5, "max": 30}},
            "hidden": ["dark"],
        }
    )
    msg = await client.receive_json()
    assert msg["success"]

    await client.send_json({"id": 2, "type": "ambience/lux_ranges/reset"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["ok"] is True

    await client.send_json({"id": 3, "type": "ambience/lux_ranges/list"})
    msg = await client.receive_json()
    assert msg["result"]["custom"] == {}
    assert msg["result"]["hidden"] == []


# ---------------------------------------------------------------------------
# C1: ambience/conditions/day/config/list + save
# ---------------------------------------------------------------------------


async def test_day_config_list_defaults(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/conditions/day/config/list")
    assert resp["success"] is True
    assert resp["result"] == {"workday_sensor": None, "workday_calendar": None}


async def test_day_config_save_round_trips(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/conditions/day/config/save",
        workday_sensor="binary_sensor.workday",
        workday_calendar="calendar.workday",
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True
    assert "warnings" not in resp["result"]
    resp2 = await _ws_send(hass_ws_client, type="ambience/conditions/day/config/list")
    assert resp2["result"] == {
        "workday_sensor": "binary_sensor.workday",
        "workday_calendar": "calendar.workday",
    }


# ---------------------------------------------------------------------------
# C2: scene + config validation
# ---------------------------------------------------------------------------


async def test_area_save_ignores_legacy_conditions_field(
    hass, installed, hass_ws_client, area_id
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "conditions": ["time_of_day"],  # legacy field — ignored
            "scenes": [],
        },
    )
    assert resp["success"] is True


async def test_conditions_list_includes_weather(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/conditions/list")
    by_name = {m["name"]: m for m in resp["result"]}
    weather = by_name["weather"]
    assert "toggleable" not in weather
    assert weather["input"] == "weather_predicate"
    assert weather["priority"] == 700


async def test_conditions_list_includes_state(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/conditions/list")
    assert resp["success"] is True
    by_name = {m["name"]: m for m in resp["result"]}
    state = by_name["state"]
    assert "toggleable" not in state
    assert state["input"] == "state_predicate"
    assert state["priority"] == 950
    assert state["description"].strip() != ""
    assert state["predicate_help"].strip() != ""


async def test_weather_config_list_default(hass, installed, hass_ws_client) -> None:
    from custom_components.ambience.conditions.weather import DEFAULT_WEATHER_GROUPS

    resp = await _ws_send(hass_ws_client, type="ambience/conditions/weather/config/list")
    assert resp["success"] is True
    assert resp["result"] == {"entity": None, "groups": DEFAULT_WEATHER_GROUPS}


async def test_weather_config_save_round_trips(hass, installed, hass_ws_client) -> None:
    custom = [{"id": "wet", "label": "Wet", "conditions": ["rainy", "pouring"]}]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/conditions/weather/config/save",
        entity="weather.home",
        groups=custom,
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True
    assert "warnings" not in resp["result"]
    resp2 = await _ws_send(hass_ws_client, type="ambience/conditions/weather/config/list")
    assert resp2["result"] == {"entity": "weather.home", "groups": custom}


async def test_weather_config_save_rejects_malformed_groups(
    hass, installed, hass_ws_client
) -> None:
    bad = [{"id": "wet", "label": "Wet", "conditions": ["not-a-real-condition"]}]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/conditions/weather/config/save",
        entity="weather.home",
        groups=bad,
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_weather_config_save_rejects_duplicate_group_ids(
    hass, installed, hass_ws_client
) -> None:
    dup = [
        {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
        {"id": "wet", "label": "Wet again", "conditions": ["pouring"]},
    ]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/conditions/weather/config/save",
        entity="weather.home",
        groups=dup,
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_state_known_states_for_binary_sensor(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.states.async_set("binary_sensor.door", "on", {})
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_states",
        entity_id="binary_sensor.door",
    )
    assert resp["success"] is True
    states = resp["result"]["states"]
    assert "on" in states
    assert "off" in states


async def test_state_known_states_for_input_select_reads_options(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.states.async_set(
        "input_select.mode",
        "day",
        {"options": ["day", "night", "away"]},
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_states",
        entity_id="input_select.mode",
    )
    assert resp["success"] is True
    states = resp["result"]["states"]
    assert set(states) >= {"day", "night", "away"}


async def test_state_known_states_for_person_includes_zones(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.states.async_set("zone.work", "zoning", {"friendly_name": "Work"})
    hass.states.async_set("zone.gym", "zoning", {"friendly_name": "Gym"})
    hass.states.async_set("person.bob", "home", {})
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_states",
        entity_id="person.bob",
    )
    assert resp["success"] is True
    states = resp["result"]["states"]
    assert "home" in states
    assert "not_home" in states
    # Zone friendly names included for person/device_tracker.
    assert "Work" in states or "work" in states
    assert "Gym" in states or "gym" in states


async def test_state_known_states_for_unknown_domain_returns_current(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.states.async_set("sensor.weird", "magical", {})
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_states",
        entity_id="sensor.weird",
    )
    assert resp["success"] is True
    states = resp["result"]["states"]
    # No domain map for sensor — at minimum the current state is included.
    assert "magical" in states


async def test_state_known_states_missing_entity_returns_empty(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_states",
        entity_id="sensor.does_not_exist",
    )
    assert resp["success"] is True
    # No known sensor domain map + no current state → empty.
    assert resp["result"]["states"] == []


async def test_state_known_attribute_values_from_companion_list(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.states.async_set(
        "light.lamp", "on", {"effect": "None", "effect_list": ["None", "Rainbow"]}
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_attribute_values",
        entity_id="light.lamp",
        attribute="effect",
    )
    assert resp["success"] is True
    assert resp["result"]["values"] == ["None", "Rainbow"]


async def test_state_known_attribute_values_missing_entity_is_empty(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/state/known_attribute_values",
        entity_id="light.nope",
        attribute="effect",
    )
    assert resp["success"] is True
    assert resp["result"]["values"] == []


async def test_floors_list_empty(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/floors/list")
    assert resp["success"] is True
    assert resp["result"] == []


async def test_floors_list_returns_ha_floors(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    from homeassistant.helpers import floor_registry as fr

    reg = fr.async_get(hass)
    up = reg.async_create("Upstairs")
    down = reg.async_create("Downstairs")
    resp = await _ws_send(hass_ws_client, type="ambience/floors/list")
    assert resp["success"] is True
    # Sorted by name.
    assert resp["result"] == [
        {"floor_id": down.floor_id, "name": "Downstairs"},
        {"floor_id": up.floor_id, "name": "Upstairs"},
    ]


@pytest.fixture
def floor_id(hass: HomeAssistant) -> str:
    """Register an HA floor; returns its registry id."""
    from homeassistant.helpers import floor_registry as fr

    return fr.async_get(hass).async_create("Upstairs").floor_id


async def test_floor_get_returns_default_when_no_config(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/floor/get", floor_id=floor_id)
    assert resp["success"] is True
    assert resp["result"] == {"scenes": []}


async def test_floor_get_unknown_returns_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/floor/get", floor_id="nope")
    assert resp["success"] is False
    assert resp["error"]["code"] == "unknown_floor"


async def test_floor_save_round_trip(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    config = {
        "scenes": [{"name": "movie", "when": {}, "actions": []}],
    }
    resp = await _ws_send(
        hass_ws_client, type="ambience/floor/save", floor_id=floor_id, config=config
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True

    resp2 = await _ws_send(hass_ws_client, type="ambience/floor/get", floor_id=floor_id)
    assert resp2["result"]["scenes"][0]["name"] == "movie"


async def test_floor_save_unknown_floor_is_validation_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/floor/save",
        floor_id="nope",
        config={"scenes": []},
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_house_get_returns_default(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/house/get")
    assert resp["success"] is True
    assert resp["result"] == {"scenes": []}


async def test_house_save_round_trip(hass: HomeAssistant, installed, hass_ws_client) -> None:
    config = {
        "scenes": [{"name": "away", "when": {}, "actions": []}],
    }
    resp = await _ws_send(hass_ws_client, type="ambience/house/save", config=config)
    assert resp["success"] is True

    resp2 = await _ws_send(hass_ws_client, type="ambience/house/get")
    assert resp2["result"]["scenes"][0]["name"] == "away"


async def _save_state_scene(hass: HomeAssistant) -> None:
    """Save an area `lr` with one scene watching binary_sensor.motion."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [],
                }
            ]
        },
    )


# ---------------------------------------------------------------------------
# shadowed_by: transient response field + round-trip storage
# ---------------------------------------------------------------------------


async def test_area_save_response_carries_shadowed_by(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Save response includes transient shadowed_by on each scene.

    Two scenes with identical `when` predicates: after sort the first is not
    shadowed (shadowed_by=None) and the second is shadowed by the first
    (shadowed_by=0).
    """
    identical_when = {}
    config = {
        "scenes": [
            {"name": "first", "when": identical_when, "actions": []},
            {"name": "second", "when": identical_when, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    scenes = save["result"]["config"]["scenes"]
    assert len(scenes) == 2
    # All scenes carry the shadowed_by key in the response.
    assert all("shadowed_by" in r for r in scenes)
    # The two scenes have identical when-predicates; resolved order keeps them
    # stable (first before second). The first is not shadowed; the second is
    # shadowed by index 0.
    names = [r["name"] for r in scenes]
    first_idx = names.index("first")
    second_idx = names.index("second")
    assert scenes[first_idx]["shadowed_by"] is None
    assert scenes[second_idx]["shadowed_by"] == first_idx


async def test_shadowed_by_not_persisted_on_round_trip(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Scenes echoed back from the frontend (including shadowed_by) must not
    have that key written to storage. Priority and pinned must still persist."""
    identical_when = {}
    config = {
        "scenes": [
            {"name": "first", "when": identical_when, "actions": []},
            {"name": "second", "when": identical_when, "actions": []},
        ],
    }
    save1 = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save1["success"] is True
    # The frontend echoes back the full config (including shadowed_by) on the
    # next save — simulate that here.
    echoed_config = save1["result"]["config"]
    assert any("shadowed_by" in r for r in echoed_config["scenes"]), (
        "pre-condition: save response must carry shadowed_by"
    )

    save2 = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/save",
        area_id=area_id,
        config=echoed_config,
    )
    assert save2["success"] is True

    # Read raw stored config — shadowed_by must not be present.
    store = hass.data[DOMAIN][DATA_STORE]
    stored = store.get_area(area_id)
    assert stored is not None
    for scene in stored.get("scenes", []):
        assert "shadowed_by" not in scene, f"shadowed_by leaked into storage: {scene!r}"
        # priority and pinned are the fields that DO persist.
        assert "priority" in scene
        assert "pinned" in scene


async def test_categories_list_seeds_general_by_default(hass, installed, hass_ws_client) -> None:
    # Categories are required: a fresh install seeds the General category.
    resp = await _ws_send(hass_ws_client, type="ambience/categories/list")
    assert resp["success"] is True
    assert [g["id"] for g in resp["result"]["categories"]] == ["general"]


async def test_categories_save_round_trip(hass, installed, hass_ws_client) -> None:
    categories = [{"id": "lights", "name": "Lights"}, {"id": "blinds", "name": "Blinds"}]
    resp = await _ws_send(hass_ws_client, type="ambience/categories/save", categories=categories)
    assert resp["success"] is True, resp
    list_resp = await _ws_send(hass_ws_client, type="ambience/categories/list")
    assert list_resp["result"]["categories"] == categories


async def test_categories_save_rejects_duplicate_ids(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[
            {"id": "x", "name": "Lights"},
            {"id": "x", "name": "Blinds"},
        ],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "invalid_categories"


async def test_categories_save_rejects_empty_name(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "x", "name": ""}],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "invalid_categories"


async def test_categories_save_rejects_duplicate_names(hass, installed, hass_ws_client) -> None:
    # Same name (case-insensitive, trimmed) on two distinct ids is rejected.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[
            {"id": "a", "name": "Lights"},
            {"id": "b", "name": "  lights "},
        ],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "invalid_categories"


async def test_categories_delete_removes_user_category(hass, installed, hass_ws_client) -> None:
    await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "a", "name": "A"}, {"id": "b", "name": "B"}],
    )
    resp = await _ws_send(hass_ws_client, type="ambience/categories/delete", category_id="b")
    assert resp["success"] is True, resp
    list_resp = await _ws_send(hass_ws_client, type="ambience/categories/list")
    assert {g["id"] for g in list_resp["result"]["categories"]} == {"a"}


async def test_categories_delete_unknown_is_noop(hass, installed, hass_ws_client) -> None:
    # Seed two categories so the last-category guard does not fire; deleting an unknown
    # id then removes nothing but still succeeds.
    await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "a", "name": "A"}, {"id": "b", "name": "B"}],
    )
    resp = await _ws_send(hass_ws_client, type="ambience/categories/delete", category_id="nope")
    assert resp["success"] is True, resp
    list_resp = await _ws_send(hass_ws_client, type="ambience/categories/list")
    assert {g["id"] for g in list_resp["result"]["categories"]} == {"a", "b"}


async def test_categories_delete_blocked_in_use_returns_category_in_use(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Deleting a category that still has scenes returns a stable category_in_use code."""
    await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "a", "name": "A"}, {"id": "b", "name": "B"}],
    )
    save = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "scenes": [
                {
                    "name": "in category a",
                    "category": "a",
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {},
                        }
                    ],
                }
            ],
        },
    )
    assert save["success"] is True, save

    resp = await _ws_send(hass_ws_client, id=3, type="ambience/categories/delete", category_id="a")
    assert resp["success"] is False
    assert resp["error"]["code"] == "category_in_use"
    assert "still has scenes" in resp["error"]["message"]


async def test_categories_delete_blocked_last_returns_category_last(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """Deleting the only remaining category returns a stable category_last code."""
    # A fresh install seeds exactly one category ("general").
    resp = await _ws_send(hass_ws_client, type="ambience/categories/delete", category_id="general")
    assert resp["success"] is False
    assert resp["error"]["code"] == "category_last"
    assert "last category" in resp["error"]["message"]


async def test_ws_apply_runs_even_when_switch_off(
    hass: HomeAssistant, installed_with_actions, hass_ws_client, area_id
) -> None:
    from pytest_homeassistant_custom_component.common import async_mock_service

    calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.l"], "params": {}}
                    ],
                }
            ]
        },
    )
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    resp = await _ws_send(hass_ws_client, type="ambience/apply", area_id=area_id)

    assert resp["success"] is True
    assert resp["result"] == {"ok": True}
    assert len(calls) == 1


async def test_ws_apply_requires_exactly_one_scope(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/apply")
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_ws_run_scene_actions(
    hass: HomeAssistant, installed_with_actions, hass_ws_client, area_id
) -> None:
    from pytest_homeassistant_custom_component.common import async_mock_service

    calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "R1",
                    "category": "lighting",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.nope",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.l"], "params": {}}
                    ],
                }
            ]
        },
    )

    resp = await _ws_send(
        hass_ws_client, type="ambience/scene/run_actions", area_id=area_id, scene_index=0
    )

    assert resp["success"] is True
    assert resp["result"] == {"ran": 1, "scene_name": "R1"}
    assert len(calls) == 1


async def test_ws_run_scene_actions_out_of_range(
    hass: HomeAssistant, installed_with_actions, hass_ws_client, area_id
) -> None:
    resp = await _ws_send(
        hass_ws_client, type="ambience/scene/run_actions", area_id=area_id, scene_index=9
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_ws_run_scene_actions_requires_exactly_one_scope(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/scene/run_actions", scene_index=0)
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


# ---------------------------------------------------------------------------
# Newly added tests to cover previously-uncovered branches
# ---------------------------------------------------------------------------


# --- exposed_actions/save warning loop: non-string service (line 277 continue) ---


async def test_exposed_actions_save_skips_action_with_non_string_service(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """An action whose 'service' value is not a string is silently skipped.
    Save still succeeds."""
    _seed_services_catalog(hass)
    # Bypass WS validation and write the config directly so the scene carries a
    # non-string service value that would otherwise be rejected by
    # validate_scope_config.
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "bad svc",
                    "when": {},
                    # service is a dict, not a string — the scan must skip it
                    "actions": [
                        {"service": {"domain": "light", "service": "turn_on"}, "params": {}}
                    ],
                }
            ]
        },
    )
    # Now save exposed actions; the non-string branch must not crash.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": [],
                "defaults": {},
            }
        ],
    )
    assert resp["success"] is True
    assert "warnings" not in resp["result"]


# --- exposed_actions/save warning loop: service not in old OR new list (line 291 continue) ---


async def test_exposed_actions_save_skips_action_with_service_never_exposed(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """An action whose service was never in the exposed list saves without error."""
    _seed_services_catalog(hass)
    # Write a scene that references a service that will never be in the exposed list.
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "name": "phantom",
                    "when": {},
                    "actions": [{"service": "switch.turn_on", "entity_ids": [], "params": {}}],
                }
            ]
        },
    )
    # Save exposed actions that don't include switch.turn_on — save must succeed.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": [],
                "defaults": {},
            }
        ],
    )
    assert resp["success"] is True
    assert "warnings" not in resp["result"]


# --- floor/save: validate_scope_config raises ValueError (lines 417-419) ---


async def test_floor_save_rejects_invalid_config(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    """floor/save returns a validation_error when validate_scope_config raises."""
    # An action with a missing 'service' key triggers the ValueError path.
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [{"entity_ids": [], "params": {}}],
            }
        ],
    }
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/floor/save",
        floor_id=floor_id,
        config=config,
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "service" in resp["error"]["message"]


# --- house/save: validate_scope_config raises ValueError (lines 457-459) ---


async def test_house_save_rejects_invalid_config(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """house/save returns a validation_error when validate_scope_config raises."""
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [{"entity_ids": [], "params": {}}],
            }
        ],
    }
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/house/save",
        config=config,
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "service" in resp["error"]["message"]


# --- validate: validate_scope_config raises ValueError (lines 484-486) ---


async def test_validate_rejects_invalid_config(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """ambience/validate returns a validation_error when the config is invalid."""
    config = {
        "scenes": [
            {
                "when": {},
                "actions": [{"entity_ids": [], "params": {}}],
            }
        ],
    }
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config=config,
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


# --- _house_must_be_true: non-True value rejected at schema layer (line 492) ---


async def test_dry_run_house_false_is_schema_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """Passing house=False to dry_run invokes _house_must_be_true(False), which
    raises vol.Invalid, causing a schema-level error response."""
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", house=False)
    assert resp["success"] is False


# --- categories/save: blank/whitespace-only category id (lines 847-850) ---


async def test_categories_save_rejects_whitespace_only_id(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """A category whose id is an empty or whitespace-only string is rejected
    with invalid_categories (lines 847-850)."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "   ", "name": "Lights"}],
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "invalid_categories"
    assert "non-empty string" in resp["error"]["message"]


# --- categories/delete: plain ValueError fallback (lines 896-898) ---


async def test_categories_delete_plain_value_error_returns_validation_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """If async_delete_category raises a plain ValueError (not the more-specific
    subclass errors), the handler maps it to validation_error (lines 896-898)."""
    from unittest.mock import AsyncMock, patch

    with patch.object(
        hass.data[DOMAIN][DATA_STORE],
        "async_delete_category",
        new=AsyncMock(side_effect=ValueError("something went wrong")),
    ):
        resp = await _ws_send(
            hass_ws_client,
            type="ambience/categories/delete",
            category_id="general",
        )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "something went wrong" in resp["error"]["message"]


def _matching_scene_config() -> dict:
    """A state scene that matches when binary_sensor.motion is on."""
    return {
        "scenes": [
            {
                "category": "lighting",
                "when": {
                    "state": {
                        "kind": "is",
                        "entity_id": "binary_sensor.motion",
                        "states": ["on"],
                    }
                },
                "actions": [
                    {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                ],
            }
        ]
    }


async def test_area_save_reapplies_scope(
    hass: HomeAssistant, installed, hass_ws_client, area_id
) -> None:
    """Saving an area (e.g. toggling or editing a scene) re-evaluates that scope
    via the engine's debounced reload refresh rather than waiting for the next
    trigger."""
    from datetime import UTC, datetime, timedelta

    from pytest_homeassistant_custom_component.common import (
        async_fire_time_changed,
        async_mock_service,
    )

    calls = async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=_matching_scene_config(),
    )
    assert resp["success"] is True
    await hass.async_block_till_done()
    # The config-change refresh is debounced; advance past the cooldown.
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert len(calls) >= 1  # the engine reload re-applied the matching state scene


async def test_house_save_reapplies_house_scope(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """Saving the house scope re-evaluates it via the engine's debounced reload."""
    from datetime import UTC, datetime, timedelta

    from pytest_homeassistant_custom_component.common import (
        async_fire_time_changed,
        async_mock_service,
    )

    calls = async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/house/save",
        config=_matching_scene_config(),
    )
    assert resp["success"] is True
    await hass.async_block_till_done()
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert len(calls) >= 1  # the engine reload re-applied the matching state scene


# --- auto_triggers/list (read-only Auto-triggers display) -------------------


class _FauxEntityCondition:
    """A condition whose trigger_deps watches one fixed entity."""

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return TriggerSpec(entities=frozenset({"binary_sensor.motion"}))


async def test_auto_triggers_list_returns_derived_rows(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    hass.data[DOMAIN][DATA_CONDITIONS]["faux"] = _FauxEntityCondition()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {"scenes": [{"name": "S", "when": {"faux": {"x": 1}}, "actions": []}]}
    )
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/list", scope_kind="house")
    assert resp["success"] is True
    assert resp["result"]["opaque"] is False
    assert {
        "key": "entity:binary_sensor.motion",
        "kind": "entity",
        "entity_id": "binary_sensor.motion",
    } in resp["result"]["triggers"]


async def test_auto_triggers_list_empty_scope_has_no_triggers(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/list", scope_kind="house")
    assert resp["success"] is True
    assert resp["result"] == {"triggers": [], "opaque": False}


async def test_auto_triggers_list_rejects_unknown_scope_kind(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/list", scope_kind="galaxy")
    assert resp["success"] is False


async def test_categories_save_rejects_empty_list(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """An empty list would wipe every category (the at-least-one invariant is
    only restored by _ensure_categories on the next restart) — mirror the
    delete path's last-category guard."""
    resp = await _ws_send(hass_ws_client, type="ambience/categories/save", categories=[])
    assert not resp["success"]
    assert resp["error"]["code"] == "category_last"


async def test_categories_save_rejects_removing_in_use_category(
    hass: HomeAssistant, installed, hass_ws_client, area_id
) -> None:
    """A stale-tab save must not silently drop a category that still has
    scenes (orphaning them) — mirror the delete path's in-use guard."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id, {"scenes": [{"name": "r", "category": "general", "actions": []}]}
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/categories/save",
        categories=[{"id": "other", "name": "Other"}],
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "category_in_use"


@pytest.mark.parametrize(
    "config",
    [
        {"scenes": "abc"},
        {"scenes": ["not-a-dict"]},
        {"scenes": [{"when": []}]},
        {"scenes": [{"when": None, "actions": []}]},
        {"scenes": [{"actions": "nope"}]},
        {"scenes": [{"actions": [None]}]},
    ],
)
async def test_validate_rejects_malformed_shapes_cleanly(
    hass: HomeAssistant, installed, hass_ws_client, config
) -> None:
    """Malformed nested shapes must produce a clean validation_error, not an
    AttributeError that surfaces as unknown_error plus a logged traceback."""
    resp = await _ws_send(hass_ws_client, type="ambience/validate", config=config)
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


async def test_unload_unregisters_every_ws_command(hass: HomeAssistant, installed) -> None:
    """The unregister list is derived from the registration table, so it can't
    drift (it once missed ambience/state/known_attribute_values)."""
    from homeassistant.components import websocket_api

    registered = {k for k in hass.data[websocket_api.const.DOMAIN] if k.startswith("ambience/")}
    assert registered  # sanity: commands were registered

    await hass.config_entries.async_unload(installed.entry_id)
    await hass.async_block_till_done()

    leftover = {
        k for k in hass.data.get(websocket_api.const.DOMAIN, {}) if k.startswith("ambience/")
    }
    assert leftover == set()


async def test_scope_diagnostics_invalid_kind_is_validation_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """An unknown scope_kind raises ValueError in the store — surface it as a
    validation_error like the sibling (scope_kind, scope_id) commands do."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/diagnostics/scope",
        scope_kind="garbage",
        category="general",
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"


async def test_set_scope_enabled_rejects_unknown_area(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """A typo'd/stale id must not setdefault a permanent junk scope bucket
    into storage — validate against the registry like the save handlers do."""
    resp = await _ws_send(
        hass_ws_client, type="ambience/set_scope_enabled", area_id="nope", enabled=False
    )
    assert not resp["success"]
    assert resp["error"]["code"] == "validation_error"
    assert hass.data[DOMAIN][DATA_STORE].get_area("nope") is None


async def test_dry_run_snapshots_each_condition_once(
    hass: HomeAssistant, installed, hass_ws_client, area_id
) -> None:
    """dry_run resolves the whole-scope and per-category views from ONE
    snapshot sweep — two passes were pure waste and could produce inconsistent
    snapshots between the two halves of the same response."""
    calls: list[str] = []

    class CountingCondition:
        name = "counting"

        async def snapshot(self, hass, **_):
            calls.append("snap")
            return "v"

        def matches(self, predicate, snapshot):
            return True

        def describe(self, snapshot, predicate=None):
            return None

        def validate_predicate(self, predicate):
            return

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area_id, {"scenes": [{"name": "r", "category": "general", "actions": []}]}
    )
    hass.data[DOMAIN][DATA_CONDITIONS]["counting"] = CountingCondition()
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", area_id=area_id)
    assert resp["success"]
    assert len(calls) == 1


async def test_reapply_list_returns_defaults(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/reapply/list"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"] == {"enabled": False, "interval_seconds": 3600}


async def test_reapply_save_persists_and_signals(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    from custom_components.ambience.const import SIGNAL_REAPPLY_CONFIG_UPDATED

    fired = []
    async_dispatcher_connect(hass, SIGNAL_REAPPLY_CONFIG_UPDATED, lambda *_a: fired.append(True))
    client = await hass_ws_client()
    await client.send_json(
        {"id": 1, "type": "ambience/reapply/save", "enabled": True, "interval_seconds": 3600}
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"] == {"ok": True}
    assert fired == [True]
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_reapply_settings() == {"enabled": True, "interval_seconds": 3600}


async def test_reapply_save_rejects_bad_interval(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json(
        {"id": 1, "type": "ambience/reapply/save", "enabled": True, "interval_seconds": 30}
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "validation_error"


async def test_exposed_assistants_list_returns_defaults(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json({"id": 1, "type": "ambience/exposed_assistants/list"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"] == {
        "expose_assist": True,
        "expose_google": False,
        "expose_alexa": False,
    }


async def test_exposed_assistants_save_persists_and_signals(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    from homeassistant.core import callback
    from homeassistant.helpers.dispatcher import async_dispatcher_connect

    from custom_components.ambience.const import SIGNAL_EXPOSED_ASSISTANTS_UPDATED

    fired = []

    # @callback so the dispatcher runs it synchronously inline — a bare lambda is
    # run in the executor and `fired` may not be populated before the assert below
    # (see the dispatcher-test-callback-flake lesson).
    @callback
    def _on_signal(*_a: object) -> None:
        fired.append(True)

    async_dispatcher_connect(hass, SIGNAL_EXPOSED_ASSISTANTS_UPDATED, _on_signal)
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/exposed_assistants/save",
            "expose_assist": False,
            "expose_google": True,
            "expose_alexa": False,
        }
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"] == {"ok": True}
    assert fired == [True]
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_exposed_assistants() == {
        "conversation": False,
        "cloud.google_assistant": True,
        "cloud.alexa": False,
    }
    # Round-trip: list must reflect the saved non-default values, mapped back to
    # the dot-free wire fields (guards the assistant-id ↔ field translation).
    await client.send_json({"id": 2, "type": "ambience/exposed_assistants/list"})
    list_msg = await client.receive_json()
    assert list_msg["success"]
    assert list_msg["result"] == {
        "expose_assist": False,
        "expose_google": True,
        "expose_alexa": False,
    }


async def test_switch_defaults_save_persists_create_switches(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/switch_defaults/save",
            "name": "Ambience",
            "auto_on_delay_seconds": 0,
            "create_switches": True,
        }
    )
    msg = await client.receive_json()
    assert msg["success"] and msg["result"] == {"ok": True}
    store = hass.data[DOMAIN][DATA_STORE]
    assert store.get_switch_defaults()["create_switches"] is True
