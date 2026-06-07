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
    assert ent.unique_id == "ambience_switch_house"
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
    assert store.get_scope_switch_off_at("house", None) == fixed_utcnow["now"].isoformat()
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
    assert hass.data[DOMAIN][DATA_STORE].get_scope_switch_off_at("house", None) is None


async def test_zero_delay_disables_timer(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 0})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    assert ent._timer is None
    assert store.get_scope_switch_off_at("house", None) is not None


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
    mock_restore_cache(hass, (State("switch.house_ambience", "off"),))
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
    mock_restore_cache(hass, (State("switch.house_ambience", "off"),))
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
    """Default display name is '<House|floor|area> <defaults.name>'."""
    ar.async_get(hass).async_create("Master Bedroom")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    names = {ent.name for ent in hass.data[DOMAIN][DATA_SWITCHES].values()}
    assert names == {"House Ambience", "Upstairs Ambience", "Master Bedroom Ambience"}


async def test_dispatcher_signal_global_updates_all_names(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Master", "auto_on_delay_seconds": 7200})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    names = {ent.name for ent in hass.data[DOMAIN][DATA_SWITCHES].values()}
    assert names == {"House Master", "Upstairs Master", "Living Room Master"}


async def test_name_ignores_legacy_per_scope_override(hass, mock_config_entry):
    """Per-scope name overrides were removed: a legacy ``switch.name`` in stored
    config is inert — the display name is always '<prefix> <defaults.name>'."""
    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    store = hass.data[DOMAIN][DATA_STORE]
    area_entries = [k for k in hass.data[DOMAIN][DATA_SWITCHES] if k[0] == "area"]
    area_kind, area_id = area_entries[0]
    # Inject a legacy override directly into stored config, then refresh.
    store.scope_config(area_kind, area_id).setdefault("switch", {})["name"] = "Kitchen lights"
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    assert _switch(hass, area_kind, area_id).name == "Living Room Ambience"
    assert _switch(hass, "house", None).name == "House Ambience"


async def test_unload_cancels_pending_timers(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    timer = ent._timer
    await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    assert timer.cancelled()


# --- _CancellableTimer -------------------------------------------------------


async def test_cancellable_timer_double_cancel_is_noop(hass, mock_config_entry, fixed_utcnow):
    """Calling cancel() a second time after the timer is already cancelled must
    not raise and must not call the underlying unsub a second time."""
    from unittest.mock import MagicMock

    from custom_components.ambience.switch import _CancellableTimer

    unsub = MagicMock()
    timer = _CancellableTimer(unsub)
    timer.cancel()
    assert timer.cancelled()
    assert unsub.call_count == 1

    # Second cancel — the `if not self._cancelled` guard must short-circuit.
    timer.cancel()
    assert unsub.call_count == 1  # still 1, not 2


# --- _schedule_auto_on replaces an existing timer ----------------------------


async def test_schedule_auto_on_replaces_existing_timer(hass, mock_config_entry, fixed_utcnow):
    """If a timer is already running when _schedule_auto_on is called again,
    the old timer is cancelled and replaced (lines 233-234)."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)

    # First turn-off schedules timer_a.
    await ent.async_turn_off()
    await hass.async_block_till_done()
    timer_a = ent._timer
    assert timer_a is not None

    # Manually call _apply_off again (simulating a second turn-off while off):
    # this exercises the cancel-existing-timer branch inside _schedule_auto_on.
    await ent._apply_off()
    await hass.async_block_till_done()
    timer_b = ent._timer

    assert timer_a.cancelled()
    assert timer_b is not None
    assert timer_b is not timer_a


# --- _schedule_auto_on_from_store edge cases ---------------------------------


async def test_schedule_auto_on_from_store_zero_delay_returns_early(
    hass, mock_config_entry, fixed_utcnow
):
    """When auto_on_delay_seconds is 0, _schedule_auto_on_from_store must return
    immediately without scheduling a timer (line 244)."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 0})
    ent = _switch(hass, "house", None)
    # Manually set the switch as off so the call is meaningful.
    ent._attr_is_on = False

    # Calling _schedule_auto_on_from_store with delay=0 must not schedule.
    ent._schedule_auto_on_from_store(turn_on_if_expired=True)
    assert ent._timer is None


async def test_schedule_auto_on_from_store_no_off_at_returns_early(
    hass, mock_config_entry, fixed_utcnow
):
    """When the store has no off_at recorded, _schedule_auto_on_from_store must
    return without scheduling a timer (line 247)."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)
    ent._attr_is_on = False
    # Store has no off_at for this scope (never been turned off).
    assert store.get_scope_switch_off_at("house", None) is None

    ent._schedule_auto_on_from_store(turn_on_if_expired=True)
    assert ent._timer is None


async def test_schedule_auto_on_from_store_invalid_off_at_logs_warning(
    hass, mock_config_entry, fixed_utcnow, caplog
):
    """A corrupt/unparseable off_at string must be ignored with a warning
    (lines 251-253)."""
    import logging

    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)
    ent._attr_is_on = False
    # Inject a corrupt timestamp directly into the store.
    await store.async_set_scope_switch_off_at("house", None, "not-a-valid-iso-timestamp")

    with caplog.at_level(logging.WARNING, logger="custom_components.ambience.switch"):
        ent._schedule_auto_on_from_store(turn_on_if_expired=True)

    assert ent._timer is None
    assert "invalid off_at" in caplog.text


async def test_schedule_auto_on_from_store_expired_turn_on_false_does_not_turn_on(
    hass, mock_config_entry, fixed_utcnow
):
    """When remaining <= 0 and turn_on_if_expired=False, the switch must NOT be
    turned on and no timer is scheduled (line 255->257 False branch)."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)
    ent._attr_is_on = False
    # Record an off_at that is older than the delay (expired).
    expired_off_at = (fixed_utcnow["now"] - timedelta(hours=2)).isoformat()
    await store.async_set_scope_switch_off_at("house", None, expired_off_at)

    ent._schedule_auto_on_from_store(turn_on_if_expired=False)
    await hass.async_block_till_done()

    assert ent.is_on is False
    assert ent._timer is None


# --- _handle_config_updated with switch off ----------------------------------


async def test_config_updated_while_off_reschedules_auto_on(hass, mock_config_entry, fixed_utcnow):
    """When the global config-updated signal fires while the switch is off,
    _handle_config_updated must call _schedule_auto_on_from_store (line 271)."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)

    # Turn off to install a timer.
    await ent.async_turn_off()
    await hass.async_block_till_done()
    old_timer = ent._timer
    assert old_timer is not None

    # Now update the defaults with a longer delay and fire the signal while off.
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    # The switch is still off and a (possibly new) timer is active.
    assert ent.is_on is False
    assert ent._timer is not None


# --- extra_state_attributes --------------------------------------------------


async def test_switch_exposes_off_at_and_delay(hass, mock_config_entry, fixed_utcnow):
    """extra_state_attributes must expose off_at (None when on) and auto_on_delay_seconds."""
    await _setup(hass, mock_config_entry)
    house = _switch(hass, "house", None)

    # After turning off, off_at is set.
    await house.async_turn_off()
    await hass.async_block_till_done()
    attrs = house.extra_state_attributes
    assert attrs["off_at"] is not None
    assert attrs["auto_on_delay_seconds"] == 7200

    # After turning on, off_at is cleared.
    await house.async_turn_on()
    await hass.async_block_till_done()
    attrs = house.extra_state_attributes
    assert attrs["off_at"] is None


def test_switch_unique_id_helper() -> None:
    from custom_components.ambience.switch import switch_unique_id

    assert switch_unique_id("house", None) == "ambience_switch_house"
    assert switch_unique_id("area", "living_room") == "ambience_switch_area_living_room"
    assert switch_unique_id("floor", "ground") == "ambience_switch_floor_ground"
