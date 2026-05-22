"""DayMatcher — date / weekday / workday predicate."""

from __future__ import annotations

from datetime import date
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.matchers.day import DayMatcher, DaySnapshot


def _snap(today: date, **overrides) -> DaySnapshot:
    defaults = {
        "today": today,
        "weekday": today.weekday(),
        "days_in_month": 31,
        "workday_state": None,
        "month_workdays": None,
    }
    defaults.update(overrides)
    return DaySnapshot(**defaults)


def test_matcher_protocol_fields() -> None:
    m = DayMatcher()
    assert m.name == "day"
    assert m.toggleable is True
    assert m.input == "day_predicate"
    assert m.priority == 200
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def _install_store_stub(hass: HomeAssistant, **day_config) -> None:
    """Plant a minimal store stub at hass.data[DOMAIN][DATA_STORE]."""

    class _Store:
        def get_matcher_config(self, name: str) -> dict[str, object]:
            if name == "day":
                return {
                    "workday_sensor": day_config.get("workday_sensor"),
                    "workday_calendar": day_config.get("workday_calendar"),
                }
            return {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


async def test_snapshot_today_weekday_days_in_month(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayMatcher().snapshot(hass)
    today = dt_util.now().date()
    assert snap.today == today
    assert snap.weekday == today.weekday()
    from calendar import monthrange

    assert snap.days_in_month == monthrange(today.year, today.month)[1]
    assert snap.workday_state is None
    assert snap.month_workdays is None


async def test_snapshot_reads_workday_sensor_state(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    hass.states.async_set("binary_sensor.workday", "on")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state == "on"


async def test_snapshot_workday_sensor_unavailable_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_workday_sensor_unknown_state_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    hass.states.async_set("binary_sensor.workday", "unknown")
    snap = await DayMatcher().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_month_workdays_none_without_calendar(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayMatcher().snapshot(hass)
    assert snap.month_workdays is None


async def test_snapshot_month_workdays_from_calendar_events(hass: HomeAssistant) -> None:
    """Calendar entity emits events for workdays; the snapshot collects their start
    dates within the current month, sorted."""
    _install_store_stub(hass, workday_calendar="calendar.workday")
    today = dt_util.now().date()

    class _Event:
        def __init__(self, day: int):
            self.start = date(today.year, today.month, day)

    async def fake_fetch(hass_, entity_id, start, end):
        assert entity_id == "calendar.workday"
        assert start.date() == date(today.year, today.month, 1)
        return [_Event(2), _Event(3), _Event(4), _Event(5), _Event(6)]

    with patch(
        "custom_components.ambience.matchers.day._fetch_calendar_events",
        new=fake_fetch,
    ):
        snap = await DayMatcher().snapshot(hass)

    assert snap.month_workdays == tuple(date(today.year, today.month, d) for d in (2, 3, 4, 5, 6))


async def test_snapshot_month_workdays_handles_fetch_error(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    _install_store_stub(hass, workday_calendar="calendar.workday")

    async def boom(*_args, **_kwargs):
        raise RuntimeError("entity missing")

    with patch(
        "custom_components.ambience.matchers.day._fetch_calendar_events",
        new=boom,
    ):
        snap = await DayMatcher().snapshot(hass)

    assert snap.month_workdays is None
    assert "entity missing" in caplog.text


def test_matches_weekday() -> None:
    m = DayMatcher()
    mon = _snap(date(2026, 5, 18))  # Monday
    fri = _snap(date(2026, 5, 22))  # Friday
    pred = {"include": [{"kind": "weekday", "days": [0, 4]}], "exclude": []}
    assert m.matches(pred, mon) is True
    assert m.matches(pred, fri) is True
    sat = _snap(date(2026, 5, 23))  # Saturday
    assert m.matches(pred, sat) is False


def test_matches_day_of_month() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "day_of_month", "days": "1, 15"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is True
    assert m.matches(pred, _snap(date(2026, 5, 15))) is True
    assert m.matches(pred, _snap(date(2026, 5, 16))) is False


def test_matches_day_of_month_ranges() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "day_of_month", "days": "1-10, 15"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is True
    assert m.matches(pred, _snap(date(2026, 5, 10))) is True
    assert m.matches(pred, _snap(date(2026, 5, 15))) is True
    assert m.matches(pred, _snap(date(2026, 5, 11))) is False
    assert m.matches(pred, _snap(date(2026, 5, 16))) is False


def test_matches_day_of_month_malformed_spec_does_not_match() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "day_of_month", "days": "garbage"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is False


def test_matches_last_day() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "last_day"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 31), days_in_month=31)) is True
    assert m.matches(pred, _snap(date(2026, 5, 30), days_in_month=31)) is False


def test_matches_workday_and_holiday() -> None:
    m = DayMatcher()
    work_pred = {"include": [{"kind": "workday"}], "exclude": []}
    hol_pred = {"include": [{"kind": "holiday"}], "exclude": []}
    on = _snap(date(2026, 5, 18), workday_state="on")
    off = _snap(date(2026, 5, 17), workday_state="off")
    unknown = _snap(date(2026, 5, 18), workday_state=None)
    assert m.matches(work_pred, on) is True
    assert m.matches(work_pred, off) is False
    assert m.matches(work_pred, unknown) is False
    assert m.matches(hol_pred, off) is True
    assert m.matches(hol_pred, on) is False
    assert m.matches(hol_pred, unknown) is False


def test_matches_date_annual() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "date", "month": 12, "day": 25}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 12, 25))) is True
    assert m.matches(pred, _snap(date(2027, 12, 25))) is True
    assert m.matches(pred, _snap(date(2026, 12, 24))) is False


