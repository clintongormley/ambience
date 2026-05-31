"""Pure rule sort: containment-aware topological sort. No HA, no I/O."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.sorting import resolve_order, shadowed_by, sort_rules


class IntervalMatcher:
    """Test double: predicates are (start, end) tuples; `contains` is interval
    containment and `order_key` is the start."""

    def __init__(self, priority: int = 100) -> None:
        self.priority = priority

    def contains(self, outer: Any, inner: Any) -> bool:
        return outer[0] <= inner[0] and inner[1] <= outer[1]

    def order_key(self, predicate: Any) -> float:
        return predicate[0]


class SceneLike:
    """Test double for an always-on string-equality matcher (like `scene`):
    `order_key` only, no `contains` (equality is handled generically)."""

    priority = 1000

    def order_key(self, predicate: Any) -> str:
        return predicate.lower()


class BareMatcher:
    """Test double with no sort members at all."""


def _rule(name: str, when: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "when": when, "actions": []}


def _names(rules: list[dict[str, Any]]) -> list[str]:
    return [r["name"] for r in rules]


def test_empty_and_single_returned_as_is() -> None:
    assert sort_rules([], {}) == []
    one = [_rule("only", {"scene": "movie"})]
    assert sort_rules(one, {"scene": SceneLike()}) == one


def test_contained_rule_precedes_its_container() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    rules = [
        _rule("wide", {"scene": "movie", "tod": (10, 14)}),
        _rule("narrow", {"scene": "movie", "tod": (12, 13)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["narrow", "wide"]


def test_extra_constrained_dimension_is_more_specific() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    rules = [
        _rule("scene-only", {"scene": "movie"}),
        _rule("scene-and-tod", {"scene": "movie", "tod": (10, 14)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["scene-and-tod", "scene-only"]


def test_named_scene_precedes_scene_any() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        _rule("catchall", {"scene": None}),
        _rule("movie", {"scene": "movie"}),
        _rule("no-scene-key", {}),
    ]
    out = _names(sort_rules(rules, matchers))
    assert out[0] == "movie"
    assert set(out[1:]) == {"catchall", "no-scene-key"}


def test_scene_grouping_via_linearisation() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        _rule("r-reading", {"scene": "Reading"}),
        _rule("r-movie", {"scene": "movie"}),
        _rule("r-arcade", {"scene": "arcade"}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["r-arcade", "r-movie", "r-reading"]


def test_disjoint_ranges_linearise_chronologically() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    rules = [
        _rule("evening", {"scene": "movie", "tod": (18, 19)}),
        _rule("morning", {"scene": "movie", "tod": (8, 10)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["morning", "evening"]


def test_partial_overlap_neither_contains_uses_start_time() -> None:
    matchers = {"tod": IntervalMatcher()}
    rules = [
        _rule("later", {"tod": (11, 13)}),
        _rule("earlier", {"tod": (10, 12)}),
    ]
    # neither contains the other => incomparable => ordered by start time
    assert _names(sort_rules(rules, matchers)) == ["earlier", "later"]


def test_wildcard_slot_sorts_last() -> None:
    # tod has higher priority (higher number) than weather; the two rules are
    # incomparable, so the highest-priority slot decides — and the rule that
    # leaves `tod` unconstrained (a wildcard) sorts after the one that sets it.
    matchers = {
        "tod": IntervalMatcher(priority=200),
        "weather": IntervalMatcher(priority=100),
    }
    rules = [
        _rule("weather-only", {"weather": (0, 5)}),
        _rule("tod-only", {"tod": (8, 10)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["tod-only", "weather-only"]


def test_matcher_without_contains_yields_no_hard_edge() -> None:
    # BareMatcher has no `contains`; differing predicates cannot produce a
    # containment edge, so the rules are incomparable and keep input order.
    matchers = {"bare": BareMatcher()}
    rules = [
        _rule("first", {"bare": "x"}),
        _rule("second", {"bare": "y"}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["first", "second"]


def test_hard_edges_override_linearisation_no_loop() -> None:
    # A=(5,20) contains B=(10,12) and C=(7,8); B and C are disjoint.
    # Linearisation by start time alone would want A(5), C(7), B(10) — but the
    # hard edges force B and C before A. The topological sort must respect them
    # and still terminate.
    matchers = {"tod": IntervalMatcher()}
    rules = [
        _rule("A", {"tod": (5, 20)}),
        _rule("B", {"tod": (10, 12)}),
        _rule("C", {"tod": (7, 8)}),
    ]
    out = _names(sort_rules(rules, matchers))
    assert out.index("B") < out.index("A")
    assert out.index("C") < out.index("A")
    # among the two free nodes, start time orders C before B
    assert out == ["C", "B", "A"]


def test_stable_on_full_ties() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        _rule("a", {"scene": "movie"}),
        _rule("b", {"scene": "movie"}),
        _rule("c", {"scene": "movie"}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["a", "b", "c"]


def test_does_not_mutate_input() -> None:
    matchers = {"scene": SceneLike()}
    rules = [_rule("b", {"scene": "b"}), _rule("a", {"scene": "a"})]
    sort_rules(rules, matchers)
    assert _names(rules) == ["b", "a"]


def test_cyclic_contains_does_not_loop() -> None:
    # A pathological matcher whose `contains` is always True makes every pair
    # precede every other — a cycle. The defensive fallback must still
    # terminate and return every rule exactly once.
    class AlwaysContains:
        priority = 100

        def contains(self, outer: Any, inner: Any) -> bool:
            return True

        def order_key(self, predicate: Any) -> float:
            return predicate

    matchers = {"m": AlwaysContains()}
    rules = [_rule("a", {"m": 3}), _rule("b", {"m": 1}), _rule("c", {"m": 2})]
    out = sort_rules(rules, matchers)
    assert sorted(_names(out)) == ["a", "b", "c"]


def _by_name_priorities(rules: list[dict[str, Any]]) -> dict[str, int]:
    return {r["name"]: r["priority"] for r in rules}


def test_resolve_assigns_decreasing_priorities_in_topological_order() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    rules = [
        _rule("wide", {"scene": "movie", "tod": (10, 14)}),
        _rule("narrow", {"scene": "movie", "tod": (12, 13)}),
    ]
    out = resolve_order(rules, matchers)
    assert _names(out) == ["narrow", "wide"]
    assert out[0]["priority"] > out[1]["priority"]
    assert out[0]["pinned"] is False and out[1]["pinned"] is False


def test_resolve_keeps_pinned_priority_and_places_it_by_number() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        _rule("a", {"scene": "a"}),
        {"name": "pinned", "when": {"scene": "z"}, "actions": [], "priority": 999999, "pinned": True},
        _rule("b", {"scene": "b"}),
    ]
    out = resolve_order(rules, matchers)
    assert out[0]["name"] == "pinned"
    assert out[0]["priority"] == 999999


def test_resolve_gap_insertion_preserves_other_numbers() -> None:
    matchers = {"scene": SceneLike()}
    seeded = resolve_order(
        [_rule("a", {"scene": "a"}), _rule("b", {"scene": "b"}), _rule("c", {"scene": "c"})],
        matchers,
    )
    nums = _by_name_priorities(seeded)
    for r in seeded:
        if r["name"] == "c":
            r["pinned"] = True
    pinned_c = nums["c"]
    seeded.append(_rule("aa", {"scene": "aa"}))
    out = resolve_order(seeded, matchers)
    out_nums = _by_name_priorities(out)
    assert out_nums["a"] == nums["a"]
    assert out_nums["b"] == nums["b"]
    assert out_nums["c"] == pinned_c
    assert nums["b"] < out_nums["aa"] < nums["a"]
    assert _names(out) == ["a", "aa", "b", "c"]


def test_resolve_renormalises_when_a_gap_closes() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        {"name": "hi", "when": {"scene": "a"}, "actions": [], "priority": 11, "pinned": True},
        {"name": "lo", "when": {"scene": "b"}, "actions": [], "priority": 10, "pinned": True},
        _rule("mid", {"scene": "ab"}),
    ]
    out = resolve_order(rules, matchers)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True)
    assert len(set(prios)) == len(prios)


def test_resolve_renormalises_on_duplicate_pin_values() -> None:
    matchers = {"scene": SceneLike()}
    rules = [
        {"name": "a", "when": {"scene": "a"}, "actions": [], "priority": 500, "pinned": True},
        {"name": "b", "when": {"scene": "b"}, "actions": [], "priority": 500, "pinned": True},
    ]
    out = resolve_order(rules, matchers)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True), "must be strictly decreasing"
    assert len(set(prios)) == len(prios), "no ties"
    assert 500 not in prios, "renorm must have reassigned all values"


def test_shadow_general_above_specific_is_flagged() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    ordered = [
        _rule("general", {"scene": "movie"}),
        _rule("specific", {"scene": "movie", "tod": (12, 13)}),
    ]
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_shadow_specific_above_general_is_not_flagged() -> None:
    matchers = {"scene": SceneLike(), "tod": IntervalMatcher()}
    ordered = [
        _rule("specific", {"scene": "movie", "tod": (12, 13)}),
        _rule("general", {"scene": "movie"}),
    ]
    assert shadowed_by(ordered, matchers) == {}


def test_shadow_equal_match_sets_flagged() -> None:
    matchers = {"scene": SceneLike()}
    ordered = [_rule("first", {"scene": "x"}), _rule("dup", {"scene": "x"})]
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_shadow_empty_when_shadows_everything_below() -> None:
    matchers = {"scene": SceneLike()}
    ordered = [_rule("catch_all", {}), _rule("below", {"scene": "x"})]
    assert shadowed_by(ordered, matchers) == {1: 0}
