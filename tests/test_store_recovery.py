"""A damaged store file survives a full setup/unload cycle untouched."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.store import AmbienceStore

# Valid JSON, wrong shape: hits async_load's malformed branch.
_BAD_PAYLOAD = {"version": 1, "areas": "not-a-dict"}


async def test_setup_does_not_overwrite_malformed_payload(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Setup must leave a damaged payload on disk so the user can recover it.

    The malformed branch of async_load deliberately skips persisting, but setup
    then backfills the built-in labels — which saves the degraded empty config
    over the user's file unless the writer knows the payload was unreadable.
    """
    await Store(hass, 1, "ambience").async_save(_BAD_PAYLOAD)
    mock_config_entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == _BAD_PAYLOAD

    assert await hass.config_entries.async_unload(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == _BAD_PAYLOAD


async def test_flush_does_not_overwrite_malformed_payload(hass: HomeAssistant) -> None:
    """async_flush (called on unload) must not clobber a damaged payload either."""
    await Store(hass, 1, "ambience").async_save(_BAD_PAYLOAD)
    store = AmbienceStore(hass)
    await store.async_load()

    await store.async_flush()

    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == _BAD_PAYLOAD
