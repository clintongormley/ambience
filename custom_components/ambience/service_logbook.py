"""Logbook + activity attribution for Ambience applies.

Composes the human-readable "applied '<scene>' in <scope>" messages, fires the
matching logbook entries (attached to the Scene-updates sensor so they are
device-filterable), and signals that sensor to record the activity. Kept
separate from service.py so the resolve / execute logic doesn't carry the
message formatting, and so the message composition can be unit-tested without a
running logbook integration.
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DATA_ACTIVITY_SENSOR, DOMAIN, SIGNAL_ACTIVITY_RECORDED
from .naming import category_names, scope_display_name


@dataclass(frozen=True, slots=True)
class ActivityRecord:
    """One apply/run, as surfaced to the Scene-updates sensor.

    `message` is the logbook sentence; the rest are the structured fields the
    sensor exposes as attributes. `scene` is always resolved (the "scene <N>"
    fallback applied). `category` is the category label, or None.
    """

    message: str
    scene: str
    scope: str
    scope_kind: str
    category: str | None
    action: str  # "applied" | "ran"


def resolved_scene_name(scene_name: str | None, scene_index: int) -> str:
    """Scene display name, falling back to a 1-based "scene <N>" when unnamed."""
    return scene_name or f"scene {scene_index + 1}"


def compose_apply_message(
    *,
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
    scene = resolved_scene_name(scene_name, scene_index)
    message = f"applied '{scene}' in {scope_label}"
    if category_count > 1 and category_label:
        message += f" ({category_label})"
    return message


def _log_entry(hass: HomeAssistant, message: str) -> Context:
    """Fire an "Ambience" logbook entry and return a fresh Context.

    The entry is attached to the Scene-updates sensor (when present) so it is
    filterable by the Ambience hub device; absent the sensor it falls back to a
    domain-only entry (pre-sensor behaviour). Callers MUST pass the returned
    Context to async_execute_actions so the resulting device state changes share
    it and trace back to this entry in the logbook. Imported lazily so this
    module does not depend on logbook at import time; the entry is a harmless
    no-op if the logbook integration is unloaded.
    """
    from homeassistant.components.logbook import async_log_entry

    context = Context()
    entity_id = hass.data.get(DOMAIN, {}).get(DATA_ACTIVITY_SENSOR)
    async_log_entry(hass, "Ambience", message, domain=DOMAIN, entity_id=entity_id, context=context)
    return context


def _record(hass: HomeAssistant, record: ActivityRecord) -> Context:
    """Fire the logbook entry, then signal the Scene-updates sensor.

    Logbook first so the sensor's count only advances for an entry that was
    actually emitted, and the count-bump state change follows the logbook line.
    """
    context = _log_entry(hass, record.message)
    async_dispatcher_send(hass, SIGNAL_ACTIVITY_RECORDED, record)
    return context


def log_apply(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Record an apply (logbook entry + sensor signal); return its Context."""
    categories = category_names(hass)
    scope_label = scope_display_name(hass, scope_kind, scope_id)
    category_label = categories.get(category_id)
    message = compose_apply_message(
        scene_name=scene_name,
        scene_index=scene_index,
        scope_label=scope_label,
        category_label=category_label,
        category_count=len(categories),
    )
    return _record(
        hass,
        ActivityRecord(
            message=message,
            scene=resolved_scene_name(scene_name, scene_index),
            scope=scope_label,
            scope_kind=scope_kind,
            category=category_label,
            action="applied",
        ),
    )


def log_run_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Record a manual run-actions (logbook entry + sensor signal); return its Context."""
    scene = resolved_scene_name(scene_name, scene_index)
    scope_label = scope_display_name(hass, scope_kind, scope_id)
    return _record(
        hass,
        ActivityRecord(
            message=f"ran '{scene}' in {scope_label}",
            scene=scene,
            scope=scope_label,
            scope_kind=scope_kind,
            category=None,
            action="ran",
        ),
    )
