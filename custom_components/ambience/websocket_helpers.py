"""Pure helpers for the Ambience websocket API.

Validation, canonicalisation and scene-annotation helpers, factored out
of websocket.py so that file holds just the command handlers + registration.
None of these touch the connection; they take plain data (and `hass` for store
lookups) and return values or raise AmbienceError.
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
from .errors import AmbienceError
from .sorting import minimise_pins as minimise_pins_fn
from .sorting import resolve_order, shadowed_by
from .store import reassign_orphan_scenes

_LOGGER = logging.getLogger(__name__)

# --- scope-save pipeline ----------------------------------------------------


# Top-level keys a scope-save payload may carry; anything else is a client bug
# (or a typo in a hand-written import) and is rejected rather than merged into
# storage. `enabled` is accepted from older clients but never persisted
# (canonicalise strips it): `ambience/set_scope_enabled` is the only writer of the
# scope-level flag, so a save from a stale tab cannot revert a scope someone
# enabled elsewhere. `conditions` is a dead legacy field, tolerated so an old
# client's payload still saves.
_SCOPE_CONFIG_KEYS = ("scenes", "enabled", "conditions")


def validate_scope_config(hass: HomeAssistant, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise AmbienceError("scene_config_not_object")
    for key in config:
        if key not in _SCOPE_CONFIG_KEYS:
            raise AmbienceError("scene_config_unknown_key", key=key)
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    # Shape guards: the ws schema only requires `config` to be a dict, so the
    # nested shapes must be checked here — an AttributeError on hand-edited /
    # corrupted data would escape the handlers' `except ValueError` and surface
    # as an opaque unknown_error plus a logged traceback.
    scenes = config.get("scenes", [])
    if not isinstance(scenes, list):
        raise AmbienceError("scene_scenes_not_list")
    # Server-side backstop for the frontend's per (scope, category) scene-name
    # uniqueness rule: a non-empty name must be unique (case-insensitively,
    # trimmed) within its category. Empty/unnamed scenes are exempt.
    seen_names: dict[tuple[Any, str], int] = {}
    for scene_idx, scene in enumerate(scenes):
        if not isinstance(scene, dict):
            raise AmbienceError("scene_not_object", scene_idx=scene_idx)
        category = scene.get("category")
        # `category` is a string id (or absent). Checked for EVERY scene — named
        # or not — because the category is a hash key downstream (sorting's
        # per-category buckets), where a non-hashable value would escape the
        # websocket validation path as an opaque TypeError.
        if category is not None and not isinstance(category, str):
            raise AmbienceError("scene_category_not_string", scene_idx=scene_idx)
        name = scene.get("name")
        if isinstance(name, str) and name.strip():
            name_key = (category, name.strip().lower())
            if name_key in seen_names:
                raise AmbienceError("scene_dup_name", scene_idx=scene_idx, name=name.strip())
            seen_names[name_key] = scene_idx
        description = scene.get("description")
        if description is not None and not isinstance(description, str):
            raise AmbienceError("scene_description_not_string", scene_idx=scene_idx)
        when = scene.get("when", {})
        if not isinstance(when, dict):
            raise AmbienceError("scene_when_not_object", scene_idx=scene_idx)
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key not in conditions_registry:
                raise AmbienceError("scene_unknown_condition", scene_idx=scene_idx, key=key)
            conditions_registry[key].validate_predicate(predicate)
        actions = scene.get("actions", [])
        if not isinstance(actions, list):
            raise AmbienceError("scene_actions_not_list", scene_idx=scene_idx)
        for action_idx, action_spec in enumerate(actions):
            if not isinstance(action_spec, dict):
                raise AmbienceError(
                    "scene_action_not_object", scene_idx=scene_idx, action_idx=action_idx
                )
            service_id = action_spec.get("service")
            if not isinstance(service_id, str) or "." not in service_id:
                raise AmbienceError(
                    "scene_action_service_invalid", scene_idx=scene_idx, action_idx=action_idx
                )
            entity_ids = action_spec.get("entity_ids", [])
            if not isinstance(entity_ids, list):
                raise AmbienceError(
                    "scene_action_entity_ids_not_list", scene_idx=scene_idx, action_idx=action_idx
                )
            if not all(isinstance(eid, str) and eid for eid in entity_ids):
                raise AmbienceError(
                    "scene_action_entity_ids_not_strings",
                    scene_idx=scene_idx,
                    action_idx=action_idx,
                )
            params = action_spec.get("params", {})
            if not isinstance(params, dict):
                raise AmbienceError(
                    "scene_action_params_not_object", scene_idx=scene_idx, action_idx=action_idx
                )
            # Note: params keys are NOT whitelisted against visible_fields.
            # A scene may carry extra params for fields that have since been
            # hidden in settings (or were never exposed); they're still sent
            # at execution. The engine treats them as overrides.
        apply = scene.get("apply")
        if apply is not None and apply not in ("once", "always"):
            raise AmbienceError("scene_apply_invalid", scene_idx=scene_idx, value=apply)
        # `priority`/`pinned` are authorable on import to set evaluation order.
        # Validate their types so a mistyped value is a clear error, not a silently
        # wrong order (bool is an int subclass, so reject it explicitly).
        priority = scene.get("priority")
        if priority is not None and (not isinstance(priority, int) or isinstance(priority, bool)):
            raise AmbienceError("scene_priority_invalid", scene_idx=scene_idx, value=priority)
        pinned = scene.get("pinned")
        if pinned is not None and not isinstance(pinned, bool):
            raise AmbienceError("scene_pinned_invalid", scene_idx=scene_idx, value=pinned)


# Transient per-scene hints injected for the frontend by annotate_scenes; stripped
# by canonicalise so they're never persisted.
_TRANSIENT_SCENE_FIELDS = ("shadowed_by", "missing_entities", "overlap_entities", "config_issues")


def canonicalise(
    hass: HomeAssistant, config: dict[str, Any], *, minimise_pins: bool = False
) -> dict[str, Any]:
    """Resolve scene order + numbers for storage. Strips the transient per-scene
    frontend hints (`shadowed_by`, `missing_entities`, `overlap_entities`,
    `config_issues`) so they aren't persisted, and the scope-level `enabled`
    flag — the store merges what it is given, and only
    `ambience/set_scope_enabled` may write that flag.

    When ``minimise_pins`` is set (the import path), a scene carrying an explicit
    ``priority`` is treated as pinned and then unpinned where the containment
    order already reproduces it — so an import can set order while storage keeps
    pins only where they truly override the natural order."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    out = {k: v for k, v in config.items() if k != "enabled"}
    scenes = [
        {k: v for k, v in r.items() if k not in _TRANSIENT_SCENE_FIELDS}
        for r in config.get("scenes", [])
    ]
    # Normalise each condition predicate into its stored form. A condition may
    # expose an optional `normalize_predicate` (only `state` does today) to strip
    # redundant editor wrappers (e.g. the group "( )" wrap's single-child / same-op
    # nesting). Runs once here at save, so live editing keeps the wrappers visible.
    for scene in scenes:
        when = scene.get("when")
        if not isinstance(when, dict):
            continue
        normalised: dict[str, Any] = {}
        for key, predicate in when.items():
            normalizer = getattr(conditions_registry.get(key), "normalize_predicate", None)
            normalised[key] = normalizer(predicate) if normalizer else predicate
        scene["when"] = normalised
    if minimise_pins:
        scenes = minimise_pins_fn(scenes, conditions_registry)
    out["scenes"] = resolve_order(scenes, conditions_registry)
    return out


