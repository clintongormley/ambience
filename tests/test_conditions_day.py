"""DayCondition — date / weekday / workday predicate."""

from __future__ import annotations

from datetime import UTC, date, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions._common import Reason
from custom_components.ambience.conditions.day import (
    DayCondition,
    DaySnapshot,
    _fetch_calendar_events,
)
from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.errors import AmbienceError


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


def test_condition_protocol_fields() -> None:
    m = DayCondition()
    assert m.name == "day"
    assert not hasattr(m, "toggleable")
    assert m.input == "day_predicate"
    assert m.priority == 900
    assert m.description.strip() != ""
    assert m.predicate_help.strip() != ""


def _install_store_stub(hass: HomeAssistant, **day_config) -> None:
    """Plant a minimal store stub at hass.data[DOMAIN][DATA_STORE]."""

    class _Store:
        def get_condition_config(self, name: str) -> dict[str, object]:
            if name == "day":
                return {
                    "workday_sensor": day_config.get("workday_sensor"),
                    "workday_calendar": day_config.get("workday_calendar"),
                }
            return {}

    hass.data.setdefault(DOMAIN, {})[DATA_STORE] = _Store()


async def test_snapshot_today_weekday_days_in_month(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayCondition().snapshot(hass)
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
    snap = await DayCondition().snapshot(hass)
    assert snap.workday_state == "on"


async def test_snapshot_workday_sensor_unavailable_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    snap = await DayCondition().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_workday_sensor_unknown_state_yields_none(hass: HomeAssistant) -> None:
    _install_store_stub(hass, workday_sensor="binary_sensor.workday")
    hass.states.async_set("binary_sensor.workday", "unknown")
    snap = await DayCondition().snapshot(hass)
    assert snap.workday_state is None


async def test_snapshot_month_workdays_none_without_calendar(hass: HomeAssistant) -> None:
    _install_store_stub(hass)
    snap = await DayCondition().snapshot(hass)
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
        "custom_components.ambience.conditions.day._fetch_calendar_events",
        new=fake_fetch,
    ):
        snap = await DayCondition().snapshot(hass)

    assert snap.month_workdays == tuple(date(today.year, today.month, d) for d in (2, 3, 4, 5, 6))


