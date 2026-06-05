"""OccupancyCondition — presence/occupancy/motion binary_sensors are (not) active.

Predicate (scoped quantifier):
  {sensors: [binary_sensor.*]? (empty/absent = match-anything),
   occupied: bool? (default true; false = vacant),
   quant: 'any'|'all' (default 'any'),
   for?: {h,m,s}}
None = vacuous true (no constraint).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, dur_seconds, validate_for

_QUANTS = ("any", "all")


@dataclass(frozen=True)
class OccupancySnapshot:
    """Frozen view of binary_sensor state at tick time."""

    now: datetime
    # entity_id -> (state, last_changed). last_changed (not last_updated): a
    # presence sensor's `for` clock should reset on state transitions only.
    sensors: dict[str, tuple[str, datetime]]
    names: dict[str, str] = field(default_factory=dict)


class OccupancyCondition:
    """Match whether the chosen presence/occupancy sensors are active.

    Mirrors PeopleCondition's shape (quantifier + `for` + a `contains` lattice),
    over binary_sensor entities instead of persons.
    """

    name = "occupancy"
    description = "Matches whether presence/occupancy sensors are active."
    predicate_help = (
        "{sensors: [binary_sensor.*] (empty = match-anything), "
        "occupied: bool (default true), quant: 'any'|'all', for?: {h,m,s}}. "
        "None = match-anything."
    )
    input = "occupancy_predicate"
    # Below state (950) and people (925), above day (900): a live presence fact
    # is more specific than ambient time/weather, but an explicit device/state
    # rule should still win.
    priority = 915

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self, hass: HomeAssistant, *, now: datetime | None = None
    ) -> OccupancySnapshot:
        sensors: dict[str, tuple[str, datetime]] = {}
        names: dict[str, str] = {}
        for s in hass.states.async_all("binary_sensor"):
            sensors[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        return OccupancySnapshot(now=now or dt_util.utcnow(), sensors=sensors, names=names)

    def matches(self, predicate: Any, snapshot: OccupancySnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        sensors = predicate.get("sensors") or []
        if not sensors:
            return True  # no constraint
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        seconds = dur_seconds(predicate.get("for"))

        def holds(eid: str) -> bool:
            cur = snapshot.sensors.get(eid)
            if cur is None:
                return False
            state, changed = cur
            if state in UNAVAILABLE:
                return False  # unobservable
            if (state == "on") is not want_on:
                return False
            return not (seconds > 0 and (snapshot.now - changed).total_seconds() < seconds)

        if quant == "all":
            return all(holds(e) for e in sensors)
        return any(holds(e) for e in sensors)

    def describe(self, snapshot: OccupancySnapshot) -> str | None:
        if not snapshot.sensors:
            return "no occupancy sensors"
        total = len(snapshot.sensors)
        active = sorted(
            snapshot.names.get(eid, eid)
            for eid, (state, _) in snapshot.sensors.items()
            if state == "on"
        )
        if active:
            return f"{len(active)} of {total} active ({', '.join(active)})"
        return f"0 of {total} active"

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError("occupancy predicate must be a dict")
        sensors = predicate.get("sensors")
        if sensors is not None:
            if not isinstance(sensors, list):
                raise ValueError("`sensors` must be a list of binary_sensor.* ids")
            for e in sensors:
                if not isinstance(e, str) or not e.startswith("binary_sensor."):
                    raise ValueError(f"`sensors` entries must be binary_sensor.* ids, got {e!r}")
        occupied = predicate.get("occupied")
        if occupied is not None and not isinstance(occupied, bool):
            raise ValueError(f"`occupied` must be a bool, got {occupied!r}")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise ValueError(f"`quant` must be one of {_QUANTS}, got {quant!r}")
        validate_for(predicate.get("for"))

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        seconds = dur_seconds(predicate.get("for"))
        durations = frozenset((e, seconds) for e in sensors) if seconds > 0 else frozenset()
        return TriggerSpec(entities=frozenset(sensors), entity_durations=durations)

    # --- sorting (containment lattice) ----------------------------------
    # No order_key: there is no meaningful total order among occupancy
    # predicates, so that linearisation slot falls back to "sorts last";
    # `contains` is this condition's only sort contribution.

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner's match-set ⊆ outer's). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        # Comparable only when polarity AND quant match: a different polarity or
        # quantifier is a different (non-nesting) match-set.
        if (outer.get("occupied", True) is not False) != (inner.get("occupied", True) is not False):
            return False
        if (outer.get("quant") or "any") != (inner.get("quant") or "any"):
            return False
        # inner must hold at least as long as outer (longer for = more specific).
        if dur_seconds(inner.get("for")) < dur_seconds(outer.get("for")):
            return False
        so = self._sensor_set(outer.get("sensors"))
        si = self._sensor_set(inner.get("sensors"))
        if (outer.get("quant") or "any") == "any":
            return self._subset(si, so)  # any over fewer sensors ⊆ any over more
        return self._subset(so, si)  # all over more sensors ⊆ all over fewer

    @staticmethod
    def _sensor_set(sensors: Any) -> frozenset[str] | None:
        """A sensor set, or None meaning ALL (the universe)."""
        if not sensors:
            return None
        return frozenset(sensors)

    @staticmethod
    def _subset(a: frozenset[str] | None, b: frozenset[str] | None) -> bool:
        """a ⊆ b, where None = ALL (the universe)."""
        if b is None:
            return True
        if a is None:
            return False
        return a <= b
