"""Switch entities follow HA area + floor registries dynamically."""

from __future__ import annotations

import pytest
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.const import DATA_SWITCHES, DOMAIN


@pytest.fixture
async def installed(hass, mock_config_entry):
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_house_switch_present_after_setup(hass, installed):
    assert ("house", None) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_added_post_setup_gets_a_switch(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_floor_added_post_setup_gets_a_switch(hass, installed):
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_removal_drops_switch(hass, installed):
    area = ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    uid = f"ambience_switch_area_{area.id}"
    ent_reg = er.async_get(hass)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None

    ar.async_get(hass).async_delete(area.id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is None


async def test_floor_removal_drops_switch(hass, installed):
    floor = fr.async_get(hass).async_create("Loft")
    await hass.async_block_till_done()
    uid = f"ambience_switch_floor_{floor.floor_id}"
    ent_reg = er.async_get(hass)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None

    fr.async_get(hass).async_delete(floor.floor_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is None
