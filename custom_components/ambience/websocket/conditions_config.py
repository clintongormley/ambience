"""WebSocket commands for the condition catalog and the per-condition config:
time-of-day periods, lux ranges, day, weather, and entity state options."""

from __future__ import annotations

from collections.abc import Callable
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


# A registered handler, after @websocket_command/@async_response have wrapped it.
_WsHandler = Callable[[HomeAssistant, websocket_api.ActiveConnection, dict[str, Any]], None]


def _named_def_handlers(prefix: str, data_key: str) -> tuple[_WsHandler, _WsHandler, _WsHandler]:
    """Build the list/save/reset handlers for one named-definition store under
    `ambience/<prefix>/`, reading it from `hass.data[DOMAIN][data_key]`.

    Time-of-day periods and lux ranges are the same thing in different units — a
    map of user-named definitions plus a hidden set over the shipped built-ins —
    and expose the same `view_for_ui` / `save` / `reset` surface, so one
    implementation serves both and the two can't drift apart.
    """

    @websocket_api.require_admin
    @websocket_api.websocket_command({vol.Required("type"): f"ambience/{prefix}/list"})
    @websocket_api.async_response
    async def _list(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        connection.send_result(msg["id"], hass.data[DOMAIN][data_key].view_for_ui())

    @websocket_api.require_admin
    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"ambience/{prefix}/save",
            vol.Required("custom"): dict,
            vol.Required("hidden"): list,
        }
    )
    @websocket_api.async_response
    async def _save(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        try:
            await hass.data[DOMAIN][data_key].save(msg["custom"], msg["hidden"])
        except (HomeAssistantError, ValueError) as exc:
            send_ambience_error(connection, msg["id"], exc)
            return
        connection.send_result(msg["id"], {"ok": True})

    @websocket_api.require_admin
    @websocket_api.websocket_command({vol.Required("type"): f"ambience/{prefix}/reset"})
    @websocket_api.async_response
    async def _reset(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        await hass.data[DOMAIN][data_key].reset()
        connection.send_result(msg["id"], {"ok": True})

    return _list, _save, _reset


# The two named-definition families, each (list, save, reset). Kept as tuples —
# rather than unpacked into six module globals this module never reads again —
# so `websocket/__init__.py` splats both into its registration table.
PERIODS_HANDLERS = _named_def_handlers("time_of_day_periods", DATA_PERIODS)
LUX_RANGES_HANDLERS = _named_def_handlers("lux_ranges", DATA_LUX_RANGES)


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
        send_ambience_error(connection, msg["id"], exc)
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
