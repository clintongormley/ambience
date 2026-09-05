"""Canonical human-readable names for scopes and categories.

Shared by the logbook attribution (`service_logbook.log_apply`) and the evaluation
trace (`trace`), so both render the same friendly area/floor/category names from a
single source of truth instead of duplicating the lookups.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .const import DATA_STORE, DOMAIN
from .scopes import scope_spec


def scope_display_name(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    fallback: str | None = None,
) -> str:
    """Human label for a scope: area/floor name, or 'House' for the house.

    When the registry entry is missing (e.g. a deleted area/floor, or a test
    with no registered areas), returns `fallback` if given, else the raw
    scope_id."""
    spec = scope_spec(scope_kind)
    if spec.registry_lookup is None:
        # The house has no registry entry — its name is the same everywhere.
        return "House"
    entry = spec.registry_lookup(hass, scope_id)
    if entry is not None:
        return entry.name
    return fallback if fallback is not None else (scope_id or scope_kind)


def scope_device_name(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    default_name: str,
    fallback: str | None = None,
) -> str:
    """Composed device name for a scope: '<House|floor|area name> <default>'.

    `default_name` is the configurable switch-defaults name (e.g. "Ambience").
    """
    prefix = scope_display_name(hass, scope_kind, scope_id, fallback=fallback)
    return f"{prefix} {default_name}"


def category_names(hass: HomeAssistant) -> dict[str | None, str | None]:
    """Map of category id -> configured category name, from the store.

    Returns an empty map when the store has no category list (e.g. a missing store
    or a test double), so callers can treat every id as unresolved."""
    store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
    categories: Any = getattr(store, "categories", None)
    if not callable(categories):
        return {}
    return {g.get("id"): g.get("name") for g in categories()}