async def test_snapshot_month_workdays_handles_fetch_error(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    _install_store_stub(hass, workday_calendar="calendar.workday")

    async def boom(*_args, **_kwargs):
        raise RuntimeError("entity missing")

    with patch(
        "custom_components.ambience.conditions.day._fetch_calendar_events",
        new=boom,
    ):
        snap = await DayCondition().snapshot(hass)

    assert snap.month_workdays is None
    assert "entity missing" in caplog.text


def test_matches_weekday() -> None:
    m = DayCondition()
    mon = _snap(date(2026, 5, 18))  # Monday
    fri = _snap(date(2026, 5, 22))  # Friday
    pred = {"include": [{"kind": "weekday", "days": [0, 4]}], "exclude": []}
    assert m.matches(pred, mon) is True
    assert m.matches(pred, fri) is True
    sat = _snap(date(2026, 5, 23))  # Saturday
    assert m.matches(pred, sat) is False


def test_matches_weekday_null_days_does_not_match_or_raise() -> None:
    """A malformed `days: null` weekday item is simply unsatisfied, not fatal."""
    m = DayCondition()
    mon = _snap(date(2026, 5, 18))  # Monday
    assert m.matches({"include": [{"kind": "weekday", "days": None}]}, mon) is False
    # In `exclude` it excludes nothing, so the (wildcard) include still matches.
    assert m.matches({"exclude": [{"kind": "weekday", "days": None}]}, mon) is True


def test_matches_day_of_month() -> None:
    m = DayCondition()
    pred = {"include": [{"kind": "day_of_month", "days": "1, 15"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is True
    assert m.matches(pred, _snap(date(2026, 5, 15))) is True
    assert m.matches(pred, _snap(date(2026, 5, 16))) is False


def test_matches_day_of_month_ranges() -> None:
    m = DayCondition()
    pred = {"include": [{"kind": "day_of_month", "days": "1-10, 15"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is True
    assert m.matches(pred, _snap(date(2026, 5, 10))) is True
    assert m.matches(pred, _snap(date(2026, 5, 15))) is True
    assert m.matches(pred, _snap(date(2026, 5, 11))) is False
    assert m.matches(pred, _snap(date(2026, 5, 16))) is False


def test_matches_day_of_month_malformed_spec_does_not_match() -> None:
    m = DayCondition()
    pred = {"include": [{"kind": "day_of_month", "days": "garbage"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 1))) is False


def test_matches_last_day() -> None:
    m = DayCondition()
    pred = {"include": [{"kind": "last_day"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 31), days_in_month=31)) is True
    assert m.matches(pred, _snap(date(2026, 5, 30), days_in_month=31)) is False


def test_matches_workday_and_holiday() -> None:
    m = DayCondition()
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
    m = DayCondition()
    pred = {"include": [{"kind": "date", "month": 12, "day": 25}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 12, 25))) is True
    assert m.matches(pred, _snap(date(2027, 12, 25))) is True
    assert m.matches(pred, _snap(date(2026, 12, 24))) is False


def test_matches_date_range_forward() -> None:
    m = DayCondition()
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
    m = DayCondition()
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
    m = DayCondition()
    workdays = tuple(date(2026, 5, d) for d in (4, 5, 6, 7, 8, 11, 12, 13, 14, 15))
    pred = {"include": [{"kind": "first_workday"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 4), month_workdays=workdays)) is True
    assert m.matches(pred, _snap(date(2026, 5, 5), month_workdays=workdays)) is False
    assert m.matches(pred, _snap(date(2026, 5, 4), month_workdays=None)) is False


def test_matches_last_workday() -> None:
    m = DayCondition()
    workdays = tuple(date(2026, 5, d) for d in (4, 5, 6, 7, 8, 11, 12, 13, 14, 15))
    pred = {"include": [{"kind": "last_workday"}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 15), month_workdays=workdays)) is True
    assert m.matches(pred, _snap(date(2026, 5, 14), month_workdays=workdays)) is False
    assert m.matches(pred, _snap(date(2026, 5, 15), month_workdays=None)) is False


def test_matches_null_predicate_is_wildcard() -> None:
    assert DayCondition().matches(None, _snap(date(2026, 5, 1))) is True


def test_matches_empty_include_is_all_days() -> None:
    m = DayCondition()
    pred = {"include": [], "exclude": [{"kind": "weekday", "days": [5, 6]}]}
    assert m.matches(pred, _snap(date(2026, 5, 18))) is True  # Mon
    assert m.matches(pred, _snap(date(2026, 5, 23))) is False  # Sat


def test_matches_exclude_overrides_include() -> None:
    m = DayCondition()
    pred = {
        "include": [{"kind": "weekday", "days": [0, 1, 2, 3, 4]}],
        "exclude": [{"kind": "date", "month": 5, "day": 18}],
    }
    assert m.matches(pred, _snap(date(2026, 5, 19))) is True  # Tue, kept
    assert m.matches(pred, _snap(date(2026, 5, 18))) is False  # Mon May 18, excluded


def test_matches_unknown_kind_evaluates_false() -> None:
    m = DayCondition()
    pred = {"include": [{"kind": "wat", "x": 1}], "exclude": []}
    assert m.matches(pred, _snap(date(2026, 5, 18))) is False


@pytest.fixture
def m_with_entities(hass: HomeAssistant) -> DayCondition:
    _install_store_stub(
        hass,
        workday_sensor="binary_sensor.workday",
        workday_calendar="calendar.workday",
    )
    return DayCondition(hass=hass)


@pytest.fixture
def m_no_entities(hass: HomeAssistant) -> DayCondition:
    _install_store_stub(hass)
    return DayCondition(hass=hass)


def test_validate_accepts_null(m_no_entities: DayCondition) -> None:
    m_no_entities.validate_predicate(None)  # no raise


def test_validate_rejects_non_dict(m_no_entities: DayCondition) -> None:
    with pytest.raises(AmbienceError) as exc:
        m_no_entities.validate_predicate(42)
    assert exc.value.translation_key == "day_predicate_not_object"


@pytest.mark.parametrize("item", [None, "weekday", 42, [{"kind": "weekday"}], {"days": [0]}])
def test_validate_rejects_item_without_kind(m_no_entities: DayCondition, item) -> None:
    """An include/exclude entry that is not an object carrying a `kind` is
    malformed — matching tolerates it, saving must not."""
    with pytest.raises(AmbienceError) as exc:
        m_no_entities.validate_predicate({"include": [item], "exclude": []})
    assert exc.value.translation_key == "day_item_malformed"


def test_validate_rejects_unknown_kind(m_no_entities: DayCondition) -> None:
    with pytest.raises(AmbienceError) as exc:
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "wat"}],
                "exclude": [],
            }
        )
    assert exc.value.translation_key == "day_unknown_kind"


@pytest.mark.parametrize("days", [[], [-1], [7], "abc", 5])
def test_validate_rejects_bad_weekday_days(m_no_entities: DayCondition, days) -> None:
    with pytest.raises(AmbienceError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "weekday", "days": days}],
                "exclude": [],
            }
        )


