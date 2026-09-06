"""Activity attribution for Ambience applies.

Composes the terse "'<category>/<scene>'" activity lines and fires a described
Home Assistant logbook event (EVENT_AMBIENCE_ACTIVITY, see logbook.py) against
the scope's switch entity. An area switch's device sits in its HA area, so the
entry is filterable by area in the logbook. Each apply gets a fresh Context,
shared between the activity event and the dispatched device service calls so the
logbook renders the device changes as "triggered by '<category>/<scene>'
(<switch>)". Kept separate from service.py so the resolve / execute logic doesn't
carry the message formatting, and so message composition can be unit-tested
without a running integration.
"""

from __future__ import annotations

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import Context, HomeAssistant

from .const import EVENT_AMBIENCE_ACTIVITY, get_switches
from .naming import category_names


def resolved_scene_name(scene_name: str | None, scene_index: int) -> str:
    """Scene display name, falling back to a 1-based "scene <N>" when unnamed."""
    return scene_name or f"scene {scene_index + 1}"


def compose_apply_message(
    *,
    scene_name: str | None,
    scene_index: int,
    category_label: str | None,
    category_count: int,
) -> str:
    """Compose the activity line: "'<category>/<scene>'" (or "'<scene>'").

    Deliberately terse and scope-free: the entry is attached to the scope switch,
    whose entity name already supplies the scope and brand ("Lounge Ambience"), so
    repeating them here would read as "… in Lounge (Lounge Ambience)" in the
    logbook's "triggered by" attribution. The category is prefixed only when more
    than one category exists and a label is known. Unnamed scenes fall back to
    "scene <N>" (1-based).
    """
    scene = resolved_scene_name(scene_name, scene_index)
    if category_count > 1 and category_label:
        return f"'{category_label}/{scene}'"
    return f"'{scene}'"


def _switch_entity_id(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str | None:
    """The live scope-switch entity_id to anchor this scope's activity on.

    Falls back to the house switch when the scope has no live switch of its own
    (e.g. a forced manual apply/run on a scope with no real HA area, or a disabled
    scope); returns None when not even the house switch exists, so the caller
    skips the logbook entry rather than crashing.
    """
    switches = get_switches(hass)
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
        # Fire a *described* event (see logbook.py) rather than a bare logbook
        # entry, so the device changes sharing this Context render as "triggered
        # by '<category>/<scene>' (<switch>)". The event carries no "name": the
        # switch entity name supplies the brand, so a name would double it in the
        # attribution. No "logbook loaded" guard needed: async_fire is a no-op if
        # nothing listens, and logbook is in the manifest after_dependencies.
        hass.bus.async_fire(
            EVENT_AMBIENCE_ACTIVITY,
            {"message": message, ATTR_ENTITY_ID: entity_id},
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
    message = compose_apply_message(
        scene_name=scene_name,
        scene_index=scene_index,
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
    return _record(hass, scope_kind, scope_id, f"'{scene}'")
