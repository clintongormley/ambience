"""ambience.apply_scene service handler."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import (
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from .engine import resolve

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


def _switch_state(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> str:
    """Return the on/off state of the scope's own switch.

    Returns 'on', 'off', or 'unknown' (entity not yet registered).
    No cascade: each scope's switch gates only its own apply_scene calls.
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
    scene: str | None = None,
) -> dict[str, Any]:
    """Resolve a scope against a pre-built `{matcher_name: snapshot}` dict.

    Does NOT call any matcher's `snapshot()` — the caller supplies them (the
    engine passes its own cache). Returns {matched_rule_index, rule_name,
    actions, snapshots_described, switch_state}.
    `scene` is handled here: when supplied, the scene matcher is included and
    its snapshot injected; when None, scene is excluded and `when.scene`
    predicates are stripped (treated as wildcards).
    """
    store = hass.data[DOMAIN][DATA_STORE]
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    scope_cfg = _scope_config(store, scope_kind, scope_id)

    snapshots = dict(snapshots)  # don't mutate the caller's dict
    if scene is not None:
        engine_matchers = dict(matchers_registry)
        snapshots["scene"] = scene
    else:
        engine_matchers = {k: v for k, v in matchers_registry.items() if k != "scene"}

    described = {
        name: engine_matchers[name].describe(snap) if snap is not None else None
        for name, snap in snapshots.items()
        if name in engine_matchers
    }

    active_keys = set(engine_matchers)
    rules = [
        {**rule, "when": {k: v for k, v in rule.get("when", {}).items() if k in active_keys}}
        for rule in scope_cfg.get("rules", [])
    ]
    match = resolve(rules, snapshots, engine_matchers)
    switch_state = _switch_state(hass, scope_kind, scope_id)
    if match is None:
        return {
            "matched_rule_index": None,
            "rule_name": None,
            "actions": [],
            "snapshots_described": described,
            "switch_state": switch_state,
        }
    idx, rule = match
    return {
        "matched_rule_index": idx,
        "rule_name": rule.get("name"),
        "actions": rule.get("actions", []),
        "snapshots_described": described,
        "switch_state": switch_state,
    }


async def async_resolve_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene: str | None = None,
) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Snapshots every matcher fresh (except `scene`, whose snapshot is injected
    by `async_resolve_with_snapshots`), then delegates. Return shape:
    {matched_rule_index, rule_name, actions, snapshots_described, switch_state}.
    """
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    snapshottable = {name: m for name, m in matchers_registry.items() if name != "scene"}
    snapshot_results = await asyncio.gather(
        *[m.snapshot(hass) for m in snapshottable.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(snapshottable.keys(), snapshot_results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: matcher %r snapshot failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
    return await async_resolve_with_snapshots(hass, scope_kind, scope_id, snapshots, scene)


async def async_apply_scene(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene: str | None = None,
) -> None:
    """Apply a scene at the given scope according to configured rules.

    `scope_kind` is one of "area", "floor", "house". For "house", scope_id is
    None.
    `scene` is optional; when omitted, scene predicates on rules are treated
    as wildcards.
    """
    if _switch_state(hass, scope_kind, scope_id) == "off":
        _LOGGER.info(
            "ambience: scope=%s/%s switch is off; skipping apply_scene",
            scope_kind,
            scope_id,
        )
        return

    plan = await async_resolve_only(hass, scope_kind, scope_id, scene)
    if plan["matched_rule_index"] is None:
        _LOGGER.info(
            "ambience: no rule matched for scope=%s/%s scene=%s snapshots=%s",
            scope_kind,
            scope_id,
            scene,
            plan["snapshots_described"],
        )
        return

    await async_execute_plan(hass, scope_kind, scope_id, plan)


async def async_execute_plan(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    plan: dict[str, Any],
) -> None:
    """Dispatch a resolved plan's actions and record it as last-applied.

    The caller must have already gated on the switch and confirmed a non-None
    `matched_rule_index`. Malformed / unexposed actions are logged and skipped;
    a raised action is logged but does not abort the rest.
    """
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    coros: list = []
    for action_spec in plan["actions"]:
        service_id = action_spec.get("service")
        if not service_id or "." not in service_id:
            _LOGGER.warning(
                "ambience: rule %d in scope=%s/%s has malformed action %r; skipping",
                plan["matched_rule_index"],
                scope_kind,
                scope_id,
                action_spec,
            )
            continue
        exposed = exposed_store.get(service_id)
        if exposed is None:
            _LOGGER.warning(
                "ambience: service %r not exposed; skipping (rule %d, scope=%s/%s)",
                service_id,
                plan["matched_rule_index"],
                scope_kind,
                scope_id,
            )
            continue
        domain, name = service_id.split(".", 1)
        params = {**exposed.get("defaults", {}), **action_spec.get("params", {})}
        entity_ids = action_spec.get("entity_ids") or []
        target = {"entity_id": entity_ids} if entity_ids else None
        coros.append(hass.services.async_call(domain, name, params, target=target, blocking=True))

    results = await asyncio.gather(*coros, return_exceptions=True)
    for result in results:
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: action raised: %s", result)

    domain_data = hass.data[DOMAIN]
    domain_data.setdefault(DATA_LAST_APPLIED, {})[(scope_kind, scope_id)] = plan[
        "matched_rule_index"
    ]


def get_last_applied(hass: HomeAssistant, scope_kind: str, scope_id: str | None) -> int | None:
    """The rule index last applied to this scope, or None if never applied."""
    return hass.data[DOMAIN].get(DATA_LAST_APPLIED, {}).get((scope_kind, scope_id))
