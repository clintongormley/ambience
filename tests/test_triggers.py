"""TriggerSpec value type and merge()."""

from __future__ import annotations

from custom_components.ambience.triggers import EMPTY, DurationGate, TriggerSpec, merge


def test_empty_has_all_empty_fields() -> None:
    assert EMPTY.entities == frozenset()
    assert EMPTY.duration_gates == frozenset()
    assert EMPTY.clock_times == frozenset()
    assert EMPTY.sun_events == frozenset()
    assert EMPTY.date_rollover is False
    assert EMPTY.has_time is False
    assert EMPTY.opaque is False


def test_defaults_match_empty() -> None:
    assert TriggerSpec() == EMPTY


def test_is_frozen_hashable() -> None:
    # frozen dataclass with frozenset fields is hashable
    assert hash(TriggerSpec(entities=frozenset({"a"}))) == hash(
        TriggerSpec(entities=frozenset({"a"}))
    )


def test_merge_unions_sets_and_ors_bools() -> None:
    gate = DurationGate(key="any:home:0:person.x", seconds=600.0, label="anyone home")
    a = TriggerSpec(
        entities=frozenset({"light.a"}),
        duration_gates=frozenset({gate}),
        clock_times=frozenset({(7, 0)}),
        sun_events=frozenset({("sunset", 0)}),
        date_rollover=True,
        opaque=False,
    )
    b = TriggerSpec(
        entities=frozenset({"light.b"}),
        clock_times=frozenset({(22, 30)}),
        has_time=True,
        opaque=True,
    )
    out = merge([a, b])
    assert out.entities == frozenset({"light.a", "light.b"})
    assert out.duration_gates == frozenset({gate})
    assert out.clock_times == frozenset({(7, 0), (22, 30)})
    assert out.sun_events == frozenset({("sunset", 0)})
    assert out.date_rollover is True
    assert out.has_time is True
    assert out.opaque is True


def test_merge_unions_gates_across_specs() -> None:
    g1 = DurationGate(key="k1", seconds=60.0, label="x is on", entity_id="switch.x")
    g2 = DurationGate(key="k2", seconds=30.0, label="nobody home", entity_id=None)
    merged = merge(
        [
            TriggerSpec(duration_gates=frozenset({g1})),
            TriggerSpec(duration_gates=frozenset({g2})),
        ]
    )
    assert merged.duration_gates == frozenset({g1, g2})


def test_duration_gate_is_frozen_and_hashable() -> None:
    g = DurationGate(key="k", seconds=60.0, label="x is on", entity_id="switch.x")
    assert g == DurationGate(key="k", seconds=60.0, label="x is on", entity_id="switch.x")
    assert g.entity_id == "switch.x"
    assert DurationGate(key="k", seconds=60.0, label="nobody home").entity_id is None


def test_merge_empty_iterable_is_empty() -> None:
    assert merge([]) == EMPTY
