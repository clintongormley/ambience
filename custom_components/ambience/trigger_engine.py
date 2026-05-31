"""The Ambience auto-trigger engine.

Watches each scope's rule dependencies and re-applies the winning rule when it
changes. This module holds the evaluation core: building the trigger index from
the store, and detecting which scopes had a predicate *flip* on a given fire.
The subscription / snapshot-cache / resolve-apply / lifecycle layer is added on
top of these methods.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from datetime import timedelta
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .const import DATA_EXPOSED_ACTIONS, DATA_MATCHERS, DATA_STORE, DATA_SWITCHES, DOMAIN
from .matchers.time_of_day import ANCHOR_ATTR
from .scope_triggers import filter_spec, iter_predicate_specs
from .service import (
    _switch_state,
    async_execute_actions,
    async_execute_plan,
    async_resolve_with_snapshots,
    effective_reapply_seconds,
    get_last_applied,
    scope_reapply_intervals,
)
from .trigger_index import PredKey, TriggerIndex, build_index
from .triggers import EMPTY, TriggerSpec

_LOGGER = logging.getLogger(__name__)

# How often wall-clock-dependent (has_time) predicates are recomputed.
_HAS_TIME_INTERVAL = timedelta(seconds=60)

# Coalesce a burst of config-changed signals (e.g. a multi-field panel save)
# into a single rebuild + resync.
_CONFIG_DEBOUNCE_SECONDS = 0.3


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
        self._unsubs: list[Callable[[], None]] = []
        # Sun-event point-in-time handles, one slot per (anchor, offset). Kept
        # separate from _unsubs because they re-arm on each fire — the slot is
        # replaced rather than appended, so dead handles never accumulate.
        self._sun_unsubs: dict[tuple[str, int], Callable[[], None]] = {}
        self._for_handles: dict[PredKey, list[Callable[[], None]]] = {}
        self._switch_scopes: dict[str, tuple[str, str | None]] = {}
        self._reapply_intervals: dict[int, set[tuple[str, str | None]]] = {}
        # Debounced full refresh, for coalescing rapid config-changed signals.
        self._refresh_debouncer = Debouncer(
            hass,
            _LOGGER,
            cooldown=_CONFIG_DEBOUNCE_SECONDS,
            immediate=False,
            function=self._async_refresh,
        )

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
        # Drop flip-state for predicates that no longer exist (rules removed /
        # reordered), so it can't grow unbounded across config edits.
        live = self._index.all_predicates()
        self._predicate_state = {
            key: value for key, value in self._predicate_state.items() if key in live
        }
        self._reapply_intervals = self._build_reapply_intervals()

    def _build_entries(self) -> list[tuple[PredKey, TriggerSpec]]:
        """Return (PredKey, TriggerSpec) for every non-wildcard predicate with deps.

        Watches the user has disabled for a scope (``store.auto_triggers_disabled``)
        are stripped per predicate, so a disabled entity/time stops waking the
        scope while every other watch keeps working.
        """
        store = self._store()
        matchers = self._matchers()
        entries: list[tuple[PredKey, TriggerSpec]] = []
        for (scope_kind, scope_id), cfg in self._scope_cfgs.items():
            disabled = store.auto_triggers_disabled(scope_kind, scope_id)
            for rule_index, matcher_key, spec in iter_predicate_specs(matchers, cfg):
                spec = filter_spec(spec, disabled)
                if spec == EMPTY:
                    continue
                entries.append(((scope_kind, scope_id, rule_index, matcher_key), spec))
        return entries

    def _build_reapply_intervals(self) -> dict[int, set[tuple[str, str | None]]]:
        """Map each distinct re-apply interval to the enabled scopes that have
        at least one action using it. `_scope_cfgs` already excludes scopes with
        auto-triggers disabled, so those never get scheduled."""
        exposed = self._hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
        by_interval: dict[int, set[tuple[str, str | None]]] = {}
        for scope_key, cfg in self._scope_cfgs.items():
            for interval in scope_reapply_intervals(cfg, exposed):
                by_interval.setdefault(interval, set()).add(scope_key)
        return by_interval

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
        await self._refresh_snapshots(set(self._matchers()))

    async def _resolve_and_apply(
        self, scope: tuple[str, str | None], *, force: bool = False
    ) -> None:
        """Resolve a dirty scope from the snapshot cache and apply if the winning
        rule changed (or `force`). Skips when the scope's switch is off."""
        scope_kind, scope_id = scope
        if _switch_state(self._hass, scope_kind, scope_id) == "off":
            return
        plan = await async_resolve_with_snapshots(
            self._hass, scope_kind, scope_id, self._snapshots, describe=False
        )
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

    async def _async_refresh(self) -> None:
        """Full (re)build: rebuild the index, resubscribe, and sync to reality."""
        self.async_rebuild()
        self.async_subscribe()
        await self.async_initial_sync()

    async def async_start(self) -> None:
        """Build the index, subscribe, and run the startup sync pass (immediate)."""
        await self._async_refresh()

    async def async_request_refresh(self) -> None:
        """Request a full refresh, debounced to coalesce rapid config changes."""
        await self._refresh_debouncer.async_call()

    def async_shutdown(self) -> None:
        """Tear down all subscriptions, timers, and the refresh debouncer."""
        self._refresh_debouncer.async_shutdown()
        self._teardown()

    async def async_initial_sync(self) -> None:
        """Startup 'sync to reality': snapshot everything, seed flip state, and
        apply each enabled scope's current winner."""
        await self._refresh_all_snapshots()
        self._recompute(set(self._index.all_predicates()), self._snapshots)
        for scope in self._scope_cfgs:
            await self._resolve_and_apply(scope)

    def _fire(self, fired: set[PredKey]) -> None:
        """Schedule a re-evaluation of the given predicates (callback-safe)."""
        if fired:
            self._hass.async_create_task(self.async_evaluate(fired))

    def _teardown(self) -> None:
        """Cancel all subscriptions and pending timers."""
        while self._unsubs:
            self._unsubs.pop()()
        for cancel in self._sun_unsubs.values():
            cancel()
        self._sun_unsubs.clear()
        for handles in self._for_handles.values():
            for cancel in handles:
                cancel()
        self._for_handles.clear()
        self._switch_scopes.clear()

    def async_subscribe(self) -> None:
        """(Re)create one subscription per distinct dependency in the index."""
        self._teardown()
        index = self._index
        if index.entities:
            self._unsubs.append(
                async_track_state_change_event(
                    self._hass, list(index.entities), self._on_state_event
                )
            )
        for clock in index.clock_times:
            self._unsubs.append(
                async_track_time_change(
                    self._hass,
                    self._make_keys_handler(index.by_clock[clock]),
                    hour=clock[0],
                    minute=clock[1],
                    second=0,
                )
            )
        if index.midnight:
            self._unsubs.append(
                async_track_time_change(
                    self._hass,
                    self._make_keys_handler(index.midnight),
                    hour=0,
                    minute=0,
                    second=0,
                )
            )
        for sun_event in index.sun_events:
            self._schedule_sun(sun_event)
        if index.has_time:
            self._unsubs.append(
                async_track_time_interval(
                    self._hass,
                    self._make_keys_handler(index.has_time),
                    _HAS_TIME_INTERVAL,
                )
            )
        for interval, scopes in self._reapply_intervals.items():
            self._unsubs.append(
                async_track_time_interval(
                    self._hass,
                    self._make_reapply_handler(interval, scopes),
                    timedelta(seconds=interval),
                )
            )
        self._switch_scopes = {}
        switches = self._hass.data[DOMAIN].get(DATA_SWITCHES, {})
        for scope_key in self._scope_cfgs:
            entity_id = getattr(switches.get(scope_key), "entity_id", None)
            if entity_id:
                self._switch_scopes[entity_id] = scope_key
        if self._switch_scopes:
            self._unsubs.append(
                async_track_state_change_event(
                    self._hass, list(self._switch_scopes), self._on_switch_event
                )
            )

    @callback
    def _on_state_event(self, event: Event) -> None:
        preds = self._index.by_entity.get(event.data["entity_id"])
        if not preds:
            return
        self._fire(set(preds))
        self._schedule_for_rechecks(preds)

    def _make_keys_handler(self, preds: frozenset[PredKey]) -> Callable[[Any], None]:
        """A time/midnight callback that fires a fixed set of predicates."""
        keys = set(preds)

        @callback
        def _handler(_now: Any) -> None:
            self._fire(set(keys))

        return _handler

    def _make_reapply_handler(
        self, interval: int, scopes: set[tuple[str, str | None]]
    ) -> Callable[[Any], None]:
        scope_set = set(scopes)

        @callback
        def _handler(_now: Any) -> None:
            self._hass.async_create_task(self._reapply_tick(interval, scope_set))

        return _handler

    async def _reapply_tick(self, interval: int, scopes: set[tuple[str, str | None]]) -> None:
        # Scopes are independent — re-apply them concurrently.
        await asyncio.gather(*(self._reapply_scope(scope, interval) for scope in scopes))

    async def _reapply_scope(self, scope: tuple[str, str | None], interval: int) -> None:
        """Re-fire the current winning rule's actions due at `interval`.

        Uses last-applied (kept current by the watch system) rather than
        re-resolving, and never mutates last-applied. Skips when the switch is
        off, no rule is active, or the stored index is out of range.
        """
        scope_kind, scope_id = scope
        if _switch_state(self._hass, scope_kind, scope_id) == "off":
            return
        index = get_last_applied(self._hass, scope_kind, scope_id)
        if index is None:
            return
        cfg = self._scope_cfgs.get(scope)
        if cfg is None:
            return
        rules = cfg.get("rules", [])
        if not 0 <= index < len(rules):
            return
        exposed = self._hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
        due = [
            action
            for action in rules[index].get("actions", [])
            if effective_reapply_seconds(action, exposed) == interval
        ]
        if due:
            await async_execute_actions(self._hass, scope_kind, scope_id, due, rule_index=index)

    def _schedule_for_rechecks(self, preds: frozenset[PredKey]) -> None:
        """For predicates with a `for:` duration, (re)schedule a recheck so a
        condition that only becomes true after the delay is still caught."""
        for key in preds:
            durations = self._index.durations.get(key)
            if not durations:
                continue
            for cancel in self._for_handles.pop(key, []):
                cancel()
            self._for_handles[key] = [
                async_call_later(self._hass, seconds, self._make_for_recheck(key))
                for seconds in durations
            ]

    def _make_for_recheck(self, key: PredKey) -> Callable[[Any], None]:
        @callback
        def _recheck(_now: Any) -> None:
            self._for_handles.pop(key, None)
            self._fire({key})

        return _recheck

    @callback
    def _on_switch_event(self, event: Event) -> None:
        """Force a resync when a scope's switch goes off->on."""
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        if new_state is None or new_state.state != "on":
            return
        if old_state is not None and old_state.state == "on":
            return  # already on — not a transition
        scope = self._switch_scopes.get(event.data["entity_id"])
        if scope is not None:
            self._hass.async_create_task(self._resolve_and_apply(scope, force=True))

    def _next_sun_fire(self, anchor: str, offset_min: int) -> Any:
        """Next fire time for a sun anchor (+offset), from sun.sun, or None."""
        state = self._hass.states.get("sun.sun")
        attr = ANCHOR_ATTR.get(anchor)
        raw = state.attributes.get(attr) if (state and attr) else None
        parsed = dt_util.parse_datetime(raw) if raw else None
        if parsed is None:
            return None
        return parsed + timedelta(minutes=offset_min)

    def _schedule_sun(self, sun_event: tuple[str, int]) -> None:
        """Schedule the next firing of a sun event, rescheduling on fire.

        The handle lives in `_sun_unsubs[sun_event]`; re-arming cancels and
        replaces the slot so fired (dead) handles never accumulate.
        """
        fire_at = self._next_sun_fire(sun_event[0], sun_event[1])
        if fire_at is None:
            return

        @callback
        def _handler(_now: Any) -> None:
            preds = self._index.by_sun.get(sun_event)
            if preds:
                self._fire(set(preds))
            self._schedule_sun(sun_event)  # arm the next occurrence

        old = self._sun_unsubs.pop(sun_event, None)
        if old is not None:
            old()
        self._sun_unsubs[sun_event] = async_track_point_in_time(self._hass, _handler, fire_at)
