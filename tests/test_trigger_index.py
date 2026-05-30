"""TriggerIndex — reverse index from watched things to dependent predicates."""

from __future__ import annotations

from custom_components.ambience.trigger_index import build_index
from custom_components.ambience.triggers import TriggerSpec


def test_empty_entries_build_empty_index() -> None:
    idx = build_index([])
    assert idx.by_entity == {}
    assert idx.by_clock == {}
    assert idx.by_sun == {}
    assert idx.midnight == frozenset()
    assert idx.has_time == frozenset()
    assert idx.durations == {}
    assert idx.opaque == frozenset()
    assert idx.entities == frozenset()
    assert idx.clock_times == frozenset()
    assert idx.sun_events == frozenset()


def test_entity_dedup_fans_out_to_all_predicates() -> None:
    p1 = ("area", "kitchen", 0, "state")
    p2 = ("house", None, 2, "people")
    idx = build_index(
        [
            (p1, TriggerSpec(entities=frozenset({"binary_sensor.motion"}))),
            (p2, TriggerSpec(entities=frozenset({"binary_sensor.motion", "person.bob"}))),
        ]
    )
    assert idx.by_entity["binary_sensor.motion"] == frozenset({p1, p2})
    assert idx.by_entity["person.bob"] == frozenset({p2})
    assert idx.entities == frozenset({"binary_sensor.motion", "person.bob"})


def test_clock_sun_midnight_has_time_opaque_collected() -> None:
    p = ("area", "lounge", 1, "time_of_day")
    q = ("area", "lounge", 1, "day")
    r = ("area", "lounge", 1, "template")
    s = ("area", "lounge", 1, "script")
    idx = build_index(
        [
            (
                p,
                TriggerSpec(
                    clock_times=frozenset({(22, 30)}),
                    sun_events=frozenset({("sunset", 0)}),
                ),
            ),
            (q, TriggerSpec(date_rollover=True)),
            (r, TriggerSpec(entities=frozenset({"sensor.x"}), has_time=True)),
            (s, TriggerSpec(opaque=True)),
        ]
    )
    assert idx.by_clock[(22, 30)] == frozenset({p})
    assert idx.by_sun[("sunset", 0)] == frozenset({p})
    assert idx.midnight == frozenset({q})
    assert idx.has_time == frozenset({r})
    assert idx.opaque == frozenset({s})
    assert idx.clock_times == frozenset({(22, 30)})
    assert idx.sun_events == frozenset({("sunset", 0)})


def test_durations_collected_per_predicate() -> None:
    p = ("area", "hall", 0, "state")
    idx = build_index(
        [
            (
                p,
                TriggerSpec(
                    entities=frozenset({"binary_sensor.motion", "person.bob"}),
                    entity_durations=frozenset(
                        {("binary_sensor.motion", 600.0), ("person.bob", 300.0)}
                    ),
                ),
            )
        ]
    )
    assert idx.durations[p] == frozenset({600.0, 300.0})


def test_predicate_with_no_durations_absent_from_durations_map() -> None:
    p = ("area", "hall", 0, "state")
    idx = build_index([(p, TriggerSpec(entities=frozenset({"light.x"})))])
    assert p not in idx.durations


def test_clock_time_shared_by_two_predicates_dedups() -> None:
    p = ("area", "a", 0, "time_of_day")
    q = ("floor", "ground", 1, "time_of_day")
    idx = build_index(
        [
            (p, TriggerSpec(clock_times=frozenset({(7, 0)}))),
            (q, TriggerSpec(clock_times=frozenset({(7, 0)}))),
        ]
    )
    assert idx.by_clock[(7, 0)] == frozenset({p, q})
    assert idx.clock_times == frozenset({(7, 0)})


def test_predicate_spans_multiple_buckets_without_interference() -> None:
    # A single predicate that watches an entity AND a clock-time AND rolls over
    # at midnight must appear in all three buckets and in none of the others.
    p = ("area", "den", 0, "state")
    idx = build_index(
        [
            (
                p,
                TriggerSpec(
                    entities=frozenset({"binary_sensor.motion"}),
                    clock_times=frozenset({(23, 0)}),
                    date_rollover=True,
                ),
            )
        ]
    )
    assert idx.by_entity["binary_sensor.motion"] == frozenset({p})
    assert idx.by_clock[(23, 0)] == frozenset({p})
    assert idx.midnight == frozenset({p})
    assert idx.has_time == frozenset()
    assert idx.opaque == frozenset()
    assert idx.by_sun == {}


def test_distinct_sun_offsets_for_same_anchor_are_separate_keys() -> None:
    p = ("area", "a", 0, "time_of_day")
    q = ("area", "a", 1, "time_of_day")
    idx = build_index(
        [
            (p, TriggerSpec(sun_events=frozenset({("sunset", -30)}))),
            (q, TriggerSpec(sun_events=frozenset({("sunset", 0)}))),
        ]
    )
    assert idx.by_sun[("sunset", -30)] == frozenset({p})
    assert idx.by_sun[("sunset", 0)] == frozenset({q})
    assert idx.sun_events == frozenset({("sunset", -30), ("sunset", 0)})


def test_all_predicates_unions_every_bucket() -> None:
    e = ("area", "a", 0, "state")
    c = ("area", "a", 1, "time_of_day")
    s = ("area", "a", 2, "sun")
    m = ("area", "a", 3, "day")
    h = ("area", "a", 4, "template")
    o = ("area", "a", 5, "script")
    d = ("area", "a", 6, "state")
    idx = build_index(
        [
            (e, TriggerSpec(entities=frozenset({"sensor.x"}))),
            (c, TriggerSpec(clock_times=frozenset({(7, 0)}))),
            (s, TriggerSpec(sun_events=frozenset({("sunset", 0)}))),
            (m, TriggerSpec(date_rollover=True)),
            (h, TriggerSpec(entities=frozenset({"sensor.y"}), has_time=True)),
            (o, TriggerSpec(opaque=True)),
            (
                d,
                TriggerSpec(
                    entities=frozenset({"sensor.z"}),
                    entity_durations=frozenset({("sensor.z", 60.0)}),
                ),
            ),
        ]
    )
    assert idx.all_predicates() == frozenset({e, c, s, m, h, o, d})


def test_all_predicates_empty_index() -> None:
    assert build_index([]).all_predicates() == frozenset()
