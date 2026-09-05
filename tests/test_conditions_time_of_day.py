"""TimeOfDayCondition — structured JSON predicate format."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta
from typing import Any

import pytest
from astral import Observer
from astral.sun import dusk, sunrise
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions.time_of_day import (
    TimeOfDayCondition,
    TimeOfDaySnapshot,
)
from custom_components.ambience.periods import BUILTIN_PERIODS


@pytest.fixture(autouse=True)
def force_utc_timezone():
    """Force dt_util's default timezone to UTC for the duration of each test.

    The hass fixture sets it to US/Pacific; absolute-time endpoint tests must
    compare against UTC-anchored datetimes so we pin it back here.
    """
    orig = dt_util.DEFAULT_TIME_ZONE
    dt_util.DEFAULT_TIME_ZONE = UTC
    yield
    dt_util.DEFAULT_TIME_ZONE = orig


def _build_snapshot(now: datetime, **overrides: datetime) -> TimeOfDaySnapshot:
    base = datetime(2026, 5, 13, tzinfo=UTC)
    defaults = {
        "now": now,
        "sunrise": base.replace(hour=6),
        "sunset": base.replace(hour=18),
        "noon": base.replace(hour=12),
        "midnight": base.replace(hour=0),
        "dawn": base.replace(hour=5, minute=30),
        "dusk": base.replace(hour=18, minute=30),
    }
    defaults.update(overrides)
    return TimeOfDaySnapshot(**defaults)


_ROME = (41.9028, 12.4964, 0)  # latitude, longitude, elevation


def _set_rome(hass: HomeAssistant) -> Observer:
    """Pin hass to Rome and return a matching astral Observer."""
    hass.config.latitude, hass.config.longitude, hass.config.elevation = _ROME
    return Observer(latitude=_ROME[0], longitude=_ROME[1], elevation=_ROME[2])


def _roll_sun_to(hass: HomeAssistant, when: datetime) -> None:
    """Set sun.sun with every `next_*` anchor pointing at `when` — mimics HA core
    once the day's events have fired and rolled the anchors over to tomorrow."""
    iso = when.isoformat()
    attrs = ("next_rising", "next_setting", "next_noon", "next_midnight", "next_dawn", "next_dusk")
    hass.states.async_set("sun.sun", "below_horizon", dict.fromkeys(attrs, iso))


def _condition(periods: dict[str, dict[str, Any]] | None = None) -> TimeOfDayCondition:
    """Build a condition whose period_lookup returns the given periods dict
    (defaults to BUILTIN_PERIODS)."""
    effective = periods if periods is not None else dict(BUILTIN_PERIODS)
    return TimeOfDayCondition(period_lookup=lambda: effective)


# ── snapshot ────────────────────────────────────────────────────────────────


async def test_snapshot_returns_today_anchors(hass: HomeAssistant) -> None:
    next_rising = (datetime.now(UTC) + timedelta(hours=1)).isoformat()
    next_setting = (datetime.now(UTC) + timedelta(hours=12)).isoformat()
    next_dawn = (datetime.now(UTC) + timedelta(minutes=30)).isoformat()
    next_dusk = (datetime.now(UTC) + timedelta(hours=13)).isoformat()
    next_noon = (datetime.now(UTC) + timedelta(hours=6)).isoformat()
    next_midnight = (datetime.now(UTC) + timedelta(hours=18)).isoformat()
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_rising": next_rising,
            "next_setting": next_setting,
            "next_dawn": next_dawn,
            "next_dusk": next_dusk,
            "next_noon": next_noon,
            "next_midnight": next_midnight,
        },
    )
    snap = await _condition().snapshot(hass)
    for field in ("now", "sunrise", "sunset", "dawn", "dusk", "noon", "midnight"):
        assert getattr(snap, field).tzinfo is not None


async def test_snapshot_without_sun_integration_disables_only_sun_endpoints(
    hass: HomeAssistant,
) -> None:
    """No `sun.sun` (the sun integration is absent): the snapshot still resolves,
    clock endpoints keep working and only sun-anchored ones go unobservable."""
    cond = _condition()
    snap = await cond.snapshot(hass, now=datetime(2026, 6, 20, 12, 0, tzinfo=UTC))
    assert snap.sunrise is None
    assert snap.dusk is None
    assert cond.matches(_range(_time(8, 0), _time(17, 0)), snap) is True
    sun_pred = _range(_sun("sunrise"), _sun("sunset"))
    assert cond.matches(sun_pred, snap) is False
    reason = cond.unconfigured_reason(sun_pred, snap)
    assert reason is not None
    assert "sun integration" in reason


async def test_snapshot_uses_anchor_for_now_local_date_not_next_event(
    hass: HomeAssistant,
) -> None:
    """Regression: the snapshot must expose the anchor for now's *local date*.

    Once today's dusk has passed, HA core rolls `sun.sun`'s `next_dusk` over to
    *tomorrow's* dusk. The snapshot must still resolve TODAY's dusk — not
    tomorrow's — otherwise the ±12h normalisation (tomorrow's dusk − 24h) lands
    a day's worth of solar drift later than the dusk that just fired, shoving a
    just-crossed boundary back across `now`.
    """
    obs = _set_rome(hass)
    today_dusk = dusk(obs, date=date(2026, 6, 6))
    now = today_dusk + timedelta(seconds=5)  # a moment after today's dusk
    _roll_sun_to(hass, dusk(obs, date=date(2026, 6, 7)))  # HA advanced next_* to tomorrow
    snap = await _condition().snapshot(hass, now=now)
    assert snap.dusk == today_dusk


