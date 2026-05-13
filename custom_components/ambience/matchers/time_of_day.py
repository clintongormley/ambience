"""Built-in time_of_day matcher."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


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
        raise NotImplementedError  # filled in by next task

    def describe(self, snapshot: TimeOfDaySnapshot) -> str | None:
        return None  # filled in later

    def validate_predicate(self, predicate) -> None:  # noqa: ANN001
        raise NotImplementedError  # filled in later
