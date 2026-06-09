"""Voice-assistant exposure of ambience switches."""

from __future__ import annotations

from homeassistant.components.homeassistant.exposed_entities import async_should_expose
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import CONF_EXPOSED_ASSISTANTS, DOMAIN


async def _setup(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    assert await async_setup_component(hass, "homeassistant", {})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def test_switches_exposed_to_assist_by_default(hass, mock_config_entry):
    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)

    assert async_should_expose(hass, "conversation", "switch.house_ambience") is True
    assert async_should_expose(hass, "conversation", "switch.living_room_ambience") is True
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is False


async def test_switch_added_post_setup_picks_up_exposure(hass, mock_config_entry):
    await _setup(hass, mock_config_entry)
    ar.async_get(hass).async_create("Garage")
    await hass.async_block_till_done()
    assert async_should_expose(hass, "conversation", "switch.garage_ambience") is True


async def test_exposure_follows_entry_option(hass):
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={
            CONF_EXPOSED_ASSISTANTS: {
                "conversation": False,
                "cloud.google_assistant": True,
                "cloud.alexa": False,
            }
        },
        unique_id="ambience_unique",
    )
    await _setup(hass, entry)
    assert async_should_expose(hass, "conversation", "switch.house_ambience") is False
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is True


async def test_partial_option_map_defaults_to_unexposed(hass):
    # A map missing some assistants (e.g. after a new assistant is added to
    # KNOWN_ASSISTANTS before the user re-saves) defaults the missing ones off.
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Ambience",
        data={},
        options={CONF_EXPOSED_ASSISTANTS: {"conversation": True}},
        unique_id="ambience_unique",
    )
    await _setup(hass, entry)
    assert async_should_expose(hass, "conversation", "switch.house_ambience") is True
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is False
    assert async_should_expose(hass, "cloud.alexa", "switch.house_ambience") is False
