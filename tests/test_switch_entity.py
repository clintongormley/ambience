"""AmbienceScopeSwitch entity — house, floor, area variants."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
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
from tests import get_scope_device


async def _setup(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> None:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()


def _switch(hass: HomeAssistant, kind: str, sid: str | None) -> Any:
    return hass.data[DOMAIN][DATA_SWITCHES][(kind, sid)]


def _due_times(track: Any) -> list[datetime]:
    """The due times passed to the patched `async_track_point_in_utc_time` — the
    auto-on timer's arming point, which the entity itself does not retain."""
    return [call.args[2] for call in track.call_args_list]


def _only_area_id(hass: HomeAssistant) -> str:
    """The scope_id of the sole area switch (for tests that create one area)."""
    area_id = next((k[1] for k in hass.data[DOMAIN][DATA_SWITCHES] if k[0] == "area"), None)
    assert area_id is not None, "no area switch registered"
    return area_id


def _only_floor_id(hass: HomeAssistant) -> str:
    """The scope_id of the sole floor switch (for tests that create one floor)."""
    floor_id = next((k[1] for k in hass.data[DOMAIN][DATA_SWITCHES] if k[0] == "floor"), None)
    assert floor_id is not None, "no floor switch registered"
    return floor_id


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


async def test_each_scope_gets_its_own_device(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    dev_reg = dr.async_get(hass)
    ent_reg = er.async_get(hass)
    entry_id = mock_config_entry.entry_id

    # One device per scope: house (main) + 1 floor + 1 area = 3.
    # (The old "Ambience" hub device for the Scene-updates sensor was removed
    # when that sensor was replaced by per-scope logbook entries.)
    devices = dr.async_entries_for_config_entry(dev_reg, entry_id)
    assert len(devices) == 3

    main = get_scope_device(dev_reg, (DOMAIN, "ambience"), entry_id)
    assert main is not None
    assert main.name == "House Ambience"

    # Floor + area devices are sub-devices linked to the main device.
    area_id = _only_area_id(hass)
    floor_id = _only_floor_id(hass)
    area_dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area_id}"), entry_id)
    floor_dev = get_scope_device(dev_reg, (DOMAIN, f"floor_{floor_id}"), entry_id)
    assert area_dev is not None and area_dev.via_device_id == main.id
    assert floor_dev is not None and floor_dev.via_device_id == main.id

    # Each switch entity is on its own scope device.
    house_eid = ent_reg.async_get_entity_id("switch", DOMAIN, "ambience_switch_house")
    area_eid = ent_reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_area_{area_id}")
    floor_eid = ent_reg.async_get_entity_id("switch", DOMAIN, f"ambience_switch_floor_{floor_id}")
    assert ent_reg.async_get(house_eid).device_id == main.id
    assert ent_reg.async_get(area_eid).device_id == area_dev.id
    assert ent_reg.async_get(floor_eid).device_id == floor_dev.id


# --- behavior (use house switch; logic identical across scopes) -------------


async def test_turn_off_writes_off_at_and_schedules_timer(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()

    assert ent.is_on is False
    assert store.get_scope_switch_off_at("house", None) == fixed_utcnow["now"].isoformat()
    assert ent._timer is not None


async def test_turn_on_cancels_timer_and_clears_off_at(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    timer = ent._timer
    await ent.async_turn_on()
    await hass.async_block_till_done()
    assert ent.is_on is True
    assert ent._timer is None
    assert timer.cancelled()
    assert store.get_scope_switch_off_at("house", None) is None


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
    # off_at writes are delayed (loss-tolerant runtime state) — flush before
    # the fresh store loads from disk.
    fixed_utcnow["now"] += timedelta(seconds=2)
    async_fire_time_changed(hass, fixed_utcnow["now"])
    await hass.async_block_till_done()

    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    assert ent.is_on is False
    assert ent._timer is not None


async def test_restore_off_without_off_at_arms_full_delay(hass, mock_config_entry, fixed_utcnow):
    """HA stopped before the delayed off_at save landed: the switch restores as
    off with no persisted pause time and must still resume automatically."""
    mock_restore_cache(hass, (State("switch.house_ambience", "off"),))
    from custom_components.ambience.store import AmbienceStore

    pre = AmbienceStore(hass)
    await pre.async_load()
    await pre.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 60})
    # No off_at is persisted at all — the crash lost it.

    with patch(
        "custom_components.ambience.switch.async_track_point_in_utc_time",
        wraps=async_track_point_in_utc_time,
    ) as track:
        await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    store = hass.data[DOMAIN][DATA_STORE]

    assert ent.is_on is False
    # "now" becomes the pause time, so the full 60s delay is armed from here.
    assert ent._timer is not None
    assert _due_times(track) == [fixed_utcnow["now"] + timedelta(seconds=60)]
    assert store.get_scope_switch_off_at("house", None) == fixed_utcnow["now"].isoformat()


