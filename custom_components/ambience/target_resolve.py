"""Resolve a scene action's target (entity/device/area/label) to the in-scope
entity_ids it should act on.

Expansion reuses HA's own target helper; this module adds only the scene-scope
intersection. See docs/superpowers/specs/2026-06-25-action-target-selector-design.md.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.target import (
    TargetSelection,
    async_extract_referenced_entity_ids,
)

_TARGET_KEYS = ("entity_id", "device_id", "area_id", "label_id")


def action_target(action_spec: Mapping[str, Any]) -> dict[str, list[str]]:
    """The action's target as a normalized ``{key: [ids]}`` dict.

    Prefers an explicit ``target``; falls back to legacy ``entity_ids``. Empty
    selectors are dropped; a scalar id is coerced to a one-item list. Returns
    ``{}`` when the action has no target at all.
    """
    raw = action_spec.get("target")
    if not isinstance(raw, Mapping):
        eids = action_spec.get("entity_ids") or []
        raw = {"entity_id": eids} if eids else {}
    out: dict[str, list[str]] = {}
    for key in _TARGET_KEYS:
        val = raw.get(key)
        if val is None:
            continue
        ids = [val] if isinstance(val, str) else [v for v in val if isinstance(v, str)]
        if ids:
            out[key] = ids
    return out


def _expand(hass: HomeAssistant, selector: Mapping[str, Any]) -> set[str]:
    """All entity_ids HA resolves the given target selector to (global)."""
    selected = async_extract_referenced_entity_ids(hass, TargetSelection(dict(selector)))
    return set(selected.referenced) | set(selected.indirectly_referenced)


def _scope_entity_set(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None
) -> set[str] | None:
    """Entities considered in-scope. ``None`` means no constraint (house)."""
    if scope_kind == "house":
        return None
    if scope_kind == "area":
        return _expand(hass, {"area_id": [scope_id]})
    if scope_kind == "floor":
        return _expand(hass, {"floor_id": [scope_id]})
    return set()  # unknown scope kind → nothing in scope


def resolve_action_entities(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    target: Mapping[str, list[str]],
) -> list[str]:
    """Expand ``target`` to the sorted in-scope entity_ids it should act on.

    Empty ``target`` (or one that resolves to nothing in scope) yields ``[]``.
    """
    if not target:
        return []
    entities = _expand(hass, target)
    scoped = _scope_entity_set(hass, scope_kind, scope_id)
    if scoped is not None:
        entities &= scoped
    return sorted(entities)
