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


async def async_resolve_only(hass: HomeAssistant, area_id: str, scene: str) -> dict[str, Any]:
    """Like apply_scene, but does not execute actions.

    Returns: {matched_rule_index, rule_name, actions, snapshots_described}.
    If no rule matched, matched_rule_index/rule_name are None and actions=[].
    """
    store = hass.data[DOMAIN][DATA_STORE]
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]

    area = store.get_area(area_id)
    if area is None:
        raise ServiceValidationError(f"unknown_area: {area_id!r}")

    active_matcher_names = list(area.get("matchers", []))
    active_matchers = {
        name: matchers_registry[name] for name in active_matcher_names if name in matchers_registry
    }
    snapshot_results = await asyncio.gather(
        *[m.snapshot(hass) for m in active_matchers.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(active_matchers.keys(), snapshot_results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: matcher %r snapshot failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result

    # `scene` is an always-on matcher; its snapshot is the activating scene,
    # injected here rather than captured from hass.
    # Copy so we can add `scene` without mutating active_matchers.
    engine_matchers = dict(active_matchers)
    scene_matcher = matchers_registry.get("scene")
    if scene_matcher is not None:
        engine_matchers["scene"] = scene_matcher
    snapshots["scene"] = scene

    described = {
        name: engine_matchers[name].describe(snap) if snap is not None else None
        for name, snap in snapshots.items()
        if name in engine_matchers
    }

    rules = area.get("rules", [])
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


async def async_apply_scene(hass: HomeAssistant, area_id: str, scene: str) -> None:
    """Apply a scene in an area according to configured rules."""
    actions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_ACTIONS]

    plan = await async_resolve_only(hass, area_id, scene)
    if plan["matched_rule_index"] is None:
        _LOGGER.info(
            "ambience: no rule matched for area=%s scene=%s snapshots=%s",
            area_id,
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
                "ambience: unknown action %r in rule %d (area=%s); skipping",
                action_name,
                plan["matched_rule_index"],
                area_id,
            )
            continue
        targets = action_spec.get("targets", {})
        coros.append(action.execute(hass, targets))
    results = await asyncio.gather(*coros, return_exceptions=True)
    for result in results:
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: action raised: %s", result)
