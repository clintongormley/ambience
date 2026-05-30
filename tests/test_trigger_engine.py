"""AutoTriggerEngine evaluation core — index build + flip detection."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.const import DATA_MATCHERS, DATA_STORE, DOMAIN
from custom_components.ambience.trigger_engine import AutoTriggerEngine
from custom_components.ambience.triggers import EMPTY, TriggerSpec


class FakeStore:
    """Minimal store: fixed scope configs + per-scope enabled flag (default True)."""

    def __init__(
        self,
        scopes: list[tuple[str, str | None, dict]],
        enabled: dict[tuple[str, str | None], bool] | None = None,
    ) -> None:
        self._scopes = scopes
        self._enabled = enabled or {}

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return list(self._scopes)

    def auto_triggers_enabled(self, scope_kind: str, scope_id: str | None) -> bool:
        return self._enabled.get((scope_kind, scope_id), True)


class DepsMatcher:
    """Matcher stub: trigger_deps returns a fixed spec; matches compares equality."""

    def __init__(self, spec: TriggerSpec) -> None:
        self._spec = spec

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        return self._spec

    def matches(self, predicate: Any, snapshot: Any) -> bool:
        return predicate is None or predicate == snapshot


def _engine(hass, scopes, matchers, enabled=None) -> AutoTriggerEngine:
    hass.data[DOMAIN] = {DATA_STORE: FakeStore(scopes, enabled), DATA_MATCHERS: matchers}
    return AutoTriggerEngine(hass)


async def test_rebuild_indexes_enabled_scope_predicate(hass) -> None:
    scopes = [
        ("area", "kitchen", {"rules": [{"when": {"state": "x"}}]}),
    ]
    matchers = {"state": DepsMatcher(TriggerSpec(entities=frozenset({"binary_sensor.motion"})))}
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    idx = engine.index
    assert idx.by_entity["binary_sensor.motion"] == frozenset(
        {("area", "kitchen", 0, "state")}
    )


async def test_rebuild_skips_disabled_scope(hass) -> None:
    scopes = [("area", "kitchen", {"rules": [{"when": {"state": "x"}}]})]
    matchers = {"state": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.a"})))}
    engine = _engine(hass, scopes, matchers, enabled={("area", "kitchen"): False})
    engine.async_rebuild()
    assert engine.index.by_entity == {}


async def test_rebuild_skips_none_predicate_and_empty_deps(hass) -> None:
    scopes = [
        (
            "house",
            None,
            {
                "rules": [
                    {"when": {"state": None, "weather": "w"}},
                ]
            },
        )
    ]
    matchers = {
        "state": DepsMatcher(TriggerSpec(entities=frozenset({"sensor.a"}))),
        "weather": DepsMatcher(EMPTY),
    }
    engine = _engine(hass, scopes, matchers)
    engine.async_rebuild()
    assert engine.index.by_entity == {}
    assert engine.index.entities == frozenset()


async def test_rebuild_unknown_matcher_is_skipped(hass) -> None:
    scopes = [("area", "a", {"rules": [{"when": {"mystery": "p"}}]})]
    engine = _engine(hass, scopes, {})
    engine.async_rebuild()
    assert engine.index.entities == frozenset()


async def test_rebuild_matcher_without_trigger_deps_is_opaque(hass) -> None:
    class NoDeps:
        def matches(self, predicate, snapshot):
            return True

    scopes = [("area", "a", {"rules": [{"when": {"legacy": "p"}}]})]
    engine = _engine(hass, scopes, {"legacy": NoDeps()})
    engine.async_rebuild()
    assert engine.index.opaque == frozenset({("area", "a", 0, "legacy")})
