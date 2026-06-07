"""Built-in `sun` condition — solar elevation + azimuth angular-position predicate."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant

from ..triggers import EMPTY, TriggerSpec
from ._common import UNAVAILABLE, as_float, merge_intervals

# 8-point compass sectors as 45°-wide (from, to) arcs; from > to wraps past 360.
SECTORS: dict[str, tuple[float, float]] = {
    "N": (337.5, 22.5),
    "NE": (22.5, 67.5),
    "E": (67.5, 112.5),
    "SE": (112.5, 157.5),
    "S": (157.5, 202.5),
    "SW": (202.5, 247.5),
    "W": (247.5, 292.5),
    "NW": (292.5, 337.5),
}


@dataclass(frozen=True)
class SunSnapshot:
    """The sun's current angular position."""

    elevation: float | None
    azimuth: float | None


class SunCondition:
    name = "sun"
    description = "Matches the sun's angular position — elevation and compass azimuth."
    predicate_help = (
        "Object {elevation: {min, max}, azimuth: {sectors: [...], ranges: [{from, to}]}}. "
        "Elevation in degrees [-90, 90]; either bound optional. Azimuth matches any selected "
        "8-point compass sector (N, NE, E, SE, S, SW, W, NW) or custom circular range "
        "(from > to wraps past 360). At least one of elevation/azimuth is required."
    )
    input = "sun_predicate"
    priority = 750

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not entity-driven
    ) -> SunSnapshot:
        state = hass.states.get("sun.sun")
        if state is None or state.state in UNAVAILABLE:
            return SunSnapshot(elevation=None, azimuth=None)
        return SunSnapshot(
            elevation=as_float(state.attributes.get("elevation")),
            azimuth=as_float(state.attributes.get("azimuth")),
        )

    def matches(self, predicate: Any, snapshot: SunSnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        if "elevation" in predicate and not self._elevation_ok(
            predicate["elevation"], snapshot.elevation
        ):
            return False
        return "azimuth" not in predicate or self._azimuth_ok(
            predicate["azimuth"], snapshot.azimuth
        )

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        # The sun's elevation/azimuth live on sun.sun and vary continuously,
        # so there is no discrete boundary to schedule — we watch sun.sun
        # itself. sun.sun rewrites its attributes ~every minute; the engine's
        # two-tier gating (re-resolve only when a predicate's boolean flips)
        # absorbs those ticks so scripts/templates aren't re-run needlessly.
        if not isinstance(predicate, dict):
            return EMPTY
        if "elevation" not in predicate and "azimuth" not in predicate:
            return EMPTY
        return TriggerSpec(entities=frozenset({"sun.sun"}))

    def contains(self, outer: Any, inner: Any) -> bool:
        return self._elevation_contains(
            _elevation_interval(outer), _elevation_interval(inner)
        ) and self._azimuth_contains(outer, inner)

    @staticmethod
    def _elevation_contains(outer: tuple[float, float], inner: tuple[float, float]) -> bool:
        return outer[0] <= inner[0] and inner[1] <= outer[1]

    @staticmethod
    def _azimuth_contains(outer: Any, inner: Any) -> bool:
        outer_intervals = merge_intervals(_azimuth_intervals(outer))
        inner_intervals = _azimuth_intervals(inner)
        return all(
            any(o0 <= i0 and i1 <= o1 for o0, o1 in outer_intervals) for i0, i1 in inner_intervals
        )

    def order_key(self, predicate: Any) -> float:
        elevation = predicate.get("elevation") if isinstance(predicate, dict) else None
        if isinstance(elevation, dict):
            lo = elevation.get("min")
            if isinstance(lo, (int, float)) and not isinstance(lo, bool):
                return float(lo)
        return float("-inf")

    def describe(self, snapshot: SunSnapshot, predicate: Any = None) -> str | None:
        if snapshot.elevation is None and snapshot.azimuth is None:
            return None
        parts: list[str] = []
        if snapshot.elevation is not None:
            parts.append(f"{round(snapshot.elevation)}° elevation")
        if snapshot.azimuth is not None:
            label = _sector_label(snapshot.azimuth)
            parts.append(f"{round(snapshot.azimuth)}° azimuth ({label})")
        return "Sun " + ", ".join(parts)

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"sun predicate must be an object or null: {predicate!r}")
        if "elevation" not in predicate and "azimuth" not in predicate:
            raise ValueError("sun predicate must define elevation and/or azimuth")
        if "elevation" in predicate:
            self._validate_elevation(predicate["elevation"])
        if "azimuth" in predicate:
            self._validate_azimuth(predicate["azimuth"])

    @staticmethod
    def _validate_elevation(constraint: Any) -> None:
        if not isinstance(constraint, dict):
            raise ValueError(f"sun elevation must be an object: {constraint!r}")
        lo = constraint.get("min")
        hi = constraint.get("max")
        if lo is None and hi is None:
            raise ValueError("sun elevation requires min and/or max")
        for bound in (lo, hi):
            if bound is None:
                continue
            if not isinstance(bound, (int, float)) or isinstance(bound, bool):
                raise ValueError(f"sun elevation bound must be a number: {bound!r}")
            if not -90 <= bound <= 90:
                raise ValueError(f"sun elevation out of range [-90, 90]: {bound!r}")
        if lo is not None and hi is not None and lo > hi:
            raise ValueError(f"sun elevation min > max: {lo!r} > {hi!r}")

    @staticmethod
    def _validate_azimuth(constraint: Any) -> None:
        if not isinstance(constraint, dict):
            raise ValueError(f"sun azimuth must be an object: {constraint!r}")
        sectors = constraint.get("sectors") or []
        ranges = constraint.get("ranges") or []
        if not sectors and not ranges:
            raise ValueError("sun azimuth requires sectors and/or ranges")
        if not isinstance(sectors, list):
            raise ValueError("sun azimuth sectors must be a list")
        if not isinstance(ranges, list):
            raise ValueError("sun azimuth ranges must be a list")
        for label in sectors:
            if label not in SECTORS:
                raise ValueError(f"unknown sun azimuth sector: {label!r}")
        for rng in ranges:
            if not isinstance(rng, dict):
                raise ValueError(f"sun azimuth range must be an object: {rng!r}")
            for key in ("from", "to"):
                val = rng.get(key)
                if not isinstance(val, (int, float)) or isinstance(val, bool):
                    raise ValueError(f"sun azimuth range {key} must be a number: {val!r}")
                if not 0 <= val < 360:
                    raise ValueError(f"sun azimuth {key} out of range [0, 360): {val!r}")

    @staticmethod
    def _elevation_ok(constraint: Any, elevation: float | None) -> bool:
        if elevation is None or not isinstance(constraint, dict):
            return False
        lo = as_float(constraint.get("min"))
        hi = as_float(constraint.get("max"))
        if lo is not None and elevation < lo:
            return False
        return hi is None or elevation <= hi

    @staticmethod
    def _azimuth_ok(constraint: Any, azimuth: float | None) -> bool:
        if azimuth is None or not isinstance(constraint, dict):
            return False
        for label in constraint.get("sectors") or []:
            arc = SECTORS.get(label)
            if arc is not None and _in_arc(azimuth, *arc):
                return True
        for rng in constraint.get("ranges") or []:
            if isinstance(rng, dict) and _in_arc(azimuth, rng.get("from"), rng.get("to")):
                return True
        return False


