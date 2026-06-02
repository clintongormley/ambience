"""Pure rule sort: containment-aware topological sort. No HA, no I/O."""

from __future__ import annotations

import itertools
from typing import Any

from custom_components.ambience.sorting import resolve_order, shadowed_by, sort_rules


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


class BareCondition:
    """Test double with no sort members at all."""


def _rule(name: str, when: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "when": when, "actions": []}


def _names(rules: list[dict[str, Any]]) -> list[str]:
    return [r["name"] for r in rules]


def test_empty_and_single_returned_as_is() -> None:
    assert sort_rules([], {}) == []
    one = [_rule("only", {"mode": "movie"})]
    assert sort_rules(one, {"mode": StringCondition()}) == one


def test_contained_rule_precedes_its_container() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    rules = [
        _rule("wide", {"mode": "movie", "tod": (10, 14)}),
        _rule("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["narrow", "wide"]


def test_extra_constrained_dimension_is_more_specific() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    rules = [
        _rule("value-only", {"mode": "movie"}),
        _rule("value-and-tod", {"mode": "movie", "tod": (10, 14)}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["value-and-tod", "value-only"]


def test_named_value_precedes_wildcard() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        _rule("catchall", {"mode": None}),
        _rule("movie", {"mode": "movie"}),
        _rule("no-mode-key", {}),
    ]
    out = _names(sort_rules(rules, conditions))
    assert out[0] == "movie"
    assert set(out[1:]) == {"catchall", "no-mode-key"}


def test_string_categorisation_via_linearisation() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        _rule("r-reading", {"mode": "Reading"}),
        _rule("r-movie", {"mode": "movie"}),
        _rule("r-arcade", {"mode": "arcade"}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["r-arcade", "r-movie", "r-reading"]


def test_disjoint_ranges_linearise_chronologically() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    rules = [
        _rule("evening", {"mode": "movie", "tod": (18, 19)}),
        _rule("morning", {"mode": "movie", "tod": (8, 10)}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["morning", "evening"]


def test_partial_overlap_neither_contains_uses_start_time() -> None:
    conditions = {"tod": IntervalCondition()}
    rules = [
        _rule("later", {"tod": (11, 13)}),
        _rule("earlier", {"tod": (10, 12)}),
    ]
    # neither contains the other => incomparable => ordered by start time
    assert _names(sort_rules(rules, conditions)) == ["earlier", "later"]


def test_wildcard_slot_sorts_last() -> None:
    # tod has higher priority (higher number) than weather; the two rules are
    # incomparable, so the highest-priority slot decides — and the rule that
    # leaves `tod` unconstrained (a wildcard) sorts after the one that sets it.
    conditions = {
        "tod": IntervalCondition(priority=200),
        "weather": IntervalCondition(priority=100),
    }
    rules = [
        _rule("weather-only", {"weather": (0, 5)}),
        _rule("tod-only", {"tod": (8, 10)}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["tod-only", "weather-only"]


def test_condition_without_contains_yields_no_hard_edge() -> None:
    # BareCondition has no `contains`; differing predicates cannot produce a
    # containment edge, so the rules are incomparable and keep input order.
    conditions = {"bare": BareCondition()}
    rules = [
        _rule("first", {"bare": "x"}),
        _rule("second", {"bare": "y"}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["first", "second"]


def test_hard_edges_override_linearisation_no_loop() -> None:
    # A=(5,20) contains B=(10,12) and C=(7,8); B and C are disjoint.
    # Linearisation by start time alone would want A(5), C(7), B(10) — but the
    # hard edges force B and C before A. The topological sort must respect them
    # and still terminate.
    conditions = {"tod": IntervalCondition()}
    rules = [
        _rule("A", {"tod": (5, 20)}),
        _rule("B", {"tod": (10, 12)}),
        _rule("C", {"tod": (7, 8)}),
    ]
    out = _names(sort_rules(rules, conditions))
    assert out.index("B") < out.index("A")
    assert out.index("C") < out.index("A")
    # among the two free nodes, start time orders C before B
    assert out == ["C", "B", "A"]


def test_stable_on_full_ties() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        _rule("a", {"mode": "movie"}),
        _rule("b", {"mode": "movie"}),
        _rule("c", {"mode": "movie"}),
    ]
    assert _names(sort_rules(rules, conditions)) == ["a", "b", "c"]


def test_does_not_mutate_input() -> None:
    conditions = {"mode": StringCondition()}
    rules = [_rule("b", {"mode": "b"}), _rule("a", {"mode": "a"})]
    sort_rules(rules, conditions)
    assert _names(rules) == ["b", "a"]


def test_cyclic_contains_does_not_loop() -> None:
    # A pathological condition whose `contains` is always True makes every pair
    # precede every other — a cycle. The defensive fallback must still
    # terminate and return every rule exactly once.
    class AlwaysContains:
        priority = 100

        def contains(self, outer: Any, inner: Any) -> bool:
            return True

        def order_key(self, predicate: Any) -> float:
            return predicate

    conditions = {"m": AlwaysContains()}
    rules = [_rule("a", {"m": 3}), _rule("b", {"m": 1}), _rule("c", {"m": 2})]
    out = sort_rules(rules, conditions)
    assert sorted(_names(out)) == ["a", "b", "c"]


def _by_name_priorities(rules: list[dict[str, Any]]) -> dict[str, int]:
    return {r["name"]: r["priority"] for r in rules}


def test_resolve_assigns_decreasing_priorities_in_topological_order() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    rules = [
        _rule("wide", {"mode": "movie", "tod": (10, 14)}),
        _rule("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    out = resolve_order(rules, conditions)
    assert _names(out) == ["narrow", "wide"]
    assert out[0]["priority"] > out[1]["priority"]
    assert out[0]["pinned"] is False and out[1]["pinned"] is False


def test_resolve_keeps_pinned_priority_and_places_it_by_number() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        _rule("a", {"mode": "a"}),
        {
            "name": "pinned",
            "when": {"mode": "z"},
            "actions": [],
            "priority": 999999,
            "pinned": True,
        },  # noqa: E501
        _rule("b", {"mode": "b"}),
    ]
    out = resolve_order(rules, conditions)
    assert out[0]["name"] == "pinned"
    assert out[0]["priority"] == 999999


def test_resolve_gap_insertion_preserves_other_numbers() -> None:
    conditions = {"mode": StringCondition()}
    seeded = resolve_order(
        [_rule("a", {"mode": "a"}), _rule("b", {"mode": "b"}), _rule("c", {"mode": "c"})],
        conditions,
    )
    nums = _by_name_priorities(seeded)
    for r in seeded:
        if r["name"] == "c":
            r["pinned"] = True
    pinned_c = nums["c"]
    seeded.append(_rule("aa", {"mode": "aa"}))
    out = resolve_order(seeded, conditions)
    out_nums = _by_name_priorities(out)
    assert out_nums["a"] == nums["a"]
    assert out_nums["b"] == nums["b"]
    assert out_nums["c"] == pinned_c
    assert nums["b"] < out_nums["aa"] < nums["a"]
    assert _names(out) == ["a", "aa", "b", "c"]


def test_resolve_renormalises_when_a_gap_closes() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        {"name": "hi", "when": {"mode": "a"}, "actions": [], "priority": 11, "pinned": True},
        {"name": "lo", "when": {"mode": "b"}, "actions": [], "priority": 10, "pinned": True},
        _rule("mid", {"mode": "ab"}),
    ]
    out = resolve_order(rules, conditions)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True)
    assert len(set(prios)) == len(prios)


def test_resolve_renormalises_on_duplicate_pin_values() -> None:
    conditions = {"mode": StringCondition()}
    rules = [
        {"name": "a", "when": {"mode": "a"}, "actions": [], "priority": 500, "pinned": True},
        {"name": "b", "when": {"mode": "b"}, "actions": [], "priority": 500, "pinned": True},
    ]
    out = resolve_order(rules, conditions)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True), "must be strictly decreasing"
    assert len(set(prios)) == len(prios), "no ties"
    assert 500 not in prios, "renorm must have reassigned all values"


def test_shadow_general_above_specific_is_flagged() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    ordered = [
        _rule("general", {"mode": "movie"}),
        _rule("specific", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_specific_above_general_is_not_flagged() -> None:
    conditions = {"mode": StringCondition(), "tod": IntervalCondition()}
    ordered = [
        _rule("specific", {"mode": "movie", "tod": (12, 13)}),
        _rule("general", {"mode": "movie"}),
    ]
    assert shadowed_by(ordered, conditions) == {}


def test_shadow_equal_match_sets_flagged() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [_rule("first", {"mode": "x"}), _rule("dup", {"mode": "x"})]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_empty_when_shadows_everything_below() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [_rule("catch_all", {}), _rule("below", {"mode": "x"})]
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_shadow_multi_key_contains_is_flagged() -> None:
    conditions = {"tod": IntervalCondition(), "win": IntervalCondition()}
    ordered = [
        _rule("wide", {"tod": (0, 24), "win": (0, 10)}),
        _rule("narrow", {"tod": (8, 16), "win": (3, 7)}),
    ]
    # "wide" is more general on BOTH dimensions via contains → shadows "narrow".
    assert shadowed_by(ordered, conditions) == {1: 0}


def test_resolve_order_keeps_categories_contiguous_and_orders_within_category() -> None:
    conditions = {"tod": IntervalCondition()}
    # Values chosen so the OLD whole-list sort would INTERLEAVE the categories
    # (broad b, narrow a, narrow b, broad a → ["b","a","a","b"]). Per-category
    # canonicalisation must instead keep each category contiguous.
    rules = [
        {"when": {"tod": (0, 24)}, "actions": [], "category": "a"},  # broad a
        {"when": {"tod": (8, 16)}, "actions": [], "category": "b"},  # narrow b
        {"when": {"tod": (0, 24)}, "actions": [], "category": "b"},  # broad b
        {"when": {"tod": (8, 16)}, "actions": [], "category": "a"},  # narrow a
    ]
    out = resolve_order(rules, conditions)
    categories = [r["category"] for r in out]
    # No category's rules are interleaved: each category forms one contiguous run.
    assert [g for g, _ in itertools.groupby(categories)] == list(dict.fromkeys(categories))
    # Within each category the narrower rule precedes the broad catch-all.
    for cid in ("a", "b"):
        g_rules = [r for r in out if r["category"] == cid]
        assert g_rules[0]["when"] == {"tod": (8, 16)}
        assert g_rules[1]["when"] == {"tod": (0, 24)}


def test_shadowed_by_is_per_category() -> None:
    conditions = {"tod": IntervalCondition()}
    # Broad-then-narrow IN THE SAME category: the broad rule shadows the narrow one.
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


def test_disabled_rule_does_not_shadow_rule_below() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
        {"name": "live", "when": {"mode": "x"}, "actions": []},
    ]
    # The earlier rule is disabled, so it no longer shadows the live one.
    assert shadowed_by(ordered, conditions) == {}


def test_disabled_rule_is_not_reported_as_shadowed() -> None:
    conditions = {"mode": StringCondition()}
    ordered = [
        {"name": "live", "when": {"mode": "x"}, "actions": []},
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
    ]
    # The disabled rule below is not flagged shadowed — its disabled state
    # is what the UI shows instead.
    assert shadowed_by(ordered, conditions) == {}
