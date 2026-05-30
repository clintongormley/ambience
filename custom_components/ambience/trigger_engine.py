"""The Ambience auto-trigger engine.

Watches each scope's rule dependencies and re-applies the winning rule when it
changes. This module holds the evaluation core: building the trigger index from
the store, and detecting which scopes had a predicate *flip* on a given fire.
The subscription / snapshot-cache / resolve-apply / lifecycle layer is added on
top of these methods.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DATA_MATCHERS, DATA_STORE, DOMAIN
from .service import (
    _switch_state,
    async_execute_plan,
    async_resolve_with_snapshots,
    get_last_applied,
)
from .trigger_index import PredKey, TriggerIndex, build_index
from .triggers import EMPTY, TriggerSpec

_LOGGER = logging.getLogger(__name__)


class AutoTriggerEngine:
    """Builds the trigger index and detects predicate flips per scope."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        # Per-predicate last-known boolean; the flip detector compares against it.
        self._predicate_state: dict[PredKey, bool] = {}
        # Enabled-scope configs captured at the last rebuild, for predicate lookup.
        self._scope_cfgs: dict[tuple[str, str | None], dict[str, Any]] = {}
        self._index: TriggerIndex = build_index([])
        self._snapshots: dict[str, Any] = {}

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
        """Return (PredKey, TriggerSpec) for every non-wildcard predicate with deps."""
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

    def _recompute(
        self, fired: set[PredKey], snapshots: dict[str, Any]
    ) -> set[tuple[str, str | None]]:
        """Re-evaluate the fired predicates against `snapshots`; return the
        scopes whose boolean changed. Updates `predicate_state`. A missing/None
        snapshot evaluates the predicate to False; a first-seen predicate counts
        as a flip."""
        matchers = self._matchers()
        dirty: set[tuple[str, str | None]] = set()
        for key in fired:
            predicate = self._predicate_for(key)
            if predicate is None:
                continue
            matcher = matchers.get(key[3])
            if matcher is None:
                continue
            snap = snapshots.get(key[3])
            new_value = bool(matcher.matches(predicate, snap)) if snap is not None else False
            old_value = self._predicate_state.get(key)
            self._predicate_state[key] = new_value
            if old_value != new_value:
                dirty.add((key[0], key[1]))
        return dirty

    async def _refresh_snapshots(self, matcher_keys: set[str]) -> None:
        """Re-snapshot the given matchers into the cache (None on failure)."""
        matchers = self._matchers()
        for key in matcher_keys:
            matcher = matchers.get(key)
            if matcher is None:
                continue
            try:
                self._snapshots[key] = await matcher.snapshot(self._hass)
            except Exception as exc:  # noqa: BLE001 — any matcher error => None snapshot
                _LOGGER.warning("ambience: matcher %r snapshot failed: %s", key, exc)
                self._snapshots[key] = None

    async def _refresh_all_snapshots(self) -> None:
        await self._refresh_snapshots({k for k in self._matchers() if k != "scene"})

    async def _resolve_and_apply(
        self, scope: tuple[str, str | None], *, force: bool = False
    ) -> None:
        """Resolve a dirty scope from the snapshot cache and apply if the winning
        rule changed (or `force`). Skips when the scope's switch is off."""
        scope_kind, scope_id = scope
        if _switch_state(self._hass, scope_kind, scope_id) == "off":
            return
        plan = await async_resolve_with_snapshots(self._hass, scope_kind, scope_id, self._snapshots)
        index = plan["matched_rule_index"]
        if index is None:
            return
        if not force and index == get_last_applied(self._hass, scope_kind, scope_id):
            return
        await async_execute_plan(self._hass, scope_kind, scope_id, plan)

    async def async_evaluate(self, fired: set[PredKey]) -> None:
        """Recompute the fired predicates (refreshing only their matchers) and
        resolve+apply every scope whose winning rule changed."""
        if not fired:
            return
        await self._refresh_snapshots({key[3] for key in fired})
        for scope in self._recompute(fired, self._snapshots):
            await self._resolve_and_apply(scope)

    async def async_initial_sync(self) -> None:
        """Startup 'sync to reality': snapshot everything, seed flip state, and
        apply each enabled scope's current winner."""
        await self._refresh_all_snapshots()
        self._recompute(set(self._index.all_predicates()), self._snapshots)
        for scope in self._scope_cfgs:
            await self._resolve_and_apply(scope)