def _in_arc(value: float, lo: Any, hi: Any) -> bool:
    """Half-open circular containment [lo, hi); lo > hi wraps past 360."""
    if not isinstance(lo, (int, float)) or not isinstance(hi, (int, float)):
        return False
    if lo <= hi:
        return lo <= value < hi
    return value >= lo or value < hi


def _elevation_interval(predicate: Any) -> tuple[float, float]:
    """Closed elevation interval, with ±inf where a bound is absent."""
    constraint = predicate.get("elevation") if isinstance(predicate, dict) else None
    if not isinstance(constraint, dict):
        return (float("-inf"), float("inf"))
    lo = constraint.get("min")
    hi = constraint.get("max")
    lo_f = float(lo) if isinstance(lo, (int, float)) and not isinstance(lo, bool) else float("-inf")
    hi_f = float(hi) if isinstance(hi, (int, float)) and not isinstance(hi, bool) else float("inf")
    return (lo_f, hi_f)


def _azimuth_intervals(predicate: Any) -> list[tuple[float, float]]:
    """Azimuth constraint flattened to linear [0, 360) intervals (wraps split).

    An absent azimuth constraint is the full circle.
    """
    constraint = predicate.get("azimuth") if isinstance(predicate, dict) else None
    if not isinstance(constraint, dict):
        return [(0.0, 360.0)]
    arcs: list[tuple[float, float]] = []
    for label in constraint.get("sectors") or []:
        arc = SECTORS.get(label)
        if arc is not None:
            arcs.append(arc)
    for rng in constraint.get("ranges") or []:
        if isinstance(rng, dict):
            lo, hi = rng.get("from"), rng.get("to")
            if isinstance(lo, (int, float)) and isinstance(hi, (int, float)):
                arcs.append((float(lo), float(hi)))
    intervals: list[tuple[float, float]] = []
    for lo, hi in arcs:
        if lo <= hi:
            intervals.append((lo, hi))
        else:
            intervals.append((lo, 360.0))
            intervals.append((0.0, hi))
    return intervals


def _sector_label(azimuth: float) -> str:
    for label, arc in SECTORS.items():
        if _in_arc(azimuth, *arc):
            return label
    return "N"
