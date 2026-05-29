"""ScriptMatcher — calls a HA script, reads {match: bool} from the response."""

from __future__ import annotations

import asyncio
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.script import (
    ScriptMatcher,
    ScriptSnapshot,
    _cache_key,
)


class _StoreStub:
    """Minimal store stub exposing area/floor/house scopes for the collector."""

    def __init__(
        self,
        areas: dict[str, dict] | None = None,
        floors: dict[str, dict] | None = None,
        house: dict | None = None,
    ) -> None:
        self._areas = areas or {}
        self._floors = floors or {}
        self._house = house or {}

    def areas(self) -> dict[str, dict]:
        return self._areas

    def floors(self) -> dict[str, dict]:
        return self._floors

    def get_house(self) -> dict:
        return self._house


def _install_store(
    hass: HomeAssistant,
    areas: dict[str, dict] | None = None,
    floors: dict[str, dict] | None = None,
    house: dict | None = None,
) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _StoreStub(areas, floors, house)


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


def test_collect_pairs_walks_floors(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        floors={"f1": {"rules": [{"when": {"script": {"script": "script.floor_check"}}}]}},
    )
    pairs = ScriptMatcher(hass=hass)._collect_pairs()
    assert ("script.floor_check", "{}") in pairs


def test_collect_pairs_walks_house(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        house={"rules": [{"when": {"script": {"script": "script.house_check"}}}]},
    )
    pairs = ScriptMatcher(hass=hass)._collect_pairs()
    assert ("script.house_check", "{}") in pairs


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


def _install_service(
    hass: HomeAssistant,
    domain: str,
    name: str,
    *,
    response: object = None,
    raises: Exception | None = None,
    delay: float = 0.0,
) -> MagicMock:
    """Register a mock script.<name> service via hass.services.async_register.

    Returns the mock so the test can assert call args.
    """
    mock = MagicMock()

    async def handler(call):
        if delay:
            await asyncio.sleep(delay)
        if raises is not None:
            raise raises
        mock(call.data)
        return response

    from homeassistant.core import SupportsResponse

    hass.services.async_register(
        domain,
        name,
        handler,
        supports_response=SupportsResponse.ONLY,
    )
    return mock


async def test_snapshot_calls_each_script_once_and_records_match(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "a": {
                "rules": [
                    {"when": {"script": {"script": "script.true_one", "args": {"x": 1}}}},
                    {"when": {"script": {"script": "script.false_one"}}},
                ],
            },
        },
    )
    _install_service(hass, "script", "true_one", response={"match": True})
    _install_service(hass, "script", "false_one", response={"match": False})

    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.true_one", {"x": 1})] is True
    assert snap.results[_cache_key("script.false_one", {})] is False


async def test_snapshot_no_match_when_match_key_absent(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.no_key"}}}]}})
    _install_service(hass, "script", "no_key", response={"other": True})
    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.no_key", {})] is False


async def test_snapshot_no_match_when_match_is_not_bool_true(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.truthy"}}}]}})
    _install_service(hass, "script", "truthy", response={"match": "yes"})  # truthy but not True
    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.truthy", {})] is False


async def test_snapshot_missing_script_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.gone"}}}]}})
    # No service registered.
    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.gone", {})] is False
    assert "script.gone" in caplog.text


async def test_snapshot_script_raises_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.boom"}}}]}})
    _install_service(hass, "script", "boom", raises=RuntimeError("kaboom"))
    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.boom", {})] is False
    assert "script.boom" in caplog.text


async def test_snapshot_timeout_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.slow"}}}]}})
    # Delay longer than the override timeout.
    _install_service(hass, "script", "slow", response={"match": True}, delay=0.2)
    m = ScriptMatcher(hass=hass)
    m._timeout_seconds = 0.05
    snap = await m.snapshot(hass)
    assert snap.results[_cache_key("script.slow", {})] is False
    assert "timeout" in caplog.text.lower()


async def test_snapshot_passes_args_to_service_call(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {"a": {"rules": [{"when": {"script": {"script": "script.echo", "args": {"k": 7}}}}]}},
    )
    spy = _install_service(hass, "script", "echo", response={"match": True})
    await ScriptMatcher(hass=hass).snapshot(hass)
    spy.assert_called_once_with({"k": 7})


async def test_snapshot_empty_when_no_script_predicates(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"state": {"x": 1}}}]}})
    snap = await ScriptMatcher(hass=hass).snapshot(hass)
    assert snap.results == {}


async def test_snapshot_reuses_cached_result_within_ttl(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.cached"}}}]}})
    spy = _install_service(hass, "script", "cached", response={"match": True})

    m = ScriptMatcher(hass=hass)
    # Long TTL so the second tick reuses the first call's result.
    m._ttl_seconds = 60.0

    await m.snapshot(hass)
    await m.snapshot(hass)
    assert spy.call_count == 1  # second snapshot hit the cache


async def test_snapshot_recalls_after_ttl_expiry(hass: HomeAssistant, monkeypatch) -> None:
    _install_store(hass, {"a": {"rules": [{"when": {"script": {"script": "script.expires"}}}]}})
    spy = _install_service(hass, "script", "expires", response={"match": True})

    m = ScriptMatcher(hass=hass)
    m._ttl_seconds = 0.1

    fake_now = [1000.0]
    monkeypatch.setattr(
        "custom_components.ambience.matchers.script._monotonic", lambda: fake_now[0]
    )

    await m.snapshot(hass)
    fake_now[0] += 0.05
    await m.snapshot(hass)  # still within TTL
    assert spy.call_count == 1
    fake_now[0] += 0.2  # past TTL
    await m.snapshot(hass)
    assert spy.call_count == 2


async def test_snapshot_caches_per_args(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "a": {
                "rules": [
                    {"when": {"script": {"script": "script.same", "args": {"k": 1}}}},
                    {"when": {"script": {"script": "script.same", "args": {"k": 2}}}},
                ],
            },
        },
    )
    spy = _install_service(hass, "script", "same", response={"match": True})

    m = ScriptMatcher(hass=hass)
    m._ttl_seconds = 60.0
    await m.snapshot(hass)
    await m.snapshot(hass)
    # Two distinct arg-sets => two calls on first snapshot; second snapshot cached.
    assert spy.call_count == 2
