"""ambience.apply_scene service handler.

`apply_scene` is the service name; it resolves a scope's scenes against the
current world (condition snapshots) and dispatches the winning scene's actions.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Iterable
from dataclasses import replace
from typing import Any

from homeassistant.core import Context, HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import (
    DATA_APPLY_LOCKS,
    DATA_CONDITIONS,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
    SIGNAL_UNIT_APPLIED,
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


def scope_option_value(scope_kind: str, scope_id: str | None) -> str:
    """Encode a scope as the opaque string used by the apply_scene `scope`
    select option (and accepted back by the service)."""
    return "house" if scope_kind == "house" else f"{scope_kind}:{scope_id}"


def parse_scope_option(value: str) -> tuple[str, str | None]:
    """Decode a `scope` option value into (scope_kind, scope_id). Raises
    ServiceValidationError on an unparseable value or unknown kind."""
    if value == "house":
        return ("house", None)
    kind, sep, scope_id = value.partition(":")
    if sep and kind in ("floor", "area") and scope_id:
        return (kind, scope_id)
    raise ServiceValidationError(f"invalid scope: {value!r}")


def build_apply_scene_schema(hass: HomeAssistant) -> dict[str, Any]:
    """Build the apply_scene service UI schema with runtime-populated scope /
    category dropdowns. Passed to async_set_service_schema and rebuilt
    when the store or area/floor registries change."""
    store = hass.data[DOMAIN][DATA_STORE]
    area_reg = ar.async_get(hass)
    floor_reg = fr.async_get(hass)

    scope_options: list[dict[str, str]] = []
    if store.get_scope_enabled("house", None):
        scope_options.append({"value": scope_option_value("house", None), "label": "House"})
    for floor in sorted(floor_reg.async_list_floors(), key=lambda f: f.name):
        if store.get_scope_enabled("floor", floor.floor_id):
            scope_options.append(
                {
                    "value": scope_option_value("floor", floor.floor_id),
                    "label": f"{floor.name} (floor)",
                }
            )
    for area in sorted(area_reg.async_list_areas(), key=lambda a: a.name):
        if store.get_scope_enabled("area", area.id):
            scope_options.append(
                {
                    "value": scope_option_value("area", area.id),
                    "label": f"{area.name} (area)",
                }
            )

    category_options = [
        {"value": c["id"], "label": c.get("name") or c["id"]} for c in store.categories()
    ]

    def _select(options: list[dict[str, str]]) -> dict[str, Any]:
        return {
            "select": {
                "multiple": True,
                "custom_value": True,
                "mode": "dropdown",
                "options": options,
            }
        }

    return {
        "name": "Apply scene",
        "description": (
            "Apply Ambience scenes to one or more scopes. Blank scope = every scope; "
            "blank category = every category."
        ),
        "fields": {
            "scope": {
                "name": "Scopes",
                "description": "Scopes to apply in (blank = every scope).",
                "required": False,
                "selector": _select(scope_options),
            },
            "category": {
                "name": "Categories",
                "description": "Limit to these scene categories (blank = all).",
                "required": False,
                "selector": _select(category_options),
            },
            "force": {
                "name": "Force",
                "description": "Apply even when a scope is paused (its switch is off).",
                "required": False,
                "selector": {"boolean": {}},
            },
        },
    }


def _resolve_target_scopes(
    hass: HomeAssistant, data: dict[str, Any]
) -> list[tuple[str, str | None]]:
    """Map the service's `scope` values to a list of (scope_kind, scope_id).

    Each non-blank value is decoded by parse_scope_option; floor/area ids are
    validated against the registries (unknown -> ServiceValidationError). Blank or
    whitespace-only entries are ignored (a stray empty chip shouldn't abort the
    call), so an all-blank or omitted `scope` means every scope (house + all
    floors + all areas).

    A blank or explicitly-typed scope may include scopes that are permanently
    disabled; the downstream apply skips disabled scopes, so resolving them here
    is harmless.
    """
    area_reg = ar.async_get(hass)
    floor_reg = fr.async_get(hass)
    scopes: list[tuple[str, str | None]] = []
    for value in data.get("scope", []):
        if not value.strip():
            continue
        kind, scope_id = parse_scope_option(value)
        if kind == "area" and area_reg.async_get_area(scope_id) is None:
            raise ServiceValidationError(f"unknown_area: {scope_id!r}")
        if kind == "floor" and floor_reg.async_get_floor(scope_id) is None:
            raise ServiceValidationError(f"unknown_floor: {scope_id!r}")
        scopes.append((kind, scope_id))
    if not scopes:
        scopes.append(("house", None))
        scopes.extend(("floor", f.floor_id) for f in floor_reg.async_list_floors())
        scopes.extend(("area", a.id) for a in area_reg.async_list_areas())
    # De-dup, preserving order: repeated ids (easy to write in YAML) would
    # otherwise apply the same scope twice.
    return list(dict.fromkeys(scopes))


async def async_apply_scene_service(hass: HomeAssistant, call: ServiceCall) -> None:
    """Service handler for ambience.apply_scene: resolve target scopes, then apply.

    Targets scopes by the `scope` field (blank = every scope). With categories,
    fans out over scope x category; otherwise re-resolves every category per scope.
    """
    scopes = _resolve_target_scopes(hass, call.data)
    categories = call.data.get("category")
    force = call.data.get("force", False)
    if categories:
        for scope_kind, scope_id in scopes:
            for category in categories:
                await async_apply_scene(hass, scope_kind, scope_id, category=category, force=force)
    else:
        for scope_kind, scope_id in scopes:
            await async_apply_scene(hass, scope_kind, scope_id, force=force)


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
        async_dispatcher_send(hass, SIGNAL_UNIT_APPLIED, (scope_kind, scope_id, category_id))
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
