"""FastMCP glue: one connection, one preview ledger, eleven thin tool wrappers.

Each wrapper delegates to ambience_mcp.tools; the docstring + type hints become
the tool's MCP schema. Keep descriptions short — the client's tool-search reads
them, and a lean surface keeps the per-turn context footprint small."""

from __future__ import annotations

import functools
import inspect
from collections.abc import Callable
from importlib.metadata import version
from typing import Any

from mcp.server.fastmcp import FastMCP

from . import tools
from .budget import fit_result
from .config import load_config
from .ha_client import ReconnectingClient, connect
from .ledger import PreviewLedger


def _bounded(fn: Callable[..., Any]) -> Callable[..., Any]:
    """Wrap a tool callable so its return value always passes through
    `budget.fit_result` before it reaches the client. Not something a tool
    author calls themselves — `_BoundedFastMCP.add_tool` below applies it to
    every registered tool automatically.

    FastMCP supports both sync and async tool functions, so this picks the
    matching wrapper shape via `inspect.iscoroutinefunction` — awaiting a sync
    function's return value directly (rather than the function itself) would
    raise at call time. Every tool registered on this server today is async,
    so a sync tool has never actually hit this, but the whole point of
    `_BoundedFastMCP` is that the guard applies no matter how a tool is
    registered, so it must handle both."""

    if inspect.iscoroutinefunction(fn):

        @functools.wraps(fn)
        async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
            return fit_result(await fn(*args, **kwargs))

        return async_wrapper

    @functools.wraps(fn)
    def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
        return fit_result(fn(*args, **kwargs))

    return sync_wrapper


class _BoundedFastMCP(FastMCP):
    """A FastMCP that makes the result budget STRUCTURAL rather than something
    each tool has to remember.

    `budget.py`'s shape-aware strategies (`fit_context`/`fit_entities`/
    `fit_traces`) used to be hand-wired into exactly 3 of the 11 tools — the
    other 8 returned whatever the backend sent, unguarded. Overriding
    `add_tool` (the method BOTH `@mcp.tool()` and any future direct
    registration call under the hood) instead of decorating each `@mcp.tool()`
    site means there is no second step to forget: register a tool with this
    server at all, by any means, and `fit_result` runs on its result. A new
    tool cannot silently ship an unbounded result the way the original 8 did.

    `fit_result` early-returns once a result is already within budget, so this
    is a no-op — not a second pass — for the 3 tools whose shape-aware
    strategy already fitted the result in `tools.py`. It is the backstop
    underneath them, not a replacement.
    """

    def add_tool(self, fn: Callable[..., Any], *args: Any, **kwargs: Any) -> None:
        super().add_tool(_bounded(fn), *args, **kwargs)


mcp = _BoundedFastMCP("ambience")
_ledger = PreviewLedger()
_guide_cache = tools.GuideCache()
_client: ReconnectingClient | None = None


def _client_() -> ReconnectingClient:
    """The one HA connection. It reconnects and re-sends a command that never left
    us (an HA restart closes the socket), so tools see a live link and never have
    to reason about retry-safety themselves — see ReconnectingClient.

    `supported_protocols` is hardcoded to {1} rather than read from a registry:
    the `protocols/` adapter package (which will own the real `PROTOCOLS` mapping
    and wire `.ready()`'s agreed protocol into an adapter) lands in the next task.
    Until then this only has to match the one protocol the backend speaks today."""
    global _client
    if _client is None:
        _client = ReconnectingClient(
            connect,
            load_config,
            supported_protocols=frozenset({1}),
            mcp_version=version("ambience-mcp"),
        )
    return _client


@mcp.tool()
async def ambience_get_context() -> dict[str, Any]:
    """Live Ambience authoring context: areas/floors, an entity SUMMARY (counts by
    domain/area/device_class), exposed actions and their field schemas, and
    category/period/lux definitions. Fetch this before authoring so every id and
    vocabulary word is real.

    It carries entity COUNTS, not entity rows — a real house has thousands. Use
    ambience_find_entities to look up the actual entities you need, the summary to
    discover what exists, ambience_get_scope for a scope's scenes, and
    ambience_list_traces for traces."""
    return await tools.get_context(_client_())


