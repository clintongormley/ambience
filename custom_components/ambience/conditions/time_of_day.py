"""Built-in time_of_day condition — structured JSON predicate format."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..errors import AmbienceError
from ..sun_position import anchor_datetimes
from ..triggers import TriggerSpec
from ._common import merge_intervals, valid_clock, valid_hour, valid_minute

ANCHOR_ATTR = {
    "sunrise": "next_rising",
    "sunset": "next_setting",
    "noon": "next_noon",
    "midnight": "next_midnight",
    "dawn": "next_dawn",
    "dusk": "next_dusk",
}

_DAY = timedelta(hours=24)
_HALF_DAY = timedelta(hours=12)


@dataclass(frozen=True)
class TimeOfDaySnapshot:
    """Today's anchor times plus 'now', all tz-aware.

    An anchor is None when it is undefined here today (polar day/night: above
    ~60.5°N there is no civil dawn or dusk around midsummer) or when the sun
    integration is absent. Only the endpoints referencing that anchor become
    unobservable — clock endpoints, and ranges built solely from defined
    anchors, keep evaluating."""

    now: datetime
    sunrise: datetime | None
    sunset: datetime | None
    noon: datetime | None
    midnight: datetime | None
    dawn: datetime | None
    dusk: datetime | None
    sun_configured: bool = True


class TimeOfDayCondition:
    """time_of_day condition: named periods, absolute and sun-relative ranges,
    expressed as structured JSON predicates."""

    name = "time_of_day"
    description = "Matches based on the current time of day relative to sun events."
    predicate_help = (
        "Structured JSON predicate: {period: id} | {from, to} | [..., ...]. "
        "Endpoints are {kind: 'time', hh, mm} or {kind: 'sun', anchor, offset_min}."
    )
    input = "time_of_day"
    priority = 800

    def __init__(
        self,
        period_lookup: Callable[[], dict[str, dict[str, Any]]] | None = None,
    ) -> None:
        self._period_lookup = period_lookup or (lambda: {})

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,  # part of the shared contract; not entity-driven
    ) -> TimeOfDaySnapshot:
        # Presence check only — sun.sun being available means the sun integration
        # is configured. The anchors themselves come from astral below, not from
        # this state's attributes; without the integration there are no anchors
        # and only sun-anchored endpoints go unobservable.
        sun_configured = hass.states.get("sun.sun") is not None
        moment = now or dt_util.utcnow()
        # Resolve each anchor to its occurrence on `moment`'s local date rather
        # than reading sun.sun's `next_*` attributes: the moment an event fires,
        # HA rolls `next_*` to tomorrow, and `next_event − 24h` (the ±12h
        # normalisation in `_resolve_endpoint`) drifts a day's solar movement past
        # `now`, flipping a just-crossed boundary back (e.g. blinds reopening the
        # instant after dusk). Today's-date anchors stay put once crossed.
        # Anchors undefined at this location/date are simply absent from the map:
        # a partial snapshot disables only the endpoints that need the missing
        # anchor, where an all-or-nothing failure would make every time_of_day
        # scene — clock ranges included — unavailable for the whole day.
        anchors = anchor_datetimes(hass, moment) if sun_configured else {}
        return TimeOfDaySnapshot(
            now=moment,
            sunrise=anchors.get("sunrise"),
            sunset=anchors.get("sunset"),
            noon=anchors.get("noon"),
            midnight=anchors.get("midnight"),
            dawn=anchors.get("dawn"),
            dusk=anchors.get("dusk"),
            sun_configured=sun_configured,
        )

    def matches(self, predicate: Any, snapshot: TimeOfDaySnapshot) -> bool:
        if isinstance(predicate, list):
            return any(self._match_tolerant(item, snapshot) for item in predicate)
        return self._match_tolerant(predicate, snapshot)

    def _match_tolerant(self, item: Any, snapshot: TimeOfDaySnapshot) -> bool:
        """A period hidden/deleted after save (or a malformed item) fails this
        scene rather than aborting the whole scope-category — mirrors lux.
        Save-time validation still raises via _match_one."""
        try:
            return self._match_one(item, snapshot)
        except AmbienceError:
            return False

    def _match_one(self, item: Any, snapshot: TimeOfDaySnapshot) -> bool:
        start, end = self._resolve_range(item, snapshot)
        # Compare wrap detection and matching in one domain. Two aware datetimes
        # sharing a tzinfo compare by wall clock, so without this a DST switch —
        # where two clock times an hour apart can name the same instant — decides
        # the wrap on the clock but the match on the instant, and the range can
        # never fire.
        start, end = dt_util.as_utc(start), dt_util.as_utc(end)
        now = dt_util.as_utc(snapshot.now)
        if start >= end and (
            self._clamp_emptied(item, snapshot) or (start == end and self._gap_swallowed(item))
        ):
            return False
        # `from` and `to` resolve independently (sun → within ±12h of now,
        # time → on now's local date), so they can land more than a day apart:
        # {sunset, 23:00} evaluated at 00:30 spans 29h and would swallow the
        # small hours. Fold `end` back to within a day of `start`; end <= start
        # then keeps its usual overnight-wrap meaning in _in_range.
        while end - start > _DAY:
            end -= _DAY
        while start - end >= _DAY:
            end += _DAY
        return _in_range(now, start, end)

    def _gap_swallowed(self, item: Any) -> bool:
        """True if a spring-forward gap swallowed the whole range.

        Only consulted once the endpoints resolved to the same instant: two
        different clock times can land on one instant only when both sit inside
        the hour the clock skips. The window never happens today, so the range
        is empty rather than the all-day range that from == to means."""
        clocks = [
            (ep.get("hh"), ep.get("mm"))
            for ep in self._dep_endpoints(item)
            if isinstance(ep, dict) and ep.get("kind") == "time"
        ]
        return len(clocks) == 2 and clocks[0] != clocks[1]

    def _clamp_emptied(self, item: Any, snapshot: TimeOfDaySnapshot) -> bool:
        """True if a clamp turned an otherwise-forward range into an empty one.

        Resolve the range with the clamps stripped: if that ran forward
        (start < end) the range had no genuine overnight wrap, so a clamped
        start >= end is a degenerate empty range (never matches) rather than a
        real wrap. Works for named periods too, since `_dep_endpoints` resolves
        the period definition's endpoints."""
        endpoints = self._dep_endpoints(item)
        if len(endpoints) != 2:  # pragma: no cover - defensive; callers reach here only
            return False  # after _resolve_range succeeded, which guarantees 2 endpoints
        from_ep, to_ep = endpoints
        if not _endpoint_has_clamp(from_ep) and not _endpoint_has_clamp(to_ep):
            return False
        raw_start = self._resolve_endpoint(_strip_clamp(from_ep), snapshot)
        raw_end = self._resolve_endpoint(_strip_clamp(to_ep), snapshot)
        return raw_start < raw_end

    def _resolve_range(
        self, predicate: Any, snapshot: TimeOfDaySnapshot
    ) -> tuple[datetime, datetime]:
        if not isinstance(predicate, dict):
            raise AmbienceError("time_of_day_invalid", predicate=predicate)
        if "period" in predicate:
            pid = predicate["period"]
            if not isinstance(pid, str):
                raise AmbienceError("time_of_day_period_not_string", value=pid)
            periods = self._period_lookup()
            if pid not in periods:
                raise AmbienceError("time_of_day_unknown_period", period=pid)
            defn = periods[pid]
            return (
                self._resolve_endpoint(defn["from"], snapshot),
                self._resolve_endpoint(defn["to"], snapshot),
            )
        if "from" in predicate and "to" in predicate:
            return (
                self._resolve_endpoint(predicate["from"], snapshot),
                self._resolve_endpoint(predicate["to"], snapshot),
            )
        raise AmbienceError("time_of_day_invalid", predicate=predicate)

    def _resolve_endpoint(self, ep: Any, snapshot: TimeOfDaySnapshot) -> datetime:
        if not isinstance(ep, dict):
            raise AmbienceError("period_endpoint_not_object")
        kind = ep.get("kind")
        if kind == "time":
            hh, mm = ep.get("hh"), ep.get("mm")
            # Field by field, not `valid_clock`: each carries its own key.
            if not valid_hour(hh):
                raise AmbienceError("period_invalid_hh", value=hh)
            if not valid_minute(mm):
                raise AmbienceError("period_invalid_mm", value=mm)
            # The absolute time the user entered is HA's local clock time; convert
            # snapshot.now (UTC) to local first so DST is honoured for the date.
            return _resolve_wall_clock(dt_util.as_local(snapshot.now), hh, mm)
        if kind == "sun":
            anchor = ep.get("anchor")
            if anchor not in ANCHOR_ATTR:
                raise AmbienceError("period_invalid_anchor", value=anchor)
            offset = ep.get("offset_min", 0)
            if not isinstance(offset, int) or isinstance(offset, bool):
                raise AmbienceError("period_offset_not_int", value=offset)
            anchor_dt: datetime | None = getattr(snapshot, anchor)
            if anchor_dt is None:
                # Unobservable endpoint: the same signal a dangling period
                # gives, so _match_tolerant fails just this predicate.
                raise AmbienceError("time_of_day_anchor_unavailable", anchor=anchor)
            if snapshot.now - anchor_dt > _HALF_DAY:
                anchor_dt += _DAY
            elif anchor_dt - snapshot.now > _HALF_DAY:
                anchor_dt -= _DAY
            anchor_dt = anchor_dt + timedelta(minutes=offset)
            clamp = ep.get("clamp")
            if clamp is not None:
                anchor_dt = self._apply_clamp(anchor_dt, clamp)
            return anchor_dt
        raise AmbienceError("period_invalid_endpoint_kind", value=kind)

    def _apply_clamp(self, anchor_dt: datetime, clamp: Any) -> datetime:
        """Clamp a resolved sun datetime by a local clock time.

        not_before → max(anchor, clock); not_after → min(anchor, clock). The
        clock time is interpreted as HA-local on the anchor's local date, so a
        clamp commutes with DST the same way a `time` endpoint does."""
        if not isinstance(clamp, dict):
            raise AmbienceError("period_clamp_not_object")
        direction = clamp.get("dir")
        if direction not in ("not_before", "not_after"):
            raise AmbienceError("period_invalid_clamp_dir", value=direction)
        hh, mm = clamp.get("hh"), clamp.get("mm")
        if not valid_clock(hh, mm):
            raise AmbienceError("period_invalid_clamp_time", hh=hh, mm=mm)
        clamp_dt = _resolve_wall_clock(dt_util.as_local(anchor_dt), hh, mm)
        if direction == "not_before":
            return max(anchor_dt, clamp_dt)
        return min(anchor_dt, clamp_dt)

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            raise AmbienceError("time_of_day_required")
        if isinstance(predicate, list):
            if not predicate:
                raise AmbienceError("time_of_day_list_empty")
            items = predicate
        elif isinstance(predicate, dict):
            items = [predicate]
        else:
            raise AmbienceError("time_of_day_invalid", predicate=predicate)
        # Note: from == to is left valid — it matches all day at runtime (the
        # `end <= start` wrap in _in_range), harmless, and rejecting it here
        # would block saving any scope holding such a previously-valid config.
        synthetic = _synthetic_snapshot()
        known = set(self._period_lookup())
        for item in items:
            pid = item.get("period") if isinstance(item, dict) else None
            if isinstance(pid, str) and pid not in known:
                continue  # dangling period ref is a config-health problem, not malformed
            self._match_one(item, synthetic)

    def unconfigured_reason(self, predicate: Any, snapshot: TimeOfDaySnapshot) -> str | None:
        known = set(self._period_lookup())
        items = predicate if isinstance(predicate, list) else [predicate]
        for item in items:
            if (
                isinstance(item, dict)
                and isinstance(item.get("period"), str)
                and item["period"] not in known
            ):
                return f"time-of-day period {item['period']!r} no longer exists"
        if not isinstance(snapshot, TimeOfDaySnapshot):
            return None
        for item in items:
            for endpoint in self._dep_endpoints(item):
                if not isinstance(endpoint, dict) or endpoint.get("kind") != "sun":
                    continue
                anchor = endpoint.get("anchor")
                if anchor in ANCHOR_ATTR and getattr(snapshot, anchor) is None:
                    if not snapshot.sun_configured:
                        return "the sun integration is not set up"
                    return f"{anchor} is undefined at this location today"
        return None

    def describe(self, snapshot: TimeOfDaySnapshot, predicate: Any = None) -> str | None:
        periods = self._period_lookup()
        for pid in periods:
            try:
                if self._match_one({"period": pid}, snapshot):
                    return pid
            except AmbienceError:
                continue
        return None

    def _intervals(self, predicate: Any) -> list[tuple[float, float]]:
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        result: list[tuple[float, float]] = []
        for item in items:
            start, end = self._resolve_range(item, snapshot)
            start_min = _minute_of_day(start)
            end_min = _minute_of_day(end)
            if end_min <= start_min:
                if self._clamp_emptied(item, snapshot):
                    continue
                result.append((start_min, 1440.0))
                result.append((0.0, end_min))
            else:
                result.append((start_min, end_min))
        return result

    def contains(self, outer: Any, inner: Any) -> bool:
        try:
            outer_intervals = merge_intervals(self._intervals(outer))
            inner_intervals = self._intervals(inner)
        except AmbienceError:
            return False  # dangling period — containment can't be proven
        return all(
            any(o_start <= i_start and i_end <= o_end for o_start, o_end in outer_intervals)
            for i_start, i_end in inner_intervals
        )

    def order_key(self, predicate: Any) -> float:
        items = predicate if isinstance(predicate, list) else [predicate]
        snapshot = _synthetic_snapshot()
        keys: list[float] = []
        for item in items:
            try:
                keys.append(_minute_of_day(self._resolve_range(item, snapshot)[0]))
            except AmbienceError:
                continue  # dangling period / malformed item — no ordering signal
        return min(keys) if keys else float("inf")

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        clock_times: set[tuple[int, int]] = set()
        sun_events: set[tuple[str, int]] = set()
        items = predicate if isinstance(predicate, list) else [predicate]
        for item in items:
            for endpoint in self._dep_endpoints(item):
                self._classify_endpoint(endpoint, clock_times, sun_events)
        return TriggerSpec(
            clock_times=frozenset(clock_times),
            sun_events=frozenset(sun_events),
        )

    def _dep_endpoints(self, item: Any) -> list[Any]:
        """Return the [from, to] endpoint dicts for a predicate item, resolving
        named periods via the lookup. Malformed items yield no endpoints."""
        if not isinstance(item, dict):
            return []
        if "period" in item:
            defn = self._period_lookup().get(item["period"])
            if not isinstance(defn, dict):
                return []
            return [defn.get("from"), defn.get("to")]
        if "from" in item and "to" in item:
            return [item["from"], item["to"]]
        return []

    @staticmethod
    def _classify_endpoint(
        endpoint: Any,
        clock_times: set[tuple[int, int]],
        sun_events: set[tuple[str, int]],
    ) -> None:
        if not isinstance(endpoint, dict):
            return
        kind = endpoint.get("kind")
        if kind == "time":
            hh, mm = endpoint.get("hh"), endpoint.get("mm")
            # Same bounds as _resolve_endpoint so an unvalidated predicate
            # can't seed an unschedulable clock-time.
            if valid_clock(hh, mm):
                clock_times.add((hh, mm))
        elif kind == "sun":
            anchor = endpoint.get("anchor")
            offset = endpoint.get("offset_min", 0)
            if anchor in ANCHOR_ATTR and isinstance(offset, int) and not isinstance(offset, bool):
                sun_events.add((anchor, offset))
            clamp = endpoint.get("clamp")
            if isinstance(clamp, dict) and valid_clock(clamp.get("hh"), clamp.get("mm")):
                clock_times.add((clamp["hh"], clamp["mm"]))


