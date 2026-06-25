"""Resolve a scene action's target (entity/device/area/label) to the in-scope
entity_ids it should act on.

Expansion reuses HA's own target helper; this module adds only the scene-scope
intersection. See docs/superpowers/specs/2026-06-25-action-target-selector-design.md.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

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
