"""ambience.apply_scene service handler.

`apply_scene` is the service name; it resolves a scope's scenes against the
current world (condition snapshots) and dispatches the winning scene's actions.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Iterable
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import (
    DATA_APPLY_LOCKS,
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from .engine import evaluate_explained, resolve
from .scope_triggers import referenced_entities
from .service_logbook import log_apply, log_run_actions
from .trace import (
    CauseKind,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    emit_trace,
    tracing_active,
)
from .validators import MIN_REAPPLY_SECONDS

_LOGGER = logging.getLogger(__name__)


def _scope_config(store, scope_kind: str, scope_id: str | None) -> dict[str, Any]:
    """Resolve a (scope_kind, scope_id) pair to its persisted config dict.

    Raises ServiceValidationError for unknown areas/floors or an unrecognised
    scope kind. For "house", scope_id is ignored.
    """
    if scope_kind == "area":
        cfg = store.get_area(scope_id)
        if cfg is None:
            raise ServiceValidationError(f"unknown_area: {scope_id!r}")
        return cfg
    if scope_kind == "floor":
        cfg = store.get_floor(scope_id)
        if cfg is None:
            raise ServiceValidationError(f"unknown_floor: {scope_id!r}")
        return cfg
    if scope_kind == "house":
        return store.get_house()
    raise ServiceValidationError(f"unknown_scope_kind: {scope_kind!r}")


def category_ids(cfg: dict[str, Any]) -> list[str]:
    """The distinct category ids a scope's scenes fall into, in scene order
    (deterministic — a set would vary with hash randomisation, making engine
    apply/trace ordering differ run to run). Every scene is categorised, so
    these are always real ids. Empty when the scope has no scenes."""
    return list(
        dict.fromkeys(r["category"] for r in cfg.get("scenes", []) if r.get("category") is not None)
    )


def apply_lock(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> asyncio.Lock:
    """The per-(scope, category) apply lock, shared by the trigger engine and
    the manual apply path so resolve+apply never interleaves across the two
    (each would otherwise read a stale last_applied mid-apply). Bounded by
    scopes×categories; tiny and stable."""
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
    """
    switch = hass.data.get(DOMAIN, {}).get(DATA_SWITCHES, {}).get((scope_kind, scope_id))
    if switch is None:
        return "unknown"
    return "on" if switch.is_on else "off"


