"""Activity attribution for Ambience applies.

Composes the human-readable "'<scene>' in <scope>" activity lines and records
each apply/run as a Home Assistant *logbook entry* against the scope's switch
entity. An area switch's device sits in its HA area, so the entry is filterable
by area in the logbook. Each apply gets a fresh Context, shared between the
logbook entry and the dispatched device service calls so the logbook groups the
device changes under the activity. Kept separate from service.py so the resolve /
execute logic doesn't carry the message formatting, and so message composition
can be unit-tested without a running integration.
"""

from __future__ import annotations

from homeassistant.components import logbook
from homeassistant.core import Context, HomeAssistant

from .const import DATA_SWITCHES, DOMAIN
from .naming import category_names, scope_display_name

# Brand subject for every logbook entry: "Ambience '<scene>' in <scope>".
# Constant — independent of the configurable switch-default name.
ACTIVITY_NAME = "Ambience"


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

    Shown in the logbook as "Ambience '<scene>' in <scope>". Names the matched
    scene and scope, appending the category name only when more than one category
    exists and a label is known (an unknown category id yields no suffix). Unnamed
    scenes fall back to "scene <N>" (1-based).
    """
    scene = resolved_scene_name(scene_name, scene_index)
    message = f"'{scene}' in {scope_label}"
    if category_count > 1 and category_label:
        message += f" ({category_label})"
    return message


def _switch_entity_id(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str | None:
    """The live scope-switch entity_id to anchor this scope's activity on.

    Falls back to the house switch when the scope has no live switch of its own
    (e.g. a forced manual apply/run on a scope with no real HA area, or a disabled
    scope); returns None when not even the house switch exists, so the caller
    skips the logbook entry rather than crashing.
    """
    switches = hass.data.get(DOMAIN, {}).get(DATA_SWITCHES, {})
    switch = switches.get((scope_kind, scope_id))
    if switch is None and scope_kind != "house":
        switch = switches.get(("house", None))
    return getattr(switch, "entity_id", None)


def _record(hass: HomeAssistant, scope_kind: str, scope_id: str | None, message: str) -> Context:
    """Record an apply/run as a logbook entry on the scope's switch; return the
    fresh Context.

    Callers MUST pass the returned Context to async_execute_actions so the
    resulting device state changes share it and group under the activity in the
    logbook. When no switch resolves the entry is skipped (the Context is still
    returned and the apply still runs).
    """
    context = Context()
    entity_id = _switch_entity_id(hass, scope_kind, scope_id)
    if entity_id is not None:
        # No "logbook" loaded check needed: async_log_entry only fires a bus event
        # (a no-op if logbook isn't listening), and logbook is in manifest after_dependencies.
        logbook.async_log_entry(
            hass,
            name=ACTIVITY_NAME,
            message=message,
            domain=DOMAIN,
            entity_id=entity_id,
            context=context,
        )
    return context


def log_apply(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Record an apply as a logbook entry on the scope switch; return its Context."""
    categories = category_names(hass)
    scope_label = scope_display_name(hass, scope_kind, scope_id)
    message = compose_apply_message(
        scene_name=scene_name,
        scene_index=scene_index,
        scope_label=scope_label,
        category_label=categories.get(category_id),
        category_count=len(categories),
    )
    return _record(hass, scope_kind, scope_id, message)


def log_run_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene_name: str | None,
    scene_index: int,
) -> Context:
    """Record a manual run-actions as a logbook entry on the scope switch; return
    its Context."""
    scene = resolved_scene_name(scene_name, scene_index)
    scope_label = scope_display_name(hass, scope_kind, scope_id)
    return _record(hass, scope_kind, scope_id, f"'{scene}' in {scope_label}")