def _strip_clamp(ep: Any) -> Any:
    """Return the endpoint without its clamp (used to resolve the pre-clamp range)."""
    if isinstance(ep, dict) and "clamp" in ep:
        bare = dict(ep)
        bare.pop("clamp")
        return bare
    return ep


def _endpoint_has_clamp(ep: Any) -> bool:
    return isinstance(ep, dict) and ep.get("clamp") is not None


def _wall_clock_exists(value: datetime) -> bool:
    """False for a wall-clock time the spring-forward gap skips — such a time
    does not survive a round trip through UTC."""
    return value == value.astimezone(dt_util.UTC).astimezone(value.tzinfo)


def _resolve_wall_clock(reference: datetime, hh: int, mm: int) -> datetime:
    """Resolve a wall-clock time on `reference`'s local date to one instant.

    A range's endpoints and its overnight-wrap test all read this single rule,
    so a DST switch cannot make them disagree. The rule is the first instant
    whose local clock reads at or after the requested time:

    - a time the spring-forward gap skips resolves to the instant the clock
      jumps to — with a 02:00 → 03:00 jump, 02:30 means 03:00 local;
    - a time the autumn fold repeats resolves to its first occurrence, so the
      range matches once, running across both passes of the repeated hour.
    """
    candidate = reference.replace(hour=hh, minute=mm, second=0, microsecond=0, fold=0)
    # Wall-clock arithmetic (same tzinfo), so this walks the clock face forward
    # a minute at a time until it reaches a time the day actually contains.
    while not _wall_clock_exists(candidate):
        candidate += timedelta(minutes=1)
    return candidate


