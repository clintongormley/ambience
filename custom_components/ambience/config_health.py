"""Detect config-health problems: scenes referencing non-existent entities, and
entities acted on by more than one (scope, category) group.

Pure detection: a single source of truth consumed by the Repairs reconciler
(`config_health_issues.reconcile_issues`). It reads the live entity universe via
`hass` (states + entity registry) but otherwise just walks plain config dicts.
"""

from __future__ import annotations

from collections.abc import Iterable, Iterator
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .conditions.weather import weather_predicate_active
from .const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_LUX_RANGES,
    DATA_OVERLAP_SET,
    DATA_PERIODS,
    DATA_STORE,
    DOMAIN,
)
from .engine import scene_enabled
from .scope_triggers import iter_predicate_specs

ScopeTriple = tuple[str, str | None, dict[str, Any]]


@dataclass(frozen=True)
class Location:
    """Where a problem was found."""

    scope_kind: str
    scope_id: str | None
    category_id: str | None
    scene_name: str


@dataclass(frozen=True)
class Problem:
    """One config-health problem.

    `kind` selects the problem type (see scan()); `ref` is whatever identifies
    it — an entity id, a service id, a period/lux/weather-group id, or a fixed
    sentinel like "workday_sensor" for the config-flag kinds. `locations` lists
    every (scope, category, scene) the problem was found in.
    """

    kind: str
    ref: str
    locations: tuple[Location, ...]


# Day-item kinds whose evaluation needs the Workday integration's sensor /
# calendar. Moved here from websocket_helpers so scan() and scene_annotations
# share one definition. (The websocket dangling_* copies are deleted in Phase 7.)
_SENSOR_DEPENDENT_KINDS = {"workday", "holiday"}
_CALENDAR_DEPENDENT_KINDS = {"first_workday", "last_workday"}


@dataclass(frozen=True)
class _RefContext:
    """Live config snapshot for dangling-reference detection, built once per scan."""

    workday_sensor: bool  # True when a workday sensor is configured
    workday_calendar: bool  # True when a workday calendar is configured
    weather_entity: bool  # True when a weather entity is configured
    weather_group_ids: frozenset[str]
    period_ids: frozenset[str]
    lux_ids: frozenset[str]
    exposed_services: frozenset[str]


def _build_ref_context(hass: HomeAssistant) -> _RefContext:
    """Snapshot the live config-reference universe once, for per-scene detection."""
    domain = hass.data[DOMAIN]
    store = domain[DATA_STORE]
    day = store.get_condition_config("day")
    weather = store.get_condition_config("weather")
    exposed = domain[DATA_EXPOSED_ACTIONS]
    return _RefContext(
        workday_sensor=bool(day.get("workday_sensor")),
        workday_calendar=bool(day.get("workday_calendar")),
        weather_entity=bool(weather.get("entity")),
        weather_group_ids=frozenset(
            g.get("id") for g in (weather.get("groups") or []) if isinstance(g.get("id"), str)
        ),
        period_ids=frozenset(domain[DATA_PERIODS].effective()),
        lux_ids=frozenset(domain[DATA_LUX_RANGES].effective()),
        exposed_services=frozenset(
            sid for a in exposed.list() if isinstance((sid := a.get("id")), str)
        ),
    )


