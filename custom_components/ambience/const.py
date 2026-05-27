"""Constants for the Ambience integration."""

DOMAIN = "ambience"
STORAGE_KEY = "ambience"
STORAGE_VERSION = 1

DATA_ACTIONS = "actions"
DATA_EXPOSED_ACTIONS = "exposed_actions"
DATA_MATCHERS = "matchers"
DATA_PERIODS = "periods"
DATA_STORE = "store"

# Switch entity
DATA_SWITCHES = "switches"
DATA_SWITCH_ADD_ENTITIES = "switch_add_entities"

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"
DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS = 7200  # 2h; 0 = never auto-on
