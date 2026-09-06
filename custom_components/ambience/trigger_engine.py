"""The Ambience auto-trigger engine.

Watches each scope's scene dependencies and re-applies the winning scene when it
changes. This module holds the evaluation core: building the trigger index from
the store, and detecting which scopes had a predicate *flip* on a given fire.
The subscription / snapshot-cache / resolve-apply / lifecycle layer is added on
top of these methods.
"""

from __future__ import annotations

import itertools
import logging
from collections import defaultdict
from collections.abc import Callable, Iterable
from datetime import datetime
from functools import partial
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.debounce import Debouncer
from homeassistant.util import dt as dt_util

from .conditions._opaque import OpaquePrecomputedCondition
from .const import (
    DATA_CONDITIONS,
    DATA_STORE,
    DOMAIN,
)
from .engine import scene_enabled
from .scope_triggers import iter_predicate_specs, referenced_entities
from .service import (
    async_resolve_and_apply_unit,
    attach_tenure,
    category_ids,
    gather_unit_traces,
    snapshot_conditions,
)
from .trace import (
    CauseKind,
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
        # Per-predicate entity_ids from the specs derived at the last rebuild, so
        # the always-on trace path links entities without re-running trigger_deps
        # per predicate per fire (a wildcard people predicate would re-scan every
        # person entity). Sorted for deterministic trace output.
        self._pred_entities: dict[PredKey, tuple[str, ...]] = {}
        # Every opaque predicate, from the last rebuild: `opaque` means the
        # predicate's dependencies cannot be fully known, so no fire proves it
        # unchanged and a narrowed snapshot has to carry all of them or they go
        # stale until the next full refresh. Only the index decides this, so it
        # is per-rebuild data, not per-fire.
        self._opaque_ride_along: set[PredKey] = set()
        self._snapshots: dict[str, Any] = {}
        # Snapshot refreshes overlap (one per fire, plus resyncs), and a slow
        # condition can make an earlier refresh land after a later one. Each
        # refresh takes a sequence number when it starts and records it per
        # condition, so a stale read is dropped instead of rolling the cache
        # back to the view it began with.
        self._snapshot_seq = itertools.count()
        self._snapshot_written: dict[str, int] = {}
        self._unsubs: list[Callable[[], None]] = []
        # Sun-event point-in-time handles, one slot per (anchor, offset). Kept
        # separate from _unsubs because they re-arm on each fire — the slot is
        # replaced rather than appended, so dead handles never accumulate.
        self._sun_unsubs: dict[tuple[str, int], Callable[[], None]] = {}
        # Wall-clock point-in-time handles, one slot per (hour, minute), armed
        # by Ambience rather than HA's clock tracker so a time inside the
        # spring-forward gap still fires (see `_schedule_clock`).
        self._clock_unsubs: dict[tuple[int, int], Callable[[], None]] = {}
        # Per predicate, one recheck timer per `for:` gate, keyed by
        # `(gate_key, seconds)` so a fired timer drops only its own handle.
        self._for_handles: dict[PredKey, dict[tuple[str, float], Callable[[], None]]] = {}
        # Consecutive retries armed for a matured gate whose condition could not
        # be snapshotted; reset the moment the condition reads cleanly again.
        self._for_retries: dict[PredKey, int] = {}
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
        conditions = self._conditions()
        self._referenced = referenced_entities(conditions, self._scope_cfgs.values())
        entries = self._build_entries()
        self._pred_entities = {key: tuple(sorted(spec.entities)) for key, spec in entries}
        self._index = build_index(entries)
        self._opaque_ride_along = set(self._index.opaque)
        # Drop flip-state for predicates that no longer exist (scenes removed /
        # reordered), so it can't grow unbounded across config edits.
        live = self._index.all_predicates()
        self._predicate_state = {
            key: value for key, value in self._predicate_state.items() if key in live
        }
        # Likewise for the snapshot ordering marks of unregistered conditions.
        self._snapshot_written = {
            key: seq for key, seq in self._snapshot_written.items() if key in conditions
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

    def _entity_ids_for(
        self, scope_kind: str, scope_id: str | None, scene_index: int, condition_key: str
    ) -> tuple[str, ...]:
        """The entity_ids one predicate references, from the specs captured at the
        last rebuild. Empty for a predicate with no watchable deps (wildcard,
        unknown/opaque condition, or a spec with no entities)."""
        return self._pred_entities.get((scope_kind, scope_id, scene_index, condition_key), ())

    def _scene_at(
        self, scope_kind: str, scope_id: str | None, scene_index: int | None
    ) -> dict[str, Any] | None:
        """The stored scene dict at a full-scene index (`matched_scene_index`,
        aligned with `self._scope_cfgs`), or None when the scope or the scene no
        longer exists — config drift between a rebuild and a resolve, which every
        caller treats as "drop this unit"."""
        if scene_index is None:
            return None
        cfg = self._scope_cfgs.get((scope_kind, scope_id))
        if cfg is None:
            return None
        scenes = cfg.get("scenes") or []
        if not 0 <= scene_index < len(scenes):
            return None
        return scenes[scene_index]

    def _predicate_for(self, key: PredKey) -> Any:
        """The stored predicate for a PredKey, or None if it no longer exists."""
        scene = self._scene_at(key[0], key[1], key[2])
        return None if scene is None else scene.get("when", {}).get(key[3])

    def _category_for(self, scope_kind: str, scope_id: str | None, scene_index: int) -> str | None:
        """The category id a scene belongs to (always a real id for a live scene);
        None only when the scope/scene no longer exists, in which case the caller
        must drop the unit (a None category must never reach the apply path)."""
        scene = self._scene_at(scope_kind, scope_id, scene_index)
        return None if scene is None else scene.get("category")

    def _winner_has_unavailable(
        self, scope_kind: str, scope_id: str | None, scene_index: int | None
    ) -> bool:
        """Whether the winning scene carries a non-wildcard `unavailable` predicate.

        Such a scene is an availability guard — the one scene allowed to act on an
        entity drop-out (a winner that won *because* an entity is unavailable). A
        winning `unavailable` predicate is necessarily non-None and matched true,
        so its presence in the winner's `when` is sufficient.
        """
        scene = self._scene_at(scope_kind, scope_id, scene_index)
        return scene is not None and scene.get("when", {}).get("unavailable") is not None

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
        # event.
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

    def _fired_result_keys(self, fired: set[PredKey]) -> dict[str, frozenset[str]]:
        """Per-condition snapshot hint: the result keys of the fired predicates
        (plus the condition's opaque ones, whose deps are never fully known),
        for the conditions that accept a hint. A condition is left out — falling
        back to a full recompute — as soon as one of its predicates has no
        derivable result key (a scene removed since the fire, or a malformed
        predicate), since the missing key could otherwise go stale unnoticed."""
        conditions = self._conditions()
        hints: dict[str, set[str]] = {}
        unhinted: set[str] = set()

        def _add(key: PredKey, condition: Any) -> None:
            result_key = condition.result_key(self._predicate_for(key))
            if result_key:
                hints.setdefault(key[3], set()).add(result_key)
            else:
                unhinted.add(key[3])

        for key in fired:
            condition = conditions.get(key[3])
            if isinstance(condition, OpaquePrecomputedCondition):
                _add(key, condition)
        if not hints:
            # No condition can be hinted, and the opaque ride-along only ever
            # extends a condition already in `hints`.
            return {}
        for key in self._opaque_ride_along:
            if key[3] in hints:
                _add(key, conditions[key[3]])
        return {k: frozenset(v) for k, v in hints.items() if k not in unhinted}

    async def _refresh_snapshots(
        self, condition_keys: set[str], result_keys: dict[str, frozenset[str]] | None = None
    ) -> None:
        """Re-snapshot the given conditions into the cache, concurrently
        (None on failure) — one slow condition doesn't delay the rest, and a
        refresh that started earlier never overwrites a condition a later one
        already published. Each gate-capable snapshot is enriched with a live
        view of this engine's gate tenure so `for:` clauses gate off predicate
        tenure, not the exact-state clock."""
        seq = next(self._snapshot_seq)  # taken at start: ordering is by when the read began
        conditions = self._conditions()
        fresh = await snapshot_conditions(
            self._hass, conditions, self._referenced, keys=condition_keys, result_keys=result_keys
        )
        for key, value in attach_tenure(conditions, self._tenure, fresh).items():
            # A refresh that started later has already published a newer view
            # of this condition; landing ours now would roll the cache back.
            if self._snapshot_written.get(key, -1) > seq:
                continue
            self._snapshot_written[key] = seq
            self._snapshots[key] = value

    async def _refresh_all_snapshots(self) -> None:
        await self._refresh_snapshots(set(self._conditions()))

    def _condition_keys_for(self, scope_kind: str, scope_id: str | None) -> set[str]:
        """The condition keys one scope's resolve will read.

        Derived from the scope's scenes rather than from the index: the index
        holds only predicates with something watchable, so a predicate whose
        spec is EMPTY (nothing to subscribe to) is absent from it yet is still
        evaluated — refreshing off the index would resolve such a scope against
        a stale snapshot. A `None` predicate (wildcard) reads no snapshot, and a
        disabled scene is skipped by the evaluation, so neither contributes.
        """
        cfg = self._scope_cfgs.get((scope_kind, scope_id)) or {}
        return {
            key
            for scene in cfg.get("scenes", [])
            if scene_enabled(scene)
            for key, predicate in scene.get("when", {}).items()
            if predicate is not None
        }

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
        None.

        Delegates to the shared ladder, supplying the engine's own snapshot cache
        and the dependency analysis captured at the last rebuild — the store's
        live config could have moved on since, and a trace must describe the
        scenes this engine actually evaluated.
        """
        return await async_resolve_and_apply_unit(
            self._hass,
            scope_kind,
            scope_id,
            category_id,
            self._snapshots,
            force=force,
            cause=cause,
            active=tracing_active(self._hass),
            entity_ids_for=partial(self._entity_ids_for, scope_kind, scope_id),
            winner_is_guard=partial(self._winner_has_unavailable, scope_kind, scope_id),
        )

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
        await self._refresh_snapshots(
            {key[3] for key in fired}, result_keys=self._fired_result_keys(fired)
        )
        if not self._running:
            # Torn down while the refresh was awaited: the rest of the pass would
            # apply units and re-arm `for:` rechecks against a dead engine.
            return
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