@mcp.tool()
async def ambience_find_entities(
    query: str | None = None,
    domain: str | list[str] | None = None,
    area_id: str | list[str] | None = None,
    device_class: str | list[str] | None = None,
    limit: int | None = None,
    cursor: int | None = None,
) -> dict[str, Any]:
    """Look up entities in the live catalog. This is how you get entity ids —
    ambience_get_context carries only COUNTS, because a real house has thousands
    of entities.

    Filters combine with AND; each of domain/area_id/device_class takes one value
    or a list. `query` is a case-insensitive substring of the entity_id or name.
    Results are paged: pass the returned `cursor` back to get the next page
    (`cursor` is null on the last page). `limit` defaults to 50, max 200.

    Everything is reachable here — an action can target any domain you expose, and
    a `state`/`template` condition can reference ANY entity in the house, so
    nothing is filtered out of the catalog, only paged.

    Examples:
      lights in the kitchen  → domain="light", area_id="kitchen"
      the lux sensors        → device_class="illuminance"
      anything named 'lamp'  → query="lamp"
    """
    return await tools.find_entities(
        _client_(), query, domain, area_id, device_class, limit, cursor
    )


@mcp.tool()
async def ambience_get_scope(scope: dict[str, Any]) -> dict[str, Any]:
    """Read the current scenes for one scope.
    scope = {"kind": "area"|"floor"|"house", "id": "<area_or_floor_id>"} (omit id for house).
    Each scene carries a per-category `rank` (1..N, evaluation order); present that
    plus the 📌 pin marker, never the raw internal `priority` number."""
    return await tools.get_scope(_client_(), scope)


@mcp.tool()
async def ambience_get_guide(section: str | None = None) -> dict[str, Any]:
    """Fetch the Ambience scene-authoring guide (schema + cookbook) live from the
    running install. Read it before authoring.

    The guide is far too large to return at once, so it is served by section.
    Call with no argument to get the list of section names, then call again with
    section=<name> to read one. Start with "Config schema" and "Condition
    cookbook"; read "Reading a diagnostic bundle" when diagnosing why a scene
    did not fire."""
    return await tools.get_guide(_client_(), _guide_cache, section)


@mcp.tool()
async def ambience_dry_run(scope: dict[str, Any]) -> dict[str, Any]:
    """Preview which scene currently wins for a scope, with the evaluation trace
    (including shadowing). Read-only. scope shape as in ambience_get_scope."""
    return await tools.dry_run(_client_(), scope)


@mcp.tool()
async def ambience_validate(scenes: list[dict[str, Any]]) -> dict[str, Any]:
    """Structurally validate a proposed list of scenes (raises on invalid)."""
    return await tools.validate(_client_(), scenes)


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
    return await tools.preview_write(_client_(), scope, scenes, _ledger, new_categories)


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
    return await tools.apply_write(
        _client_(), scope, scenes, confirm_token, _ledger, new_categories
    )


@mcp.tool()
async def ambience_list_traces(limit: int | None = None) -> dict[str, Any]:
    """Recent scene-evaluation traces for diagnosis ("why didn't my scene fire?").

    If the list is too big for one result, the oldest traces are dropped and the
    result carries `omitted` and a `notice` saying so — ask again with a smaller
    `limit` to see a different slice."""
    return await tools.list_traces(_client_(), limit)


@mcp.tool()
async def ambience_list_categories() -> dict[str, Any]:
    """List the scene categories (id + name + icon/color)."""
    return await tools.list_categories(_client_())


@mcp.tool()
async def ambience_save_categories(categories: list[dict[str, Any]]) -> dict[str, Any]:
    """Create/update scene categories. Each item = {id, name, icon?, color?}."""
    return await tools.save_categories(_client_(), categories)


def main() -> None:
    mcp.run()