def scene_config_issues(ctx: _RefContext, scene: dict[str, Any]) -> list[tuple[str, str]]:
    """Ordered, de-duplicated (kind, ref) dangling-reference problems for one
    ENABLED scene. The single source shared by scan() (Repairs) and
    scene_annotations() (per-scene badges)."""
    if not scene_enabled(scene):
        return []
    issues: list[tuple[str, str]] = []
    when = scene.get("when", {}) or {}

    day_pred = when.get("day")
    if isinstance(day_pred, dict):
        for slot in (day_pred.get("include") or []) + (day_pred.get("exclude") or []):
            kind = (slot or {}).get("kind")
            if kind in _SENSOR_DEPENDENT_KINDS and not ctx.workday_sensor:
                issues.append(("missing_workday_sensor", "workday_sensor"))
            if kind in _CALENDAR_DEPENDENT_KINDS and not ctx.workday_calendar:
                issues.append(("missing_workday_calendar", "workday_calendar"))

    weather_pred = when.get("weather")
    if weather_predicate_active(weather_pred):
        if not ctx.weather_entity:
            issues.append(("missing_weather_entity", "weather_entity"))
        for gid in weather_pred.get("groups") or []:
            if isinstance(gid, str) and gid not in ctx.weather_group_ids:
                issues.append(("missing_weather_group", gid))

    for pid in missing_period_refs(when.get("time_of_day"), set(ctx.period_ids)):
        issues.append(("missing_period", pid))
    for rid in missing_lux_refs(when.get("lux"), set(ctx.lux_ids)):
        issues.append(("missing_lux_range", rid))

    for action in scene.get("actions", []) or []:
        sid = action.get("service")
        if isinstance(sid, str) and sid and sid not in ctx.exposed_services:
            issues.append(("unexposed_action", sid))

    # De-dup while preserving first-seen order.
    seen: set[tuple[str, str]] = set()
    out: list[tuple[str, str]] = []
    for item in issues:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def missing_period_refs(predicate: Any, effective_ids: set[str]) -> list[str]:
    """Period ids referenced by `predicate` that are not in `effective_ids`."""
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
    """Lux-range ids referenced by `predicate` that are not in `effective_ids`."""
    if isinstance(predicate, dict) and "range" in predicate:
        rid = predicate["range"]
        if isinstance(rid, str) and rid not in effective_ids:
            return [rid]
    return []


def entity_exists(hass: HomeAssistant, entity_id: str) -> bool:
    """True if the entity has a state OR is in the entity registry.

    A currently-"unavailable" entity has a state object -> exists -> not a
    problem. Only entities absent from BOTH (typos / deleted) are "missing".
    """
    if hass.states.get(entity_id) is not None:
        return True
    return er.async_get(hass).async_get(entity_id) is not None


def _action_entities(scene: dict[str, Any]) -> Iterator[str]:
    for action in scene.get("actions", []) or []:
        for eid in action.get("entity_ids", []) or []:
            if isinstance(eid, str) and eid:
                yield eid


def referenced_entities_by_scene(
    conditions: dict[str, Any], cfg: dict[str, Any]
) -> dict[int, set[str]]:
    """Entity ids each ENABLED scene references (monitored + acted), keyed by scene
    index. Monitored entities come from iter_predicate_specs (which already skips
    disabled scenes); acted entities from enabled scenes only. This mirrors scan()'s
    reference policy exactly, so the frontend flag can never diverge from the
    Repairs issue."""
    scenes = cfg.get("scenes", []) or []
    out: dict[int, set[str]] = {}
    for scene_index, _condition_key, spec in iter_predicate_specs(conditions, cfg):
        out.setdefault(scene_index, set()).update(spec.entities)
    for idx, scene in enumerate(scenes):
        if not scene_enabled(scene):
            continue
        acted = set(_action_entities(scene))
        if acted:
            out.setdefault(idx, set()).update(acted)
    return out


