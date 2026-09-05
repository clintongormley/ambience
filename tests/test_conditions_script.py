"""ScriptCondition — calls a HA script, reads {match: bool} from the response."""

from __future__ import annotations

import asyncio
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ambience.conditions.script import (
    ScriptCondition,
    ScriptSnapshot,
    _cache_key,
)
from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.errors import AmbienceError


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

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return [
            *(("area", aid, cfg) for aid, cfg in self._areas.items()),
            *(("floor", fid, cfg) for fid, cfg in self._floors.items()),
            ("house", None, self._house),
        ]


def _install_store(
    hass: HomeAssistant,
    areas: dict[str, dict] | None = None,
    floors: dict[str, dict] | None = None,
    house: dict | None = None,
) -> None:
    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _StoreStub(areas, floors, house)


def test_protocol_fields() -> None:
    m = ScriptCondition()
    assert m.name == "script"
    assert m.input == "script_predicate"
    assert m.priority == 975
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def test_validate_predicate_accepts_null() -> None:
    ScriptCondition().validate_predicate(None)


def test_validate_predicate_accepts_well_formed() -> None:
    ScriptCondition().validate_predicate({"script": "script.foo"})
    ScriptCondition().validate_predicate({"script": "script.foo", "args": {}})
    ScriptCondition().validate_predicate({"script": "script.foo", "args": {"k": 1}})


@pytest.mark.parametrize(
    "bad,key",
    [
        (42, "script_predicate_not_object"),
        ("script.foo", "script_predicate_not_object"),
        ([], "script_predicate_not_object"),
        ({}, "script_id_invalid"),  # missing script
        ({"script": ""}, "script_id_invalid"),  # empty
        ({"script": "foo"}, "script_id_invalid"),  # missing script. prefix
        ({"script": "script."}, "entity_id_invalid"),  # domain prefix alone
        ({"script": "script.Bad Id"}, "entity_id_invalid"),
        ({"script": "script.foo", "args": []}, "script_args_not_object"),
        ({"script": "script.foo", "args": "x=1"}, "script_args_not_object"),
    ],
)
def test_validate_predicate_rejects_bad(bad: object, key: str) -> None:
    with pytest.raises(AmbienceError) as exc:
        ScriptCondition().validate_predicate(bad)
    assert exc.value.translation_key == key


def test_order_key_uses_script_id() -> None:
    assert ScriptCondition().order_key({"script": "script.foo"}) == "script.foo"
    assert ScriptCondition().order_key(None) == ""
    assert ScriptCondition().order_key("nonsense") == ""


def test_describe_returns_none() -> None:
    # Script condition has no single "current value" — per-predicate.
    assert ScriptCondition().describe(object()) is None


def test_cache_key_is_stable_across_arg_orderings() -> None:
    k1 = _cache_key("script.foo", {"a": 1, "b": 2})
    k2 = _cache_key("script.foo", {"b": 2, "a": 1})
    assert k1 == k2


def test_cache_key_includes_script_and_args() -> None:
    assert _cache_key("script.foo", {}) != _cache_key("script.bar", {})
    assert _cache_key("script.foo", {"x": 1}) != _cache_key("script.foo", {"x": 2})


def test_matches_null_predicate_is_wildcard() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptCondition().matches(None, snap) is True


def test_matches_returns_true_when_snapshot_says_so() -> None:
    key = _cache_key("script.foo", {"x": 1})
    snap = ScriptSnapshot(results={key: True})
    assert ScriptCondition().matches({"script": "script.foo", "args": {"x": 1}}, snap) is True


def test_matches_returns_false_when_snapshot_says_so() -> None:
    key = _cache_key("script.foo", {})
    snap = ScriptSnapshot(results={key: False})
    assert ScriptCondition().matches({"script": "script.foo"}, snap) is False


def test_matches_returns_false_on_cache_miss() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptCondition().matches({"script": "script.never_called"}, snap) is False


def test_matches_returns_false_on_malformed_predicate() -> None:
    snap = ScriptSnapshot(results={})
    assert ScriptCondition().matches("nope", snap) is False
    assert ScriptCondition().matches({"script": 42}, snap) is False


def test_collect_pairs_walks_all_areas_and_scenes(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "kitchen": {
                "scenes": [
                    {"when": {"script": {"script": "script.a", "args": {"k": 1}}}},
                    {"when": {"script": {"script": "script.a", "args": {"k": 1}}}},  # dup
                ],
            },
            "living": {
                "scenes": [
                    {"when": {"script": {"script": "script.b"}}},
                    {"when": {"state": {"some": "thing"}}},  # skip
                    {"when": {"script": None}},  # wildcard, skip
                ],
            },
        },
    )
    pairs = ScriptCondition(hass=hass)._collect_pairs()
    assert sorted(pairs) == [
        ("script.a", '{"k":1}'),
        ("script.b", "{}"),
    ]


