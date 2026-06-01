"""ambience.apply_scene service handler.

`apply_scene` is the service name; it resolves a scope's rules against the
current world (matcher snapshots) and dispatches the winning rule's actions.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import floor_registry as fr

from .const import (
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from .engine import evaluate_explained, resolve
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


def group_ids(cfg: dict[str, Any]) -> set[str]:
    """The distinct group ids a scope's rules fall into. Every rule is grouped,
    so these are always real ids. Empty when the scope has no rules."""
    return {r["group"] for r in cfg.get("rules", []) if r.get("group") is not None}


def _switch_state(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Return the on/off state of the scope's own switch.

    Returns 'on', 'off', or 'unknown' (entity not yet registered).
    Gating reads only the scope's own switch; parent toggles cascade state
    onto descendant switches at turn-on/off time (see switch.py), not here.
    """
    switch = hass.data[DOMAIN].get(DATA_SWITCHES, {}).get((scope_kind, scope_id))
    if switch is None:
        return "unknown"
    return "on" if switch.is_on else "off"


async def async_resolve_with_snapshots(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any],
    group: str | None = None,
    *,
    describe: bool = True,
    explain: bool = False,
) -> dict[str, Any]:
    """Resolve a scope against a pre-built `{matcher_name: snapshot}` dict.

    Does NOT call any matcher's `snapshot()` — the caller supplies them (the
    engine passes its own cache). Returns {matched_rule_index, rule_name,
    actions, snapshots_described, switch_state, explanation}.

    `explanation` is an `Explanation` (rule list relative to the resolved
    group) when `explain=True`, else None.

    A `when` key naming a matcher that isn't registered (e.g. a stale config
    key) fails the rule, since `resolve()` cannot evaluate it.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    scope_cfg = _scope_config(store, scope_kind, scope_id)

    described = (
        {
            name: matchers_registry[name].describe(snap) if snap is not None else None
            for name, snap in snapshots.items()
            if name in matchers_registry
        }
        if describe
        else {}
    )

    rules = scope_cfg.get("rules", [])
    if group is None:
        candidates = rules
        to_full = None  # candidate index already is the full-rule index
    else:
        to_full = [i for i, r in enumerate(rules) if r.get("group") == group]
        candidates = [rules[i] for i in to_full]

    # Evaluate the candidate list exactly once: when explaining, derive the
    # winner from the Explanation (resolve() is itself a thin wrapper over
    # evaluate_explained, so calling both would walk the rules twice).
    if explain:
        explanation = evaluate_explained(candidates, snapshots, matchers_registry, describe=True)
        winner = explanation.winner_index
        match = None if winner is None else (winner, candidates[winner])
    else:
        explanation = None
        match = resolve(candidates, snapshots, matchers_registry)

    if match is not None and to_full is not None:
        match = (to_full[match[0]], match[1])

    switch_state = _switch_state(hass, scope_kind, scope_id)
    if match is None:
        return {
            "matched_rule_index": None,
            "rule_name": None,
            "actions": [],
            "snapshots_described": described,
            "switch_state": switch_state,
            "explanation": explanation,
        }
    idx, rule = match
    return {
        "matched_rule_index": idx,
        "rule_name": rule.get("name"),
        "actions": rule.get("actions", []),
        "snapshots_described": described,
        "switch_state": switch_state,
        "explanation": explanation,
    }


async def _snapshot_all(hass: HomeAssistant) -> dict[str, Any]:
    """Snapshot every registered matcher fresh; failures become None."""
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    snapshot_results = await asyncio.gather(
        *[m.snapshot(hass) for m in matchers_registry.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(matchers_registry.keys(), snapshot_results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: matcher %r snapshot failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
    return snapshots


async def async_resolve_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    group: str | None = None,
) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Snapshots every matcher fresh, then delegates. Return shape:
    {matched_rule_index, rule_name, actions, snapshots_described, switch_state}.
    """
    snapshots = await _snapshot_all(hass)
    return await async_resolve_with_snapshots(hass, scope_kind, scope_id, snapshots, group=group)


