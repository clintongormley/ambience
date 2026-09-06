"""WebSocket API for the Ambience panel.

The handlers live in per-family modules; this package is the single
registration point and the one import path for registration and
unregistration."""

from __future__ import annotations

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .ai import (
    _ws_ai_bundle,
    _ws_ai_context,
    _ws_ai_guide,
    _ws_entities_find,
    _ws_exposed_actions_list,
    _ws_exposed_actions_save,
    _ws_frontend_version,
    _ws_install_id,
    _ws_mcp_hello,
    _ws_services_get_schema,
    _ws_services_list,
)
from .categories import _ws_categories_delete, _ws_categories_list, _ws_categories_save
from .conditions_config import (
    LUX_RANGES_HANDLERS,
    PERIODS_HANDLERS,
    _ws_conditions_list,
    _ws_day_config_list,
    _ws_day_config_save,
    _ws_state_known_attribute_values,
    _ws_state_known_states,
    _ws_weather_config_list,
    _ws_weather_config_save,
)
from .history_live import (
    _ws_history_redo,
    _ws_history_subscribe,
    _ws_history_undo,
    _ws_live_subscribe,
    _ws_traces_clear,
    _ws_traces_list,
)
from .scopes import (
    _ws_apply,
    _ws_area_get,
    _ws_area_save,
    _ws_areas_list,
    _ws_auto_triggers_list,
    _ws_dry_run,
    _ws_exposed_assistants_list,
    _ws_exposed_assistants_save,
    _ws_floor_get,
    _ws_floor_save,
    _ws_floors_list,
    _ws_house_get,
    _ws_house_save,
    _ws_reapply_list,
    _ws_reapply_save,
    _ws_run_scene_actions,
    _ws_set_scope_enabled,
    _ws_switch_defaults_list,
    _ws_switch_defaults_save,
    _ws_switches_list,
    _ws_validate,
)
from .simulate import (
    _ws_scope_diagnostics,
    _ws_simulate,
    _ws_simulate_inputs,
    _ws_simulate_sun_anchors,
)

# `custom_components.ambience.websocket` is the one import path for the ws API:
# registration, unregistration, and the read/write classification of every
# command. Everything else lives in the module that owns it.
__all__ = [
    "READ_COMMANDS",
    "WRITE_COMMANDS",
    "async_register_commands",
    "async_unregister_commands",
]


def async_register_commands(hass: HomeAssistant) -> None:
    """Register every Ambience ws command (see _WS_HANDLERS at module bottom)."""
    for handler in _WS_HANDLERS:
        websocket_api.async_register_command(hass, handler)


def async_unregister_commands(hass: HomeAssistant) -> None:
    """Remove Ambience WS commands from HA's websocket_api handler registry."""
    handlers = hass.data.get(websocket_api.const.DOMAIN, {})
    for handler in _WS_HANDLERS:
        handlers.pop(handler._ws_command, None)  # noqa: SLF001 — set by @websocket_command


# The single registration table — register and unregister both derive from it
# (each handler carries its command string as `_ws_command`), so the two can't
# drift. Every handler is imported here, so this package is also the one place
# a new command has to be added to become reachable.
_WS_HANDLERS = (
    _ws_areas_list,
    _ws_floors_list,
    _ws_conditions_list,
    _ws_install_id,
    _ws_frontend_version,
    _ws_services_list,
    _ws_services_get_schema,
    _ws_exposed_actions_list,
    _ws_exposed_actions_save,
    _ws_area_get,
    _ws_area_save,
    _ws_floor_get,
    _ws_floor_save,
    _ws_house_get,
    _ws_house_save,
    _ws_validate,
    _ws_dry_run,
    _ws_apply,
    _ws_run_scene_actions,
    *PERIODS_HANDLERS,
    *LUX_RANGES_HANDLERS,
    _ws_day_config_list,
    _ws_day_config_save,
    _ws_weather_config_list,
    _ws_weather_config_save,
    _ws_state_known_states,
    _ws_state_known_attribute_values,
    _ws_switch_defaults_list,
    _ws_switch_defaults_save,
    _ws_reapply_list,
    _ws_reapply_save,
    _ws_exposed_assistants_list,
    _ws_exposed_assistants_save,
    _ws_switches_list,
    _ws_set_scope_enabled,
    _ws_categories_list,
    _ws_categories_save,
    _ws_categories_delete,
    _ws_auto_triggers_list,
    _ws_traces_list,
    _ws_traces_clear,
    _ws_history_subscribe,
    _ws_history_undo,
    _ws_history_redo,
    _ws_live_subscribe,
    _ws_scope_diagnostics,
    _ws_ai_bundle,
    _ws_ai_context,
    _ws_mcp_hello,
    _ws_entities_find,
    _ws_ai_guide,
    _ws_simulate_inputs,
    _ws_simulate,
    _ws_simulate_sun_anchors,
)

# Every registered command is in exactly one of these two sets: a write persists
# configuration or clears state Ambience owns; a read does neither — though a read
# may still evaluate a user script or template condition, which runs that script.
# The MCP client
# mirrors WRITE_COMMANDS as `ambience_mcp.ha_client.MUTATING_COMMANDS` to decide
# which commands it may re-send after a lost reply, and
# tests/test_protocol_shape.py gates both the partition and the mirroring.
WRITE_COMMANDS: frozenset[str] = frozenset(
    {
        "ambience/apply",
        "ambience/area/save",
        "ambience/categories/delete",
        "ambience/categories/save",
        "ambience/conditions/day/config/save",
        "ambience/conditions/weather/config/save",
        "ambience/exposed_actions/save",
        "ambience/exposed_assistants/save",
        "ambience/floor/save",
        "ambience/history/redo",
        "ambience/history/undo",
        "ambience/house/save",
        "ambience/lux_ranges/reset",
        "ambience/lux_ranges/save",
        "ambience/reapply/save",
        "ambience/scene/run_actions",
        "ambience/set_scope_enabled",
        "ambience/switch_defaults/save",
        "ambience/time_of_day_periods/reset",
        "ambience/time_of_day_periods/save",
        "ambience/traces/clear",
    }
)

READ_COMMANDS: frozenset[str] = frozenset(
    {
        "ambience/ai_bundle",
        "ambience/ai_context",
        "ambience/ai_guide",
        "ambience/area/get",
        "ambience/areas/list",
        "ambience/auto_triggers/list",
        "ambience/categories/list",
        "ambience/conditions/day/config/list",
        "ambience/conditions/list",
        "ambience/conditions/weather/config/list",
        "ambience/diagnostics/scope",
        "ambience/dry_run",
        "ambience/entities/find",
        "ambience/exposed_actions/list",
        "ambience/exposed_assistants/list",
        "ambience/floor/get",
        "ambience/floors/list",
        "ambience/frontend_version",
        "ambience/history/subscribe",
        "ambience/house/get",
        "ambience/install_id",
        "ambience/live/subscribe",
        "ambience/lux_ranges/list",
        "ambience/mcp/hello",
        "ambience/reapply/list",
        "ambience/services/get_schema",
        "ambience/services/list",
        "ambience/simulate",
        "ambience/simulate/inputs",
        "ambience/simulate/sun_anchors",
        "ambience/state/known_attribute_values",
        "ambience/state/known_states",
        "ambience/switch_defaults/list",
        "ambience/switches/list",
        "ambience/time_of_day_periods/list",
        "ambience/traces/list",
        "ambience/validate",
    }
)
