"""create_switches gating + reconcile at platform setup."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    CONF_CREATE_SWITCHES,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)


def _entry(hass, *, create_switches: bool, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_CREATE_SWITCHES: create_switches},
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_no_switches_created_when_toggle_off(hass: HomeAssistant) -> None:
    ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=False, uid="off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_SWITCHES] == {}


async def test_switch_per_enabled_scope_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="on")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    keys = set(hass.data[DOMAIN][DATA_SWITCHES])
    assert ("house", None) in keys
    assert ("area", area.id) in keys


async def test_disabled_scope_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="on2")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("area", area.id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_floor_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    from homeassistant.helpers import floor_registry as fr

    floor = fr.async_get(hass).async_create("Upstairs")
    entry = _entry(hass, create_switches=True, uid="floor_off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("floor", floor.floor_id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_house_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    entry = _entry(hass, create_switches=True, uid="house_off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("house", None, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("house", None) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_reconcile_ignores_non_ambience_switch_entities(hass: HomeAssistant) -> None:
    # A non-switch entity owned by the ambience config entry must be skipped by the
    # reconcile (only ambience SWITCH entities are eligible for deletion).
    entry = _entry(hass, create_switches=False, uid="foreign")
    reg = er.async_get(hass)
    reg.async_get_or_create("sensor", DOMAIN, "ambience_not_a_switch", config_entry=entry)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert reg.async_get_entity_id("sensor", DOMAIN, "ambience_not_a_switch") is not None


async def test_reconcile_removes_switches_and_devices_when_toggle_off(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, create_switches=True, uid="flip")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None

    hass.config_entries.async_update_entry(entry, options={CONF_CREATE_SWITCHES: False})
    await hass.async_block_till_done()

    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_area_{area.id}") is None
    dev_reg = dr.async_get(hass)
    assert dev_reg.async_get_device(identifiers={(DOMAIN, "ambience")}) is None
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"area_{area.id}")}) is None
