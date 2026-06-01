"""Synthetic sun.sun state for the what-if simulator."""

from datetime import UTC, datetime

from custom_components.ambience.sun_position import synthetic_sun_state


class _Config:
    latitude = 51.5
    longitude = -0.12
    elevation = 0
    time_zone = "UTC"


class _Hass:
    config = _Config()


def test_synthetic_sun_state_has_position_and_anchors():
    # Midday London midsummer: sun is well above the horizon.
    noon = datetime(2026, 6, 21, 12, 0, tzinfo=UTC)
    state = synthetic_sun_state(_Hass(), noon)

    assert state.entity_id == "sun.sun"
    assert state.state == "above_horizon"
    assert isinstance(state.attributes["elevation"], float)
    assert state.attributes["elevation"] > 0
    assert 0 <= state.attributes["azimuth"] <= 360
    # All six anchors present as parseable ISO strings.
    for attr in (
        "next_rising",
        "next_setting",
        "next_noon",
        "next_midnight",
        "next_dawn",
        "next_dusk",
    ):
        assert "T" in state.attributes[attr]


def test_synthetic_sun_state_below_horizon_at_night():
    midnight = datetime(2026, 6, 21, 1, 0, tzinfo=UTC)
    state = synthetic_sun_state(_Hass(), midnight)
    assert state.state == "below_horizon"
    assert state.attributes["elevation"] < 0


def test_synthetic_sun_state_omits_anchors_during_polar_day():
    """At a high latitude in midsummer the sun never sets, so the rise/set
    anchors are undefined and silently omitted (per the documented contract);
    elevation/azimuth are still computed."""

    class _Polar:
        latitude = 78.0  # Svalbard — midnight sun in midsummer
        longitude = 15.0
        elevation = 0
        time_zone = "UTC"

    class _PolarHass:
        config = _Polar()

    state = synthetic_sun_state(_PolarHass(), datetime(2026, 6, 21, 12, 0, tzinfo=UTC))
    assert "next_rising" not in state.attributes
    assert "next_setting" not in state.attributes
    assert "elevation" in state.attributes
    assert "azimuth" in state.attributes