async def test_restore_off_expired_turns_on_immediately(hass, mock_config_entry, fixed_utcnow):
    mock_restore_cache(hass, (State("switch.house_ambience", "off"),))
    from custom_components.ambience.store import AmbienceStore

    pre = AmbienceStore(hass)
    await pre.async_load()
    off_at = (fixed_utcnow["now"] - timedelta(hours=10)).isoformat()
    await pre.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    await pre.async_set_scope_switch_off_at("house", None, off_at)
    # off_at writes are delayed (loss-tolerant runtime state) — flush before
    # the fresh store loads from disk.
    fixed_utcnow["now"] += timedelta(seconds=2)
    async_fire_time_changed(hass, fixed_utcnow["now"])
    await hass.async_block_till_done()

    await _setup(hass, mock_config_entry)
    ent = _switch(hass, "house", None)
    assert ent.is_on is True


# --- dispatcher -------------------------------------------------------------


def _friendly(hass: HomeAssistant, entity_id: str) -> str | None:
    state = hass.states.get(entity_id)
    return state.attributes.get("friendly_name") if state else None


async def test_friendly_names_are_not_doubled(hass, mock_config_entry):
    ar.async_get(hass).async_create("Master Bedroom")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    names = {_friendly(hass, s.entity_id) for s in hass.states.async_all("switch")}
    assert names == {"House Ambience", "Upstairs Ambience", "Master Bedroom Ambience"}


async def test_default_name_change_updates_device_names(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Master", "auto_on_delay_seconds": 7200})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    names = {d.name for d in dr.async_entries_for_config_entry(dev_reg, mock_config_entry.entry_id)}
    # Scope devices follow the default-name change.
    # (The old "Ambience" hub device no longer exists — the Scene-updates sensor
    # was replaced by per-scope logbook entries.)
    assert names == {"House Master", "Upstairs Master", "Living Room Master"}


async def test_area_rename_updates_device_name(hass, mock_config_entry):
    area = ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    # No manual signal dispatch: the area-registry 'update' event must drive the
    # device-name resync on its own (see also test_init_switch_lifecycle).
    ar.async_get(hass).async_update(area.id, name="Lounge")
    await hass.async_block_till_done()

    dev_reg = dr.async_get(hass)
    dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), mock_config_entry.entry_id)
    assert dev.name == "Lounge Ambience"


async def test_user_device_rename_is_preserved(hass, mock_config_entry):
    area = ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    dev_reg = dr.async_get(hass)
    dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), mock_config_entry.entry_id)
    dev_reg.async_update_device(dev.id, name_by_user="My Lounge")

    # A default-name change must not clobber the user's rename.
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Master", "auto_on_delay_seconds": 7200})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()

    assert _friendly(hass, "switch.living_room_ambience") == "My Lounge"


async def test_unload_cancels_pending_timers(hass, mock_config_entry, fixed_utcnow):
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})
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


