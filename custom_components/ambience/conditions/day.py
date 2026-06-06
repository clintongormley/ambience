"""Built-in `day` condition — date / weekday / workday predicate."""

from __future__ import annotations

import logging
from calendar import monthrange
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import get_store
from ..triggers import TriggerSpec

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


def _parse_day_spec(spec: Any) -> list[tuple[int, int]]:
    """Parse a day-of-month spec like "1-10, 15" into inclusive (lo, hi) ranges.

    Accepts single days ("15") and inclusive ranges ("1-10"), comma-separated,
    whitespace tolerated. Raises ValueError on anything malformed or out of the
    1-31 bounds (or a reversed range). At least one token is required.
    """
    if not isinstance(spec, str):
        raise ValueError(f"day_of_month `days` must be a string spec: {spec!r}")
    tokens = [t.strip() for t in spec.split(",") if t.strip()]
    if not tokens:
        raise ValueError("day_of_month `days` must list at least one day")
    ranges: list[tuple[int, int]] = []
    for tok in tokens:
        if "-" in tok:
            parts = [p.strip() for p in tok.split("-")]
            if len(parts) != 2 or not (parts[0].isdigit() and parts[1].isdigit()):
                raise ValueError(f"invalid day range: {tok!r}")
            lo, hi = int(parts[0]), int(parts[1])
            if not 1 <= lo <= hi <= 31:
                raise ValueError(f"day range out of bounds (1-31, lo<=hi): {tok!r}")
            ranges.append((lo, hi))
        else:
            if not tok.isdigit():
                raise ValueError(f"invalid day: {tok!r}")
            d = int(tok)
            if not 1 <= d <= 31:
                raise ValueError(f"day out of bounds (1-31): {tok!r}")
            ranges.append((d, d))
    return ranges


class DayCondition:
    name = "day"
    description = "Matches based on the current date, weekday, or workday status."
    predicate_help = (
        "Object {include: [...], exclude: [...]}. Items: "
        "{kind: 'weekday', days}, {kind: 'day_of_month', days}, "
        "{kind: 'date', month, day}, {kind: 'date_range', from, to}, "
        "{kind: 'last_day'}, {kind: 'workday'}, {kind: 'holiday'}, "
        "{kind: 'first_workday'}, {kind: 'last_workday'}."
    )
    input = "day_predicate"
    # Higher than time_of_day: day sorts first as a linearisation tiebreaker
    # (which date the scene's about disambiguates before which hour).
    priority = 900

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    def _day_config(self) -> dict[str, Any]:
        if self._hass is None:
            return {"workday_sensor": None, "workday_calendar": None}
        store = get_store(self._hass)
        if store is None:
            return {"workday_sensor": None, "workday_calendar": None}
        return store.get_condition_config("day")

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not entity-driven
    ) -> DaySnapshot:
        from ..const import DATA_STORE, DOMAIN  # local import to avoid cycles

        store = hass.data[DOMAIN][DATA_STORE]
        cfg = store.get_condition_config("day")
        today = dt_util.as_local(now).date() if now is not None else dt_util.now().date()
        month_workdays = await self._fetch_month_workdays(hass, cfg.get("workday_calendar"), today)
        if now is not None and cfg.get("workday_calendar") and month_workdays is not None:
            # Simulating a specific date with a calendar configured: derive
            # workday from the calendar so it is correct for the chosen date,
            # rather than reading the live "is today a workday" binary sensor.
            workday_state = "on" if today in month_workdays else "off"
        else:
            workday_state = self._read_workday_sensor(hass, cfg.get("workday_sensor"))
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
            _LOGGER.warning("day condition: failed to fetch workday calendar events: %s", exc)
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
            try:
                ranges = _parse_day_spec(item.get("days"))
            except ValueError:
                return False
            return any(lo <= snap.today.day <= hi for lo, hi in ranges)
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
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError(f"day predicate must be an object or null: {predicate!r}")
        for key in ("include", "exclude"):
            value = predicate.get(key, [])
            if not isinstance(value, list):
                raise ValueError(f"day predicate `{key}` must be a list")
            for item in value:
                self._validate_item(item)

    def _validate_item(self, item: Any) -> None:
        if not isinstance(item, dict) or "kind" not in item:
            raise ValueError(f"day item must be {{kind, ...}}: {item!r}")
        kind = item["kind"]
        if kind == "weekday":
            self._validate_int_list(item.get("days"), 0, 6, "weekday")
        elif kind == "day_of_month":
            _parse_day_spec(item.get("days"))
        elif kind == "date":
            self._validate_month_day(item.get("month"), item.get("day"))
        elif kind == "date_range":
            self._validate_month_day(
                (item.get("from") or {}).get("month"),
                (item.get("from") or {}).get("day"),
            )
            self._validate_month_day(
                (item.get("to") or {}).get("month"),
                (item.get("to") or {}).get("day"),
            )
        elif kind == "last_day":
            pass
        elif kind in ("workday", "holiday"):
            if not self._day_config().get("workday_sensor"):
                raise ValueError(f"day item {kind!r} requires `workday_sensor` to be configured")
        elif kind in ("first_workday", "last_workday"):
            if not self._day_config().get("workday_calendar"):
                raise ValueError(f"day item {kind!r} requires `workday_calendar` to be configured")
        else:
            raise ValueError(f"unknown day item kind: {kind!r}")

    @staticmethod
    def _validate_int_list(value: Any, lo: int, hi: int, label: str) -> None:
        if not isinstance(value, list) or not value:
            raise ValueError(f"day item {label!r}: `days` must be a non-empty list")
        for v in value:
            if not isinstance(v, int) or not lo <= v <= hi:
                raise ValueError(
                    f"day item {label!r}: invalid day {v!r}; expected int in [{lo},{hi}]"
                )

    @staticmethod
    def _validate_month_day(month: Any, day: Any) -> None:
        if not isinstance(month, int) or not 1 <= month <= 12:
            raise ValueError(f"day item: invalid month {month!r}")
        if not isinstance(day, int) or not 1 <= day <= 31:
            raise ValueError(f"day item: invalid day {day!r}")

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        entities: set[str] = set()
        if isinstance(predicate, dict):
            include = predicate.get("include")
            exclude = predicate.get("exclude")
            items = (include if isinstance(include, list) else []) + (
                exclude if isinstance(exclude, list) else []
            )
            kinds = {it.get("kind") for it in items if isinstance(it, dict)}
            if kinds & {"workday", "holiday"}:
                sensor = self._day_config().get("workday_sensor")
                if sensor:
                    entities.add(sensor)
            # first_workday / last_workday depend on a calendar entity, not a
            # state entity, so they can't be watched via state-change; the
            # date_rollover re-eval below covers their (rare) changes.
        return TriggerSpec(entities=frozenset(entities), date_rollover=True)
