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

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"
DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS = 7200  # 2h; 0 = never auto-on