def _scope_enabled(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> bool:
    """Whether the scope is permanently enabled. Disabled scopes never apply,
    even on the manual force path."""
    store = hass.data.get(DOMAIN, {}).get(DATA_STORE)
    if store is None:
        return True
    return store.get_scope_enabled(scope_kind, scope_id)


async def async_resolve_with_snapshots(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any],
    category: str | None = None,
    *,
    describe: bool = True,
    explain: bool = False,
) -> dict[str, Any]:
    """Resolve a scope against a pre-built `{condition_name: snapshot}` dict.

    Does NOT call any condition's `snapshot()` — the caller supplies them (the
    engine passes its own cache). Returns {matched_scene_index, scene_name,
    actions, snapshots_described, switch_state, explanation}.

    `explanation` is an `Explanation` (scene list relative to the resolved
    category) when `explain=True`, else None.

    A `when` key naming a condition that isn't registered (e.g. a stale config
    key) fails the scene, since `resolve()` cannot evaluate it.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    conditions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    scope_cfg = _scope_config(store, scope_kind, scope_id)

    described = (
        {
            name: conditions_registry[name].describe(snap) if snap is not None else None
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
        # describe=True calls condition.describe() per predicate. With the always-on
        # BufferSink (Increment B), `explain` is true on every evaluation, so this
        # runs in production — bounded, but no longer gated behind debug logging.
        explanation = evaluate_explained(candidates, snapshots, conditions_registry, describe=True)
        winner = explanation.winner_index
        match = None if winner is None else (winner, candidates[winner])
    else:
        explanation = None
        match = resolve(candidates, snapshots, conditions_registry)

    if match is not None and to_full is not None:
        match = (to_full[match[0]], match[1])

    switch_state = _switch_state(hass, scope_kind, scope_id)
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
        "snapshots_described": described,
        "switch_state": switch_state,
        "explanation": explanation,
    }


async def snapshot_conditions(
    hass: HomeAssistant,
    conditions_registry: dict[str, Any],
    referenced: dict[str, frozenset[str]],
    keys: Iterable[str] | None = None,
) -> dict[str, Any]:
    """Snapshot the given conditions concurrently (all of them when `keys` is
    None); a failure becomes a None snapshot (logged), so one broken condition
    can't block the rest.

    Each condition is handed the entities its scenes reference, so
    sensor-backed conditions snapshot only those instead of scanning a whole
    domain. A condition that references nothing gets an empty set (snapshot
    nothing); conditions that aren't entity-driven ignore the hint. Shared by
    the manual apply path and the trigger engine's snapshot cache.
    """
    names = (
        list(conditions_registry) if keys is None else [k for k in keys if k in conditions_registry]
    )

    async def _one(name: str) -> Any:
        # Deferring the call into a coroutine keeps a synchronous raise (e.g. a
        # signature mismatch) inside the gather, where it becomes a None
        # snapshot like any other failure.
        return await conditions_registry[name].snapshot(
            hass, entities=referenced.get(name, frozenset())
        )

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


async def async_snapshot_all(hass: HomeAssistant) -> dict[str, Any]:
    """Snapshot every registered condition fresh; failures become None."""
    conditions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_CONDITIONS]
    store = hass.data[DOMAIN][DATA_STORE]
    referenced = referenced_entities(
        conditions_registry, [cfg for _kind, _scope_id, cfg in store.all_scope_configs()]
    )
    return await snapshot_conditions(hass, conditions_registry, referenced)


async def async_resolve_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str | None = None,
    snapshots: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Snapshots every condition fresh (unless the caller supplies `snapshots`),
    then delegates. Return shape:
    {matched_scene_index, scene_name, actions, snapshots_described, switch_state}.
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

    # Mirrors trigger_engine._resolve_and_apply but deliberately simpler: the
    # manual path always executes matched categories (no switch-off/no-op/last-applied
    # gating), so the two are intentionally not unified. It shares the engine's
    # per-unit lock, so the two never interleave action *dispatch* on one unit;
    # the manual snapshot is taken before the lock, so a concurrent engine apply
    # that resolves a newer winner could still be followed by this stale apply —
    # acceptable for a user-initiated one-shot, and strictly better than the
    # pre-lock free-for-all.
    async def _apply_category(category_id: str) -> UnitTrace | None:
        async with apply_lock(hass, scope_kind, scope_id, category_id):
            plan = await async_resolve_with_snapshots(
                hass, scope_kind, scope_id, snapshots, category=category_id, explain=active
            )
            explanation = plan.get("explanation")
            if plan["matched_scene_index"] is None:
                _LOGGER.info(
                    "ambience: no scene matched for scope=%s/%s category=%s snapshots=%s",
                    scope_kind,
                    scope_id,
                    category_id,
                    plan["snapshots_described"],
                )
                # A no-match is a transition away from the previous winner: drop the
                # last-applied record so a later win re-applies (mirrors the engine).
                forget_last_applied(hass, scope_kind, scope_id, category_id)
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
                # A pure blocker (winner with no actions): nothing to run, transparent
                # to last-applied (mirrors the engine).
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
            await async_execute_plan(hass, scope_kind, scope_id, plan, category_id)
        if active:
            return UnitTrace(
                scope_kind,
                scope_id,
                category_id,
                switch_state,
                Outcome.ACTED,
                explanation,
                winner_name=plan["scene_name"],
                actions=plan["actions"],
            )
        return None

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
    """
    if not _scope_enabled(hass, scope_kind, scope_id):
        raise ServiceValidationError(f"scope {scope_kind}/{scope_id} is disabled")
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    scenes = cfg.get("scenes", [])
    if not 0 <= scene_index < len(scenes):
        raise ServiceValidationError(f"scene_index out of range: {scene_index}")
    scene = scenes[scene_index]
    actions = scene.get("actions", [])
    scene_name = scene.get("name")
    context = (
        log_run_actions(hass, scope_kind, scope_id, scene_name, scene_index) if actions else None
    )
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, scene_index=scene_index, context=context
    )
    return {"ran": len(actions), "scene_name": scene_name}


