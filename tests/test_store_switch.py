"""AmbienceStore — switch defaults + per-scope override + off_at."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.store import AmbienceStore

# --- defaults ----------------------------------------------------------------


async def test_switch_defaults_empty_load(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_switch_defaults() == {
        "name": "Ambience",
        "auto_on_delay_seconds": 7200,
    }


async def test_switch_defaults_round_trip(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_switch_defaults({"name": "Master", "auto_on_delay_seconds": 600})
    fresh = AmbienceStore(hass)
    await fresh.async_load()
    assert fresh.get_switch_defaults() == {"name": "Master", "auto_on_delay_seconds": 600}


async def test_switch_defaults_rejects_empty_name(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_switch_defaults({"name": "", "auto_on_delay_seconds": 0})
    with pytest.raises(ValueError):
        await store.async_save_switch_defaults({"name": None, "auto_on_delay_seconds": 0})


async def test_switch_defaults_rejects_bad_delay(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_switch_defaults({"name": "X", "auto_on_delay_seconds": -1})
    with pytest.raises(ValueError):
        await store.async_save_switch_defaults({"name": "X", "auto_on_delay_seconds": True})  # bool
    with pytest.raises(ValueError):
        await store.async_save_switch_defaults({"name": "X", "auto_on_delay_seconds": "abc"})


async def test_legacy_load_backfills_switch_defaults(hass: HomeAssistant) -> None:
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save(
        {
            "version": 1,
            "areas": {},
            "floors": {},
            "house": {"rules": [], "auto_sort": True},
            "matchers": {},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_switch_defaults() == {"name": "Ambience", "auto_on_delay_seconds": 7200}


# --- per-scope override ------------------------------------------------------


async def test_scope_switch_default_is_inherit_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_scope_switch_config("house", None) == {
        "name": None,
        "auto_on_delay_seconds": None,
        "off_at": None,
    }


async def test_scope_switch_default_is_inherit_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a1", {"rules": [], "auto_sort": True})
    assert store.get_scope_switch_config("area", "a1") == {
        "name": None,
        "auto_on_delay_seconds": None,
        "off_at": None,
    }


async def test_scope_switch_default_is_inherit_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("f1", {"rules": [], "auto_sort": True})
    assert store.get_scope_switch_config("floor", "f1") == {
        "name": None,
        "auto_on_delay_seconds": None,
        "off_at": None,
    }


async def test_save_scope_switch_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_scope_switch(
        "house", None, {"name": "All", "auto_on_delay_seconds": 300}
    )
    assert store.get_scope_switch_config("house", None) == {
        "name": "All",
        "auto_on_delay_seconds": 300,
        "off_at": None,
    }


async def test_save_scope_switch_floor(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("f1", {"rules": [], "auto_sort": True})
    await store.async_save_scope_switch(
        "floor", "f1", {"name": "Upstairs", "auto_on_delay_seconds": None}
    )
    assert store.get_scope_switch_config("floor", "f1") == {
        "name": "Upstairs",
        "auto_on_delay_seconds": None,
        "off_at": None,
    }


async def test_save_scope_switch_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a1", {"rules": [], "auto_sort": True})
    await store.async_save_scope_switch(
        "area", "a1", {"name": "Kitchen", "auto_on_delay_seconds": 60}
    )
    assert store.get_scope_switch_config("area", "a1") == {
        "name": "Kitchen",
        "auto_on_delay_seconds": 60,
        "off_at": None,
    }


async def test_save_scope_switch_validation(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_scope_switch(
            "area", "a1", {"name": "", "auto_on_delay_seconds": None}
        )
    with pytest.raises(ValueError):
        await store.async_save_scope_switch(
            "area", "a1", {"name": None, "auto_on_delay_seconds": -1}
        )
    with pytest.raises(ValueError):
        await store.async_save_scope_switch(
            "area", "a1", {"name": None, "auto_on_delay_seconds": True}
        )


async def test_save_scope_switch_rejects_bad_kind(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        await store.async_save_scope_switch(
            "garbage", "x", {"name": None, "auto_on_delay_seconds": None}
        )


# --- resolved (merge defaults + override) -----------------------------------


async def test_resolved_scope_switch_merge_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_switch_defaults({"name": "Default", "auto_on_delay_seconds": 1800})
    await store.async_save_scope_switch(
        "house", None, {"name": "All", "auto_on_delay_seconds": None}
    )
    assert store.resolved_scope_switch_config("house", None) == {
        "name": "All",
        "auto_on_delay_seconds": 1800,
        "off_at": None,
    }


async def test_resolved_scope_switch_for_unknown_falls_back_to_defaults(
    hass: HomeAssistant,
) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.resolved_scope_switch_config("area", "nope") == {
        "name": "Ambience",
        "auto_on_delay_seconds": 7200,
        "off_at": None,
    }


# --- off_at ------------------------------------------------------------------


async def test_set_off_at_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_set_scope_switch_off_at("house", None, "2026-05-27T12:00:00+00:00")
    assert store.get_scope_switch_config("house", None)["off_at"] == "2026-05-27T12:00:00+00:00"
    await store.async_set_scope_switch_off_at("house", None, None)
    assert store.get_scope_switch_config("house", None)["off_at"] is None


async def test_set_off_at_area_lazy_create(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    # No area saved yet — must create a bare area shell so off_at can land.
    await store.async_set_scope_switch_off_at("area", "a9", "2026-01-01T00:00:00+00:00")
    assert store.get_scope_switch_config("area", "a9")["off_at"] == "2026-01-01T00:00:00+00:00"


async def test_save_scope_switch_preserves_off_at(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_set_scope_switch_off_at("area", "a1", "2026-05-27T12:00:00+00:00")
    await store.async_save_scope_switch("area", "a1", {"name": "X", "auto_on_delay_seconds": 0})
    assert store.get_scope_switch_config("area", "a1")["off_at"] == "2026-05-27T12:00:00+00:00"


async def test_save_area_preserves_switch_override(hass: HomeAssistant) -> None:
    """Saving rules to a scope must not wipe its switch sub-dict."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a1", {"rules": [], "auto_sort": True})
    await store.async_save_scope_switch("area", "a1", {"name": "K", "auto_on_delay_seconds": 600})
    await store.async_set_scope_switch_off_at("area", "a1", "2026-05-27T12:00:00+00:00")
    # Simulate rules-save path
    await store.async_save_area(
        "a1", {"rules": [{"name": "r", "when": {}, "actions": []}], "auto_sort": True}
    )
    assert store.get_scope_switch_config("area", "a1") == {
        "name": "K",
        "auto_on_delay_seconds": 600,
        "off_at": "2026-05-27T12:00:00+00:00",
    }


async def test_save_floor_preserves_switch_override(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("f1", {"rules": [], "auto_sort": True})
    await store.async_save_scope_switch("floor", "f1", {"name": "Up", "auto_on_delay_seconds": 300})
    await store.async_save_floor(
        "f1", {"rules": [{"name": "r", "when": {}, "actions": []}], "auto_sort": True}
    )
    assert store.get_scope_switch_config("floor", "f1")["name"] == "Up"


async def test_save_house_preserves_switch_override(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_scope_switch(
        "house", None, {"name": "All", "auto_on_delay_seconds": 300}
    )
    await store.async_save_house(
        {"rules": [{"name": "r", "when": {}, "actions": []}], "auto_sort": True}
    )
    assert store.get_scope_switch_config("house", None)["name"] == "All"
