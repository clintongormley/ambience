"""WebSocket API for the Ambience panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DATA_ACTIONS, DATA_MATCHERS, DATA_STORE, DOMAIN


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_areas_list)
    websocket_api.async_register_command(hass, _ws_matchers_list)
    websocket_api.async_register_command(hass, _ws_actions_list)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/areas/list"})
@websocket_api.async_response
async def _ws_areas_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    result = [{"area_id": aid, "name": cfg.get("name", aid)} for aid, cfg in store.areas().items()]
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/matchers/list"})
@websocket_api.async_response
async def _ws_matchers_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    matchers = hass.data[DOMAIN][DATA_MATCHERS]
    result = [{"name": name} for name in matchers]
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/actions/list"})
@websocket_api.async_response
async def _ws_actions_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    actions = hass.data[DOMAIN][DATA_ACTIONS]
    result = [{"name": a.name, "domains": list(a.domains)} for a in actions.values()]
    connection.send_result(msg["id"], result)