def annotate_scenes(
    hass: HomeAssistant, config: dict[str, Any], *, fresh_overlap: bool = False
) -> dict[str, Any]:
    """Return a copy whose scenes carry transient frontend-only problem hints:
    `shadowed_by` (index or None), `missing_entities`, `overlap_entities`, and
    `config_issues`. Not persisted — canonicalise() strips them before storage.

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


def coerce_scene_categories(store, config: dict) -> bool:
    """Point any scene with no category / an unknown category at General (or, if General
    was deleted, the first existing category), logging once. Mutates `config`. This is
    the single place that enforces the every-scene-has-a-real-category invariant.

    Returns True when a scene was moved, so a caller that skips canonicalisation
    can tell that the category buckets changed and must be re-resolved (priorities
    are only canonical within a category)."""
    known = {c["id"] for c in store.categories()}
    target = (
        GENERAL_CATEGORY_ID
        if GENERAL_CATEGORY_ID in known
        else next(iter(known), GENERAL_CATEGORY_ID)
    )
    if not reassign_orphan_scenes(config.get("scenes", []), known, target):
        return False
    _LOGGER.warning(
        "ambience: scope save had uncategorised/unknown-category scene(s); set to General"
    )
    return True


def validate_weather_groups(groups: Any) -> list[dict[str, Any]]:
    if groups is None:
        return []
    if not isinstance(groups, list):
        raise AmbienceError("weather_groups_not_list")
    seen_ids: set[str] = set()
    valid_conditions = set(WEATHER_CONDITIONS)
    cleaned: list[dict[str, Any]] = []
    for raw in groups:
        if not isinstance(raw, dict):
            raise AmbienceError("weather_group_not_object")
        gid = raw.get("id")
        label = raw.get("label")
        conds = raw.get("conditions")
        if not isinstance(gid, str) or not gid:
            raise AmbienceError("weather_group_id_empty", gid=gid)
        if gid in seen_ids:
            raise AmbienceError("weather_group_id_duplicate", gid=gid)
        seen_ids.add(gid)
        if not isinstance(label, str) or not label:
            raise AmbienceError("weather_group_label_empty", gid=gid)
        if not isinstance(conds, list) or any(
            not isinstance(c, str) or c not in valid_conditions for c in conds
        ):
            raise AmbienceError("weather_group_invalid_conditions", gid=gid)
        cleaned.append({"id": gid, "label": label, "conditions": list(conds)})
    return cleaned
