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
from .ha_client import HAClient, connect
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


@mcp.tool()
async def ambience_get_context() -> dict[str, Any]:
    """Live Ambience authoring context: areas/floors/entities+state, exposed
    actions and their field schemas, category/period/lux definitions, and recent
    traces. Fetch this before authoring so every id and vocabulary word is real.
    Scenes carry a per-category `rank` (1..N) — show that, not the raw
    `priority`, when presenting scenes to a user."""
    return await tools.get_context(await _client_())


@mcp.tool()
async def ambience_get_scope(scope: dict[str, Any]) -> dict[str, Any]:
    """Read the current scenes for one scope.
    scope = {"kind": "area"|"floor"|"house", "id": "<area_or_floor_id>"} (omit id for house).
    Each scene carries a per-category `rank` (1..N, evaluation order); present that
    plus the 📌 pin marker, never the raw internal `priority` number."""
    return await tools.get_scope(await _client_(), scope)


@mcp.tool()
async def ambience_get_guide(have_version: str | None = None) -> dict[str, Any]:
    """Fetch the Ambience scene-authoring guide (schema + cookbook) live from the
    running install. Read it once before authoring. Pass the `ambience_version`
    you already hold (from ambience_get_context) as have_version; if it matches
    you get {unchanged: true} and should keep using the guide already in your
    context — the full text is only re-sent when the install's version changes."""
    return await tools.get_guide(await _client_(), have_version)


@mcp.tool()
async def ambience_dry_run(scope: dict[str, Any]) -> dict[str, Any]:
    """Preview which scene currently wins for a scope, with the evaluation trace
    (including shadowing). Read-only. scope shape as in ambience_get_scope."""
    return await tools.dry_run(await _client_(), scope)


@mcp.tool()
async def ambience_validate(scenes: list[dict[str, Any]]) -> dict[str, Any]:
    """Structurally validate a proposed list of scenes (raises on invalid)."""
    return await tools.validate(await _client_(), scenes)


@mcp.tool()
async def ambience_preview_write(
    scope: dict[str, Any], scenes: list[dict[str, Any]]
) -> dict[str, Any]:
    """Preview a full scope write WITHOUT committing. Returns validity, a
    before/after diff (added/updated/removed), and a confirm_token. Show the diff
    to the user; pass the token to ambience_apply_write to commit."""
    return await tools.preview_write(await _client_(), scope, scenes, _ledger)


@mcp.tool()
async def ambience_apply_write(
    scope: dict[str, Any], scenes: list[dict[str, Any]], confirm_token: str
) -> dict[str, Any]:
    """Commit a full scope write. Requires the confirm_token from a prior
    ambience_preview_write of this EXACT scope+scenes. Reversible via Ambience
    undo. Only call after the user has approved the previewed diff. Writes the
    whole scope, so a change made to it since the preview is overwritten (undo
    restores it)."""
    return await tools.apply_write(await _client_(), scope, scenes, confirm_token, _ledger)


@mcp.tool()
async def ambience_list_traces(limit: int | None = None) -> dict[str, Any]:
    """Recent scene-evaluation traces for diagnosis ("why didn't my scene fire?")."""
    return await tools.list_traces(await _client_(), limit)


@mcp.tool()
async def ambience_list_categories() -> dict[str, Any]:
    """List the scene categories (id + name + icon/color)."""
    return await tools.list_categories(await _client_())


@mcp.tool()
async def ambience_save_categories(categories: list[dict[str, Any]]) -> dict[str, Any]:
    """Create/update scene categories. Each item = {id, name, icon?, color?}."""
    return await tools.save_categories(await _client_(), categories)


def main() -> None:
    mcp.run()
