"""Compute a synthetic `sun.sun` state for an arbitrary moment.

Used by the what-if simulator so date/time-travel produces correct sun
positions and event anchors. Uses `astral` (bundled with Home Assistant — the
same library the core `sun` integration relies on), so there is no new
dependency.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from astral import Observer
from astral.sun import azimuth, dawn, dusk, elevation, midnight, noon, sunrise, sunset
from homeassistant.core import HomeAssistant, State
from homeassistant.util import dt as dt_util

# sun.sun attribute name -> astral function. Each function returns a tz-aware
# UTC datetime for the given observer/date; the time_of_day matcher normalises
# anchors to within ±12h of `now`, so a same-date anchor is sufficient.
_ANCHORS = {
    "next_rising": sunrise,
    "next_setting": sunset,
    "next_noon": noon,
    "next_midnight": midnight,
    "next_dawn": dawn,
    "next_dusk": dusk,
}


def synthetic_sun_state(hass: HomeAssistant, now: datetime) -> State:
    """A `sun.sun` State for `now` at the home's location.

    Carries `elevation`/`azimuth` (for the sun matcher) and the six `next_*`
    anchors (for the time_of_day matcher). Anchors that are undefined at the
    location/date (polar day/night) are omitted; a matcher needing a missing
    anchor will fail its snapshot and resolve to None, same as live behaviour.
    """
    observer = Observer(
        latitude=hass.config.latitude,
        longitude=hass.config.longitude,
        elevation=hass.config.elevation or 0,
    )
    on_date = dt_util.as_local(now).date()
    attributes: dict[str, Any] = {}
    for attr, fn in _ANCHORS.items():
        try:
            attributes[attr] = fn(observer, date=on_date).isoformat()
        except ValueError:
            # Anchor undefined at this location/date (e.g. polar day/night).
            continue
    el = float(elevation(observer, now))
    attributes["elevation"] = el
    attributes["azimuth"] = float(azimuth(observer, now))
    # 0.833° atmospheric-refraction allowance — matches HA core's sun.sun
    # state boundary, so the synthetic state agrees near sunrise/sunset.
    state = "above_horizon" if el > -0.833 else "below_horizon"
    return State("sun.sun", state, attributes)
