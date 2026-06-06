"""OccupancyCondition — presence/occupancy/motion binary_sensors are (not) active.

Predicate (scoped quantifier):
  {sensors: [binary_sensor.*]? (empty/absent = match-anything),
   occupied: bool? (default true; false = vacant),
   quant: 'any'|'all' (default 'any'),
   for?: {h,m,s},
   negate: bool? (default false; inverts the whole match)}
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
        "occupied: bool (default true), quant: 'any'|'all', for?: {h,m,s}, "
        "negate: bool (default false, inverts the whole match)}. "
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
            return True  # no constraint — nothing to negate either
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
            result = all(holds(e) for e in sensors)
        else:
            result = any(holds(e) for e in sensors)
        # `negate` wraps the whole match (polarity + quant + `for`): "NOT
        # (vacant for >=20m)" is a different match-set from "occupied for >=20m".
        return not result if predicate.get("negate") else result

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
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise ValueError(f"`negate` must be a bool, got {negate!r}")
        validate_for(predicate.get("for"))

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        seconds = dur_seconds(predicate.get("for"))
        durations = frozenset((e, seconds) for e in sensors) if seconds > 0 else frozenset()
        return TriggerSpec(entities=frozenset(sensors), entity_durations=durations)

    def is_constraining(self, predicate: Any) -> bool:
        """Empty/absent `sensors` is match-anything (see matches()), so it is a
        wildcard for sorting, not a real constraint."""
        return isinstance(predicate, dict) and bool(predicate.get("sensors"))

    # --- sorting (containment lattice) ----------------------------------
    # No order_key: there is no meaningful total order among occupancy
    # predicates, so constrained scenes tie within this slot — but a scene that
    # constrains occupancy still sorts ahead of one that leaves it a wildcard
    # (the slot is ranked by this condition's high priority). `contains` is this
    # condition's only intra-slot sort contribution.

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner's match-set ⊆ outer's). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        # A negated predicate's match-set is a complement, which does not nest
        # under this (sensor-subset / polarity / quant / for) lattice. Be
        # conservative: unprovable -> False.
        if outer.get("negate") or inner.get("negate"):
            return False
        # Empty/absent `sensors` is a wildcard (matches every world-state, per
        # matches()), so its polarity/quant/for are irrelevant. A wildcard outer
        # contains everything; a wildcard inner is the universe, contained only
        # by another wildcard outer (handled above).
        if not outer.get("sensors"):
            return True
        if not inner.get("sensors"):
            return False
        # Both constrained: comparable only when polarity AND quant match (a
        # different polarity or quantifier is a different, non-nesting match-set).
        if (outer.get("occupied", True) is not False) != (inner.get("occupied", True) is not False):
            return False
        if (outer.get("quant") or "any") != (inner.get("quant") or "any"):
            return False
        # inner must hold at least as long as outer (longer for = more specific).
        if dur_seconds(inner.get("for")) < dur_seconds(outer.get("for")):
            return False
        so = frozenset(outer["sensors"])
        si = frozenset(inner["sensors"])
        if (outer.get("quant") or "any") == "any":
            return si <= so  # any over fewer sensors ⊆ any over more
        return so <= si  # all over more sensors ⊆ all over fewer
