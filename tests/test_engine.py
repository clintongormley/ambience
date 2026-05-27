"""Rule engine is pure: no HA, no I/O. `scene` is just another matcher key."""

from __future__ import annotations

from typing import Any

import pytest

from custom_components.ambience.engine import resolve


class FakeMatcher:
    """Test double — matches when predicate == snapshot."""

    def __init__(self, name: str) -> None:
        self.name = name

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate == snapshot


@pytest.fixture
def matchers() -> dict[str, FakeMatcher]:
    return {
        "scene": FakeMatcher("scene"),
        "tod": FakeMatcher("tod"),
        "wx": FakeMatcher("wx"),
    }


def test_empty_rule_list_returns_none(matchers: dict[str, FakeMatcher]) -> None:
    assert resolve([], {"scene": "movie", "tod": "evening"}, matchers) is None


def test_scene_only_match(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": "movie"}, "actions": []}]
    result = resolve(rules, {"scene": "movie"}, matchers)
    assert result is not None
    idx, rule = result
    assert idx == 0
    assert rule is rules[0]


def test_scene_mismatch_skips_rule(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": "reading"}, "actions": []}]
    assert resolve(rules, {"scene": "movie"}, matchers) is None


def test_scene_none_is_wildcard(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": None}, "actions": []}]
    assert resolve(rules, {"scene": "movie"}, matchers) is not None


def test_absent_scene_key_is_wildcard(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {}, "actions": []}]
    assert resolve(rules, {"scene": "movie"}, matchers) is not None


def test_matcher_predicate_match(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": "movie", "tod": "evening"}, "actions": []}]
    result = resolve(rules, {"scene": "movie", "tod": "evening"}, matchers)
    assert result is not None
    assert result[0] == 0


def test_matcher_predicate_mismatch(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": "movie", "tod": "evening"}, "actions": []}]
    assert resolve(rules, {"scene": "movie", "tod": "morning"}, matchers) is None


def test_first_match_wins(matchers: dict[str, FakeMatcher]) -> None:
    rules = [
        {"when": {"scene": "movie", "tod": "morning"}, "actions": []},
        {"when": {"scene": "movie"}, "actions": []},
        {"when": {"scene": "movie", "tod": "evening"}, "actions": []},
    ]
    result = resolve(rules, {"scene": "movie", "tod": "evening"}, matchers)
    assert result is not None
    assert result[0] == 1  # the wildcard rule comes before the specific evening rule


def test_unknown_matcher_skips_rule(matchers: dict[str, FakeMatcher]) -> None:
    rules = [
        {"when": {"scene": "movie", "unknown": "x"}, "actions": []},
        {"when": {"scene": "movie"}, "actions": []},
    ]
    result = resolve(rules, {"scene": "movie"}, matchers)
    assert result is not None
    assert result[0] == 1


def test_none_snapshot_skips_rule(matchers: dict[str, FakeMatcher]) -> None:
    rules = [
        {"when": {"scene": "movie", "tod": "evening"}, "actions": []},
        {"when": {"scene": "movie"}, "actions": []},
    ]
    result = resolve(rules, {"scene": "movie", "tod": None}, matchers)
    assert result is not None
    assert result[0] == 1


def test_predicate_none_is_wildcard(matchers: dict[str, FakeMatcher]) -> None:
    rules = [{"when": {"scene": "movie", "tod": None}, "actions": []}]
    result = resolve(rules, {"scene": "movie", "tod": "anything"}, matchers)
    assert result is not None


def test_missing_scene_matcher_skips_scene_constrained_rule(
    matchers: dict[str, FakeMatcher],
) -> None:
    # If 'scene' isn't in the matchers dict, a rule constraining scene cannot match.
    no_scene = {k: v for k, v in matchers.items() if k != "scene"}
    rules = [
        {"when": {"scene": "movie"}, "actions": []},
        {"when": {}, "actions": []},
    ]
    result = resolve(rules, {"scene": "movie"}, no_scene)
    assert result is not None
    assert result[0] == 1


def test_engine_routes_through_script_matcher() -> None:
    """A rule whose `when.script` predicate matches the script snapshot fires."""
    from custom_components.ambience.engine import resolve
    from custom_components.ambience.matchers.script import (
        ScriptMatcher,
        ScriptSnapshot,
        _cache_key,
    )

    matchers = {"script": ScriptMatcher()}
    key_yes = _cache_key("script.yes", {})
    key_no = _cache_key("script.no", {})
    snap = ScriptSnapshot(results={key_yes: True, key_no: False})

    rules = [
        {"name": "n", "when": {"script": {"script": "script.no"}}, "actions": []},
        {"name": "y", "when": {"script": {"script": "script.yes"}}, "actions": []},
    ]
    match = resolve(rules, {"script": snap}, matchers)
    assert match is not None
    idx, rule = match
    assert idx == 1
    assert rule["name"] == "y"
