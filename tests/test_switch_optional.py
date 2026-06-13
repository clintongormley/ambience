"""create_switches gating + reconcile at platform setup."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)


async def _seed_create_switches(hass: HomeAssistant, enabled: bool) -> None:
    """Pre-seed the raw HA storage so the store loads with create_switches=<enabled>."""
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {},
            "conditions": {},
            "switch_defaults": {
                "name": "Ambience",
                "auto_on_delay_seconds": 0,
                "create_switches": enabled,
            },
        }
    )


def _entry(hass, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_no_switches_created_when_toggle_off(hass: HomeAssistant) -> None:
    ar.async_get(hass).async_create("Living Room")
    entry = _entry(hass, uid="off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN][DATA_SWITCHES] == {}


async def test_switch_per_enabled_scope_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="on")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    keys = set(hass.data[DOMAIN][DATA_SWITCHES])
    assert ("house", None) in keys
    assert ("area", area.id) in keys


async def test_disabled_scope_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="on2")
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
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="floor_off")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled("floor", floor.floor_id, False)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert ("floor", floor.floor_id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_disabled_house_gets_no_switch_when_toggle_on(hass: HomeAssistant) -> None:
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="house_off")
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
    entry = _entry(hass, uid="foreign")
    reg = er.async_get(hass)
    reg.async_get_or_create("sensor", DOMAIN, "ambience_not_a_switch", config_entry=entry)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert reg.async_get_entity_id("sensor", DOMAIN, "ambience_not_a_switch") is not None


async def test_area_create_makes_no_switch_when_toggle_off(hass: HomeAssistant) -> None:
    entry = _entry(hass, uid="off_create")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) not in hass.data[DOMAIN][DATA_SWITCHES]


async def test_area_create_makes_switch_when_toggle_on(hass: HomeAssistant) -> None:
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="on_create")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    area = ar.async_get(hass).async_create("Late Room")
    await hass.async_block_till_done()
    assert ("area", area.id) in hass.data[DOMAIN][DATA_SWITCHES]


async def test_reconcile_removes_switches_and_devices_when_toggle_off(hass: HomeAssistant) -> None:
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.ambience.const import SIGNAL_SWITCH_CONFIG_UPDATED

    area = ar.async_get(hass).async_create("Living Room")
    await _seed_create_switches(hass, True)
    entry = _entry(hass, uid="flip")
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    reg = er.async_get(hass)
    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is not None

    # Flip the store flag off and fire the live-reconcile signal (no reload needed)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults(
        {"name": "Ambience", "auto_on_delay_seconds": 0, "create_switches": False}
    )
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    assert reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house") is None
    assert reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_area_{area.id}") is None
    dev_reg = dr.async_get(hass)
    assert dev_reg.async_get_device(identifiers={(DOMAIN, "ambience")}) is None
    assert dev_reg.async_get_device(identifiers={(DOMAIN, f"area_{area.id}")}) is None


async def test_reconcile_creates_switches_when_store_flag_on(hass: HomeAssistant) -> None:
    """Flipping the store's create_switches on fires SIGNAL_SWITCH_CONFIG_UPDATED
    and the reconcile listener creates the house switch."""
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.ambience.const import SIGNAL_SWITCH_CONFIG_UPDATED

    # Set up entry with create_switches False in store (default)
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="reconcile_on",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    # No switches yet (create_switches is False in store)
    assert hass.data[DOMAIN][DATA_SWITCHES] == {}

    # Flip create_switches on in the store, then fire the signal
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults(
        {"name": "Ambience", "auto_on_delay_seconds": 0, "create_switches": True}
    )
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    # House switch should now exist
    ent_reg = er.async_get(hass)
    from custom_components.ambience.switch import switch_unique_id

    uid = switch_unique_id("house", None)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None


async def test_reconcile_removes_switches_when_store_flag_off(hass: HomeAssistant) -> None:
    """Flipping the store's create_switches off fires SIGNAL_SWITCH_CONFIG_UPDATED
    and the reconcile listener removes existing switches."""
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.ambience.const import SIGNAL_SWITCH_CONFIG_UPDATED

    # Set up entry with create_switches True in store so we start with switches
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={},
        unique_id="reconcile_off",
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Turn on first
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults(
        {"name": "Ambience", "auto_on_delay_seconds": 0, "create_switches": True}
    )
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    from custom_components.ambience.switch import switch_unique_id

    uid = switch_unique_id("house", None)
    assert ent_reg.async_get_entity_id("switch", DOMAIN, uid) is not None

    # Now turn off
    await store.async_save_switch_defaults(
        {"name": "Ambience", "auto_on_delay_seconds": 0, "create_switches": False}
    )
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    assert ent_reg.async_get_entity_id("switch", DOMAIN, switch_unique_id("house", None)) is None
