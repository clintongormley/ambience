"""Voice-assistant exposure of ambience switches."""

from __future__ import annotations

from homeassistant.components.homeassistant.exposed_entities import async_should_expose
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import (
    DATA_STORE,
    DOMAIN,
    SIGNAL_EXPOSED_ASSISTANTS_UPDATED,
)


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


async def test_exposure_follows_store_map(hass):
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
                "create_switches": True,
            },
            "exposed_assistants": {
                "conversation": False,
                "cloud.google_assistant": True,
                "cloud.alexa": False,
            },
        }
    )
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="ambience_unique"
    )
    await _setup(hass, entry)
    assert async_should_expose(hass, "conversation", "switch.house_ambience") is False
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is True


async def test_partial_store_map_defaults_to_unexposed(hass):
    # A map missing some assistants (e.g. a store saved before an assistant was
    # added to KNOWN_ASSISTANTS) backfills the missing ones to their default (off
    # for Google/Alexa) on load.
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
                "create_switches": True,
            },
            "exposed_assistants": {"conversation": True},
        }
    )
    entry = MockConfigEntry(
        domain=DOMAIN, title="Ambience", data={}, options={}, unique_id="ambience_unique"
    )
    await _setup(hass, entry)
    assert async_should_expose(hass, "conversation", "switch.house_ambience") is True
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is False
    assert async_should_expose(hass, "cloud.alexa", "switch.house_ambience") is False


async def test_reapply_all_reexposes_live_switches(hass, mock_config_entry):
    from custom_components.ambience.exposure import async_reapply_all_switch_exposure

    ar.async_get(hass).async_create("Living Room")
    await _setup(hass, mock_config_entry)
    assert (
        async_should_expose(hass, "cloud.google_assistant", "switch.living_room_ambience") is False
    )

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_exposed_assistants(
        {"conversation": True, "cloud.google_assistant": True, "cloud.alexa": False}
    )
    async_reapply_all_switch_exposure(hass)

    assert (
        async_should_expose(hass, "cloud.google_assistant", "switch.living_room_ambience") is True
    )


async def test_exposure_signal_reapplies_to_live_switches(hass, mock_config_entry):
    await _setup(hass, mock_config_entry)
    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is False

    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_exposed_assistants(
        {"conversation": True, "cloud.google_assistant": True, "cloud.alexa": False}
    )
    async_dispatcher_send(hass, SIGNAL_EXPOSED_ASSISTANTS_UPDATED, None)
    await hass.async_block_till_done()

    assert async_should_expose(hass, "cloud.google_assistant", "switch.house_ambience") is True
