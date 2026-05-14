"""WebSocket API for the Ambience panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar

from .const import DATA_ACTIONS, DATA_MATCHERS, DATA_STORE, DOMAIN
from .service import async_resolve_only
from .sorting import sort_rules

_WS_COMMANDS = (
    "ambience/areas/list",
    "ambience/area/get",
    "ambience/area/save",
    "ambience/matchers/list",
    "ambience/actions/list",
    "ambience/validate",
    "ambience/dry_run",
)


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_areas_list)
    websocket_api.async_register_command(hass, _ws_matchers_list)
    websocket_api.async_register_command(hass, _ws_actions_list)
    websocket_api.async_register_command(hass, _ws_area_get)
    websocket_api.async_register_command(hass, _ws_area_save)
    websocket_api.async_register_command(hass, _ws_validate)
    websocket_api.async_register_command(hass, _ws_dry_run)


def _validate_area_config(hass: HomeAssistant, area_id: str, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    active_matcher_names: list[str] = list(config.get("matchers", []))
    if "scene" in active_matcher_names:
        raise ValueError("`scene` is always-on and must not be listed in matchers")
    matchers_registry = hass.data[DOMAIN][DATA_MATCHERS]
    actions_registry = hass.data[DOMAIN][DATA_ACTIONS]
    for name in active_matcher_names:
        if name not in matchers_registry:
            raise ValueError(f"unknown matcher: {name}")
    for rule_idx, rule in enumerate(config.get("rules", [])):
        when = rule.get("when", {})
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key == "scene":
                # `scene` is an always-on matcher, never listed in `matchers`.
                matchers_registry["scene"].validate_predicate(predicate)
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
    area_reg = ar.async_get(hass)
    result = [
        {"area_id": entry.id, "name": entry.name}
        for entry in sorted(area_reg.async_list_areas(), key=lambda a: a.name)
    ]
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
    result = [
        {
            "name": m.name,
            "description": m.description,
            "predicate_help": m.predicate_help,
            "toggleable": getattr(m, "toggleable", True),
            "input": getattr(m, "input", "text"),
            "priority": getattr(m, "priority", 1000),
        }
        for m in matchers.values()
    ]
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
    result = [
        {
            "name": a.name,
            "description": a.description,
            "domains": list(a.domains),
            "target_params": a.target_params,
        }
        for a in actions.values()
    ]
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
    area_id = msg["area_id"]
    if ar.async_get(hass).async_get_area(area_id) is None:
        connection.send_error(msg["id"], "unknown_area", "area not found")
        return
    store = hass.data[DOMAIN][DATA_STORE]
    area = store.get_area(area_id) or {"matchers": [], "rules": [], "auto_sort": True}
    connection.send_result(msg["id"], area)


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
    area_id = msg["area_id"]
    if ar.async_get(hass).async_get_area(area_id) is None:
        connection.send_error(
            msg["id"],
            "validation_error",
            f"unknown area: {area_id}",
        )
        return
    try:
        _validate_area_config(hass, area_id, msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    config = msg["config"]
    if config.get("auto_sort", True):
        matchers_registry = hass.data[DOMAIN][DATA_MATCHERS]
        config = {
            **config,
            "rules": sort_rules(config.get("rules", []), matchers_registry),
        }
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(area_id, config)
    connection.send_result(msg["id"], {"ok": True, "config": config})


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


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/dry_run",
        vol.Required("area_id"): str,
        vol.Required("scene"): str,
    }
)
@websocket_api.async_response
async def _ws_dry_run(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        result = await async_resolve_only(hass, msg["area_id"], msg["scene"])
    except ServiceValidationError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], result)


def async_unregister_commands(hass: HomeAssistant) -> None:
    """Remove Ambience WS commands from HA's websocket_api handler registry."""
    handlers = hass.data.get(websocket_api.const.DOMAIN, {})
    for cmd in _WS_COMMANDS:
        handlers.pop(cmd, None)
