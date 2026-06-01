"""Canonical human-readable names for scopes and groups.

Shared by the logbook attribution (`service._log_apply`) and the evaluation
trace (`trace`), so both render the same friendly area/floor/group names from a
single source of truth instead of duplicating the lookups.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from .const import DATA_STORE, DOMAIN


def scope_display_name(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Human label for a scope: area/floor name, or 'Global' for the house.

    Falls back to the raw scope_id when the registry entry is missing (e.g. a
    deleted area/floor, or a test with no registered areas)."""
    if scope_kind == "house":
        return "Global"
    if scope_kind == "floor":
        floor = fr.async_get(hass).async_get_floor(scope_id)
        return floor.name if floor is not None else (scope_id or "floor")
    area = ar.async_get(hass).async_get_area(scope_id)
    return area.name if area is not None else (scope_id or "area")


def group_names(hass: HomeAssistant) -> dict[str | None, str | None]:
    """Map of group id -> configured group name, from the store.

    Returns an empty map when the store has no group list (e.g. a missing store
    or a test double), so callers can treat every id as unresolved."""
    store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
    groups: Any = getattr(store, "groups", None)
    if not callable(groups):
        return {}
    return {g.get("id"): g.get("name") for g in groups()}


def group_name(hass: HomeAssistant, group_id: str) -> str | None:
    """The configured display name for a group id, or None if unknown."""
    return group_names(hass).get(group_id)