def test_collect_pairs_walks_floors(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        floors={"f1": {"scenes": [{"when": {"script": {"script": "script.floor_check"}}}]}},
    )
    pairs = ScriptCondition(hass=hass)._collect_pairs()
    assert ("script.floor_check", "{}") in pairs


def test_collect_pairs_walks_house(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        house={"scenes": [{"when": {"script": {"script": "script.house_check"}}}]},
    )
    pairs = ScriptCondition(hass=hass)._collect_pairs()
    assert ("script.house_check", "{}") in pairs


def test_collect_pairs_no_store_returns_empty(hass: HomeAssistant) -> None:
    # No store installed under DOMAIN — condition must not blow up.
    assert ScriptCondition(hass=hass)._collect_pairs() == []


def test_collect_pairs_skips_malformed_predicates(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {
            "kitchen": {
                "scenes": [
                    {"when": {"script": "not a dict"}},
                    {"when": {"script": {"script": 42}}},
                    {"when": {"script": {"script": "script.ok"}}},
                ],
            },
        },
    )
    pairs = ScriptCondition(hass=hass)._collect_pairs()
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
                "scenes": [
                    {"when": {"script": {"script": "script.true_one", "args": {"x": 1}}}},
                    {"when": {"script": {"script": "script.false_one"}}},
                ],
            },
        },
    )
    _install_service(hass, "script", "true_one", response={"match": True})
    _install_service(hass, "script", "false_one", response={"match": False})

    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.true_one", {"x": 1})] is True
    assert snap.results[_cache_key("script.false_one", {})] is False


async def test_snapshot_no_match_when_match_key_absent(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.no_key"}}}]}})
    _install_service(hass, "script", "no_key", response={"other": True})
    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.no_key", {})] is False


async def test_snapshot_no_match_when_match_is_not_bool_true(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.truthy"}}}]}})
    _install_service(hass, "script", "truthy", response={"match": "yes"})  # truthy but not True
    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.truthy", {})] is False


async def test_snapshot_missing_script_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.gone"}}}]}})
    # No service registered.
    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.gone", {})] is False
    assert "script.gone" in caplog.text


async def test_snapshot_script_raises_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.boom"}}}]}})
    _install_service(hass, "script", "boom", raises=RuntimeError("kaboom"))
    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results[_cache_key("script.boom", {})] is False
    assert "script.boom" in caplog.text


async def test_snapshot_timeout_records_false(hass: HomeAssistant, caplog) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.slow"}}}]}})
    # Delay longer than the override timeout.
    _install_service(hass, "script", "slow", response={"match": True}, delay=0.2)
    m = ScriptCondition(hass=hass)
    m._timeout_seconds = 0.05
    snap = await m.snapshot(hass)
    assert snap.results[_cache_key("script.slow", {})] is False
    assert "timeout" in caplog.text.lower()


async def test_snapshot_passes_args_to_service_call(hass: HomeAssistant) -> None:
    _install_store(
        hass,
        {"a": {"scenes": [{"when": {"script": {"script": "script.echo", "args": {"k": 7}}}}]}},
    )
    spy = _install_service(hass, "script", "echo", response={"match": True})
    await ScriptCondition(hass=hass).snapshot(hass)
    spy.assert_called_once_with({"k": 7})


async def test_snapshot_empty_when_no_script_predicates(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"state": {"x": 1}}}]}})
    snap = await ScriptCondition(hass=hass).snapshot(hass)
    assert snap.results == {}


async def test_snapshot_reuses_cached_result_within_ttl(hass: HomeAssistant) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.cached"}}}]}})
    spy = _install_service(hass, "script", "cached", response={"match": True})

    m = ScriptCondition(hass=hass)
    # Long TTL so the second tick reuses the first call's result.
    m._ttl_seconds = 60.0

    await m.snapshot(hass)
    await m.snapshot(hass)
    assert spy.call_count == 1  # second snapshot hit the cache


async def test_snapshot_recalls_after_ttl_expiry(hass: HomeAssistant, monkeypatch) -> None:
    _install_store(hass, {"a": {"scenes": [{"when": {"script": {"script": "script.expires"}}}]}})
    spy = _install_service(hass, "script", "expires", response={"match": True})

    m = ScriptCondition(hass=hass)
    m._ttl_seconds = 0.1

    fake_now = [1000.0]
    monkeypatch.setattr(
        "custom_components.ambience.conditions.script._monotonic", lambda: fake_now[0]
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
                "scenes": [
                    {"when": {"script": {"script": "script.same", "args": {"k": 1}}}},
                    {"when": {"script": {"script": "script.same", "args": {"k": 2}}}},
                ],
            },
        },
    )
    spy = _install_service(hass, "script", "same", response={"match": True})

    m = ScriptCondition(hass=hass)
    m._ttl_seconds = 60.0
    await m.snapshot(hass)
    await m.snapshot(hass)
    # Two distinct arg-sets => two calls on first snapshot; second snapshot cached.
    assert spy.call_count == 2


