"""Scene apply & resolve helpers.

Resolves a scope's scenes against the current world (condition snapshots) and
dispatches the winning scene's actions. Shared by the websocket apply command,
the auto-trigger engine, and the dry-run / simulate paths.
"""

from __future__ import annotations

import asyncio
import contextlib
import logging
from collections.abc import Callable, Iterable
from dataclasses import replace
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .conditions._common import UNAVAILABLE, render_detail
from .conditions._opaque import OpaquePrecomputedCondition
from .const import (
    DATA_APPLY_LOCKS,
    DATA_CONDITIONS,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_LAST_APPLIED_SCENE,
    DATA_LAST_MATCHED,
    DATA_STORE,
    DOMAIN,
    SIGNAL_UNIT_APPLIED,
    SIGNAL_UNIT_LIVE,
    get_store,
    get_switch,
)
from .engine import evaluate_explained, resolve
from .errors import service_validation_error
from .scope_triggers import referenced_entities
from .scopes import find_scope_spec, not_found_validation_error
from .service_logbook import log_apply, log_run_actions
from .switch import switch_registry_entry
from .trace import (
    CauseKind,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    emit_trace,
    tracing_active,
)

_LOGGER = logging.getLogger(__name__)

# Sentinel distinguishing "key absent" from a stored None in the live-state maps,
# so the first set of a None value still dispatches.
_UNSET: object = object()