def test_matches_date_range_forward() -> None:
    m = DayMatcher()
    pred = {
        "include": [
            {"kind": "date_range", "from": {"month": 7, "day": 15}, "to": {"month": 8, "day": 31}}
        ],
        "exclude": [],
    }
    assert m.matches(pred, _snap(date(2026, 7, 15))) is True
    assert m.matches(pred, _snap(date(2026, 8, 31))) is True
    assert m.matches(pred, _snap(date(2026, 7, 14))) is False
    assert m.matches(pred, _snap(date(2026, 9, 1))) is False


def test_matches_date_range_wraparound() -> None:
    m = DayMatcher()
    pred = {
        "include": [
            {"kind": "date_range", "from": {"month": 12, "day": 20}, "to": {"month": 1, "day": 5}}
        ],
        "exclude": [],
    }
    assert m.matches(pred, _snap(date(2026, 12, 31))) is True
    assert m.matches(pred, _snap(date(2026, 1, 5))) is True
    assert m.matches(pred, _snap(date(2026, 6, 1))) is False


def test_matches_first_workday() -> None:
    m = DayMatcher()
    workdays = tuple(date(2026, 5, d) for d in (4, 5, 6, 7, 8, 11, 12, 13, 14, 15))
    pred = {"include": [{"kind": "first_workday"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 4), month_workdays=workdays)) is True
    assert m.matches(pred, _snap(date(2026, 5, 5), month_workdays=workdays)) is False
    assert m.matches(pred, _snap(date(2026, 5, 4), month_workdays=None)) is False


def test_matches_last_workday() -> None:
    m = DayMatcher()
    workdays = tuple(date(2026, 5, d) for d in (4, 5, 6, 7, 8, 11, 12, 13, 14, 15))
    pred = {"include": [{"kind": "last_workday"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 15), month_workdays=workdays)) is True
    assert m.matches(pred, _snap(date(2026, 5, 14), month_workdays=workdays)) is False
    assert m.matches(pred, _snap(date(2026, 5, 15), month_workdays=None)) is False


def test_matches_null_predicate_is_wildcard() -> None:
    assert DayMatcher().matches(None, _snap(date(2026, 5, 1))) is True


def test_matches_empty_include_is_all_days() -> None:
    m = DayMatcher()
    pred = {"include": [], "exclude": [{"kind": "weekday", "days": [5, 6]}]}
    assert m.matches(pred, _snap(date(2026, 5, 18))) is True  # Mon
    assert m.matches(pred, _snap(date(2026, 5, 23))) is False  # Sat


