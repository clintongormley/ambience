"""What-if rule simulator: synthesize a hypothetical world and resolve it.

A `SimulatedWorld` (a `now` plus per-entity full-state overrides) is turned into
the `{matcher_name: snapshot}` dict the engine consumes, so `evaluate_explained`
runs unchanged against a world the user described instead of the live one.
Read-only: nothing here writes to Home Assistant.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.const import STATE_UNKNOWN
from homeassistant.core import HomeAssistant, State

from .const import DATA_MATCHERS, DOMAIN
from .sun_position import synthetic_sun_state

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class SimulatedWorld:
    """The hypothetical world to resolve against.

    `overrides` maps entity_id -> {"state": str, "attributes": {name: value}};
    `attributes` is optional and merged over the entity's live attributes.
    """

    now: datetime
    overrides: dict[str, dict[str, Any]] = field(default_factory=dict)


class _SimulatedStates:
    """Read-only states view: overridden states win, else the live state."""

    def __init__(self, real: Any, overrides: dict[str, State]) -> None:
        self._real = real
        self._overrides = overrides

    def get(self, entity_id: str) -> State | None:
        return self._overrides.get(entity_id) or self._real.get(entity_id)

    def async_all(self, domain: Any = None) -> list[State]:
        merged: dict[str, State] = {s.entity_id: s for s in self._real.async_all(domain)}
        for entity_id, state in self._overrides.items():
            if _in_domain(entity_id, domain):
                merged[entity_id] = state
        return list(merged.values())


def _in_domain(entity_id: str, domain: Any) -> bool:
    if domain is None:
        return True
    prefix = entity_id.split(".", 1)[0]
    if isinstance(domain, str):
        return prefix == domain
    # HA also accepts an iterable of domains.
    return prefix in set(domain)


class _SimulatedHass:
    """Wraps the real hass, replacing only `.states`; everything else delegates."""

    def __init__(self, real: HomeAssistant, states: _SimulatedStates) -> None:
        self._real = real
        self.states = states

    def __getattr__(self, name: str) -> Any:
        return getattr(self._real, name)


def _build_override_states(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, State]:
    """Materialise overrides as State objects (attributes merged over live), and
    inject a synthetic sun.sun unless the user overrode it explicitly."""
    overrides: dict[str, State] = {}
    for entity_id, spec in world.overrides.items():
        live = hass.states.get(entity_id)
        attributes = dict(live.attributes) if live is not None else {}
        attributes.update(spec.get("attributes") or {})
        fallback = live.state if live is not None else STATE_UNKNOWN
        overrides[entity_id] = State(entity_id, spec.get("state", fallback), attributes)
    if "sun.sun" not in overrides:
        overrides["sun.sun"] = synthetic_sun_state(hass, world.now)
    return overrides


async def build_simulated_snapshots(hass: HomeAssistant, world: SimulatedWorld) -> dict[str, Any]:
    """Snapshot every registered matcher against the simulated world.

    Returns {matcher_name: snapshot}; a matcher whose snapshot raises degrades
    to None (same policy as the live `_snapshot_all`)."""
    matchers: dict[str, Any] = hass.data[DOMAIN][DATA_MATCHERS]
    overlay = _SimulatedHass(
        hass,
        _SimulatedStates(hass.states, _build_override_states(hass, world)),
    )
    results = await asyncio.gather(
        *[m.snapshot(overlay, now=world.now) for m in matchers.values()],
        return_exceptions=True,
    )
    snapshots: dict[str, Any] = {}
    for name, result in zip(matchers.keys(), results, strict=True):
        if isinstance(result, BaseException):
            _LOGGER.warning("ambience: simulated snapshot for %r failed: %s", name, result)
            snapshots[name] = None
        else:
            snapshots[name] = result
    return snapshots
