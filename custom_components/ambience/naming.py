"""Canonical human-readable names for scopes and categories.

Shared by the logbook attribution (`service._log_apply`) and the evaluation
trace (`trace`), so both render the same friendly area/floor/category names from a
single source of truth instead of duplicating the lookups.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from .const import DATA_STORE, DOMAIN


def scope_display_name(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    fallback: str | None = None,
) -> str:
    """Human label for a scope: area/floor name, or 'Global' for the house.

    When the registry entry is missing (e.g. a deleted area/floor, or a test
    with no registered areas), returns `fallback` if given, else the raw
    scope_id."""
    if scope_kind == "house":
        return "Global"
    if scope_kind == "floor":
        floor = fr.async_get(hass).async_get_floor(scope_id)
        if floor is not None:
            return floor.name
        return fallback if fallback is not None else (scope_id or "floor")
    area = ar.async_get(hass).async_get_area(scope_id)
    if area is not None:
        return area.name
    return fallback if fallback is not None else (scope_id or "area")


def category_names(hass: HomeAssistant) -> dict[str | None, str | None]:
    """Map of category id -> configured category name, from the store.

    Returns an empty map when the store has no category list (e.g. a missing store
    or a test double), so callers can treat every id as unresolved."""
    store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
    categories: Any = getattr(store, "categories", None)
    if not callable(categories):
        return {}
    return {g.get("id"): g.get("name") for g in categories()}
