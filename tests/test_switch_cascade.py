"""Hierarchical cascade: toggling a parent switch propagates to descendants.

Model: "propagate the toggle". Flipping a parent writes the same on/off state
onto every descendant switch; each switch stays independently re-toggleable
because gating reads only a scope's own switch.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DATA_SWITCHES, DOMAIN


async def _setup_hierarchy(hass: HomeAssistant, entry: MockConfigEntry) -> dict[str, Any]:
    """Two floors with one area each, plus one floorless area.

    Returns a dict of registry ids for use in assertions.
    """
    floor_reg = fr.async_get(hass)
    area_reg = ar.async_get(hass)
    upstairs = floor_reg.async_create("Upstairs")
    downstairs = floor_reg.async_create("Downstairs")
    bedroom = area_reg.async_create("Bedroom")
    kitchen = area_reg.async_create("Kitchen")
    garage = area_reg.async_create("Garage")  # floorless
    area_reg.async_update(bedroom.id, floor_id=upstairs.floor_id)
    area_reg.async_update(kitchen.id, floor_id=downstairs.floor_id)

    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return {
        "upstairs": upstairs.floor_id,
        "downstairs": downstairs.floor_id,
        "bedroom": bedroom.id,
        "kitchen": kitchen.id,
        "garage": garage.id,
    }


def _switch(hass: HomeAssistant, kind: str, sid: str | None) -> Any:
    return hass.data[DOMAIN][DATA_SWITCHES][(kind, sid)]


def _all_descendants(ids: dict[str, Any]) -> tuple[tuple[str, str], ...]:
    """Every (kind, sid) below the house switch, as set up by _setup_hierarchy."""
    return (
        ("floor", ids["upstairs"]),
        ("floor", ids["downstairs"]),
        ("area", ids["bedroom"]),
        ("area", ids["kitchen"]),
        ("area", ids["garage"]),
    )


async def test_house_off_cascades_all_switches_off(hass, mock_config_entry, fixed_utcnow):
    ids = await _setup_hierarchy(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})

    await _switch(hass, "house", None).async_turn_off()
    await hass.async_block_till_done()

    for kind, sid in _all_descendants(ids):
        ent = _switch(hass, kind, sid)
        assert ent.is_on is False, (kind, sid)
        assert store.get_scope_switch_off_at(kind, sid) is not None, (kind, sid)
        assert ent._timer is not None, (kind, sid)


async def test_house_on_cascades_all_switches_on(hass, mock_config_entry, fixed_utcnow):
    ids = await _setup_hierarchy(hass, mock_config_entry)
    house = _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    await house.async_turn_on()
    await hass.async_block_till_done()

    for kind, sid in _all_descendants(ids):
        ent = _switch(hass, kind, sid)
        assert ent.is_on is True, (kind, sid)
        assert ent._timer is None, (kind, sid)


async def test_floor_off_cascades_only_its_own_areas(hass, mock_config_entry, fixed_utcnow):
    ids = await _setup_hierarchy(hass, mock_config_entry)

    await _switch(hass, "floor", ids["upstairs"]).async_turn_off()
    await hass.async_block_till_done()

    # Bedroom is on Upstairs -> off.
    assert _switch(hass, "area", ids["bedroom"]).is_on is False
    # Kitchen (Downstairs), Garage (floorless), the other floor, and the
    # house switch are all untouched.
    assert _switch(hass, "area", ids["kitchen"]).is_on is True
    assert _switch(hass, "area", ids["garage"]).is_on is True
    assert _switch(hass, "floor", ids["downstairs"]).is_on is True
    assert _switch(hass, "house", None).is_on is True


async def test_floor_on_cascades_only_its_own_areas(hass, mock_config_entry, fixed_utcnow):
    ids = await _setup_hierarchy(hass, mock_config_entry)
    upstairs = _switch(hass, "floor", ids["upstairs"])
    await upstairs.async_turn_off()
    await hass.async_block_till_done()

    await upstairs.async_turn_on()
    await hass.async_block_till_done()

    bedroom_sw = _switch(hass, "area", ids["bedroom"])
    assert bedroom_sw.is_on is True
    assert bedroom_sw._timer is None
    # Isolation: the on-cascade must not have touched anything off this floor.
    assert _switch(hass, "area", ids["kitchen"]).is_on is True
    assert _switch(hass, "area", ids["garage"]).is_on is True
    assert _switch(hass, "floor", ids["downstairs"]).is_on is True
    assert _switch(hass, "house", None).is_on is True


async def test_cascade_off_preserves_already_off_child_off_at(
    hass, mock_config_entry, fixed_utcnow
):
    ids = await _setup_hierarchy(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 7200})

    # Turn the bedroom off individually at T0.
    await _switch(hass, "area", ids["bedroom"]).async_turn_off()
    await hass.async_block_till_done()
    t0 = store.get_scope_switch_off_at("area", ids["bedroom"])
    assert t0 is not None

    # Advance the clock, then turn the house off (cascades).
    fixed_utcnow["now"] += timedelta(minutes=30)
    await _switch(hass, "house", None).async_turn_off()
    await hass.async_block_till_done()

    # Bedroom was already off -> its off_at AND timer must be untouched.
    assert store.get_scope_switch_off_at("area", ids["bedroom"]) == t0
    assert _switch(hass, "area", ids["bedroom"])._timer is not None
    # Kitchen was on -> now off at the later time.
    assert store.get_scope_switch_off_at("area", ids["kitchen"]) is not None
    assert store.get_scope_switch_off_at("area", ids["kitchen"]) != t0


async def test_house_on_overrides_individually_off_child(hass, mock_config_entry, fixed_utcnow):
    """Turning a parent ON cascades on, re-enabling a child that was
    individually turned off earlier (the symmetric on-cascade)."""
    ids = await _setup_hierarchy(hass, mock_config_entry)

    # Individually turn one area off; the house stays on.
    bedroom = _switch(hass, "area", ids["bedroom"])
    await bedroom.async_turn_off()
    await hass.async_block_till_done()
    assert bedroom.is_on is False
    assert _switch(hass, "house", None).is_on is True

    # Turning the house ON cascades on and overrides the individual off.
    await _switch(hass, "house", None).async_turn_on()
    await hass.async_block_till_done()
    assert bedroom.is_on is True
    assert bedroom._timer is None
    # A sibling that was already on is unaffected.
    assert _switch(hass, "area", ids["kitchen"]).is_on is True


async def test_house_auto_on_skips_child_paused_after_the_house(
    hass, mock_config_entry, fixed_utcnow
):
    """A scope paused after the house keeps its own, later resume time.

    House paused at 10:00 for an hour; the kitchen is paused explicitly at
    10:30. When the house resumes at 11:00 the kitchen must still be off with
    its own timer intact (due 11:30).
    """
    ids = await _setup_hierarchy(hass, mock_config_entry)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_switch_defaults({"name": "Ambience", "auto_on_delay_seconds": 3600})

    house = _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    fixed_utcnow["now"] += timedelta(minutes=30)
    kitchen = _switch(hass, "area", ids["kitchen"])
    await kitchen.async_turn_off()
    await hass.async_block_till_done()
    kitchen_off_at = store.get_scope_switch_off_at("area", ids["kitchen"])
    kitchen_timer = kitchen._timer
    assert kitchen_timer is not None

    # Drive the house's auto-on timer directly: under fixed_utcnow,
    # async_fire_time_changed fires every pending handle, which would also fire
    # the kitchen's own timer and hide the defect.
    fixed_utcnow["now"] += timedelta(minutes=30)
    house._cancel_timer()  # drop the real handle we are standing in for
    house._fire_auto_on()
    await hass.async_block_till_done()

    assert house.is_on is True
    for kind, sid in _all_descendants(ids):
        if (kind, sid) == ("area", ids["kitchen"]):
            continue
        assert _switch(hass, kind, sid).is_on is True, (kind, sid)

    assert kitchen.is_on is False
    assert kitchen._timer is kitchen_timer
    assert kitchen_timer.cancelled() is False
    assert store.get_scope_switch_off_at("area", ids["kitchen"]) == kitchen_off_at