def _scope_config(store, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
    """Resolve a (scope_kind, scope_id) pair to its persisted config dict.

    Raises ServiceValidationError for unknown areas/floors or an unrecognised
    scope kind. For "house", scope_id is ignored.
    """
    spec = find_scope_spec(scope_kind)
    if spec is None:
        raise service_validation_error("unknown_scope_kind", scope_kind=scope_kind)
    getter = getattr(store, spec.store_getter)
    if not spec.has_id:
        return getter()
    cfg = getter(scope_id)
    if cfg is None:
        raise not_found_validation_error(scope_kind, scope_id)
    return cfg


def category_ids(cfg: dict[str, Any]) -> list[str]:
    """The distinct category ids a scope's scenes fall into, in scene order
    (deterministic — a set would vary with hash randomisation, making engine
    apply/trace ordering differ run to run). Every scene is categorised, so
    these are always real ids. Empty when the scope has no scenes."""
    return list(
        dict.fromkeys(r["category"] for r in cfg.get("scenes", []) if r.get("category") is not None)
    )


def category_config(cfg: dict[str, Any], category: str) -> dict[str, Any]:
    """A scope config narrowed to one category's scenes: ``{"scenes": [...]}``.

    Pure. Shared by the simulator and the per-category Auto-triggers display so
    both filter scenes the same way the engine resolves a category."""
    return {"scenes": [s for s in cfg.get("scenes", []) if s.get("category") == category]}


def apply_lock(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> asyncio.Lock:
    """The per-(scope, category) apply lock, shared by the trigger engine and
    the manual apply path so resolve+apply never interleaves across the two
    (each would otherwise read a stale last_applied mid-apply). Bounded by
    scopes×categories; tiny and stable.

    Not reentrant: a task holding it must never reach
    `async_resolve_and_apply_unit` or `async_run_scene_actions` for the same
    unit again. That holds because no Ambience service reaches the apply path
    (they are all pass-throughs to other domains -
    tests/test_builtin_registration.py pins the set) and every apply is entered
    from its own websocket or engine task."""
    locks: dict[tuple[str, str | None, str], asyncio.Lock] = hass.data[DOMAIN].setdefault(
        DATA_APPLY_LOCKS, {}
    )
    key = (scope_kind, scope_id, category_id)
    lock = locks.get(key)
    if lock is None:
        lock = locks[key] = asyncio.Lock()
    return lock


def _switch_state(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Return the on/off state of the scope's own switch.

    Returns 'on', 'off', or 'unknown' (entity not yet registered, or the switch
    registry not yet set up — simulations can run before switches register).
    Gating reads only the scope's own switch; parent toggles cascade state
    onto descendant switches at turn-on/off time (see switch.py), not here.

    A switch the user disabled in the entity registry has no live entity, but
    disabling it is how a user pauses the scope from Settings -> Entities, so a
    registered-but-disabled entry reads 'off'. 'unknown' therefore covers both
    an unregistered switch and a registered, enabled one that has not loaded yet.
    """
    switch = get_switch(hass, scope_kind, scope_id)
    if switch is not None:
        return "on" if switch.is_on else "off"

    entry = switch_registry_entry(hass, scope_kind, scope_id)
    if entry is None:
        return "unknown"
    return "off" if entry.disabled_by is not None else "unknown"


def _scope_enabled(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> bool:
    """Whether the scope is permanently enabled. Disabled scopes never apply,
    even on the manual force path."""
    store = get_store(hass)
    if store is None:
        return True
    return store.get_scope_enabled(scope_kind, scope_id)


def _candidate_entity_ids_for(
    entity_ids_for: Callable[[int, str], tuple[str, ...]] | None,
    to_full: list[int] | None,
) -> Callable[[int, str], tuple[str, ...]] | None:
    """Re-key a full-scene-index entity_ids lookup onto the candidate list the
    engine actually walks. A category filter renumbers the scenes, so without
    this translation a trace would link another scene's entities."""
    if entity_ids_for is None or to_full is None:
        return entity_ids_for
    return lambda candidate_index, key: entity_ids_for(to_full[candidate_index], key)


def _describe_summary(condition: Any, snap: Any) -> str | None:
    """The plain-English summary a condition's `describe(snap)` yields for
    `snapshots_described`. Migrated conditions return translatable `Detail`
    segments; render them to English here so every consumer (the no-match log,
    `redact_plan`, and the dry-run websocket serialisation) keeps the pre-branch
    `str` shape. The per-predicate panel path keeps the segments."""
    if snap is None:
        return None
    described = condition.describe(snap)
    return render_detail(described) if isinstance(described, list) else described


async def async_resolve_with_snapshots(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any],
    category: str | None = None,
    *,
    describe: bool = True,
    explain: bool = False,
    entity_ids_for: Callable[[int, str], tuple[str, ...]] | None = None,
    switch_state: str | None = None,
) -> dict[str, Any]:
    """Resolve a scope against a pre-built `{condition_name: snapshot}` dict.

    Does NOT call any condition's `snapshot()` — the caller supplies them (the
    engine passes its own cache). Returns {matched_scene_index, scene_name,
    actions, apply, snapshots_described, switch_state, explanation} (`apply` is
    the winner's per-scene re-apply mode, "once"/"always"/None; present only on a
    match).

    `switch_state` lets a caller that already read it pass it through, so the
    trace and the plan agree.

    `explanation` is an `Explanation` (scene list relative to the resolved
    category) when `explain=True`, else None.

    `entity_ids_for` supplies each predicate's trace `entity_ids` from the
    caller's own precomputed dependency analysis, keyed by ``(scene_index,
    condition_key)`` with `scene_index` the FULL index in the scope's scenes
    (the category filter is translated here). Callers without precomputed deps
    omit it and the engine falls back to each condition's `trigger_deps`.

    A `when` key naming a condition that isn't registered (e.g. a stale config
    key) fails the scene, since `resolve()` cannot evaluate it.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    conditions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    scope_cfg = _scope_config(store, scope_kind, scope_id)

    described = (
        {
            name: _describe_summary(conditions_registry[name], snap)
            for name, snap in snapshots.items()
            if name in conditions_registry
        }
        if describe
        else {}
    )

    scenes = scope_cfg.get("scenes", [])
    if category is None:
        candidates = scenes
        to_full = None  # candidate index already is the full-scene index
    else:
        to_full = [i for i, r in enumerate(scenes) if r.get("category") == category]
        candidates = [scenes[i] for i in to_full]

    # Evaluate the candidate list exactly once: when explaining, derive the
    # winner from the Explanation (resolve() is itself a thin wrapper over
    # evaluate_explained, so calling both would walk the scenes twice).
    if explain:
        # `explain` is true on every evaluation (the BufferSink is always on), so
        # this describe=True walk runs in production — bounded, but not free.
        explanation = evaluate_explained(
            candidates,
            snapshots,
            conditions_registry,
            describe=True,
            entity_ids_for=_candidate_entity_ids_for(entity_ids_for, to_full),
        )
        winner = explanation.winner_index
        match = None if winner is None else (winner, candidates[winner])
    else:
        explanation = None
        match = resolve(candidates, snapshots, conditions_registry)

    if match is not None and to_full is not None:
        match = (to_full[match[0]], match[1])

    switch_state = (
        switch_state if switch_state is not None else _switch_state(hass, scope_kind, scope_id)
    )
    if match is None:
        return {
            "matched_scene_index": None,
            "scene_name": None,
            "actions": [],
            "snapshots_described": described,
            "switch_state": switch_state,
            "explanation": explanation,
        }
    idx, scene = match
    return {
        "matched_scene_index": idx,
        "scene_name": scene.get("name"),
        "actions": scene.get("actions", []),
        # Per-scene re-apply policy ("once"/"always"; absent = once). Carried on the
        # plan so the engine's debounce check reads it here rather than re-walking
        # the scope config for the winning scene.
        "apply": scene.get("apply"),
        "snapshots_described": described,
        "switch_state": switch_state,
        "explanation": explanation,
    }


async def snapshot_conditions(
    hass: HomeAssistant,
    conditions_registry: dict[str, Any],
    referenced: dict[str, frozenset[str]],
    keys: Iterable[str] | None = None,
    result_keys: dict[str, frozenset[str]] | None = None,
) -> dict[str, Any]:
    """Snapshot the given conditions concurrently (all of them when `keys` is
    None); a failure becomes a None snapshot (logged), so one broken condition
    can't block the rest.

    Each condition is handed the entities its scenes reference, so
    sensor-backed conditions snapshot only those instead of scanning a whole
    domain. A condition that references nothing gets an empty set (snapshot
    nothing); conditions that aren't entity-driven ignore the hint. Shared by
    the manual apply path and the trigger engine's snapshot cache.

    `result_keys` narrows the work further for the opaque pre-computed
    conditions (`script`/`template`): {condition: the result keys of the
    predicates that fired}, so only those items are recomputed and the rest are
    carried over from the condition's previous snapshot. Only an
    `OpaquePrecomputedCondition` takes the `keys` kwarg, so every other
    condition's snapshot signature stays untouched; a condition absent from the
    map (or no map at all) gets a full refresh.
    """
    names = (
        list(conditions_registry) if keys is None else [k for k in keys if k in conditions_registry]
    )

    async def _one(name: str) -> Any:
        # Deferring the call into a coroutine keeps a synchronous raise (e.g. a
        # signature mismatch) inside the gather, where it becomes a None
        # snapshot like any other failure.
        condition = conditions_registry[name]
        entities = referenced.get(name, frozenset())
        hint = result_keys.get(name) if result_keys is not None else None
        if hint is not None and isinstance(condition, OpaquePrecomputedCondition):
            return await condition.snapshot(hass, entities=entities, keys=hint)
        return await condition.snapshot(hass, entities=entities)

    results = await asyncio.gather(*(_one(name) for name in names), return_exceptions=True)
    snapshots: dict[str, Any] = {}
    for name, result in zip(names, results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: condition %r snapshot failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
    return snapshots


async def gather_unit_traces(coros: Iterable[Any]) -> list[UnitTrace]:
    """Run per-unit resolve/apply coroutines concurrently; failures are logged
    (one bad unit doesn't abort the rest), non-None UnitTraces are collected.
    Shared by the manual apply path and the trigger engine."""
    results = await asyncio.gather(*coros, return_exceptions=True)
    traces: list[UnitTrace] = []
    for res in results:
        if isinstance(res, BaseException):
            _LOGGER.warning("ambience: category apply failed: %s", res)
        elif res is not None:
            traces.append(res)
    return traces


def attach_tenure(
    conditions_registry: dict[str, Any],
    tenure_by_condition: dict[str, dict[str, Any]],
    snapshots: dict[str, Any],
) -> dict[str, Any]:
    """Inject a LIVE view of the engine's per-condition gate tenure into each
    gate-capable condition's snapshot.

    The inner dict is shared by reference, so an engine update is visible to a
    snapshot that was enriched earlier (the engine mutates, never replaces). A
    condition without `gate_states`, and a failed (None) snapshot, pass through
    untouched — they have no `for:` tenure to gate on. With the tenure attached,
    the condition's `for:` clauses measure predicate tenure instead of the
    legacy exact-state clock."""
    out = dict(snapshots)
    for name, snap in snapshots.items():
        condition = conditions_registry.get(name)
        if snap is None or condition is None or not hasattr(condition, "gate_states"):
            continue
        out[name] = replace(snap, tenure=tenure_by_condition.setdefault(name, {}))
    return out


async def async_snapshot_all(hass: HomeAssistant) -> dict[str, Any]:
    """Snapshot every registered condition fresh; failures become None.

    When the trigger engine exists, the snapshots are enriched with its live
    gate tenure so the manual apply / resolve-only paths evaluate `for:` clauses
    with the same predicate-tenure semantics as the engine. Without an engine
    (unit tests, early startup) the conditions fall back to the legacy
    exact-state clock."""
    conditions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    store = hass.data[DOMAIN][DATA_STORE]
    referenced = referenced_entities(
        conditions_registry, [cfg for _kind, _scope_id, cfg in store.all_scope_configs()]
    )
    snapshots = await snapshot_conditions(hass, conditions_registry, referenced)
    engine = hass.data[DOMAIN].get(DATA_ENGINE)
    if engine is not None:
        snapshots = attach_tenure(conditions_registry, engine.tenure, snapshots)
    return snapshots


async def async_resolve_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str | None = None,
    snapshots: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Snapshots every condition fresh (unless the caller supplies `snapshots`),
    then delegates. Return shape (on a match): {matched_scene_index, scene_name,
    actions, apply, snapshots_described, switch_state} (no `explanation` — this
    path does not request one).
    """
    if snapshots is None:
        snapshots = await async_snapshot_all(hass)
    return await async_resolve_with_snapshots(
        hass, scope_kind, scope_id, snapshots, category=category
    )


async def _resolve_all_categories(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    """Resolve every category of a scope against a shared snapshots dict, returning
    {category_id: plan}. Used by async_resolve_categories_only (the dry-run path)."""
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    return {
        cid: await async_resolve_with_snapshots(hass, scope_kind, scope_id, snapshots, category=cid)
        for cid in category_ids(cfg)
    }


async def async_resolve_categories_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any] | None = None,
) -> dict[str, dict[str, Any]]:
    """Per-category dry-run: snapshot once (unless the caller supplies
    `snapshots`), resolve every category. {category_id: plan}."""
    if snapshots is None:
        snapshots = await async_snapshot_all(hass)
    return await _resolve_all_categories(hass, scope_kind, scope_id, snapshots)


async def async_resolve_and_apply_unit(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    snapshots: dict[str, Any],
    *,
    force: bool = False,
    manual: bool = False,
    cause: TriggerCause | None = None,
    active: bool = False,
    entity_ids_for: Callable[[int, str], tuple[str, ...]] | None = None,
    winner_is_guard: Callable[[int | None], bool] | None = None,
) -> UnitTrace | None:
    """Resolve one (scope, category) unit against `snapshots` and apply the winner.

    The single outcome ladder behind both the auto-trigger engine and the manual
    apply. Returns the unit's UnitTrace when `active` (tracing), else None.

    `manual` marks a user-initiated apply: it runs the winner unconditionally,
    skipping the switch-off gate (the caller has already decided the switch does
    not veto), the unavailable drop-out and the last-applied debounce, and it
    describes the snapshots for the no-match log. `force` re-applies an unchanged
    winner (an engine reload of edited scenes) without lifting the switch gate.
    Either way the unit's matched scene is recorded, so the live "matched" state
    tracks every resolution, manual applies included.

    `cause` drives the drop-out suppression: when the fire came from an entity
    going unavailable/removed, only an `unavailable`-guard winner (per
    `winner_is_guard`, which maps a full-scene index to whether that scene guards
    availability) may act. `entity_ids_for` supplies precomputed trace entity_ids
    (see `async_resolve_with_snapshots`).
    """
    cached_switch_state: str | None = None

    def switch_state() -> str:
        """The scope's switch state, read at most once — the memoised value is
        also handed to `async_resolve_with_snapshots` below so the plan and the
        trace report the same read rather than the registry being hit twice."""
        nonlocal cached_switch_state
        if cached_switch_state is None:
            cached_switch_state = _switch_state(hass, scope_kind, scope_id)
        return cached_switch_state

    def trace(outcome: Outcome, explanation: Any = None, **kw: Any) -> UnitTrace | None:
        """This unit's trace for `outcome`, or None when tracing is inactive."""
        if not active:
            return None
        return UnitTrace(
            scope_kind, scope_id, category_id, switch_state(), outcome, explanation, **kw
        )

    if not _scope_enabled(hass, scope_kind, scope_id):
        return trace(Outcome.SKIPPED_SCOPE_DISABLED)
    if not manual and switch_state() == "off":
        return trace(Outcome.SKIPPED_SWITCH_OFF)
    # Serialize resolve+apply per (scope, category): a burst of triggers on
    # one unit arrives as separate tasks. Without this, while one task is
    # suspended running its actions, another resolves and applies the same
    # unit — re-firing the same scene. Holding the lock across the whole
    # resolve+apply makes a waiting task proceed only once the first has
    # recorded last_applied and finished, so it either debounces (same winner)
    # or applies in order (new winner) instead of interleaving mid-apply. The
    # manual path shares it, so the two never interleave dispatch on one unit.
    async with apply_lock(hass, scope_kind, scope_id, category_id):
        plan = await async_resolve_with_snapshots(
            hass,
            scope_kind,
            scope_id,
            snapshots,
            category=category_id,
            describe=manual,
            explain=active,
            entity_ids_for=entity_ids_for,
            switch_state=switch_state(),
        )
        index = plan["matched_scene_index"]
        explanation = plan.get("explanation")
        # Drop-out (the triggering entity went unavailable/unknown, or was
        # removed → cause.new is None): only an `unavailable`-guard winner may
        # act on it. A non-guard fall-through winner (or a no-match) is
        # suppressed so a sensor blip can't drive an unrelated scene — devices
        # are left untouched. The guard itself runs normally below (its
        # actions, or its NO_OP block).
        if (
            not manual
            and cause is not None
            and cause.kind == CauseKind.ENTITY
            and (cause.new in UNAVAILABLE or cause.new is None)
            and not (winner_is_guard is not None and winner_is_guard(index))
        ):
            # Suppression covers actions only: with the winner gone entirely, a
            # surviving last-applied record would debounce that scene's next real
            # win. A different (merely suppressed) winner leaves the record alone
            # — the devices still hold the recorded scene.
            if index is None:
                forget_last_applied(hass, scope_kind, scope_id, category_id)
            return trace(Outcome.SKIPPED_UNAVAILABLE, explanation)
        if index is None:
            if manual:
                _LOGGER.info(
                    "ambience: no scene matched for scope=%s/%s category=%s snapshots=%s",
                    scope_kind,
                    scope_id,
                    category_id,
                    plan["snapshots_described"],
                )
            # A no-match is a transition away from the previous winner: drop
            # the last-applied record so a later win of the same scene re-applies.
            forget_last_applied(hass, scope_kind, scope_id, category_id)
            set_last_matched(hass, scope_kind, scope_id, category_id, None)
            return trace(Outcome.NO_MATCH, explanation)
        # Record the current winner before any action runs (covers no-op /
        # debounce / acted). The unavailable-drop-out above intentionally does
        # not reach here, so a sensor blip leaves the dot untouched.
        set_last_matched(hass, scope_kind, scope_id, category_id, index)
        if not plan["actions"]:
            # A pure blocker (winner with no actions): nothing to run, and it
            # stays transparent to last-applied so it neither records itself nor
            # clears a prior real winner.
            return trace(Outcome.NO_OP, explanation, winner_name=plan["scene_name"])
        always = plan.get("apply") == "always"
        if (
            not manual
            and not force
            and not always
            and index == get_last_applied(hass, scope_kind, scope_id, category_id)
        ):
            # Same winner as last applied, with identical actions → suppress the
            # redundant re-fire. A scene whose `apply` mode is "always" opts out
            # of this debounce, re-asserting its actions on every re-evaluation.
            return trace(Outcome.DEBOUNCED, explanation, winner_name=plan["scene_name"])
        await async_execute_plan(hass, scope_kind, scope_id, plan, category_id)
    if not active:
        # Annotating the actions is real work; don't do it for a trace nobody builds.
        return None
    return trace(
        Outcome.ACTED,
        explanation,
        winner_name=plan["scene_name"],
        actions=hass.data[DOMAIN][DATA_EXPOSED_ACTIONS].annotate_unexposed(plan["actions"]),
    )


async def async_apply_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    *,
    category: str | None = None,
    force: bool = False,
) -> None:
    """Apply a scene at the given scope according to configured scenes.

    `scope_kind` is one of "area", "floor", "house". For "house", scope_id is
    None. `category` limits the apply to that single scene-category (None = every
    category). `force=True` applies even when the scope's switch is off (used by
    the manual UI buttons).
    """
    if not _scope_enabled(hass, scope_kind, scope_id):
        _LOGGER.info(
            "ambience: scope disabled (scope=%s/%s); skipping apply_scene",
            scope_kind,
            scope_id,
        )
        return

    switch_state = _switch_state(hass, scope_kind, scope_id)
    if not force and switch_state == "off":
        _LOGGER.info(
            "ambience: scope=%s/%s switch is off; skipping apply_scene",
            scope_kind,
            scope_id,
        )
        return

    # Snapshot once, then apply every category's winner concurrently (categories are
    # independent by construction).
    active = tracing_active(hass)
    snapshots = await async_snapshot_all(hass)
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)

    # The manual apply runs the winner unconditionally: `manual=True` lifts the
    # switch-off, drop-out and debounce gates from the shared ladder. The snapshot
    # is taken before the unit lock, so a concurrent engine apply that resolves a
    # newer winner could still be followed by this stale apply — acceptable for a
    # user-initiated one-shot.
    async def _apply_category(category_id: str) -> UnitTrace | None:
        return await async_resolve_and_apply_unit(
            hass,
            scope_kind,
            scope_id,
            category_id,
            snapshots,
            manual=True,
            active=active,
        )

    # category_ids already returns categories in scene order (deterministic);
    # the engine apply path consumes it raw, so don't re-sort here.
    gids = [category] if category is not None else category_ids(cfg)
    traces = await gather_unit_traces(_apply_category(cid) for cid in gids)
    if traces:
        emit_trace(hass, TraceEvent(TriggerCause(kind=CauseKind.MANUAL), traces))


