"""Built-in time_of_day matcher."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timedelta

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

    def _match_one(self, text: str, snapshot: TimeOfDaySnapshot) -> bool:
        if not isinstance(text, str):
            raise ValueError(f"invalid time_of_day predicate item: {text!r}")
        text = text.strip()
        if text in _NAMED_PERIODS:
            start_expr, end_expr = _NAMED_PERIODS[text]
            start = self._resolve_endpoint(start_expr, snapshot)
            end = self._resolve_endpoint(end_expr, snapshot)
            return _in_range(snapshot.now, start, end)
        if " to " in text:
            left, right = text.split(" to ", 1)
            start = self._resolve_endpoint(left, snapshot)
            end = self._resolve_endpoint(right, snapshot)
            return _in_range(snapshot.now, start, end)
        m = _ABS_RE.match(text)
        if m:
            start = self._resolve_endpoint(m.group(1), snapshot)
            end = self._resolve_endpoint(m.group(2), snapshot)
            return _in_range(snapshot.now, start, end)
        raise ValueError(f"invalid time_of_day predicate: {text!r}")

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

    def describe(self, snapshot: TimeOfDaySnapshot) -> str | None:
        return None

    def validate_predicate(self, predicate) -> None:  # noqa: ANN001
        raise NotImplementedError


def _in_range(now: datetime, start: datetime, end: datetime) -> bool:
    if end <= start:
        # wrap midnight
        return now >= start or now < end
    return start <= now < end
