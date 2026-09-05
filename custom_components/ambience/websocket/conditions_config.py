"""WebSocket commands for the condition catalog and the per-condition config:
time-of-day periods, lux ranges, day, weather, and entity state options."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv

from ..const import DATA_CONDITIONS, DATA_LUX_RANGES, DATA_PERIODS, DATA_STORE, DOMAIN
from ..sorting import condition_priority
from ..state_options import known_attribute_values_for, known_states_for
from ..websocket_helpers import validate_weather_groups
from .common import send_ambience_error


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/conditions/list"})
@websocket_api.async_response
async def _ws_conditions_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    result = [
        {
            "name": m.name,
            "description": m.description,
            "predicate_help": m.predicate_help,
            "input": getattr(m, "input", "text"),
            "priority": condition_priority(m),
        }
        for m in conditions.values()
    ]
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/time_of_day_periods/list"})
@websocket_api.async_response
async def _ws_periods_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    period_store = hass.data[DOMAIN][DATA_PERIODS]
    connection.send_result(msg["id"], period_store.view_for_ui())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/time_of_day_periods/save",
        vol.Required("custom"): dict,
        vol.Required("hidden"): list,
    }
)
@websocket_api.async_response
async def _ws_periods_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    period_store = hass.data[DOMAIN][DATA_PERIODS]
    try:
        await period_store.save(msg["custom"], msg["hidden"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return

    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/time_of_day_periods/reset"})
@websocket_api.async_response
async def _ws_periods_reset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    period_store = hass.data[DOMAIN][DATA_PERIODS]
    await period_store.reset()
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/lux_ranges/list"})
@websocket_api.async_response
async def _ws_lux_ranges_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    lux_store = hass.data[DOMAIN][DATA_LUX_RANGES]
    connection.send_result(msg["id"], lux_store.view_for_ui())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/lux_ranges/save",
        vol.Required("custom"): dict,
        vol.Required("hidden"): list,
    }
)
@websocket_api.async_response
async def _ws_lux_ranges_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    lux_store = hass.data[DOMAIN][DATA_LUX_RANGES]
    try:
        await lux_store.save(msg["custom"], msg["hidden"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return

    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/lux_ranges/reset"})
@websocket_api.async_response
async def _ws_lux_ranges_reset(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    lux_store = hass.data[DOMAIN][DATA_LUX_RANGES]
    await lux_store.reset()
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/conditions/day/config/list"})
@websocket_api.async_response
async def _ws_day_config_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], store.get_condition_config("day"))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/conditions/day/config/save",
        vol.Optional("workday_sensor"): vol.Any(cv.entity_id, None),
        vol.Optional("workday_calendar"): vol.Any(cv.entity_id, None),
    }
)
@websocket_api.async_response
async def _ws_day_config_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    new_cfg = {
        "workday_sensor": msg.get("workday_sensor"),
        "workday_calendar": msg.get("workday_calendar"),
    }
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_condition_config("day", new_cfg)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/conditions/weather/config/list"})
@websocket_api.async_response
async def _ws_weather_config_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], store.get_condition_config("weather"))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/conditions/weather/config/save",
        vol.Optional("entity"): vol.Any(cv.entity_id, None),
        vol.Optional("groups"): list,
    }
)
@websocket_api.async_response
async def _ws_weather_config_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        groups = validate_weather_groups(msg.get("groups"))
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    new_cfg = {"entity": msg.get("entity"), "groups": groups}
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_condition_config("weather", new_cfg)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/state/known_states",
        vol.Required("entity_id"): str,
    }
)
@websocket_api.async_response
async def _ws_state_known_states(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    states = known_states_for(hass, msg["entity_id"])
    connection.send_result(msg["id"], {"states": states})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/state/known_attribute_values",
        vol.Required("entity_id"): str,
        vol.Required("attribute"): str,
    }
)
@websocket_api.async_response
async def _ws_state_known_attribute_values(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    values = known_attribute_values_for(hass, msg["entity_id"], msg["attribute"])
    connection.send_result(msg["id"], {"values": values})
