"""Pure rule sort by specificity. No HA, no I/O."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.sorting import sort_rules


class SpecMatcher:
    """Matcher test double exposing only specificity()."""

    def __init__(self, spec_fn) -> None:  # noqa: ANN001
        self._spec_fn = spec_fn

    def specificity(self, predicate: Any) -> float:
        return self._spec_fn(predicate)


class NoSpecMatcher:
    """Matcher test double WITHOUT specificity() — must default to 0.5."""


def _rule(name: str, when: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "when": when, "actions": []}


def test_groups_by_scene_name_case_insensitive() -> None:
    matchers = {"scene": NoSpecMatcher()}
    rules = [
        _rule("r-reading", {"scene": "Reading"}),
        _rule("r-movie", {"scene": "movie"}),
        _rule("r-arcade", {"scene": "arcade"}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == [
        "r-arcade",
        "r-movie",
        "r-reading",
    ]


def test_scene_any_sorts_last() -> None:
    matchers = {"scene": NoSpecMatcher()}
    rules = [
        _rule("any", {"scene": None}),
        _rule("zebra", {"scene": "zebra"}),
        _rule("no-scene-key", {}),
    ]
    out = [r["name"] for r in sort_rules(rules, matchers)]
    assert out == ["zebra", "any", "no-scene-key"] or out == ["zebra", "no-scene-key", "any"]
    assert out[0] == "zebra"


def test_more_constrained_dimensions_sort_first_within_scene() -> None:
    matchers = {"scene": NoSpecMatcher(), "tod": NoSpecMatcher(), "wx": NoSpecMatcher()}
    rules = [
        _rule("one-dim", {"scene": "movie"}),
        _rule("three-dim", {"scene": "movie", "tod": "evening", "wx": "rainy"}),
        _rule("two-dim", {"scene": "movie", "tod": "evening"}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == [
        "three-dim",
        "two-dim",
        "one-dim",
    ]


def test_narrower_predicate_sorts_first_on_dimension_tie() -> None:
    # Both rules: scene + tod (2 dims). Narrower tod wins.
    matchers = {
        "scene": SpecMatcher(lambda p: 0.0),
        "tod": SpecMatcher(lambda p: {"12:00-13:00": 0.04, "10:00-14:00": 0.17}[p]),
    }
    rules = [
        _rule("wide", {"scene": "movie", "tod": "10:00-14:00"}),
        _rule("narrow", {"scene": "movie", "tod": "12:00-13:00"}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == ["narrow", "wide"]


def test_matcher_without_specificity_defaults_to_half() -> None:
    # Two rules tie on scene + dims; the matcher has no specificity() so both
    # score 0.5 and the sort is stable (insertion order preserved).
    matchers = {"scene": NoSpecMatcher(), "tod": NoSpecMatcher()}
    rules = [
        _rule("first", {"scene": "movie", "tod": "a"}),
        _rule("second", {"scene": "movie", "tod": "b"}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == ["first", "second"]


def test_sort_is_stable_on_full_ties() -> None:
    matchers = {"scene": NoSpecMatcher()}
    rules = [
        _rule("a", {"scene": "movie"}),
        _rule("b", {"scene": "movie"}),
        _rule("c", {"scene": "movie"}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == ["a", "b", "c"]


def test_none_predicate_is_not_a_constrained_dimension() -> None:
    matchers = {"scene": NoSpecMatcher(), "tod": NoSpecMatcher()}
    rules = [
        _rule("scene-and-tod", {"scene": "movie", "tod": "evening"}),
        _rule("scene-only-explicit-none", {"scene": "movie", "tod": None}),
    ]
    assert [r["name"] for r in sort_rules(rules, matchers)] == [
        "scene-and-tod",
        "scene-only-explicit-none",
    ]


def test_does_not_mutate_input() -> None:
    matchers = {"scene": NoSpecMatcher()}
    rules = [_rule("b", {"scene": "b"}), _rule("a", {"scene": "a"})]
    sort_rules(rules, matchers)
    assert [r["name"] for r in rules] == ["b", "a"]
