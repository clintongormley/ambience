"""Constants for the Ambience integration."""

DOMAIN = "ambience"
STORAGE_KEY = "ambience"
STORAGE_VERSION = 1

DATA_EXPOSED_ACTIONS = "exposed_actions"
DATA_MATCHERS = "matchers"
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

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Dispatcher signal — fired when rules / matcher config / a scope's
# auto_triggers flag change, so the auto-trigger engine rebuilds its watch-set.
# No payload.
SIGNAL_CONFIG_CHANGED = "ambience_config_changed"

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"
DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS = 7200  # 2h; 0 = never auto-on

# The group seeded on a fresh install. It is an ordinary group (renameable,
# deletable when it is not the last group) — these are only its initial values.
GENERAL_GROUP_ID = "general"
GENERAL_GROUP = {
    "id": GENERAL_GROUP_ID,
    "name": "General",
    "icon": "mdi:home",
    "color": "blue-grey",
}
