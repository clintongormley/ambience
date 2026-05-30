"""Enumerate and filter a scope's auto-trigger watches.

A scope's triggers are *derived* from its rules: each rule's ``when`` predicate
is run through its matcher's ``trigger_deps`` and the results merged into one
``TriggerSpec``. This module turns that merged spec into stable-keyed
descriptors (for the UI) and filters a spec against a set of disabled keys (for
the engine). Pure logic — matchers are passed in; no HA imports, no I/O.

Canonical trigger keys (shared with the frontend):
- ``entity:<entity_id>``
- ``clock:HH:MM`` (24h, zero-padded)
- ``sun:<anchor>:<offset_min>``
- ``date_rollover``
- ``has_time``

``opaque`` is a flag (script deps may be incomplete), not a disableable watch.
"""

from __future__ import annotations

from collections.abc import Collection
from typing import Any

from .triggers import TriggerSpec, merge

DATE_ROLLOVER_KEY = "date_rollover"
HAS_TIME_KEY = "has_time"


def _entity_key(entity_id: str) -> str:
    return f"entity:{entity_id}"


def _clock_key(hour: int, minute: int) -> str:
    return f"clock:{hour:02d}:{minute:02d}"


def _sun_key(anchor: str, offset: int) -> str:
    return f"sun:{anchor}:{offset}"


def trigger_descriptors(spec: TriggerSpec) -> list[dict[str, Any]]:
    """Enumerate a merged spec into ordered ``{key, kind, ...}`` rows.

    Order: entities, clock times, sun events (each sorted), then date_rollover,
    then has_time. ``opaque`` produces no row.
    """
    rows: list[dict[str, Any]] = []
    for entity_id in sorted(spec.entities):
        rows.append({"key": _entity_key(entity_id), "kind": "entity", "entity_id": entity_id})
    for hour, minute in sorted(spec.clock_times):
        rows.append(
            {"key": _clock_key(hour, minute), "kind": "clock", "hour": hour, "minute": minute}
        )
    for anchor, offset in sorted(spec.sun_events):
        rows.append(
            {"key": _sun_key(anchor, offset), "kind": "sun", "anchor": anchor, "offset": offset}
        )
    if spec.date_rollover:
        rows.append({"key": DATE_ROLLOVER_KEY, "kind": "date_rollover"})
    if spec.has_time:
        rows.append({"key": HAS_TIME_KEY, "kind": "has_time"})
    return rows


def filter_spec(spec: TriggerSpec, disabled: Collection[str]) -> TriggerSpec:
    """Return a copy of ``spec`` with every watch whose key is in ``disabled``
    removed. ``opaque`` is preserved (it is a flag, not a watch)."""
    if not disabled:
        return spec
    disabled = set(disabled)
    return TriggerSpec(
        entities=frozenset(e for e in spec.entities if _entity_key(e) not in disabled),
        entity_durations=frozenset(
            (e, s) for (e, s) in spec.entity_durations if _entity_key(e) not in disabled
        ),
        clock_times=frozenset(
            (h, m) for (h, m) in spec.clock_times if _clock_key(h, m) not in disabled
        ),
        sun_events=frozenset(
            (a, o) for (a, o) in spec.sun_events if _sun_key(a, o) not in disabled
        ),
        date_rollover=spec.date_rollover and DATE_ROLLOVER_KEY not in disabled,
        has_time=spec.has_time and HAS_TIME_KEY not in disabled,
        opaque=spec.opaque,
    )


def scope_trigger_spec(matchers: dict[str, Any], cfg: dict[str, Any]) -> TriggerSpec:
    """Merge every rule predicate's ``trigger_deps`` in ``cfg`` into one spec.

    Mirrors the engine's per-predicate logic: a ``None`` predicate (wildcard) and
    an unknown matcher contribute nothing; a matcher without ``trigger_deps`` is
    treated as opaque.
    """
    specs: list[TriggerSpec] = []
    for rule in cfg.get("rules", []):
        for matcher_key, predicate in rule.get("when", {}).items():
            if predicate is None:
                continue
            matcher = matchers.get(matcher_key)
            if matcher is None:
                continue
            trigger_deps = getattr(matcher, "trigger_deps", None)
            specs.append(trigger_deps(predicate) if trigger_deps else TriggerSpec(opaque=True))
    return merge(specs)
