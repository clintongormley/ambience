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
            "house": {"scenes": []},
            "conditions": {},
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
        {"scenes": [], "switch": {"name": "Legacy", "auto_on_delay_seconds": 5, "off_at": "ts"}},
    )
    assert store.get_scope_switch_off_at("area", "a1") == "ts"
    # The defaults are untouched by the legacy override.
    assert store.get_switch_defaults() == {"name": "Ambience", "auto_on_delay_seconds": 7200}


async def test_save_scenes_preserves_off_at(hass: HomeAssistant) -> None:
    """Saving scenes to a scope must not wipe its switch sub-dict (off_at)."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a1", {"scenes": []})
    await store.async_set_scope_switch_off_at("area", "a1", "2026-05-27T12:00:00+00:00")
    await store.async_save_area("a1", {"scenes": [{"name": "r", "when": {}, "actions": []}]})
    assert store.get_scope_switch_off_at("area", "a1") == "2026-05-27T12:00:00+00:00"


# --- _scope_container floor branch (line 257) --------------------------------


async def test_set_off_at_floor_lazy_create(hass: HomeAssistant) -> None:
    """set_scope_switch_off_at on a floor creates a bare floor shell if absent."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_set_scope_switch_off_at("floor", "f1", "2026-03-01T00:00:00+00:00")
    assert store.get_scope_switch_off_at("floor", "f1") == "2026-03-01T00:00:00+00:00"


# --- _scope_container unknown kind (line 260) --------------------------------


async def test_scope_container_unknown_kind_raises(hass: HomeAssistant) -> None:
    """_scope_container raises ValueError for an unknown scope_kind."""
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="unknown scope_kind"):
        store._scope_container("galaxy", "x")  # noqa: SLF001


# --- async_set_scope_switch_off_at unknown kind (line 304) ------------------


async def test_set_off_at_unknown_kind_raises(hass: HomeAssistant) -> None:
    """async_set_scope_switch_off_at raises ValueError for an unknown scope_kind."""
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="unknown scope_kind"):
        await store.async_set_scope_switch_off_at("bogus", "x", "ts")


# --- scope_config floor branch (line 315) + unknown kind (line 318) ----------


async def test_scope_config_floor_returns_config(hass: HomeAssistant) -> None:
    """scope_config returns the floor dict when it exists."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_floor("f2", {"scenes": [{"name": "r", "when": {}, "actions": []}]})
    cfg = store.scope_config("floor", "f2")
    assert cfg["scenes"][0]["name"] == "r"


async def test_scope_config_floor_absent_returns_empty(hass: HomeAssistant) -> None:
    """scope_config returns {} for a floor that was never saved."""
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.scope_config("floor", "missing") == {}


async def test_scope_config_unknown_kind_raises(hass: HomeAssistant) -> None:
    """scope_config raises ValueError for an unknown scope_kind."""
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="unknown scope_kind"):
        store.scope_config("planet", "x")


# --- per-scope enabled flag --------------------------------------------------


async def test_scope_enabled_defaults_true(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_scope_enabled("house", None) is True
    assert store.get_scope_enabled("area", "living_room") is True


async def test_scope_enabled_round_trip(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_set_scope_enabled("area", "living_room", False)
    fresh = AmbienceStore(hass)
    await fresh.async_load()
    assert fresh.get_scope_enabled("area", "living_room") is False
    assert fresh.get_scope_enabled("house", None) is True


async def test_scope_enabled_rejects_unknown_kind(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="unknown scope_kind"):
        store.get_scope_enabled("planet", None)


async def test_set_scope_enabled_rejects_unknown_kind(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    with pytest.raises(ValueError, match="unknown scope_kind"):
        await store.async_set_scope_enabled("planet", None, False)


async def test_set_off_at_uses_delayed_save(hass: HomeAssistant) -> None:
    """off_at is loss-tolerant runtime state written once per switch in a
    cascade — a house toggle would otherwise serialise N+1 immediate full-store
    disk writes (and the post-pause auto-on storm multiplies that)."""
    from unittest.mock import patch

    store = AmbienceStore(hass)
    await store.async_load()
    with (
        patch.object(store._store, "async_save") as save,
        patch.object(store._store, "async_delay_save") as delay_save,
    ):
        await store.async_set_scope_switch_off_at("house", None, "2026-01-01T00:00:00+00:00")
    save.assert_not_called()
    delay_save.assert_called_once()
    assert store.get_scope_switch_off_at("house", None) == "2026-01-01T00:00:00+00:00"
