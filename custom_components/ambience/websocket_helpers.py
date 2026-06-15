"""Pure helpers for the Ambience websocket API.

Validation, canonicalisation and dangling-reference warning logic, factored out
of websocket.py so that file holds just the command handlers + registration.
None of these touch the connection; they take plain data (and `hass` for store
lookups) and return values or raise ValueError.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .conditions.weather import WEATHER_CONDITIONS
from .config_health import scene_annotations
from .const import (
    DATA_CONDITIONS,
    DOMAIN,
    GENERAL_CATEGORY_ID,
)
from .sorting import resolve_order, shadowed_by
from .store import reassign_orphan_scenes

_LOGGER = logging.getLogger(__name__)

# --- scope-save pipeline ----------------------------------------------------


def validate_scope_config(hass: HomeAssistant, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    # Shape guards: the ws schema only requires `config` to be a dict, so the
    # nested shapes must be checked here — an AttributeError on hand-edited /
    # corrupted data would escape the handlers' `except ValueError` and surface
    # as an opaque unknown_error plus a logged traceback.
    scenes = config.get("scenes", [])
    if not isinstance(scenes, list):
        raise ValueError("`scenes` must be a list")
    # Server-side backstop for the frontend's per (scope, category) scene-name
    # uniqueness rule: a non-empty name must be unique (case-insensitively,
    # trimmed) within its category. Empty/unnamed scenes are exempt.
    seen_names: dict[tuple[Any, str], int] = {}
    for scene_idx, scene in enumerate(scenes):
        if not isinstance(scene, dict):
            raise ValueError(f"scene {scene_idx}: must be an object")
        name = scene.get("name")
        if isinstance(name, str) and name.strip():
            category = scene.get("category")
            # `category` is a string id (or absent). Guard against corrupted /
            # hand-edited storage so a non-hashable value raises a clean
            # ValueError here instead of an unhashable-key TypeError that would
            # escape the websocket validation path.
            if category is not None and not isinstance(category, str):
                raise ValueError(f"scene {scene_idx}: category must be a string")
            name_key = (category, name.strip().lower())
            if name_key in seen_names:
                raise ValueError(
                    f"scene {scene_idx}: a scene named {name.strip()!r} "
                    f"already exists in this category"
                )
            seen_names[name_key] = scene_idx
        when = scene.get("when", {})
        if not isinstance(when, dict):
            raise ValueError(f"scene {scene_idx}: `when` must be an object")
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key not in conditions_registry:
                raise ValueError(f"scene {scene_idx}: unknown condition {key}")
            conditions_registry[key].validate_predicate(predicate)
        actions = scene.get("actions", [])
        if not isinstance(actions, list):
            raise ValueError(f"scene {scene_idx}: `actions` must be a list")
        for action_idx, action_spec in enumerate(actions):
            if not isinstance(action_spec, dict):
                raise ValueError(f"scene {scene_idx} action {action_idx}: must be an object")
            service_id = action_spec.get("service")
            if not isinstance(service_id, str) or "." not in service_id:
                raise ValueError(
                    f"scene {scene_idx} action {action_idx}: missing or malformed `service`"
                )
            entity_ids = action_spec.get("entity_ids", [])
            if not isinstance(entity_ids, list):
                raise ValueError(
                    f"scene {scene_idx} action {action_idx}: entity_ids must be a list"
                )
            if not all(isinstance(eid, str) and eid for eid in entity_ids):
                raise ValueError(
                    f"scene {scene_idx} action {action_idx}: entity_ids must be non-empty strings"
                )
            params = action_spec.get("params", {})
            if not isinstance(params, dict):
                raise ValueError(f"scene {scene_idx} action {action_idx}: params must be an object")
            # Note: params keys are NOT whitelisted against visible_fields.
            # A scene may carry extra params for fields that have since been
            # hidden in settings (or were never exposed); they're still sent
            # at execution. The engine treats them as overrides.


# Transient per-scene hints injected for the frontend by annotate_scenes; stripped
# by canonicalise so they're never persisted.
_TRANSIENT_SCENE_FIELDS = ("shadowed_by", "missing_entities", "overlap_entities", "config_issues")


def canonicalise(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, Any]:
    """Resolve scene order + numbers for storage. Strips the transient per-scene
    frontend hints (`shadowed_by`, `missing_entities`, `overlap_entities`) so they
    aren't persisted."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    out = dict(config)
    scenes = [
        {k: v for k, v in r.items() if k not in _TRANSIENT_SCENE_FIELDS}
        for r in config.get("scenes", [])
    ]
    out["scenes"] = resolve_order(scenes, conditions_registry)
    return out


def annotate_scenes(
    hass: HomeAssistant, config: dict[str, Any], *, fresh_overlap: bool = False
) -> dict[str, Any]:
    """Return a copy whose scenes carry transient frontend-only problem hints:
    `shadowed_by` (index or None), `missing_entities`, and `overlap_entities`.
    Not persisted — canonicalise() strips all three before storage.

    `fresh_overlap=True` recomputes the global overlap set instead of reading the
    cache; pass it on the save path so the save response reflects the new config."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    scenes = config.get("scenes", [])
    shadows = shadowed_by(scenes, conditions_registry)
    annos = scene_annotations(hass, config, fresh_overlap=fresh_overlap)
    return {
        **config,
        "scenes": [
            {**scene, "shadowed_by": shadows.get(idx), **annos[idx]}
            for idx, scene in enumerate(scenes)
        ],
    }


def coerce_scene_categories(store, config: dict) -> None:
    """Point any scene with no category / an unknown category at General (or, if General
    was deleted, the first existing category), logging once. Mutates `config`. This is
    the single place that enforces the every-scene-has-a-real-category invariant."""
    known = {c["id"] for c in store.categories()}
    target = (
        GENERAL_CATEGORY_ID
        if GENERAL_CATEGORY_ID in known
        else next(iter(known), GENERAL_CATEGORY_ID)
    )
    if reassign_orphan_scenes(config.get("scenes", []), known, target):
        _LOGGER.warning(
            "ambience: scope save had uncategorised/unknown-category scene(s); set to General"
        )


def validate_weather_groups(groups: Any) -> list[dict[str, Any]]:
    if groups is None:
        return []
    if not isinstance(groups, list):
        raise ValueError("groups must be a list")
    seen_ids: set[str] = set()
    valid_conditions = set(WEATHER_CONDITIONS)
    cleaned: list[dict[str, Any]] = []
    for raw in groups:
        if not isinstance(raw, dict):
            raise ValueError("each group must be an object")
        gid = raw.get("id")
        label = raw.get("label")
        conds = raw.get("conditions")
        if not isinstance(gid, str) or not gid:
            raise ValueError(f"group id must be a non-empty string: {gid!r}")
        if gid in seen_ids:
            raise ValueError(f"duplicate group id: {gid!r}")
        seen_ids.add(gid)
        if not isinstance(label, str) or not label:
            raise ValueError(f"group {gid!r} label must be a non-empty string")
        if not isinstance(conds, list) or any(
            not isinstance(c, str) or c not in valid_conditions for c in conds
        ):
            raise ValueError(f"group {gid!r} has invalid condition(s)")
        cleaned.append({"id": gid, "label": label, "conditions": list(conds)})
    return cleaned
