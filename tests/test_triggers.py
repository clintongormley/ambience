"""TriggerSpec value type and merge()."""

from __future__ import annotations

from custom_components.ambience.triggers import EMPTY, TriggerSpec, merge


def test_empty_has_all_empty_fields() -> None:
    assert EMPTY.entities == frozenset()
    assert EMPTY.entity_durations == frozenset()
    assert EMPTY.clock_times == frozenset()
    assert EMPTY.sun_events == frozenset()
    assert EMPTY.date_rollover is False
    assert EMPTY.opaque is False


def test_defaults_match_empty() -> None:
    assert TriggerSpec() == EMPTY


def test_is_frozen_hashable() -> None:
    # frozen dataclass with frozenset fields is hashable
    assert hash(TriggerSpec(entities=frozenset({"a"}))) == hash(
        TriggerSpec(entities=frozenset({"a"}))
    )


def test_merge_unions_sets_and_ors_bools() -> None:
    a = TriggerSpec(
        entities=frozenset({"light.a"}),
        entity_durations=frozenset({("person.x", 600.0)}),
        clock_times=frozenset({(7, 0)}),
        sun_events=frozenset({("sunset", 0)}),
        date_rollover=True,
        opaque=False,
    )
    b = TriggerSpec(
        entities=frozenset({"light.b"}),
        clock_times=frozenset({(22, 30)}),
        opaque=True,
    )
    out = merge([a, b])
    assert out.entities == frozenset({"light.a", "light.b"})
    assert out.entity_durations == frozenset({("person.x", 600.0)})
    assert out.clock_times == frozenset({(7, 0), (22, 30)})
    assert out.sun_events == frozenset({("sunset", 0)})
    assert out.date_rollover is True
    assert out.opaque is True


def test_merge_empty_iterable_is_empty() -> None:
    assert merge([]) == EMPTY