def next_wall_clock(now: datetime, hh: int, mm: int) -> datetime:
    """The first instant strictly after `now` whose local wall clock reads hh:mm,
    resolved the way matching resolves it (`_resolve_wall_clock`).

    - A time the spring-forward gap skips fires at the jump instant, so a range
      that starts in the gap still gets its entry trigger that day.
    - A time the autumn fold repeats fires on its first pass only, so from
      inside the second pass the next occurrence is tomorrow's — matching the
      way such a range matches once across both passes.

    The comparison is in absolute time: inside the fold two instants share one
    wall clock, so a clock-face comparison would call a past instant future.
    """
    now_utc = dt_util.as_utc(now)
    local = dt_util.as_local(now)
    # Same-tzinfo arithmetic advances the calendar day, not 24 h of UTC. Loops
    # rather than branches so a `now` in the fold's second pass — whose day
    # already holds its only occurrence, in the past — rolls cleanly; two
    # iterations at most.
    candidate = _resolve_wall_clock(local, hh, mm)
    while dt_util.as_utc(candidate) <= now_utc:
        local = local + timedelta(days=1)
        candidate = _resolve_wall_clock(local, hh, mm)
    return candidate


def _in_range(now: datetime, start: datetime, end: datetime) -> bool:
    if end <= start:
        return now >= start or now < end
    return start <= now < end


def _minute_of_day(value: datetime) -> float:
    return value.hour * 60 + value.minute + value.second / 60


def _synthetic_snapshot() -> TimeOfDaySnapshot:
    """A fixed stand-in day for the paths that reason about a range's shape
    rather than about the current instant."""
    # The sorting/containment paths (_intervals, _clamp_emptied, order_key,
    # contains) reduce these datetimes to a minute of day, so every endpoint
    # must resolve in one domain: `time` endpoints and clock clamps land on
    # HA-local wall time, so the sun anchors are nominal local wall times too.
    # Anchoring them in UTC instead would compare instants across the offset and
    # make ordering and shadowing depend on the Home Assistant time zone.
    base = datetime(2026, 1, 1, 12, 0, tzinfo=dt_util.DEFAULT_TIME_ZONE)
    return TimeOfDaySnapshot(
        now=base,
        sunrise=base.replace(hour=6),
        sunset=base.replace(hour=18),
        noon=base.replace(hour=12),
        midnight=base.replace(hour=0),
        dawn=base.replace(hour=5, minute=30),
        dusk=base.replace(hour=18, minute=30),
    )
