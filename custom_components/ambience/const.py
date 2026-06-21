"""Constants for the Ambience integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .store import AmbienceStore

DOMAIN = "ambience"
STORAGE_KEY = "ambience"
STORAGE_VERSION = 1

DATA_EXPOSED_ACTIONS = "exposed_actions"
DATA_CONDITIONS = "conditions"
DATA_PERIODS = "periods"
DATA_LUX_RANGES = "lux_ranges"
DATA_STORE = "store"

# Switch entity
DATA_SWITCHES = "switches"
DATA_SWITCH_ADD_ENTITIES = "switch_add_entities"

# Last-applied scene index: {(scope_kind, scope_id, category_id): scene_index}.
# Written by apply_scene; read by the auto-trigger engine's unchanged-scene guard.
DATA_LAST_APPLIED = "last_applied"

# Per-(scope_kind, scope_id, category_id) asyncio.Lock registry, shared by the
# trigger engine and the manual apply path (see service.apply_lock).
DATA_APPLY_LOCKS = "apply_locks"

# Auto-trigger engine instance.
DATA_ENGINE = "engine"
# Cached global action-overlap entity-id set (frozenset), so per-scope WS gets
# don't each re-scan every scope. Refreshed by reconcile_issues (on the same
# config-change / entity-registry signals that drive Repairs) and on save.
DATA_OVERLAP_SET = "overlap_set"
# Registered trace sinks — objects with an `emit(event)` method (see trace.py).
DATA_TRACE_SINKS = "trace_sinks"
# In-memory trace ring buffer (BufferSink) + its per-(scope,category) cap.
DATA_TRACE_BUFFER = "trace_buffer"
TRACE_BUFFER_SIZE = 5

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Dispatcher signal — fired when scenes / condition config change, so the
# auto-trigger engine rebuilds its watch-set. Payload: the affected
# (scope_kind, scope_id) tuple, or None for a global change (reapply all).
SIGNAL_CONFIG_CHANGED = "ambience_config_changed"

# Dispatcher signal — fired after a unit's actions are dispatched (last-applied
# recorded). Payload: the (scope_kind, scope_id, category_id) unit. Drives the
# idle re-apply timer reset.
SIGNAL_UNIT_APPLIED = "ambience_unit_applied"

# Dispatcher signal — fired when the global re-apply settings change. Payload: None.
SIGNAL_REAPPLY_CONFIG_UPDATED = "ambience_reapply_config_updated"

# Dispatcher signal — fired on each apply/run so the Scene-updates sensor sets its
# state to the activity line (that state change IS the logbook entry) and refreshes
# its detail attributes. Payload: (ActivityRecord, Context) — see service_logbook.py.
SIGNAL_ACTIVITY_RECORDED = "ambience_activity_recorded"

# Dispatcher signal — fired when the voice-assistant exposure map changes (saved
# from the panel's Advanced page). Payload: None. The listener re-applies exposure
# to every live switch.
SIGNAL_EXPOSED_ASSISTANTS_UPDATED = "ambience_exposed_assistants_updated"

# Note: the idle re-apply defaults (DEFAULT_REAPPLY_ENABLED / *_INTERVAL_SECONDS /
# MIN_REAPPLY_INTERVAL_SECONDS) and DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS live in
# store.py, their only consumer — keeping them out of const avoids a CodeQL
# py/unsafe-cyclic-import false positive (const has a TYPE_CHECKING-only import of
# store for get_store's annotation).

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"

# The category seeded on a fresh install. It is an ordinary category (renameable,
# deletable when it is not the last category) — these are only its initial values.
GENERAL_CATEGORY_ID = "general"
GENERAL_CATEGORY = {
    "id": GENERAL_CATEGORY_ID,
    "name": "General",
    "icon": "mdi:home",
    "color": "blue-grey",
}

# Options flow
CONF_SHOW_SIDEBAR_PANEL = "show_sidebar_panel"
DEFAULT_SHOW_SIDEBAR_PANEL = True

# Voice-assistant exposure. The per-assistant on/off map is stored in the
# Ambience store (store.DEFAULT_EXPOSED_ASSISTANTS) and edited on the panel's
# Advanced page. KNOWN_ASSISTANTS / ASSISTANT_FIELDS must stay key-aligned with
# store.DEFAULT_EXPOSED_ASSISTANTS (guarded by a store test).
# Pinned copy of homeassistant.components.homeassistant.exposed_entities.
# KNOWN_ASSISTANTS, Assist first. Update this if HA adds a new assistant
# (otherwise it would silently never be exposed).
KNOWN_ASSISTANTS = ("conversation", "cloud.google_assistant", "cloud.alexa")
# Assistant id -> dot-free key used on the websocket wire, in the frontend, and
# as the i18n / test key.
ASSISTANT_FIELDS = {
    "conversation": "expose_assist",
    "cloud.google_assistant": "expose_google",
    "cloud.alexa": "expose_alexa",
}

# hass.data key holding the Lovelace resource id registered for the card, so it
# can be removed on unload.
DATA_CARD_RESOURCE_ID = "card_resource_id"
# hass.data key holding the versioned card URL, needed by the add_extra_js_url
# fallback's removal on unload.
DATA_CARD_RESOURCE_URL = "card_resource_url"


def get_store(hass: HomeAssistant) -> AmbienceStore | None:
    """The Ambience store for this hass, or None when the integration isn't set
    up yet. Tolerant lookup for read paths that may run before/around setup;
    paths that require the store to exist still index ``hass.data`` directly."""
    return hass.data.get(DOMAIN, {}).get(DATA_STORE)
