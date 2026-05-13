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


async def async_apply_scene(hass: HomeAssistant, area_id: str, scene: str) -> None:
    """Apply a scene in an area according to configured rules."""
    store = hass.data[DOMAIN][DATA_STORE]
    matchers_registry: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    actions_registry: dict[str, Any] = hass.data[DOMAIN][DATA_ACTIONS]

    area = store.get_area(area_id)
    if area is None:
        raise ServiceValidationError(f"unknown_area: {area_id!r}")
    if scene not in area.get("scenes", []):
        raise ServiceValidationError(f"unknown_scene: {scene!r} not in area {area_id!r}")

    active_matcher_names: list[str] = list(area.get("matchers", []))
    active_matchers: dict[str, Any] = {
        name: matchers_registry[name] for name in active_matcher_names if name in matchers_registry
    }

    snapshot_results = await asyncio.gather(
        *[m.snapshot(hass) for m in active_matchers.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(active_matchers.keys(), snapshot_results, strict=True):
        if isinstance(result, Exception):
            _LOGGER.warning("ambience: matcher %r snapshot failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result

    rules: list[dict[str, Any]] = area.get("rules", [])
    match = resolve(rules, scene, snapshots, active_matchers)
    if match is None:
        described = {
            name: active_matchers[name].describe(snap) if snap is not None else None
            for name, snap in snapshots.items()
        }
        _LOGGER.info(
            "ambience: no rule matched for area=%s scene=%s snapshots=%s",
            area_id,
            scene,
            described,
        )
        return

    idx, rule = match
    coros = []
    for action_spec in rule.get("actions", []):
        action_name = action_spec.get("action")
        action = actions_registry.get(action_name)
        if action is None:
            _LOGGER.warning(
                "ambience: unknown action %r in rule %d (area=%s); skipping",
                action_name,
                idx,
                area_id,
            )
            continue
        targets = action_spec.get("targets", {})
        coros.append(action.execute(hass, targets))

    results = await asyncio.gather(*coros, return_exceptions=True)
    for result in results:
        if isinstance(result, Exception):
            _LOGGER.warning("ambience: action raised: %s", result)
