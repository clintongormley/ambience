"""LuxCondition — ambient illuminance sensors against named or inline bands.

Predicate (scoped quantifier, sensor-backed like occupancy, named ranges like
time_of_day):
  {sensors: [sensor.*]? (empty/absent = match-anything),
   range: str  (a named lux range)         # XOR the inline band below
   min?: int, max?: int,                    # inline half-open band [min, max)
   quant: 'any'|'all' (default 'any')}
None = vacuous true (no constraint).

Sits low in the priority order (775): ambient light is an environmental signal,
unlike a `state` numeric condition (950) which would otherwise dominate.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant

from ..lux_ranges import validate_int_bound
from ..triggers import TriggerSpec
from ._common import as_float

_QUANTS = ("any", "all")


@dataclass(frozen=True)
class LuxSnapshot:
    """Frozen view of illuminance sensor values at tick time."""

    # entity_id -> lux value (float), or None when unobservable.
    sensors: dict[str, float | None]
    names: dict[str, str] = field(default_factory=dict)


class LuxCondition:
    """Match whether the chosen illuminance sensors fall in a lux band."""

    name = "lux"
    description = "Matches whether ambient light sensors fall in a lux range."
    predicate_help = (
        "{sensors: [sensor.*] (empty = match-anything), range: str (a named lux "
        "range) | min?: int, max?: int (inline band [min,max)), "
        "quant: 'any'|'all'}. None = match-anything."
    )
    input = "lux"
    # Environmental band: above weather (700) / sun (750), below time_of_day
    # (800) and far below state (950) so a lux rule never dominates the way a
    # numeric state condition would.
    priority = 775

    def __init__(
        self,
        hass: HomeAssistant | None = None,
        range_lookup: Callable[[], dict[str, dict[str, Any]]] | None = None,
    ) -> None:
        self._hass = hass
        self._range_lookup = range_lookup or (lambda: {})

    async def snapshot(self, hass: HomeAssistant, *, now: Any | None = None) -> LuxSnapshot:
        sensors: dict[str, float | None] = {}
        names: dict[str, str] = {}
        for s in hass.states.async_all("sensor"):
            if s.attributes.get("device_class") != "illuminance":
                continue
            sensors[s.entity_id] = as_float_state(s.state)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        return LuxSnapshot(sensors=sensors, names=names)

    def matches(self, predicate: Any, snapshot: LuxSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        sensors = predicate.get("sensors") or []
        if not sensors:
            return True  # no constraint
        lo, hi = self._resolve_range(predicate)
        quant = predicate.get("quant") or "any"

        def holds(eid: str) -> bool:
            val = snapshot.sensors.get(eid)
            if val is None:
                return False  # unobservable
            if lo is not None and val < lo:
                return False
            return not (hi is not None and val >= hi)

        if quant == "all":
            return all(holds(e) for e in sensors)
        return any(holds(e) for e in sensors)

    def _resolve_range(self, predicate: Any) -> tuple[float | None, float | None]:
        """Return the (min, max) band, resolving a named range via the lookup.

        Either bound may be None (open). Raises ValueError for an unknown id."""
        if "range" in predicate:
            rid = predicate["range"]
            ranges = self._range_lookup()
            if rid not in ranges:
                raise ValueError(f"unknown lux range: {rid!r}")
            defn = ranges[rid]
            return as_float(defn.get("min")), as_float(defn.get("max"))
        return as_float(predicate.get("min")), as_float(predicate.get("max"))

    def describe(self, snapshot: LuxSnapshot) -> str | None:
        if not snapshot.sensors:
            return "no lux sensors"
        readings = sorted(
            f"{snapshot.names.get(eid, eid)} {_fmt_lux(val)} lx"
            for eid, val in snapshot.sensors.items()
            if val is not None
        )
        return ", ".join(readings) if readings else "no lux readings"

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError("lux predicate must be a dict")
        sensors = predicate.get("sensors")
        if sensors is not None:
            if not isinstance(sensors, list):
                raise ValueError("`sensors` must be a list of sensor.* ids")
            for e in sensors:
                if not isinstance(e, str) or not e.startswith("sensor."):
                    raise ValueError(f"`sensors` entries must be sensor.* ids, got {e!r}")
        has_inline = predicate.get("min") is not None or predicate.get("max") is not None
        if "range" in predicate:
            if not isinstance(predicate["range"], str):
                raise ValueError(f"`range` must be a string, got {predicate['range']!r}")
            if has_inline:
                raise ValueError("specify `range` or `min`/`max`, not both")
        else:
            validate_int_bound(predicate.get("min"), "min")
            validate_int_bound(predicate.get("max"), "max")
            lo, hi = predicate.get("min"), predicate.get("max")
            if lo is not None and hi is not None and lo >= hi:
                raise ValueError(f"`min` must be < `max`: {lo!r} >= {hi!r}")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise ValueError(f"`quant` must be one of {_QUANTS}, got {quant!r}")

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return TriggerSpec()
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        return TriggerSpec(entities=frozenset(sensors))

    # --- sorting (containment lattice) ----------------------------------

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`.
        Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        # Empty/absent `sensors` is a wildcard (matches every world-state).
        if not outer.get("sensors"):
            return True
        if not inner.get("sensors"):
            return False
        if (outer.get("quant") or "any") != (inner.get("quant") or "any"):
            return False
        try:
            o_lo, o_hi = self._resolve_range(outer)
            i_lo, i_hi = self._resolve_range(inner)
        except ValueError:
            return False  # unknown range id -> can't prove containment
        if not _band_within(i_lo, i_hi, o_lo, o_hi):
            return False
        so = frozenset(outer["sensors"])
        si = frozenset(inner["sensors"])
        if (outer.get("quant") or "any") == "any":
            return si <= so  # any over fewer sensors ⊆ any over more
        return so <= si  # all over more sensors ⊆ all over fewer


def as_float_state(state: str) -> float | None:
    """Coerce an entity state string to a lux float, or None if non-numeric."""
    try:
        return float(state)
    except (TypeError, ValueError):
        return None


def _band_within(
    i_lo: float | None, i_hi: float | None, o_lo: float | None, o_hi: float | None
) -> bool:
    """True if the inner band [i_lo, i_hi) ⊆ the outer band [o_lo, o_hi).
    None bounds are open (-inf / +inf)."""
    if o_lo is not None and (i_lo is None or i_lo < o_lo):
        return False
    return not (o_hi is not None and (i_hi is None or i_hi > o_hi))


def _fmt_lux(val: float) -> str:
    """Whole-number lux render: 320.0 -> '320', 12.5 -> '12.5'."""
    return str(int(val)) if val == int(val) else str(val)
