"""Logbook attribution for Ambience applies.

Composes the human-readable "applied '<scene>' in <scope>" messages and fires
the matching logbook entries. Kept separate from service.py so the resolve /
execute logic doesn't carry the logbook-message formatting, and so the message
composition can be unit-tested without a running logbook integration.
"""

from __future__ import annotations

from homeassistant.core import Context, HomeAssistant

from .const import DOMAIN
from .naming import category_names, scope_display_name


def compose_apply_message(
    *,
    reapplied: bool,
    scene_name: str | None,
    scene_index: int,
    scope_label: str,
    category_label: str | None,
    category_count: int,
) -> str:
    """Compose the logbook message for an apply.

    Names the matched scene and scope. Appends the category name only when
    more than one category exists and a label is known (an unknown category id yields
    no suffix). Unnamed scenes fall back to "scene <N>" (1-based).
    """
    verb = "re-applied" if reapplied else "applied"
    scene = scene_name or f"scene {scene_index + 1}"
    message = f"{verb} '{scene}' in {scope_label}"
    if category_count > 1 and category_label:
        message += f" ({category_label})"
    return message


def _log_entry(hass: HomeAssistant, message: str) -> Context:
    """Fire an "Ambience" logbook entry and return a fresh Context.

    Callers MUST pass the returned Context to async_execute_actions so the
    resulting device state changes share it and trace back to this entry in the
    logbook. Imported lazily so this module does not depend on logbook at import
    time; the entry is a harmless no-op if the logbook integration is unloaded.
    """
    from homeassistant.components.logbook import async_log_entry

    context = Context()
    async_log_entry(hass, "Ambience", message, domain=DOMAIN, context=context)
    return context


def log_apply(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    scene_name: str | None,
    scene_index: int,
    *,
    reapplied: bool,
) -> Context:
    """Fire the logbook entry for an apply and return its Context."""
    categories = category_names(hass)
    return _log_entry(
        hass,
        compose_apply_message(
            reapplied=reapplied,
            scene_name=scene_name,
            scene_index=scene_index,
            scope_label=scope_display_name(hass, scope_kind, scope_id),
            category_label=categories.get(category_id),
            category_count=len(categories),
        ),
    )


def log_run_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Fire the logbook entry for a manual run-actions and return its Context."""
    scene = scene_name or f"scene {scene_index + 1}"
    return _log_entry(hass, f"ran '{scene}' in {scope_display_name(hass, scope_kind, scope_id)}")
