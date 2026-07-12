"""A human-facing before/after diff of a proposed scope vs its current scenes.

This is a summary for the confirm gate, not a semantic merge — `ambience/dry_run`
is the authoritative behavioural preview. Named scenes are matched by
(category, name); unnamed scenes fall back to position within the scope."""

from __future__ import annotations

from typing import Any

_TRANSIENT_FIELDS = {"shadowed_by", "missing_entities", "overlap_entities", "config_issues"}
# The backend annotates stored scenes with a computed sort key (`priority`) and a
# derived `pinned` flag that the AI never authors (it works by rank/order). Ignore
# them when summarising changes, or every re-submitted-unchanged scene would show
# as "updated"; the fingerprint and the actual write still use the full scene list.
_IGNORED_FIELDS = _TRANSIENT_FIELDS | {"priority", "pinned"}


def _key(scene: dict[str, Any], index: int) -> tuple[Any, ...]:
    name = scene.get("name")
    category = scene.get("category")
    if isinstance(name, str) and name.strip():
        return ("named", category, name.strip().lower())
    return ("idx", category, index)


def _comparable(scene: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in scene.items() if k not in _IGNORED_FIELDS}


def diff_scopes(current: list[dict[str, Any]], proposed: list[dict[str, Any]]) -> dict[str, list]:
    cur = {_key(s, i): s for i, s in enumerate(current)}
    pro = {_key(s, i): s for i, s in enumerate(proposed)}
    added = [pro[k] for k in pro if k not in cur]
    removed = [cur[k] for k in cur if k not in pro]
    updated = [
        {"before": cur[k], "after": pro[k]}
        for k in pro
        if k in cur and _comparable(cur[k]) != _comparable(pro[k])
    ]
    return {"added": added, "removed": removed, "updated": updated}


def _identify(scene: dict[str, Any], index: int) -> dict[str, Any]:
    """A compact, still-unique identifier for a scene: its name+category, plus a
    positional `index` when it has no name — `diff_scopes` itself falls back to
    position for unnamed scenes (see `_key`), so a `None` name is expected, not
    an error, and must still be distinguishable in a summary."""
    name = scene.get("name")
    entry: dict[str, Any] = {"name": name, "category": scene.get("category")}
    if not (isinstance(name, str) and name.strip()):
        entry["index"] = index
    return entry


def _changed_fields(before: dict[str, Any], after: dict[str, Any]) -> list[str]:
    b, a = _comparable(before), _comparable(after)
    return sorted(k for k in b.keys() | a.keys() if b.get(k) != a.get(k))


def summarise_diff(changes: dict[str, list]) -> dict[str, list]:
    """Elide scene BODIES from a `diff_scopes` result while keeping every entry.

    `fit_preview` reaches for this when the full diff busts the result budget.
    The safety rule it exists to uphold — a human must never approve a change
    they cannot see — depends on every changed scene still being LISTED, not on
    the full body being shown; the fields that make a diff entry "the scene the
    AI wants to touch" are its name/category (and, for an update, which fields
    actually changed), not its complete `actions`/`when`. So every entry in
    `added`/`removed`/`updated` survives; only the body is dropped.
    """
    added = [_identify(scene, i) for i, scene in enumerate(changes.get("added", []))]
    removed = [_identify(scene, i) for i, scene in enumerate(changes.get("removed", []))]
    updated = [
        {
            **_identify(pair["after"], i),
            "changed_fields": _changed_fields(pair["before"], pair["after"]),
        }
        for i, pair in enumerate(changes.get("updated", []))
    ]
    return {"added": added, "removed": removed, "updated": updated}
