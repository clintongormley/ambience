"""WebSocket API for the Ambience panel."""

from __future__ import annotations

import copy
import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.util import dt as dt_util

from .const import (
    ASSISTANT_FIELDS,
    DATA_CONDITIONS,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_HISTORY,
    DATA_LUX_RANGES,
    DATA_PERIODS,
    DATA_STORE,
    DATA_SWITCHES,
    DATA_TRACE_BUFFER,
    DOMAIN,
    SIGNAL_EXPOSED_ASSISTANTS_UPDATED,
    SIGNAL_HISTORY_CHANGED,
    SIGNAL_REAPPLY_CONFIG_UPDATED,
    SIGNAL_SWITCH_CONFIG_UPDATED,
    SIGNAL_UNIT_LIVE,
)
from .diagnostics import scope_diagnostics
from .errors import AmbienceError, render_en, service_validation_error
from .exposed_actions import ExposedActionsStore
from .scope_triggers import scope_trigger_spec, trigger_descriptors
from .service import (
    all_live_states,
    async_apply_scene,
    async_resolve_categories_only,
    async_resolve_only,
    async_run_scene_actions,
    async_snapshot_all,
    category_config,
    live_state,
)
from .simulate import SimulatedWorld, run_simulation, simulate_inputs
from .sorting import condition_priority
from .state_options import known_attribute_values_for, known_states_for
from .store import CategoryInUseError, LastCategoryError
from .trace import buffered_unit_to_dict
from .websocket_helpers import (
    annotate_scenes,
    canonicalise,
    coerce_scene_categories,
    validate_scope_config,
    validate_weather_groups,
)

_LOGGER = logging.getLogger(__name__)

# Upper bound on simulate `overrides`/`verdicts` entries. The simulator UI only
# tweaks a handful of inputs; this cap stops a malformed/abusive admin request
# from materialising an unbounded number of State objects on the event loop.
MAX_SIMULATE_ENTRIES = 1000


def send_ambience_error(
    connection: websocket_api.ActiveConnection,
    msg_id: int,
    err: Exception,
    *,
    code: str = "validation_error",
) -> None:
    """Send a websocket error for a handler exception (the single chokepoint).

    - An Ambience ``HomeAssistantError`` (``AmbienceError`` / a
      ``translation_domain == DOMAIN`` error) with a ``translation_key``
      -> a localizable error payload carrying ``translation_key`` +
      ``translation_placeholders`` (plus the English message via ``render_en``
      for fallback/logging). Built with ``send_message`` so the extra fields ride
      on the error object — ``connection.send_error`` cannot carry them.
    - ``ValueError``, or a ``HomeAssistantError`` without a ``translation_key`` or
      from a different ``translation_domain`` (e.g. an HA-core error) ->
      ``connection.send_error(code, str(err))`` — its real message; the generic
      ``unexpected_error`` is reserved for non-HomeAssistantError/non-ValueError
      exceptions (real bugs).
    - Anything else -> log with traceback + a generic ``unexpected_error`` (the
      internal detail is never leaked to the user).
    """
    if (
        isinstance(err, HomeAssistantError)
        and getattr(err, "translation_key", None)
        and getattr(err, "translation_domain", None) == DOMAIN
    ):
        key = err.translation_key
        ph = getattr(err, "translation_placeholders", {}) or {}
        connection.send_message(
            websocket_api.error_message(
                msg_id,
                code,
                render_en(key, ph),
                translation_key=key,
                translation_domain=DOMAIN,
                translation_placeholders=ph,
            )
        )
        return
    if isinstance(err, (HomeAssistantError, ValueError)):
        connection.send_error(msg_id, code, str(err))
        return
    _LOGGER.exception("ambience websocket handler error", exc_info=err)
    # Carry the translation_key so a non-English user sees their localized
    # "unexpected error" (es.json has it); the internal detail is never leaked.
    connection.send_message(
        websocket_api.error_message(
            msg_id,
            "unexpected_error",
            render_en("unexpected_error", {}),
            translation_key="unexpected_error",
            translation_domain=DOMAIN,
            translation_placeholders={},
        )
    )


