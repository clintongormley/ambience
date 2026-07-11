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

MIN_AMBIENCE_VERSION = (1, 1, 0)
"""Oldest Ambience the server can safely write to: the first release carrying the
`minimise_pins` save flag apply_write sends. Older backends (e.g. 1.0.0) reject
the unknown key, so writes are refused with a clear message instead. Reads still
work below this. Set to the release that first ships MCP support."""


def _parse_version(value: Any) -> tuple[int, ...] | None:
    """Parse "MAJOR.MINOR.PATCH" (ignoring any -prerelease/+build suffix) into a
    comparable tuple, zero-padded to at least 3 components; None if it isn't a
    recognisable version string. Padding stops a short "1.1" from sorting below
    "1.1.0" (Python compares the shorter tuple as smaller)."""
    if not isinstance(value, str):
        return None
    head = value.strip().split("-", 1)[0].split("+", 1)[0]
    parts = head.split(".")
    # isdecimal, not isdigit: reject unicode digits like "²" that int() would raise on.
    if not all(p.isdecimal() for p in parts):  # an empty head → parts == [""] → False
        return None
    nums = [int(p) for p in parts]
    return tuple(nums + [0] * (3 - len(nums))) if len(nums) < 3 else tuple(nums)


def _version_str(version: tuple[int, ...]) -> str:
    return ".".join(str(p) for p in version)


async def _backend_version(client: Any) -> tuple[int, ...] | None:
    """The running Ambience version via the cheap `frontend_version` probe; None
    if the backend predates the command or reports no parseable version (in which
    case callers fail open rather than block on a hiccup)."""
    try:
        info = await client.command("ambience/frontend_version")
    except HACommandError:
        return None
    return _parse_version(info.get("version"))


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


def _with_ranks(scenes: list[Any]) -> list[Any]:
    """Annotate each scene with a 1-indexed `rank` within its category (list order
    is evaluation order), so a summary can show relative rank instead of the raw
    internal `priority` sort key. Read-only — stripped again before any write.

    A non-dict scene means an unrecognised bundle shape: return the list untouched
    rather than raise, so a too-new bundle fails open instead of crashing the read."""
    if not all(isinstance(scene, dict) for scene in scenes):
        return scenes
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
    ambver = _parse_version(bundle.get("ambience_version"))
    backend_format = bundle.get("ambience_ai_bundle")
    if ambver is not None and ambver < MIN_AMBIENCE_VERSION:
        bundle["warning"] = (
            f"Your Ambience ({bundle.get('ambience_version')}) is older than this MCP "
            f"server needs (>= {_version_str(MIN_AMBIENCE_VERSION)}). Reads work, but "
            "writes will be refused — update Ambience, or pin an older ambience-mcp."
        )
    elif isinstance(backend_format, int) and backend_format > SUPPORTED_AI_BUNDLE:
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


_GUIDE_USAGE = (
    "Call ambience_get_guide again with section=<one of sections> to read that "
    "part. The whole guide is far too large to return at once — read the "
    "sections you need. 'Config schema' and 'Condition cookbook' cover most "
    "authoring; 'Reading a diagnostic bundle' covers diagnosis."
)


def _split_guide_sections(text: str) -> dict[str, str]:
    """Split the assembled guide on its top-level `# ` headings, title first.

    Fence-aware on purpose: the guide's YAML examples are full of `#` comments
    (`# --- Block 1 of 2 ---`, `# BEFORE — ...`) which a naive line-based split
    would mistake for headings and shred the sections apart.

    The FIRST heading is the document's own title, and its body is the paste-flow
    preamble ("paste your downloaded AI bundle") — wrong advice over MCP, where the
    bundle is fetched, not pasted. It is dropped, so what comes back is exactly the
    readable sections.
    """
    sections: dict[str, list[str]] = {}
    body: list[str] | None = None
    in_fence = False
    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence and line.startswith("# "):
            body = sections.setdefault(line[2:].strip(), [])
            continue
        if body is not None:
            body.append(line)
    for title in list(sections)[:1]:  # the document title, never a section
        del sections[title]
    return {name: "\n".join(lines).strip() for name, lines in sections.items()}


class GuideCache:
    """The split guide for one Ambience version, held by the SERVER.

    The guide is ~109KB and only changes when the user upgrades Ambience, so
    refetching it for every section wastes real bandwidth — the MCP server may be
    reaching Home Assistant over the internet, not a LAN. Keyed on the install's
    version, which is exactly when the guide can change.

    Server-held on purpose. `have_version` used to be a **tool argument**, which
    invited a model to pass a version it had read from the *bundle* and so claim it
    already held a guide it had never fetched — the install would answer
    {unchanged: true} with no text, and the model would author blind. The server's
    own memory cannot lie about what it has read.
    """

    def __init__(self) -> None:
        self.version: str | None = None
        self.sections: dict[str, str] = {}

    def store(self, version: str | None, sections: dict[str, str]) -> None:
        self.version = version
        self.sections = sections


