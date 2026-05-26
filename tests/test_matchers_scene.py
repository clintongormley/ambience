"""Built-in scene matcher: equality on the activating scene."""

from __future__ import annotations

import pytest

from custom_components.ambience.matchers.scene import SceneMatcher


def test_attributes() -> None:
    m = SceneMatcher()
    assert m.name == "scene"
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""
    assert m.toggleable is True
    assert m.input == "scene_combobox"
    assert m.priority == 0


def test_matches_is_equality() -> None:
    m = SceneMatcher()
    assert m.matches("movie", "movie") is True
    assert m.matches("movie", "reading") is False


def test_describe_returns_snapshot() -> None:
    assert SceneMatcher().describe("movie") == "movie"


def test_priority_is_zero() -> None:
    assert SceneMatcher().priority == 0


def test_order_key_is_lowercased_scene_name() -> None:
    m = SceneMatcher()
    assert m.order_key("Movie") == "movie"
    assert m.order_key("reading") == "reading"


def test_validate_predicate_accepts_nonempty_string() -> None:
    SceneMatcher().validate_predicate("movie")  # must not raise


@pytest.mark.parametrize("bad", ["", "   ", None, 42, ["movie"]])
def test_validate_predicate_rejects_bad_values(bad: object) -> None:
    with pytest.raises(ValueError):
        SceneMatcher().validate_predicate(bad)


async def test_scene_matcher_snapshot_returns_none() -> None:
    """`scene`'s snapshot is injected by the service handler; snapshot() returns None."""
    assert await SceneMatcher().snapshot(None) is None