async def async_apply_named_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    category: str,
    scene_name: str,
    *,
    force: bool = False,
) -> None:
    """Apply a single named scene's actions directly, bypassing predicate resolution.

    Locates the scene by case-insensitive name within (scope, category) — names are
    unique there by construction — and runs its actions. Always refuses when the
    scope is permanently disabled. Honours the scope switch unless `force=True`.
    Does NOT touch last_applied (an out-of-band manual override, like
    async_run_scene_actions). Emits a MANUAL-cause trace.
    """
    if not _scope_enabled(hass, scope_kind, scope_id):
        raise ServiceValidationError(f"scope {scope_kind}/{scope_id} is disabled")

    switch_state = _switch_state(hass, scope_kind, scope_id)
    if not force and switch_state == "off":
        _LOGGER.info(
            "ambience: scope=%s/%s switch is off; skipping apply_scene (named scene %r)",
            scope_kind,
            scope_id,
            scene_name,
        )
        return

    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    target = scene_name.strip().lower()
    match: tuple[int, dict[str, Any], str] | None = None
    for index, scene in enumerate(cfg.get("scenes", [])):
        if scene.get("category") != category:
            continue
        name = scene.get("name")
        # Only non-empty names are matchable (unnamed scenes are exempt from the
        # uniqueness rule), so an empty scene_name never matches an unnamed scene.
        if isinstance(name, str) and name.strip() and name.strip().lower() == target:
            match = (index, scene, name)
            break
    if match is None:
        raise ServiceValidationError(
            f"no scene named {scene_name!r} in scope {scope_kind}/{scope_id} category {category!r}"
        )

    index, scene, name = match
    actions = scene.get("actions", [])
    context = log_run_actions(hass, scope_kind, scope_id, name, index) if actions else None
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, scene_index=index, context=context
    )

    if tracing_active(hass):
        outcome = Outcome.ACTED if actions else Outcome.NO_OP
        unit_kwargs: dict[str, Any] = {"winner_name": name}
        if actions:
            unit_kwargs["actions"] = actions
        emit_trace(
            hass,
            TraceEvent(
                TriggerCause(kind=CauseKind.MANUAL),
                [
                    UnitTrace(
                        scope_kind,
                        scope_id,
                        category,
                        switch_state,
                        outcome,
                        None,
                        **unit_kwargs,
                    )
                ],
            ),
        )


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
        log_apply(
            hass, scope_kind, scope_id, category_id, plan["scene_name"], index, reapplied=False
        )
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
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, scene_index=index, context=context
    )


def get_last_applied(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> int | None:
    """The scene index last applied to this (scope, category), or None if never applied."""
    return hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).get((scope_kind, scope_id, category_id))


def clear_last_applied(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> None:
    """Drop all last-applied entries for a scope (every category), e.g. on delete."""
    la = hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})
    for key in [k for k in la if k[0] == scope_kind and k[1] == scope_id]:
        la.pop(key, None)


def forget_last_applied(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category_id: str
) -> None:
    """Drop one (scope, category)'s last-applied record, e.g. on a no-match, so the
    next match re-applies even when it resolves to the same scene as before."""
    hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).pop((scope_kind, scope_id, category_id), None)


def scope_reapply_intervals(cfg: dict[str, Any], exposed_store: Any) -> list[int]:
    """Distinct, sorted effective re-apply intervals (seconds) across a scope's
    scene actions. Empty when no action re-applies."""
    intervals: set[int] = set()
    for scene in cfg.get("scenes", []):
        for action in scene.get("actions", []):
            seconds = effective_reapply_seconds(action, exposed_store)
            if seconds:
                intervals.add(seconds)
    return sorted(intervals)


def effective_reapply_seconds(action: dict[str, Any], exposed_store: Any) -> int:
    """Resolve an action's effective re-apply interval in seconds.

    The action's own `reapply_seconds` wins when the key is PRESENT (so an
    explicit 0 disables an exposed default); otherwise the exposed-action
    entry's default applies; otherwise off (0). Values below the floor, or of
    the wrong type, are treated as off.
    """
    if "reapply_seconds" in action:
        value = action["reapply_seconds"]
    elif exposed_store is not None:
        entry = exposed_store.get(action.get("service"))
        value = entry.get("reapply_seconds", 0) if isinstance(entry, dict) else 0
    else:
        value = 0
    if isinstance(value, bool) or not isinstance(value, int):
        return 0
    return value if value >= MIN_REAPPLY_SECONDS else 0