@pytest.mark.parametrize("days", ["", "0", "32", "abc", "5-", "-5", "10-2", ",,,", 5, [1, 2]])
def test_validate_rejects_bad_day_of_month(m_no_entities: DayCondition, days) -> None:
    with pytest.raises(AmbienceError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "day_of_month", "days": days}],
                "exclude": [],
            }
        )


@pytest.mark.parametrize("days", ["1", "1, 15, 31", "1-10", "1-10, 15", " 2 - 4 , 20 "])
def test_validate_accepts_day_of_month_specs(m_no_entities: DayCondition, days) -> None:
    m_no_entities.validate_predicate(
        {
            "include": [{"kind": "day_of_month", "days": days}],
            "exclude": [],
        }
    )


@pytest.mark.parametrize("month,day", [(0, 1), (13, 1), (1, 0), (1, 32), (None, 1)])
def test_validate_rejects_bad_date(m_no_entities: DayCondition, month, day) -> None:
    with pytest.raises(AmbienceError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "date", "month": month, "day": day}],
                "exclude": [],
            }
        )


def test_validate_rejects_bad_date_range(m_no_entities: DayCondition) -> None:
    with pytest.raises(AmbienceError):
        m_no_entities.validate_predicate(
            {
                "include": [{"kind": "date_range", "from": {"month": 1, "day": 1}}],
                "exclude": [],
            }
        )


def test_validate_with_entities_accepts_workday_items(m_with_entities: DayCondition) -> None:
    m_with_entities.validate_predicate(
        {
            "include": [{"kind": "workday"}, {"kind": "first_workday"}],
            "exclude": [{"kind": "holiday"}, {"kind": "last_workday"}],
        }
    )


def test_day_validate_predicate_allows_workday_without_sensor() -> None:
    # Structurally valid; the missing sensor is a config-health problem, not malformed data.
    DayCondition(hass=None).validate_predicate({"include": [{"kind": "workday"}]})  # no raise
    DayCondition(hass=None).validate_predicate({"include": [{"kind": "first_workday"}]})  # no raise


def _condition_with_workday_sensor(sensor: str | None) -> DayCondition:
    hass = MagicMock()
    store = MagicMock()
    store.get_condition_config.return_value = {
        "workday_sensor": sensor,
        "workday_calendar": None,
    }
    hass.data = {DOMAIN: {DATA_STORE: store}}
    return DayCondition(hass=hass)


def test_trigger_deps_always_sets_date_rollover() -> None:
    m = _condition_with_workday_sensor(None)
    spec = m.trigger_deps({"include": [{"kind": "weekday", "days": [0, 1]}]})
    assert spec.date_rollover is True
    assert spec.entities == frozenset()


def test_trigger_deps_watches_workday_sensor_when_used() -> None:
    m = _condition_with_workday_sensor("binary_sensor.workday")
    spec = m.trigger_deps({"include": [{"kind": "workday"}]})
    assert spec.date_rollover is True
    assert spec.entities == frozenset({"binary_sensor.workday"})


def test_trigger_deps_ignores_workday_sensor_when_not_used() -> None:
    m = _condition_with_workday_sensor("binary_sensor.workday")
    spec = m.trigger_deps({"include": [{"kind": "weekday", "days": [5, 6]}]})
    assert spec.entities == frozenset()


def test_trigger_deps_watches_workday_sensor_in_exclude() -> None:
    m = _condition_with_workday_sensor("binary_sensor.workday")
    spec = m.trigger_deps({"exclude": [{"kind": "holiday"}]})
    assert spec.entities == frozenset({"binary_sensor.workday"})


def test_trigger_deps_tolerates_garbage_input() -> None:
    m = _condition_with_workday_sensor("binary_sensor.workday")
    for bad in [
        None,
        "string",
        42,
        {"include": "workday"},
        {"include": {"kind": "workday"}},
        {"include": [None, "x"]},
    ]:
        spec = m.trigger_deps(bad)
        assert spec.date_rollover is True
        assert spec.entities == frozenset()


# ---------------------------------------------------------------------------
# _fetch_calendar_events — real function (lines 34-40)
# ---------------------------------------------------------------------------


