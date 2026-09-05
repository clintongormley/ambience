"""A damaged store file survives a full setup/unload cycle untouched."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

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


async def test_switch_off_at_does_not_overwrite_malformed_payload(hass: HomeAssistant) -> None:
    """A switch toggle must not clobber a damaged payload either.

    `async_set_scope_switch_off_at` writes loss-tolerant runtime state through
    `async_delay_save`; the user toggling a switch has not chosen to replace
    their config file. The in-memory value still updates so the running switch
    behaves normally.
    """
    await Store(hass, 1, "ambience").async_save(_BAD_PAYLOAD)
    store = AmbienceStore(hass)
    await store.async_load()

    await store.async_set_scope_switch_off_at("house", None, "2099-01-01T00:00:00+00:00")
    assert store.get_scope_switch_off_at("house", None) == "2099-01-01T00:00:00+00:00"

    # Fire the 1s delayed write, if one was scheduled.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()

    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == _BAD_PAYLOAD
