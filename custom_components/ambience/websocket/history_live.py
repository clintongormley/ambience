"""WebSocket commands for the undo/redo history, the live per-unit stream, and
the evaluation trace buffer."""

from __future__ import annotations

import copy
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from ..const import (
    DATA_HISTORY,
    DATA_STORE,
    DATA_TRACE_BUFFER,
    DOMAIN,
    SIGNAL_HISTORY_CHANGED,
    SIGNAL_UNIT_LIVE,
)
from ..redact import redacted_traces
from ..scopes import scope_exists as _scope_exists
from ..service import all_live_states, live_state
from ..trace import buffered_unit_to_dict
from ..websocket_helpers import annotate_scenes, canonicalise, coerce_scene_categories
from .common import _strict_int


async def _apply_scope_config(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, config: dict[str, Any]
) -> dict[str, Any]:
    """Write a restored scenes-only snapshot to the store: no validation and no
    history recording. A snapshot is already canonical as taken, and is only
    re-canonicalised when coercion moved a scene between categories — priorities
    are resolved per category, so merging two buckets can leave them tied.
    The store merges the result over the existing config, so the scope's
    `enabled` flag and switch state are preserved. Returns the full post-write
    scope config (scenes + enabled + …) for the response."""
    store = hass.data[DOMAIN][DATA_STORE]
    # A category can be deleted after a snapshot is taken, so the snapshot alone
    # cannot be trusted to satisfy the every-scene-has-a-real-category invariant.
    if coerce_scene_categories(store, config):
        config = canonicalise(hass, config)
    await store.async_save_scope(scope_kind, scope_id, config)
    return copy.deepcopy(store.scope_config(scope_kind, scope_id))


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
    def _forward(payload: tuple[str, str | None, str | None, Any]) -> None:
        op, kind, sid, origin = payload
        changed = (kind, sid) if kind is not None else None
        connection.send_message(
            websocket_api.event_message(
                msg["id"],
                history.snapshot(op=op, changed_scope=changed, is_self=origin is connection),
            )
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_HISTORY_CHANGED, _forward
    )
    connection.send_result(msg["id"])
    connection.send_message(websocket_api.event_message(msg["id"], history.snapshot()))


async def _history_step(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    op: str,
) -> None:
    """Take one step in direction `op` ("undo" or "redo") — the store exposes a
    `peek_<op>` / `discard_<op>` / `<op>` trio for each.

    Walk past entries whose scope has been deleted since the snapshot was taken
    (discarding them, so a stale entry can never resurrect a dead scope) to the
    first restorable one; answer `{"ok": False}` when the stack runs out."""
    history = hass.data[DOMAIN][DATA_HISTORY]
    peek = getattr(history, f"peek_{op}")
    discard = getattr(history, f"discard_{op}")
    step = getattr(history, op)
    while (entry := peek()) is not None:
        if not _scope_exists(hass, entry.scope_kind, entry.scope_id):
            discard()
            continue
        kind, sid, config = step()
        full = await _apply_scope_config(hass, kind, sid, config)
        history.notify_changed(op, kind, sid, connection)
        connection.send_result(
            msg["id"],
            {
                "ok": True,
                "scope_kind": kind,
                "scope_id": sid,
                "config": annotate_scenes(hass, full, fresh_overlap=True),
            },
        )
        return
    history.notify_changed(op)
    connection.send_result(msg["id"], {"ok": False})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/history/undo"})
@websocket_api.async_response
async def _ws_history_undo(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    await _history_step(hass, connection, msg, "undo")


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/history/redo"})
@websocket_api.async_response
async def _ws_history_redo(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    await _history_step(hass, connection, msg, "redo")


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
        vol.Optional("limit"): vol.All(_strict_int, vol.Range(min=1)),
        vol.Optional("redact", default=False): bool,
    }
)
@websocket_api.async_response
async def _ws_traces_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Recent traces, newest first.

    Unredacted by default — the HA panel consumes this and needs the real
    zone names/cause entities/action params to render diagnostics. Pass
    `redact: true` (as the MCP server's list_traces always does) to get the
    same redaction `ambience/ai_bundle` applies before a trace ever reaches an
    external AI: presence causes, per-predicate location detail, and
    security-domain action params (alarm codes, lock PINs) are all scrubbed.
    """
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    records = buffer.records() if buffer is not None else []
    limit = msg.get("limit")
    if limit is not None:
        records = records[:limit]
    if msg.get("redact"):
        traces = redacted_traces(hass, records)
    else:
        traces = [buffered_unit_to_dict(r) for r in records]
    connection.send_result(msg["id"], {"traces": traces})


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
