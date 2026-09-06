"""Enumerate a scope's auto-trigger watches.

A scope's triggers are *derived* from its scenes: each scene's ``when`` predicate
is run through its condition's ``trigger_deps`` and the results merged into one
``TriggerSpec``. This module exposes that derivation to the engine and the
simulator. Pure logic — conditions are passed in; no HA imports, no I/O.

``opaque`` is a flag (script deps may be incomplete), not a watch.
"""

from __future__ import annotations

from collections.abc import Iterable, Iterator
from typing import Any

from .engine import scene_enabled
from .triggers import TriggerSpec, merge

# Stable keys for the derived non-entity trigger groups (used by the read-only
# Auto-triggers display to identify each row).
GROUP_TIME_KEY = "group:time"
GROUP_SUN_KEY = "group:sun"
GROUP_DOMAIN_KEY = "group:domain"


def _entity_key(entity_id: str) -> str:
    return f"entity:{entity_id}"


def trigger_descriptors(spec: TriggerSpec) -> list[dict[str, Any]]:
    """Enumerate a merged spec into grouped ``{key, kind, ...}`` rows for the
    read-only Auto-triggers display.

    One row per entity (sorted), then a single ``time`` group row (if any clock
    times / periodic re-check / date rollover) carrying its members, then a
    single ``sun`` group row (if any sun events), then a single ``domain`` row
    when a wildcard predicate watches a domain's membership. ``opaque`` produces
    no row. The UI does final display ordering (it sorts entities by name).
    """
    rows: list[dict[str, Any]] = []
    for entity_id in sorted(spec.entities):
        rows.append({"key": _entity_key(entity_id), "kind": "entity", "entity_id": entity_id})
    if spec.clock_times or spec.has_time or spec.date_rollover:
        rows.append(
            {
                "key": GROUP_TIME_KEY,
                "kind": "time",
                "clocks": [{"hour": h, "minute": m} for h, m in sorted(spec.clock_times)],
                "has_time": spec.has_time,
                "date_rollover": spec.date_rollover,
            }
        )
    if spec.sun_events:
        rows.append(
            {
                "key": GROUP_SUN_KEY,
                "kind": "sun",
                "suns": [{"anchor": a, "offset": o} for a, o in sorted(spec.sun_events)],
            }
        )
    if spec.domains:
        rows.append({"key": GROUP_DOMAIN_KEY, "kind": "domain", "domains": sorted(spec.domains)})
    return rows


def iter_predicate_specs(
    conditions: dict[str, Any], cfg: dict[str, Any]
) -> Iterator[tuple[int, str, TriggerSpec]]:
    """Yield ``(scene_index, condition_key, TriggerSpec)`` for every watchable
    predicate in ``cfg``'s scenes.

    The single source of the "what does a predicate watch?" policy, shared by
    the UI (``scope_trigger_spec``) and the engine (``_build_entries``): a
    disabled scene (``enabled: False``) contributes nothing (it can never win, so
    its predicates must not wake the scope); a ``None`` predicate (wildcard) and
    an unknown condition contribute nothing; a condition without ``trigger_deps`` is
    treated as opaque. ``scene_index`` stays aligned with each scene's position in
    ``cfg['scenes']`` so disabled scenes simply leave gaps.
    """
    for scene_index, scene in enumerate(cfg.get("scenes", [])):
        if not scene_enabled(scene):
            continue
        for condition_key, predicate in scene.get("when", {}).items():
            if predicate is None:
                continue
            condition = conditions.get(condition_key)
            if condition is None:
                continue
            trigger_deps = getattr(condition, "trigger_deps", None)
            spec = trigger_deps(predicate) if trigger_deps else TriggerSpec(opaque=True)
            yield scene_index, condition_key, spec


def scope_trigger_spec(conditions: dict[str, Any], cfg: dict[str, Any]) -> TriggerSpec:
    """Merge every scene predicate's ``trigger_deps`` in ``cfg`` into one spec."""
    return merge(spec for _, _, spec in iter_predicate_specs(conditions, cfg))


def referenced_entities(
    conditions: dict[str, Any], cfgs: Iterable[dict[str, Any]]
) -> dict[str, frozenset[str]]:
    """Per-condition union of ``trigger_deps(...).entities`` across all ``cfgs``.

    Maps ``condition_key -> the entity_ids any of that condition's predicates
    reference``. A condition with no entity-backed predicate is absent from the
    result (callers treat absent as "references nothing", i.e. snapshot nothing).

    Reuses :func:`iter_predicate_specs`, so it inherits the same disabled-scene /
    wildcard / unknown-condition handling as the trigger watch-set — keeping a
    condition's snapshot scope identical to what wakes it. Lets sensor-backed
    conditions snapshot only the entities scenes use instead of a whole domain.
    Pure logic — no HA imports, no I/O.
    """
    out: dict[str, set[str]] = {}
    for cfg in cfgs:
        for _scene_index, condition_key, spec in iter_predicate_specs(conditions, cfg):
            if spec.entities:
                out.setdefault(condition_key, set()).update(spec.entities)
    return {key: frozenset(ents) for key, ents in out.items()}