async def _resolve_all_groups(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    snapshots: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    """Resolve every group of a scope against a shared snapshots dict, returning
    {group_id: plan}. Used by async_resolve_groups_only (the dry-run path)."""
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)
    return {
        gid: await async_resolve_with_snapshots(hass, scope_kind, scope_id, snapshots, group=gid)
        for gid in group_ids(cfg)
    }


async def async_resolve_groups_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
) -> dict[str, dict[str, Any]]:
    """Per-group dry-run: snapshot once, resolve every group. {group_id: plan}."""
    snapshots = await _snapshot_all(hass)
    return await _resolve_all_groups(hass, scope_kind, scope_id, snapshots)


async def async_apply_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
) -> None:
    """Apply a scene at the given scope according to configured rules.

    `scope_kind` is one of "area", "floor", "house". For "house", scope_id is
    None.
    """
    switch_state = _switch_state(hass, scope_kind, scope_id)
    if switch_state == "off":
        _LOGGER.info(
            "ambience: scope=%s/%s switch is off; skipping apply_scene",
            scope_kind,
            scope_id,
        )
        return

    # Snapshot once, then apply every group's winner concurrently (groups are
    # independent by construction).
    active = tracing_active()
    snapshots = await _snapshot_all(hass)
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = _scope_config(store, scope_kind, scope_id)

    # Mirrors trigger_engine._resolve_and_apply but deliberately simpler: the
    # manual path always executes matched groups (no switch-off/no-op/last-applied
    # gating), so the two are intentionally not unified.
    async def _apply_group(group_id: str) -> UnitTrace | None:
        plan = await async_resolve_with_snapshots(
            hass, scope_kind, scope_id, snapshots, group=group_id, explain=active
        )
        explanation = plan.get("explanation")
        if plan["matched_rule_index"] is None:
            _LOGGER.info(
                "ambience: no rule matched for scope=%s/%s group=%s snapshots=%s",
                scope_kind,
                scope_id,
                group_id,
                plan["snapshots_described"],
            )
            if active:
                return UnitTrace(
                    scope_kind, scope_id, group_id, switch_state, Outcome.NO_MATCH, explanation
                )
            return None
        await async_execute_plan(hass, scope_kind, scope_id, plan, group_id)
        if active:
            return UnitTrace(
                scope_kind,
                scope_id,
                group_id,
                switch_state,
                Outcome.ACTED,
                explanation,
                winner_name=plan["rule_name"],
                actions=plan["actions"],
            )
        return None

    results = await asyncio.gather(
        *(_apply_group(gid) for gid in group_ids(cfg)),
        return_exceptions=True,
    )
    traces: list[UnitTrace] = []
    for res in results:
        if isinstance(res, BaseException):
            _LOGGER.warning("ambience: group apply failed: %s", res)
        elif res is not None:
            traces.append(res)
    if traces:
        emit_trace(hass, TraceEvent(TriggerCause(kind=CauseKind.MANUAL), traces))


def _compose_apply_message(
    *,
    reapplied: bool,
    rule_name: str | None,
    rule_index: int,
    scope_label: str,
    group_label: str | None,
    group_count: int,
) -> str:
    """Compose the logbook message for an apply.

    Names the matched rule ("scene") and scope. Appends the group name only when
    more than one group exists and a label is known (an unknown group id yields
    no suffix). Unnamed rules fall back to "rule <N>" (1-based).
    """
    verb = "re-applied" if reapplied else "applied"
    scene = rule_name or f"rule {rule_index + 1}"
    message = f"{verb} '{scene}' in {scope_label}"
    if group_count > 1 and group_label:
        message += f" ({group_label})"
    return message