def async_register_commands(hass: HomeAssistant) -> None:
    """Register every Ambience ws command (see _WS_HANDLERS at module bottom)."""
    for handler in _WS_HANDLERS:
        websocket_api.async_register_command(hass, handler)


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
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    if schema is None:
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unknown_service", service=msg["service"]),
            code="unknown_service",
        )
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
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return

    await exposed_store.save(actions)

    connection.send_result(msg["id"], {"ok": True})


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
        send_ambience_error(
            connection, msg["id"], AmbienceError("area_not_found"), code="unknown_area"
        )
        return
    store = hass.data[DOMAIN][DATA_STORE]
    area = store.get_area(area_id) or {"scenes": []}
    connection.send_result(msg["id"], annotate_scenes(hass, area))


async def _save_scope(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scope_kind: str,
    scope_id: str | None,
    save_fn: Any,
) -> None:
    """The shared validate → coerce → canonicalise → save → respond pipeline
    behind the three scope-save commands (the caller has already verified the
    scope exists in the relevant registry). `save_fn(store, config)` persists.
    Records the change in the undo history (a snapshot before + after the save)."""
    try:
        validate_scope_config(hass, msg["config"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    # Coerce categories BEFORE canonicalising so each scene is ordered in its final
    # (post-coercion) category bucket, not a transient unknown/empty one.
    store = hass.data[DOMAIN][DATA_STORE]
    coerce_scene_categories(store, msg["config"])
    config = canonicalise(hass, msg["config"])
    before = copy.deepcopy(store.scope_config(scope_kind, scope_id))
    await save_fn(store, config)
    after = copy.deepcopy(store.scope_config(scope_kind, scope_id))
    history = hass.data[DOMAIN][DATA_HISTORY]
    change = msg.get("change") or {"action": "edit", "scene_name": None}
    if history.record(scope_kind, scope_id, before, after, change):
        history.notify_changed("record", scope_kind, scope_id)
    # Recompute the overlap set so the save response reflects the just-saved config
    # rather than a cached set; the get path reads the cache.
    connection.send_result(
        msg["id"], {"ok": True, "config": annotate_scenes(hass, config, fresh_overlap=True)}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/area/save",
        vol.Required("area_id"): str,
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
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
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unknown_area", scope_id=area_id),
            code="validation_error",
        )
        return
    await _save_scope(
        hass,
        connection,
        msg,
        "area",
        area_id,
        lambda store, cfg: store.async_save_area(area_id, cfg),
    )


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
        send_ambience_error(
            connection, msg["id"], AmbienceError("floor_not_found"), code="unknown_floor"
        )
        return
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = store.get_floor(floor_id) or {"scenes": []}
    connection.send_result(msg["id"], annotate_scenes(hass, cfg))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/floor/save",
        vol.Required("floor_id"): str,
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
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
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unknown_floor", scope_id=floor_id),
            code="validation_error",
        )
        return
    await _save_scope(
        hass,
        connection,
        msg,
        "floor",
        floor_id,
        lambda store, cfg: store.async_save_floor(floor_id, cfg),
    )


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/house/get"})
@websocket_api.async_response
async def _ws_house_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    house = store.get_house() or {"scenes": []}
    connection.send_result(msg["id"], annotate_scenes(hass, house))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/house/save",
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
    }
)
@websocket_api.async_response
async def _ws_house_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    await _save_scope(
        hass,
        connection,
        msg,
        "house",
        None,
        lambda store, cfg: store.async_save_house(cfg),
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/auto_triggers/list",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Optional("category"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def _ws_auto_triggers_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Read-only list of the watches the engine derives from a scope's scenes.

    Triggers are computed live from the scope's scenes (each condition's
    ``trigger_deps``) — entities, clock times, sun events, and date rollover.
    Purely informational: there are no enable/disable
    controls (auto-triggers are always on).
    """
    store = hass.data[DOMAIN][DATA_STORE]
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    try:
        cfg = store.scope_config(msg["scope_kind"], msg.get("scope_id"))
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    category = msg.get("category")
    if category is not None:
        cfg = category_config(cfg, category)
    spec = scope_trigger_spec(conditions, cfg)
    triggers = trigger_descriptors(spec)
    connection.send_result(msg["id"], {"triggers": triggers, "opaque": spec.opaque})


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
        validate_scope_config(hass, msg["config"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    connection.send_result(msg["id"], {"ok": True})


def _house_must_be_true(v: Any) -> bool:
    if v is not True:
        # i18n: voluptuous schema validator — English-only (framework layer)
        raise vol.Invalid("house must be true")
    return v


def _parse_scope(msg: dict[str, Any], command: str) -> tuple[str, str | None]:
    """Map a ws message's scope selector to (scope_kind, scope_id).

    Raises ServiceValidationError (named for `command`, so the client sees which
    request failed) when not exactly one of area_id/floor_id/house is present.
    """
    present = [k for k in ("area_id", "floor_id", "house") if k in msg]
    if len(present) != 1:
        raise service_validation_error(
            "scope_selector_invalid", command=command, present=", ".join(present) or "(none)"
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
        # One snapshot sweep feeds both views — a second pass would re-run
        # state scans / script calls / template renders and could disagree
        # with the first within the same response.
        snapshots = await async_snapshot_all(hass)
        result = await async_resolve_only(hass, scope_kind, scope_id, snapshots=snapshots)
        result["categories"] = await async_resolve_categories_only(
            hass, scope_kind, scope_id, snapshots=snapshots
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
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
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/scene/run_actions",
        vol.Optional("area_id"): str,
        vol.Optional("floor_id"): str,
        vol.Optional("house"): _house_must_be_true,
        vol.Required("scene_index"): int,
    }
)
@websocket_api.async_response
async def _ws_run_scene_actions(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        scope_kind, scope_id = _parse_scope(msg, "run_actions")
        result = await async_run_scene_actions(hass, scope_kind, scope_id, msg["scene_index"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
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
        vol.Required("create_switches"): bool,
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
            {
                "name": msg["name"],
                "auto_on_delay_seconds": msg["auto_on_delay_seconds"],
                "create_switches": msg["create_switches"],
            }
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/reapply/list"})
@websocket_api.async_response
async def _ws_reapply_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.send_result(msg["id"], hass.data[DOMAIN][DATA_STORE].get_reapply_settings())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/reapply/save",
        vol.Required("enabled"): bool,
        vol.Required("interval_seconds"): int,
    }
)
@websocket_api.async_response
async def _ws_reapply_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    try:
        await store.async_save_reapply_settings(
            {"enabled": msg["enabled"], "interval_seconds": msg["interval_seconds"]}
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    async_dispatcher_send(hass, SIGNAL_REAPPLY_CONFIG_UPDATED, None)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/exposed_assistants/list"})
@websocket_api.async_response
async def _ws_exposed_assistants_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    exposed = hass.data[DOMAIN][DATA_STORE].get_exposed_assistants()
    # get_exposed_assistants() returns a complete bool map over every assistant,
    # so a plain lookup is safe — no re-cast/fallback needed (matches the
    # zero-processing of _ws_switch_defaults_list / _ws_reapply_list).
    connection.send_result(
        msg["id"],
        {field: exposed[assistant] for assistant, field in ASSISTANT_FIELDS.items()},
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/exposed_assistants/save",
        vol.Required("expose_assist"): bool,
        vol.Required("expose_google"): bool,
        vol.Required("expose_alexa"): bool,
    }
)
@websocket_api.async_response
async def _ws_exposed_assistants_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    # The schema only permits the three known bool fields, so the store's
    # validation can't reject this payload — no try/except (an unreachable
    # branch would fail the coverage gate; store validation is tested directly).
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_exposed_assistants(
        {assistant: msg[field] for assistant, field in ASSISTANT_FIELDS.items()}
    )
    async_dispatcher_send(hass, SIGNAL_EXPOSED_ASSISTANTS_UPDATED, None)
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
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/set_scope_enabled",
        vol.Optional("area_id"): str,
        vol.Optional("floor_id"): str,
        vol.Optional("house"): _house_must_be_true,
        vol.Required("enabled"): bool,
    }
)
@websocket_api.async_response
async def _ws_set_scope_enabled(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        scope_kind, scope_id = _parse_scope(msg, "set_scope_enabled")
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    # Validate the id against the registry (like the save handlers): the store
    # setdefaults a scope bucket, so a typo'd/stale id would persist junk.
    if scope_kind == "area" and ar.async_get(hass).async_get_area(scope_id) is None:
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unknown_area", scope_id=scope_id),
            code="validation_error",
        )
        return
    if scope_kind == "floor" and fr.async_get(hass).async_get_floor(scope_id) is None:
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unknown_floor", scope_id=scope_id),
            code="validation_error",
        )
        return
    enabled = msg["enabled"]
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled(scope_kind, scope_id, enabled)

    # A scope's switch follows its enabled-ness (when create_switches is on):
    # enabling (re)creates it, disabling deletes it and its device. Fire the
    # switch-config signal so the switch platform's reconcile — the single source
    # of truth for which switches exist — applies the change, rather than
    # duplicating per-scope create/remove logic here.
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    # Re-enabling resyncs the scope (mirrors switch turn-on's force resync). Re-arm
    # the scope's `for:` rechecks too — a duration timer that matured while the
    # scope was disabled was consumed as a no-op, so without this a "switch on for
    # 2h" rule whose timer elapsed during the disabled window would never fire.
    if enabled:
        hass.data[DOMAIN][DATA_ENGINE].rearm_scope_rechecks(scope_kind, scope_id)
        await async_apply_scene(hass, scope_kind, scope_id)

    connection.send_result(msg["id"], {"ok": True})


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
    store = hass.data[DOMAIN][DATA_STORE]
    seen_ids: set[str] = set()
    seen_names: set[str] = set()
    for category in categories:
        cid = category.get("id")
        name = category.get("name")
        if not isinstance(cid, str) or not cid.strip():
            send_ambience_error(
                connection, msg["id"], AmbienceError("category_id_empty"), code="invalid_categories"
            )
            return
        if cid in seen_ids:
            send_ambience_error(
                connection,
                msg["id"],
                AmbienceError("duplicate_category_id", cid=cid),
                code="invalid_categories",
            )
            return
        seen_ids.add(cid)
        if not isinstance(name, str) or not name.strip():
            send_ambience_error(
                connection,
                msg["id"],
                AmbienceError("category_name_empty", cid=cid),
                code="invalid_categories",
            )
            return
        key = name.strip().casefold()
        if key in seen_names:
            send_ambience_error(
                connection,
                msg["id"],
                AmbienceError("duplicate_category_name", name=name.strip()),
                code="invalid_categories",
            )
            return
        seen_names.add(key)
    # The store owns the last-category / in-use invariants (shared with the
    # delete path) — map its typed errors like _ws_categories_delete does.
    try:
        await store.async_save_categories(categories)
    except LastCategoryError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_last")
        return
    except CategoryInUseError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_in_use")
        return
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
        send_ambience_error(connection, msg["id"], exc, code="category_last")
        return
    except CategoryInUseError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_in_use")
        return
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/history/subscribe"})
@websocket_api.async_response
async def _ws_history_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Stream the undo/redo snapshot: the current state, then on each change."""
    history = hass.data[DOMAIN][DATA_HISTORY]

    @callback
    def _forward(payload: tuple[str, str, str | None]) -> None:
        op, kind, sid = payload
        connection.send_message(
            websocket_api.event_message(
                msg["id"], history.snapshot(op=op, changed_scope=(kind, sid))
            )
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_HISTORY_CHANGED, _forward
    )
    connection.send_result(msg["id"])
    connection.send_message(websocket_api.event_message(msg["id"], history.snapshot()))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/live/subscribe"})
