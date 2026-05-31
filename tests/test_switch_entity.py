"""AmbienceScopeSwitch entity — house, floor, area variants."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    mock_restore_cache,
)

from custom_components.ambience.const import (
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)


async def _setup(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()


def _switch(hass: HomeAssistant, kind: str, sid: str | None) -> Any:
    return hass.data[DOMAIN][DATA_SWITCHES][(kind, sid)]


# --- creation ---------------------------------------------------------------


async def test_house_switch_always_exists(hass, mock_config_entry):
    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    assert ent.unique_id == "ambience_switch_global"
    assert ent.is_on is True


async def test_one_switch_per_area(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    ar.async_get(hass).async_create("Kitchen")
    await _setup(hass, mock_config_entry)
    area_switches = {k: v for k, v in hass.data[DOMAIN][DATA_SWITCHES].items() if k[0] == "area"}
    assert len(area_switches) == 2
    for (_, area_id), ent in area_switches.items():
        assert ent.unique_id == f"ambience_switch_area_{area_id}"


async def test_one_switch_per_floor(hass, mock_config_entry):
    fr.async_get(hass).async_create("Upstairs")
    fr.async_get(hass).async_create("Downstairs")
    await _setup(hass, mock_config_entry)
    floor_switches = {k: v for k, v in hass.data[DOMAIN][DATA_SWITCHES].items() if k[0] == "floor"}
    assert len(floor_switches) == 2


async def test_all_switches_share_one_ambience_device(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)

    # Exactly one device for the config entry, named "Ambience".
    devices = dr.async_entries_for_config_entry(dev_reg, mock_config_entry.entry_id)
    assert len(devices) == 1
    device = devices[0]
    assert device.name == "Ambience"

    # Every ambience switch entity hangs off that single device.
    switch_entities = [
        e
        for e in er.async_entries_for_config_entry(ent_reg, mock_config_entry.entry_id)
        if e.domain == "switch"
    ]
    assert len(switch_entities) >= 3  # house + area + floor
    for e in switch_entities:
        assert e.device_id == device.id


# --- behavior (use house switch; logic identical across scopes) -------------


async def test_turn_off_writes_off_at_and_schedules_timer(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    assert ent.is_on is False
    assert store.get_scope_switch_config("house", None)["off_at"] == fixed_utcnow["now"].isoformat()
    assert ent._timer is not None


async def test_turn_on_cancels_timer_and_clears_off_at(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    timer = ent._timer
    await ent.async_turn_on()
    await hass.async_block_till_done()
    assert ent.is_on is True
    assert ent._timer is None
    assert timer.cancelled()
    assert hass.data[DOMAIN][DATA_STORE].get_scope_switch_config("house", None)["off_at"] is None


async def test_zero_delay_disables_timer(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 0})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    assert ent._timer is None
    assert store.get_scope_switch_config("house", None)["off_at"] is not None


async def test_auto_on_fires_after_delay(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 60})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    fixed_utcnow["now"] += timedelta(seconds=61)
    async_fire_time_changed(hass, fixed_utcnow["now"])
    await hass.async_block_till_done()
    assert ent.is_on is True


# --- restore ----------------------------------------------------------------


async def test_restore_off_with_remaining_delay_reschedules(hass, mock_config_entry, fixed_utcnow):
    mock_restore_cache(hass, (State("switch.global_ambience", "off"),))
    from custom_components.ambience.store import AmbienceStore

    pre = AmbienceStore(hass)
    await pre.async_load()
    off_at = (fixed_utcnow["now"] - timedelta(minutes=10)).isoformat()
    await pre.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    await pre.async_set_scope_switch_off_at("house", None, off_at)

    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    assert ent.is_on is False
    assert ent._timer is not None


async def test_restore_off_expired_turns_on_immediately(hass, mock_config_entry, fixed_utcnow):
    mock_restore_cache(hass, (State("switch.global_ambience", "off"),))
    from custom_components.ambience.store import AmbienceStore

    pre = AmbienceStore(hass)
    await pre.async_load()
    off_at = (fixed_utcnow["now"] - timedelta(hours=10)).isoformat()
    await pre.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    await pre.async_set_scope_switch_off_at("house", None, off_at)

    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    assert ent.is_on is True


# --- dispatcher -------------------------------------------------------------


async def test_default_display_names_include_scope_prefix(hass, mock_config_entry):
    """Default display name is '<Global|floor|area> <defaults.name>'."""
    ar.async_get(hass).async_create("Master Bedroom")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    names = {ent.name for ent in hass.data[DOMAIN][DATA_SWITCHES].values()}
    assert names == {"Global Ambience", "Upstairs Ambience", "Master Bedroom Ambience"}


async def test_dispatcher_signal_global_updates_all_names(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Master", "auto_on_delay_seconds": 7200})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    names = {ent.name for ent in hass.data[DOMAIN][DATA_SWITCHES].values()}
    assert names == {"Global Master", "Upstairs Master", "Living Room Master"}


async def test_dispatcher_signal_scoped_updates_only_that_scope(hass, mock_config_entry):
    """A per-scope name override replaces the whole display name (verbatim)."""
    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    store = hass.data[DOMAIN][DATA_STORE]
    area_entries = [k for k in hass.data[DOMAIN][DATA_SWITCHES] if k[0] == "area"]
    area_kind, area_id = area_entries[0]
    await store.async_save_scope_switch(
        area_kind, area_id, {"name": "Kitchen lights", "auto_on_delay_seconds": None}
    )
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, (area_kind, area_id))
    await hass.async_block_till_done()

    # Override: verbatim, no prefix.
    assert _switch(hass, area_kind, area_id).name == "Kitchen lights"
    # House untouched: still the default '<prefix> Ambience'.
    assert _switch(hass, "house", None).name == "Global Ambience"


async def test_unload_cancels_pending_timers(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    timer = ent._timer
    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert timer.cancelled()
