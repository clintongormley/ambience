"""Pure scene sort: containment-aware topological sort. No HA, no I/O."""

from __future__ import annotations

import itertools
from typing import Any

from custom_components.ambience.sorting import (
    GAP,
    _slot,
    resolve_order,
    shadowed_by,
    sort_scenes,
)


class IntervalCondition:
    """Test double: predicates are (start, end) tuples; `contains` is interval
    containment and `order_key` is the start."""

    def __init__(self, priority: int = 100) -> None:
        self.priority = priority

    def contains(self, outer: Any, inner: Any) -> bool:
        return outer[0] <= inner[0] and inner[1] <= outer[1]

    def order_key(self, predicate: Any) -> float:
        return predicate[0]


class StringCondition:
    """Test double for an always-on string-equality condition: `order_key`
    only, no `contains` (equality is handled generically)."""

    priority = 1000

    def order_key(self, predicate: Any) -> str:
        return predicate.lower()


class QuantCondition:
    """Test double mirroring occupancy/people/day: a `priority` and `contains`,
    but deliberately NO `order_key` (no meaningful intra-condition order)."""

    def __init__(self, priority: int = 100) -> None:
        self.priority = priority

    def contains(self, outer: Any, inner: Any) -> bool:
        return outer == inner


class BareCondition:
    """Test double with no sort members at all."""


def _scene(name: str, when: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "when": when, "actions": []}


def _names(scenes: list[dict[str, Any]]) -> list[str]:
    return [r["name"] for r in scenes]


def test_empty_and_single_returned_as_is() -> None:
    assert sort_scenes([], {}) == []
    one = [_scene("only", {"mode": "movie"})]
    assert sort_scenes(one, {"mode": StringCondition()}) == one


