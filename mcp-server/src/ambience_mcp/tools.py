"""Pure async tool logic over an HAClient. No MCP-SDK imports here so the whole
surface is unit-testable with a fake client. server.py wraps each of these."""

from __future__ import annotations

from typing import Any

from .diff import diff_scopes
from .ha_client import HACommandError
from .ledger import PreviewLedger, fingerprint


class ToolError(RuntimeError):
    """A tool was called with an invalid argument (surfaced to the model)."""


_GET_COMMAND = {
    "area": "ambience/area/get",
    "floor": "ambience/floor/get",
    "house": "ambience/house/get",
}
_SAVE_COMMAND = {
    "area": "ambience/area/save",
    "floor": "ambience/floor/save",
    "house": "ambience/house/save",
}


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
    if kind == "area":
        return {"area_id": sid}
    if kind == "floor":
        return {"floor_id": sid}
    return {}


def _selector(kind: str, sid: str | None) -> dict[str, Any]:
    if kind == "area":
        return {"area_id": sid}
    if kind == "floor":
        return {"floor_id": sid}
    return {"house": True}


async def get_context(client: Any) -> dict[str, Any]:
    return await client.command("ambience/ai_bundle")


async def get_scope(client: Any, scope: dict[str, Any]) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    return await client.command(_GET_COMMAND[kind], **_id_payload(kind, sid))


async def dry_run(client: Any, scope: dict[str, Any]) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    return await client.command("ambience/dry_run", **_selector(kind, sid))


async def validate(client: Any, scenes: list[dict[str, Any]]) -> dict[str, Any]:
    return await client.command("ambience/validate", config={"scenes": scenes})


async def preview_write(
    client: Any, scope: dict[str, Any], scenes: list[dict[str, Any]], ledger: PreviewLedger
) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    current = (await client.command(_GET_COMMAND[kind], **_id_payload(kind, sid))).get("scenes", [])
    try:
        await client.command("ambience/validate", config={"scenes": scenes})
        valid, errors = True, None
    except HACommandError as exc:
        valid, errors = False, exc.message
    changes = diff_scopes(current, scenes)
    token = fingerprint({"kind": kind, "id": sid}, scenes)
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
    token = fingerprint({"kind": kind, "id": sid}, scenes)
    if confirm_token != token or not ledger.consume(token):
        raise ToolError(
            "apply_write needs the confirm_token from a preview_write of this exact "
            "payload; run preview_write first (and again if you changed the scenes)"
        )
    return await client.command(
        _SAVE_COMMAND[kind],
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
