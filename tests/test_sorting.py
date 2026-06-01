"""Pure rule sort: containment-aware topological sort. No HA, no I/O."""

from __future__ import annotations

import itertools
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


class StringMatcher:
    """Test double for an always-on string-equality matcher: `order_key`
    only, no `contains` (equality is handled generically)."""

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
    one = [_rule("only", {"mode": "movie"})]
    assert sort_rules(one, {"mode": StringMatcher()}) == one


def test_contained_rule_precedes_its_container() -> None:
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    rules = [
        _rule("wide", {"mode": "movie", "tod": (10, 14)}),
        _rule("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["narrow", "wide"]


def test_extra_constrained_dimension_is_more_specific() -> None:
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    rules = [
        _rule("value-only", {"mode": "movie"}),
        _rule("value-and-tod", {"mode": "movie", "tod": (10, 14)}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["value-and-tod", "value-only"]


def test_named_value_precedes_wildcard() -> None:
    matchers = {"mode": StringMatcher()}
    rules = [
        _rule("catchall", {"mode": None}),
        _rule("movie", {"mode": "movie"}),
        _rule("no-mode-key", {}),
    ]
    out = _names(sort_rules(rules, matchers))
    assert out[0] == "movie"
    assert set(out[1:]) == {"catchall", "no-mode-key"}


def test_string_grouping_via_linearisation() -> None:
    matchers = {"mode": StringMatcher()}
    rules = [
        _rule("r-reading", {"mode": "Reading"}),
        _rule("r-movie", {"mode": "movie"}),
        _rule("r-arcade", {"mode": "arcade"}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["r-arcade", "r-movie", "r-reading"]


def test_disjoint_ranges_linearise_chronologically() -> None:
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    rules = [
        _rule("evening", {"mode": "movie", "tod": (18, 19)}),
        _rule("morning", {"mode": "movie", "tod": (8, 10)}),
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
    matchers = {"mode": StringMatcher()}
    rules = [
        _rule("a", {"mode": "movie"}),
        _rule("b", {"mode": "movie"}),
        _rule("c", {"mode": "movie"}),
    ]
    assert _names(sort_rules(rules, matchers)) == ["a", "b", "c"]


def test_does_not_mutate_input() -> None:
    matchers = {"mode": StringMatcher()}
    rules = [_rule("b", {"mode": "b"}), _rule("a", {"mode": "a"})]
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
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    rules = [
        _rule("wide", {"mode": "movie", "tod": (10, 14)}),
        _rule("narrow", {"mode": "movie", "tod": (12, 13)}),
    ]
    out = resolve_order(rules, matchers)
    assert _names(out) == ["narrow", "wide"]
    assert out[0]["priority"] > out[1]["priority"]
    assert out[0]["pinned"] is False and out[1]["pinned"] is False


def test_resolve_keeps_pinned_priority_and_places_it_by_number() -> None:
    matchers = {"mode": StringMatcher()}
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
    out = resolve_order(rules, matchers)
    assert out[0]["name"] == "pinned"
    assert out[0]["priority"] == 999999


def test_resolve_gap_insertion_preserves_other_numbers() -> None:
    matchers = {"mode": StringMatcher()}
    seeded = resolve_order(
        [_rule("a", {"mode": "a"}), _rule("b", {"mode": "b"}), _rule("c", {"mode": "c"})],
        matchers,
    )
    nums = _by_name_priorities(seeded)
    for r in seeded:
        if r["name"] == "c":
            r["pinned"] = True
    pinned_c = nums["c"]
    seeded.append(_rule("aa", {"mode": "aa"}))
    out = resolve_order(seeded, matchers)
    out_nums = _by_name_priorities(out)
    assert out_nums["a"] == nums["a"]
    assert out_nums["b"] == nums["b"]
    assert out_nums["c"] == pinned_c
    assert nums["b"] < out_nums["aa"] < nums["a"]
    assert _names(out) == ["a", "aa", "b", "c"]


def test_resolve_renormalises_when_a_gap_closes() -> None:
    matchers = {"mode": StringMatcher()}
    rules = [
        {"name": "hi", "when": {"mode": "a"}, "actions": [], "priority": 11, "pinned": True},
        {"name": "lo", "when": {"mode": "b"}, "actions": [], "priority": 10, "pinned": True},
        _rule("mid", {"mode": "ab"}),
    ]
    out = resolve_order(rules, matchers)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True)
    assert len(set(prios)) == len(prios)


def test_resolve_renormalises_on_duplicate_pin_values() -> None:
    matchers = {"mode": StringMatcher()}
    rules = [
        {"name": "a", "when": {"mode": "a"}, "actions": [], "priority": 500, "pinned": True},
        {"name": "b", "when": {"mode": "b"}, "actions": [], "priority": 500, "pinned": True},
    ]
    out = resolve_order(rules, matchers)
    prios = [r["priority"] for r in out]
    assert prios == sorted(prios, reverse=True), "must be strictly decreasing"
    assert len(set(prios)) == len(prios), "no ties"
    assert 500 not in prios, "renorm must have reassigned all values"


def test_shadow_general_above_specific_is_flagged() -> None:
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    ordered = [
        _rule("general", {"mode": "movie"}),
        _rule("specific", {"mode": "movie", "tod": (12, 13)}),
    ]
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_shadow_specific_above_general_is_not_flagged() -> None:
    matchers = {"mode": StringMatcher(), "tod": IntervalMatcher()}
    ordered = [
        _rule("specific", {"mode": "movie", "tod": (12, 13)}),
        _rule("general", {"mode": "movie"}),
    ]
    assert shadowed_by(ordered, matchers) == {}


def test_shadow_equal_match_sets_flagged() -> None:
    matchers = {"mode": StringMatcher()}
    ordered = [_rule("first", {"mode": "x"}), _rule("dup", {"mode": "x"})]
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_shadow_empty_when_shadows_everything_below() -> None:
    matchers = {"mode": StringMatcher()}
    ordered = [_rule("catch_all", {}), _rule("below", {"mode": "x"})]
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_shadow_multi_key_contains_is_flagged() -> None:
    matchers = {"tod": IntervalMatcher(), "win": IntervalMatcher()}
    ordered = [
        _rule("wide", {"tod": (0, 24), "win": (0, 10)}),
        _rule("narrow", {"tod": (8, 16), "win": (3, 7)}),
    ]
    # "wide" is more general on BOTH dimensions via contains → shadows "narrow".
    assert shadowed_by(ordered, matchers) == {1: 0}


def test_resolve_order_keeps_groups_contiguous_and_orders_within_group() -> None:
    matchers = {"tod": IntervalMatcher()}
    # Values chosen so the OLD whole-list sort would INTERLEAVE the groups
    # (broad b, narrow a, narrow b, broad a → ["b","a","a","b"]). Per-group
    # canonicalisation must instead keep each group contiguous.
    rules = [
        {"when": {"tod": (0, 24)}, "actions": [], "group": "a"},  # broad a
        {"when": {"tod": (8, 16)}, "actions": [], "group": "b"},  # narrow b
        {"when": {"tod": (0, 24)}, "actions": [], "group": "b"},  # broad b
        {"when": {"tod": (8, 16)}, "actions": [], "group": "a"},  # narrow a
    ]
    out = resolve_order(rules, matchers)
    groups = [r["group"] for r in out]
    # No group's rules are interleaved: each group forms one contiguous run.
    assert [g for g, _ in itertools.groupby(groups)] == list(dict.fromkeys(groups))
    # Within each group the narrower rule precedes the broad catch-all.
    for gid in ("a", "b"):
        g_rules = [r for r in out if r["group"] == gid]
        assert g_rules[0]["when"] == {"tod": (8, 16)}
        assert g_rules[1]["when"] == {"tod": (0, 24)}


def test_shadowed_by_is_per_group() -> None:
    matchers = {"tod": IntervalMatcher()}
    # Broad-then-narrow IN THE SAME group: the broad rule shadows the narrow one.
    same_group = [
        {"when": {}, "actions": [], "group": "a"},  # idx 0: broad, group a
        {"when": {"tod": (8, 16)}, "actions": [], "group": "a"},  # idx 1: narrow, group a
    ]
    assert shadowed_by(same_group, matchers) == {1: 0}
    # The SAME pair across DIFFERENT groups must NOT shadow — positive control
    # proving the group guard (not the predicates) is what suppresses the flag.
    cross_group = [
        {"when": {}, "actions": [], "group": "a"},  # idx 0: broad, group a
        {"when": {"tod": (8, 16)}, "actions": [], "group": "b"},  # idx 1: narrow, group b
    ]
    assert shadowed_by(cross_group, matchers) == {}


def test_disabled_rule_does_not_shadow_rule_below() -> None:
    matchers = {"mode": StringMatcher()}
    ordered = [
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
        {"name": "live", "when": {"mode": "x"}, "actions": []},
    ]
    # The earlier rule is disabled, so it no longer shadows the live one.
    assert shadowed_by(ordered, matchers) == {}


def test_disabled_rule_is_not_reported_as_shadowed() -> None:
    matchers = {"mode": StringMatcher()}
    ordered = [
        {"name": "live", "when": {"mode": "x"}, "actions": []},
        {"name": "off", "when": {"mode": "x"}, "actions": [], "enabled": False},
    ]
    # The disabled rule below is not flagged shadowed — its disabled state
    # is what the UI shows instead.
    assert shadowed_by(ordered, matchers) == {}