async def get_guide(client: Any, cache: GuideCache, section: str | None = None) -> dict[str, Any]:
    """Fetch the authoring guide (schema + cookbook) from the running install, one
    section at a time.

    With no `section`, returns the list of section names (a table of contents).
    With a `section`, returns just that section's text. The full guide is ~25k
    tokens and does not fit in a single tool result, which is why there is no
    "give me all of it" mode. Old backends that predate the command return
    {unavailable: true} instead of raising.
    """
    held = {"have_version": cache.version} if cache.version else {}
    try:
        payload = await client.command("ambience/ai_guide", **held)
    except HACommandError as exc:
        if exc.code == "unknown_command":
            return {"unavailable": True, "message": _GUIDE_UNAVAILABLE_MESSAGE}
        raise

    if payload.get("unchanged"):
        payload = {**payload, "ambience_version": cache.version}
    else:
        cache.store(
            payload.get("ambience_version"),
            _split_guide_sections(payload.get("guide") or ""),
        )
    sections = cache.sections
    meta = {
        "ambience_version": payload.get("ambience_version"),
        "ambience_ai_bundle": payload.get("ambience_ai_bundle"),
        "sections": list(sections),
    }
    if section is None:
        return {**meta, "usage": _GUIDE_USAGE}
    if section not in sections:
        return {**meta, "error": f"Unknown guide section {section!r}.", "usage": _GUIDE_USAGE}
    return {**meta, "section": section, "guide": sections[section]}


async def dry_run(client: Any, scope: dict[str, Any]) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    # dry_run uses HA's shared scope selector, which marks house with `house: True`
    # rather than an id key; area/floor reuse the same id selector as get/save.
    return await client.command("ambience/dry_run", **(_id_payload(kind, sid) or {"house": True}))


async def validate(client: Any, scenes: list[dict[str, Any]]) -> dict[str, Any]:
    # Strip the read-only `rank` annotation, like the write paths, so a caller that
    # validates scenes it just read never leaks it to the backend validator.
    return await client.command("ambience/validate", config={"scenes": _strip_ranks(scenes)})


def _merge_categories(
    existing: list[dict[str, Any]], new: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """The full category list categories/save expects: existing order preserved
    (updated in place where re-declared), then any genuinely-new ones appended."""
    new_by_id = {c.get("id"): c for c in new}
    merged = [new_by_id.pop(c.get("id"), c) for c in existing]
    merged.extend(new_by_id.values())
    return merged


async def preview_write(
    client: Any,
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    ledger: PreviewLedger,
    new_categories: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
    new_categories = new_categories or []
    current = (await client.command(f"ambience/{kind}/get", **_id_payload(kind, sid))).get(
        "scenes", []
    )
    # `current` is backend-sourced, so a too-new/unknown bundle could reshape it (same
    # risk _with_ranks guards on the read path). We can't diff against scenes we can't
    # read, so fall back to an empty baseline rather than let diff_scopes raise — the
    # write's validity is decided by validate + categories below, not by the diff. Check
    # the container too: `{"scenes": null}` makes `.get`'s default moot, leaving None.
    if not isinstance(current, list) or not all(isinstance(scene, dict) for scene in current):
        current = []
    try:
        await client.command("ambience/validate", config={"scenes": scenes})
        valid, errors = True, None
    except HACommandError as exc:
        valid, errors = False, exc.message
    # The backend silently reassigns a scene with an unknown category to "General"
    # on save, so an unflagged typo would commit something other than the previewed
    # diff. A category counts as known if it already exists OR is declared in
    # new_categories (created on apply); anything else blocks the write.
    cat_list = await client.command("ambience/categories/list")
    existing_ids = {c.get("id") for c in cat_list.get("categories", [])}
    known = existing_ids | {c.get("id") for c in new_categories}
    unknown = sorted({s["category"] for s in scenes if isinstance(s.get("category"), str)} - known)
    if unknown and valid:
        valid = False
        joined = ", ".join(unknown)
        errors = f"unknown categories (create them or declare in new_categories): {joined}"
    creating = [c for c in new_categories if c.get("id") not in existing_ids]
    changes = diff_scopes(current, scenes)
    token = fingerprint(_scope_key(kind, sid), scenes, new_categories)
    # Only a fully-valid payload (schema OK + every category known) gets an applyable
    # token; otherwise the fingerprint is returned for reference but recorded nowhere,
    # so apply_write rejects it until the caller fixes the problem.
    if valid:
        ledger.record(token)
    return {
        "valid": valid,
        "errors": errors,
        "unknown_categories": unknown,
        "creating_categories": creating,
        "diff": changes,
        "confirm_token": token,
    }


async def apply_write(
    client: Any,
    scope: dict[str, Any],
    scenes: list[dict[str, Any]],
    confirm_token: str,
    ledger: PreviewLedger,
    new_categories: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    kind, sid = _parse_scope(scope)
    new_categories = new_categories or []
    version = await _backend_version(client)
    if version is not None and version < MIN_AMBIENCE_VERSION:
        raise ToolError(
            f"This MCP server needs Ambience >= {_version_str(MIN_AMBIENCE_VERSION)}; your "
            f"install reports {_version_str(version)}. Update Ambience (HACS), or pin an "
            "ambience-mcp that matches your version."
        )
    scenes = _strip_ranks(scenes)  # `rank` is a read-only annotation, never stored
    token = fingerprint(_scope_key(kind, sid), scenes, new_categories)
    if confirm_token != token or not ledger.consume(token):
        raise ToolError(
            "apply_write needs the confirm_token from a preview_write of this exact "
            "payload; run preview_write first (and again if you changed the scenes)"
        )
    # Create any declared categories first (merged into the existing list, which
    # categories/save replaces wholesale) so a scene's new category exists instead
    # of being coerced to General.
    if new_categories:
        existing = (await client.command("ambience/categories/list")).get("categories", [])
        await client.command(
            "ambience/categories/save", categories=_merge_categories(existing, new_categories)
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
