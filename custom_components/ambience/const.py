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

# Per-scope last-applied scene index: {(scope_kind, scope_id): scene_index}.
# Written by apply_scene; read by the auto-trigger engine's unchanged-scene guard.
DATA_LAST_APPLIED = "last_applied"

# Auto-trigger engine instance.
DATA_ENGINE = "engine"
# Registered trace sinks — objects with an `emit(event)` method (see trace.py).
DATA_TRACE_SINKS = "trace_sinks"
# In-memory trace ring buffer (BufferSink) + its per-(scope,category) cap.
DATA_TRACE_BUFFER = "trace_buffer"
TRACE_BUFFER_SIZE = 5

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Dispatcher signal — fired when scenes / condition config / a scope's
# auto_triggers flag change, so the auto-trigger engine rebuilds its watch-set.
# No payload.
SIGNAL_CONFIG_CHANGED = "ambience_config_changed"

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"
DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS = 7200  # 2h; 0 = never auto-on

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

# Voice-assistant exposure (options flow).
CONF_EXPOSED_ASSISTANTS = "exposed_assistants"
# Pinned copy of homeassistant.components.homeassistant.exposed_entities.
# KNOWN_ASSISTANTS, ordered Assist-first for the options form. Update this if HA
# adds a new assistant (otherwise it would silently never be exposed).
KNOWN_ASSISTANTS = ("conversation", "cloud.google_assistant", "cloud.alexa")
# Default: switches exposed to local Assist only.
DEFAULT_EXPOSED_ASSISTANTS = {
    "conversation": True,
    "cloud.google_assistant": False,
    "cloud.alexa": False,
}
# Assistant id -> options-form field name (dot-free, so it is a valid form +
# translation key).
ASSISTANT_FIELDS = {
    "conversation": "expose_assist",
    "cloud.google_assistant": "expose_google",
    "cloud.alexa": "expose_alexa",
}
# hass.data key holding the resolved {assistant: bool} exposure map for this entry.
DATA_EXPOSED_ASSISTANTS = "exposed_assistants_map"

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
