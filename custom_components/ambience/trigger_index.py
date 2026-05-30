"""Reverse index from watched trigger sources to the predicates that depend on them.

The auto-trigger engine subscribes once per distinct entity / clock-time /
sun-event (the keys of this index) and, when one fires, fans out to every
predicate in that key's set. Pure data — no HA imports, no I/O.

A predicate is identified engine-wide by ``PredKey``:
``(scope_kind, scope_id, rule_index, matcher_key)``.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass

from .triggers import TriggerSpec

PredKey = tuple[str, str | None, int, str]


@dataclass(frozen=True)
class TriggerIndex:
    """Deduplicated reverse index built from per-predicate ``TriggerSpec``s.

    - ``by_entity`` / ``by_clock`` / ``by_sun``: each distinct watch maps to the
      set of predicates that depend on it (the fan-out).
    - ``midnight`` / ``has_time`` / ``opaque``: predicate sets flagged by the
      corresponding ``TriggerSpec`` booleans.
    - ``durations``: per-predicate ``for:`` recheck delays in seconds (only for
      predicates that carry at least one); absent otherwise.
    """

    by_entity: dict[str, frozenset[PredKey]]
    by_clock: dict[tuple[int, int], frozenset[PredKey]]
    by_sun: dict[tuple[str, int], frozenset[PredKey]]
    midnight: frozenset[PredKey]
    has_time: frozenset[PredKey]
    durations: dict[PredKey, frozenset[float]]
    opaque: frozenset[PredKey]

    @property
    def entities(self) -> frozenset[str]:
        return frozenset(self.by_entity)

    @property
    def clock_times(self) -> frozenset[tuple[int, int]]:
        return frozenset(self.by_clock)

    @property
    def sun_events(self) -> frozenset[tuple[str, int]]:
        return frozenset(self.by_sun)

    def all_predicates(self) -> frozenset[PredKey]:
        """Every predicate referenced by any bucket — used to seed flip state."""
        keys: set[PredKey] = set()
        for preds in self.by_entity.values():
            keys |= preds
        for preds in self.by_clock.values():
            keys |= preds
        for preds in self.by_sun.values():
            keys |= preds
        keys |= self.midnight | self.has_time | self.opaque | set(self.durations)
        return frozenset(keys)


def build_index(entries: Iterable[tuple[PredKey, TriggerSpec]]) -> TriggerIndex:
    """Fold ``(PredKey, TriggerSpec)`` pairs into a frozen ``TriggerIndex``.

    Deduplication is inherent: a thing watched by several predicates becomes one
    key whose value set contains every dependent predicate.
    """
    by_entity: dict[str, set[PredKey]] = {}
    by_clock: dict[tuple[int, int], set[PredKey]] = {}
    by_sun: dict[tuple[str, int], set[PredKey]] = {}
    midnight: set[PredKey] = set()
    has_time: set[PredKey] = set()
    durations: dict[PredKey, frozenset[float]] = {}
    opaque: set[PredKey] = set()

    for key, spec in entries:
        for entity in spec.entities:
            by_entity.setdefault(entity, set()).add(key)
        for clock in spec.clock_times:
            by_clock.setdefault(clock, set()).add(key)
        for sun in spec.sun_events:
            by_sun.setdefault(sun, set()).add(key)
        if spec.date_rollover:
            midnight.add(key)
        if spec.has_time:
            has_time.add(key)
        if spec.opaque:
            opaque.add(key)
        if spec.entity_durations:
            durations[key] = frozenset(seconds for _entity, seconds in spec.entity_durations)

    return TriggerIndex(
        by_entity={k: frozenset(v) for k, v in by_entity.items()},
        by_clock={k: frozenset(v) for k, v in by_clock.items()},
        by_sun={k: frozenset(v) for k, v in by_sun.items()},
        midnight=frozenset(midnight),
        has_time=frozenset(has_time),
        durations=durations,
        opaque=frozenset(opaque),
    )
