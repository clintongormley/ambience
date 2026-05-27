"""ambience.apply_scene service handler."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError

from .const import DATA_ACTIONS, DATA_MATCHERS, DATA_STORE, DOMAIN
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


async def async_resolve_only(
    hass: HomeAssistant,
    scope_kind: str,
    scope_id: str | None,
    scene: str | None = None,
) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Returns: {matched_rule_index, rule_name, actions, snapshots_described}.
    If no rule matched, matched_rule_index/rule_name are None and actions=[].

    `scope_kind` is one of "area", "floor", "house". For "house", scope_id is
    None.
    `scene` is optional. When omitted, the scene matcher is excluded from the
    resolve — scene predicates on rules are stripped (treated as wildcards).
    """
    store = hass.data[DOMAIN][DATA_STORE]
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]

    scope_cfg = _scope_config(store, scope_kind, scope_id)

    # Snapshot every matcher whose snapshot can be derived from `hass`.
    # `scene`'s snapshot is injected from the service call below, so we
    # skip it here (its `.snapshot()` is a no-op anyway).
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

    if scene is not None:
        # Scene supplied → include the scene matcher and inject the snapshot.
        engine_matchers = dict(matchers_registry)
        snapshots["scene"] = scene
    else:
        # Scene omitted → exclude scene matcher; the active_keys filter below
        # then strips `when.scene` predicates from each rule, so they no longer
        # constrain matching.
        engine_matchers = {k: v for k, v in matchers_registry.items() if k != "scene"}

    described = {
        name: engine_matchers[name].describe(snap) if snap is not None else None
        for name, snap in snapshots.items()
        if name in engine_matchers
    }

    # Predicates for matchers absent from `engine_matchers` are dormant:
    # drop them from each rule's `when` before resolving so they're ignored
    # rather than failing the rule. Storage is untouched.
    active_keys = set(engine_matchers)
    rules = [
        {**rule, "when": {k: v for k, v in rule.get("when", {}).items() if k in active_keys}}
        for rule in scope_cfg.get("rules", [])
    ]
    match = resolve(rules, snapshots, engine_matchers)
    if match is None:
        return {
            "matched_rule_index": None,
            "rule_name": None,
            "actions": [],
            "snapshots_described": described,
        }
    idx, rule = match
    return {
        "matched_rule_index": idx,
        "rule_name": rule.get("name"),
        "actions": rule.get("actions", []),
        "snapshots_described": described,
    }


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
    actions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_ACTIONS]

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

    coros = []
    for action_spec in plan["actions"]:
        action_name = action_spec.get("action")
        action = actions_registry.get(action_name)
        if action is None:
            _LOGGER.warning(
                "ambience: unknown action %r in rule %d (scope=%s/%s); skipping",
                action_name,
                plan["matched_rule_index"],
                scope_kind,
                scope_id,
            )
            continue
        entity_ids = action_spec.get("entity_ids", [])
        params = action_spec.get("params", {})
        script = action_spec.get("script")
        coros.append(action.execute(hass, entity_ids, params, script=script))
    results = await asyncio.gather(*coros, return_exceptions=True)
    for result in results:
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: action raised: %s", result)
