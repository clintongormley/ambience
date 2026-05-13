"""AmbienceStore wraps HA Store with typed helpers."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.store import AmbienceStore


async def test_load_empty_returns_empty_areas(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.areas() == {}


async def test_save_and_read_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    config = {
        "name": "Living Room",
        "scenes": ["movie"],
        "matchers": ["time_of_day"],
        "rules": [],
    }
    await store.async_save_area("living_room", config)
    assert store.areas() == {"living_room": config}
    assert store.get_area("living_room") == config


async def test_get_area_unknown_returns_none(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    assert store.get_area("nope") is None


async def test_delete_area(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_area("a", {"name": "A", "scenes": [], "matchers": [], "rules": []})
    await store.async_delete_area("a")
    assert store.get_area("a") is None


async def test_delete_unknown_area_is_noop(hass: HomeAssistant) -> None:
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_delete_area("nope")  # must not raise


async def test_corrupt_payload_starts_empty(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """If the HA Store load yields garbage, start with empty data and log."""
    # Pre-seed the underlying store with an unexpected shape.
    from homeassistant.helpers.storage import Store

    raw = Store(hass, 1, "ambience")
    await raw.async_save({"unexpected": True})

    store = AmbienceStore(hass)
    await store.async_load()
    assert store.areas() == {}
    assert "ambience storage payload" in caplog.text.lower()