async def test_night_range_stays_matched_just_after_dusk(hass: HomeAssistant) -> None:
    """Regression (blinds reopening at night): a `dusk → 08:30` night range must
    keep matching the moment after dusk, and the `08:30 → dusk` day range must
    NOT match — even though HA's next_dusk has rolled to tomorrow.
    """
    obs = _set_rome(hass)
    today_dusk = dusk(obs, date=date(2026, 6, 6))
    now = today_dusk + timedelta(seconds=5)
    _roll_sun_to(hass, dusk(obs, date=date(2026, 6, 7)))
    snap = await _condition().snapshot(hass, now=now)
    cond = _condition()
    night = _range(_sun("dusk"), _time(8, 30))
    day = _range(_time(8, 30), _sun("dusk"))
    assert cond.matches(night, snap) is True
    assert cond.matches(day, snap) is False


async def test_sunrise_range_flips_at_real_next_sunrise(hass: HomeAssistant) -> None:
    """The ±12h normalisation must not place a sun boundary early: a
    `sunrise → sunset` range flips exactly at the real sunrise, even at a high
    latitude where day-to-day solar drift is largest. A naive `today ± 24h`
    approximation would flip it minutes early; the local-date recompute avoids it.
    """
    obs = Observer(latitude=60.0, longitude=18.0, elevation=0)
    hass.config.latitude, hass.config.longitude, hass.config.elevation = 60.0, 18.0, 0
    hass.states.async_set("sun.sun", "below_horizon", {})
    real_sunrise = sunrise(obs, date=date(2026, 9, 23))
    rng = _range(_sun("sunrise"), _sun("sunset"))
    cond = _condition()
    before = await cond.snapshot(hass, now=real_sunrise - timedelta(minutes=1))
    after = await cond.snapshot(hass, now=real_sunrise + timedelta(minutes=1))
    assert cond.matches(rng, before) is False
    assert cond.matches(rng, after) is True


async def test_snapshot_ignores_sun_sun_attributes(hass: HomeAssistant) -> None:
    """Anchors come from astral for now's local date; sun.sun's `next_*`
    attributes are not consulted, so a missing/garbage attribute is harmless.
    """
    obs = _set_rome(hass)
    # sun.sun present (the integration is up) but with no usable anchor attrs.
    hass.states.async_set("sun.sun", "below_horizon", {})
    now = datetime(2026, 6, 6, 22, 0, tzinfo=UTC)
    snap = await _condition().snapshot(hass, now=now)
    assert snap.dusk == dusk(obs, date=date(2026, 6, 6))


# ── matches: explicit ranges ────────────────────────────────────────────────


def _time(hh: int, mm: int) -> dict:
    return {"kind": "time", "hh": hh, "mm": mm}


def _sun(anchor: str, offset_min: int = 0) -> dict:
    return {"kind": "sun", "anchor": anchor, "offset_min": offset_min}


def _range(from_ep: dict, to_ep: dict) -> dict:
    return {"from": from_ep, "to": to_ep}


def test_matches_absolute_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert _condition().matches(_range(_time(16, 0), _time(18, 30)), snap) is True


def test_matches_absolute_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 15, 0, tzinfo=UTC))
    assert _condition().matches(_range(_time(16, 0), _time(18, 30)), snap) is False


def test_matches_absolute_range_wraps_midnight() -> None:
    m = _condition()
    pred = _range(_time(22, 0), _time(2, 0))
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 1, 0, tzinfo=UTC))) is True
    assert m.matches(pred, _build_snapshot(datetime(2026, 5, 13, 3, 0, tzinfo=UTC))) is False


def test_matches_sun_relative_range_inside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 18, 15, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset"), _sun("dusk")), snap) is True


def test_matches_sun_relative_range_outside() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 19, 0, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset"), _sun("dusk")), snap) is False


def test_matches_sun_relative_with_negative_offset() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 45, tzinfo=UTC))
    assert _condition().matches(_range(_sun("sunset", -30), _time(22, 0)), snap) is True


def test_matches_sun_relative_with_positive_offset_hours() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().matches(_range(_sun("noon", 60), _sun("sunset")), snap) is True


def test_mixed_sun_time_range_does_not_match_after_midnight() -> None:
    """Regression: a sun `from` resolves to within ±12h of now while a `time`
    `to` resolves on now's local date — in the small hours that built a >24h
    interval that swallowed `now` ("evening until 23:00" scenes coming back on
    after midnight)."""
    pred = _range(_sun("sunset"), _time(23, 0))
    m = _condition()
    # Anchors for now's local date (May 14), as the production snapshot builds.
    for hour, minute in ((0, 30), (3, 0), (5, 30)):
        snap = _build_snapshot(
            datetime(2026, 5, 14, hour, minute, tzinfo=UTC),
            sunset=datetime(2026, 5, 14, 18, 0, tzinfo=UTC),
        )
        assert m.matches(pred, snap) is False, f"{hour:02d}:{minute:02d}"
    # Still matches inside the genuine sunset→23:00 window.
    snap = _build_snapshot(
        datetime(2026, 5, 14, 19, 0, tzinfo=UTC),
        sunset=datetime(2026, 5, 14, 18, 0, tzinfo=UTC),
    )
    assert m.matches(pred, snap) is True


