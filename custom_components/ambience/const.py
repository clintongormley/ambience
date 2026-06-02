"""Constants for the Ambience integration."""

DOMAIN = "ambience"
STORAGE_KEY = "ambience"
STORAGE_VERSION = 1

DATA_EXPOSED_ACTIONS = "exposed_actions"
DATA_CONDITIONS = "conditions"
DATA_PERIODS = "periods"
DATA_STORE = "store"

# Switch entity
DATA_SWITCHES = "switches"
DATA_SWITCH_ADD_ENTITIES = "switch_add_entities"

# Per-scope last-applied rule index: {(scope_kind, scope_id): rule_index}.
# Written by apply_scene; read by the auto-trigger engine's unchanged-rule guard.
DATA_LAST_APPLIED = "last_applied"

# Auto-trigger engine instance.
DATA_ENGINE = "engine"
# Registered TraceSink instances (see trace.py).
DATA_TRACE_SINKS = "trace_sinks"
# In-memory trace ring buffer (BufferSink) + its per-(scope,category) cap.
DATA_TRACE_BUFFER = "trace_buffer"
TRACE_BUFFER_SIZE = 5

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Dispatcher signal — fired when rules / condition config / a scope's
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

# hass.data key holding the Lovelace resource id registered for the card, so it
# can be removed on unload.
DATA_CARD_RESOURCE_ID = "card_resource_id"
# hass.data key holding the versioned card URL, needed by the add_extra_js_url
# fallback's removal on unload.
DATA_CARD_RESOURCE_URL = "card_resource_url"
