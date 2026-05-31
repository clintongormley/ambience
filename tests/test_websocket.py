"""WebSocket command API."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DATA_STORE, DOMAIN


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
    """Pre-expose the services the tests' rules reference."""
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
    and registered in the HA service catalog. Tests that build rules
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
    await store.async_save_area(kitchen.id, {"matchers": [], "rules": []})
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

    # scene matches the activating scene, has its own input widget, priority 1000
    assert "toggleable" not in by_name["scene"]
    assert by_name["scene"]["input"] == "scene_combobox"
    assert by_name["scene"]["priority"] == 1000

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
    assert resp["result"]["warnings"] == []

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


async def test_exposed_actions_save_warns_on_removed_service(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Removing a service from the exposed list while a rule still references
    it emits a dangling warning."""
    _seed_services_catalog(hass)
    # First expose light.turn_on so the rule below validates.
    await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {},
            }
        ],
    )
    # Save a rule that references the exposed service.
    save_area = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 30},
                        }
                    ],
                }
            ],
        },
    )
    assert save_area["success"] is True

    # Now remove the service from the exposed list → dangling warning.
    resp = await _ws_send(
        hass_ws_client,
        id=3,
        type="ambience/exposed_actions/save",
        actions=[],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area"
        and w["scope_id"] == area_id
        and w["rule_name"] == "movie"
        and "no longer exposed" in w["reason"]
        for w in warnings
    )


async def test_exposed_actions_save_warns_on_param_not_currently_exposed(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """If an existing rule sets a param that is no longer in visible_fields
    OR defaults (i.e. not currently exposed), the save emits a warning."""
    _seed_services_catalog(hass)
    await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct", "transition"],
                "defaults": {},
            }
        ],
    )
    save_area = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 30, "transition": 1.5},
                        }
                    ],
                }
            ],
        },
    )
    assert save_area["success"] is True

    # Re-save with `transition` removed from both visible and defaults → warn.
    resp = await _ws_send(
        hass_ws_client,
        id=3,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {},
            }
        ],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area"
        and w["scope_id"] == area_id
        and w["rule_name"] == "movie"
        and "transition" in w["reason"]
        and "not currently exposed" in w["reason"]
        for w in warnings
    )


async def test_exposed_actions_save_no_warning_when_param_in_defaults_only(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """A param matching a key in `defaults` (even if not in visible_fields)
    is still 'exposed' — no warning should fire."""
    _seed_services_catalog(hass)
    await _ws_send(
        hass_ws_client,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct", "transition"],
                "defaults": {},
            }
        ],
    )
    save_area = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "rules": [
                {
                    "name": "movie",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 30, "transition": 1.5},
                        }
                    ],
                }
            ],
        },
    )
    assert save_area["success"] is True

    # Move `transition` from visible to defaults — still exposed, no warning.
    resp = await _ws_send(
        hass_ws_client,
        id=3,
        type="ambience/exposed_actions/save",
        actions=[
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {"transition": 2.0},
            }
        ],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert not any("transition" in w["reason"] for w in warnings)


# ---------------------------------------------------------------------------
# Area save / get with the new action shape
# ---------------------------------------------------------------------------


async def test_area_save_accepts_valid_script_action(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "rules": [
            {
                "when": {"scene": "movie"},
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
        "rules": [
            {
                "when": {"scene": "movie"},
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
        "rules": [
            {
                "when": {"scene": "movie"},
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


async def test_area_save_rejects_unexposed_service(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Validator rejects a service that exists in HA but is not exposed."""
    # switch.turn_on is not in our seeded exposed list.
    config = {
        "rules": [
            {
                "when": {"scene": "movie"},
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
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "not exposed" in resp["error"]["message"]


async def test_area_save_rejects_non_list_entity_ids(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "rules": [
            {
                "when": {"scene": "movie"},
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
        "rules": [
            {
                "when": {"scene": "movie"},
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


async def test_area_save_accepts_param_not_in_visible_fields(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """A rule param key is NOT whitelisted against visible_fields any more —
    extra params (e.g. left over from a settings edit) are accepted; the
    dispatcher still sends them at execution."""
    config = {
        "rules": [
            {
                "when": {"scene": "movie"},
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
    assert resp["result"] == {"rules": []}


async def test_area_save_then_get(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    config = {
        "rules": [
            {
                "when": {"scene": "movie", "time_of_day": {"period": "evening"}},
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
    assert len(save["result"]["config"]["rules"]) == 1

    get = await _ws_send(hass_ws_client, id=2, type="ambience/area/get", area_id=area_id)
    assert get["success"] is True
    assert "auto_sort" not in get["result"]
    assert len(get["result"]["rules"]) == 1


async def test_area_save_rejects_area_id_not_in_registry(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """area/save only accepts area_ids that exist in HA's area registry."""
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id="not_a_real_area",
        config={"matchers": [], "rules": []},
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"
    assert "not_a_real_area" in resp["error"]["message"]


async def test_area_save_rejects_invalid_predicate(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    config = {
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
        area_id=area_id,
        config=config,
    )
    assert resp["success"] is False
    assert "garbage_predicate" in resp["error"]["message"]


async def test_validate_ok(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/validate",
        config={"matchers": [], "rules": []},
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
            "rules": [{"when": {"scene": ""}, "actions": []}],
        },
    )
    assert resp["success"] is False
    assert "scene" in resp["error"]["message"]


async def test_dry_run_returns_matched_rule(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
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
        scene="movie",
    )
    assert resp["success"] is True
    assert resp["result"]["matched_rule_index"] == 0
    assert resp["result"]["rule_name"] == "movie default"
    assert resp["result"]["actions"][0]["service"] == "light.turn_on"


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


async def test_dry_run_accepts_missing_scene(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """The dry_run WS command should accept a payload without `scene`."""
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "matchers": [],
            "rules": [
                {
                    "name": "scene-constrained rule",
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 50},
                        }
                    ],
                }
            ],
        },
    )
    assert save["success"] is True
    # Omitting `scene` from the payload — no validation_error, scene predicate stripped.
    resp = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
    )
    assert resp["success"] is True
    assert resp["result"]["matched_rule_index"] == 0
    assert resp["result"]["rule_name"] == "scene-constrained rule"
    assert "actions" in resp["result"]
    assert "snapshots_described" in resp["result"]


async def test_dry_run_with_floor_resolves_against_floor_rules(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_floor(
        floor_id,
        {
            "rules": [{"name": "movie", "when": {"scene": "movie"}, "actions": []}],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/dry_run",
        floor_id=floor_id,
        scene="movie",
    )
    assert resp["success"] is True
    assert resp["result"]["rule_name"] == "movie"


async def test_dry_run_with_house_resolves_against_house_rules(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_house(
        {
            "rules": [{"name": "away", "when": {"scene": "away"}, "actions": []}],
        },
    )
    resp = await _ws_send(hass_ws_client, type="ambience/dry_run", house=True, scene="away")
    assert resp["success"] is True
    assert resp["result"]["rule_name"] == "away"


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


async def test_area_save_sorts_rules_by_specificity(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Rules always come back sorted narrower predicate first."""
    wide = {
        "from": {"kind": "time", "hh": 10, "mm": 0},
        "to": {"kind": "time", "hh": 14, "mm": 0},
    }
    narrow = {
        "from": {"kind": "time", "hh": 12, "mm": 0},
        "to": {"kind": "time", "hh": 13, "mm": 0},
    }
    config = {
        "matchers": ["time_of_day"],
        "rules": [
            {"when": {"scene": "movie", "time_of_day": wide}, "actions": []},
            {"when": {"scene": "movie", "time_of_day": narrow}, "actions": []},
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
    assert sorted_rules[0]["when"]["time_of_day"] == narrow
    assert sorted_rules[1]["when"]["time_of_day"] == wide


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


async def test_sorted_rules_resolve_named_scene_over_catchall(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """A catch-all (scene=any) rule submitted first must not shadow a named-scene
    rule after auto-sort: the named rule sorts ahead and wins in dry_run."""
    config = {
        "matchers": [],
        "rules": [
            {"name": "catchall", "when": {"scene": None}, "actions": []},
            {"name": "movie-rule", "when": {"scene": "movie"}, "actions": []},
        ],
    }
    save = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config=config,
    )
    assert save["success"] is True
    # The named-scene rule comes before the catch-all.
    assert [r["name"] for r in save["result"]["config"]["rules"]] == [
        "movie-rule",
        "catchall",
    ]

    dry = await _ws_send(
        hass_ws_client,
        id=2,
        type="ambience/dry_run",
        area_id=area_id,
        scene="movie",
    )
    assert dry["success"] is True
    assert dry["result"]["rule_name"] == "movie-rule"


async def test_area_save_pins_and_resolves(
    hass: HomeAssistant, installed, area_id, hass_ws_client
) -> None:
    """Save assigns integer priority + pinned=False and returns rules in resolved order
    (more-specific predicate first). No auto_sort in the returned config."""
    config = {
        "rules": [
            {
                "name": "general",
                "when": {"scene": "movie"},
                "actions": [],
            },
            {
                "name": "specific",
                "when": {
                    "scene": "movie",
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
    rules = cfg["rules"]
    assert all(isinstance(r["priority"], int) for r in rules)
    assert all(r["pinned"] is False for r in rules)
    assert [r["name"] for r in rules] == ["specific", "general"]
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
    assert msg["result"]["warnings"] == []

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


async def test_ws_periods_save_returns_warnings_for_dangling_refs(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    """If a saved set leaves an existing rule referencing a now-missing period,
    save succeeds but returns a warning listing the affected rules."""
    from homeassistant.helpers import area_registry as ar

    area_reg = ar.async_get(hass)
    area = area_reg.async_create("Living Room")
    client = await hass_ws_client()
    await client.send_json(
        {
            "id": 1,
            "type": "ambience/area/save",
            "area_id": area.id,
            "config": {
                "matchers": ["time_of_day"],
                "rules": [
                    {
                        "name": "Evening rule",
                        "when": {"time_of_day": {"period": "evening"}},
                        "actions": [],
                    }
                ],
            },
        }
    )
    msg = await client.receive_json()
    assert msg["success"]

    # Now hide 'evening' via the periods save command
    await client.send_json(
        {
            "id": 2,
            "type": "ambience/time_of_day_periods/save",
            "custom": {},
            "hidden": ["evening"],
        }
    )
    msg = await client.receive_json()
    assert msg["success"]
    warnings = msg["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area"
        and w["scope_id"] == area.id
        and w["rule_name"] == "Evening rule"
        and w["missing_period"] == "evening"
        for w in warnings
    )


async def test_periods_save_warnings_include_floor_scope(
    hass: HomeAssistant, installed, hass_ws_client, floor_id
) -> None:
    """A dangling period reference in a floor's rule shows up in periods/save warnings."""
    store = hass.data[DOMAIN][DATA_STORE]
    # Save a floor rule referencing a custom period id we'll later delete.
    await store.async_save_floor(
        floor_id,
        {
            "rules": [
                {
                    "name": "evening",
                    "when": {"time_of_day": {"period": "supper"}},
                    "actions": [],
                }
            ],
        },
    )
    # Save periods with no `supper` entry → reference is dangling.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/time_of_day_periods/save",
        custom={},
        hidden=[],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    matching = [
        w for w in warnings if w.get("scope_kind") == "floor" and w.get("scope_id") == floor_id
    ]
    assert matching, f"expected a floor warning, got {warnings!r}"
    assert matching[0]["missing_period"] == "supper"


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
# C1: ambience/matchers/day/config/list + save
# ---------------------------------------------------------------------------


async def test_day_config_list_defaults(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/matchers/day/config/list")
    assert resp["success"] is True
    assert resp["result"] == {"workday_sensor": None, "workday_calendar": None}


async def test_day_config_save_round_trips(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/day/config/save",
        workday_sensor="binary_sensor.workday",
        workday_calendar="calendar.workday",
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True
    assert resp["result"]["warnings"] == []
    resp2 = await _ws_send(hass_ws_client, type="ambience/matchers/day/config/list")
    assert resp2["result"] == {
        "workday_sensor": "binary_sensor.workday",
        "workday_calendar": "calendar.workday",
    }


async def test_day_config_save_emits_warnings_when_clearing_sensor(
    hass, installed, hass_ws_client, area_id
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_matcher_config(
        "day",
        {
            "workday_sensor": "binary_sensor.workday",
            "workday_calendar": None,
        },
    )
    await store.async_save_area(
        area_id,
        {
            "rules": [
                {
                    "name": "Pay reminder",
                    "when": {"day": {"include": [{"kind": "workday"}], "exclude": []}},
                    "actions": [],
                }
            ],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/day/config/save",
        workday_sensor=None,
        workday_calendar=None,
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area" and w["scope_id"] == area_id and "workday_sensor" in w["reason"]
        for w in warnings
    )


# ---------------------------------------------------------------------------
# C2: Scene as regular matcher + other validation
# ---------------------------------------------------------------------------


async def test_area_save_ignores_legacy_matchers_field(
    hass, installed, hass_ws_client, area_id
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/area/save",
        area_id=area_id,
        config={
            "matchers": ["time_of_day"],  # legacy field — ignored
            "rules": [],
        },
    )
    assert resp["success"] is True


async def test_matchers_list_includes_weather(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/matchers/list")
    by_name = {m["name"]: m for m in resp["result"]}
    weather = by_name["weather"]
    assert "toggleable" not in weather
    assert weather["input"] == "weather_predicate"
    assert weather["priority"] == 700


async def test_matchers_list_includes_state(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/matchers/list")
    assert resp["success"] is True
    by_name = {m["name"]: m for m in resp["result"]}
    state = by_name["state"]
    assert "toggleable" not in state
    assert state["input"] == "state_predicate"
    assert state["priority"] == 950
    assert state["description"].strip() != ""
    assert state["predicate_help"].strip() != ""


async def test_weather_config_list_default(hass, installed, hass_ws_client) -> None:
    from custom_components.ambience.matchers.weather import DEFAULT_WEATHER_GROUPS

    resp = await _ws_send(hass_ws_client, type="ambience/matchers/weather/config/list")
    assert resp["success"] is True
    assert resp["result"] == {"entity": None, "groups": DEFAULT_WEATHER_GROUPS}


async def test_weather_config_save_round_trips(hass, installed, hass_ws_client) -> None:
    custom = [{"id": "wet", "label": "Wet", "conditions": ["rainy", "pouring"]}]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/weather/config/save",
        entity="weather.home",
        groups=custom,
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True
    assert resp["result"]["warnings"] == []
    resp2 = await _ws_send(hass_ws_client, type="ambience/matchers/weather/config/list")
    assert resp2["result"] == {"entity": "weather.home", "groups": custom}


async def test_weather_config_save_warns_when_clearing_referenced_entity(
    hass, installed, hass_ws_client, area_id
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_matcher_config(
        "weather",
        {
            "entity": "weather.home",
            "groups": [{"id": "wet", "label": "Wet", "conditions": ["rainy"]}],
        },
    )
    await store.async_save_area(
        area_id,
        {
            "rules": [
                {
                    "name": "Rainy",
                    "when": {"weather": {"groups": ["wet"], "thresholds": []}},
                    "actions": [],
                }
            ],
        },
    )
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/weather/config/save",
        entity=None,
        groups=[{"id": "wet", "label": "Wet", "conditions": ["rainy"]}],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area" and w["scope_id"] == area_id and "weather entity" in w["reason"]
        for w in warnings
    )


async def test_weather_config_save_warns_when_deleting_referenced_group(
    hass, installed, hass_ws_client, area_id
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_matcher_config(
        "weather",
        {
            "entity": "weather.home",
            "groups": [
                {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
                {"id": "sunny", "label": "Sunny", "conditions": ["sunny"]},
            ],
        },
    )
    await store.async_save_area(
        area_id,
        {
            "rules": [
                {
                    "name": "Rainy rule",
                    "when": {"weather": {"groups": ["wet"], "thresholds": []}},
                    "actions": [],
                }
            ],
        },
    )
    # Save with `wet` removed.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/weather/config/save",
        entity="weather.home",
        groups=[{"id": "sunny", "label": "Sunny", "conditions": ["sunny"]}],
    )
    assert resp["success"] is True
    warnings = resp["result"]["warnings"]
    assert any(
        w["scope_kind"] == "area"
        and w["scope_id"] == area_id
        and "wet" in w["reason"]
        and w["rule_name"] == "Rainy rule"
        for w in warnings
    )


async def test_weather_config_save_rejects_malformed_groups(
    hass, installed, hass_ws_client
) -> None:
    bad = [{"id": "wet", "label": "Wet", "conditions": ["not-a-real-condition"]}]
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/matchers/weather/config/save",
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
        type="ambience/matchers/weather/config/save",
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
    assert resp["result"] == {"rules": []}


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
        "rules": [{"name": "movie", "when": {}, "actions": []}],
    }
    resp = await _ws_send(
        hass_ws_client, type="ambience/floor/save", floor_id=floor_id, config=config
    )
    assert resp["success"] is True
    assert resp["result"]["ok"] is True

    resp2 = await _ws_send(hass_ws_client, type="ambience/floor/get", floor_id=floor_id)
    assert resp2["result"]["rules"][0]["name"] == "movie"


async def test_floor_save_unknown_floor_is_validation_error(
    hass: HomeAssistant, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/floor/save",
        floor_id="nope",
        config={"rules": []},
    )
    assert resp["success"] is False
    assert resp["error"]["code"] == "validation_error"


async def test_house_get_returns_default(hass: HomeAssistant, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/house/get")
    assert resp["success"] is True
    assert resp["result"] == {"rules": []}


async def test_house_save_round_trip(hass: HomeAssistant, installed, hass_ws_client) -> None:
    config = {
        "rules": [{"name": "away", "when": {}, "actions": []}],
    }
    resp = await _ws_send(hass_ws_client, type="ambience/house/save", config=config)
    assert resp["success"] is True

    resp2 = await _ws_send(hass_ws_client, type="ambience/house/get")
    assert resp2["result"]["rules"][0]["name"] == "away"


async def test_auto_triggers_get_defaults_true(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/get", scope_kind="house")
    assert resp["success"] is True
    assert resp["result"] == {"enabled": True}


async def test_auto_triggers_set_then_get(hass, installed, hass_ws_client) -> None:
    set_resp = await _ws_send(
        hass_ws_client,
        type="ambience/auto_triggers/set",
        scope_kind="area",
        scope_id="lr",
        enabled=False,
    )
    assert set_resp["success"] is True
    assert set_resp["result"] == {"ok": True}
    get_resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/get", scope_kind="area", scope_id="lr"
    )
    assert get_resp["result"] == {"enabled": False}


async def test_auto_triggers_get_unknown_scope_kind_errors(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/get", scope_kind="galaxy")
    assert resp["success"] is False


async def test_script_referenced_entities_unknown_script_is_empty(
    hass, installed, hass_ws_client
) -> None:
    resp = await _ws_send(
        hass_ws_client, type="ambience/script/referenced_entities", script="script.nope"
    )
    assert resp["success"] is True
    assert resp["result"] == {"entities": []}


async def test_script_referenced_entities_returns_sorted(hass, installed, hass_ws_client) -> None:
    from types import SimpleNamespace

    entity = SimpleNamespace(referenced_entities={"person.b", "person.a"})
    component = SimpleNamespace(get_entity=lambda eid: entity if eid == "script.s" else None)
    hass.data.setdefault("entity_components", {})["script"] = component
    resp = await _ws_send(
        hass_ws_client, type="ambience/script/referenced_entities", script="script.s"
    )
    assert resp["success"] is True
    assert resp["result"] == {"entities": ["person.a", "person.b"]}


async def test_auto_triggers_set_unknown_scope_kind_errors(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/set", scope_kind="galaxy", enabled=True
    )
    assert resp["success"] is False


async def _save_state_rule(hass: HomeAssistant) -> None:
    """Save an area `lr` with one rule watching binary_sensor.motion."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "rules": [
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


async def test_auto_triggers_list_returns_derived_triggers(hass, installed, hass_ws_client) -> None:
    await _save_state_rule(hass)
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    assert resp["success"] is True
    triggers = resp["result"]["triggers"]
    assert {
        "key": "entity:binary_sensor.motion",
        "kind": "entity",
        "entity_id": "binary_sensor.motion",
        "enabled": True,
    } in triggers
    assert resp["result"]["opaque"] is False


async def test_auto_triggers_list_empty_scope_is_empty(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="nope"
    )
    assert resp["success"] is True
    assert resp["result"] == {"triggers": [], "opaque": False}


async def test_auto_triggers_list_unknown_scope_kind_errors(
    hass, installed, hass_ws_client
) -> None:
    resp = await _ws_send(hass_ws_client, type="ambience/auto_triggers/list", scope_kind="galaxy")
    assert resp["success"] is False


async def test_set_trigger_then_list_shows_disabled(hass, installed, hass_ws_client) -> None:
    await _save_state_rule(hass)
    set_resp = await _ws_send(
        hass_ws_client,
        type="ambience/auto_triggers/set_trigger",
        scope_kind="area",
        scope_id="lr",
        key="entity:binary_sensor.motion",
        enabled=False,
    )
    assert set_resp["success"] is True
    assert set_resp["result"] == {"ok": True}
    list_resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    row = next(
        t for t in list_resp["result"]["triggers"] if t["key"] == "entity:binary_sensor.motion"
    )
    assert row["enabled"] is False


async def test_set_trigger_unknown_scope_kind_errors(hass, installed, hass_ws_client) -> None:
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/auto_triggers/set_trigger",
        scope_kind="galaxy",
        key="entity:x.y",
        enabled=False,
    )
    assert resp["success"] is False


async def test_set_trigger_rejects_reapply_key(hass, installed, hass_ws_client) -> None:
    # reapply:* rows are read-only; the backend must refuse to disable them so
    # the key can never pollute disabled_triggers.
    resp = await _ws_send(
        hass_ws_client,
        type="ambience/auto_triggers/set_trigger",
        scope_kind="area",
        scope_id="lr",
        key="reapply:300",
        enabled=False,
    )
    assert resp["success"] is False
    assert "re-apply" in resp["error"]["message"].lower()


async def test_auto_triggers_list_groups_time_and_sun(hass, installed, hass_ws_client) -> None:
    """A time_of_day rule produces a single grouped 'time' row, not per-time rows."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "when": {
                        "time_of_day": {
                            "from": {"kind": "time", "hh": 7, "mm": 0},
                            "to": {"kind": "time", "hh": 22, "mm": 0},
                        }
                    },
                    "actions": [],
                }
            ]
        },
    )
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    triggers = resp["result"]["triggers"]
    time_rows = [t for t in triggers if t["kind"] == "time"]
    assert len(time_rows) == 1
    assert time_rows[0]["key"] == "group:time"
    clocks = {(c["hour"], c["minute"]) for c in time_rows[0]["clocks"]}
    assert clocks == {(7, 0), (22, 0)}


async def test_set_group_trigger_then_list_shows_disabled(hass, installed, hass_ws_client) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "when": {
                        "time_of_day": {
                            "from": {"kind": "time", "hh": 7, "mm": 0},
                            "to": {"kind": "time", "hh": 22, "mm": 0},
                        }
                    },
                    "actions": [],
                }
            ]
        },
    )
    await _ws_send(
        hass_ws_client,
        type="ambience/auto_triggers/set_trigger",
        scope_kind="area",
        scope_id="lr",
        key="group:time",
        enabled=False,
    )
    list_resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    row = next(t for t in list_resp["result"]["triggers"] if t["key"] == "group:time")
    assert row["enabled"] is False


async def test_auto_triggers_list_includes_reapply_row(hass, installed, hass_ws_client) -> None:
    """A scope whose rule action has reapply_seconds set yields a reapply row."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "when": {},
                    "actions": [{"service": "light.turn_on", "reapply_seconds": 300}],
                }
            ]
        },
    )
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    assert resp["success"] is True
    triggers = resp["result"]["triggers"]
    reapply_rows = [t for t in triggers if t["kind"] == "reapply"]
    assert len(reapply_rows) == 1
    assert reapply_rows[0]["key"] == "reapply:300"
    assert reapply_rows[0]["interval_seconds"] == 300
    assert reapply_rows[0]["enabled"] is True


async def test_auto_triggers_list_no_reapply_row_when_not_set(
    hass, installed, hass_ws_client
) -> None:
    """A scope with no reapply_seconds in any action yields no reapply row."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "when": {},
                    "actions": [{"service": "light.turn_on"}],
                }
            ]
        },
    )
    resp = await _ws_send(
        hass_ws_client, type="ambience/auto_triggers/list", scope_kind="area", scope_id="lr"
    )
    assert resp["success"] is True
    triggers = resp["result"]["triggers"]
    assert not any(t["kind"] == "reapply" for t in triggers)


async def test_area_save_rejects_bad_action_reapply(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Validator rejects reapply_seconds that is not 0 or >= 10."""
    config = {
        "auto_sort": True,
        "rules": [
            {
                "when": {"scene": "movie"},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": [],
                        "params": {},
                        "reapply_seconds": 9,
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
    assert resp["error"]["code"] == "validation_error"
    assert "reapply_seconds" in resp["error"]["message"]


async def test_area_save_accepts_valid_action_reapply(
    hass: HomeAssistant, installed_with_actions, area_id, hass_ws_client
) -> None:
    """Validator accepts reapply_seconds >= 10."""
    config = {
        "auto_sort": True,
        "rules": [
            {
                "when": {"scene": "movie"},
                "actions": [
                    {
                        "service": "light.turn_on",
                        "entity_ids": [],
                        "params": {},
                        "reapply_seconds": 300,
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