def test_mixed_range_with_sun_start_after_time_end_wraps() -> None:
    """The symmetric skew: a sun `from` normalised into tomorrow with a `to` on
    today's date is a genuine wrap (endpoints >24h apart) and must still match
    just before midnight."""
    pred = _range(_sun("sunrise", 120), _time(0, 10))
    snap = _build_snapshot(datetime(2026, 5, 13, 23, 50, tzinfo=UTC))
    assert _condition().matches(pred, snap) is True


# ── matches: named periods ─────────────────────────────────────────────────


@pytest.mark.parametrize(
    "period,now_hour,now_minute,expected",
    [
        # dawn: dawn (05:30) → sunrise (06:00)
        ("dawn", 5, 30, True),  # inclusive start
        ("dawn", 5, 45, True),
        ("dawn", 5, 0, False),  # before dawn
        ("dawn", 6, 0, False),  # sunrise is the exclusive end
        # morning: sunrise (06:00) → noon (12:00)
        ("morning", 6, 0, True),  # morning now starts at sunrise, inclusive
        ("morning", 7, 0, True),
        ("morning", 5, 45, False),  # dawn→sunrise is the "dawn" period, not morning
        ("morning", 11, 30, True),  # ...and runs to noon (12:00)
        ("morning", 12, 0, False),  # noon is exclusive end
        # afternoon: noon (12:00) → sunset (18:00)
        ("afternoon", 12, 0, True),  # noon belongs to afternoon (inclusive start, no +1m)
        ("afternoon", 14, 0, True),
        ("afternoon", 18, 0, False),
        # evening: sunset (18:00) → dusk (18:30)
        ("evening", 18, 15, True),
        ("evening", 19, 0, False),
        # nighttime: sunset (18:00) → sunrise (06:00); contains evening + dawn
        ("nighttime", 18, 15, True),  # starts at sunset now (overlaps evening)
        ("nighttime", 22, 0, True),
        ("nighttime", 4, 0, True),
        ("nighttime", 10, 0, False),
        # daytime: sunrise (06:00) → sunset (18:00)
        ("daytime", 6, 0, True),  # daytime now starts at sunrise, inclusive
        ("daytime", 5, 45, False),  # dawn→sunrise is no longer daytime
        ("daytime", 12, 0, True),
        ("daytime", 18, 0, False),  # sunset is the exclusive end
    ],
)
def test_matches_named_period(period: str, now_hour: int, now_minute: int, expected: bool) -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, now_hour, now_minute, tzinfo=UTC))
    assert _condition().matches({"period": period}, snap) is expected, period


def test_matches_custom_period_via_lookup() -> None:
    custom = {**BUILTIN_PERIODS, "wind_down": _range(_time(20, 0), _time(22, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 21, 0, tzinfo=UTC))
    assert _condition(custom).matches({"period": "wind_down"}, snap) is True


def test_matches_custom_shadows_builtin() -> None:
    custom = {**BUILTIN_PERIODS, "afternoon": _range(_time(13, 0), _time(17, 0))}
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 15, tzinfo=UTC))
    assert _condition(custom).matches({"period": "afternoon"}, snap) is False


