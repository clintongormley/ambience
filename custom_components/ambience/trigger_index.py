"""Reverse index from watched trigger sources to the predicates that depend on them.

The auto-trigger engine subscribes once per distinct entity / clock-time /
sun-event (the keys of this index) and, when one fires, fans out to every
predicate in that key's set. Pure data — no HA imports, no I/O.

A predicate is identified engine-wide by ``PredKey``:
``(scope_kind, scope_id, scene_index, condition_key)``.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field

from .triggers import DurationGate, TriggerSpec

PredKey = tuple[str, str | None, int, str]


@dataclass(frozen=True)
class TriggerIndex:
    """Deduplicated reverse index built from per-predicate ``TriggerSpec``s.

    - ``by_entity`` / ``by_clock`` / ``by_sun``: each distinct watch maps to the
      set of predicates that depend on it (the fan-out).
    - ``by_domain``: domains whose *membership* predicates depend on (a wildcard
      "all persons" test), mapped to those predicates. The engine watches these
      for entities appearing/disappearing and rebuilds, which re-enumerates the
      wildcard into fresh ``by_entity`` watches. It is the one field with a
      default, so a direct construction (tests) can omit it; production always
      goes through ``build_index``, which supplies it.
    - ``midnight`` / ``has_time`` / ``opaque``: predicate sets flagged by the
      corresponding ``TriggerSpec`` booleans.
    - ``durations``: per-predicate ``for:`` gates as a frozenset of
      ``DurationGate`` (only for predicates that carry at least one; absent
      otherwise). Each gate names the instant test to clock, its duration, and
      enough to label the recheck's trace (e.g. "binary_sensor.motion off for
      5m", or "nobody home for 30m" for a multi-entity gate).
    """

    by_entity: dict[str, frozenset[PredKey]]
    by_clock: dict[tuple[int, int], frozenset[PredKey]]
    by_sun: dict[tuple[str, int], frozenset[PredKey]]
    midnight: frozenset[PredKey]
    has_time: frozenset[PredKey]
    durations: dict[PredKey, frozenset[DurationGate]]
    opaque: frozenset[PredKey]
    by_domain: dict[str, frozenset[PredKey]] = field(default_factory=dict)

    @property
    def entities(self) -> frozenset[str]:
        return frozenset(self.by_entity)

    @property
    def domains(self) -> frozenset[str]:
        return frozenset(self.by_domain)

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
        for preds in self.by_domain.values():
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
    by_domain: dict[str, set[PredKey]] = {}
    midnight: set[PredKey] = set()
    has_time: set[PredKey] = set()
    durations: dict[PredKey, frozenset[DurationGate]] = {}
    opaque: set[PredKey] = set()

    for key, spec in entries:
        for entity in spec.entities:
            by_entity.setdefault(entity, set()).add(key)
        for clock in spec.clock_times:
            by_clock.setdefault(clock, set()).add(key)
        for sun in spec.sun_events:
            by_sun.setdefault(sun, set()).add(key)
        for domain in spec.domains:
            by_domain.setdefault(domain, set()).add(key)
        if spec.date_rollover:
            midnight.add(key)
        if spec.has_time:
            has_time.add(key)
        if spec.opaque:
            opaque.add(key)
        if spec.duration_gates:
            durations[key] = frozenset(spec.duration_gates)

    return TriggerIndex(
        by_entity={k: frozenset(v) for k, v in by_entity.items()},
        by_clock={k: frozenset(v) for k, v in by_clock.items()},
        by_sun={k: frozenset(v) for k, v in by_sun.items()},
        midnight=frozenset(midnight),
        has_time=frozenset(has_time),
        durations=durations,
        opaque=frozenset(opaque),
        by_domain={k: frozenset(v) for k, v in by_domain.items()},
    )
