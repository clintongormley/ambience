"""One-time seeding of the built-in on/off exposed actions."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from custom_components.ambience.store import AmbienceStore

_SEEDED = {"ambience.turn_on", "ambience.turn_off"}


def _ids(store: AmbienceStore) -> set[str]:
    return {e["id"] for e in store.get_exposed_actions()}


async def test_fresh_install_seeds_cover_actions(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    ids = _ids(store)
    assert {
        "ambience.cover_safe_open",
        "ambience.cover_safe_close",
        "ambience.cover_safe_set_position",
        "ambience.cover_safe_set_tilt_position",
    } <= ids
    # Required fields must be visible so the scene editor can set them.
    assert _entry(store, "ambience.cover_safe_open")["visible_fields"] == []
    assert _entry(store, "ambience.cover_safe_close")["visible_fields"] == []
    assert _entry(store, "ambience.cover_safe_set_position")["visible_fields"] == ["position"]
    assert _entry(store, "ambience.cover_safe_set_tilt_position")["visible_fields"] == [
        "tilt_position"
    ]


async def test_existing_install_not_reseeded_with_covers(hass: HomeAssistant) -> None:
    # Fresh-install-only: an install past the one-time seed gate gets no covers.
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            ],
            "builtins_seeded": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    ids = _ids(store)
    assert not any(i.startswith("ambience.cover_safe_") for i in ids)


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


def _entry(store: AmbienceStore, sid: str) -> dict:
    return next(e for e in store.get_exposed_actions() if e["id"] == sid)


def _labels(store: AmbienceStore) -> dict[str, str]:
    return {e["id"]: e.get("label", "") for e in store.get_exposed_actions() if isinstance(e, dict)}


async def test_builtins_labeled_reflects_the_flag(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.builtins_labeled() is False
    await store.async_apply_builtin_labels(
        {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}
    )
    assert store.builtins_labeled() is True


async def test_apply_builtin_labels_backfills_existing_empty_labels(hass: HomeAssistant) -> None:
    # An existing install: seeded built-ins with empty labels, no labeled flag.
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
                {"id": "ambience.turn_off", "label": "", "visible_fields": [], "defaults": {}},
            ],
            "builtins_seeded": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_apply_builtin_labels(
        {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}
    )
    assert _labels(store) == {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}


async def test_apply_builtin_labels_does_not_overwrite_user_label(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    # User had set a custom label on a seeded built-in.
    actions = store.get_exposed_actions()
    for entry in actions:
        if entry["id"] == "ambience.turn_on":
            entry["label"] = "My on"
    await store.async_save_exposed_actions(actions)

    await store.async_apply_builtin_labels(
        {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}
    )
    labels = _labels(store)
    assert labels["ambience.turn_on"] == "My on"  # user label preserved
    assert labels["ambience.turn_off"] == "Turn off"  # empty one filled


async def test_apply_builtin_labels_is_one_time(hass: HomeAssistant) -> None:
    # Flag already set (a prior labeling ran) → a later call must not refill,
    # so a user who deliberately cleared a built-in's label isn't fought.
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            ],
            "builtins_seeded": True,
            "builtins_labeled": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_apply_builtin_labels({"ambience.turn_on": "Turn on"})
    assert _labels(store) == {"ambience.turn_on": ""}  # flag set → left empty


async def test_apply_builtin_labels_noops_and_retries_when_unavailable(hass: HomeAssistant) -> None:
    # Descriptions unavailable (degraded) → no labels resolved → no-op, and the
    # flag must NOT be set so a later load retries.
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_apply_builtin_labels({})
    assert _labels(store)["ambience.turn_on"] == ""
    # Descriptions available on a later call → now it fills.
    await store.async_apply_builtin_labels(
        {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}
    )
    assert _labels(store)["ambience.turn_on"] == "Turn on"


async def test_apply_builtin_labels_ignores_non_list_exposed_actions(hass: HomeAssistant) -> None:
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": "oops",  # corrupt shape
            "builtins_seeded": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    # Must not raise and must not seed-label over the corrupt value.
    await store.async_apply_builtin_labels({"ambience.turn_on": "Turn on"})
    assert store.get_exposed_actions() == []


async def test_apply_builtin_labels_skips_junk_entries_and_unrelated_ids(
    hass: HomeAssistant,
) -> None:
    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"scenes": []},
            "exposed_actions": [
                "junk",  # non-dict entry → skipped
                {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
                {"id": "ambience.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            ],
            "builtins_seeded": True,
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_apply_builtin_labels({"ambience.turn_on": "Turn on"})
    labels = _labels(store)
    assert labels["ambience.turn_on"] == "Turn on"  # matched id filled
    assert labels["light.turn_on"] == ""  # id not in labels → untouched


async def test_apply_builtin_labels_persists_across_reload(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_apply_builtin_labels(
        {"ambience.turn_on": "Turn on", "ambience.turn_off": "Turn off"}
    )
    store2 = AmbienceStore(hass)
    await store2.async_load()
    assert _labels(store2)["ambience.turn_on"] == "Turn on"


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
