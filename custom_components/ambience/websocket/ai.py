"""WebSocket commands an AI/MCP client (and the panel's AI affordances) read:
the bundle/context exports, the entity search, the guide, and install identity."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from ..const import DATA_EXPOSED_ACTIONS, DATA_FRONTEND_HASH, DATA_FRONTEND_VERSION, DOMAIN
from ..errors import AmbienceError
from ..exposed_actions import ExposedActionsStore
from .common import _strict_int, send_ambience_error


def _resolve_install_id(hass: HomeAssistant) -> str | None:
    """The single Ambience config entry's id, or None when none is registered.

    Single-instance, so there is at most one entry; its id is the install
    identity the frontend stamps dismissible-hint state with. None is a
    teardown-race guard — the ws command is unregistered once the entry is
    gone, so the empty-list path isn't reachable through it."""
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0].entry_id if entries else None


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/install_id"})
@websocket_api.async_response
async def _ws_install_id(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the install identity (the config entry id). The frontend keys its
    per-browser hint-dismissal state by this, so deleting and recreating the
    integration (a new entry_id) re-shows the optional setup hints."""
    connection.send_result(msg["id"], {"install_id": _resolve_install_id(hass)})


@websocket_api.websocket_command({vol.Required("type"): "ambience/frontend_version"})
@websocket_api.async_response
async def _ws_frontend_version(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the served frontend chunk's content hash and the integration
    version (both stashed at setup). The panel compares the hash against the
    bundle it is actually running (read from its own ?fe= URL) to detect a
    stale, cached bundle after an upgrade and prompt a reload. Not admin-gated:
    the data is non-sensitive and the card renders for non-admins too."""
    connection.send_result(
        msg["id"],
        {
            "hash": hass.data[DOMAIN].get(DATA_FRONTEND_HASH, ""),
            "version": hass.data[DOMAIN].get(DATA_FRONTEND_VERSION, ""),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/services/list"})
@websocket_api.async_response
async def _ws_services_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    from ..services_meta import list_services

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
    from ..services_meta import get_service_schema

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
@websocket_api.websocket_command({vol.Required("type"): "ambience/ai_bundle"})
@websocket_api.async_response
async def _ws_ai_bundle(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The live AI bundle: the catalog + exposed actions + definitions + redacted
    config + traces an external AI consults to author and diagnose scenes."""
    from ..ai_bundle import build_ai_bundle

    connection.send_result(msg["id"], await build_ai_bundle(hass))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/ai_context"})
@websocket_api.async_response
async def _ws_ai_context(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The BOUNDED authoring export an MCP client reads: the same catalog, actions
    and definitions as the AI bundle, but with entity COUNTS instead of thousands
    of rows, scene counts instead of scene lists, and no traces — because an MCP client has
    ambience/entities/find, ambience/{scope}/get and ambience/traces/list to fetch
    those on demand, and a hard cap on one result's size. The fat bundle stays for
    the download-and-paste flow, where the AI has no tools."""
    from ..ai_context import build_ai_context

    connection.send_result(msg["id"], await build_ai_context(hass))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/mcp/hello"})
@websocket_api.async_response
async def _ws_mcp_hello(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The MCP compatibility handshake — deliberately tiny.

    Every earlier version check rode inside `ai_bundle`/`ai_context`, so on a house
    big enough to overflow the AI client's token cap the diagnostic was rejected
    along with the payload it was warning about. This is a handful of bytes: it
    always arrives."""
    from ..ai_common import ambience_version
    from ..const import MCP_PROTOCOL, MIN_MCP_VERSION

    connection.send_result(
        msg["id"],
        {
            "protocol": MCP_PROTOCOL,
            "ambience_version": await ambience_version(hass),
            "min_mcp_version": MIN_MCP_VERSION,
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/entities/find",
        vol.Optional("query"): vol.Any(str, None),
        vol.Optional("domain"): vol.Any(str, [str], None),
        vol.Optional("area_id"): vol.Any(str, [str], None),
        vol.Optional("device_class"): vol.Any(str, [str], None),
        vol.Optional("limit"): vol.Any(_strict_int, None),
        vol.Optional("cursor"): vol.Any(_strict_int, None),
    }
)
@websocket_api.async_response
async def _ws_entities_find(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Search the entity catalog, one bounded page at a time. The AI context
    carries only entity COUNTS, so this is how an MCP client reaches an actual
    entity — nothing is hidden, it is merely paged."""
    from ..entity_catalog import entity_rows, find_entities

    connection.send_result(
        msg["id"],
        find_entities(
            entity_rows(hass),
            query=msg.get("query"),
            domain=msg.get("domain"),
            area_id=msg.get("area_id"),
            device_class=msg.get("device_class"),
            limit=msg.get("limit"),
            cursor=msg.get("cursor"),
        ),
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/ai_guide",
        vol.Optional("have_version"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def _ws_ai_guide(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The shipped authoring guide (schema + cookbook), served live and stamped
    with the running version. Pass `have_version` to get {unchanged: true} when
    it matches, so the client re-reads the text only when the install changes.
    Public (not admin) — static prose with no install secrets."""
    from ..guide import build_ai_guide

    connection.send_result(msg["id"], await build_ai_guide(hass, msg.get("have_version")))
