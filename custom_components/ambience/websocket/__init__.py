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
    _ws_conditions_list,
    _ws_day_config_list,
    _ws_day_config_save,
    _ws_lux_ranges_list,
    _ws_lux_ranges_reset,
    _ws_lux_ranges_save,
    _ws_periods_list,
    _ws_periods_reset,
    _ws_periods_save,
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
# registration and unregistration. Everything else lives in the module that
# owns it.
__all__ = ["async_register_commands", "async_unregister_commands"]


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
    _ws_periods_list,
    _ws_periods_save,
    _ws_periods_reset,
    _ws_lux_ranges_list,
    _ws_lux_ranges_save,
    _ws_lux_ranges_reset,
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