async def test_fetch_calendar_events_raises_when_calendar_component_missing(
    hass: HomeAssistant,
) -> None:
    """No 'calendar' key in entity_components → RuntimeError."""
    hass.data.pop("entity_components", None)
    start = dt_util.as_local(datetime(2026, 5, 1, 0, 0, tzinfo=UTC))
    end = dt_util.as_local(datetime(2026, 6, 1, 0, 0, tzinfo=UTC))
    with pytest.raises(RuntimeError, match="calendar component not loaded"):
        await _fetch_calendar_events(hass, "calendar.work", start, end)


async def test_fetch_calendar_events_raises_when_entity_missing(
    hass: HomeAssistant,
) -> None:
    """Calendar component present but entity_id not found → RuntimeError."""
    component = MagicMock()
    component.get_entity.return_value = None
    hass.data.setdefault("entity_components", {})["calendar"] = component
    start = dt_util.as_local(datetime(2026, 5, 1, 0, 0, tzinfo=UTC))
    end = dt_util.as_local(datetime(2026, 6, 1, 0, 0, tzinfo=UTC))
    with pytest.raises(RuntimeError, match="calendar entity not found: calendar.work"):
        await _fetch_calendar_events(hass, "calendar.work", start, end)


async def test_fetch_calendar_events_delegates_to_entity(
    hass: HomeAssistant,
) -> None:
    """Happy path: entity.async_get_events is called and its result returned."""
    fake_events = [object(), object()]
    entity = MagicMock()
    entity.async_get_events = AsyncMock(return_value=fake_events)
    component = MagicMock()
    component.get_entity.return_value = entity
    hass.data.setdefault("entity_components", {})["calendar"] = component
    start = dt_util.as_local(datetime(2026, 5, 1, 0, 0, tzinfo=UTC))
    end = dt_util.as_local(datetime(2026, 6, 1, 0, 0, tzinfo=UTC))
    result = await _fetch_calendar_events(hass, "calendar.work", start, end)
    assert result is fake_events
    entity.async_get_events.assert_awaited_once_with(hass, start, end)


# ---------------------------------------------------------------------------
# _day_config — hass-is-None and store-is-None branches (lines 95, 98)
# ---------------------------------------------------------------------------


def test_day_config_returns_defaults_when_hass_is_none() -> None:
    """DayCondition(hass=None)._day_config() should return sentinel defaults (line 95)."""
    m = DayCondition(hass=None)
    cfg = m._day_config()
    assert cfg == {"workday_sensor": None, "workday_calendar": None}


def test_day_config_returns_defaults_when_store_is_none() -> None:
    """_day_config() returns defaults when get_store returns None (line 98)."""
    hass = MagicMock()
    # hass.data has no DOMAIN key → get_store returns None
    hass.data = {}
    m = DayCondition(hass=hass)
    cfg = m._day_config()
    assert cfg == {"workday_sensor": None, "workday_calendar": None}


# ---------------------------------------------------------------------------
# matches — non-dict predicate (line 160)
# ---------------------------------------------------------------------------


def test_matches_non_dict_predicate_returns_false() -> None:
    """A non-dict, non-None predicate must return False (line 160)."""
    m = DayCondition()
    snap = _snap(date(2026, 5, 18))
    for bad in ["string", 42, [{"kind": "weekday", "days": [0]}], True]:
        assert m.matches(bad, snap) is False


# ---------------------------------------------------------------------------
# _item_matches — non-dict item (line 169)
# ---------------------------------------------------------------------------


def test_item_matches_non_dict_item_returns_false() -> None:
    """Items that are not dicts should return False (line 169)."""
    m = DayCondition()
    snap = _snap(date(2026, 5, 18))
    for bad_item in [None, "weekday", 42, [{"kind": "weekday"}]]:
        pred = {"include": [bad_item], "exclude": []}
        assert m.matches(pred, snap) is False


# ---------------------------------------------------------------------------
# _date_range_matches — None in from/to fields (line 210)
# ---------------------------------------------------------------------------


def test_date_range_returns_false_when_from_incomplete() -> None:
    """Missing 'month' or 'day' in from/to → False (line 210)."""
    m = DayCondition()
    snap = _snap(date(2026, 7, 20))
    # 'from' missing 'day'
    pred = {
        "include": [{"kind": "date_range", "from": {"month": 7}, "to": {"month": 8, "day": 31}}],
        "exclude": [],
    }
    assert m.matches(pred, snap) is False


def test_date_range_returns_false_when_to_incomplete() -> None:
    """Missing key in 'to' dict → False (line 210)."""
    m = DayCondition()
    snap = _snap(date(2026, 7, 20))
    pred = {
        "include": [{"kind": "date_range", "from": {"month": 7, "day": 1}, "to": {"month": 8}}],
        "exclude": [],
    }
    assert m.matches(pred, snap) is False