def test_matches_exclude_overrides_include() -> None:
    m = DayMatcher()
    pred = {
        "include": [{"kind": "weekday", "days": [0, 1, 2, 3, 4]}],
        "exclude": [{"kind": "date", "month": 5, "day": 18}],
    }
    assert m.matches(pred, _snap(date(2026, 5, 19))) is True  # Tue, kept
    assert m.matches(pred, _snap(date(2026, 5, 18))) is False  # Mon May 18, excluded


def test_matches_unknown_kind_evaluates_false() -> None:
    m = DayMatcher()
    pred = {"include": [{"kind": "wat", "x": 1}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 18))) is False


@pytest.fixture
def m_with_entities(hass: HomeAssistant) -> DayMatcher:
    _install_store_stub(
        hass,
        workday_sensor="binary_sensor.workday",
        workday_calendar="calendar.workday",
    )
    return DayMatcher(hass=hass)


@pytest.fixture
def m_no_entities(hass: HomeAssistant) -> DayMatcher:
    _install_store_stub(hass)
    return DayMatcher(hass=hass)


def test_validate_accepts_null(m_no_entities: DayMatcher) -> None:
    m_no_entities.validate_predicate(None)  # no raise


def test_validate_rejects_non_dict(m_no_entities: DayMatcher) -> None:
    with pytest.raises(ValueError):
        m_no_entities.validate_predicate(42)


def test_validate_rejects_unknown_kind(m_no_entities: DayMatcher) -> None:
    with pytest.raises(ValueError, match="unknown day item kind"):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "wat"}],
                "exclude": [],
            }
        )


@pytest.mark.parametrize("days", [[], [-1], [7], "abc", 5])
def test_validate_rejects_bad_weekday_days(m_no_entities: DayMatcher, days) -> None:
    with pytest.raises(ValueError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "weekday", "days": days}],
                "exclude": [],
            }
        )


@pytest.mark.parametrize("days", ["", "0", "32", "abc", "5-", "-5", "10-2", ",,,", 5, [1, 2]])
def test_validate_rejects_bad_day_of_month(m_no_entities: DayMatcher, days) -> None:
    with pytest.raises(ValueError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "day_of_month", "days": days}],
                "exclude": [],
            }
        )


@pytest.mark.parametrize("days", ["1", "1, 15, 31", "1-10", "1-10, 15", " 2 - 4 , 20 "])
def test_validate_accepts_day_of_month_specs(m_no_entities: DayMatcher, days) -> None:
    m_no_entities.validate_predicate(
        {
            "include": [{"kind": "day_of_month", "days": days}],
            "exclude": [],
        }
    )


@pytest.mark.parametrize("month,day", [(0, 1), (13, 1), (1, 0), (1, 32), (None, 1)])
def test_validate_rejects_bad_date(m_no_entities: DayMatcher, month, day) -> None:
    with pytest.raises(ValueError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "date", "month": month, "day": day}],
                "exclude": [],
            }
        )


def test_validate_rejects_bad_date_range(m_no_entities: DayMatcher) -> None:
    with pytest.raises(ValueError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "date_range", "from": {"month": 1, "day": 1}}],
                "exclude": [],
            }
        )


def test_validate_workday_item_requires_sensor(m_no_entities: DayMatcher) -> None:
    with pytest.raises(ValueError, match="workday_sensor"):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "workday"}],
                "exclude": [],
            }
        )


def test_validate_first_workday_requires_calendar(m_no_entities: DayMatcher) -> None:
    with pytest.raises(ValueError, match="workday_calendar"):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "first_workday"}],
                "exclude": [],
            }
        )


def test_validate_with_entities_accepts_workday_items(m_with_entities: DayMatcher) -> None:
    m_with_entities.validate_predicate(
        {
            "include": [{"kind": "workday"}, {"kind": "first_workday"}],
            "exclude": [{"kind": "holiday"}, {"kind": "last_workday"}],
        }
    )
