"""WebSocket API for the Ambience panel."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from .conditions.weather import WEATHER_CONDITIONS
from .const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_PERIODS,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_BUFFER,
    DOMAIN,
    GENERAL_CATEGORY_ID,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)
from .exposed_actions import ExposedActionsStore
from .service import (
    async_apply_scene,
    async_resolve_categories_only,
    async_resolve_only,
    async_run_rule_actions,
)
from .simulate import SimulatedWorld, run_simulation, simulate_inputs
from .sorting import condition_priority, resolve_order, shadowed_by
from .state_options import known_states_for
from .store import CategoryInUseError, LastCategoryError, reassign_orphan_rules
from .trace import buffered_unit_to_dict
from .validators import validate_reapply_seconds

_LOGGER = logging.getLogger(__name__)

_WS_COMMANDS = (
    "ambience/areas/list",
    "ambience/area/get",
    "ambience/area/save",
    "ambience/floors/list",
    "ambience/floor/get",
    "ambience/floor/save",
    "ambience/house/get",
    "ambience/house/save",
    "ambience/conditions/list",
    "ambience/services/list",
    "ambience/services/get_schema",
    "ambience/exposed_actions/list",
    "ambience/exposed_actions/save",
    "ambience/validate",
    "ambience/dry_run",
    "ambience/apply",
    "ambience/rule/run_actions",
    "ambience/time_of_day_periods/list",
    "ambience/time_of_day_periods/save",
    "ambience/time_of_day_periods/reset",
    "ambience/conditions/day/config/list",
    "ambience/conditions/day/config/save",
    "ambience/conditions/weather/config/list",
    "ambience/conditions/weather/config/save",
    "ambience/state/known_states",
    "ambience/switch_defaults/list",
    "ambience/switch_defaults/save",
    "ambience/switches/list",
    "ambience/categories/list",
    "ambience/categories/save",
    "ambience/categories/delete",
    "ambience/traces/list",
    "ambience/traces/clear",
    "ambience/simulate/inputs",
    "ambience/simulate",
)


def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, _ws_areas_list)
    websocket_api.async_register_command(hass, _ws_floors_list)
    websocket_api.async_register_command(hass, _ws_conditions_list)
    websocket_api.async_register_command(hass, _ws_services_list)
    websocket_api.async_register_command(hass, _ws_services_get_schema)
    websocket_api.async_register_command(hass, _ws_exposed_actions_list)
    websocket_api.async_register_command(hass, _ws_exposed_actions_save)
    websocket_api.async_register_command(hass, _ws_area_get)
    websocket_api.async_register_command(hass, _ws_area_save)
    websocket_api.async_register_command(hass, _ws_floor_get)
    websocket_api.async_register_command(hass, _ws_floor_save)
    websocket_api.async_register_command(hass, _ws_house_get)
    websocket_api.async_register_command(hass, _ws_house_save)
    websocket_api.async_register_command(hass, _ws_validate)
    websocket_api.async_register_command(hass, _ws_dry_run)
    websocket_api.async_register_command(hass, _ws_apply)
    websocket_api.async_register_command(hass, _ws_run_rule_actions)
    websocket_api.async_register_command(hass, _ws_periods_list)
    websocket_api.async_register_command(hass, _ws_periods_save)
    websocket_api.async_register_command(hass, _ws_periods_reset)
    websocket_api.async_register_command(hass, _ws_day_config_list)
    websocket_api.async_register_command(hass, _ws_day_config_save)
    websocket_api.async_register_command(hass, _ws_weather_config_list)
    websocket_api.async_register_command(hass, _ws_weather_config_save)
    websocket_api.async_register_command(hass, _ws_state_known_states)
    websocket_api.async_register_command(hass, _ws_switch_defaults_list)
    websocket_api.async_register_command(hass, _ws_switch_defaults_save)
    websocket_api.async_register_command(hass, _ws_switches_list)
    websocket_api.async_register_command(hass, _ws_categories_list)
    websocket_api.async_register_command(hass, _ws_categories_save)
    websocket_api.async_register_command(hass, _ws_categories_delete)
    websocket_api.async_register_command(hass, _ws_traces_list)
    websocket_api.async_register_command(hass, _ws_traces_clear)
    websocket_api.async_register_command(hass, _ws_simulate_inputs)
    websocket_api.async_register_command(hass, _ws_simulate)


def _validate_scope_config(hass: HomeAssistant, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    for rule_idx, rule in enumerate(config.get("rules", [])):
        when = rule.get("when", {})
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key not in conditions_registry:
                raise ValueError(f"rule {rule_idx}: unknown condition {key}")
            conditions_registry[key].validate_predicate(predicate)
        for action_idx, action_spec in enumerate(rule.get("actions", [])):
            service_id = action_spec.get("service")
            if not isinstance(service_id, str) or "." not in service_id:
                raise ValueError(
                    f"rule {rule_idx} action {action_idx}: missing or malformed `service`"
                )
            exposed = exposed_store.get(service_id)
            if exposed is None:
                raise ValueError(
                    f"rule {rule_idx} action {action_idx}: service {service_id!r} not exposed"
                )
            entity_ids = action_spec.get("entity_ids", [])
            if not isinstance(entity_ids, list):
                raise ValueError(f"rule {rule_idx} action {action_idx}: entity_ids must be a list")
            params = action_spec.get("params", {})
            if not isinstance(params, dict):
                raise ValueError(f"rule {rule_idx} action {action_idx}: params must be an object")
            # Note: params keys are NOT whitelisted against visible_fields.
            # A rule may carry extra params for fields that have since been
            # hidden in settings (or were never exposed); they're still sent
            # at execution. The save-time dangling-rule warnings surface this
            # to the user; the engine treats them as overrides.
            # `exposed` is used here only for the existence check above.
            _ = exposed
            if "reapply_seconds" in action_spec:
                validate_reapply_seconds(
                    f"rule {rule_idx} action {action_idx}", action_spec["reapply_seconds"]
                )


def _canonicalise(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, Any]:
    """Resolve rule order + numbers for storage. Strips the transient per-rule
    `shadowed_by` hint so it isn't persisted."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    out = dict(config)
    rules = [{k: v for k, v in r.items() if k != "shadowed_by"} for r in config.get("rules", [])]
    out["rules"] = resolve_order(rules, conditions_registry)
    return out