def scan(hass: HomeAssistant, configs: Iterable[ScopeTriple]) -> list[Problem]:
    """Return every config-health problem across `configs`.

    `configs` is an iterable of (scope_kind, scope_id, cfg) triples - pass
    `store.all_scope_configs()` directly.
    """
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    configs = list(configs)

    # 1. Missing entities, aggregated per (scope_kind, scope_id, entity_id).
    missing: dict[tuple[str, str | None, str], list[Location]] = {}

    def note_missing(
        scope_kind: str, scope_id: str | None, eid: str, scene: dict[str, Any]
    ) -> None:
        if entity_exists(hass, eid):
            return
        loc = Location(scope_kind, scope_id, scene.get("category"), scene.get("name") or "")
        bucket = missing.setdefault((scope_kind, scope_id, eid), [])
        if loc not in bucket:
            bucket.append(loc)

    for scope_kind, scope_id, cfg in configs:
        scenes = cfg.get("scenes", []) or []
        # Single reference-policy source: monitored (via iter_predicate_specs) +
        # acted entities of every enabled scene, so the Repairs missing-entity set
        # and the frontend per-scene flag are computed identically.
        for scene_index, eids in referenced_entities_by_scene(conditions, cfg).items():
            scene = scenes[scene_index]
            for eid in eids:
                note_missing(scope_kind, scope_id, eid, scene)

    # 2. Action overlap, per acted entity across distinct (scope, category) groups.
    groups: dict[str, dict[tuple[str, str | None, str | None], Location]] = {}
    for scope_kind, scope_id, cfg in configs:
        for scene in cfg.get("scenes", []) or []:
            if not scene_enabled(scene):
                continue
            category = scene.get("category")
            group_key = (scope_kind, scope_id, category)
            for eid in _action_entities(scene):
                # Overlap on a non-existent entity is moot — the missing_entity
                # problem already covers it, and warning about a control conflict
                # for an entity the user can't find is just confusing.
                if not entity_exists(hass, eid):
                    continue
                per_entity = groups.setdefault(eid, {})
                per_entity.setdefault(
                    group_key,
                    Location(scope_kind, scope_id, category, scene.get("name") or ""),
                )

    problems: list[Problem] = []
    for (_scope_kind, _scope_id, eid), locs in missing.items():
        problems.append(Problem("missing_entity", eid, tuple(locs)))
    for eid, per_entity in groups.items():
        if len(per_entity) > 1:
            problems.append(Problem("action_overlap", eid, tuple(per_entity.values())))

    # 3. Dangling config references (per-scene), aggregated globally per (kind, ref).
    ctx = _build_ref_context(hass)
    config_refs: dict[tuple[str, str], list[Location]] = {}
    for scope_kind, scope_id, cfg in configs:
        for scene in cfg.get("scenes", []) or []:
            for kind, ref in scene_config_issues(ctx, scene):
                loc = Location(scope_kind, scope_id, scene.get("category"), scene.get("name") or "")
                bucket = config_refs.setdefault((kind, ref), [])
                if loc not in bucket:
                    bucket.append(loc)
    for (kind, ref), locs in config_refs.items():
        problems.append(Problem(kind, ref, tuple(locs)))

    return problems


def overlap_entity_ids(hass: HomeAssistant) -> frozenset[str]:
    """Global action-overlap entity-id set from a full scan of every scope.

    Same source as Repairs (scan's action_overlap problems), so the frontend
    overlap flag can't diverge from the overlap issue."""
    store = hass.data[DOMAIN][DATA_STORE]
    return frozenset(
        p.ref for p in scan(hass, store.all_scope_configs()) if p.kind == "action_overlap"
    )


def scene_annotations(
    hass: HomeAssistant, cfg: dict[str, Any], *, fresh_overlap: bool = False
) -> list[dict[str, Any]]:
    """Per-scene problem annotations for `cfg`, aligned with cfg['scenes'].

    Each entry is {"missing_entities": [...], "overlap_entities": [...],
    "config_issues": [{"kind": ..., "ref": ...}, ...]}. Computed from the SAME
    scan() that drives Repairs: missing = referenced entities that don't exist;
    overlap = acted entities that are in the global action_overlap set;
    config_issues = dangling config references from scene_config_issues().
    Disabled scenes carry empty lists (they're skipped, matching scan()).

    The global overlap set is cached in hass.data[DATA_OVERLAP_SET] — refreshed by
    reconcile_issues on every config-change / entity-registry event — so a per-scope
    WS get doesn't re-scan every scope. Pass `fresh_overlap=True` (the save path) to
    recompute it now, so a save's response reflects the just-saved config."""
    domain = hass.data[DOMAIN]
    conditions = domain[DATA_CONDITIONS]
    if fresh_overlap or DATA_OVERLAP_SET not in domain:
        domain[DATA_OVERLAP_SET] = overlap_entity_ids(hass)
    overlap_set = domain[DATA_OVERLAP_SET]
    referenced = referenced_entities_by_scene(conditions, cfg)
    ctx = _build_ref_context(hass)
    out: list[dict[str, Any]] = []
    for idx, scene in enumerate(cfg.get("scenes", []) or []):
        refs = referenced.get(idx, set())
        missing = sorted(eid for eid in refs if not entity_exists(hass, eid))
        acted = set(_action_entities(scene)) if scene_enabled(scene) else set()
        overlaps = sorted(eid for eid in acted if eid in overlap_set)
        config_issues = [{"kind": k, "ref": r} for k, r in scene_config_issues(ctx, scene)]
        out.append(
            {
                "missing_entities": missing,
                "overlap_entities": overlaps,
                "config_issues": config_issues,
            }
        )
    return out
