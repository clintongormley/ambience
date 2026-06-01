"""Canonical scope/group display-name helpers shared by logbook + trace."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.naming import (
    group_name,
    group_names,
    scope_display_name,
)


class _StoreStub:
    def __init__(self, groups: list[dict]) -> None:
        self._groups = groups

    def groups(self) -> list[dict]:
        return list(self._groups)


class _Hass:
    """Minimal hass stand-in carrying only `.data` (mirrors test_trace)."""

    def __init__(self, data: dict) -> None:
        self.data = data


# --- group names --------------------------------------------------------------


def test_group_names_maps_id_to_name() -> None:
    hass = _Hass(
        {
            DOMAIN: {
                DATA_STORE: _StoreStub(
                    [{"id": "g1", "name": "Lights"}, {"id": "g2", "name": "Blinds"}]
                )
            }
        }
    )
    assert group_names(hass) == {"g1": "Lights", "g2": "Blinds"}


def test_group_names_empty_when_store_missing() -> None:
    assert group_names(_Hass({DOMAIN: {}})) == {}
    assert group_names(_Hass({})) == {}


def test_group_name_lookup_and_unknown() -> None:
    hass = _Hass({DOMAIN: {DATA_STORE: _StoreStub([{"id": "g1", "name": "Lights"}])}})
    assert group_name(hass, "g1") == "Lights"
    assert group_name(hass, "nope") is None


# --- scope display names ------------------------------------------------------


def test_scope_display_name_house_is_global() -> None:
    # House returns before any registry access, so a bare stub hass is fine.
    assert scope_display_name(_Hass({}), "house", None) == "Global"


async def test_scope_display_name_area_uses_registry(hass: HomeAssistant) -> None:
    area = ar.async_get(hass).async_create("Kitchen")
    assert scope_display_name(hass, "area", area.id) == "Kitchen"


async def test_scope_display_name_area_falls_back_to_id(hass: HomeAssistant) -> None:
    assert scope_display_name(hass, "area", "ghost_area") == "ghost_area"


async def test_scope_display_name_floor_uses_registry(hass: HomeAssistant) -> None:
    floor = fr.async_get(hass).async_create("Upstairs")
    assert scope_display_name(hass, "floor", floor.floor_id) == "Upstairs"


async def test_scope_display_name_floor_falls_back_to_id(hass: HomeAssistant) -> None:
    assert scope_display_name(hass, "floor", "ghost_floor") == "ghost_floor"