async def async_execute_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    actions: list[dict[str, Any]],
    scene_index: int | None = None,
    context: Context | None = None,
) -> None:
    """Dispatch a list of action specs.

    Malformed / unexposed actions are logged and skipped; a raised action is
    logged but does not abort the rest. Does NOT record last-applied — callers
    that represent a full apply do that themselves. `scene_index` is used only
    for log context.
    """
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    coros: list = []
    for action_spec in actions:
        service_id = action_spec.get("service")
        if not service_id or "." not in service_id:
            _LOGGER.warning(
                "ambience: scene %s in scope=%s/%s has malformed action %r; skipping",
                scene_index,
                scope_kind,
                scope_id,
                action_spec,
            )
            continue
        exposed = exposed_store.get(service_id)
        if exposed is None:
            _LOGGER.warning(
                "ambience: service %r not exposed; skipping (scene %s, scope=%s/%s)",
                service_id,
                scene_index,
                scope_kind,
                scope_id,
            )
            continue
        domain, name = service_id.split(".", 1)
        params = {**exposed.get("defaults", {}), **action_spec.get("params", {})}
        entity_ids = action_spec.get("entity_ids") or []
        target = {"entity_id": entity_ids} if entity_ids else None
        coros.append(
            hass.services.async_call(
                domain, name, params, target=target, blocking=True, context=context
            )
        )

    results = await asyncio.gather(*coros, return_exceptions=True)
    for result in results:
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: action raised: %s", result)


