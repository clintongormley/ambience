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
from collections import defaultdict
from collections.abc import Callable, Iterable
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

from .conditions.time_of_day import ANCHOR_ATTR
from .const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from .scope_triggers import iter_predicate_specs
from .service import (
    _log_apply,
    _switch_state,
    async_execute_actions,
    async_execute_plan,
    async_resolve_with_snapshots,
    category_ids,
    effective_reapply_seconds,
    get_last_applied,
    scope_reapply_intervals,
)
from .trace import (
    CauseKind,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    emit_trace,
    tracing_active,
)
from .trigger_index import PredKey, TriggerIndex, build_index
from .triggers import EMPTY, TriggerSpec

_LOGGER = logging.getLogger(__name__)

# How often wall-clock-dependent (has_time) predicates are recomputed.
_HAS_TIME_INTERVAL = timedelta(seconds=60)

# Coalesce a burst of config-changed signals (e.g. a multi-field panel save)
# into a single rebuild + resync.
_CONFIG_DEBOUNCE_SECONDS = 0.3

# Containment tiers, applied in order: areas → floors → house. House applies
# last so it wins on entities shared across scopes (preserves prior behavior).
_TIER = {"area": 0, "floor": 1, "house": 2}


class AutoTriggerEngine:
    """Builds the trigger index and detects predicate flips per scope."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        # Per-predicate last-known boolean; the flip detector compares against it.
        self._predicate_state: dict[PredKey, bool] = {}
        # Scope configs captured at the last rebuild, for predicate lookup.
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

    def _conditions(self) -> dict[str, Any]:
        return self._hass.data[DOMAIN][DATA_CONDITIONS]

    def async_rebuild(self) -> None:
        """Recapture every scope and rebuild the trigger index from them."""
        store = self._store()
        self._scope_cfgs = {
            (scope_kind, scope_id): cfg for scope_kind, scope_id, cfg in store.all_scope_configs()
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

        Every watch a scope's rules imply is registered — auto-triggers are
        always on.
        """
        conditions = self._conditions()
        entries: list[tuple[PredKey, TriggerSpec]] = []
        for (scope_kind, scope_id), cfg in self._scope_cfgs.items():
            for rule_index, condition_key, spec in iter_predicate_specs(conditions, cfg):
                if spec == EMPTY:
                    continue
                entries.append(((scope_kind, scope_id, rule_index, condition_key), spec))
        return entries

    def _build_reapply_intervals(self) -> dict[int, set[tuple[str, str | None]]]:
        """Map each distinct re-apply interval to the scopes that have at least
        one action using it."""
        exposed = self._hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
        by_interval: dict[int, set[tuple[str, str | None]]] = {}
        for scope_key, cfg in self._scope_cfgs.items():
            for interval in scope_reapply_intervals(cfg, exposed):
                by_interval.setdefault(interval, set()).add(scope_key)
        return by_interval

    def _predicate_for(self, key: PredKey) -> Any:
        """The stored predicate for a PredKey, or None if it no longer exists."""
        scope_kind, scope_id, rule_index, condition_key = key
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        rules = cfg.get("rules", [])
        if not 0 <= rule_index < len(rules):
            return None
        return rules[rule_index].get("when", {}).get(condition_key)

    def _category_for(self, scope_kind: str, scope_id: str | None, rule_index: int) -> str | None:
        """The category id a rule belongs to (always a real id for a live rule);
        None only when the scope/rule no longer exists, in which case the caller
        must drop the unit (a None category must never reach the apply path)."""
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        rules = cfg.get("rules", [])
        if 0 <= rule_index < len(rules):
            return rules[rule_index].get("category")
        return None

    def _recompute(
        self, fired: set[PredKey], snapshots: dict[str, Any]
    ) -> set[tuple[str, str | None, str]]:
        """Re-evaluate the fired predicates against `snapshots`; return the
        (scope_kind, scope_id, category) units whose boolean changed. Updates
        `predicate_state`. A missing/None snapshot evaluates the predicate to
        False; a first-seen predicate counts as a flip."""
        conditions = self._conditions()
        dirty: set[tuple[str, str | None, str]] = set()
        for key in fired:
            predicate = self._predicate_for(key)
            if predicate is None:
                continue
            condition = conditions.get(key[3])
            if condition is None:
                continue
            snap = snapshots.get(key[3])
            new_value = bool(condition.matches(predicate, snap)) if snap is not None else False
            old_value = self._predicate_state.get(key)
            self._predicate_state[key] = new_value
            if old_value != new_value:
                category = self._category_for(key[0], key[1], key[2])
                if category is not None:
                    dirty.add((key[0], key[1], category))
        return dirty

    async def _refresh_snapshots(self, condition_keys: set[str]) -> None:
        """Re-snapshot the given conditions into the cache (None on failure)."""
        conditions = self._conditions()
        for key in condition_keys:
            condition = conditions.get(key)
            if condition is None:
                continue
            try:
                self._snapshots[key] = await condition.snapshot(self._hass)
            except Exception as exc:  # noqa: BLE001 — any condition error => None snapshot
                _LOGGER.warning("ambience: condition %r snapshot failed: %s", key, exc)
                self._snapshots[key] = None

    async def _refresh_all_snapshots(self) -> None:
        await self._refresh_snapshots(set(self._conditions()))

    async def _resolve_and_apply(
        self, scope_kind: str, scope_id: str | None, category_id: str, *, force: bool = False
    ) -> UnitTrace | None:
        """Resolve a dirty (scope, category) unit and apply if the winner changed
        (or `force`). Skips when the switch is off. Returns a UnitTrace
        describing the outcome when tracing is active, else None."""
        active = tracing_active(self._hass)
        switch_state = _switch_state(self._hass, scope_kind, scope_id)
        if switch_state == "off":
            if active:
                return UnitTrace(
                    scope_kind,
                    scope_id,
                    category_id,
                    switch_state,
                    Outcome.SKIPPED_SWITCH_OFF,
                    None,
                )
            return None
        plan = await async_resolve_with_snapshots(
            self._hass,
            scope_kind,
            scope_id,
            self._snapshots,
            category=category_id,
            describe=False,
            explain=active,
        )
        index = plan["matched_rule_index"]
        explanation = plan.get("explanation")
        if index is None:
            if active:
                return UnitTrace(
                    scope_kind, scope_id, category_id, switch_state, Outcome.NO_MATCH, explanation
                )
            return None
        if not force and index == get_last_applied(self._hass, scope_kind, scope_id, category_id):
            if active:
                return UnitTrace(
                    scope_kind,
                    scope_id,
                    category_id,
                    switch_state,
                    Outcome.NO_OP,
                    explanation,
                    winner_name=plan["rule_name"],
                )
            return None
        await async_execute_plan(self._hass, scope_kind, scope_id, plan, category_id)
        if active:
            return UnitTrace(
                scope_kind,
                scope_id,
                category_id,
                switch_state,
                Outcome.ACTED,
                explanation,
                winner_name=plan["rule_name"],
                actions=plan["actions"],
            )
        return None

    async def _apply_units(
        self, units: Iterable[tuple[str, str | None, str]], *, force: bool = False
    ) -> list[UnitTrace]:
        """Apply dirty (scope_kind, scope_id, category) units, concurrently within
        each containment tier, tiers sequential in order areas→floors→house.
        Returns the per-unit traces produced (empty when tracing is inactive)."""
        by_tier: dict[int, list[tuple[str, str | None, str]]] = defaultdict(list)
        for unit in units:
            by_tier[_TIER[unit[0]]].append(unit)
        traces: list[UnitTrace] = []
        for tier in sorted(by_tier):
            results = await asyncio.gather(
                *(self._resolve_and_apply(*u, force=force) for u in by_tier[tier]),
                return_exceptions=True,
            )
            for res in results:
                if isinstance(res, BaseException):
                    _LOGGER.warning("ambience: category apply failed: %s", res)
                elif res is not None:
                    traces.append(res)
        return traces

    async def async_evaluate(self, fired: set[PredKey], cause: TriggerCause | None = None) -> None:
        """Recompute the fired predicates (refreshing only their conditions) and
        resolve+apply every (scope, category) whose winning rule changed. Emits a
        TraceEvent for the batch when tracing produced any unit traces."""
        if not fired:
            return
        await self._refresh_snapshots({key[3] for key in fired})
        traces = await self._apply_units(self._recompute(fired, self._snapshots))
        if traces:
            emit_trace(
                self._hass, TraceEvent(cause or TriggerCause(kind=CauseKind.UNKNOWN), traces)
            )

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
        units = [
            (kind, sid, cid)
            for (kind, sid), cfg in self._scope_cfgs.items()
            for cid in category_ids(cfg)
        ]
        traces = await self._apply_units(units)
        if traces:
            emit_trace(self._hass, TraceEvent(TriggerCause(kind=CauseKind.STARTUP), traces))

    def _fire(self, fired: set[PredKey], cause: TriggerCause | None = None) -> None:
        """Schedule a re-evaluation of the given predicates (callback-safe)."""
        if fired:
            self._hass.async_create_task(self.async_evaluate(fired, cause))

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
                    self._make_keys_handler(
                        index.by_clock[clock],
                        TriggerCause(kind=CauseKind.CLOCK, detail=f"{clock[0]:02d}:{clock[1]:02d}"),
                    ),
                    hour=clock[0],
                    minute=clock[1],
                    second=0,
                )
            )
        if index.midnight:
            self._unsubs.append(
                async_track_time_change(
                    self._hass,
                    self._make_keys_handler(
                        index.midnight,
                        TriggerCause(kind=CauseKind.CLOCK, detail="00:00"),
                    ),
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
                    self._make_keys_handler(
                        index.has_time,
                        TriggerCause(kind=CauseKind.HAS_TIME),
                    ),
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
        old_state = event.data.get("old_state")
        new_state = event.data.get("new_state")
        cause = TriggerCause(
            kind=CauseKind.ENTITY,
            entity_id=event.data["entity_id"],
            old=old_state.state if old_state else None,
            new=new_state.state if new_state else None,
        )
        self._fire(set(preds), cause)
        self._schedule_for_rechecks(preds)

    def _make_keys_handler(
        self, preds: frozenset[PredKey], cause: TriggerCause | None = None
    ) -> Callable[[Any], None]:
        """A time/midnight callback that fires a fixed set of predicates."""
        keys = set(preds)

        @callback
        def _handler(_now: Any) -> None:
            self._fire(set(keys), cause)

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
        """Re-fire each category's current winning rule's actions due at `interval`.

        Uses last-applied per (scope, category) (kept current by the watch system)
        rather than re-resolving, and never mutates last-applied. Skips when the
        switch is off, a category has no active rule, or its stored index is out of
        range.
        """
        scope_kind, scope_id = scope
        switch_state = _switch_state(self._hass, scope_kind, scope_id)
        if switch_state == "off":
            return
        cfg = self._scope_cfgs.get(scope)
        if cfg is None:
            return
        rules = cfg.get("rules", [])
        exposed = self._hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
        active = tracing_active(self._hass)
        traces: list[UnitTrace] = []
        for category_id in category_ids(cfg):
            index = get_last_applied(self._hass, scope_kind, scope_id, category_id)
            if index is None or not 0 <= index < len(rules):
                continue
            due = [
                action
                for action in rules[index].get("actions", [])
                if effective_reapply_seconds(action, exposed) == interval
            ]
            if due:
                rule_name = rules[index].get("name")
                context = _log_apply(
                    self._hass, scope_kind, scope_id, category_id, rule_name, index, reapplied=True
                )
                await async_execute_actions(
                    self._hass, scope_kind, scope_id, due, rule_index=index, context=context
                )
                if active:
                    traces.append(
                        UnitTrace(
                            scope_kind,
                            scope_id,
                            category_id,
                            switch_state,
                            Outcome.REAPPLIED,
                            None,  # re-apply does not re-resolve, so no explanation
                            winner_name=rule_name,
                            actions=due,
                        )
                    )
        if traces:
            emit_trace(
                self._hass,
                TraceEvent(TriggerCause(kind=CauseKind.REAPPLY, detail=f"{interval}s"), traces),
            )

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
            self._fire({key}, TriggerCause(kind=CauseKind.HAS_TIME, detail="for"))

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
            self._hass.async_create_task(self._force_resync_scope(scope, event.data["entity_id"]))

    async def _force_resync_scope(
        self, scope: tuple[str, str | None], switch_entity_id: str | None = None
    ) -> None:
        """Force-apply every category of a scope (used on a switch off->on)."""
        scope_kind, scope_id = scope
        cfg = self._scope_cfgs.get(scope)
        traces = await self._apply_units(
            [(scope_kind, scope_id, cid) for cid in category_ids(cfg or {})], force=True
        )
        if traces:
            emit_trace(
                self._hass,
                TraceEvent(
                    TriggerCause(kind=CauseKind.SWITCH, entity_id=switch_entity_id or scope_id),
                    traces,
                ),
            )

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
                self._fire(
                    set(preds),
                    TriggerCause(kind=CauseKind.SUN, detail=f"{sun_event[0]}+{sun_event[1]}"),
                )
            self._schedule_sun(sun_event)  # arm the next occurrence

        old = self._sun_unsubs.pop(sun_event, None)
        if old is not None:
            old()
        self._sun_unsubs[sun_event] = async_track_point_in_time(self._hass, _handler, fire_at)
