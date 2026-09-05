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

# anchor name -> (sun.sun `next_*` attribute, astral fn). Each fn returns a
# tz-aware UTC datetime for the given observer/date. Single source of truth for
# both the per-date anchors (`anchor_datetimes`) and the synthetic state.
_ANCHORS = {
    "sunrise": ("next_rising", sunrise),
    "sunset": ("next_setting", sunset),
    "noon": ("next_noon", noon),
    "midnight": ("next_midnight", midnight),
    "dawn": ("next_dawn", dawn),
    "dusk": ("next_dusk", dusk),
}

# The six anchor names in `_ANCHORS`' order — the single source simulate.py's
# sun_anchors() iterates instead of hand-listing the names.
ANCHOR_NAMES = tuple(_ANCHORS)


def _observer(hass: HomeAssistant) -> Observer:
    return Observer(
        latitude=hass.config.latitude,
        longitude=hass.config.longitude,
        elevation=hass.config.elevation or 0,
    )


def anchor_datetimes(hass: HomeAssistant, now: datetime) -> dict[str, datetime]:
    """The six sun anchors for `now`'s local date, as tz-aware UTC datetimes.

    Keyed by the time_of_day anchor names (sunrise/sunset/noon/midnight/dawn/dusk).
    Each is the occurrence of that solar event on now's local calendar date — the
    event *belonging to today*, NOT the "next" occurrence. This matters at a
    boundary: an event that has already fired today must still resolve to today's
    instance so a just-crossed range boundary stays put. HA core's `sun.sun`
    `next_*` attributes instead roll to tomorrow the instant an event fires, and
    `next_event − 24h` drifts by a day's worth of solar movement (tens of seconds
    to minutes), which would shove the boundary back across `now`.

    An anchor undefined at the location/date (polar day/night) is omitted, so a
    caller keeps the anchors that do exist and disables only what depends on the
    missing ones.
    """
    observer = _observer(hass)
    on_date = dt_util.as_local(now).date()
    result: dict[str, datetime] = {}
    for name, (_attr, fn) in _ANCHORS.items():
        try:
            result[name] = fn(observer, date=on_date)
        except ValueError:
            continue  # undefined here today (polar day/night)
    return result


def synthetic_sun_state(hass: HomeAssistant, now: datetime) -> State:
    """A `sun.sun` State for `now` at the home's location.

    Carries `elevation`/`azimuth` (for the sun condition) and the six `next_*`
    anchors (for the time_of_day condition). Anchors that are undefined at the
    location/date (polar day/night) are omitted; a predicate needing a missing
    anchor is unobservable and reads false, same as live behaviour.
    """
    observer = _observer(hass)
    attributes: dict[str, Any] = {
        _ANCHORS[name][0]: dt.isoformat() for name, dt in anchor_datetimes(hass, now).items()
    }
    el = float(elevation(observer, now))
    attributes["elevation"] = el
    attributes["azimuth"] = float(azimuth(observer, now))
    # 0.833° atmospheric-refraction allowance — matches HA core's sun.sun
    # state boundary, so the synthetic state agrees near sunrise/sunset.
    state = "above_horizon" if el > -0.833 else "below_horizon"
    return State("sun.sun", state, attributes)
