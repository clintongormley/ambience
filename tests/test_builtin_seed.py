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


async def test_seed_skips_id_already_present(hass: HomeAssistant) -> None:
    # A seeded id already in exposed_actions (with no builtins_seeded flag yet)
    # must not be duplicated, and its existing entry must be preserved.
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                {"id": "ambience.turn_on", "label": "mine", "visible_fields": [], "defaults": {}}
            ],
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    entries = store.get_exposed_actions()
    ids = [e["id"] for e in entries]
    assert ids.count("ambience.turn_on") == 1  # not duplicated
    assert "ambience.turn_off" in ids  # the other one still seeded
    # existing entry preserved, not overwritten by the blank seed template
    assert next(e for e in entries if e["id"] == "ambience.turn_on")["label"] == "mine"


async def test_non_list_exposed_actions_does_not_raise(hass: HomeAssistant) -> None:
    """Regression: exposed_actions set to a non-list must not crash async_load().

    Before the fix, _ensure_builtin_actions() called setdefault() (which returns the
    existing non-list value) and then called .append() on it — raising AttributeError.
    The fix mirrors get_exposed_actions()'s isinstance guard: if the value is not a
    list, bail out without seeding or persisting.
    """
    payload = {
        "version": 1,
        "areas": {},
        "floors": {},
        "house": {"scenes": []},
        "exposed_actions": "oops",  # non-list corruption
    }
    await Store(hass, 1, "ambience").async_save(payload)
    store = AmbienceStore(hass)
    # 1. Must not raise
    await store.async_load()
    # 2. In-memory get_exposed_actions() returns []
    assert store.get_exposed_actions() == []
    # 3. Seeded IDs are NOT added
    assert _ids(store) == set()
    # 4. On-disk payload is NOT overwritten
    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == payload


async def test_malformed_payload_not_overwritten_on_load(hass: HomeAssistant) -> None:
    """Regression: a malformed-but-valid-JSON payload must NOT be overwritten.

    Before the fix, async_load() unconditionally called _ensure_builtin_actions()
    which called async_save() even on the malformed branch — destroying the
    on-disk payload and eliminating any chance of manual recovery.
    """
    bad = {"version": 1, "areas": "not-a-dict"}  # valid JSON, wrong shape → malformed branch
    await Store(hass, 1, "ambience").async_save(bad)
    store = AmbienceStore(hass)
    await store.async_load()
    # In-memory: degraded empty state, NOT seeded (seeding/saving is skipped)
    assert store.get_exposed_actions() == []
    # On-disk: the original malformed payload must still be there (not overwritten)
    reread = await Store(hass, 1, "ambience").async_load()
    assert reread == bad