def _with_shadows(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, Any]:
    """Return a copy whose rules carry a transient `shadowed_by` index (or None).
    Not persisted — only sent to the frontend."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    rules = config.get("rules", [])
    shadows = shadowed_by(rules, conditions_registry)
    return {
        **config,
        "rules": [{**r, "shadowed_by": shadows.get(idx)} for idx, r in enumerate(rules)],
    }


def _coerce_rule_categories(store, config: dict) -> None:
    """Point any rule with no category / an unknown category at General (or, if General
    was deleted, the first existing category), logging once. Mutates `config`. This is
    the single place that enforces the every-rule-has-a-real-category invariant."""
    known = {c["id"] for c in store.categories()}
    target = (
        GENERAL_CATEGORY_ID
        if GENERAL_CATEGORY_ID in known
        else next(iter(known), GENERAL_CATEGORY_ID)
    )
    if reassign_orphan_rules(config.get("rules", []), known, target):
        _LOGGER.warning(
            "ambience: scope save had uncategorised/unknown-category rule(s); set to General"
        )


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
@websocket_api.websocket_command({vol.Required("type"): "ambience/floors/list"})
@websocket_api.async_response
async def _ws_floors_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    floor_reg = fr.async_get(hass)
    result = [
        {"floor_id": entry.floor_id, "name": entry.name}
        for entry in sorted(floor_reg.async_list_floors(), key=lambda f: f.name)
    ]
    connection.send_result(msg["id"], result)


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
@websocket_api.websocket_command({vol.Required("type"): "ambience/services/list"})
@websocket_api.async_response
async def _ws_services_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    from .services_meta import list_services

    connection.send_result(msg["id"], await list_services(hass))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/services/get_schema",
        vol.Required("service"): str,
    }
)
@websocket_api.async_response
async def _ws_services_get_schema(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    from .services_meta import get_service_schema

    try:
        schema = await get_service_schema(hass, msg["service"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    if schema is None:
        connection.send_error(msg["id"], "unknown_service", f"unknown service: {msg['service']!r}")
        return
    connection.send_result(msg["id"], schema)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/exposed_actions/list"})
@websocket_api.async_response
async def _ws_exposed_actions_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store: ExposedActionsStore = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    connection.send_result(msg["id"], store.list())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/exposed_actions/save",
        vol.Required("actions"): list,
    }
)
@websocket_api.async_response
async def _ws_exposed_actions_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    exposed_store: ExposedActionsStore = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    actions = msg["actions"]
    try:
        exposed_store.validate_shape(actions)
        await exposed_store.validate_against_catalog(hass, actions)
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return

    old_list = exposed_store.list()
    old_by_id = {a["id"]: a for a in old_list}
    new_by_id = {a["id"]: a for a in actions}

    await exposed_store.save(actions)

    # Dangling-rule warnings: walk every scope and flag any rule whose
    # action references a removed service or sets a param for a field
    # that is no longer visible.
    store = hass.data[DOMAIN][DATA_STORE]
    warnings: list[dict[str, Any]] = []
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for rule in scope_cfg.get("rules", []):
            for action_spec in rule.get("actions", []):
                sid = action_spec.get("service")
                if not isinstance(sid, str):
                    continue
                old_entry = old_by_id.get(sid)
                new_entry = new_by_id.get(sid)
                if new_entry is None and old_entry is not None:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"rule references {sid!r} which is no longer exposed",
                        }
                    )
                    continue
                if new_entry is None:
                    continue
                exposed_keys = set(new_entry.get("visible_fields", [])) | set(
                    new_entry.get("defaults", {})
                )
                extra = set(action_spec.get("params", {})) - exposed_keys
                if extra:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "rule_name": rule.get("name", ""),
                            "reason": (
                                f"rule sets {sorted(extra)!r} on {sid!r} but those "
                                f"fields are not currently exposed (the rule will "
                                f"still send them at execution)"
                            ),
                        }
                    )

    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


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
    area = store.get_area(area_id) or {"rules": []}
    connection.send_result(msg["id"], _with_shadows(hass, area))


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
        _validate_scope_config(hass, msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    # Coerce categories BEFORE canonicalising so each rule is ordered in its final
    # (post-coercion) category bucket, not a transient unknown/empty one.
    store = hass.data[DOMAIN][DATA_STORE]
    _coerce_rule_categories(store, msg["config"])
    config = _canonicalise(hass, msg["config"])
    await store.async_save_area(area_id, config)
    connection.send_result(msg["id"], {"ok": True, "config": _with_shadows(hass, config)})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/floor/get",
        vol.Required("floor_id"): str,
    }
)
@websocket_api.async_response
async def _ws_floor_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    floor_id = msg["floor_id"]
    if fr.async_get(hass).async_get_floor(floor_id) is None:
        connection.send_error(msg["id"], "unknown_floor", "floor not found")
        return
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = store.get_floor(floor_id) or {"rules": []}
    connection.send_result(msg["id"], _with_shadows(hass, cfg))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/floor/save",
        vol.Required("floor_id"): str,
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def _ws_floor_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    floor_id = msg["floor_id"]
    if fr.async_get(hass).async_get_floor(floor_id) is None:
        connection.send_error(
            msg["id"],
            "validation_error",
            f"unknown floor: {floor_id}",
        )
        return
    try:
        _validate_scope_config(hass, msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    # Coerce categories BEFORE canonicalising so each rule is ordered in its final
    # (post-coercion) category bucket, not a transient unknown/empty one.
    store = hass.data[DOMAIN][DATA_STORE]
    _coerce_rule_categories(store, msg["config"])
    config = _canonicalise(hass, msg["config"])
    await store.async_save_floor(floor_id, config)
    connection.send_result(msg["id"], {"ok": True, "config": _with_shadows(hass, config)})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/house/get"})
@websocket_api.async_response
async def _ws_house_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    house = store.get_house() or {"rules": []}
    connection.send_result(msg["id"], _with_shadows(hass, house))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/house/save",
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def _ws_house_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        _validate_scope_config(hass, msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    # Coerce categories BEFORE canonicalising so each rule is ordered in its final
    # (post-coercion) category bucket, not a transient unknown/empty one.
    store = hass.data[DOMAIN][DATA_STORE]
    _coerce_rule_categories(store, msg["config"])
    config = _canonicalise(hass, msg["config"])
    await store.async_save_house(config)
    connection.send_result(msg["id"], {"ok": True, "config": _with_shadows(hass, config)})


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
        _validate_scope_config(hass, msg["config"])
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], {"ok": True})


def _house_must_be_true(v: Any) -> bool:
    if v is not True:
        raise vol.Invalid("house must be true")
    return v


def _parse_scope(msg: dict[str, Any], command: str) -> tuple[str, str | None]:
    """Map a ws message's scope selector to (scope_kind, scope_id).

    Raises ServiceValidationError (named for `command`, so the client sees which
    request failed) when not exactly one of area_id/floor_id/house is present.
    """
    present = [k for k in ("area_id", "floor_id", "house") if k in msg]
    if len(present) != 1:
        raise ServiceValidationError(
            f"{command} requires exactly one of area_id/floor_id/house, got: {present!r}"
        )
    if "area_id" in msg:
        return "area", msg["area_id"]
    if "floor_id" in msg:
        return "floor", msg["floor_id"]
    return "house", None


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/dry_run",
        vol.Optional("area_id"): str,
        vol.Optional("floor_id"): str,
        vol.Optional("house"): _house_must_be_true,
    }
)
@websocket_api.async_response
async def _ws_dry_run(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        scope_kind, scope_id = _parse_scope(msg, "dry_run")
        result = await async_resolve_only(hass, scope_kind, scope_id)
        result["categories"] = await async_resolve_categories_only(hass, scope_kind, scope_id)
    except ServiceValidationError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/apply",
        vol.Optional("area_id"): str,
        vol.Optional("floor_id"): str,
        vol.Optional("house"): _house_must_be_true,
        vol.Optional("category_id"): str,
    }
)
@websocket_api.async_response
async def _ws_apply(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        scope_kind, scope_id = _parse_scope(msg, "apply")
        await async_apply_scene(
            hass, scope_kind, scope_id, category=msg.get("category_id"), force=True
        )
    except ServiceValidationError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/rule/run_actions",
        vol.Optional("area_id"): str,
        vol.Optional("floor_id"): str,
        vol.Optional("house"): _house_must_be_true,
        vol.Required("rule_index"): int,
    }
)
@websocket_api.async_response
async def _ws_run_rule_actions(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        scope_kind, scope_id = _parse_scope(msg, "run_actions")
        result = await async_run_rule_actions(hass, scope_kind, scope_id, msg["rule_index"])
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
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for rule in scope_cfg.get("rules", []):
            pred = rule.get("when", {}).get("time_of_day")
            for missing in _missing_period_refs(pred, effective_ids):
                warnings.append(
                    {
                        "scope_kind": scope_kind,
                        "scope_id": scope_id,
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
    await store.async_save_condition_config("day", new_cfg)
    warnings = _dangling_day_entity_warnings(hass, new_cfg)
    connection.send_result(msg["id"], {"ok": True, "warnings": warnings})


_SENSOR_DEPENDENT_KINDS = {"workday", "holiday"}
_CALENDAR_DEPENDENT_KINDS = {"first_workday", "last_workday"}


def _dangling_day_entity_warnings(hass: HomeAssistant, cfg: dict[str, Any]) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    sensor_ok = bool(cfg.get("workday_sensor"))
    calendar_ok = bool(cfg.get("workday_calendar"))
    warnings: list[dict[str, Any]] = []
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for rule in scope_cfg.get("rules", []):
            pred = rule.get("when", {}).get("day")
            if not isinstance(pred, dict):
                continue
            for slot in (pred.get("include") or []) + (pred.get("exclude") or []):
                kind = (slot or {}).get("kind")
                if kind in _SENSOR_DEPENDENT_KINDS and not sensor_ok:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_sensor` is unset",
                        }
                    )
                if kind in _CALENDAR_DEPENDENT_KINDS and not calendar_ok:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_calendar` is unset",
                        }
                    )
    return warnings


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
    old_cfg = store.get_condition_config("weather")
    await store.async_save_condition_config("weather", new_cfg)
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
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for rule in scope_cfg.get("rules", []):
            pred = rule.get("when", {}).get("weather")
            if not _weather_predicate_active(pred):
                continue
            if entity_cleared:
                warnings.append(
                    {
                        "scope_kind": scope_kind,
                        "scope_id": scope_id,
                        "rule_name": rule.get("name", ""),
                        "reason": "uses a weather predicate but the weather entity is unset",
                    }
                )
            for gid in pred.get("groups", []):
                if gid in removed_ids:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "rule_name": rule.get("name", ""),
                            "reason": f"references deleted weather group {gid!r}",
                        }
                    )
    return warnings


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
@websocket_api.websocket_command({vol.Required("type"): "ambience/switch_defaults/list"})
@websocket_api.async_response
async def _ws_switch_defaults_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.send_result(msg["id"], hass.data[DOMAIN][DATA_STORE].get_switch_defaults())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/switch_defaults/save",
        vol.Required("name"): str,
        vol.Required("auto_on_delay_seconds"): int,
    }
)
@websocket_api.async_response
async def _ws_switch_defaults_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    try:
        await store.async_save_switch_defaults(
            {"name": msg["name"], "auto_on_delay_seconds": msg["auto_on_delay_seconds"]}
        )
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/switches/list"})
@websocket_api.async_response
async def _ws_switches_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Map each scope to its (possibly renamed) switch entity_id.

    The frontend can't derive the entity_id — the entity registry takes over
    after first registration, so user renames stick. Read it from the live
    switch entities tracked in DATA_SWITCHES.
    """
    switches = hass.data[DOMAIN].get(DATA_SWITCHES, {})
    result = [
        {"scope_kind": kind, "scope_id": scope_id, "entity_id": sw.entity_id}
        for (kind, scope_id), sw in switches.items()
    ]
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/categories/list"})
@websocket_api.async_response
async def _ws_categories_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], {"categories": store.categories()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/categories/save",
        vol.Required("categories"): [
            {
                vol.Required("id"): str,
                vol.Required("name"): str,
                vol.Optional("icon"): vol.Any(str, None),
                vol.Optional("color"): vol.Any(str, None),
            }
        ],
    }
)
@websocket_api.async_response
async def _ws_categories_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    categories = msg["categories"]
    seen_ids: set[str] = set()
    seen_names: set[str] = set()
    for category in categories:
        cid = category.get("id")
        name = category.get("name")
        if not isinstance(cid, str) or not cid.strip():
            connection.send_error(
                msg["id"], "invalid_categories", "category id must be a non-empty string"
            )
            return
        if cid in seen_ids:
            connection.send_error(
                msg["id"], "invalid_categories", f"duplicate category id: {cid!r}"
            )
            return
        seen_ids.add(cid)
        if not isinstance(name, str) or not name.strip():
            connection.send_error(
                msg["id"], "invalid_categories", f"category {cid!r} name must be a non-empty string"
            )
            return
        key = name.strip().casefold()
        if key in seen_names:
            connection.send_error(
                msg["id"], "invalid_categories", f"duplicate category name: {name.strip()!r}"
            )
            return
        seen_names.add(key)
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_categories(categories)
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/categories/delete",
        vol.Required("category_id"): str,
    }
)
@websocket_api.async_response
async def _ws_categories_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    try:
        await store.async_delete_category(msg["category_id"])
    except LastCategoryError as exc:
        connection.send_error(msg["id"], "category_last", str(exc))
        return
    except CategoryInUseError as exc:
        connection.send_error(msg["id"], "category_in_use", str(exc))
        return
    except ValueError as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/traces/list",
        vol.Optional("limit"): vol.All(int, vol.Range(min=1)),
    }
)
@websocket_api.async_response
async def _ws_traces_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    records = buffer.records() if buffer is not None else []
    limit = msg.get("limit")
    if limit is not None:
        records = records[:limit]
    connection.send_result(msg["id"], {"traces": [buffered_unit_to_dict(r) for r in records]})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/traces/clear"})
