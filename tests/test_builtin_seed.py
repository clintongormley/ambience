"""One-time seeding of the built-in on/off exposed actions."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from custom_components.ambience.store import AmbienceStore

_SEEDED = {"ambience.turn_on", "ambience.turn_off"}


def _ids(store: AmbienceStore) -> set[str]:
    return {e["id"] for e in store.get_exposed_actions()}


async def test_fresh_install_seeds_onoff(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert _ids(store) >= _SEEDED


async def test_existing_install_gets_seeded_once(hass: HomeAssistant) -> None:
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}
            ],
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    ids = _ids(store)
    assert ids >= _SEEDED
    assert "light.turn_on" in ids  # existing entry preserved


async def test_deleted_seed_not_readded(hass: HomeAssistant) -> None:
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [],
            "builtins_seeded": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert _ids(store) == set()  # flag set, list empty → nothing seeded


async def test_seed_is_idempotent_across_reloads(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    store2 = AmbienceStore(hass)
    await store2.async_load()
    # Exactly one of each seeded id, no duplicates.
    ids = [e["id"] for e in store2.get_exposed_actions()]
    assert ids.count("ambience.turn_on") == 1
    assert ids.count("ambience.turn_off") == 1