async def async_run_scene_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene_index: int,
) -> dict[str, Any]:
    """Run one scene's actions, respecting only the permanent disable flag.

    Does NOT evaluate the scene's `when`, does NOT gate on the temporary scope
    switch, and does NOT touch last_applied (it is an out-of-band manual
    override, not a resolution). It DOES refuse to fire when the scope is
    permanently disabled (`enabled` is False), raising ServiceValidationError.
    Returns {ran, scene_name} for UI feedback. An out-of-range `scene_index`
    raises ServiceValidationError.

    It DOES serialise with an in-flight apply of the same scope/category, so
    the two never interleave their action dispatch on the same unit.
    """
    if not _scope_enabled(hass, scope_kind, scope_id):
        raise service_validation_error("scope_disabled", scope_kind=scope_kind, scope_id=scope_id)
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    scenes = cfg.get("scenes", [])
    if not 0 <= scene_index < len(scenes):
        raise service_validation_error("scene_index_out_of_range", scene_index=scene_index)
    scene = scenes[scene_index]
    actions = scene.get("actions", [])
    scene_name = scene.get("name")
    category = scene.get("category")
    # A live scene always carries a category (they are coerced at load); a
    # category-less scene has no engine unit to collide with, so there is
    # nothing to serialise against.
    lock = (
        apply_lock(hass, scope_kind, scope_id, category)
        if isinstance(category, str)
        else contextlib.nullcontext()
    )
    async with lock:
        context = (
            log_run_actions(hass, scope_kind, scope_id, scene_name, scene_index)
            if actions
            else None
        )
        await async_execute_actions(
            hass, scope_kind, scope_id, actions, scene_index=scene_index, context=context
        )
    return {"ran": len(actions), "scene_name": scene_name}


