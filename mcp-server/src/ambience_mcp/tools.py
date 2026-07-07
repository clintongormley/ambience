"""Pure async tool logic over an HAClient. No MCP-SDK imports here so the whole
surface is unit-testable with a fake client. server.py wraps each of these."""

from __future__ import annotations

from typing import Any

from .diff import diff_scopes
from .ha_client import HACommandError
from .ledger import PreviewLedger, fingerprint

SUPPORTED_AI_BUNDLE = 1
"""Highest `ambience_ai_bundle` structure version this server understands. A
backend reporting a higher value is newer than this server, so get_context
attaches a `warning` telling the user to update it."""


class ToolError(RuntimeError):
    """A tool was called with an invalid argument (surfaced to the model)."""


def _parse_scope(scope: dict[str, Any]) -> tuple[str, str | None]:
    kind = scope.get("kind")
    if kind == "house":
        return "house", None
    if kind in ("area", "floor"):
        sid = scope.get("id")
        if not isinstance(sid, str) or not sid:
            raise ToolError(f"{kind} scope requires a non-empty 'id'")
        return kind, sid
    raise ToolError(f"scope.kind must be 'area', 'floor', or 'house' (got {kind!r})")


def _id_payload(kind: str, sid: str | None) -> dict[str, Any]:
    """The scope selector for the dedicated get/save commands: an id key for
    area/floor, nothing for house (whose command carries no selector). Also
    doubles as dry_run's selector for area/floor — see dry_run."""
    if kind == "area":
        return {"area_id": sid}
    if kind == "floor":
        return {"floor_id": sid}
    return {}


def _scope_key(kind: str, sid: str | None) -> dict[str, Any]:
    """The canonical scope shape the preview->apply confirm-token is bound to.
    Defined once so preview_write and apply_write can never hash different shapes."""
    return {"kind": kind, "id": sid}


def _with_ranks(scenes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Annotate each scene with a 1-indexed `rank` within its category (list order
    is evaluation order), so a summary can show relative rank instead of the raw
    internal `priority` sort key. Read-only — stripped again before any write."""
    counters: dict[Any, int] = {}
    ranked: list[dict[str, Any]] = []
    for scene in scenes:
        category = scene.get("category")
        counters[category] = counters.get(category, 0) + 1
        ranked.append({**scene, "rank": counters[category]})
    return ranked


def _strip_ranks(scenes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Drop the read-only `rank` annotation so it never reaches the store."""
    return [{k: v for k, v in scene.items() if k != "rank"} for scene in scenes]


def _iter_scope_configs(config: dict[str, Any]):
    """Yield each scope config ({"scenes": [...]}) in a bundle's config: every
    area, every floor, and the house."""
    for group_key in ("areas", "floors"):
        group = config.get(group_key)
        if isinstance(group, dict):
            yield from (cfg for cfg in group.values() if isinstance(cfg, dict))
    house = config.get("house")
    if isinstance(house, dict):
        yield house


async def get_context(client: Any) -> dict[str, Any]:
    bundle = await client.command("ambience/ai_bundle")
    config = bundle.get("config")
    if isinstance(config, dict):
        for scope_cfg in _iter_scope_configs(config):
            if isinstance(scope_cfg.get("scenes"), list):
                scope_cfg["scenes"] = _with_ranks(scope_cfg["scenes"])
    backend_format = bundle.get("ambience_ai_bundle")
    if isinstance(backend_format, int) and backend_format > SUPPORTED_AI_BUNDLE:
        bundle["warning"] = (
            f"This Ambience install speaks AI-bundle format {backend_format}, but this "
            f"MCP server understands up to {SUPPORTED_AI_BUNDLE}. The server is out of "
            "date and some fields may be missing — ask the user to restart Claude, or "
            "pin a newer ambience-mcp source."
        )
    return bundle


async def get_scope(client: Any, scope: dict[str, Any]) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    result = await client.command(f"ambience/{kind}/get", **_id_payload(kind, sid))
    if isinstance(result.get("scenes"), list):
        result["scenes"] = _with_ranks(result["scenes"])
    return result


_GUIDE_UNAVAILABLE_MESSAGE = (
    "This Ambience version does not serve the authoring guide yet — upgrade "
    "Ambience, or use the static skill guide."
)


async def get_guide(client: Any, have_version: str | None = None) -> dict[str, Any]:
    """Fetch the authoring guide (schema + cookbook) live from the running
    install. Pass the `ambience_version` you already hold as `have_version`; a
    matching version returns {unchanged: true} with no text so the guide is only
    re-read when the install changes. Old backends that predate the command
    return {unavailable: true} instead of raising."""
    payload: dict[str, Any] = {}
    if have_version is not None:
        payload["have_version"] = have_version
    try:
        return await client.command("ambience/ai_guide", **payload)
    except HACommandError as exc:
        if exc.code == "unknown_command":
            return {"unavailable": True, "message": _GUIDE_UNAVAILABLE_MESSAGE}
        raise


async def dry_run(client: Any, scope: dict[str, Any]) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    # dry_run uses HA's shared scope selector, which marks house with `house: True`
    # rather than an id key; area/floor reuse the same id selector as get/save.
    return await client.command("ambience/dry_run", **(_id_payload(kind, sid) or {"house": True}))


async def validate(client: Any, scenes: list[dict[str, Any]]) -> dict[str, Any]:
    return await client.command("ambience/validate", config={"scenes": scenes})


async def preview_write(
    client: Any, scope: dict[str, Any], scenes: list[dict[str, Any]], ledger: PreviewLedger
) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
    current = (await client.command(f"ambience/{kind}/get", **_id_payload(kind, sid))).get(
        "scenes", []
    )
    try:
        await client.command("ambience/validate", config={"scenes": scenes})
        valid, errors = True, None
    except HACommandError as exc:
        valid, errors = False, exc.message
    changes = diff_scopes(current, scenes)
    token = fingerprint(_scope_key(kind, sid), scenes)
    # Only a validated payload gets an applyable token; an invalid preview
    # returns its fingerprint for reference but records nothing, so apply_write
    # rejects it at the gate until the caller fixes the validation error.
    if valid:
        ledger.record(token)
    return {"valid": valid, "errors": errors, "diff": changes, "confirm_token": token}


async def apply_write(
    client: Any,
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    confirm_token: str,
    ledger: PreviewLedger,
) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
    token = fingerprint(_scope_key(kind, sid), scenes)
    if confirm_token != token or not ledger.consume(token):
        raise ToolError(
            "apply_write needs the confirm_token from a preview_write of this exact "
            "payload; run preview_write first (and again if you changed the scenes)"
        )
    return await client.command(
        f"ambience/{kind}/save",
        config={"scenes": scenes},
        change={"action": "import", "scene_name": None},
        minimise_pins=True,
        **_id_payload(kind, sid),
    )


async def list_traces(client: Any, limit: int | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {}
    if limit is not None:
        payload["limit"] = limit
    return await client.command("ambience/traces/list", **payload)


async def list_categories(client: Any) -> dict[str, Any]:
    return await client.command("ambience/categories/list")


async def save_categories(client: Any, categories: list[dict[str, Any]]) -> dict[str, Any]:
    return await client.command("ambience/categories/save", categories=categories)
