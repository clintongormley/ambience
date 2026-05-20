"""Built-in `day` matcher — date / weekday / workday predicate."""

from __future__ import annotations

import logging
from calendar import monthrange
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class DaySnapshot:
    today: date
    weekday: int
    days_in_month: int
    workday_state: str | None
    month_workdays: tuple[date, ...] | None


async def _fetch_calendar_events(
    hass: HomeAssistant, entity_id: str, start: datetime, end: datetime
) -> list[Any]:
    """Resolve a calendar entity and call its `async_get_events`. Indirected
    through a module-level function so tests can patch it cheaply."""
    component = hass.data.get("entity_components", {}).get("calendar")
    if component is None:
        raise RuntimeError("calendar component not loaded")
    entity = component.get_entity(entity_id)
    if entity is None:
        raise RuntimeError(f"calendar entity not found: {entity_id}")
    return await entity.async_get_events(hass, start, end)


class DayMatcher:
    name = "day"
    description = "Matches based on the current date, weekday, or workday status."
    predicate_help = (
        "Object {include: [...], exclude: [...]}. Items: "
        "{kind: 'weekday', days}, {kind: 'day_of_month', days}, "
        "{kind: 'date', month, day}, {kind: 'date_range', from, to}, "
        "{kind: 'last_day'}, {kind: 'workday'}, {kind: 'holiday'}, "
        "{kind: 'first_workday'}, {kind: 'last_workday'}."
    )
    toggleable = True
    input = "day_predicate"
    priority = 200

    async def snapshot(self, hass: HomeAssistant) -> DaySnapshot:
        from ..const import DATA_STORE, DOMAIN  # local import to avoid cycles

        store = hass.data[DOMAIN][DATA_STORE]
        cfg = store.get_matcher_config("day")
        today = dt_util.now().date()
        workday_state = self._read_workday_sensor(hass, cfg.get("workday_sensor"))
        month_workdays = await self._fetch_month_workdays(hass, cfg.get("workday_calendar"), today)
        return DaySnapshot(
            today=today,
            weekday=today.weekday(),
            days_in_month=monthrange(today.year, today.month)[1],
            workday_state=workday_state,
            month_workdays=month_workdays,
        )

    @staticmethod
    def _read_workday_sensor(hass: HomeAssistant, entity_id: str | None) -> str | None:
        if not entity_id:
            return None
        state = hass.states.get(entity_id)
        if state is None or state.state not in ("on", "off"):
            return None
        return state.state

    @staticmethod
    async def _fetch_month_workdays(
        hass: HomeAssistant, entity_id: str | None, today: date
    ) -> tuple[date, ...] | None:
        if not entity_id:
            return None
        month_start = dt_util.as_local(datetime.combine(date(today.year, today.month, 1), time.min))
        days_in_month = monthrange(today.year, today.month)[1]
        next_month = date(today.year, today.month, 1) + timedelta(days=days_in_month)
        month_end = dt_util.as_local(datetime.combine(next_month, time.min))
        try:
            events = await _fetch_calendar_events(hass, entity_id, month_start, month_end)
        except Exception as exc:  # noqa: BLE001
            _LOGGER.warning("day matcher: failed to fetch workday calendar events: %s", exc)
            return None
        dates: set[date] = set()
        for event in events:
            start = getattr(event, "start", None)
            if isinstance(start, datetime):
                dates.add(dt_util.as_local(start).date())
            elif isinstance(start, date):
                dates.add(start)
        return tuple(sorted(d for d in dates if d.month == today.month and d.year == today.year))

    def matches(self, predicate: Any, snapshot: DaySnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        include = predicate.get("include") or []
        exclude = predicate.get("exclude") or []
        in_ok = not include or any(self._item_matches(item, snapshot) for item in include)
        out_ok = not exclude or not any(self._item_matches(item, snapshot) for item in exclude)
        return in_ok and out_ok

    def _item_matches(self, item: Any, snap: DaySnapshot) -> bool:
        if not isinstance(item, dict):
            return False
        kind = item.get("kind")
        if kind == "weekday":
            return snap.weekday in set(item.get("days", []))
        if kind == "day_of_month":
            return snap.today.day in set(item.get("days", []))
        if kind == "last_day":
            return snap.today.day == snap.days_in_month
        if kind == "workday":
            return snap.workday_state == "on"
        if kind == "holiday":
            return snap.workday_state == "off"
        if kind == "date":
            return (snap.today.month, snap.today.day) == (item.get("month"), item.get("day"))
        if kind == "date_range":
            return self._date_range_matches(item, snap)
        if kind == "first_workday":
            return (
                snap.month_workdays is not None
                and bool(snap.month_workdays)
                and snap.today == snap.month_workdays[0]
            )
        if kind == "last_workday":
            return (
                snap.month_workdays is not None
                and bool(snap.month_workdays)
                and snap.today == snap.month_workdays[-1]
            )
        return False

    @staticmethod
    def _date_range_matches(item: dict[str, Any], snap: DaySnapshot) -> bool:
        frm, to = item.get("from") or {}, item.get("to") or {}
        today_md = (snap.today.month, snap.today.day)
        from_md = (frm.get("month"), frm.get("day"))
        to_md = (to.get("month"), to.get("day"))
        if None in from_md or None in to_md:
            return False
        if from_md <= to_md:
            return from_md <= today_md <= to_md
        # wraparound (e.g. Dec 20 -> Jan 5)
        return today_md >= from_md or today_md <= to_md

    def describe(self, snapshot: DaySnapshot) -> str | None:
        return None

    def validate_predicate(self, predicate: Any) -> None:
        raise NotImplementedError