async def async_execute_plan(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    plan: dict[str, Any],
    category_id: str,
) -> None:
    """Dispatch a resolved plan's actions and record it as last-applied.

    The caller must have already gated on the switch and confirmed a non-None
    `matched_scene_index`. Malformed / unexposed actions are logged and skipped;
    a raised action is logged but does not abort the rest. `last_applied` is
    keyed per (scope_kind, scope_id, category_id); category_id is always a real category.
    """
    index = plan["matched_scene_index"]
    actions = plan["actions"]
    context = (
        log_apply(hass, scope_kind, scope_id, category_id, plan["scene_name"], index)
        if actions
        else None
    )
    # Record the selection BEFORE running the actions. We don't track per-action
    # success, so last_applied reflects the decision, not the outcome; recording
    # it up front means a cascade re-triggered by these actions sees the unit as
    # already applied and debounces instead of re-firing. A winner with no actions
    # (a pure blocker) stays transparent: it neither records itself nor clears a
    # prior real winner.
    if actions:
        domain_data = hass.data[DOMAIN]
        domain_data.setdefault(DATA_LAST_APPLIED, {})[(scope_kind, scope_id, category_id)] = index
        set_last_applied_scene(hass, scope_kind, scope_id, category_id, index)
        async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, (scope_kind, scope_id, category_id))
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, scene_index=index, context=context
    )


