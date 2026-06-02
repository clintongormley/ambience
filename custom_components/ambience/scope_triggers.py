"""Enumerate and filter a scope's auto-trigger watches.

A scope's triggers are *derived* from its rules: each rule's ``when`` predicate
is run through its matcher's ``trigger_deps`` and the results merged into one
``TriggerSpec``. This module turns that merged spec into UI rows (for the panel)
and filters a spec against a set of disabled keys (for the engine). Pure logic —
matchers are passed in; no HA imports, no I/O.

Rows are *grouped*: every watched entity is its own row, but all clock/periodic
watches collapse into one ``Time`` group and all sun/date-rollover watches into
one ``Sun`` group. A group is enabled/disabled as a unit — the meaningful choice
is whether a *class* of trigger should wake the scope, not an individual time.

Canonical trigger keys (shared with the frontend):
- ``entity:<entity_id>``
- ``group:time``  (all clock times + local date rollover + periodic re-check)
- ``group:sun``   (all sun events)

``opaque`` is a flag (script deps may be incomplete), not a disableable watch.
"""

from __future__ import annotations

from collections.abc import Collection, Iterator
from typing import Any

from .engine import rule_enabled
from .triggers import TriggerSpec, merge

GROUP_TIME_KEY = "group:time"
GROUP_SUN_KEY = "group:sun"


def _entity_key(entity_id: str) -> str:
    return f"entity:{entity_id}"


def trigger_descriptors(spec: TriggerSpec) -> list[dict[str, Any]]:
    """Enumerate a merged spec into grouped ``{key, kind, ...}`` rows.

    One row per entity (sorted), then a single ``time`` group row (if any clock
    times / periodic re-check) carrying its members, then a single ``sun`` group
    row (if any sun events / date rollover). ``opaque`` produces no row. The UI
    is responsible for final display ordering (it sorts entities by name).
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
    return rows


def filter_spec(spec: TriggerSpec, disabled: Collection[str]) -> TriggerSpec:
    """Return a copy of ``spec`` with every watch whose group key is in
    ``disabled`` removed. ``opaque`` is preserved (it is a flag, not a watch)."""
    if not disabled:
        return spec
    disabled = set(disabled)
    drop_time = GROUP_TIME_KEY in disabled
    drop_sun = GROUP_SUN_KEY in disabled
    return TriggerSpec(
        entities=frozenset(e for e in spec.entities if _entity_key(e) not in disabled),
        entity_durations=frozenset(
            (e, s) for (e, s) in spec.entity_durations if _entity_key(e) not in disabled
        ),
        clock_times=frozenset() if drop_time else spec.clock_times,
        sun_events=frozenset() if drop_sun else spec.sun_events,
        date_rollover=spec.date_rollover and not drop_time,
        has_time=spec.has_time and not drop_time,
        opaque=spec.opaque,
    )


def iter_predicate_specs(
    matchers: dict[str, Any], cfg: dict[str, Any]
) -> Iterator[tuple[int, str, TriggerSpec]]:
    """Yield ``(rule_index, matcher_key, TriggerSpec)`` for every watchable
    predicate in ``cfg``'s rules.

    The single source of the "what does a predicate watch?" policy, shared by
    the UI (``scope_trigger_spec``) and the engine (``_build_entries``): a
    disabled rule (``enabled: False``) contributes nothing (it can never win, so
    its predicates must not wake the scope); a ``None`` predicate (wildcard) and
    an unknown matcher contribute nothing; a matcher without ``trigger_deps`` is
    treated as opaque. ``rule_index`` stays aligned with each rule's position in
    ``cfg['rules']`` so disabled rules simply leave gaps.
    """
    for rule_index, rule in enumerate(cfg.get("rules", [])):
        if not rule_enabled(rule):
            continue
        for matcher_key, predicate in rule.get("when", {}).items():
            if predicate is None:
                continue
            matcher = matchers.get(matcher_key)
            if matcher is None:
                continue
            trigger_deps = getattr(matcher, "trigger_deps", None)
            spec = trigger_deps(predicate) if trigger_deps else TriggerSpec(opaque=True)
            yield rule_index, matcher_key, spec


def scope_trigger_spec(matchers: dict[str, Any], cfg: dict[str, Any]) -> TriggerSpec:
    """Merge every rule predicate's ``trigger_deps`` in ``cfg`` into one spec."""
    return merge(spec for _, _, spec in iter_predicate_specs(matchers, cfg))
