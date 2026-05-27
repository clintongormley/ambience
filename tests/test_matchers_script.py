"""ScriptMatcher — calls a HA script, reads {match: bool} from the response."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.script import (
    ScriptMatcher,
    ScriptSnapshot,
    _cache_key,
)


class _StoreStub:
    """Minimal store stub exposing `areas()` for the snapshot collector."""

    def __init__(self, areas: dict[str, dict]) -> None:
        self._areas = areas

    def areas(self) -> dict[str, dict]:
        return self._areas


def _install_store(hass: HomeAssistant, areas: dict[str, dict]) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _StoreStub(areas)


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


def test_cache_key_is_stable_across_arg_orderings() -> None:
    k1 = _cache_key("script.foo", {"a": 1, "b": 2})
    k2 = _cache_key("script.foo", {"b": 2, "a": 1})
    assert k1 == k2


def test_cache_key_includes_script_and_args() -> None:
    assert _cache_key("script.foo", {}) != _cache_key("script.bar", {})
    assert _cache_key("script.foo", {"x": 1}) != _cache_key("script.foo", {"x": 2})


def test_matches_null_predicate_is_wildcard() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptMatcher().matches(None, snap) is True


def test_matches_returns_true_when_snapshot_says_so() -> None:
    key = _cache_key("script.foo", {"x": 1})
    snap = ScriptSnapshot(results={key: True})
    assert ScriptMatcher().matches({"script": "script.foo", "args": {"x": 1}}, snap) is True


def test_matches_returns_false_when_snapshot_says_so() -> None:
    key = _cache_key("script.foo", {})
    snap = ScriptSnapshot(results={key: False})
    assert ScriptMatcher().matches({"script": "script.foo"}, snap) is False


def test_matches_returns_false_on_cache_miss() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptMatcher().matches({"script": "script.never_called"}, snap) is False


def test_matches_returns_false_on_malformed_predicate() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptMatcher().matches("nope", snap) is False
    assert ScriptMatcher().matches({"script": 42}, snap) is False


def test_collect_pairs_walks_all_areas_and_rules(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "kitchen": {
                "rules": [
                    {"when": {"script": {"script": "script.a", "args": {"k": 1}}}},
                    {"when": {"script": {"script": "script.a", "args": {"k": 1}}}},  # dup
                ],
            },
            "living": {
                "rules": [
                    {"when": {"script": {"script": "script.b"}}},
                    {"when": {"state": {"some": "thing"}}},  # skip
                    {"when": {"script": None}},  # wildcard, skip
                ],
            },
        },
    )
    pairs = ScriptMatcher(hass=hass)._collect_pairs()
    assert sorted(pairs) == [
        ("script.a", '{"k":1}'),
        ("script.b", "{}"),
    ]


def test_collect_pairs_no_store_returns_empty(hass: HomeAssistant) -> None:
    # No store installed under DOMAIN — matcher must not blow up.
    assert ScriptMatcher(hass=hass)._collect_pairs() == []


def test_collect_pairs_skips_malformed_predicates(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "kitchen": {
                "rules": [
                    {"when": {"script": "not a dict"}},
                    {"when": {"script": {"script": 42}}},
                    {"when": {"script": {"script": "script.ok"}}},
                ],
            },
        },
    )
    pairs = ScriptMatcher(hass=hass)._collect_pairs()
    assert pairs == [("script.ok", "{}")]