@websocket_api.async_response
async def _ws_live_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Stream per-unit live state: a snapshot, then a delta on each change."""

    @callback
    def _forward(unit: tuple[str, str | None, str]) -> None:
        kind, sid, cat = unit
        matched, applied = live_state(hass, kind, sid, cat)
        connection.send_message(
            websocket_api.event_message(
                msg["id"],
                {
                    "type": "update",
                    "scope_kind": kind,
                    "scope_id": sid,
                    "category": cat,
                    "matched": matched,
                    "applied": applied,
                },
            )
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UNIT_LIVE, _forward)
    connection.send_result(msg["id"])
    connection.send_message(
        websocket_api.event_message(msg["id"], {"type": "snapshot", "units": all_live_states(hass)})
    )


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
        vol.Required("type"): "ambience/diagnostics/scope",
        vol.Required("scope_kind"): str,
        vol.Optional("scope_id"): vol.Any(str, None),
        vol.Required("category"): str,
    }
)
@websocket_api.async_response
async def _ws_scope_diagnostics(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        result = scope_diagnostics(hass, msg["scope_kind"], msg.get("scope_id"), msg["category"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    connection.send_result(msg["id"], result)


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
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
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
        # Each override is {state?: str, attributes?: dict, for?: dict}, keyed
        # by a valid entity_id — rejected at the schema layer, not mid-resolve
        # (a bad key/state would otherwise raise inside State()).
        # Length-capped so an oversized map can't stall the event loop.
        vol.Optional("overrides", default=dict): vol.All(
            {
                cv.entity_id: {
                    vol.Optional("state"): str,
                    vol.Optional("attributes"): dict,
                    vol.Optional("for"): dict,
                }
            },
            vol.Length(max=MAX_SIMULATE_ENTRIES),
        ),
        # Per opaque-condition verdicts: condition_key -> {result_key: bool}.
        vol.Optional("verdicts", default=dict): vol.All(
            {str: {str: bool}}, vol.Length(max=MAX_SIMULATE_ENTRIES)
        ),
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
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("unparseable_now", now=msg["now"]),
            code="validation_error",
        )
        return
    if now.tzinfo is None:
        # A naive now produces naive-vs-aware TypeErrors inside condition
        # snapshots, which silently distort results (per-condition None).
        send_ambience_error(
            connection,
            msg["id"],
            AmbienceError("now_not_timezone_aware", now=msg["now"]),
            code="validation_error",
        )
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
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="validation_error")
        return
    connection.send_result(msg["id"], {"result": result})


def async_unregister_commands(hass: HomeAssistant) -> None:
    """Remove Ambience WS commands from HA's websocket_api handler registry."""
    handlers = hass.data.get(websocket_api.const.DOMAIN, {})
    for handler in _WS_HANDLERS:
        handlers.pop(handler._ws_command, None)  # noqa: SLF001 — set by @websocket_command


# The single registration table — register and unregister both derive from it
# (each handler carries its command string as `_ws_command`), so the two can't
# drift. Defined last so every handler above is in scope.
_WS_HANDLERS = (
    _ws_areas_list,
    _ws_floors_list,
    _ws_conditions_list,
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
    _ws_live_subscribe,
    _ws_scope_diagnostics,
    _ws_simulate_inputs,
    _ws_simulate,
)
