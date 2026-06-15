"""The Ambience auto-trigger engine.

Watches each scope's scene dependencies and re-applies the winning scene when it
changes. This module holds the evaluation core: building the trigger index from
the store, and detecting which scopes had a predicate *flip* on a given fire.
The subscription / snapshot-cache / resolve-apply / lifecycle layer is added on
top of these methods.
"""

from __future__ import annotations

import logging
from collections import defaultdict
from collections.abc import Callable, Iterable
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.debounce import Debouncer
from homeassistant.util import dt as dt_util

from .conditions._common import UNAVAILABLE
from .const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DOMAIN,
)
from .scope_triggers import iter_predicate_specs, referenced_entities
from .service import (
    _scope_enabled,
    _switch_state,
    apply_lock,
    async_execute_plan,
    async_resolve_with_snapshots,
    attach_tenure,
    category_ids,
    forget_last_applied,
    gather_unit_traces,
    get_last_applied,
    snapshot_conditions,
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
from .trigger_subscriptions import TriggerSubscriptionsMixin
from .triggers import EMPTY, TriggerSpec

_LOGGER = logging.getLogger(__name__)

# Coalesce a burst of config-changed signals (e.g. a multi-field panel save)
# into a single rebuild + resync.
_CONFIG_DEBOUNCE_SECONDS = 0.3

# Containment tiers, applied in order: areas → floors → house. House applies
# last so it wins on entities shared across scopes (preserves prior behavior).
_TIER = {"area": 0, "floor": 1, "house": 2}


class AutoTriggerEngine(TriggerSubscriptionsMixin):
    """Builds the trigger index and detects predicate flips per scope.

    The HA event/timer subscription layer lives in
    :class:`~custom_components.ambience.trigger_subscriptions.TriggerSubscriptionsMixin`.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        # Per-predicate last-known boolean; the flip detector compares against it.
        self._predicate_state: dict[PredKey, bool] = {}
        # Per-condition gate tenure: condition_key -> {gate fingerprint -> the
        # time that gate's instant test last became true}. This is the history a
        # `for:` clause measures against (predicate tenure, not exact-state
        # tenure). The inner dicts are shared by reference into enriched
        # snapshots, so the engine MUTATES them in place — never replaces — to
        # keep already-attached snapshots seeing live updates.
        self._tenure: dict[str, dict[str, datetime]] = {}
        # Scope configs captured at the last rebuild, for predicate lookup.
        self._scope_cfgs: dict[tuple[str, str | None], dict[str, Any]] = {}
        # Per-condition union of referenced entity_ids, captured at the last
        # rebuild — lets sensor-backed conditions snapshot only what scenes use.
        self._referenced: dict[str, frozenset[str]] = {}
        self._index: TriggerIndex = build_index([])
        self._snapshots: dict[str, Any] = {}
        self._unsubs: list[Callable[[], None]] = []
        # Sun-event point-in-time handles, one slot per (anchor, offset). Kept
        # separate from _unsubs because they re-arm on each fire — the slot is
        # replaced rather than appended, so dead handles never accumulate.
        self._sun_unsubs: dict[tuple[str, int], Callable[[], None]] = {}
        # Per predicate, one recheck timer per `for:` gate, keyed by
        # `(gate_key, seconds)` so a fired timer drops only its own handle.
        self._for_handles: dict[PredKey, dict[tuple[str, float], Callable[[], None]]] = {}
        self._switch_scopes: dict[str, tuple[str, str | None]] = {}
        # Per-unit idle-reapply one-shot timers, keyed by (scope_kind, scope_id,
        # category_id). The cancel callable from async_call_later is stored
        # directly (same convention as _for_handles / _sun_unsubs).
        self._reapply_timers: dict[tuple[str, str | None, str], Callable[[], None]] = {}
        # False after teardown: handlers already queued in the event loop when
        # the engine is torn down must not evaluate or re-arm timers (after
        # unload, hass.data[DOMAIN] is gone).
        self._running = True
        # What a config-changed signal touched, accumulated across the debounce
        # window so the coalesced refresh re-applies only what changed. A global
        # change (None) sets _pending_all, which wins over any per-scope entries.
        self._pending_affected: set[tuple[str, str | None]] = set()
        self._pending_all = False
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

    @property
    def tenure(self) -> dict[str, dict[str, datetime]]:
        """The per-condition gate tenure map, shared by reference into enriched
        snapshots (manual apply / resolve-only read it via ``attach_tenure``)."""
        return self._tenure

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
        self._referenced = referenced_entities(self._conditions(), self._scope_cfgs.values())
        self._index = build_index(self._build_entries())
        # Drop flip-state for predicates that no longer exist (scenes removed /
        # reordered), so it can't grow unbounded across config edits.
        live = self._index.all_predicates()
        self._predicate_state = {
            key: value for key, value in self._predicate_state.items() if key in live
        }
        # Prune dead gate fingerprints from tenure, mutating the inner dicts IN
        # PLACE so any snapshot already holding a reference still sees the same
        # object (a fresh dict would orphan it). A condition_key with no live
        # gates keeps an empty dict — harmless and reused on the next edit.
        live_gates: dict[str, set[str]] = {}
        for key, gates in self._index.durations.items():
            live_gates.setdefault(key[3], set()).update(g.key for g in gates)
        for cond_key, entries in self._tenure.items():
            keep = live_gates.get(cond_key, set())
            for gate_key in [k for k in entries if k not in keep]:
                del entries[gate_key]

    def _build_entries(self) -> list[tuple[PredKey, TriggerSpec]]:
        """Return (PredKey, TriggerSpec) for every non-wildcard predicate with deps.

        Every watch a scope's scenes imply is registered — auto-triggers are
        always on.
        """
        conditions = self._conditions()
        entries: list[tuple[PredKey, TriggerSpec]] = []
        for (scope_kind, scope_id), cfg in self._scope_cfgs.items():
            for scene_index, condition_key, spec in iter_predicate_specs(conditions, cfg):
                if spec == EMPTY:
                    continue
                entries.append(((scope_kind, scope_id, scene_index, condition_key), spec))
        return entries

    def _predicate_for(self, key: PredKey) -> Any:
        """The stored predicate for a PredKey, or None if it no longer exists."""
        scope_kind, scope_id, scene_index, condition_key = key
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        scenes = cfg.get("scenes", [])
        if not 0 <= scene_index < len(scenes):
            return None
        return scenes[scene_index].get("when", {}).get(condition_key)

    def _category_for(self, scope_kind: str, scope_id: str | None, scene_index: int) -> str | None:
        """The category id a scene belongs to (always a real id for a live scene);
        None only when the scope/scene no longer exists, in which case the caller
        must drop the unit (a None category must never reach the apply path)."""
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        scenes = cfg.get("scenes", [])
        if 0 <= scene_index < len(scenes):
            return scenes[scene_index].get("category")
        return None

    def _winner_has_unavailable(
        self, scope_kind: str, scope_id: str | None, scene_index: int | None
    ) -> bool:
        """Whether the winning scene carries a non-wildcard `unavailable` predicate.

        Such a scene is an availability guard — the one scene allowed to act on an
        entity drop-out (a winner that won *because* an entity is unavailable). A
        winning `unavailable` predicate is necessarily non-None and matched true,
        so its presence in the winner's `when` is sufficient. `scene_index` is the
        full-scene index (`matched_scene_index`), aligned with `self._scope_cfgs`.
        """
        if scene_index is None:
            return False
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return False
        scenes = cfg.get("scenes", [])
        if not 0 <= scene_index < len(scenes):
            return False
        return scenes[scene_index].get("when", {}).get("unavailable") is not None

    def _recompute(
        self, fired: set[PredKey], snapshots: dict[str, Any], *, seed: bool = False
    ) -> set[tuple[str, str | None, str]]:
        """Re-evaluate the fired predicates against `snapshots`; return the
        (scope_kind, scope_id, category) units whose boolean changed. Updates
        `predicate_state` and per-gate `tenure`, and re-arms `for:` rechecks for
        every fired predicate that carries a gate. A missing/None snapshot
        evaluates the predicate to False; a first-seen predicate counts as a
        flip. `seed=True` (startup/reload) seeds a newly-true gate's tenure from
        the condition's anchor (a provable lower bound like last_changed) rather
        than now, so a rule whose entity was already in-state fires at
        anchor+for, not restart+for."""
        conditions = self._conditions()
        dirty: set[tuple[str, str | None, str]] = set()
        gated: list[PredKey] = []
        # One clock read for the whole batch: every live-flip tenure stamp in
        # this recompute shares it, avoiding skew between predicates evaluated
        # together.
        now = dt_util.utcnow()
        for key in fired:
            predicate = self._predicate_for(key)
            if predicate is None:
                continue
            condition = conditions.get(key[3])
            if condition is None:
                continue
            snap = snapshots.get(key[3])
            # Track tenure BEFORE matching so a tenure-aware match (which reads
            # snapshot.tenure) sees this evaluation's freshly-recorded flips.
            if key in self._index.durations:
                gated.append(key)
                if snap is not None:
                    self._update_tenure(key, condition, predicate, snap, now=now, seed=seed)
            if snap is None:
                new_value = False
            else:
                try:
                    new_value = bool(condition.matches(predicate, snap))
                except Exception as exc:  # noqa: BLE001 — mirror the snapshot-failure policy
                    # A raise here would kill the whole fire-and-forget evaluate
                    # task, silently losing every other fired predicate.
                    _LOGGER.warning("ambience: condition %r match failed: %s", key[3], exc)
                    new_value = False
            old_value = self._predicate_state.get(key)
            self._predicate_state[key] = new_value
            if old_value != new_value:
                category = self._category_for(key[0], key[1], key[2])
                if category is not None:
                    dirty.add((key[0], key[1], category))
        # Re-arm rechecks off the freshly-updated tenure so a gate that is true
        # but not yet matured will still fire at since+seconds with no further
        # event. (Was previously driven by per-entity `last_*` heuristics.)
        if gated:
            self._schedule_for_rechecks(gated)
        return dirty

    def _update_tenure(
        self, key: PredKey, condition: Any, predicate: Any, snap: Any, *, now: datetime, seed: bool
    ) -> None:
        """Record instant-truth flips for `key`'s duration gates into tenure.

        A gate seen true for the first time gets `since = now` (a live flip) or
        its condition-provided anchor (seed mode). A gate seen false is dropped,
        so its clock restarts the next time it becomes true. A condition without
        `gate_states`, or a `gate_states` that raises, is skipped — stale tenure
        self-heals on the next successful evaluation rather than being wiped."""
        gate_states = getattr(condition, "gate_states", None)
        if gate_states is None:
            return
        tenure = self._tenure.setdefault(key[3], {})
        try:
            readings = gate_states(predicate, snap)
        except Exception as exc:  # noqa: BLE001 — mirror the match-failure policy
            _LOGGER.warning("ambience: condition %r gate_states failed: %s", key[3], exc)
            return
        for gate_key, (instant, anchor) in readings.items():
            if not instant:
                tenure.pop(gate_key, None)
            elif gate_key not in tenure:
                tenure[gate_key] = anchor if seed else now

    async def _refresh_snapshots(self, condition_keys: set[str]) -> None:
        """Re-snapshot the given conditions into the cache, concurrently
        (None on failure) — one slow condition doesn't delay the rest. Each
        gate-capable snapshot is enriched with a live view of this engine's gate
        tenure so `for:` clauses gate off predicate tenure, not the exact-state
        clock."""
        conditions = self._conditions()
        fresh = await snapshot_conditions(
            self._hass, conditions, self._referenced, keys=condition_keys
        )
        self._snapshots.update(attach_tenure(conditions, self._tenure, fresh))

    async def _refresh_all_snapshots(self) -> None:
        await self._refresh_snapshots(set(self._conditions()))

    async def _resolve_and_apply(
        self,
        scope_kind: str,
        scope_id: str | None,
        category_id: str,
        *,
        force: bool = False,
        cause: TriggerCause | None = None,
    ) -> UnitTrace | None:
        """Resolve a dirty (scope, category) unit and apply if the winner changed
        (or `force`). Skips when the scope is disabled or the switch is off.
        Returns a UnitTrace describing the outcome when tracing is active, else
        None."""
        active = tracing_active(self._hass)
        if not _scope_enabled(self._hass, scope_kind, scope_id):
            if active:
                return UnitTrace(
                    scope_kind,
                    scope_id,
                    category_id,
                    "on",
                    Outcome.SKIPPED_SCOPE_DISABLED,
                    None,
                )
            return None
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
        # Serialize resolve+apply per (scope, category): a burst of triggers on
        # one unit arrives as separate tasks. Without this, while one task is
        # suspended running its actions, another resolves and applies the same
        # unit — re-firing the same scene. Holding the lock across the whole
        # resolve+apply makes a waiting task proceed only once the first has
        # recorded last_applied and finished, so it either debounces (same winner)
        # or applies in order (new winner) instead of interleaving mid-apply.
        async with apply_lock(self._hass, scope_kind, scope_id, category_id):
            plan = await async_resolve_with_snapshots(
                self._hass,
                scope_kind,
                scope_id,
                self._snapshots,
                category=category_id,
                describe=False,
                explain=active,
            )
            index = plan["matched_scene_index"]
            explanation = plan.get("explanation")
            # Drop-out (the triggering entity went unavailable/unknown, or was
            # removed → cause.new is None): only an `unavailable`-guard winner may
            # act on it. A non-guard fall-through winner (or a no-match) is
            # suppressed so a sensor blip can't drive an unrelated scene — devices
            # and last_applied are left untouched. The guard itself runs normally
            # below (its actions, or its NO_OP block).
            if (
                cause is not None
                and cause.kind == CauseKind.ENTITY
                and (cause.new in UNAVAILABLE or cause.new is None)
                and not self._winner_has_unavailable(scope_kind, scope_id, index)
            ):
                if active:
                    return UnitTrace(
                        scope_kind,
                        scope_id,
                        category_id,
                        switch_state,
                        Outcome.SKIPPED_UNAVAILABLE,
                        explanation,
                    )
                return None
            if index is None:
                # A no-match is a transition away from the previous winner: drop
                # the last-applied record so a later win of the same scene re-applies.
                forget_last_applied(self._hass, scope_kind, scope_id, category_id)
                if active:
                    return UnitTrace(
                        scope_kind,
                        scope_id,
                        category_id,
                        switch_state,
                        Outcome.NO_MATCH,
                        explanation,
                    )
                return None
            if not plan["actions"]:
                # A pure blocker (winner with no actions): nothing to run, and it
                # stays transparent to last-applied so it neither records itself nor
                # clears a prior real winner.
                if active:
                    return UnitTrace(
                        scope_kind,
                        scope_id,
                        category_id,
                        switch_state,
                        Outcome.NO_OP,
                        explanation,
                        winner_name=plan["scene_name"],
                    )
                return None
            if not force and index == get_last_applied(
                self._hass, scope_kind, scope_id, category_id
            ):
                # Same winner as last applied, with identical actions → suppress the
                # redundant re-fire.
                if active:
                    return UnitTrace(
                        scope_kind,
                        scope_id,
                        category_id,
                        switch_state,
                        Outcome.DEBOUNCED,
                        explanation,
                        winner_name=plan["scene_name"],
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
                winner_name=plan["scene_name"],
                actions=self._hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].annotate_unexposed(
                    plan["actions"]
                ),
            )
        return None

    async def _apply_units(
        self,
        units: Iterable[tuple[str, str | None, str]],
        *,
        force: bool = False,
        cause: TriggerCause | None = None,
    ) -> list[UnitTrace]:
        """Apply dirty (scope_kind, scope_id, category) units, concurrently within
        each containment tier, tiers sequential in order areas→floors→house.
        Returns the per-unit traces produced (empty when tracing is inactive)."""
        by_tier: dict[int, list[tuple[str, str | None, str]]] = defaultdict(list)
        for unit in units:
            by_tier[_TIER[unit[0]]].append(unit)
        traces: list[UnitTrace] = []
        for tier in sorted(by_tier):
            traces.extend(
                await gather_unit_traces(
                    self._resolve_and_apply(*u, force=force, cause=cause) for u in by_tier[tier]
                )
            )
        return traces

    async def async_evaluate(self, fired: set[PredKey], cause: TriggerCause | None = None) -> None:
        """Recompute the fired predicates (refreshing only their conditions) and
        resolve+apply every (scope, category) whose winning scene changed. Emits a
        TraceEvent for the batch when tracing produced any unit traces."""
        if not fired:
            return
        resolved_cause = cause or TriggerCause(kind=CauseKind.UNKNOWN)
        await self._refresh_snapshots({key[3] for key in fired})
        traces = await self._apply_units(
            self._recompute(fired, self._snapshots), cause=resolved_cause
        )
        if traces:
            emit_trace(self._hass, TraceEvent(resolved_cause, traces))

    async def _async_refresh(self) -> None:
        """Debounced config-reload: rebuild + resubscribe, then re-apply only what
        changed (force, so edited scenes re-fire), labelling traces 'Reloaded'.
        A global change re-applies every scope without force."""
        pending_all = self._pending_all
        affected = self._pending_affected
        self._pending_all = False
        self._pending_affected = set()
        self.async_rebuild()
        self.async_subscribe()
        cause = TriggerCause(kind=CauseKind.RELOADED)
        if pending_all:
            await self._sync(self._all_units(), cause, force=False)
        else:
            await self._sync(self._units_for(affected), cause, force=True)

    async def async_start(self) -> None:
        """Build the index, subscribe, and run the startup sync pass (immediate)."""
        self.async_rebuild()
        self.async_subscribe()
        await self.async_initial_sync()

    @callback
    def note_config_changed(self, affected: tuple[str, str | None] | None) -> None:
        """Record what a config-changed signal touched, to narrow the next
        debounced refresh. `affected` is a (scope_kind, scope_id) for a
        scope-local change, or None for a global change (reapply everything)."""
        if affected is None:
            self._pending_all = True
        else:
            self._pending_affected.add(affected)

    async def async_request_refresh(self) -> None:
        """Request a full refresh, debounced to coalesce rapid config changes."""
        await self._refresh_debouncer.async_call()

    def async_shutdown(self) -> None:
        """Tear down all subscriptions, timers, and the refresh debouncer."""
        self._refresh_debouncer.async_shutdown()
        self._teardown()

    def _all_units(self) -> list[tuple[str, str | None, str]]:
        """Every (scope_kind, scope_id, category) unit across all scopes, in scope
        insertion order (deterministic)."""
        return [
            (kind, sid, cid)
            for (kind, sid), cfg in self._scope_cfgs.items()
            for cid in category_ids(cfg)
        ]

    def _units_for(self, scopes: set[tuple[str, str | None]]) -> list[tuple[str, str | None, str]]:
        """The units for the given scopes, skipping any that no longer exist.
        Scopes are ordered deterministically (a set has no stable iteration order),
        so trace and apply ordering doesn't vary run to run."""
        ordered = sorted(scopes, key=lambda key: (key[0], key[1] or ""))
        return [
            (kind, sid, cid)
            for (kind, sid) in ordered
            if (cfg := self._scope_cfgs.get((kind, sid))) is not None
            for cid in category_ids(cfg)
        ]

    async def _sync(
        self,
        units: list[tuple[str, str | None, str]],
        cause: TriggerCause,
        *,
        force: bool,
    ) -> None:
        """Snapshot all conditions, seed flip-state across every predicate, then
        apply the given units — plus any unit the seeding pass itself found
        dirty — and emit one TraceEvent for the batch.

        The seeding recompute runs over ALL predicates and records their new
        booleans; a flip that landed during the debounce window for a scope
        outside `units` is consumed by it (the later evaluate task sees
        old == new), so those dirty units must be applied here or they are
        silently lost. They don't inherit `force` — only the requested units
        were explicitly edited/reloaded."""
        await self._refresh_all_snapshots()
        # Seed mode: a gate already instant-true at startup/reload has its tenure
        # seeded from the condition's anchor (e.g. last_changed), and _recompute
        # re-arms every gate's recheck off that tenure. So a duration rule whose
        # entity was already in-state before a startup/reconfigure (e.g. a switch
        # on for 2h) still fires at anchor+for rather than restart+for — and
        # isn't silently dropped until some unrelated event wakes its category.
        seeded_dirty = self._recompute(
            set(self._index.all_predicates()), self._snapshots, seed=True
        )
        traces = await self._apply_units(units, force=force, cause=cause)
        extra = sorted(seeded_dirty - set(units), key=lambda u: (u[0], u[1] or "", u[2]))
        if extra:
            traces.extend(await self._apply_units(extra, force=False, cause=cause))
        if traces:
            emit_trace(self._hass, TraceEvent(cause, traces))

    async def async_initial_sync(self) -> None:
        """Startup 'sync to reality': snapshot everything, seed flip state, and
        apply each enabled scope's current winner, labelled 'Startup'."""
        await self._sync(self._all_units(), TriggerCause(kind=CauseKind.STARTUP), force=False)
