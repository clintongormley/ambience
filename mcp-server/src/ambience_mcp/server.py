"""FastMCP glue: one connection, one preview ledger, ten thin tool wrappers.

Each wrapper delegates to ambience_mcp.tools; the docstring + type hints become
the tool's MCP schema. Keep descriptions short — the client's tool-search reads
them, and a lean surface keeps the per-turn context footprint small."""

from __future__ import annotations

import asyncio
import contextlib
from typing import Any

from mcp.server.fastmcp import FastMCP

from . import tools
from .config import load_config
from .ha_client import HAClient, HAConnectionError, connect
from .ledger import PreviewLedger

mcp = FastMCP("ambience")
_ledger = PreviewLedger()
_client: HAClient | None = None
_client_lock = asyncio.Lock()


async def _client_() -> HAClient:
    global _client
    # Reconnect if we have no client yet, or the last one broke on a transport
    # failure (HA restart, dropped socket) and marked itself closed.
    if _client is None or _client.closed:
        async with _client_lock:
            if _client is None or _client.closed:
                if _client is not None:
                    # Release the dead client's socket + keepalive/reader tasks; a
                    # malformed frame can mark it closed while the socket is still
                    # open, so they'd otherwise leak on every reconnect. Best-effort.
                    with contextlib.suppress(Exception):
                        await _client.close()
                cfg = load_config()
                _client = await connect(cfg.ws_url, cfg.token)
    return _client


async def _call(fn: Any, *args: Any, idempotent: bool = True, **kwargs: Any) -> Any:
    """Run a tool against a live client, reconnecting and retrying once when the
    socket turns out to be dead.

    HA closes every websocket when it restarts, and we only find out on the next
    command — so without this the FIRST tool call after any HA restart fails and
    only the one after it reconnects. Retry when nothing reached HA (`sent` is
    False), or when the call has no side effects to repeat. A write whose command
    was already sent is NOT retried: HA may have applied it and lost only the
    reply, and re-sending could apply it twice.
    """
    try:
        return await fn(await _client_(), *args, **kwargs)
    except HAConnectionError as exc:
        if exc.sent and not idempotent:
            raise
        return await fn(await _client_(), *args, **kwargs)


@mcp.tool()
async def ambience_get_context() -> dict[str, Any]:
    """Live Ambience authoring context: areas/floors/entities+state, exposed
    actions and their field schemas, category/period/lux definitions, and recent
    traces. Fetch this before authoring so every id and vocabulary word is real.
    Scenes carry a per-category `rank` (1..N) — show that, not the raw
    `priority`, when presenting scenes to a user."""
    return await _call(tools.get_context)


@mcp.tool()
async def ambience_get_scope(scope: dict[str, Any]) -> dict[str, Any]:
    """Read the current scenes for one scope.
    scope = {"kind": "area"|"floor"|"house", "id": "<area_or_floor_id>"} (omit id for house).
    Each scene carries a per-category `rank` (1..N, evaluation order); present that
    plus the 📌 pin marker, never the raw internal `priority` number."""
    return await _call(tools.get_scope, scope)


@mcp.tool()
async def ambience_get_guide(section: str | None = None) -> dict[str, Any]:
    """Fetch the Ambience scene-authoring guide (schema + cookbook) live from the
    running install. Read it before authoring.

    The guide is far too large to return at once, so it is served by section.
    Call with no argument to get the list of section names, then call again with
    section=<name> to read one. Start with "Config schema" and "Condition
    cookbook"; read "Reading a diagnostic bundle" when diagnosing why a scene
    did not fire."""
    return await _call(tools.get_guide, section)


@mcp.tool()
async def ambience_dry_run(scope: dict[str, Any]) -> dict[str, Any]:
    """Preview which scene currently wins for a scope, with the evaluation trace
    (including shadowing). Read-only. scope shape as in ambience_get_scope."""
    return await _call(tools.dry_run, scope)


@mcp.tool()
async def ambience_validate(scenes: list[dict[str, Any]]) -> dict[str, Any]:
    """Structurally validate a proposed list of scenes (raises on invalid)."""
    return await _call(tools.validate, scenes)


@mcp.tool()
async def ambience_preview_write(
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    new_categories: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Preview a full scope write WITHOUT committing. Returns validity, a
    before/after diff (added/updated/removed), any unknown_categories, the
    categories it will create (creating_categories), and a confirm_token. Declare
    any new category a scene uses in new_categories ([{id, name, icon?, color?}]);
    they are created on apply. If unknown_categories is non-empty the write is
    blocked (no usable token) — declare them here or create them with
    ambience_save_categories. Show the diff to the user; pass the token to
    ambience_apply_write to commit."""
    return await _call(tools.preview_write, scope, scenes, _ledger, new_categories)


@mcp.tool()
async def ambience_apply_write(
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    confirm_token: str,
    new_categories: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Commit a full scope write. Requires the confirm_token from a prior
    ambience_preview_write of this EXACT scope+scenes+new_categories. Any
    new_categories are created before the scenes are saved. Reversible via Ambience
    undo. Only call after the user has approved the previewed diff.

    THIS REPLACES THE WHOLE SCOPE. `scenes` must be the scope's COMPLETE scene
    list — any existing scene you leave out is DELETED, including scenes in
    categories you did not mean to touch. Unlike a pasted import block there is no
    merge mode. So: ambience_get_scope first, carry forward every scene you mean to
    keep, and check the preview's `removed` list before committing."""
    return await _call(
        tools.apply_write,
        scope,
        scenes,
        confirm_token,
        _ledger,
        new_categories,
        idempotent=False,
    )


@mcp.tool()
async def ambience_list_traces(limit: int | None = None) -> dict[str, Any]:
    """Recent scene-evaluation traces for diagnosis ("why didn't my scene fire?")."""
    return await _call(tools.list_traces, limit)


@mcp.tool()
async def ambience_list_categories() -> dict[str, Any]:
    """List the scene categories (id + name + icon/color)."""
    return await _call(tools.list_categories)


@mcp.tool()
async def ambience_save_categories(categories: list[dict[str, Any]]) -> dict[str, Any]:
    """Create/update scene categories. Each item = {id, name, icon?, color?}."""
    return await _call(tools.save_categories, categories, idempotent=False)


def main() -> None:
    mcp.run()
