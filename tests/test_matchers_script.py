"""ScriptMatcher — calls a HA script, reads {match: bool} from the response."""

from __future__ import annotations

import pytest

from custom_components.ambience.matchers.script import ScriptMatcher


def test_protocol_fields() -> None:
    m = ScriptMatcher()
    assert m.name == "script"
    assert m.input == "script_predicate"
    assert m.priority == 25
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_validate_predicate_accepts_null() -> None:
    ScriptMatcher().validate_predicate(None)


def test_validate_predicate_accepts_well_formed() -> None:
    ScriptMatcher().validate_predicate({"script": "script.foo"})
    ScriptMatcher().validate_predicate({"script": "script.foo", "args": {}})
    ScriptMatcher().validate_predicate({"script": "script.foo", "args": {"k": 1}})


@pytest.mark.parametrize(
    "bad",
    [
        42,
        "script.foo",
        [],
        {},  # missing script
        {"script": ""},  # empty
        {"script": "foo"},  # missing script. prefix
        {"script": "script.foo", "args": []},  # args not a dict
        {"script": "script.foo", "args": "x=1"},
    ],
)
def test_validate_predicate_rejects_bad(bad: object) -> None:
    with pytest.raises(ValueError):
        ScriptMatcher().validate_predicate(bad)


def test_order_key_uses_script_id() -> None:
    assert ScriptMatcher().order_key({"script": "script.foo"}) == "script.foo"
    assert ScriptMatcher().order_key(None) == ""
    assert ScriptMatcher().order_key("nonsense") == ""


def test_describe_returns_none() -> None:
    # Script matcher has no single "current value" — per-predicate.
    assert ScriptMatcher().describe(object()) is None
