"""HA event/timer subscription layer for the auto-trigger engine.

This mixin holds everything that wires :class:`AutoTriggerEngine` to Home
Assistant's event loop: state-change / clock / sun / re-apply-interval / switch
subscriptions, the per-`for` recheck timers, and the teardown that cancels them.
It is split out so trigger_engine.py keeps just the evaluation core (index
build + flip detection + resolve/apply). The methods reference engine state
(`self._index`, `self._unsubs`, …) and core methods (`self.async_evaluate`,
`self._apply_units`); both halves live on the same instance.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable, Iterable
from datetime import timedelta
from typing import Any

from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import Event, callback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_change,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .conditions._common import fmt_duration
from .conditions.time_of_day import ANCHOR_ATTR
from .const import DATA_EXPOSED_ACTIONS, DATA_SWITCHES, DOMAIN
from .service import (
    _scope_enabled,
    _switch_state,
    async_execute_actions,
    category_ids,
    effective_reapply_seconds,
    get_last_applied,
)
from .service_logbook import log_apply
from .trace import (
    CauseKind,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    emit_trace,
    tracing_active,
)
from .trigger_index import PredKey
from .triggers import DurationGate

# How often wall-clock-dependent (has_time) predicates are recomputed.
_HAS_TIME_INTERVAL = timedelta(seconds=60)


class TriggerSubscriptionsMixin:
    """Subscription / timer plumbing for :class:`AutoTriggerEngine`."""

    def _fire(self, fired: set[PredKey], cause: TriggerCause | None = None) -> None:
        """Schedule a re-evaluation of the given predicates (callback-safe)."""
        if not self._running:
            # A handler already in the loop's ready queue can run after
            # teardown; after unload hass.data[DOMAIN] is gone, so evaluating
            # would only produce KeyError task noise.
            return
        if fired:
            self._hass.async_create_task(self.async_evaluate(fired, cause))

    def _teardown(self) -> None:
        """Cancel all subscriptions and pending timers."""
        self._running = False
        while self._unsubs:
            self._unsubs.pop()()
        for cancel in self._sun_unsubs.values():
            cancel()
        self._sun_unsubs.clear()
        for handles in self._for_handles.values():
            for cancel in handles.values():
                cancel()
        self._for_handles.clear()
        self._switch_scopes.clear()

    def async_subscribe(self) -> None:
        """(Re)create one subscription per distinct dependency in the index."""
        self._teardown()
        self._running = True
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
        # Re-arming the `for:` rechecks is the evaluation's job now: async_evaluate
        # refreshes snapshots, updates gate tenure, then _recompute arms the
        # timers off that tenure. Arming here (pre-evaluation) would use stale
        # tenure and double-arm.
        self._fire(set(preds), cause)

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
        """Re-fire each category's current winning scene's actions due at `interval`.

        Uses last-applied per (scope, category) (kept current by the watch system)
        rather than re-resolving, and never mutates last-applied. Skips when the
        scope is disabled, the switch is off, a category has no active scene, or its
        stored index is out of range.
        """
        scope_kind, scope_id = scope
        if not _scope_enabled(self._hass, scope_kind, scope_id):
            return
        switch_state = _switch_state(self._hass, scope_kind, scope_id)
        if switch_state == "off":
            return
        cfg = self._scope_cfgs.get(scope)
        if cfg is None:
            return
        scenes = cfg.get("scenes", [])
        exposed = self._hass.data[DOMAIN].get(DATA_EXPOSED_ACTIONS)
        active = tracing_active(self._hass)
        traces: list[UnitTrace] = []
        for category_id in category_ids(cfg):
            index = get_last_applied(self._hass, scope_kind, scope_id, category_id)
            if index is None or not 0 <= index < len(scenes):
                continue
            due = [
                action
                for action in scenes[index].get("actions", [])
                if effective_reapply_seconds(action, exposed) == interval
            ]
            if due:
                scene_name = scenes[index].get("name")
                context = log_apply(
                    self._hass, scope_kind, scope_id, category_id, scene_name, index, reapplied=True
                )
                await async_execute_actions(
                    self._hass, scope_kind, scope_id, due, scene_index=index, context=context
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
                            winner_name=scene_name,
                            actions=due,
                        )
                    )
        if traces:
            emit_trace(
                self._hass,
                TraceEvent(TriggerCause(kind=CauseKind.REAPPLY, detail=f"{interval}s"), traces),
            )

    def _schedule_for_rechecks(self, preds: Iterable[PredKey]) -> None:
        """(Re)arm one timer per *pending* `for:` gate of each predicate.

        A gate whose instant test is currently true (so the engine has recorded
        its tenure) but hasn't yet held for `seconds` will flip the predicate at
        `since + seconds` with no further event — so wake it exactly then. Each
        gate gets its own timer, keyed by `(gate_key, seconds)` so a fired timer
        drops only its own handle (siblings mark distinct future flips).

        Gates that are NOT in tenure (instant test currently false) need no
        timer: they re-arm event-driven via the flip that records their tenure.
        A gate already matured (delay <= 0) needs none either: the evaluation
        that armed this pass already saw it true. Cancels and replaces any prior
        handles per predicate, so calling this is idempotent."""
        now = dt_util.utcnow()
        for key in preds:
            gates = self._index.durations.get(key)
            if not gates:
                continue
            for cancel in self._for_handles.pop(key, {}).values():
                cancel()
            tenure = self._tenure.get(key[3], {})
            handles: dict[tuple[str, float], Callable[[], None]] = {}
            for gate in gates:
                since = tenure.get(gate.key)
                if since is None:
                    continue  # instant test not currently true → no pending flip
                delay = gate.seconds - (now - since).total_seconds()
                if delay <= 0:
                    continue  # already matured; this evaluation covered it
                handles[(gate.key, gate.seconds)] = async_call_later(
                    self._hass, delay, self._make_for_recheck(key, gate)
                )
            if handles:
                self._for_handles[key] = handles

    def rearm_scope_rechecks(self, scope_kind: str, scope_id: str | None) -> None:
        """(Re)arm just this scope's pending `for:` rechecks. Used by paths that
        resume a scope without the full teardown/rebuild of a reload — a switch
        off->on resync, and scope re-enable. A duration timer is a one-shot: if
        it matured while the scope was inactive it fired as a no-op and was
        consumed, so without this a still-pending gate whose timer elapsed during
        the inactive window would never re-arm. `_schedule_for_rechecks` reads the
        live tenure and cancels/replaces any still-live handles, so calling this
        is idempotent."""
        self._schedule_for_rechecks(
            key for key in self._index.durations if (key[0], key[1]) == (scope_kind, scope_id)
        )

    def _make_for_recheck(self, key: PredKey, gate: DurationGate) -> Callable[[Any], None]:
        @callback
        def _recheck(_now: Any) -> None:
            if not self._running:
                return  # fired after teardown — don't evaluate
            # Drop only this timer's handle; sibling gate rechecks for the same
            # predicate stay tracked and cancellable.
            handles = self._for_handles.get(key)
            if handles is not None:
                handles.pop((gate.key, gate.seconds), None)
                if not handles:
                    self._for_handles.pop(key, None)
            # Name what is being waited on. A single-entity gate names the entity
            # and the state it has held ("binary_sensor.motion off for 5m"); a
            # multi-entity gate has no single state to read, so it names the
            # gate's label ("nobody home for 30m").
            if gate.entity_id is not None:
                state = self._hass.states.get(gate.entity_id)
                held = state.state if state is not None else STATE_UNKNOWN
                cause = TriggerCause(
                    kind=CauseKind.DURATION,
                    entity_id=gate.entity_id,
                    new=held,
                    detail=fmt_duration(gate.seconds),
                )
            else:
                cause = TriggerCause(
                    kind=CauseKind.DURATION,
                    new=gate.label,
                    detail=fmt_duration(gate.seconds),
                )
            # Re-arming happens inside the evaluation this fires (it refreshes
            # snapshots, updates tenure, then _recompute re-arms) — not here.
            self._fire({key}, cause)

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
        self.rearm_scope_rechecks(scope_kind, scope_id)
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
        """Next fire time for a sun anchor (+offset), from sun.sun, or None.

        sun.sun's `next_*` attribute only rolls over when the un-offset event
        fires, so with a negative offset the computed time is already in the
        past once the handler has fired — arming it would fire again on the
        next loop iteration and spin until the anchor advances. Fall forward
        to just after the un-offset anchor instead; once that passes, `next_*`
        has rolled over and the real next occurrence is computable. If even
        the anchor is stale (attribute-update race), poll again shortly.
        """
        state = self._hass.states.get("sun.sun")
        attr = ANCHOR_ATTR.get(anchor)
        raw = state.attributes.get(attr) if (state and attr) else None
        parsed = dt_util.parse_datetime(raw) if raw else None
        if parsed is None:
            return None
        fire_at = parsed + timedelta(minutes=offset_min)
        now = dt_util.utcnow()
        if fire_at > now:
            return fire_at
        retry_at = parsed + timedelta(seconds=1)
        return retry_at if retry_at > now else now + timedelta(seconds=60)

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
            if not self._running:
                return  # fired after teardown — don't re-arm into a dead engine
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
