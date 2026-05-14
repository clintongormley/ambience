"""Built-in time_of_day matcher."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_ABS_RE = re.compile(r"^\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*$")
_HHMM_RE = re.compile(r"^\d{1,2}:\d{2}$")
_ANCHOR_RE = re.compile(r"^(sunrise|sunset|noon|midnight|dawn|dusk)(?:([+-])(\d+)([mh]))?$")

_NAMED_PERIODS: dict[str, tuple[str, str]] = {
    "midnight": ("midnight-1h", "midnight+1h"),
    "dawn": ("dawn-30m", "dawn+30m"),
    "sunrise": ("sunrise-30m", "sunrise+30m"),
    "morning": ("sunrise+30m", "noon-1h"),
    "noon": ("noon-1h", "noon+1h"),
    "afternoon": ("noon+1h", "sunset-30m"),
    "sunset": ("sunset-30m", "sunset+30m"),
    "evening": ("sunset", "dusk"),
    "dusk": ("dusk-30m", "dusk+30m"),
    "day": ("sunrise", "sunset"),
    "night": ("dusk", "dawn"),
}


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


# Map from anchor name to the sun.sun attribute holding the *next* occurrence.
_ANCHOR_ATTR = {
    "sunrise": "next_rising",
    "sunset": "next_setting",
    "noon": "next_noon",
    "midnight": "next_midnight",
    "dawn": "next_dawn",
    "dusk": "next_dusk",
}


class TimeOfDayMatcher:
    """time_of_day matcher: named periods, absolute and sun-relative ranges."""

    name = "time_of_day"
    description = "Matches based on the current time of day relative to sun events."
    predicate_help = (
        "Predicate forms:\n"
        "  - Named period: one of midnight, dawn, sunrise, morning, noon, afternoon,"
        " sunset, evening, dusk, day, night\n"
        "  - Absolute range: '16:00-18:30' (24h; wraps midnight if start > end)\n"
        "  - Sun-relative range: 'sunset-30m to 22:00' or 'sunrise to sunset+1h'"
        " (anchors: sunrise, sunset, noon, midnight, dawn, dusk)\n"
        "  - List: ['evening', '16:00-18:30'] matches if any element matches"
    )

    toggleable = True
    input = "text"
    priority = 100

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

    def matches(self, predicate, snapshot: TimeOfDaySnapshot) -> bool:  # noqa: ANN001
        if isinstance(predicate, list):
            return any(self._match_one(item, snapshot) for item in predicate)
        if isinstance(predicate, str):
            return self._match_one(predicate, snapshot)
        raise ValueError(f"invalid time_of_day predicate: {predicate!r}")

    def _resolve_range(self, text: str, snapshot: TimeOfDaySnapshot) -> tuple[datetime, datetime]:
        """Parse one predicate expression to (start, end) datetimes."""
        if not isinstance(text, str):
            raise ValueError(f"invalid time_of_day predicate item: {text!r}")
        text = text.strip()
        if text in _NAMED_PERIODS:
            start_expr, end_expr = _NAMED_PERIODS[text]
        elif " to " in text:
            start_expr, end_expr = text.split(" to ", 1)
        else:
            m = _ABS_RE.match(text)
            if not m:
                raise ValueError(f"invalid time_of_day predicate: {text!r}")
            start_expr, end_expr = m.group(1), m.group(2)
        return (
            self._resolve_endpoint(start_expr, snapshot),
            self._resolve_endpoint(end_expr, snapshot),
        )

    def _match_one(self, text: str, snapshot: TimeOfDaySnapshot) -> bool:
        start, end = self._resolve_range(text, snapshot)
        return _in_range(snapshot.now, start, end)

    def _intervals(self, predicate) -> list[tuple[float, float]]:  # noqa: ANN001
        """Resolve a predicate to a list of [start, end) minute intervals within
        [0, 1440), splitting any range that wraps midnight at 00:00."""
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        result: list[tuple[float, float]] = []
        for item in items:
            start, end = self._resolve_range(item, snapshot)
            start_min = _minute_of_day(start)
            end_min = _minute_of_day(end)
            if end_min <= start_min:  # wraps midnight (== means a full day)
                result.append((start_min, 1440.0))
                result.append((0.0, end_min))
            else:
                result.append((start_min, end_min))
        return result

    def contains(self, outer, inner) -> bool:  # noqa: ANN001
        """True iff every minute matched by `inner` is also matched by `outer`."""
        outer_intervals = _merge_intervals(self._intervals(outer))
        inner_intervals = self._intervals(inner)
        return all(
            any(o_start <= i_start and i_end <= o_end for o_start, o_end in outer_intervals)
            for i_start, i_end in inner_intervals
        )

    def order_key(self, predicate) -> float:  # noqa: ANN001
        """Earliest start-minute-of-day across the predicate's range(s)."""
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        return min(_minute_of_day(self._resolve_range(item, snapshot)[0]) for item in items)

    def _span_minutes(self, text: str, snapshot: TimeOfDaySnapshot) -> float:
        """Minutes covered by one predicate expression (wraps midnight)."""
        start, end = self._resolve_range(text, snapshot)
        delta = (end - start).total_seconds() / 60.0
        return delta + 1440.0 if delta <= 0 else delta

    def specificity(self, predicate) -> float:  # noqa: ANN001
        """Total minutes covered by the predicate, normalised to 0..1 (÷1440).

        Lower = narrower = more specific. A list sums its elements' spans
        (covering more time => less specific).
        """
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        total = sum(self._span_minutes(item, snapshot) for item in items)
        return min(total / 1440.0, 1.0)

    def _resolve_endpoint(self, expr: str, snapshot: TimeOfDaySnapshot) -> datetime:
        # Strip internal whitespace so "sunset - 30m" == "sunset-30m"
        expr = expr.strip().replace(" ", "")
        if _HHMM_RE.match(expr):
            hh, mm = map(int, expr.split(":"))
            return snapshot.now.replace(hour=hh, minute=mm, second=0, microsecond=0)
        m = _ANCHOR_RE.match(expr)
        if not m:
            raise ValueError(f"invalid endpoint: {expr!r}")
        anchor = m.group(1)
        offset_sign = m.group(2)
        offset_value = m.group(3)
        offset_unit = m.group(4)
        anchor_dt: datetime = getattr(snapshot, anchor)
        # Snap anchor to the nearest daily occurrence: if anchor is more than
        # 12 h in the past relative to now, advance it by one day so that ranges
        # like "midnight-1h to midnight+1h" work correctly when now ≈ 23:xx.
        _DAY = timedelta(hours=24)
        _HALF_DAY = timedelta(hours=12)
        if snapshot.now - anchor_dt > _HALF_DAY:
            anchor_dt += _DAY
        elif anchor_dt - snapshot.now > _HALF_DAY:
            anchor_dt -= _DAY
        if offset_value is None:
            return anchor_dt
        amount = int(offset_value)
        delta = timedelta(minutes=amount) if offset_unit == "m" else timedelta(hours=amount)
        if offset_sign == "-":
            delta = -delta
        return anchor_dt + delta

    def validate_predicate(self, predicate) -> None:  # noqa: ANN001
        if predicate is None or not isinstance(predicate, (str, list)):
            raise ValueError(f"invalid time_of_day predicate: {predicate!r}")
        if isinstance(predicate, list) and not predicate:
            raise ValueError("time_of_day predicate list must not be empty")
        items = predicate if isinstance(predicate, list) else [predicate]
        synthetic = _synthetic_snapshot()
        for item in items:
            # _match_one raises ValueError for malformed items;
            # iterating ensures every list element is checked
            # (matches() short-circuits and would miss bad later items).
            self._match_one(item, synthetic)

    def describe(self, snapshot: TimeOfDaySnapshot) -> str | None:
        # Return the first named period whose range contains 'now'.
        # Order in _NAMED_PERIODS controls precedence — prefer specific (sunset)
        # over broad (day) when both match.
        for name in _NAMED_PERIODS:
            try:
                if self._match_one(name, snapshot):
                    return name
            except ValueError:
                continue
        return None


def _in_range(now: datetime, start: datetime, end: datetime) -> bool:
    if end <= start:
        # wrap midnight
        return now >= start or now < end
    return start <= now < end


def _minute_of_day(value: datetime) -> float:
    """Minutes since midnight for a datetime; the date component is ignored."""
    return value.hour * 60 + value.minute + value.second / 60


def _merge_intervals(
    intervals: list[tuple[float, float]],
) -> list[tuple[float, float]]:
    """Merge overlapping/touching [start, end) minute intervals into a sorted,
    disjoint list."""
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
    """A throwaway snapshot used only for predicate validation."""
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