def get_last_applied(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> int | None:
    """The scene index last applied to this (scope, category), or None if never applied."""
    return hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).get((scope_kind, scope_id, category_id))


def _clear_scope_keys(
    mapping: dict[tuple[str, str | None, str], Any], scope_kind: str, scope_id: str | None
) -> None:
    """Drop every (scope_kind, scope_id, *) entry from a per-unit mapping."""
    for key in [k for k in mapping if k[0] == scope_kind and k[1] == scope_id]:
        mapping.pop(key, None)


def clear_last_applied(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> None:
    """Drop all last-applied entries for a scope (every category), e.g. on delete."""
    _clear_scope_keys(hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}), scope_kind, scope_id)


def forget_last_applied(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> None:
    """Drop one (scope, category)'s last-applied record, e.g. on a no-match, so the
    next match re-applies even when it resolves to the same scene as before."""
    hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).pop((scope_kind, scope_id, category_id), None)


def _set_live_field(
    hass: HomeAssistant,
    data_key: str,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    value: int | None,
) -> None:
    """Write a per-unit live-state field, firing SIGNAL_UNIT_LIVE only when the
    stored value actually changes. Shared by set_last_matched /
    set_last_applied_scene. Avoids `setdefault`'s throwaway `{}` on the hot path
    (this runs on every unit evaluation)."""
    domain_data = hass.data[DOMAIN]
    store = domain_data.get(data_key)
    if store is None:
        store = domain_data[data_key] = {}
    key = (scope_kind, scope_id, category_id)
    if store.get(key, _UNSET) == value:
        return
    store[key] = value
    async_dispatcher_send(hass, SIGNAL_UNIT_LIVE, key)


