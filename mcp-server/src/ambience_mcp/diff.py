"""A human-facing before/after diff of a proposed scope vs its current scenes.

This is a summary for the confirm gate, not a semantic merge — `ambience/dry_run`
is the authoritative behavioural preview. Named scenes are matched by
(category, name); unnamed scenes fall back to position within the scope."""

from __future__ import annotations

from typing import Any

_TRANSIENT_FIELDS = {"shadowed_by", "missing_entities", "overlap_entities", "config_issues"}
# Backend-injected per-scene hints, never authored — always ignored. Pinned to
# the backend's _TRANSIENT_SCENE_FIELDS by tests/test_protocol_shape.py.

# Evaluation-order fields. The backend HONOURS these on import
# (websocket_helpers.validate_scope_config: "'priority'/'pinned' are authorable
# on import to set evaluation order"), so they are part of the diff whenever
# the PROPOSED scene states them explicitly — an order-only change must never
# preview as "no changes". When the proposal omits them, the backend re-derives
# order (auto-sort + minimise_pins): that is the normal author-by-list-order
# workflow, so omission is not flagged per scene — diff_scopes emits one
# scope-level `order_note` instead.
_ORDER_FIELDS = {"priority", "pinned"}


def _key(scene: dict[str, Any], index: int) -> tuple[Any, ...]:
    name = scene.get("name")
    category = scene.get("category")
    if isinstance(name, str) and name.strip():
        return ("named", category, name.strip().lower())
    return ("idx", category, index)


def _authored_order_keys(scene: dict[str, Any]) -> frozenset[str]:
    """The order fields this proposed scene explicitly states."""
    return frozenset(_ORDER_FIELDS & scene.keys())


def _comparable(scene: dict[str, Any], order_keys: frozenset[str] = frozenset()) -> dict[str, Any]:
    ignored = (_TRANSIENT_FIELDS | _ORDER_FIELDS) - order_keys
    return {k: v for k, v in scene.items() if k not in ignored}


def diff_scopes(current: list[dict[str, Any]], proposed: list[dict[str, Any]]) -> dict[str, Any]:
    cur = {_key(s, i): s for i, s in enumerate(current)}
    pro = {_key(s, i): s for i, s in enumerate(proposed)}
    added = [pro[k] for k in pro if k not in cur]
    removed = [cur[k] for k in cur if k not in pro]
    updated = []
    for k in pro:
        if k not in cur:
            continue
        order_keys = _authored_order_keys(pro[k])
        if _comparable(cur[k], order_keys) != _comparable(pro[k], order_keys):
            updated.append({"before": cur[k], "after": pro[k]})
    changes: dict[str, Any] = {"added": added, "removed": removed, "updated": updated}
    dropped_order = [k for k in pro if k in cur and (_ORDER_FIELDS & cur[k].keys()) - pro[k].keys()]
    if dropped_order:
        changes["order_note"] = (
            f"{len(dropped_order)} existing scene(s) were resubmitted without one or "
            "more of their stored priority/pinned fields; the backend will re-derive "
            "evaluation order (for the dropped field(s)) from list order and "
            "specificity on apply. Carry those fields forward from ambience_get_scope "
            "to keep the stored order."
        )
    return changes


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
    order_keys = _authored_order_keys(after)
    b, a = _comparable(before, order_keys), _comparable(after, order_keys)
    return sorted(k for k in b.keys() | a.keys() if b.get(k) != a.get(k))


def summarise_diff(changes: dict[str, Any]) -> dict[str, Any]:
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
    summary: dict[str, Any] = {"added": added, "removed": removed, "updated": updated}
    if "order_note" in changes:
        summary["order_note"] = changes["order_note"]
    return summary