def test_matches_missing_period_fails_scene_not_scope() -> None:
    """A period hidden/deleted while still referenced fails just this scene
    (mirrors lux) instead of raising and killing the whole scope-category."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition().matches({"period": "nonexistent"}, snap) is False


def test_matches_list_with_missing_period_still_tries_other_items() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    pred = [{"period": "nonexistent"}, {"period": "afternoon"}]
    assert _condition().matches(pred, snap) is True


def test_order_key_tolerates_missing_period() -> None:
    """`order_key` feeds scope save/sort — a dangling period must not break it."""
    m = _condition()
    assert m.order_key({"period": "nonexistent"}) == float("inf")
    # A resolvable item still wins over the dangling one.
    assert m.order_key([{"period": "nonexistent"}, _range(_time(10, 0), _time(12, 0))]) == 600.0


def test_contains_tolerates_missing_period() -> None:
    """`contains` feeds shadow detection — a dangling period proves nothing."""
    m = _condition()
    rng = _range(_time(10, 0), _time(12, 0))
    assert m.contains({"period": "nonexistent"}, rng) is False
    assert m.contains(rng, {"period": "nonexistent"}) is False


# ── matches: OR lists ──────────────────────────────────────────────────────


def test_matches_list_any() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is True


def test_matches_list_none() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    assert _condition().matches([{"period": "evening"}, {"period": "afternoon"}], snap) is False


def test_matches_list_mixed_period_and_range() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    pred = [{"period": "evening"}, _range(_time(16, 0), _time(18, 30))]
    assert _condition().matches(pred, snap) is True


# ── validate_predicate ─────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "pred",
    [
        {"period": "morning"},
        _range(_time(16, 0), _time(18, 30)),
        _range(_sun("sunset", -30), _time(22, 0)),
        _range(_sun("sunrise"), _sun("sunset")),
        [{"period": "evening"}, _range(_time(16, 0), _time(18, 30))],
    ],
)
def test_validate_predicate_accepts_valid(pred: Any) -> None:
    _condition().validate_predicate(pred)


@pytest.mark.parametrize(
    "pred",
    [
        "old_string_format",
        42,
        None,
        {},
        {"period": 123},
        {"from": _time(8, 0)},
        _range({"kind": "time", "hh": 25, "mm": 0}, _time(10, 0)),
        _range(_sun("zenith"), _sun("sunset")),
        [],
        [{"period": "evening"}, "garbage"],
        # clamp must be an object — runtime _apply_clamp guard (not the period-store
        # validator), reached because validate_predicate evaluates inline endpoints.
        _range(
            {"kind": "sun", "anchor": "sunrise", "offset_min": 0, "clamp": "nope"}, _sun("dusk")
        ),
    ],
)
def test_validate_predicate_rejects_invalid(pred: Any) -> None:
    with pytest.raises(ValueError):
        _condition().validate_predicate(pred)


def test_time_of_day_validate_predicate_allows_unknown_period() -> None:
    TimeOfDayCondition(period_lookup=lambda: {}).validate_predicate({"period": "gone"})  # no raise


def test_time_of_day_validate_predicate_still_rejects_malformed_endpoint() -> None:
    cond = TimeOfDayCondition(period_lookup=lambda: {})
    with pytest.raises(ValueError):
        cond.validate_predicate(
            {"from": {"kind": "lunar", "hh": 8, "mm": 0}, "to": {"kind": "time", "hh": 10, "mm": 0}}
        )


def test_validate_predicate_accepts_identical_endpoints() -> None:
    """from == to is harmless (matches all day at runtime) and must stay
    valid — rejecting it would block saving scopes with such a config."""
    _condition().validate_predicate(_range(_time(10, 0), _time(10, 0)))


def test_validate_predicate_rejects_bool_clock() -> None:
    """bool is an int subclass; `hh: true` must not validate as hour 1 (the
    trigger scheduler already rejects it, so it would never fire)."""
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range({"kind": "time", "hh": True, "mm": 0}, _time(10, 0)))


# ── describe ───────────────────────────────────────────────────────────────


def test_describe_returns_named_period_when_matching() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 14, 0, tzinfo=UTC))
    assert _condition().describe(snap) == "afternoon"


def test_describe_returns_none_if_no_period_matches() -> None:
    # The builtin periods now tile the full day (daytime∪evening∪nighttime cover
    # everything), so a "no match" only happens against a period set the time is
    # outside of — here a single evening window with now at midday.
    only_evening = {"evening": _range(_sun("sunset"), _sun("dusk"))}
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition(only_evening).describe(snap) is None


def test_describe_dawn_window_reads_dawn() -> None:
    # 05:45 is between dawn (05:30) and sunrise (06:00): the new "dawn" period,
    # not "morning" (which now starts at sunrise).
    snap = _build_snapshot(datetime(2026, 5, 13, 5, 45, tzinfo=UTC))
    assert _condition().describe(snap) == "dawn"


def test_describe_evening_precedes_containing_nighttime() -> None:
    # 18:15 is between sunset (18:00) and dusk (18:30). nighttime now spans
    # sunset→sunrise and so contains this moment, but the narrower "evening" is
    # ordered first, so describe() must read "evening".
    snap = _build_snapshot(datetime(2026, 5, 13, 18, 15, tzinfo=UTC))
    assert _condition().describe(snap) == "evening"


# ── contains ───────────────────────────────────────────────────────────────


def test_contains_nested_range() -> None:
    m = _condition()
    wide = _range(_time(10, 0), _time(14, 0))
    narrow = _range(_time(12, 0), _time(13, 0))
    assert m.contains(wide, narrow) is True
    assert m.contains(narrow, wide) is False


def test_contains_equal_range() -> None:
    m = _condition()
    rng = _range(_time(10, 0), _time(14, 0))
    assert m.contains(rng, rng) is True


def test_contains_disjoint() -> None:
    m = _condition()
    assert (
        m.contains(_range(_time(8, 0), _time(10, 0)), _range(_time(18, 0), _time(19, 0))) is False
    )


def test_contains_partial_overlap_neither_contains() -> None:
    m = _condition()
    assert (
        m.contains(_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(13, 0))) is False
    )


def test_contains_wrap_midnight() -> None:
    m = _condition()
    assert m.contains(_range(_time(22, 0), _time(2, 0)), _range(_time(23, 0), _time(1, 0))) is True
    assert m.contains(_range(_time(23, 0), _time(1, 0)), _range(_time(22, 0), _time(2, 0))) is False


def test_contains_named_period() -> None:
    m = _condition()
    assert m.contains({"period": "daytime"}, {"period": "afternoon"}) is True


def test_contains_list_predicate_union() -> None:
    m = _condition()
    outer = [_range(_time(10, 0), _time(12, 0)), _range(_time(11, 0), _time(14, 0))]
    inner = _range(_time(11, 30), _time(13, 0))
    assert m.contains(outer, inner) is True


def test_contains_full_day_predicate() -> None:
    m = _condition()
    full = _range(_time(0, 0), _time(0, 0))
    assert m.contains(full, _range(_time(12, 0), _time(13, 0))) is True
    assert m.contains(_range(_time(12, 0), _time(13, 0)), full) is False


def test_contains_degenerate_clamp_period_yields_empty_intervals() -> None:
    # A clamp that empties a forward range contributes no interval in _intervals
    # (the wrap is skipped rather than split), so the period is vacuously
    # contained by anything and is satisfied by no instant.
    custom = {
        "bad": {
            "from": {
                "kind": "sun",
                "anchor": "sunrise",
                "offset_min": 0,
                "clamp": {"dir": "not_before", "hh": 20, "mm": 0},
            },
            "to": {"kind": "time", "hh": 18, "mm": 0},
        }
    }
    m = _condition(custom)
    assert m.contains(_range(_time(0, 0), _time(0, 0)), {"period": "bad"}) is True


# ── order_key ──────────────────────────────────────────────────────────────


def test_order_key_is_start_minute_of_day() -> None:
    m = _condition()
    assert m.order_key(_range(_time(8, 0), _time(10, 0))) == 480
    assert m.order_key(_range(_time(18, 0), _time(19, 0))) == 1080


def test_order_key_list_takes_earliest_start() -> None:
    m = _condition()
    pred = [_range(_time(18, 0), _time(19, 0)), _range(_time(8, 0), _time(10, 0))]
    assert m.order_key(pred) == 480


def test_order_key_named_period() -> None:
    # nighttime now starts at sunset (18:00) → 1080 minutes of day.
    assert _condition().order_key({"period": "nighttime"}) == 1080.0


# ── condition metadata ───────────────────────────────────────────────────────


def test_input_attribute_signals_dedicated_widget() -> None:
    assert _condition().input == "time_of_day"


def test_condition_exposes_description() -> None:
    assert _condition().description.strip() != ""


def test_priority() -> None:
    assert _condition().priority == 800


def test_trigger_deps_absolute_range_yields_clock_times() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": 22, "mm": 30},
        "to": {"kind": "time", "hh": 6, "mm": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset({(22, 30), (6, 0)})
    assert spec.sun_events == frozenset()
    assert spec.date_rollover is False


def test_trigger_deps_sun_range_yields_sun_events() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": -30},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.sun_events == frozenset({("sunrise", -30), ("sunset", 0)})
    assert spec.clock_times == frozenset()


def test_trigger_deps_named_period_resolves_via_lookup() -> None:
    periods = {
        "evening": {
            "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
            "to": {"kind": "time", "hh": 23, "mm": 0},
        }
    }
    m = TimeOfDayCondition(period_lookup=lambda: periods)
    spec = m.trigger_deps({"period": "evening"})
    assert spec.sun_events == frozenset({("sunset", 0)})
    assert spec.clock_times == frozenset({(23, 0)})


def test_trigger_deps_list_merges_all_items() -> None:
    m = TimeOfDayCondition()
    pred = [
        {"from": {"kind": "time", "hh": 7, "mm": 0}, "to": {"kind": "time", "hh": 9, "mm": 0}},
        {"from": {"kind": "time", "hh": 18, "mm": 0}, "to": {"kind": "time", "hh": 20, "mm": 0}},
    ]
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset({(7, 0), (9, 0), (18, 0), (20, 0)})
    assert spec.sun_events == frozenset()


def test_trigger_deps_tolerates_garbage_input() -> None:
    m = TimeOfDayCondition()
    bad_inputs: list[Any] = [
        "string",
        42,
        None,
        {},
        {"from": None, "to": None},
        {"period": "missing"},
        [None, "x"],
        {"kind": "sun", "anchor": "nope"},
    ]
    for bad in bad_inputs:
        spec = m.trigger_deps(bad)
        assert spec.clock_times == frozenset()
        assert spec.sun_events == frozenset()


def test_trigger_deps_skips_out_of_range_and_unknown_anchor() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": 99, "mm": 0},
        "to": {"kind": "sun", "anchor": "nope", "offset_min": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


def test_trigger_deps_rejects_bool_time_and_offset() -> None:
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "time", "hh": True, "mm": False},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": True},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


def test_absolute_time_uses_local_tz_for_date(hass: HomeAssistant) -> None:
    """An absolute time {kind: time, hh: 16, mm: 0} is interpreted as 16:00
    in HA's local timezone, not UTC. With HA's default test tz (UTC), this
    means 16:00Z. If a non-UTC tz is configured, the resolved start would
    be 16:00 in that tz."""
    # Test that the resolved time is in the local tz (UTC in tests by default)
    from custom_components.ambience.conditions.time_of_day import TimeOfDayCondition

    condition = TimeOfDayCondition(period_lookup=lambda: {})
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 0, tzinfo=UTC))
    assert (
        condition.matches(
            {
                "from": {"kind": "time", "hh": 16, "mm": 0},
                "to": {"kind": "time", "hh": 18, "mm": 30},
            },
            snap,
        )
        is True
    )


# ── snapshot: anchor undefined at location/date (polar day/night) ─────────

_REYKJAVIK = (64.13, -21.9, 0)  # latitude, longitude, elevation

# Midsummer noon in Iceland (Atlantic/Reykjavik is UTC year-round, so the local
# date is the UTC date): above ~60.5°N civil dawn/dusk do not occur, while
# sunrise/sunset/noon/midnight stay defined.
_MIDSUMMER = datetime(2026, 6, 20, 12, 0, tzinfo=UTC)


def _set_reykjavik(hass: HomeAssistant) -> Observer:
    """Pin hass to Reykjavík (sun integration up) and return a matching Observer."""
    hass.config.latitude, hass.config.longitude, hass.config.elevation = _REYKJAVIK
    hass.states.async_set("sun.sun", "above_horizon", {})
    return Observer(latitude=_REYKJAVIK[0], longitude=_REYKJAVIK[1], elevation=_REYKJAVIK[2])


async def test_snapshot_keeps_defined_anchors_when_dusk_undefined(hass: HomeAssistant) -> None:
    """A day with no civil dawn/dusk yields a partial snapshot, not no snapshot."""
    obs = _set_reykjavik(hass)
    snap = await _condition().snapshot(hass, now=_MIDSUMMER)
    assert snap is not None
    assert snap.dawn is None
    assert snap.dusk is None
    assert snap.sunrise == sunrise(obs, date=date(2026, 6, 20))
    assert snap.noon is not None
    assert snap.midnight is not None


async def test_clock_range_matches_when_dusk_undefined(hass: HomeAssistant) -> None:
    """A clock-only range is unaffected by the missing anchor."""
    _set_reykjavik(hass)
    cond = _condition()
    snap = await cond.snapshot(hass, now=_MIDSUMMER)
    assert cond.matches(_range(_time(8, 0), _time(17, 0)), snap) is True


async def test_dusk_range_false_with_reason_naming_the_anchor(hass: HomeAssistant) -> None:
    """A range referencing the missing anchor is false and says which anchor."""
    _set_reykjavik(hass)
    cond = _condition()
    snap = await cond.snapshot(hass, now=_MIDSUMMER)
    pred = _range(_sun("dusk"), _time(8, 30))
    assert cond.matches(pred, snap) is False
    reason = cond.unconfigured_reason(pred, snap)
    assert reason is not None
    assert "dusk" in reason


async def test_period_needing_missing_anchor_false_others_still_evaluate(
    hass: HomeAssistant,
) -> None:
    """Only periods referencing the missing anchor go unobservable: 'evening'
    (sunset→dusk) is false while 'daytime' (sunrise→sunset) still matches."""
    _set_reykjavik(hass)
    cond = _condition()
    snap = await cond.snapshot(hass, now=_MIDSUMMER)
    assert cond.matches({"period": "evening"}, snap) is False
    reason = cond.unconfigured_reason({"period": "evening"}, snap)
    assert reason is not None
    assert "dusk" in reason
    assert cond.matches({"period": "daytime"}, snap) is True
    assert cond.describe(snap) == "morning"


async def test_polar_day_keeps_clock_ranges_working(hass: HomeAssistant) -> None:
    """At 80°N on midsummer the sun neither rises nor sets: those anchors are
    undefined, noon/midnight stay defined, and clock ranges keep working."""
    hass.config.latitude, hass.config.longitude, hass.config.elevation = 80.0, 0.0, 0
    hass.states.async_set("sun.sun", "above_horizon", {})
    cond = _condition()
    snap = await cond.snapshot(hass, now=datetime(2026, 6, 21, 12, 0, tzinfo=UTC))
    assert snap.sunrise is None
    assert snap.sunset is None
    assert snap.noon is not None
    assert cond.matches(_range(_time(8, 0), _time(17, 0)), snap) is True
    assert cond.matches(_range(_sun("sunrise"), _sun("sunset")), snap) is False


# ── _resolve_endpoint error paths (via validate_predicate; matches() is
# deliberately tolerant of malformed stored data) ─────────────────────────────


def test_resolve_endpoint_non_dict_raises() -> None:
    """_resolve_endpoint raises ValueError when the endpoint is not a dict
    (e.g. a bare string used as a from/to value)."""
    with pytest.raises(ValueError, match="invalid endpoint"):
        _condition().validate_predicate({"from": "08:00", "to": _time(10, 0)})


def test_resolve_endpoint_invalid_mm_raises() -> None:
    """_resolve_endpoint raises ValueError when mm is out of [0, 59] range."""
    with pytest.raises(ValueError, match="invalid mm"):
        _condition().validate_predicate(
            {"from": {"kind": "time", "hh": 8, "mm": 60}, "to": _time(10, 0)}
        )


def test_resolve_endpoint_non_int_mm_raises() -> None:
    """_resolve_endpoint raises ValueError when mm is not an int."""
    with pytest.raises(ValueError, match="invalid mm"):
        _condition().validate_predicate(
            {"from": {"kind": "time", "hh": 8, "mm": "30"}, "to": _time(10, 0)}
        )


def test_resolve_endpoint_non_int_offset_raises() -> None:
    """_resolve_endpoint raises ValueError when offset_min is not an int."""
    with pytest.raises(ValueError, match="offset_min must be int"):
        _condition().validate_predicate(
            {"from": {"kind": "sun", "anchor": "sunrise", "offset_min": "30"}, "to": _time(10, 0)}
        )


def test_resolve_endpoint_unknown_kind_raises() -> None:
    """_resolve_endpoint raises ValueError when kind is not 'time' or 'sun'."""
    with pytest.raises(ValueError, match="invalid endpoint kind"):
        _condition().validate_predicate(
            {"from": {"kind": "lunar", "hh": 8, "mm": 0}, "to": _time(10, 0)}
        )


def test_matches_tolerates_malformed_endpoints() -> None:
    """matches() runs against stored data that may have rotted — a malformed
    item fails its scene instead of raising into the engine."""
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition().matches({"from": "08:00", "to": _time(10, 0)}, snap) is False


# ── describe: malformed period skipped via ValueError (lines 168-169) ────────


def test_describe_skips_malformed_period_definition() -> None:
    """describe() silently skips any period whose definition raises ValueError
    (lines 168-169 — the except-ValueError-continue branch), and falls through
    to the next period or returns None."""
    broken_periods = {
        # "from" endpoint is a bare string, not a dict — _resolve_endpoint will
        # raise ValueError, which describe() must catch and continue past.
        "broken": {"from": "not-a-dict", "to": _time(10, 0)},
        "good": _range(_time(14, 0), _time(16, 0)),
    }
    snap = _build_snapshot(datetime(2026, 5, 13, 15, 0, tzinfo=UTC))
    # Should skip "broken" without raising and return "good".
    result = _condition(broken_periods).describe(snap)
    assert result == "good"


def test_describe_returns_none_when_all_periods_malformed() -> None:
    """describe() returns None when every period definition is broken
    (all raise ValueError, caught at lines 168-169)."""
    broken_periods = {
        "p1": {"from": "bad", "to": _time(10, 0)},
        "p2": {"from": "also_bad", "to": _time(20, 0)},
    }
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    assert _condition(broken_periods).describe(snap) is None


# ── _classify_endpoint: kind is neither "time" nor "sun" (line 251->exit) ────


def test_trigger_deps_unknown_kind_produces_no_deps() -> None:
    """_classify_endpoint does nothing when kind is a string other than 'time'
    or 'sun' — exercises the 251->exit branch where the elif is False."""
    m = TimeOfDayCondition()
    pred = {
        "from": {"kind": "lunar", "anchor": "full_moon"},
        "to": {"kind": "stellar", "hh": 3, "mm": 0},
    }
    spec = m.trigger_deps(pred)
    assert spec.clock_times == frozenset()
    assert spec.sun_events == frozenset()


# ── clock-clamped sun endpoints ───────────────────────────────────────────────


def _sun_clamp(anchor: str, direction: str, hh: int, mm: int, offset_min: int = 0) -> dict:
    return {
        "kind": "sun",
        "anchor": anchor,
        "offset_min": offset_min,
        "clamp": {"dir": direction, "hh": hh, "mm": mm},
    }


def test_clamp_not_before_holds_floor_when_anchor_earlier() -> None:
    # sunrise 06:00, clamp not-before 08:30 → start = 08:30. now=07:00 is outside.
    snap = _build_snapshot(datetime(2026, 5, 13, 7, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is False


def test_clamp_not_before_inside_after_floor() -> None:
    snap = _build_snapshot(datetime(2026, 5, 13, 9, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is True


def test_clamp_not_before_anchor_wins_when_later() -> None:
    # sunrise 09:00 (override) is later than the 08:30 floor → start = 09:00.
    snap = _build_snapshot(
        datetime(2026, 5, 13, 8, 45, tzinfo=UTC),
        sunrise=datetime(2026, 5, 13, 9, 0, tzinfo=UTC),
    )
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    assert _condition().matches(pred, snap) is False  # 08:45 < 09:00


def test_clamp_not_after_caps_ceiling_when_anchor_later() -> None:
    # sunset 18:00, clamp not-after 17:00 → end = 17:00. now=17:30 is outside.
    snap = _build_snapshot(datetime(2026, 5, 13, 17, 30, tzinfo=UTC))
    pred = _range(_sun("sunrise"), _sun_clamp("sunset", "not_after", 17, 0))
    assert _condition().matches(pred, snap) is False


def test_clamp_combines_with_offset() -> None:
    # sunrise 06:00 +60min = 07:00, clamp not-before 08:30 → start = 08:30.
    snap = _build_snapshot(datetime(2026, 5, 13, 8, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30, offset_min=60), _sun("dusk"))
    assert _condition().matches(pred, snap) is False  # 08:00 < 08:30


def test_clamp_degenerate_inversion_never_matches() -> None:
    # not-before pushes start past a fixed end → empty range, never matches.
    snap = _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))
    pred = _range(_sun_clamp("sunrise", "not_before", 20, 0), _time(18, 0))
    assert _condition().matches(pred, snap) is False


def test_validate_predicate_rejects_bool_offset() -> None:
    # bool is an int subclass — reject it so `True` can't become a 1-min offset.
    bad = {"kind": "sun", "anchor": "sunrise", "offset_min": True}
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range(bad, _sun("dusk")))


def test_clamp_validation_rejects_bad_dir() -> None:
    bad = {
        "kind": "sun",
        "anchor": "sunrise",
        "offset_min": 0,
        "clamp": {"dir": "sideways", "hh": 8, "mm": 30},
    }
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range(bad, _sun("dusk")))


def test_clamp_validation_rejects_bad_time() -> None:
    bad = {
        "kind": "sun",
        "anchor": "sunrise",
        "offset_min": 0,
        "clamp": {"dir": "not_before", "hh": 25, "mm": 0},
    }
    with pytest.raises(ValueError):
        _condition().validate_predicate(_range(bad, _sun("dusk")))


def test_clamp_preserves_legitimate_overnight_wrap() -> None:
    # dusk(not before 20:00) → dawn is a genuine overnight range, NOT a
    # degenerate inversion: it must still match across midnight.
    pred = _range(_sun_clamp("dusk", "not_before", 20, 0), _sun("dawn"))
    cond = _condition()
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 22, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 4, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 20, 30, tzinfo=UTC))) is True
    # Outside the range: before the 20:00 floor, and at noon.
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 19, 0, tzinfo=UTC))) is False
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))) is False


def test_non_binding_clamp_behaves_like_plain_anchor() -> None:
    # A not-before floor far earlier than the anchor never binds → dusk → dawn.
    pred = _range(_sun_clamp("dusk", "not_before", 6, 0), _sun("dawn"))
    cond = _condition()
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 22, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))) is False


def test_trigger_deps_includes_clamp_clock_time() -> None:
    pred = _range(_sun_clamp("sunrise", "not_before", 8, 30), _sun("dusk"))
    spec = _condition().trigger_deps(pred)
    assert (8, 30) in spec.clock_times
    assert ("sunrise", 0) in spec.sun_events
    assert ("dusk", 0) in spec.sun_events


def test_clamp_not_before_legit_wrap_with_close_anchors() -> None:
    # sunrise(not before 20:00) → dawn is a real overnight window 20:00→05:30
    # (the from/to anchors are close, so both day-adjust together — the case the
    # old direction-only heuristic got wrong).
    pred = _range(_sun_clamp("sunrise", "not_before", 20, 0), _sun("dawn"))
    cond = _condition()
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 21, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 2, 0, tzinfo=UTC))) is True
    assert cond.matches(pred, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC))) is False


def test_degenerate_clamp_in_named_period_never_matches() -> None:
    # A degenerate clamp inside a custom period must be empty too, not a wrap.
    custom = {
        "bad": {
            "from": {
                "kind": "sun",
                "anchor": "sunrise",
                "offset_min": 0,
                "clamp": {"dir": "not_before", "hh": 20, "mm": 0},
            },
            "to": {"kind": "time", "hh": 18, "mm": 0},
        }
    }
    cond = _condition(custom)
    assert (
        cond.matches({"period": "bad"}, _build_snapshot(datetime(2026, 5, 13, 12, 0, tzinfo=UTC)))
        is False
    )
    assert (
        cond.matches({"period": "bad"}, _build_snapshot(datetime(2026, 5, 13, 4, 0, tzinfo=UTC)))
        is False
    )


# ---------------------------------------------------------------------------
# unconfigured_reason — lines 242-248
# ---------------------------------------------------------------------------


def test_unconfigured_reason_dangling_period_returns_reason() -> None:
    """A period id that is no longer in the lookup → descriptive reason string."""
    m = TimeOfDayCondition(period_lookup=lambda: {"morning": _range(_time(6, 0), _time(12, 0))})
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    reason = m.unconfigured_reason({"period": "gone"}, snap)
    assert reason is not None
    assert "gone" in reason


def test_unconfigured_reason_known_period_returns_none() -> None:
    """A period id that IS in the lookup → None."""
    m = TimeOfDayCondition(period_lookup=lambda: {"morning": _range(_time(6, 0), _time(12, 0))})
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    assert m.unconfigured_reason({"period": "morning"}, snap) is None


def test_unconfigured_reason_no_period_key_returns_none() -> None:
    """A predicate without a 'period' key (inline range) → None."""
    m = TimeOfDayCondition(period_lookup=lambda: {})
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    assert m.unconfigured_reason(_range(_time(8, 0), _time(12, 0)), snap) is None


def test_unconfigured_reason_non_dict_item_in_list_returns_none() -> None:
    """Non-dict items in a list predicate are skipped (not treated as dangling)."""
    m = TimeOfDayCondition(period_lookup=lambda: {})
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    # "garbage" is not a dict — must not raise, must return None
    assert m.unconfigured_reason(["garbage", 42], snap) is None


def test_unconfigured_reason_list_with_dangling_period_returns_reason() -> None:
    """A list predicate containing a dangling period → reason for that period."""
    m = TimeOfDayCondition(period_lookup=lambda: {"morning": _range(_time(6, 0), _time(12, 0))})
    snap = _build_snapshot(datetime(2026, 5, 13, 10, 0, tzinfo=UTC))
    reason = m.unconfigured_reason([{"period": "morning"}, {"period": "gone"}], snap)
    assert reason is not None
    assert "gone" in reason


def test_unconfigured_reason_ignores_non_string_period() -> None:
    cond = TimeOfDayCondition(period_lookup=lambda: {})
    # A corrupt non-string period must not yield a misleading "no longer exists" reason.
    assert cond.unconfigured_reason({"period": 42}, None) is None
