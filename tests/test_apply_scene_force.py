"""async_apply_scene honours force= (ignore switch) and group= (one group)."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.ambience.const import DATA_EXPOSED_ACTIONS, DATA_STORE, DATA_SWITCHES, DOMAIN
from custom_components.ambience.service import async_apply_scene, get_last_applied


async def _install(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> str:
    area = ar.async_get(hass).async_create("Living Room")
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    exposed = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed.save(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        area.id,
        {
            "rules": [
                {
                    "group": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
                {
                    "group": "blinds",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.b"], "params": {}}
                    ],
                },
            ]
        },
    )
    return area.id


async def test_force_applies_even_when_switch_off(hass, mock_config_entry):
    area_id = await _install(hass, mock_config_entry)
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area_id)]
    await switch.async_turn_off()
    await hass.async_block_till_done()

    await async_apply_scene(hass, "area", area_id, force=True)

    assert len(light_calls) == 1
    assert len(cover_calls) == 1
    # force applies every group; both winners are recorded.
    assert get_last_applied(hass, "area", area_id, "lighting") is not None
    assert get_last_applied(hass, "area", area_id, "blinds") is not None


async def test_group_applies_only_that_group(hass, mock_config_entry):
    # Switch left on and force omitted, so this proves group= works on its own,
    # independent of force=.
    area_id = await _install(hass, mock_config_entry)
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")

    await async_apply_scene(hass, "area", area_id, group="lighting")

    assert len(light_calls) == 1
    assert len(cover_calls) == 0
    assert get_last_applied(hass, "area", area_id, "lighting") is not None
    assert get_last_applied(hass, "area", area_id, "blinds") is None
