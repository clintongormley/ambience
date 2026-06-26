"""Resolve a scene action's target (entity/device/area/label) to the in-scope
entity_ids it should act on.

Expansion reuses HA's own target helper; this module adds only the scene-scope
intersection. See docs/superpowers/specs/2026-06-25-action-target-selector-design.md.

When ``_HAS_TARGET_HELPER`` is False (HA < 2026.1 where
``homeassistant.helpers.target`` does not exist), only direct ``entity_id``
targets can be resolved. Area/device/label/floor expansion is simply not
available on those versions.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant

try:
    from homeassistant.helpers.target import (
        TargetSelection,
        async_extract_referenced_entity_ids,
    )

    _HAS_TARGET_HELPER = True
except ImportError:  # pragma: no cover - exercised only on HA < 2026.1 (CI min job)
    _HAS_TARGET_HELPER = False

_TARGET_KEYS = ("entity_id", "device_id", "area_id", "label_id", "floor_id")


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
        # HA's ha-target-picker may emit a scalar string or a list; a non-string
        # non-iterable (e.g. int/bool from malformed YAML) is silently dropped.
        if isinstance(val, str):
            ids = [val]
        elif isinstance(val, (list, tuple)):
            ids = [v for v in val if isinstance(v, str)]
        else:
            ids = []
        if ids:
            out[key] = ids
    return out


def _expand(hass: HomeAssistant, selector: Mapping[str, Any]) -> set[str]:
    """All entity_ids HA resolves the given target selector to (global).

    Returns an empty set when ``_HAS_TARGET_HELPER`` is False (HA < 2026.1);
    only direct ``entity_id`` values in the target will survive resolution.
    """
    if not _HAS_TARGET_HELPER:
        return set()
    sel = async_extract_referenced_entity_ids(hass, TargetSelection(dict(selector)))
    return set(sel.referenced) | set(sel.indirectly_referenced)


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

    A directly-named ``entity_id`` is the scene author's deliberate choice and
    is forwarded unchanged (never scope-clipped). Indirect *action-target*
    selectors (``area_id``, ``device_id``, ``label_id``, ``floor_id``) ARE
    scope-clipped: HA's native target picker offers a Floor chip at all scope
    levels, and at area/floor scope it harmlessly clips to that scope. The
    expansion is handled by HA's ``async_extract_referenced_entity_ids``
    (via ``_expand``); no additional logic is needed here for floor_id.

    Empty ``target`` (or one that resolves to nothing in scope) yields ``[]``.
    """
    if not target:
        return []
    # Direct entity_id is the scene author's deliberate choice → never clipped.
    direct = set(target.get("entity_id") or [])
    # Indirect selectors (area/device/label/floor_id) ARE scope-clipped.
    indirect = {k: v for k, v in target.items() if k != "entity_id"}
    expanded = _expand(hass, indirect) if indirect else set()
    scoped = _scope_entity_set(hass, scope_kind, scope_id)
    if scoped is not None:  # house → scoped is None → no clip
        expanded &= scoped
    return sorted(direct | expanded)