def test_contained_scene_precedes_its_container() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    scenes = [
        _scene("wide", {"mode": "movie", "tod": (10, 14)}),
        _scene("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["narrow", "wide"]


def test_extra_constrained_dimension_is_more_specific() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    scenes = [
        _scene("value-only", {"mode": "movie"}),
        _scene("value-and-tod", {"mode": "movie", "tod": (10, 14)}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["value-and-tod", "value-only"]


def test_named_value_precedes_wildcard() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        _scene("catchall", {"mode": None}),
        _scene("movie", {"mode": "movie"}),
        _scene("no-mode-key", {}),
    ]
    out = _names(sort_scenes(scenes, conditions))
    assert out[0] == "movie"
    assert set(out[1:]) == {"catchall", "no-mode-key"}


def test_string_categorisation_via_linearisation() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        _scene("r-reading", {"mode": "Reading"}),
        _scene("r-movie", {"mode": "movie"}),
        _scene("r-arcade", {"mode": "arcade"}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["r-arcade", "r-movie", "r-reading"]


def test_disjoint_ranges_linearise_chronologically() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    scenes = [
        _scene("evening", {"mode": "movie", "tod": (18, 19)}),
        _scene("morning", {"mode": "movie", "tod": (8, 10)}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["morning", "evening"]


def test_partial_overlap_neither_contains_uses_start_time() -> None:
    conditions = {"tod": IntervalCondition()}
    scenes = [
        _scene("later", {"tod": (11, 13)}),
        _scene("earlier", {"tod": (10, 12)}),
    ]
    # neither contains the other => incomparable => ordered by start time
    assert _names(sort_scenes(scenes, conditions)) == ["earlier", "later"]


def test_wildcard_slot_sorts_last() -> None:
    # tod has higher priority (higher number) than weather; the two scenes are
    # incomparable, so the highest-priority slot decides — and the scene that
    # leaves `tod` unconstrained (a wildcard) sorts after the one that sets it.
    conditions = {
        "tod": IntervalCondition(priority=200),
        "weather": IntervalCondition(priority=100),
    }
    scenes = [
        _scene("weather-only", {"weather": (0, 5)}),
        _scene("tod-only", {"tod": (8, 10)}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["tod-only", "weather-only"]


def test_constrained_high_priority_without_order_key_beats_lower_priority_slot() -> None:
    # Regression: a scene constraining a HIGH-priority condition that lacks
    # `order_key` (like occupancy/people/day) must still sort before — and so win
    # first-match over — a scene that only constrains a LOWER-priority condition
    # that has `order_key` (like time_of_day). The high-priority *constraint*
    # must beat the low-priority one; constraining-without-order_key must not
    # collapse to a wildcard.
    conditions = {
        "occupancy": QuantCondition(priority=915),  # no order_key
        "time_of_day": IntervalCondition(priority=800),  # has order_key
    }
    scenes = [
        _scene("evening", {"time_of_day": (18, 19)}),
        _scene("vacant", {"occupancy": "vacant"}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["vacant", "evening"]


def test_two_order_keyless_conditions_constraint_beats_wildcard_by_priority() -> None:
    # Two conditions, neither with order_key. The scene constraining the
    # higher-priority one sorts first; constraining beats not-constraining within
    # the top slot.
    conditions = {
        "people": QuantCondition(priority=925),
        "occupancy": QuantCondition(priority=915),
    }
    scenes = [
        _scene("occ", {"occupancy": "vacant"}),
        _scene("ppl", {"people": "nobody"}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["ppl", "occ"]


def test_condition_without_contains_yields_no_hard_edge() -> None:
    # BareCondition has no `contains`; differing predicates cannot produce a
    # containment edge, so the scenes are incomparable and keep input order.
    conditions = {"bare": BareCondition()}
    scenes = [
        _scene("first", {"bare": "x"}),
        _scene("second", {"bare": "y"}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["first", "second"]


def test_hard_edges_override_linearisation_no_loop() -> None:
    # A=(5,20) contains B=(10,12) and C=(7,8); B and C are disjoint.
    # Linearisation by start time alone would want A(5), C(7), B(10) — but the
    # hard edges force B and C before A. The topological sort must respect them
    # and still terminate.
    conditions = {"tod": IntervalCondition()}
    scenes = [
        _scene("A", {"tod": (5, 20)}),
        _scene("B", {"tod": (10, 12)}),
        _scene("C", {"tod": (7, 8)}),
    ]
    out = _names(sort_scenes(scenes, conditions))
    assert out.index("B") < out.index("A")
    assert out.index("C") < out.index("A")
    # among the two free nodes, start time orders C before B
    assert out == ["C", "B", "A"]


def test_stable_on_full_ties() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        _scene("a", {"mode": "movie"}),
        _scene("b", {"mode": "movie"}),
        _scene("c", {"mode": "movie"}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["a", "b", "c"]


def test_does_not_mutate_input() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [_scene("b", {"mode": "b"}), _scene("a", {"mode": "a"})]
    sort_scenes(scenes, conditions)
    assert _names(scenes) == ["b", "a"]


def test_cyclic_contains_does_not_loop() -> None:
    # A pathological condition whose `contains` is always True makes every pair
    # precede every other — a cycle. The defensive fallback must still
    # terminate and return every scene exactly once.
    class AlwaysContains:
        priority = 100

        def contains(self, outer: Any, inner: Any) -> bool:
            return True

        def order_key(self, predicate: Any) -> float:
            return predicate

    conditions = {"m": AlwaysContains()}
    scenes = [_scene("a", {"m": 3}), _scene("b", {"m": 1}), _scene("c", {"m": 2})]
    out = sort_scenes(scenes, conditions)
    assert sorted(_names(out)) == ["a", "b", "c"]


def _by_name_priorities(scenes: list[dict[str, Any]]) -> dict[str, int]:
    return {r["name"]: r["priority"] for r in scenes}


def test_resolve_assigns_decreasing_priorities_in_topological_order() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    scenes = [
        _scene("wide", {"mode": "movie", "tod": (10, 14)}),
        _scene("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    out = resolve_order(scenes, conditions)
    assert _names(out) == ["narrow", "wide"]
    assert out[0]["priority"] > out[1]["priority"]
    assert out[0]["pinned"] is False and out[1]["pinned"] is False


def test_resolve_keeps_pinned_priority_and_places_it_by_number() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        _scene("a", {"mode": "a"}),
        {
            "name": "pinned",
            "when": {"mode": "z"},
            "actions": [],
            "priority": 999999,
            "pinned": True,
        },  # noqa: E501
        _scene("b", {"mode": "b"}),
    ]
    out = resolve_order(scenes, conditions)
    assert out[0]["name"] == "pinned"
    assert out[0]["priority"] == 999999


def test_resolve_gap_insertion_preserves_other_numbers() -> None:
    conditions = {"mode": StringCondition()}
    seeded = resolve_order(
        [_scene("a", {"mode": "a"}), _scene("b", {"mode": "b"}), _scene("c", {"mode": "c"})],
        conditions,
    )
    nums = _by_name_priorities(seeded)
    for r in seeded:
        if r["name"] == "c":
            r["pinned"] = True
    pinned_c = nums["c"]
    seeded.append(_scene("aa", {"mode": "aa"}))
    out = resolve_order(seeded, conditions)
    out_nums = _by_name_priorities(out)
    assert out_nums["a"] == nums["a"]
    assert out_nums["b"] == nums["b"]
    assert out_nums["c"] == pinned_c
    assert nums["b"] < out_nums["aa"] < nums["a"]
    assert _names(out) == ["a", "aa", "b", "c"]


def test_resolve_renormalises_when_a_gap_closes() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        {"name": "hi", "when": {"mode": "a"}, "actions": [], "priority": 11, "pinned": True},
        {"name": "lo", "when": {"mode": "b"}, "actions": [], "priority": 10, "pinned": True},
        _scene("mid", {"mode": "ab"}),
    ]
    out = resolve_order(scenes, conditions)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True)
    assert len(set(prios)) == len(prios)


def test_resolve_renormalises_on_duplicate_pin_values() -> None:
    conditions = {"mode": StringCondition()}
    scenes = [
        {"name": "a", "when": {"mode": "a"}, "actions": [], "priority": 500, "pinned": True},
        {"name": "b", "when": {"mode": "b"}, "actions": [], "priority": 500, "pinned": True},
    ]
    out = resolve_order(scenes, conditions)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True), "must be strictly decreasing"
    assert len(set(prios)) == len(prios), "no ties"
    assert 500 not in prios, "renorm must have reassigned all values"


def test_shadow_general_above_specific_is_flagged() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    ordered = [
        _scene("general", {"mode": "movie"}),
        _scene("specific", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_specific_above_general_is_not_flagged() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    ordered = [
        _scene("specific", {"mode": "movie", "tod": (12, 13)}),
        _scene("general", {"mode": "movie"}),
    ]
    assert shadowed_by(ordered, conditions) == {}


def test_shadow_equal_match_sets_flagged() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [_scene("first", {"mode": "x"}), _scene("dup", {"mode": "x"})]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_empty_when_shadows_everything_below() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [_scene("catch_all", {}), _scene("below", {"mode": "x"})]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_multi_key_contains_is_flagged() -> None:
    conditions = {"tod": IntervalCondition(), "win": IntervalCondition()}
    ordered = [
        _scene("wide", {"tod": (0, 24), "win": (0, 10)}),
        _scene("narrow", {"tod": (8, 16), "win": (3, 7)}),
    ]
    # "wide" is more general on BOTH dimensions via contains → shadows "narrow".
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_resolve_order_keeps_categories_contiguous_and_orders_within_category() -> None:
    conditions = {"tod": IntervalCondition()}
    # Values chosen so the OLD whole-list sort would INTERLEAVE the categories
    # (broad b, narrow a, narrow b, broad a → ["b","a","a","b"]). Per-category
    # canonicalisation must instead keep each category contiguous.
    scenes = [
        {"when": {"tod": (0, 24)}, "actions": [], "category": "a"},  # broad a
        {"when": {"tod": (8, 16)}, "actions": [], "category": "b"},  # narrow b
        {"when": {"tod": (0, 24)}, "actions": [], "category": "b"},  # broad b
        {"when": {"tod": (8, 16)}, "actions": [], "category": "a"},  # narrow a
    ]
    out = resolve_order(scenes, conditions)
    categories = [r["category"] for r in out]
    # No category's scenes are interleaved: each category forms one contiguous run.
    assert [g for g, _ in itertools.groupby(categories)] == list(dict.fromkeys(categories))
    # Within each category the narrower scene precedes the broad catch-all.
    for cid in ("a", "b"):
        g_scenes = [r for r in out if r["category"] == cid]
        assert g_scenes[0]["when"] == {"tod": (8, 16)}
        assert g_scenes[1]["when"] == {"tod": (0, 24)}


def test_shadowed_by_is_per_category() -> None:
    conditions = {"tod": IntervalCondition()}
    # Broad-then-narrow IN THE SAME category: the broad scene shadows the narrow one.
    same_category = [
        {"when": {}, "actions": [], "category": "a"},  # idx 0: broad, category a
        {"when": {"tod": (8, 16)}, "actions": [], "category": "a"},  # idx 1: narrow, category a
    ]
    assert shadowed_by(same_category, conditions) == {1: 0}
    # The SAME pair across DIFFERENT categories must NOT shadow — positive control
    # proving the category guard (not the predicates) is what suppresses the flag.
    cross_category = [
        {"when": {}, "actions": [], "category": "a"},  # idx 0: broad, category a
        {"when": {"tod": (8, 16)}, "actions": [], "category": "b"},  # idx 1: narrow, category b
    ]
    assert shadowed_by(cross_category, conditions) == {}


def test_disabled_scene_does_not_shadow_scene_below() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
        {"name": "live", "when": {"mode": "x"}, "actions": []},
    ]
    # The earlier scene is disabled, so it no longer shadows the live one.
    assert shadowed_by(ordered, conditions) == {}


def test_disabled_scene_is_not_reported_as_shadowed() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [
        {"name": "live", "when": {"mode": "x"}, "actions": []},
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
    ]
    # The disabled scene below is not flagged shadowed — its disabled state
    # is what the UI shows instead.
    assert shadowed_by(ordered, conditions) == {}


# ---------------------------------------------------------------------------
# _slot coverage: upper-only and lower-only open-ended cases (lines 127, 129)
# ---------------------------------------------------------------------------


def test_slot_upper_none_lower_set_places_above_lower() -> None:
    # upper=None, lower=L → values land at L + (m-k)*GAP (open-ended upward).
    # k=0, m=1: single item above lower=100 → 100 + (1-0)*GAP = 100 + GAP
    assert _slot(None, 100, 0, 1) == 100 + GAP


def test_slot_upper_none_lower_set_multiple_items_decrease_upward() -> None:
    # Three items above lower=0: k=0 highest, k=2 lowest.
    lower = 0
    v0 = _slot(None, lower, 0, 3)
    v1 = _slot(None, lower, 1, 3)
    v2 = _slot(None, lower, 2, 3)
    assert v0 > v1 > v2 > lower


def test_slot_lower_none_upper_set_places_below_upper() -> None:
    # lower=None, upper=U → values land below U at U - (k+1)*GAP.
    # k=0, m=1: single item below upper=5000 → 5000 - GAP
    assert _slot(5000, None, 0, 1) == 5000 - GAP


def test_slot_lower_none_upper_set_multiple_items_decrease_downward() -> None:
    # Three items below upper=10000: k=0 highest, k=2 lowest.
    upper = 10000
    v0 = _slot(upper, None, 0, 3)
    v1 = _slot(upper, None, 1, 3)
    v2 = _slot(upper, None, 2, 3)
    assert upper > v0 > v1 > v2


# ---------------------------------------------------------------------------
# resolve_order: pinned scene with no priority gets assigned 0 (line 182)
# ---------------------------------------------------------------------------


def test_resolve_assigns_zero_to_pinned_scene_missing_priority() -> None:
    # A scene flagged pinned=True but with no 'priority' key is an edge case that
    # "shouldn't happen via the UI" per the source comment. The code assigns 0.
    conditions = {"mode": StringCondition()}
    scenes = [
        {"name": "normal", "when": {"mode": "a"}, "actions": []},
        {"name": "pinned-no-prio", "when": {"mode": "b"}, "actions": [], "pinned": True},
    ]
    out = resolve_order(scenes, conditions)
    by_name = {r["name"]: r for r in out}
    # After resolve_order the pinned scene must have a valid integer priority.
    assert isinstance(by_name["pinned-no-prio"]["priority"], int)


# ---------------------------------------------------------------------------
# _superset_or_equal: contains callable returns False (line 224)
# ---------------------------------------------------------------------------


def test_shadowed_by_contains_callable_returns_false_is_not_superset() -> None:
    # IntervalCondition.contains(outer=(5,6), inner=(0,24)) is False
    # (the narrow interval does NOT contain the wide one), so the earlier
    # scene does NOT shadow the later one.
    conditions = {"tod": IntervalCondition()}
    ordered = [
        _scene("narrow", {"tod": (5, 6)}),
        _scene("wide", {"tod": (0, 24)}),
    ]
    # narrow does not contain wide, so wide is not shadowed.
    assert shadowed_by(ordered, conditions) == {}


def test_state_rule_outranks_occupancy_rule() -> None:
    """An explicit state rule (priority 950) must sort above an occupancy rule
    (915) when their conditions are disjoint — the 'Watch TV beats presence'
    precedence fix. The state slot is compared first; the occupancy scene is a
    wildcard there, so the state scene wins regardless of the occupancy
    scene's own (lower-priority) slot."""

    class StateLike:
        priority = 950

        def order_key(self, p: Any) -> str:
            return p.get("entity_id", "")

    class OccLike:
        priority = 915

    conditions = {"state": StateLike(), "occupancy": OccLike()}
    scenes = [
        _scene("presence", {"occupancy": {"sensors": ["binary_sensor.lounge"]}}),
        _scene("watch-tv", {"state": {"kind": "is", "entity_id": "remote.cine"}}),
    ]
    assert _names(sort_scenes(scenes, conditions)) == ["watch-tv", "presence"]