@websocket_api.async_response
async def _ws_traces_clear(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    if buffer is not None:
        buffer.clear()
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/simulate/inputs",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
    }
)
@websocket_api.async_response
async def _ws_simulate_inputs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The editable inputs for a category's simulator panel (read-only)."""
    try:
        result = await simulate_inputs(
            hass, msg["scope_kind"], msg.get("scope_id"), msg["category"]
        )
    except (ValueError, ServiceValidationError) as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/simulate",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
        vol.Required("now"): str,
        # Each override is {state?: str, attributes?: dict}; require dict values
        # so a malformed payload is rejected at the schema layer, not mid-resolve.
        vol.Optional("overrides", default=dict): {str: dict},
        # Per opaque-condition verdicts: condition_key -> {result_key: bool}.
        vol.Optional("verdicts", default=dict): {str: {str: bool}},
    }
)
@websocket_api.async_response
async def _ws_simulate(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Resolve a category against a hypothetical world (read-only)."""
    now = dt_util.parse_datetime(msg["now"])
    if now is None:
        connection.send_error(msg["id"], "validation_error", f"unparseable now: {msg['now']!r}")
        return
    world = SimulatedWorld(
        now=now,
        overrides=msg.get("overrides") or {},
        verdicts=msg.get("verdicts") or {},
    )
    try:
        result = await run_simulation(
            hass, msg["scope_kind"], msg.get("scope_id"), msg["category"], world
        )
    except (ValueError, ServiceValidationError) as exc:
        connection.send_error(msg["id"], "validation_error", str(exc))
        return
    connection.send_result(msg["id"], {"result": result})


def async_unregister_commands(hass: HomeAssistant) -> None:
    """Remove Ambience WS commands from HA's websocket_api handler registry."""
    handlers = hass.data.get(websocket_api.const.DOMAIN, {})
    for cmd in _WS_COMMANDS:
        handlers.pop(cmd, None)
