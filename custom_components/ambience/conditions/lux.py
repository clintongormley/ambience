"""LuxCondition — ambient illuminance sensors against named or inline bands.

Predicate (scoped quantifier, sensor-backed like occupancy, named ranges like
time_of_day):
  {sensors: [sensor.*]? (empty/absent = match-anything),
   range: str  (a named lux range)         # XOR the inline band below
   min?: int, max?: int,                    # inline half-open band [min, max)
   quant: 'any'|'all' (default 'any'),
   negate: bool? (default false; inverts the whole match)}
None = vacuous true (no constraint).

Sits low in the priority order (775): ambient light is an environmental signal,
unlike a `state` numeric condition (950) which would otherwise dominate.
"""

from __future__ import annotations

import math
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant

from ..lux_ranges import validate_int_bound
from ..triggers import TriggerSpec
from ._common import (
    as_float,
    kleene_all,
    kleene_any,
    kleene_not,
    predicate_has_any,
    sensor_quant_contains,
    state_sources,
    wrap_quantified,
)

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
        "quant: 'any'|'all', negate: bool (default false, inverts the whole "
        "match)}. None = match-anything."
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

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: Any | None = None,
        entities: frozenset[str] | None = None,
    ) -> LuxSnapshot:
        sensors: dict[str, float | None] = {}
        names: dict[str, str] = {}
        # `entities` (the sensors scenes actually reference) lets us read those
        # directly; None means scan the whole sensor domain (back-compat). The
        # device_class filter stays either way, so a referenced-but-non-lux
        # sensor is excluded exactly as a domain scan would exclude it.
        states = state_sources(hass, entities, domain="sensor")
        for s in states:
            if s is None:
                continue  # referenced entity that doesn't exist
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
        try:
            lo, hi = self._resolve_range(predicate)
        except ValueError:
            # A referenced named range was hidden/deleted: the predicate can't be
            # evaluated, so fail this scene rather than aborting the whole scope.
            return False
        quant = predicate.get("quant") or "any"
        # Keep per-sensor verdicts tri-state (None = unobservable) through the
        # quantifier and negate, so an unavailable sensor can never be inverted
        # into a spurious match — "is not dark" must not fire on `unavailable`.
        verdicts = (self._in_band(snapshot.sensors.get(e), lo, hi) for e in sensors)
        result = kleene_all(verdicts) if quant == "all" else kleene_any(verdicts)
        # `negate` wraps the whole match (band + quant). An unobservable result
        # (None) stays a miss even under negate.
        if predicate.get("negate"):
            result = kleene_not(result)
        return result is True

    @staticmethod
    def _in_band(val: float | None, lo: float | None, hi: float | None) -> bool | None:
        """Whether a reading falls in [lo, hi). None = unobservable (no reading,
        NaN/inf); lo/hi None means that end is open."""
        if val is None or not math.isfinite(val):
            return None
        if lo is not None and val < lo:
            return False
        return not (hi is not None and val >= hi)

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

    def unconfigured_reason(self, predicate: Any, snapshot: LuxSnapshot) -> str | None:
        if isinstance(predicate, dict) and "range" in predicate:
            rid = predicate["range"]
            if isinstance(rid, str) and rid not in self._range_lookup():
                return f"lux range {rid!r} no longer exists"
        return None

    def describe(self, snapshot: LuxSnapshot, predicate: Any = None) -> str | None:
        # No predicate: whole-snapshot summary (used by `snapshots_described`).
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        sensors = predicate.get("sensors") or []
        if not sensors:
            return "any sensor (no constraint)"  # wildcard — matches() is vacuously true
        try:
            lo, hi = self._resolve_range(predicate)
        except ValueError:
            return f"unknown lux range: {predicate.get('range')!r}"
        quant = predicate.get("quant") or "any"
        # Preserve the predicate's sensor order so the line maps to the config.
        parts: list[str] = []
        for eid in sensors:
            name = snapshot.names.get(eid, eid)
            if eid not in snapshot.sensors:
                parts.append(f"{name}: not found ✗")
                continue
            held = self._in_band(snapshot.sensors[eid], lo, hi)
            if held is None:
                parts.append(f"{name}: unavailable ✗")
                continue
            val = snapshot.sensors[eid]
            parts.append(f"{name}: {_fmt_lux(val)} lx {'✓' if held else '✗'}")
        body = wrap_quantified(parts, quant, bool(predicate.get("negate")))
        band = self._fmt_band(lo, hi)
        # A bare reading is meaningless without the target band, so state it once.
        return f"want {band}; {body}" if band else body

    @staticmethod
    def _fmt_band(lo: float | None, hi: float | None) -> str:
        if lo is not None and hi is not None:
            return f"{_fmt_lux(lo)}-{_fmt_lux(hi)} lx"
        if lo is not None:
            return f"≥{_fmt_lux(lo)} lx"
        if hi is not None:
            return f"<{_fmt_lux(hi)} lx"
        return ""

    def _describe_snapshot(self, snapshot: LuxSnapshot) -> str | None:
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
            rid = predicate["range"]
            if not isinstance(rid, str):
                raise ValueError(f"`range` must be a string, got {rid!r}")
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
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise ValueError(f"`negate` must be a bool, got {negate!r}")

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return TriggerSpec()
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        return TriggerSpec(entities=frozenset(sensors))

    # --- sorting (containment lattice) ----------------------------------

    def is_constraining(self, predicate: Any) -> bool:
        """Empty/absent `sensors` is match-anything (see matches()), so it is a
        wildcard for sorting, not a real constraint."""
        return predicate_has_any(predicate, "sensors")

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`.
        Conservative: unprovable -> False."""

        def _axis(o: dict[str, Any], i: dict[str, Any]) -> bool:
            try:
                o_lo, o_hi = self._resolve_range(o)
                i_lo, i_hi = self._resolve_range(i)
            except ValueError:
                return False  # unknown range id -> can't prove containment
            return _band_within(i_lo, i_hi, o_lo, o_hi)

        return sensor_quant_contains(outer, inner, _axis)


def as_float_state(state: str) -> float | None:
    """Coerce an entity state string to a finite lux float, else None.

    Non-finite values are treated as unobservable: ``float('nan')`` succeeds but
    NaN fails every band comparison (``nan < lo`` and ``nan >= hi`` are both
    False), which would otherwise make a NaN reading match *every* band."""
    try:
        value = float(state)
    except (TypeError, ValueError):
        return None
    return value if math.isfinite(value) else None


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
