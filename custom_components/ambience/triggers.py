"""Trigger-dependency value type shared by conditions and the auto-trigger engine.

A condition's optional ``trigger_deps(predicate) -> TriggerSpec`` answers "what
should wake this predicate up?".  The engine merges every scene's spec in a
scope into one watch-set.  Pure data — no HA imports, no side effects.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime

# A condition's `gate_states()` reading for one duration gate: the gate's
# *instant* (un-`for`ed) truth right now, and an `anchor` timestamp the engine
# seeds tenure from at startup/reload (a provable lower bound on how long the
# instant test has held — typically the entity's last state change).
GateReading = tuple[bool, datetime]


@dataclass(frozen=True)
class DurationGate:
    """One ``for:`` duration gate inside a predicate.

    A predicate's ``for:`` clause measures how long the predicate's *instant*
    (un-``for``ed) test has held continuously true. That tenure history lives in
    the long-lived engine; this gate is how a condition tells the engine which
    instant test to clock and for how long.

    - ``key``: canonical fingerprint of the gated instant sub-predicate. The
      same content anywhere in the config produces the same key, so identical
      tests share one tenure clock (and the resolve path gets tenure without
      threading per-scene identity through the engine).
    - ``seconds``: the ``for:`` duration the instant test must hold.
    - ``label``: human-readable instant description, used for a DURATION trace
      cause when the gate spans more than one entity (e.g. "nobody home").
    - ``entity_id``: the single entity the gate reads, or ``None`` when it spans
      several — the recheck trace then names ``label`` instead of an entity.
    """

    key: str
    seconds: float
    label: str
    entity_id: str | None = None


@dataclass(frozen=True)
class TriggerSpec:
    """What a predicate depends on, for auto re-evaluation.

    - ``entities``: entity_ids to watch via state-change events.
    - ``duration_gates``: the predicate's ``for:`` gates (see ``DurationGate``).
      The engine tracks each gate's instant-truth tenure and re-checks the
      predicate at ``since + seconds`` so a condition that only becomes true
      after the delay is still caught.
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
    duration_gates: frozenset[DurationGate] = frozenset()
    clock_times: frozenset[tuple[int, int]] = frozenset()
    sun_events: frozenset[tuple[str, int]] = frozenset()
    date_rollover: bool = False
    has_time: bool = False
    opaque: bool = False


EMPTY = TriggerSpec()


def merge(specs: Iterable[TriggerSpec]) -> TriggerSpec:
    """Union all set fields and OR all boolean fields across ``specs``."""
    entities: set[str] = set()
    duration_gates: set[DurationGate] = set()
    clock_times: set[tuple[int, int]] = set()
    sun_events: set[tuple[str, int]] = set()
    date_rollover = False
    has_time = False
    opaque = False
    for spec in specs:
        entities |= spec.entities
        duration_gates |= spec.duration_gates
        clock_times |= spec.clock_times
        sun_events |= spec.sun_events
        date_rollover = date_rollover or spec.date_rollover
        has_time = has_time or spec.has_time
        opaque = opaque or spec.opaque
    return TriggerSpec(
        entities=frozenset(entities),
        duration_gates=frozenset(duration_gates),
        clock_times=frozenset(clock_times),
        sun_events=frozenset(sun_events),
        date_rollover=date_rollover,
        has_time=has_time,
        opaque=opaque,
    )