def test_trigger_deps_is_opaque_with_no_declared_triggers() -> None:
    spec = ScriptCondition().trigger_deps({"script": "script.foo"})
    assert spec.opaque is True
    assert spec.entities == frozenset()


def test_trigger_deps_includes_declared_triggers() -> None:
    spec = ScriptCondition().trigger_deps(
        {"script": "script.foo", "triggers": ["person.john", "input_boolean.guest"]}
    )
    assert spec.opaque is True
    assert spec.entities == frozenset({"person.john", "input_boolean.guest"})


def test_trigger_deps_none_predicate_is_opaque_no_entities() -> None:
    spec = ScriptCondition().trigger_deps(None)
    assert spec.opaque is True
    assert spec.entities == frozenset()


def test_validate_predicate_accepts_valid_triggers() -> None:
    ScriptCondition().validate_predicate({"script": "script.foo", "triggers": ["person.john"]})


def test_validate_predicate_rejects_non_list_triggers() -> None:
    with pytest.raises(AmbienceError) as exc:
        ScriptCondition().validate_predicate({"script": "script.foo", "triggers": "person.john"})
    assert exc.value.translation_key == "script_triggers_invalid"


def test_validate_predicate_rejects_non_string_trigger_items() -> None:
    with pytest.raises(AmbienceError) as exc:
        ScriptCondition().validate_predicate(
            {"script": "script.foo", "triggers": ["person.john", 5]}
        )
    assert exc.value.translation_key == "entity_id_invalid"


def test_validate_predicate_rejects_empty_string_trigger() -> None:
    with pytest.raises(AmbienceError) as exc:
        ScriptCondition().validate_predicate({"script": "script.foo", "triggers": [""]})
    assert exc.value.translation_key == "entity_id_invalid"


def test_validate_predicate_accepts_empty_triggers_list() -> None:
    # An empty list means "no declared triggers" — equivalent to omitting it.
    ScriptCondition().validate_predicate({"script": "script.foo", "triggers": []})


def test_trigger_deps_skips_non_string_trigger_items() -> None:
    # Line 129->128 branch: a non-string or empty-string item in `triggers`
    # fails the isinstance guard and is silently skipped (loop continues).
    spec = ScriptCondition().trigger_deps({"script": "script.foo", "triggers": [42, None, ""]})
    assert spec.entities == frozenset()
    assert spec.opaque is True


def test_collect_pairs_returns_empty_without_hass() -> None:
    # Line 140: _collect_pairs() returns [] immediately when hass is None.
    assert ScriptCondition(hass=None)._collect_pairs() == []


def test_collect_pairs_skips_truthy_non_dict_args(hass: HomeAssistant) -> None:
    # Line 154: `args` resolves to a truthy non-dict (e.g. a list) → continue.
    # `pred.get("args") or {}` only replaces falsy values, so [1, 2] passes
    # through and hits the isinstance(args, dict) guard.
    _install_store(
        hass,
        {
            "kitchen": {
                "scenes": [
                    {"when": {"script": {"script": "script.bad_args", "args": [1, 2]}}},
                    {"when": {"script": {"script": "script.ok"}}},
                ],
            },
        },
    )
    pairs = ScriptCondition(hass=hass)._collect_pairs()
    # bad_args entry must be skipped; ok entry must be collected.
    assert pairs == [("script.ok", "{}")]


async def test_call_one_returns_false_for_non_dict_response() -> None:
    # Line 216: when async_call returns a non-dict (e.g. a plain string),
    # _call_one returns False. Tested via direct call with a minimal mock so
    # HA's own response-validation layer is bypassed.
    from unittest.mock import AsyncMock, MagicMock

    mock_hass = MagicMock()
    mock_hass.services.async_call = AsyncMock(return_value="not_a_dict")
    result = await ScriptCondition()._call_one(mock_hass, "script.foo", "{}")
    assert result is False


async def test_snapshot_evicts_cache_keys_no_longer_referenced(hass: HomeAssistant) -> None:
    """Keys for (script, args) pairs no longer present in any scene must be
    dropped, or the cache grows for the lifetime of the singleton."""
    _install_store(
        hass,
        {"a": {"scenes": [{"when": {"script": {"script": "script.live"}}}]}},
    )
    _install_service(hass, "script", "live", response={"match": True})
    cond = ScriptCondition(hass=hass)
    cond._cache["stale-key"] = (True, 1e18)  # far-future expiry; must still go
    await cond.snapshot(hass)
    assert "stale-key" not in cond._cache
    assert _cache_key("script.live", {}) in cond._cache