# ---------------------------------------------------------------------------
# describe — always returns None (line 217)
# ---------------------------------------------------------------------------


def test_describe_returns_none() -> None:
    """describe() is defined to return None always (line 217)."""
    m = DayCondition()
    assert m.describe(_snap(date(2026, 5, 18))) is None


# ---------------------------------------------------------------------------
# validate_predicate — non-list include/exclude (line 227)
# ---------------------------------------------------------------------------


def test_validate_rejects_non_list_include() -> None:
    """include/exclude must be lists; a non-list value is rejected."""
    m = DayCondition()
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"include": {"kind": "weekday", "days": [0]}, "exclude": []})
    assert exc.value.translation_key == "day_list_not_list"
    assert exc.value.translation_placeholders == {"key": "include"}


def test_validate_rejects_non_list_exclude() -> None:
    """Validates both include and exclude keys."""
    m = DayCondition()
    with pytest.raises(AmbienceError) as exc:
        m.validate_predicate({"include": [], "exclude": "weekend"})
    assert exc.value.translation_key == "day_list_not_list"
    assert exc.value.translation_placeholders == {"key": "exclude"}


# ---------------------------------------------------------------------------
# _validate_item — last_day pass branch (line 251)
# ---------------------------------------------------------------------------


def test_validate_last_day_item_is_accepted() -> None:
    """last_day item has no fields to validate — pass branch (line 251)."""
    m = DayCondition()
    m.validate_predicate({"include": [{"kind": "last_day"}], "exclude": []})


# ---------------------------------------------------------------------------
# _validate_int_list — loop exit without raise (lines 265->exit, 266->265)
# ---------------------------------------------------------------------------


def test_validate_int_list_valid_values_do_not_raise() -> None:
    """All valid ints pass through the loop without raising (lines 265->exit, 266->265)."""
    m = DayCondition()
    # weekday list [0,1,2,3,4] — all valid ints in [0,6]; loop exits cleanly
    m.validate_predicate({"include": [{"kind": "weekday", "days": [0, 1, 2, 3, 4]}], "exclude": []})


# ---------------------------------------------------------------------------
# trigger_deps — workday/holiday kind but sensor is None (line 291->296)
# ---------------------------------------------------------------------------


def test_trigger_deps_workday_kind_no_sensor_configured_yields_empty_entities() -> None:
    """When workday/holiday kind is used but no sensor is configured, entities stays
    empty (branch 291->296: sensor is falsy so entities.add is skipped)."""
    m = _condition_with_workday_sensor(None)
    spec = m.trigger_deps({"include": [{"kind": "workday"}]})
    assert spec.date_rollover is True
    assert spec.entities == frozenset()


def test_is_constraining_only_with_items() -> None:
    """{include: [], exclude: []} matches everything — a sorting wildcard, not
    a real constraint (mirrors lux/occupancy)."""
    m = DayCondition()
    assert m.is_constraining({"include": [{"kind": "last_day"}], "exclude": []}) is True
    assert m.is_constraining({"include": [], "exclude": [{"kind": "workday"}]}) is True
    assert m.is_constraining({"include": [], "exclude": []}) is False
    assert m.is_constraining({}) is False
    assert m.is_constraining("not-a-dict") is False


# ---------------------------------------------------------------------------
# Regression: unconfigured workday dependency → matches() is False, never raises
# ---------------------------------------------------------------------------


def test_day_matches_workday_no_sensor_is_false() -> None:
    """workday/first_workday predicates with no sensor configured must return
    False at runtime rather than raising — the missing sensor is a config-health
    concern surfaced via Repairs, not a crash path (Task 16 regression guard)."""
    from datetime import date

    snap = DaySnapshot(
        today=date(2026, 6, 15),
        weekday=0,  # Monday
        days_in_month=30,
        workday_state=None,
        month_workdays=None,
    )
    assert DayCondition().matches({"include": [{"kind": "workday"}]}, snap) is False
    assert DayCondition().matches({"include": [{"kind": "first_workday"}]}, snap) is False


def test_unconfigured_reason_tolerates_non_dict_slot(m_no_entities: DayCondition) -> None:
    # A corrupt non-dict slot must not crash; the workday slot still yields the reason.
    pred = {"include": ["garbage", {"kind": "workday"}]}
    assert m_no_entities.unconfigured_reason(pred, None) == Reason(
        "day_workday_sensor_unconfigured"
    )
