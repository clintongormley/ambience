"""WebSocket search over the entity catalog — how the MCP consumer reaches an
entity that the bounded AI context only summarises."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry


@pytest.fixture
async def installed(hass, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


@pytest.fixture
def catalog(hass):
    area = ar.async_get(hass).async_create("Kitchen")
    ent_reg = er.async_get(hass)
    for object_id in ("ceiling", "spots"):
        entry = ent_reg.async_get_or_create(
            "light", "ambience", object_id, suggested_object_id=f"kitchen_{object_id}"
        )
        ent_reg.async_update_entity(entry.entity_id, area_id=area.id)
        hass.states.async_set(entry.entity_id, "on")
    kettle = ent_reg.async_get_or_create(
        "switch", "ambience", "kettle", suggested_object_id="kettle"
    )
    ent_reg.async_update_entity(kettle.entity_id, area_id=area.id)
    hass.states.async_set(kettle.entity_id, "off")
    return area


async def test_find_filters_by_domain(hass, installed, catalog, hass_ws_client) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/entities/find", domain="light")

    assert msg["success"]
    ids = [e["entity_id"] for e in msg["result"]["entities"]]
    assert ids == ["light.kitchen_ceiling", "light.kitchen_spots"]
    assert msg["result"]["total_matches"] == 2


async def test_find_pages_with_a_cursor(hass, installed, catalog, hass_ws_client) -> None:
    first = await _ws_send(hass_ws_client, type="ambience/entities/find", domain="light", limit=1)

    assert first["result"]["returned"] == 1
    assert first["result"]["cursor"] == 1
    assert first["result"]["truncated"] is True

    second = await _ws_send(
        hass_ws_client,
        type="ambience/entities/find",
        domain="light",
        limit=1,
        cursor=first["result"]["cursor"],
    )

    assert second["result"]["entities"][0]["entity_id"] == "light.kitchen_spots"
    assert second["result"]["cursor"] is None


async def test_find_query_matches_case_insensitively(
    hass, installed, catalog, hass_ws_client
) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/entities/find", query="KETTLE")

    assert [e["entity_id"] for e in msg["result"]["entities"]] == ["switch.kettle"]


async def test_find_with_no_filters_returns_the_catalog(
    hass, installed, catalog, hass_ws_client
) -> None:
    msg = await _ws_send(hass_ws_client, type="ambience/entities/find")

    assert msg["success"]
    assert msg["result"]["total_matches"] >= 3