def set_last_matched(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    index: int | None,
) -> None:
    """Record this (scope, category)'s currently matched scene index (None = no
    match). Fires SIGNAL_UNIT_LIVE only when the stored value actually changes."""
    _set_live_field(hass, DATA_LAST_MATCHED, scope_kind, scope_id, category_id, index)


def get_last_matched(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> int | None:
    """The scene index currently matched for this (scope, category), or None."""
    return hass.data[DOMAIN].get(DATA_LAST_MATCHED, {}).get((scope_kind, scope_id, category_id))


def set_last_applied_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category_id: str,
    index: int,
) -> None:
    """Record the scene index whose actions were just executed for this (scope,
    category) — the sticky 'what's physically set' value. Fires SIGNAL_UNIT_LIVE
    only when it changes. Never cleared on a no-match."""
    _set_live_field(hass, DATA_LAST_APPLIED_SCENE, scope_kind, scope_id, category_id, index)


def get_last_applied_scene(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> int | None:
    """The scene index last physically applied for this (scope, category), or None."""
    return (
        hass.data[DOMAIN].get(DATA_LAST_APPLIED_SCENE, {}).get((scope_kind, scope_id, category_id))
    )


def live_state(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> tuple[int | None, int | None]:
    """The (matched, applied) pair for this unit. Raw — the frontend suppresses
    the dots when the scope's switch is off."""
    key = (scope_kind, scope_id, category_id)
    matched = hass.data[DOMAIN].get(DATA_LAST_MATCHED, {}).get(key)
    applied = hass.data[DOMAIN].get(DATA_LAST_APPLIED_SCENE, {}).get(key)
    return (matched, applied)


def all_live_states(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every known unit's live state, for the subscription snapshot."""
    data = hass.data[DOMAIN]
    matched = data.get(DATA_LAST_MATCHED, {})
    applied = data.get(DATA_LAST_APPLIED_SCENE, {})
    out: list[dict[str, Any]] = []
    for kind, sid, cat in set(matched) | set(applied):
        out.append(
            {
                "scope_kind": kind,
                "scope_id": sid,
                "category": cat,
                "matched": matched.get((kind, sid, cat)),
                "applied": applied.get((kind, sid, cat)),
            }
        )
    return out


def clear_live_state(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> None:
    """Drop a scope's live-state entries (every category), e.g. on scope delete."""
    for data_key in (DATA_LAST_MATCHED, DATA_LAST_APPLIED_SCENE):
        _clear_scope_keys(hass.data[DOMAIN].get(data_key, {}), scope_kind, scope_id)
