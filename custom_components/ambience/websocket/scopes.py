"""WebSocket commands that read or write a scope: the area/floor/house configs
plus the scope-wide settings (switches, re-apply, exposed assistants)."""

from __future__ import annotations

import copy
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_send

from ..const import (
    ASSISTANT_FIELDS,
    DATA_CONDITIONS,
    DATA_HISTORY,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    SIGNAL_EXPOSED_ASSISTANTS_UPDATED,
    SIGNAL_REAPPLY_CONFIG_UPDATED,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)
from ..redact import redact_plan
from ..scope_triggers import scope_trigger_spec, trigger_descriptors
from ..service import (
    async_apply_scene,
    async_resolve_categories_only,
    async_resolve_only,
    async_run_scene_actions,
    async_snapshot_all,
    category_config,
)
from ..websocket_helpers import (
    annotate_scenes,
    canonicalise,
    coerce_scene_categories,
    validate_scope_config,
)
from .common import _SCOPE_SELECTOR_SCHEMA, _parse_scope, _require_scope, send_ambience_error


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


def _get_scope(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scope_kind: str,
    scope_id: str | None,
) -> None:
    """The shared read behind the three scope-get commands, mirroring
    `_save_scope`'s write (the caller has already verified the scope exists).
    A scope with no stored config reads back as an empty scene list, so the
    editor opens on a blank scope rather than an error."""
    store = hass.data[DOMAIN][DATA_STORE]
    config = store.scope_config(scope_kind, scope_id) or {"scenes": []}
    connection.send_result(msg["id"], annotate_scenes(hass, config))


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
    if not _require_scope(hass, connection, msg, "area", area_id):
        return
    _get_scope(hass, connection, msg, "area", area_id)


async def _save_scope(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scope_kind: str,
    scope_id: str | None,
) -> None:
    """The shared validate → coerce → canonicalise → save → respond pipeline
    behind the three scope-save commands (the caller has already verified the
    scope exists in the relevant registry). Persists via `store.async_save_scope`
    and records the change in the undo history (a snapshot before + after)."""
    try:
        validate_scope_config(hass, msg["config"])
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    # Coerce categories BEFORE canonicalising so each scene is ordered in its final
    # (post-coercion) category bucket, not a transient unknown/empty one.
    store = hass.data[DOMAIN][DATA_STORE]
    coerce_scene_categories(store, msg["config"])
    config = canonicalise(hass, msg["config"], minimise_pins=msg.get("minimise_pins", False))
    before = copy.deepcopy(store.scope_config(scope_kind, scope_id))
    await store.async_save_scope(scope_kind, scope_id, config)
    after = copy.deepcopy(store.scope_config(scope_kind, scope_id))
    history = hass.data[DOMAIN][DATA_HISTORY]
    change = msg.get("change") or {"action": "edit", "scene_name": None}
    if history.record(scope_kind, scope_id, before, after, change):
        history.notify_changed("record", scope_kind, scope_id, connection)
    # Respond with what the store now holds, not the request's config: the save
    # never writes the scope-level `enabled` flag, so echoing the request would
    # tell a stale client its disabled/enabled view had been persisted.
    # Recompute the overlap set so the save response reflects the just-saved config
    # rather than a cached set; the get path reads the cache.
    connection.send_result(
        msg["id"], {"ok": True, "config": annotate_scenes(hass, after, fresh_overlap=True)}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/area/save",
        vol.Required("area_id"): str,
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
        vol.Optional("minimise_pins"): bool,
    }
)
@websocket_api.async_response
async def _ws_area_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    area_id = msg["area_id"]
    if not _require_scope(hass, connection, msg, "area", area_id):
        return
    await _save_scope(hass, connection, msg, "area", area_id)


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
    if not _require_scope(hass, connection, msg, "floor", floor_id):
        return
    _get_scope(hass, connection, msg, "floor", floor_id)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/floor/save",
        vol.Required("floor_id"): str,
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
        vol.Optional("minimise_pins"): bool,
    }
)
@websocket_api.async_response
async def _ws_floor_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    floor_id = msg["floor_id"]
    if not _require_scope(hass, connection, msg, "floor", floor_id):
        return
    await _save_scope(hass, connection, msg, "floor", floor_id)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/house/get"})
@websocket_api.async_response
async def _ws_house_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    _get_scope(hass, connection, msg, "house", None)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/house/save",
        vol.Required("config"): dict,
        vol.Optional("change"): dict,
        vol.Optional("minimise_pins"): bool,
    }
)
@websocket_api.async_response
async def _ws_house_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    await _save_scope(hass, connection, msg, "house", None)


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
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], {"ok": True})


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
        send_ambience_error(connection, msg["id"], exc)
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
        vol.Required("type"): "ambience/dry_run",
        **_SCOPE_SELECTOR_SCHEMA,
        # Default to redacted: there is no panel caller of this command (it does
        # not appear anywhere in frontend/src or the built bundle) — the only
        # live consumer is the MCP server, handing this plan to an external AI.
        # The plan carries presence/location-revealing describes (people,
        # template, unavailable, occupancy) and raw action params (lock/alarm
        # codes), so a caller that omits the flag must get the SAFE result. That
        # matters concretely: an `ambience-mcp` published before this backend
        # gained redaction never sends `redact` at all, and must not be handed
        # secrets just because it doesn't know to ask for safety. A future panel
        # that wants the real detail ships alongside this backend and can opt in
        # explicitly with `redact: false`.
        vol.Optional("redact", default=True): bool,
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
        if msg["redact"]:
            # redact_plan() shallow-copies its input, including a `categories`
            # sub-dict if the plan carries one — that copy is unredacted. Compute
            # the per-category redaction into a local FIRST and assign it
            # explicitly after, so the result doesn't depend on which of two
            # keys in a dict literal happens to come last.
            redacted_categories = {
                cid: redact_plan(plan) for cid, plan in result["categories"].items()
            }
            result = redact_plan(result)
            result["categories"] = redacted_categories
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/apply",
        **_SCOPE_SELECTOR_SCHEMA,
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
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/scene/run_actions",
        **_SCOPE_SELECTOR_SCHEMA,
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
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"], result)


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
        **_SCOPE_SELECTOR_SCHEMA,
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
        send_ambience_error(connection, msg["id"], exc)
        return
    # Validate the id against the registry (like the save handlers): the store
    # setdefaults a scope bucket, so a typo'd/stale id would persist junk.
    if not _require_scope(hass, connection, msg, scope_kind, scope_id):
        return
    enabled = msg["enabled"]
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_set_scope_enabled(scope_kind, scope_id, enabled)

    # A scope's switch follows its enabled-ness:
    # enabling (re)creates it, disabling deletes it and its device. Fire the
    # switch-config signal so the switch platform's reconcile — the single source
    # of truth for which switches exist — applies the change, rather than
    # duplicating per-scope create/remove logic here.
    async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
    # The scope's re-apply is the engine's job: the store's config-changed signal
    # drives a forced refresh that re-snapshots, re-seeds every predicate's tenure
    # (re-arming `for:` gates) and re-applies the scope's winners. Applying here
    # too would run non-idempotent actions twice.

    connection.send_result(msg["id"], {"ok": True})


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
            {
                "name": msg["name"],
                "auto_on_delay_seconds": msg["auto_on_delay_seconds"],
            }
        )
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
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
        send_ambience_error(connection, msg["id"], exc)
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
