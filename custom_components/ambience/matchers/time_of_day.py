"""Built-in time_of_day matcher."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_ABS_RE = re.compile(r"^\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*$")
_HHMM_RE = re.compile(r"^\d{1,2}:\d{2}$")


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
        if isinstance(predicate, str):
            return self._match_one(predicate, snapshot)
        raise ValueError(f"invalid time_of_day predicate: {predicate!r}")

    def _match_one(self, text: str, snapshot: TimeOfDaySnapshot) -> bool:
        text = text.strip()
        m = _ABS_RE.match(text)
        if m:
            start = self._resolve_endpoint(m.group(1), snapshot)
            end = self._resolve_endpoint(m.group(2), snapshot)
            return _in_range(snapshot.now, start, end)
        raise ValueError(f"invalid time_of_day predicate: {text!r}")

    def _resolve_endpoint(self, expr: str, snapshot: TimeOfDaySnapshot) -> datetime:
        expr = expr.strip()
        if _HHMM_RE.match(expr):
            hh, mm = map(int, expr.split(":"))
            base = snapshot.now
            return base.replace(hour=hh, minute=mm, second=0, microsecond=0)
        raise ValueError(f"invalid endpoint: {expr!r}")

    def describe(self, snapshot: TimeOfDaySnapshot) -> str | None:
        return None

    def validate_predicate(self, predicate) -> None:  # noqa: ANN001
        raise NotImplementedError


def _in_range(now: datetime, start: datetime, end: datetime) -> bool:
    if end <= start:
        # wrap midnight
        return now >= start or now < end
    return start <= now < end
