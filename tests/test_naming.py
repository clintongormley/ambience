"""Canonical scope/category display-name helpers shared by logbook + trace."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.naming import (
    category_names,
    scope_display_name,
)


class _StoreStub:
    def __init__(self, categories: list[dict]) -> None:
        self._categories = categories

    def categories(self) -> list[dict]:
        return list(self._categories)


class _Hass:
    """Minimal hass stand-in carrying only `.data` (mirrors test_trace)."""

    def __init__(self, data: dict) -> None:
        self.data = data


# --- category names --------------------------------------------------------------


def test_category_names_maps_id_to_name() -> None:
    hass = _Hass(
        {
            DOMAIN: {
                DATA_STORE: _StoreStub(
                    [{"id": "g1", "name": "Lights"}, {"id": "g2", "name": "Blinds"}]
                )
            }
        }
    )
    assert category_names(hass) == {"g1": "Lights", "g2": "Blinds"}


def test_category_names_empty_when_store_missing() -> None:
    assert category_names(_Hass({DOMAIN: {}})) == {}
    assert category_names(_Hass({})) == {}


# --- scope display names ------------------------------------------------------


def test_scope_display_name_house_is_house() -> None:
    # House returns before any registry access, so a bare stub hass is fine.
    assert scope_display_name(_Hass({}), "house", None) == "House"


async def test_scope_display_name_area_uses_registry(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Kitchen")
    assert scope_display_name(hass, "area", area.id) == "Kitchen"


async def test_scope_display_name_area_falls_back_to_id(hass: HomeAssistant) -> None:
    assert scope_display_name(hass, "area", "ghost_area") == "ghost_area"


async def test_scope_display_name_uses_fallback_when_given(hass: HomeAssistant) -> None:
    # An explicit fallback wins over the raw id when the registry entry is missing.
    assert scope_display_name(hass, "area", "ghost_area", fallback="Living Room") == "Living Room"


async def test_scope_display_name_floor_uses_registry(hass: HomeAssistant) -> None:
    floor = fr.async_get(hass).async_create("Upstairs")
    assert scope_display_name(hass, "floor", floor.floor_id) == "Upstairs"


async def test_scope_display_name_floor_falls_back_to_id(hass: HomeAssistant) -> None:
    assert scope_display_name(hass, "floor", "ghost_floor") == "ghost_floor"


async def test_scope_device_name_composes_prefix_and_default(hass):
    from homeassistant.helpers import area_registry as ar

    from custom_components.ambience.naming import scope_device_name

    area = ar.async_get(hass).async_create("Living Room")
    assert scope_device_name(hass, "house", None, "Ambience") == "House Ambience"
    assert scope_device_name(hass, "area", area.id, "Ambience") == "Living Room Ambience"
    # Falls back to the provided fallback when the registry entry is gone.
    assert scope_device_name(hass, "area", "missing", "Mood", fallback="Garage") == "Garage Mood"
