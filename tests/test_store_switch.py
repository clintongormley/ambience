"""AmbienceStore — switch defaults + per-scope off_at state.

Per-scope switch name/auto-on-delay overrides were removed: name and delay
always come from the global defaults. Only ``off_at`` (runtime state owned by
the switch entity) is stored per scope.
"""

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
            "house": {"rules": []},
            "matchers": {},
        }
    )
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_switch_defaults() == {"name": "Ambience", "auto_on_delay_seconds": 7200}


# --- off_at ------------------------------------------------------------------


async def test_off_at_default_is_none(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_scope_switch_off_at("house", None) is None


async def test_off_at_unknown_kind_raises(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError):
        store.get_scope_switch_off_at("garbage", "x")


async def test_set_off_at_house(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_set_scope_switch_off_at("house", None, "2026-05-27T12:00:00+00:00")
    assert store.get_scope_switch_off_at("house", None) == "2026-05-27T12:00:00+00:00"
    await store.async_set_scope_switch_off_at("house", None, None)
    assert store.get_scope_switch_off_at("house", None) is None


async def test_set_off_at_area_lazy_create(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    # No area saved yet — must create a bare area shell so off_at can land.
    await store.async_set_scope_switch_off_at("area", "a9", "2026-01-01T00:00:00+00:00")
    assert store.get_scope_switch_off_at("area", "a9") == "2026-01-01T00:00:00+00:00"


async def test_off_at_ignores_legacy_name_and_delay(hass: HomeAssistant) -> None:
    """A legacy per-scope ``switch`` dict carrying name/delay is inert: only
    off_at is read; name and delay always come from the defaults."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area(
        "a1",
        {"rules": [], "switch": {"name": "Legacy", "auto_on_delay_seconds": 5, "off_at": "ts"}},
    )
    assert store.get_scope_switch_off_at("area", "a1") == "ts"
    # The defaults are untouched by the legacy override.
    assert store.get_switch_defaults() == {"name": "Ambience", "auto_on_delay_seconds": 7200}


async def test_save_rules_preserves_off_at(hass: HomeAssistant) -> None:
    """Saving rules to a scope must not wipe its switch sub-dict (off_at)."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a1", {"rules": []})
    await store.async_set_scope_switch_off_at("area", "a1", "2026-05-27T12:00:00+00:00")
    await store.async_save_area("a1", {"rules": [{"name": "r", "when": {}, "actions": []}]})
    assert store.get_scope_switch_off_at("area", "a1") == "2026-05-27T12:00:00+00:00"
