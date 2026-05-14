"""Built-in scene matcher: equality on the activating scene."""

from __future__ import annotations

import pytest

from custom_components.ambience.matchers.scene import SceneMatcher


def test_attributes() -> None:
    m = SceneMatcher()
    assert m.name == "scene"
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""
    assert m.toggleable is False
    assert m.input == "scene_combobox"


def test_matches_is_equality() -> None:
    m = SceneMatcher()
    assert m.matches("movie", "movie") is True
    assert m.matches("movie", "reading") is False


def test_describe_returns_snapshot() -> None:
    assert SceneMatcher().describe("movie") == "movie"


def test_specificity_is_constant() -> None:
    assert SceneMatcher().specificity("movie") == 0.0


def test_validate_predicate_accepts_nonempty_string() -> None:
    SceneMatcher().validate_predicate("movie")  # must not raise


@pytest.mark.parametrize("bad", ["", "   ", None, 42, ["movie"]])
def test_validate_predicate_rejects_bad_values(bad: object) -> None:
    with pytest.raises(ValueError):
        SceneMatcher().validate_predicate(bad)


async def test_snapshot_is_not_implemented() -> None:
    """`scene`'s snapshot is injected by the service handler, never captured here."""
    with pytest.raises(NotImplementedError):
        await SceneMatcher().snapshot(None)
