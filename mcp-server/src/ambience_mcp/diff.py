"""A human-facing before/after diff of a proposed scope vs its current scenes.

This is a summary for the confirm gate, not a semantic merge — `ambience/dry_run`
is the authoritative behavioural preview. Named scenes are matched by
(category, name); unnamed scenes fall back to position within the scope."""

from __future__ import annotations

from typing import Any

_TRANSIENT_FIELDS = {"shadowed_by", "missing_entities", "overlap_entities", "config_issues"}


def _key(scene: dict[str, Any], index: int) -> tuple[Any, ...]:
    name = scene.get("name")
    category = scene.get("category")
    if isinstance(name, str) and name.strip():
        return ("named", category, name.strip().lower())
    return ("idx", category, index)


def _comparable(scene: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in scene.items() if k not in _TRANSIENT_FIELDS}


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
