"""The Ambience auto-trigger engine.

Watches each scope's rule dependencies and re-applies the winning rule when it
changes. This module holds the evaluation core: building the trigger index from
the store, and detecting which scopes had a predicate *flip* on a given fire.
The subscription / snapshot-cache / resolve-apply / lifecycle layer is added on
top of these methods.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .const import DATA_MATCHERS, DATA_STORE, DOMAIN
from .trigger_index import PredKey, TriggerIndex, build_index
from .triggers import EMPTY, TriggerSpec


class AutoTriggerEngine:
    """Builds the trigger index and detects predicate flips per scope."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        # Per-predicate last-known boolean; the flip detector compares against it.
        self._predicate_state: dict[PredKey, bool] = {}
        # Enabled-scope configs captured at the last rebuild, for predicate lookup.
        self._scope_cfgs: dict[tuple[str, str | None], dict[str, Any]] = {}
        self._index: TriggerIndex = build_index([])

    @property
    def index(self) -> TriggerIndex:
        return self._index

    def _store(self) -> Any:
        return self._hass.data[DOMAIN][DATA_STORE]

    def _matchers(self) -> dict[str, Any]:
        return self._hass.data[DOMAIN][DATA_MATCHERS]

    def async_rebuild(self) -> None:
        """Recapture enabled scopes and rebuild the trigger index from them."""
        store = self._store()
        self._scope_cfgs = {
            (scope_kind, scope_id): cfg
            for scope_kind, scope_id, cfg in store.all_scope_configs()
            if store.auto_triggers_enabled(scope_kind, scope_id)
        }
        self._index = build_index(self._build_entries())

    def _build_entries(self) -> list[tuple[PredKey, TriggerSpec]]:
        """Yield (PredKey, TriggerSpec) for every non-wildcard predicate with deps."""
        matchers = self._matchers()
        entries: list[tuple[PredKey, TriggerSpec]] = []
        for (scope_kind, scope_id), cfg in self._scope_cfgs.items():
            for rule_index, rule in enumerate(cfg.get("rules", [])):
                for matcher_key, predicate in rule.get("when", {}).items():
                    if predicate is None:  # wildcard — nothing to watch
                        continue
                    matcher = matchers.get(matcher_key)
                    if matcher is None:  # unknown matcher — can't watch
                        continue
                    trigger_deps = getattr(matcher, "trigger_deps", None)
                    spec = trigger_deps(predicate) if trigger_deps else TriggerSpec(opaque=True)
                    if spec == EMPTY:
                        continue
                    entries.append(((scope_kind, scope_id, rule_index, matcher_key), spec))
        return entries

    def _predicate_for(self, key: PredKey) -> Any:
        """The stored predicate for a PredKey, or None if it no longer exists."""
        scope_kind, scope_id, rule_index, matcher_key = key
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        rules = cfg.get("rules", [])
        if not 0 <= rule_index < len(rules):
            return None
        return rules[rule_index].get("when", {}).get(matcher_key)
