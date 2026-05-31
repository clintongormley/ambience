"""apply_scene short-circuits when the scope's OWN switch is off.

Gating reads only a scope's own switch (service._switch_state). Toggling a
parent switch CASCADES the same state onto descendant switches (house ->
all floors+areas, floor -> its areas), so after a cascade a descendant's
own switch is off and its apply_scene is blocked. A descendant can be turned
back on individually to unblock it.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.const import DATA_STORE, DATA_SWITCHES, DOMAIN
from custom_components.ambience.service import async_apply_scene, async_resolve_only


async def _setup_with_one_rule_per_scope(hass, mock_config_entry):
    floor = fr.async_get(hass).async_create("Upstairs")
    area = ar.async_get(hass).async_create("Bedroom")
    # Place area on the floor so the legacy "would the floor block the room"
    # test continues to be meaningful (it must not block).
    ar.async_get(hass).async_update(area.id, floor_id=floor.floor_id)

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    store = hass.data[DOMAIN][DATA_STORE]
    one_rule = {"rules": [{"name": "any", "when": {}, "actions": []}], "auto_sort": True}
    await store.async_save_area(area.id, one_rule)
    await store.async_save_floor(floor.floor_id, one_rule)
    await store.async_save_house(one_rule)
    return area.id, floor.floor_id


async def _switch(hass: HomeAssistant, kind: str, sid: str | None) -> Any:
    return hass.data[DOMAIN][DATA_SWITCHES][(kind, sid)]


# --- each switch blocks its own scope --------------------------------------


async def test_house_off_blocks_house_apply(hass, mock_config_entry, caplog):
    await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "house", None, "x")
    assert "switch is off" in caplog.text.lower()


async def test_floor_off_blocks_floor_apply(hass, mock_config_entry, caplog):
    _, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    floor_switch = await _switch(hass, "floor", floor_id)
    await floor_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "floor", floor_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_area_off_blocks_area_apply(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


# --- no cascade: other scopes' switches are irrelevant ---------------------


async def test_house_off_cascades_and_blocks_area_apply(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_house_off_cascades_and_blocks_floor_apply(hass, mock_config_entry, caplog):
    _, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "floor", floor_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_floor_off_cascades_and_blocks_area_on_that_floor(hass, mock_config_entry, caplog):
    """A floor switch being turned off now cascades the rooms on that floor off."""
    area_id, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    floor_switch = await _switch(hass, "floor", floor_id)
    await floor_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_area_off_does_not_block_floor_or_house_apply(hass, mock_config_entry, caplog):
    area_id, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "floor", floor_id, "x")
    await async_apply_scene(hass, "house", None, "x")
    assert "switch is off" not in caplog.text.lower()


# --- all-on + degenerate cases --------------------------------------------


async def test_all_on_allows_apply(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" not in caplog.text.lower()


async def test_missing_switch_treated_as_on(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    # Simulate the race where the entity hasn't registered yet.
    hass.data[DOMAIN][DATA_SWITCHES].pop(("area", area_id), None)
    await async_apply_scene(hass, "area", area_id, "x")  # must not raise


# --- resolve_only / dry_run -----------------------------------------------


async def test_resolve_only_reports_own_switch_state(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "on"

    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "off"


async def test_resolve_only_reflects_cascade_then_individual_override(hass, mock_config_entry):
    """House off cascades the area off (switch_state=off); turning the area
    back on overrides it (switch_state=on) even while house stays off."""
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "off"

    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_on()
    await hass.async_block_till_done()
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "on"


async def test_resolve_only_returns_unknown_for_missing_switch(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    hass.data[DOMAIN][DATA_SWITCHES].pop(("area", area_id), None)
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "unknown"


async def test_resolve_only_still_resolves_rule_when_off(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["matched_rule_index"] == 0
    assert res["rule_name"] == "any"
    assert res["switch_state"] == "off"


async def test_global_off_then_area_on_unblocks_area_apply(hass, mock_config_entry, caplog):
    """Turn the global switch off (cascades the area off), then turn the area
    back on — its apply_scene must no longer be blocked, even though house
    is still off."""
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    # Cascade turned the area off too.
    area_switch = await _switch(hass, "area", area_id)
    assert area_switch.is_on is False

    # Individually turn the area back on.
    await area_switch.async_turn_on()
    await hass.async_block_till_done()
    assert area_switch.is_on is True
    assert house.is_on is False  # house stays off

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" not in caplog.text.lower()
