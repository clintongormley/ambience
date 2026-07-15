"""The shared helpers behind the tool surface. No MCP-SDK imports here so the whole
surface is unit-testable with a fake client.

The tools themselves live in `protocols/`: eight version-invariant ones on
`BaseProtocol`, the three that differ per backend protocol on `ProtocolV1`. What is
left here is what every protocol adapter shares — scope parsing, the rank
annotation, the category merge, and the guide cache/split."""

from __future__ import annotations

from typing import Any


class ToolError(RuntimeError):
    """A tool was called with an invalid argument (surfaced to the model)."""


class CommandUnavailable(ToolError):
    """A protocol-guaranteed command answered `unknown_command`.

    Raised only from a negotiated adapter (see `BaseProtocol.command`), which
    exists only after this connection's handshake succeeded — so the backend
    is NOT too old; its commands are momentarily unregistered (a config-entry
    reload) or gone until re-enabled (the integration was disabled)."""


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


_GUIDE_USAGE = (
    "Call ambience_get_guide again with section=<one of sections> to read that "
    "part. The whole guide is far too large to return at once — read the "
    "sections you need. 'Config schema' and 'Condition cookbook' cover most "
    "authoring; 'Reading a diagnostic bundle' covers diagnosis. A large section is "
    "returned in parts — pass part=<n> and follow the `notice` to fetch the rest."
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
    ordered: list[tuple[str, list[str]]] = []
    in_fence = False
    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence and line.startswith("# "):
            # Ambience <= 1.1.0 assembles each part under TWO H1s — the wrapper
            # title, then the source document's own — leaving the wrapper's body
            # empty. This server ships separately from the integration, so it must
            # read that older guide too: an empty section is a wrapper, so keep its
            # (canonical) name and let it absorb the body that follows, instead of
            # serving an empty string for every section an AI is told to read.
            if ordered and not any(text_line.strip() for text_line in ordered[-1][1]):
                continue
            ordered.append((line[2:].strip(), []))
            continue
        if ordered:
            ordered[-1][1].append(line)
    # The first heading is the document's own title (its body is the paste-flow
    # preamble), never a readable section.
    return {name: "\n".join(lines).strip() for name, lines in ordered[1:]}


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
        """Remember a guide we could actually read.

        An empty split is never cached: claiming that version would POISON the cache
        for the life of the process — every later call would send `have_version`, be
        answered {unchanged: true} with no text, and serve the empty map forever,
        with no error the model could see. Remembering nothing means we ask the
        install again, so it can recover.
        """
        if not sections:
            return
        self.version = version
        self.sections = sections


def _merge_categories(
    existing: list[dict[str, Any]], new: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """The full category list categories/save expects: existing order preserved
    (updated in place where re-declared), then any genuinely-new ones appended."""
    new_by_id = {c.get("id"): c for c in new}
    merged = [new_by_id.pop(c.get("id"), c) for c in existing]
    merged.extend(new_by_id.values())
    return merged