async def test_schedule_auto_on_from_store_no_off_at_arms_full_delay(
    hass, mock_config_entry, fixed_utcnow
):
    """A paused switch with no recorded off_at treats now as its pause time:
    the full delay is armed and the pause time is persisted."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)
    ent._attr_is_on = False
    # Store has no off_at for this scope (never been turned off).
    assert store.get_scope_switch_off_at("house", None) is None

    with patch(
        "custom_components.ambience.switch.async_track_point_in_utc_time",
        wraps=async_track_point_in_utc_time,
    ) as track:
        ent._schedule_auto_on_from_store(turn_on_if_expired=True)
        await hass.async_block_till_done()
    assert ent._timer is not None
    assert _due_times(track) == [fixed_utcnow["now"] + timedelta(seconds=3600)]
    assert store.get_scope_switch_off_at("house", None) == fixed_utcnow["now"].isoformat()


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
    assert attrs["auto_on_delay_seconds"] == 0

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


# --- area device placement ---------------------------------------------------


async def test_area_device_assigned_to_its_area(hass, mock_config_entry):
    area = ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    await _setup(hass, mock_config_entry)

    dev_reg = dr.async_get(hass)
    entry_id = mock_config_entry.entry_id
    area_dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), entry_id)
    assert area_dev.area_id == area.id

    # Floor + house devices have no area.
    floor_id = _only_floor_id(hass)
    floor_dev = get_scope_device(dev_reg, (DOMAIN, f"floor_{floor_id}"), entry_id)
    main = get_scope_device(dev_reg, (DOMAIN, "ambience"), entry_id)
    assert floor_dev.area_id is None
    assert main.area_id is None


async def test_area_assignment_does_not_override_user_move(hass, mock_config_entry):
    area = ar.async_get(hass).async_create("Living Room")
    other = ar.async_get(hass).async_create("Garage")
    await _setup(hass, mock_config_entry)

    dev_reg = dr.async_get(hass)
    entry_id = mock_config_entry.entry_id
    area_dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), entry_id)
    # User moves the device to a different area.
    dev_reg.async_update_device(area_dev.id, area_id=other.id)

    # Re-running the assignment (e.g. via a reload) must not move it back.
    sw = _switch(hass, "area", area.id)
    sw._assign_area_device()
    assert get_scope_device(dev_reg, (DOMAIN, f"area_{area.id}"), entry_id).area_id == other.id


# --- via_device_id linking (house <- floor/area) -----------------------------


async def test_scope_device_lookup_is_config_entry_scoped_on_new_ha(hass, mock_config_entry):
    """On HA 2026.8+ (async_get_device_by_identifier available), _link_via_device
    resolves the house device scoped to our config entry and links the child via
    via_device_id — not the deprecated identifier-only async_get_device."""
    from unittest.mock import MagicMock, patch

    from custom_components.ambience import switch as switch_mod

    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    area_id = _only_area_id(hass)
    dev_reg = dr.async_get(hass)
    entry_id = mock_config_entry.entry_id
    house = get_scope_device(dev_reg, (DOMAIN, "ambience"), entry_id)
    area_dev = get_scope_device(dev_reg, (DOMAIN, f"area_{area_id}"), entry_id)

    sw = _switch(hass, "area", area_id)
    # Simulate a freshly-created, not-yet-linked child device.
    sw.device_entry = MagicMock(id=area_dev.id, via_device_id=None)

    mock_reg = MagicMock()
    mock_reg.async_get_device_by_identifier.return_value = house
    with (
        patch.object(switch_mod, "_SUPPORTS_GET_BY_IDENTIFIER", True),
        patch("custom_components.ambience.switch.dr.async_get", return_value=mock_reg),
    ):
        sw._link_via_device()

    mock_reg.async_get_device_by_identifier.assert_called_once_with(
        (DOMAIN, "ambience"), mock_config_entry.entry_id
    )
    mock_reg.async_update_device.assert_called_once_with(area_dev.id, via_device_id=house.id)


async def test_link_via_device_skips_when_already_linked(hass, mock_config_entry):
    """A child device that already carries a via_device_id is left untouched."""
    from unittest.mock import MagicMock, patch

    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)
    area_id = _only_area_id(hass)
    sw = _switch(hass, "area", area_id)
    sw.device_entry = MagicMock(id="dev", via_device_id="already-linked")

    with patch("custom_components.ambience.switch.dr.async_get") as mock_get:
        sw._link_via_device()
        mock_get.assert_not_called()


async def test_link_via_device_skips_when_no_device(hass, mock_config_entry):
    """No registered device yet → _link_via_device is a safe no-op."""
    from unittest.mock import patch

    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)
    area_id = _only_area_id(hass)
    sw = _switch(hass, "area", area_id)
    sw.device_entry = None

    with patch("custom_components.ambience.switch.dr.async_get") as mock_get:
        sw._link_via_device()
        mock_get.assert_not_called()


async def test_link_via_device_skips_when_house_device_missing(hass, mock_config_entry):
    """When the house device does not exist, a child is not linked (no crash)."""
    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)
    area_id = _only_area_id(hass)
    dev_reg = dr.async_get(hass)
    entry_id = mock_config_entry.entry_id
    house = get_scope_device(dev_reg, (DOMAIN, "ambience"), entry_id)
    dev_reg.async_remove_device(house.id)  # HA clears children's via_device_id

    sw = _switch(hass, "area", area_id)
    sw.device_entry = get_scope_device(dev_reg, (DOMAIN, f"area_{area_id}"), entry_id)
    sw._link_via_device()  # house gone → must not raise, must not re-link

    area_dev = get_scope_device(dr.async_get(hass), (DOMAIN, f"area_{area_id}"), entry_id)
    assert area_dev.via_device_id is None


async def test_sync_device_name_no_device_is_noop(hass, mock_config_entry):
    """When the scope's device is missing (device_entry is None), _sync_device_name
    returns without attempting a registry update (the `device is None` guard)."""
    from unittest.mock import patch

    await _setup(hass, mock_config_entry)
    sw = _switch(hass, "house", None)
    sw.device_entry = None
    with patch("custom_components.ambience.switch.dr.async_get") as mock_get:
        sw._sync_device_name()  # must not raise
        mock_get.assert_not_called()


async def test_config_update_to_zero_delay_cancels_armed_timer(
    hass, mock_config_entry, fixed_utcnow
):
    """Setting auto-on delay to 0 (= never auto-on) must cancel a timer armed
    under the previous delay — otherwise the switch still auto-turns-on at the
    originally scheduled time."""
    await _setup(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})
    ent = _switch(hass, "house", None)
    await ent.async_turn_off()
    await hass.async_block_till_done()
    assert ent._timer is not None

    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 0})
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    await hass.async_block_till_done()
    assert ent._timer is None
