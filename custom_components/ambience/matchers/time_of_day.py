"""Built-in time_of_day matcher — structured JSON predicate format."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_ANCHOR_ATTR = {
    "sunrise": "next_rising",
    "sunset": "next_setting",
    "noon": "next_noon",
    "midnight": "next_midnight",
    "dawn": "next_dawn",
    "dusk": "next_dusk",
}

_DAY = timedelta(hours=24)
_HALF_DAY = timedelta(hours=12)


@dataclass(frozen=True)
class TimeOfDaySnapshot:
    """Today's anchor times plus 'now', all tz-aware."""

    now: datetime
    sunrise: datetime
    sunset: datetime
    noon: datetime
    midnight: datetime
    dawn: datetime
    dusk: datetime


class TimeOfDayMatcher:
    """time_of_day matcher: named periods, absolute and sun-relative ranges,
    expressed as structured JSON predicates."""

    name = "time_of_day"
    description = "Matches based on the current time of day relative to sun events."
    predicate_help = (
        "Structured JSON predicate: {period: id} | {from, to} | [..., ...]. "
        "Endpoints are {kind: 'time', hh, mm} or {kind: 'sun', anchor, offset_min}."
    )
    toggleable = True
    input = "time_of_day"
    priority = 200

    def __init__(
        self,
        period_lookup: Callable[[], dict[str, dict[str, Any]]] | None = None,
    ) -> None:
        self._period_lookup = period_lookup or (lambda: {})

    async def snapshot(self, hass: HomeAssistant) -> TimeOfDaySnapshot:
        state = hass.states.get("sun.sun")
        if state is None:
            raise RuntimeError("sun.sun unavailable")
        anchors: dict[str, datetime] = {}
        for anchor, attr in _ANCHOR_ATTR.items():
            raw = state.attributes.get(attr)
            if raw is None:
                raise RuntimeError(f"sun.sun missing attribute {attr}")
            parsed = dt_util.parse_datetime(raw)
            if parsed is None:
                raise RuntimeError(f"sun.sun attribute {attr} unparseable: {raw!r}")
            anchors[anchor] = parsed
        return TimeOfDaySnapshot(
            now=dt_util.utcnow(),
            sunrise=anchors["sunrise"],
            sunset=anchors["sunset"],
            noon=anchors["noon"],
            midnight=anchors["midnight"],
            dawn=anchors["dawn"],
            dusk=anchors["dusk"],
        )

    def matches(self, predicate: Any, snapshot: TimeOfDaySnapshot) -> bool:
        if isinstance(predicate, list):
            return any(self._match_one(item, snapshot) for item in predicate)
        return self._match_one(predicate, snapshot)

    def _match_one(self, item: Any, snapshot: TimeOfDaySnapshot) -> bool:
        start, end = self._resolve_range(item, snapshot)
        return _in_range(snapshot.now, start, end)

    def _resolve_range(
        self, predicate: Any, snapshot: TimeOfDaySnapshot
    ) -> tuple[datetime, datetime]:
        if not isinstance(predicate, dict):
            raise ValueError(f"invalid time_of_day predicate: {predicate!r}")
        if "period" in predicate:
            pid = predicate["period"]
            if not isinstance(pid, str):
                raise ValueError(f"period id must be a string: {pid!r}")
            periods = self._period_lookup()
            if pid not in periods:
                raise ValueError(f"unknown time_of_day period: {pid!r}")
            defn = periods[pid]
            return (
                self._resolve_endpoint(defn["from"], snapshot),
                self._resolve_endpoint(defn["to"], snapshot),
            )
        if "from" in predicate and "to" in predicate:
            return (
                self._resolve_endpoint(predicate["from"], snapshot),
                self._resolve_endpoint(predicate["to"], snapshot),
            )
        raise ValueError(f"invalid time_of_day predicate: {predicate!r}")

    def _resolve_endpoint(self, ep: Any, snapshot: TimeOfDaySnapshot) -> datetime:
        if not isinstance(ep, dict):
            raise ValueError(f"invalid endpoint: {ep!r}")
        kind = ep.get("kind")
        if kind == "time":
            hh, mm = ep.get("hh"), ep.get("mm")
            if not isinstance(hh, int) or not 0 <= hh <= 23:
                raise ValueError(f"invalid hh: {hh!r}")
            if not isinstance(mm, int) or not 0 <= mm <= 59:
                raise ValueError(f"invalid mm: {mm!r}")
            # The absolute time the user entered is HA's local clock time; convert
            # snapshot.now (UTC) to local first so DST is honoured for the date.
            local_now = dt_util.as_local(snapshot.now)
            return local_now.replace(hour=hh, minute=mm, second=0, microsecond=0)
        if kind == "sun":
            anchor = ep.get("anchor")
            if anchor not in _ANCHOR_ATTR:
                raise ValueError(f"invalid anchor: {anchor!r}")
            offset = ep.get("offset_min", 0)
            if not isinstance(offset, int):
                raise ValueError(f"offset_min must be int: {offset!r}")
            anchor_dt: datetime = getattr(snapshot, anchor)
            if snapshot.now - anchor_dt > _HALF_DAY:
                anchor_dt += _DAY
            elif anchor_dt - snapshot.now > _HALF_DAY:
                anchor_dt -= _DAY
            return anchor_dt + timedelta(minutes=offset)
        raise ValueError(f"invalid endpoint kind: {kind!r}")

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            raise ValueError("predicate cannot be None")
        if isinstance(predicate, list):
            if not predicate:
                raise ValueError("time_of_day predicate list must not be empty")
            synthetic = _synthetic_snapshot()
            for item in predicate:
                self._match_one(item, synthetic)
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"invalid time_of_day predicate: {predicate!r}")
        self._match_one(predicate, _synthetic_snapshot())

    def describe(self, snapshot: TimeOfDaySnapshot) -> str | None:
        periods = self._period_lookup()
        for pid in periods:
            try:
                if self._match_one({"period": pid}, snapshot):
                    return pid
            except ValueError:
                continue
        return None

    def _intervals(self, predicate: Any) -> list[tuple[float, float]]:
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        result: list[tuple[float, float]] = []
        for item in items:
            start, end = self._resolve_range(item, snapshot)
            start_min = _minute_of_day(start)
            end_min = _minute_of_day(end)
            if end_min <= start_min:
                result.append((start_min, 1440.0))
                result.append((0.0, end_min))
            else:
                result.append((start_min, end_min))
        return result

    def contains(self, outer: Any, inner: Any) -> bool:
        outer_intervals = _merge_intervals(self._intervals(outer))
        inner_intervals = self._intervals(inner)
        return all(
            any(o_start <= i_start and i_end <= o_end for o_start, o_end in outer_intervals)
            for i_start, i_end in inner_intervals
        )

    def order_key(self, predicate: Any) -> float:
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        return min(_minute_of_day(self._resolve_range(item, snapshot)[0]) for item in items)


def _in_range(now: datetime, start: datetime, end: datetime) -> bool:
    if end <= start:
        return now >= start or now < end
    return start <= now < end


def _minute_of_day(value: datetime) -> float:
    return value.hour * 60 + value.minute + value.second / 60


def _merge_intervals(
    intervals: list[tuple[float, float]],
) -> list[tuple[float, float]]:
    if not intervals:
        return []
    ordered = sorted(intervals)
    merged = [ordered[0]]
    for start, end in ordered[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged


def _synthetic_snapshot() -> TimeOfDaySnapshot:
    base = datetime(2026, 1, 1, 12, 0, tzinfo=UTC)
    return TimeOfDaySnapshot(
        now=base,
        sunrise=base.replace(hour=6),
        sunset=base.replace(hour=18),
        noon=base.replace(hour=12),
        midnight=base.replace(hour=0),
        dawn=base.replace(hour=5, minute=30),
        dusk=base.replace(hour=18, minute=30),
    )
