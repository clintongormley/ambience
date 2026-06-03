"""async_run_scene_actions fires a scene's actions unconditionally."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DATA_STORE, DATA_SWITCHES, DOMAIN
from custom_components.ambience.service import async_run_scene_actions, get_last_applied


async def _install(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> str:
    area = ar.async_get(hass).async_create("Living Room")
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save([{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}])
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "scenes": [
                {
                    "name": "Never matches",
                    "category": "lighting",
                    # A predicate that is NOT currently true — proves we skip evaluation.
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.nope",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    return area.id


async def test_runs_actions_even_when_when_would_not_match(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")

    result = await async_run_scene_actions(hass, "area", area_id, 0)

    assert len(calls) == 1
    assert result == {"ran": 1, "scene_name": "Never matches"}


async def test_runs_even_when_switch_off(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    calls = async_mock_service(hass, "light", "turn_on")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_run_scene_actions(hass, "area", area_id, 0)

    assert len(calls) == 1


async def test_does_not_record_last_applied(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    async_mock_service(hass, "light", "turn_on")

    await async_run_scene_actions(hass, "area", area_id, 0)

    assert get_last_applied(hass, "area", area_id, "lighting") is None


async def test_out_of_range_index_raises(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    with pytest.raises(ServiceValidationError):
        await async_run_scene_actions(hass, "area", area_id, 5)
