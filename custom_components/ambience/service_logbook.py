"""Activity attribution for Ambience applies.

Composes the human-readable "'<scene>' in <scope>" activity lines and signals
the Scene-updates sensor to record each apply/run as its state (that state change
IS the logbook entry — the sensor is the device-filterable activity anchor). Each
apply gets a fresh Context, shared between the sensor's state change and the
dispatched device service calls so the logbook groups the device changes under
the activity. Kept separate from service.py so the resolve / execute logic
doesn't carry the message formatting, and so the message composition can be
unit-tested without a running integration.
"""

from __future__ import annotations

from dataclasses import dataclass

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import SIGNAL_ACTIVITY_RECORDED
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
    """Compose the activity line for an apply: "'<scene>' in <scope>".

    This becomes the Scene-updates sensor's state, which HA's logbook renders as
    "<entity> changed to '<scene>' in <scope>" — so no verb/brand prefix here (it
    would double up with the entity name; the applied/ran verb lives in the
    ActivityRecord.action attribute). Names the matched scene and scope, appending
    the category name only when more than one category exists and a label is known
    (an unknown category id yields no suffix). Unnamed scenes fall back to
    "scene <N>" (1-based).
    """
    scene = resolved_scene_name(scene_name, scene_index)
    message = f"'{scene}' in {scope_label}"
    if category_count > 1 and category_label:
        message += f" ({category_label})"
    return message


def _record(hass: HomeAssistant, record: ActivityRecord) -> Context:
    """Signal the Scene-updates sensor to record this apply/run and return its
    Context.

    The sensor sets its state to the activity line (the logbook entry) using this
    context; callers MUST pass the returned Context to async_execute_actions so
    the resulting device state changes share it and group under the activity in
    the logbook. The dispatch is a no-op (state stays put) when the sensor is
    disabled — applies still run, they're just not logged as activity.
    """
    context = Context()
    async_dispatcher_send(hass, SIGNAL_ACTIVITY_RECORDED, record, context)
    return context


def log_apply(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Record an apply (sensor activity signal); return its Context."""
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
    """Record a manual run-actions (sensor activity signal); return its Context."""
    scene = resolved_scene_name(scene_name, scene_index)
    scope_label = scope_display_name(hass, scope_kind, scope_id)
    return _record(
        hass,
        ActivityRecord(
            # Verb-less like the apply line (see compose_apply_message); "ran"
            # lives in action, surfaced as the last_action attribute.
            message=f"'{scene}' in {scope_label}",
            scene=scene,
            scope=scope_label,
            scope_kind=scope_kind,
            category=None,
            action="ran",
        ),
    )
