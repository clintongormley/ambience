"""Detect config-health problems: scenes referencing non-existent entities, and
entities acted on by more than one (scope, category) group.

Pure detection: a single source of truth consumed by the Repairs reconciler
(`config_health_issues.reconcile_issues`). It reads the live entity universe via
`hass` (states + entity registry) but otherwise just walks plain config dicts.
"""

from __future__ import annotations

from collections.abc import Iterable, Iterator
from dataclasses import dataclass
from typing import Any, Literal

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import DATA_CONDITIONS, DOMAIN
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

    `kind` is "missing_entity" (aggregated per (scope, entity); covers both
    monitored and acted references) or "action_overlap" (an acted entity shared
    by >=2 distinct (scope, category) groups).
    """

    kind: Literal["missing_entity", "action_overlap"]
    entity_id: str
    locations: tuple[Location, ...]


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
        # Monitored entities: reuse the engine's "what does a predicate watch?"
        # policy so disabled/wildcard/unknown handling matches exactly.
        for scene_index, _condition_key, spec in iter_predicate_specs(conditions, cfg):
            scene = scenes[scene_index]
            for eid in spec.entities:
                note_missing(scope_kind, scope_id, eid, scene)
        # Acted entities.
        for scene in scenes:
            if not scene_enabled(scene):
                continue
            for eid in _action_entities(scene):
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
    return problems
