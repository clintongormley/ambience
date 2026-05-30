"""Trigger-dependency value type shared by matchers and the auto-trigger engine.

A matcher's optional ``trigger_deps(predicate) -> TriggerSpec`` answers "what
should wake this predicate up?".  The engine merges every rule's spec in a
scope into one watch-set.  Pure data — no HA imports, no side effects.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass


@dataclass(frozen=True)
class TriggerSpec:
    """What a predicate depends on, for auto re-evaluation.

    - ``entities``: entity_ids to watch via state-change events.
    - ``entity_durations``: ``(entity_id, for_seconds)`` pairs — after that
      entity changes, re-check again at ``change_time + for_seconds`` (the
      state matcher's ``for:`` clause).
    - ``clock_times``: ``(hour, minute)`` local wall-clock boundaries.
    - ``sun_events``: ``(anchor, offset_min)`` — anchor is one of
      sunrise/sunset/noon/midnight/dawn/dusk.
    - ``date_rollover``: re-evaluate at local midnight (date changed).
    - ``has_time``: the predicate's result depends on the wall clock
      (e.g. a template using ``now()``) with no discrete boundary to schedule,
      so it needs periodic re-evaluation — the engine picks the cadence.
    - ``opaque``: dependencies may be incomplete (e.g. script) — drives a UI
      warning; never silently trusted as complete.
    """

    entities: frozenset[str] = frozenset()
    entity_durations: frozenset[tuple[str, float]] = frozenset()
    clock_times: frozenset[tuple[int, int]] = frozenset()
    sun_events: frozenset[tuple[str, int]] = frozenset()
    date_rollover: bool = False
    has_time: bool = False
    opaque: bool = False


EMPTY = TriggerSpec()


def merge(specs: Iterable[TriggerSpec]) -> TriggerSpec:
    """Union all set fields and OR all boolean fields across ``specs``."""
    entities: set[str] = set()
    entity_durations: set[tuple[str, float]] = set()
    clock_times: set[tuple[int, int]] = set()
    sun_events: set[tuple[str, int]] = set()
    date_rollover = False
    has_time = False
    opaque = False
    for spec in specs:
        entities |= spec.entities
        entity_durations |= spec.entity_durations
        clock_times |= spec.clock_times
        sun_events |= spec.sun_events
        date_rollover = date_rollover or spec.date_rollover
        has_time = has_time or spec.has_time
        opaque = opaque or spec.opaque
    return TriggerSpec(
        entities=frozenset(entities),
        entity_durations=frozenset(entity_durations),
        clock_times=frozenset(clock_times),
        sun_events=frozenset(sun_events),
        date_rollover=date_rollover,
        has_time=has_time,
        opaque=opaque,
    )