def _scope_label(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Human label for a scope: area/floor name, or 'Global' for house.

    Falls back to the raw scope_id when the registry entry is missing (e.g. in
    tests or for a deleted area/floor)."""
    if scope_kind == "house":
        return "Global"
    if scope_kind == "floor":
        floor = fr.async_get(hass).async_get_floor(scope_id)
        return floor.name if floor is not None else (scope_id or "floor")
    area = ar.async_get(hass).async_get_area(scope_id)
    return area.name if area is not None else (scope_id or "area")


def _group_label(hass: HomeAssistant, group_id: str) -> str | None:
    """The configured display name for a group id, or None if unknown."""
    store = hass.data[DOMAIN][DATA_STORE]
    for group in store.groups():
        if group.get("id") == group_id:
            return group.get("name")
    return None


def _log_apply(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    group_id: str,
    rule_name: str | None,
    rule_index: int,
    *,
    reapplied: bool,
) -> Context:
    """Fire an "Ambience" logbook entry for an apply and return a fresh Context.

    Callers MUST pass the returned Context to async_execute_actions so the
    resulting device state changes share it and trace back to this entry in the
    logbook. Imported lazily so service.py does not depend on logbook at import
    time; the entry is a harmless no-op if the logbook integration is unloaded.
    """
    from homeassistant.components.logbook import async_log_entry

    store = hass.data[DOMAIN][DATA_STORE]
    message = _compose_apply_message(
        reapplied=reapplied,
        rule_name=rule_name,
        rule_index=rule_index,
        scope_label=_scope_label(hass, scope_kind, scope_id),
        group_label=_group_label(hass, group_id),
        group_count=len(store.groups()),
    )
    context = Context()
    async_log_entry(hass, "Ambience", message, domain=DOMAIN, context=context)
    return context


async def async_execute_actions(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    actions: list[dict[str, Any]],
    rule_index: int | None = None,
    context: Context | None = None,
) -> None:
    """Dispatch a list of action specs.

    Malformed / unexposed actions are logged and skipped; a raised action is
    logged but does not abort the rest. Does NOT record last-applied — callers
    that represent a full apply do that themselves. `rule_index` is used only
    for log context.
    """
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    coros: list = []
    for action_spec in actions:
        service_id = action_spec.get("service")
        if not service_id or "." not in service_id:
            _LOGGER.warning(
                "ambience: rule %s in scope=%s/%s has malformed action %r; skipping",
                rule_index,
                scope_kind,
                scope_id,
                action_spec,
            )
            continue
        exposed = exposed_store.get(service_id)
        if exposed is None:
            _LOGGER.warning(
                "ambience: service %r not exposed; skipping (rule %s, scope=%s/%s)",
                service_id,
                rule_index,
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


async def async_execute_plan(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    plan: dict[str, Any],
    group_id: str,
) -> None:
    """Dispatch a resolved plan's actions and record it as last-applied.

    The caller must have already gated on the switch and confirmed a non-None
    `matched_rule_index`. Malformed / unexposed actions are logged and skipped;
    a raised action is logged but does not abort the rest. `last_applied` is
    keyed per (scope_kind, scope_id, group_id); group_id is always a real group.
    """
    index = plan["matched_rule_index"]
    actions = plan["actions"]
    context = (
        _log_apply(hass, scope_kind, scope_id, group_id, plan["rule_name"], index, reapplied=False)
        if actions
        else None
    )
    await async_execute_actions(
        hass, scope_kind, scope_id, actions, rule_index=index, context=context
    )
    domain_data = hass.data[DOMAIN]
    domain_data.setdefault(DATA_LAST_APPLIED, {})[(scope_kind, scope_id, group_id)] = index


def get_last_applied(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, group_id: str
) -> int | None:
    """The rule index last applied to this (scope, group), or None if never applied."""
    return hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).get((scope_kind, scope_id, group_id))


def clear_last_applied(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> None:
    """Drop all last-applied entries for a scope (every group), e.g. on delete."""
    la = hass.data[DOMAIN].get(DATA_LAST_APPLIED, {})
    for key in [k for k in la if k[0] == scope_kind and k[1] == scope_id]:
        la.pop(key, None)


def scope_reapply_intervals(cfg: dict[str, Any], exposed_store: Any) -> list[int]:
    """Distinct, sorted effective re-apply intervals (seconds) across a scope's
    rule actions. Empty when no action re-applies."""
    intervals: set[int] = set()
    for rule in cfg.get("rules", []):
        for action in rule.get("actions", []):
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
