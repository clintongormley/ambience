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
    websocket_api.async_register_command(hass, _ws_area_get)
    websocket_api.async_register_command(hass, _ws_area_save)
    websocket_api.async_register_command(hass, _ws_area_delete)
    websocket_api.async_register_command(hass, _ws_validate)


def _validate_area_config(hass: HomeAssistant, area_id: str, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    scenes = config.get("scenes", [])
    if not isinstance(scenes, list):
        raise ValueError("scenes must be a list")
    if len(scenes) != len(set(scenes)):
        raise ValueError("duplicate scene names")
    active_matcher_names: list[str] = list(config.get("matchers", []))
    matchers_registry = hass.data[DOMAIN][DATA_MATCHERS]
    actions_registry = hass.data[DOMAIN][DATA_ACTIONS]
    for name in active_matcher_names:
        if name not in matchers_registry:
            raise ValueError(f"unknown matcher: {name}")
    for rule_idx, rule in enumerate(config.get("rules", [])):
        when = rule.get("when", {})
        for key, predicate in when.items():
            if key == "scene" or predicate is None:
                continue
            if key not in active_matcher_names:
                raise ValueError(f"rule {rule_idx}: predicate references unselected matcher {key}")
            matchers_registry[key].validate_predicate(predicate)
        for action_idx, action_spec in enumerate(rule.get("actions", [])):
            action_name = action_spec.get("action")
            action = actions_registry.get(action_name)
            if action is None:
                raise ValueError(
                    f"rule {rule_idx} action {action_idx}: unknown action {action_name}"
                )
            for entity_id, params in action_spec.get("targets", {}).items():
                action.validate_target_params(entity_id, params)


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


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/area/get",
        vol.Required("area_id"): str,
    }
)
@websocket_api.async_response
async def _ws_area_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    area = store.get_area(msg["area_id"])
    if area is None:
        connection.send_error(msg["id"], "unknown_area", "area not found")
        return
    connection.send_result(msg["id"], area)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/area/delete",
        vol.Required("area_id"): str,
    }
)
@websocket_api.async_response
async def _ws_area_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_delete_area(msg["area_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/area/save",
        vol.Required("area_id"): str,
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def _ws_area_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        _validate_area_config(hass, msg["area_id"], msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(msg["area_id"], msg["config"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/validate",
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def _ws_validate(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        _validate_area_config(hass, area_id="_", config=msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], {"ok": True})
