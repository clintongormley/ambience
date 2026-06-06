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
from .const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DOMAIN,
    GENERAL_CATEGORY_ID,
)
from .sorting import resolve_order, shadowed_by
from .store import reassign_orphan_scenes
from .validators import validate_reapply_seconds

_LOGGER = logging.getLogger(__name__)

_SENSOR_DEPENDENT_KINDS = {"workday", "holiday"}
_CALENDAR_DEPENDENT_KINDS = {"first_workday", "last_workday"}


# --- scope-save pipeline ----------------------------------------------------


def validate_scope_config(hass: HomeAssistant, config: dict[str, Any]) -> None:
    if not isinstance(config, dict):
        raise ValueError("config must be an object")
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    # Server-side backstop for the frontend's per (scope, category) scene-name
    # uniqueness rule: a non-empty name must be unique (case-insensitively,
    # trimmed) within its category. Empty/unnamed scenes are exempt.
    seen_names: dict[tuple[Any, str], int] = {}
    for scene_idx, scene in enumerate(config.get("scenes", [])):
        name = scene.get("name")
        if isinstance(name, str) and name.strip():
            name_key = (scene.get("category"), name.strip().lower())
            if name_key in seen_names:
                raise ValueError(
                    f"scene {scene_idx}: a scene named {name.strip()!r} "
                    f"already exists in this category"
                )
            seen_names[name_key] = scene_idx
        when = scene.get("when", {})
        for key, predicate in when.items():
            if predicate is None:
                continue
            if key not in conditions_registry:
                raise ValueError(f"scene {scene_idx}: unknown condition {key}")
            conditions_registry[key].validate_predicate(predicate)
        for action_idx, action_spec in enumerate(scene.get("actions", [])):
            service_id = action_spec.get("service")
            if not isinstance(service_id, str) or "." not in service_id:
                raise ValueError(
                    f"scene {scene_idx} action {action_idx}: missing or malformed `service`"
                )
            exposed = exposed_store.get(service_id)
            if exposed is None:
                raise ValueError(
                    f"scene {scene_idx} action {action_idx}: service {service_id!r} not exposed"
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
            # at execution. The save-time dangling-scene warnings surface this
            # to the user; the engine treats them as overrides.
            # `exposed` is used here only for the existence check above.
            _ = exposed
            if "reapply_seconds" in action_spec:
                validate_reapply_seconds(
                    f"scene {scene_idx} action {action_idx}", action_spec["reapply_seconds"]
                )


def canonicalise(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, Any]:
    """Resolve scene order + numbers for storage. Strips the transient per-scene
    `shadowed_by` hint so it isn't persisted."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    out = dict(config)
    scenes = [{k: v for k, v in r.items() if k != "shadowed_by"} for r in config.get("scenes", [])]
    out["scenes"] = resolve_order(scenes, conditions_registry)
    return out


def with_shadows(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, Any]:
    """Return a copy whose scenes carry a transient `shadowed_by` index (or None).
    Not persisted — only sent to the frontend."""
    conditions_registry = hass.data[DOMAIN][DATA_CONDITIONS]
    scenes = config.get("scenes", [])
    shadows = shadowed_by(scenes, conditions_registry)
    return {
        **config,
        "scenes": [{**r, "shadowed_by": shadows.get(idx)} for idx, r in enumerate(scenes)],
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


# --- dangling-reference warnings --------------------------------------------


def missing_period_refs(predicate: Any, effective_ids: set[str]) -> list[str]:
    """Return a list of period ids referenced by predicate that are not in effective_ids."""
    if predicate is None:
        return []
    if isinstance(predicate, list):
        result: list[str] = []
        for item in predicate:
            result.extend(missing_period_refs(item, effective_ids))
        return result
    if isinstance(predicate, dict) and "period" in predicate:
        pid = predicate["period"]
        if isinstance(pid, str) and pid not in effective_ids:
            return [pid]
    return []


def missing_lux_refs(predicate: Any, effective_ids: set[str]) -> list[str]:
    """Return lux range ids referenced by predicate that are not in effective_ids."""
    if isinstance(predicate, dict) and "range" in predicate:
        rid = predicate["range"]
        if isinstance(rid, str) and rid not in effective_ids:
            return [rid]
    return []


def dangling_day_entity_warnings(hass: HomeAssistant, cfg: dict[str, Any]) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    sensor_ok = bool(cfg.get("workday_sensor"))
    calendar_ok = bool(cfg.get("workday_calendar"))
    warnings: list[dict[str, Any]] = []
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for scene in scope_cfg.get("scenes", []):
            pred = scene.get("when", {}).get("day")
            if not isinstance(pred, dict):
                continue
            for slot in (pred.get("include") or []) + (pred.get("exclude") or []):
                kind = (slot or {}).get("kind")
                if kind in _SENSOR_DEPENDENT_KINDS and not sensor_ok:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "scene_name": scene.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_sensor` is unset",
                        }
                    )
                if kind in _CALENDAR_DEPENDENT_KINDS and not calendar_ok:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "scene_name": scene.get("name", ""),
                            "reason": f"uses `{kind}` item but `workday_calendar` is unset",
                        }
                    )
    return warnings


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


def weather_predicate_active(pred: Any) -> bool:
    return isinstance(pred, dict) and bool(pred.get("groups") or pred.get("thresholds"))


def dangling_weather_warnings(
    hass: HomeAssistant,
    old_cfg: dict[str, Any],
    new_cfg: dict[str, Any],
) -> list[dict[str, Any]]:
    store = hass.data[DOMAIN][DATA_STORE]
    new_ids = {g["id"] for g in (new_cfg.get("groups") or [])}
    old_ids = {g["id"] for g in (old_cfg.get("groups") or [])}
    removed_ids = old_ids - new_ids
    entity_cleared = not new_cfg.get("entity")

    warnings: list[dict[str, Any]] = []
    for scope_kind, scope_id, scope_cfg in store.all_scope_configs():
        for scene in scope_cfg.get("scenes", []):
            pred = scene.get("when", {}).get("weather")
            if not weather_predicate_active(pred):
                continue
            if entity_cleared:
                warnings.append(
                    {
                        "scope_kind": scope_kind,
                        "scope_id": scope_id,
                        "scene_name": scene.get("name", ""),
                        "reason": "uses a weather predicate but the weather entity is unset",
                    }
                )
            for gid in pred.get("groups", []):
                if gid in removed_ids:
                    warnings.append(
                        {
                            "scope_kind": scope_kind,
                            "scope_id": scope_id,
                            "scene_name": scene.get("name", ""),
                            "reason": f"references deleted weather group {gid!r}",
                        }
                    )
    return warnings
