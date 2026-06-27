"""Scope switches are always created for every enabled scope (no opt-out)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DATA_SWITCHES, DOMAIN


def _entry(hass, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, title="Ambience", data={}, options={}, unique_id=uid)
    entry.add_to_hass(hass)
    return entry


async def test_house_and_enabled_area_get_switches_with_no_seed(hass: HomeAssistant) -> None:
    # No store pre-seed at all (clean install) ⇒ switches still created.
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, uid="fresh")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    keys = set(hass.data[DOMAIN][DATA_SWITCHES])
    assert ("house", None) in keys
    assert ("area", area.id) in keys


async def test_area_created_after_setup_gets_a_switch(hass: HomeAssistant) -> None:
    entry = _entry(hass, uid="late")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_scope_still_gets_no_switch(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, uid="disabled")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area.id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_floor_still_gets_no_switch(hass: HomeAssistant) -> None:
    floor = fr.async_get(hass).async_create("Upstairs")
    entry = _entry(hass, uid="floor_disabled")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("floor", floor.floor_id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]
