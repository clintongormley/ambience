"""apply_scene short-circuits when any switch in the cascade is off."""

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
    # Place area on the floor.
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


async def test_house_off_blocks_area_apply(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_floor_off_blocks_area_in_same_floor(hass, mock_config_entry, caplog):
    area_id, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    floor_switch = await _switch(hass, "floor", floor_id)
    await floor_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_area_off_blocks_only_that_area(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" in caplog.text.lower()


async def test_all_on_allows_apply(hass, mock_config_entry, caplog):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "area", area_id, "x")
    assert "switch is off" not in caplog.text.lower()


async def test_house_only_checked_for_house_apply(hass, mock_config_entry, caplog):
    """A floor switch being off must NOT block a house-scope apply_scene."""
    _, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    floor_switch = await _switch(hass, "floor", floor_id)
    await floor_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "house", None, "x")
    assert "switch is off" not in caplog.text.lower()


async def test_floor_scope_checks_only_house_and_floor(hass, mock_config_entry, caplog):
    """Area switch being off must NOT block a floor-scope apply_scene."""
    area_id, floor_id = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    area_switch = await _switch(hass, "area", area_id)
    await area_switch.async_turn_off()
    await hass.async_block_till_done()

    caplog.set_level("INFO", logger="custom_components.ambience.service")
    await async_apply_scene(hass, "floor", floor_id, "x")
    assert "switch is off" not in caplog.text.lower()


async def test_missing_switch_treated_as_on(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    # Simulate the race where the entity hasn't registered yet.
    hass.data[DOMAIN][DATA_SWITCHES].pop(("house", None), None)
    await async_apply_scene(hass, "area", area_id, "x")  # must not raise


async def test_resolve_only_returns_switch_state(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "on"

    house = await _switch(hass, "house", None)
    await house.async_turn_off()
    await hass.async_block_till_done()
    res = await async_resolve_only(hass, "area", area_id, "x")
    assert res["switch_state"] == "off"


async def test_resolve_only_returns_unknown_for_missing_switch(hass, mock_config_entry):
    area_id, _ = await _setup_with_one_rule_per_scope(hass, mock_config_entry)
    hass.data[DOMAIN][DATA_SWITCHES].pop(("house", None), None)
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


async def test_area_without_floor_skips_floor_link(hass, mock_config_entry):
    """Area not assigned to any floor: cascade is house → area only."""
    area = ar.async_get(hass).async_create("Garage")  # no floor
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    store = hass.data[DOMAIN][DATA_STORE]
    one_rule = {"rules": [{"name": "any", "when": {}, "actions": []}], "auto_sort": True}
    await store.async_save_area(area.id, one_rule)

    res = await async_resolve_only(hass, "area", area.id, "x")
    assert res["switch_state"] == "on"
