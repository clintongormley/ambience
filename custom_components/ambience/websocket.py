"""WebSocket API for the Ambience panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar

from .const import DATA_ACTIONS, DATA_MATCHERS, DATA_PERIODS, DATA_STORE, DOMAIN
from .matchers.weather import WEATHER_CONDITIONS
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
    "ambience/time_of_day_periods/list",
    "ambience/time_of_day_periods/save",
    "ambience/time_of_day_periods/reset",
    "ambience/matchers/enabled/list",
    "ambience/matchers/enabled/save",
    "ambience/matchers/day/config/list",
    "ambience/matchers/day/config/save",
    "ambience/matchers/weather/config/list",
    "ambience/matchers/weather/config/save",
)


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_areas_list)
    websocket_api.async_register_command(hass, _ws_matchers_list)
    websocket_api.async_register_command(hass, _ws_actions_list)
    websocket_api.async_register_command(hass, _ws_area_get)
    websocket_api.async_register_command(hass, _ws_area_save)
    websocket_api.async_register_command(hass, _ws_validate)
    websocket_api.async_register_command(hass, _ws_dry_run)
    websocket_api.async_register_command(hass, _ws_periods_list)
    websocket_api.async_register_command(hass, _ws_periods_save)
    websocket_api.async_register_command(hass, _ws_periods_reset)
    websocket_api.async_register_command(hass, _ws_enabled_matchers_list)
    websocket_api.async_register_command(hass, _ws_enabled_matchers_save)
    websocket_api.async_register_command(hass, _ws_day_config_list)
    websocket_api.async_register_command(hass, _ws_day_config_save)
    websocket_api.async_register_command(hass, _ws_weather_config_list)
    websocket_api.async_register_command(hass, _ws_weather_config_save)


def _validate_area_config(hass: HomeAssistant, area_id: str, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    config.pop("matchers", None)  # legacy field; dropped silently
    store = hass.data[DOMAIN][DATA_STORE]
    enabled = set(store.enabled_matchers())
    matchers_registry = hass.data[DOMAIN][DATA_MATCHERS]
    actions_registry = hass.data[DOMAIN][DATA_ACTIONS]
    for rule_idx, rule in enumerate(config.get("rules", [])):
        when = rule.get("when", {})
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key == "scene":
                matchers_registry["scene"].validate_predicate(predicate)
                continue
            if key not in matchers_registry:
                raise ValueError(f"rule {rule_idx}: unknown matcher {key}")
            if key not in enabled:
                raise ValueError(f"rule {rule_idx}: predicate references disabled matcher {key}")
            matchers_registry[key].validate_predicate(predicate)
        for action_idx, action_spec in enumerate(rule.get("actions", [])):
            action_name = action_spec.get("action")
            action = actions_registry.get(action_name)
            if action is None:
                raise ValueError(
                    f"rule {rule_idx} action {action_idx}: unknown action {action_name}"
                )
            entity_ids = action_spec.get("entity_ids", [])
            params = action_spec.get("params", {})
            action.validate_target_params(entity_ids, params)


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


def _missing_period_refs(predicate: Any, effective_ids: set[str]) -> list[str]:
    """Return a list of period ids referenced by predicate that are not in effective_ids."""
    if predicate is None:
        return []
    if isinstance(predicate, list):
        result: list[str] = []
        for item in predicate:
            result.extend(_missing_period_refs(item, effective_ids))
        return result
    if isinstance(predicate, dict) and "period" in predicate:
        pid = predicate["period"]
        if isinstance(pid, str) and pid not in effective_ids:
            return [pid]
    return []


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
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return

    # Walk every persisted rule and collect dangling-period warnings.
    store = hass.data[DOMAIN][DATA_STORE]
    effective_ids = set(period_store.effective())
    warnings: list[dict[str, Any]] = []
    for area_id, area_cfg in store.areas().items():
        for rule in area_cfg.get("rules", []):
            pred = rule.get("when", {}).get("time_of_day")
            for missing in _missing_period_refs(pred, effective_ids):
                warnings.append(
                    {
                        "area_id": area_id,
                        "rule_name": rule.get("name", ""),
                        "missing_period": missing,
                    }
                )

    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


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
@websocket_api.websocket_command({vol.Required("type"): "ambience/matchers/enabled/list"})
@websocket_api.async_response
async def _ws_enabled_matchers_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], {"enabled": store.enabled_matchers()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/matchers/enabled/save",
        vol.Required("enabled"): list,
    }
)
@websocket_api.async_response
async def _ws_enabled_matchers_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    registry = hass.data[DOMAIN][DATA_MATCHERS]
    enabled = msg["enabled"]
    for name in enabled:
        if name == "scene":
            connection.send_error(
                msg["id"],
                "validation_error",
                "`scene` is always on; do not list it",
            )
            return
        matcher = registry.get(name)
        if matcher is None:
            connection.send_error(msg["id"], "validation_error", f"unknown matcher: {name}")
            return
        if not getattr(matcher, "toggleable", True):
            connection.send_error(
                msg["id"],
                "validation_error",
                f"matcher is not toggleable: {name}",
            )
            return
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_enabled_matchers(list(enabled))
    warnings = _dangling_matcher_warnings(hass, set(enabled))
    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


def _dangling_matcher_warnings(hass: HomeAssistant, enabled: set[str]) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    warnings: list[dict[str, Any]] = []
    for area_id, cfg in store.areas().items():
        for rule in cfg.get("rules", []):
            for matcher_name, pred in rule.get("when", {}).items():
                if matcher_name == "scene" or pred is None:
                    continue
                if matcher_name not in enabled:
                    warnings.append(
                        {
                            "area_id": area_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"references disabled matcher `{matcher_name}`",
                        }
                    )
    return warnings


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/matchers/day/config/list"})
@websocket_api.async_response
async def _ws_day_config_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], store.get_matcher_config("day"))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/matchers/day/config/save",
        vol.Optional("workday_sensor"): vol.Any(str, None),
        vol.Optional("workday_calendar"): vol.Any(str, None),
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
    await store.async_save_matcher_config("day", new_cfg)
    warnings = _dangling_day_entity_warnings(hass, new_cfg)
    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


_SENSOR_DEPENDENT_KINDS = {"workday", "holiday"}
_CALENDAR_DEPENDENT_KINDS = {"first_workday", "last_workday"}


def _dangling_day_entity_warnings(hass: HomeAssistant, cfg: dict[str, Any]) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    sensor_ok = bool(cfg.get("workday_sensor"))
    calendar_ok = bool(cfg.get("workday_calendar"))
    warnings: list[dict[str, Any]] = []
    for area_id, area_cfg in store.areas().items():
        for rule in area_cfg.get("rules", []):
            pred = rule.get("when", {}).get("day")
            if not isinstance(pred, dict):
                continue
            for slot in (pred.get("include") or []) + (pred.get("exclude") or []):
                kind = (slot or {}).get("kind")
                if kind in _SENSOR_DEPENDENT_KINDS and not sensor_ok:
                    warnings.append(
                        {
                            "area_id": area_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_sensor` is unset",
                        }
                    )
                if kind in _CALENDAR_DEPENDENT_KINDS and not calendar_ok:
                    warnings.append(
                        {
                            "area_id": area_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_calendar` is unset",
                        }
                    )
    return warnings


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/matchers/weather/config/list"})
@websocket_api.async_response
async def _ws_weather_config_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], store.get_matcher_config("weather"))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/matchers/weather/config/save",
        vol.Optional("entity"): vol.Any(str, None),
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
        groups = _validate_weather_groups(msg.get("groups"))
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    new_cfg = {"entity": msg.get("entity"), "groups": groups}
    store = hass.data[DOMAIN][DATA_STORE]
    old_cfg = store.get_matcher_config("weather")
    await store.async_save_matcher_config("weather", new_cfg)
    warnings = _dangling_weather_warnings(hass, old_cfg, new_cfg)
    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


def _validate_weather_groups(groups: Any) -> list[dict[str, Any]]:
    if groups is None:
        return []
    if not isinstance(groups, list):
        raise ValueError("groups must be a list")
    seen_ids: set[str] = set()
    valid_conditions = set(WEATHER_CONDITIONS)
    cleaned: list[dict[str, Any]] = []
    for raw in groups:
        if not isinstance(raw, dict):
            raise ValueError("each group must be an object")
        gid = raw.get("id")
        label = raw.get("label")
        conds = raw.get("conditions")
        if not isinstance(gid, str) or not gid:
            raise ValueError(f"group id must be a non-empty string: {gid!r}")
        if gid in seen_ids:
            raise ValueError(f"duplicate group id: {gid!r}")
        seen_ids.add(gid)
        if not isinstance(label, str) or not label:
            raise ValueError(f"group {gid!r} label must be a non-empty string")
        if not isinstance(conds, list) or any(
            not isinstance(c, str) or c not in valid_conditions for c in conds
        ):
            raise ValueError(f"group {gid!r} has invalid condition(s)")
        cleaned.append({"id": gid, "label": label, "conditions": list(conds)})
    return cleaned


def _weather_predicate_active(pred: Any) -> bool:
    return isinstance(pred, dict) and bool(pred.get("groups") or pred.get("thresholds"))


def _dangling_weather_warnings(
    hass: HomeAssistant,
    old_cfg: dict[str, Any],
    new_cfg: dict[str, Any],
) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    new_ids = {g["id"] for g in (new_cfg.get("groups") or [])}
    old_ids = {g["id"] for g in (old_cfg.get("groups") or [])}
    removed_ids = old_ids - new_ids
    entity_cleared = not new_cfg.get("entity")

    warnings: list[dict[str, Any]] = []
    for area_id, area_cfg in store.areas().items():
        for rule in area_cfg.get("rules", []):
            pred = rule.get("when", {}).get("weather")
            if not _weather_predicate_active(pred):
                continue
            if entity_cleared:
                warnings.append(
                    {
                        "area_id": area_id,
                        "rule_name": rule.get("name", ""),
                        "reason": "uses a weather predicate but the weather entity is unset",
                    }
                )
            for gid in pred.get("groups", []):
                if gid in removed_ids:
                    warnings.append(
                        {
                            "area_id": area_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"references deleted weather group {gid!r}",
                        }
                    )
    return warnings


def async_unregister_commands(hass: HomeAssistant) -> None:
    """Remove Ambience WS commands from HA's websocket_api handler registry."""
    handlers = hass.data.get(websocket_api.const.DOMAIN, {})
    for cmd in _WS_COMMANDS:
        handlers.pop(cmd, None)
