"""Canonical human-readable names for scopes, categories and scenes.

Shared by the logbook attribution (`service_logbook.log_apply`), the evaluation
trace (`trace`) and Repairs (`config_health_issues`), so all of them render the
same friendly names from a single source of truth instead of duplicating the
lookups and the fallbacks.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .const import get_store
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


def scene_label(name: str | None, index: int | None = None) -> str:
    """Display label for a scene: its name, else "scene N" (1-based) when the
    index is known, else "(unnamed)".

    Repairs and the logbook both name scenes through here, so an unnamed scene
    reads the same in both. The trace log is not a caller: it renders its own
    "scene #N" form from the winner index. A blank or whitespace-only name
    counts as no name.
    """
    if name and name.strip():
        return name
    return f"scene {index + 1}" if index is not None else "(unnamed)"


def category_names(hass: HomeAssistant) -> dict[str | None, str | None]:
    """Map of category id -> configured category name, from the store.

    Returns an empty map when there is no store: hass.data[DOMAIN] is filled in
    stages (the trace sinks land before the store) and is dropped whole on
    unload, so a caller can arrive with nothing to read. Every id is then left
    unresolved rather than crashing the caller."""
    store = get_store(hass)
    if store is None:
        return {}
    return {g.get("id"): g.get("name") for g in store.categories()}
