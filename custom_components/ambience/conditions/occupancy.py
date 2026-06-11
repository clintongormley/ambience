"""OccupancyCondition — presence/occupancy/motion binary_sensors are (not) active.

Predicate (scoped quantifier):
  {sensors: [binary_sensor.*]? (empty/absent = match-anything),
   occupied: bool? (default true; false = vacant),
   quant: 'any'|'all' (default 'any'),
   for?: {h,m,s},
   negate: bool? (default false; inverts the whole match)}
None = vacuous true (no constraint).
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..triggers import EMPTY, DurationGate, GateReading, TriggerSpec
from ._common import (
    UNAVAILABLE,
    dur_seconds,
    fmt_duration,
    kleene_all,
    kleene_any,
    kleene_not,
    predicate_has_any,
    state_sources,
    tenure_held,
    validate_for,
)

_QUANTS = ("any", "all")


@dataclass(frozen=True)
class OccupancySnapshot:
    """Frozen view of binary_sensor state at tick time."""

    now: datetime
    # entity_id -> (state, last_changed). last_changed (not last_updated): a
    # presence sensor's `for` clock should reset on state transitions only.
    sensors: dict[str, tuple[str, datetime]]
    names: dict[str, str] = field(default_factory=dict)
    # Engine-injected per-gate tenure: gate fingerprint -> the time the
    # predicate's pre-negate instant test last became true. When present, a
    # `for:` clause gates off this shared tenure (surviving sensor handover);
    # when None (the simulator / direct callers) it falls back to the legacy
    # per-sensor last_changed clock.
    tenure: Mapping[str, datetime] | None = None


class OccupancyCondition:
    """Match whether the chosen presence/occupancy sensors are active.

    Mirrors PeopleCondition's shape (quantifier + `for` + a `contains` lattice),
    over binary_sensor entities instead of persons.
    """

    name = "occupancy"
    description = "Matches whether presence/occupancy sensors are active."
    predicate_help = (
        "{sensors: [binary_sensor.*] (empty = match-anything), "
        "occupied: bool (default true), quant: 'any'|'all', for?: {h,m,s}, "
        "negate: bool (default false, inverts the whole match)}. "
        "None = match-anything."
    )
    input = "occupancy_predicate"
    # Below state (950) and people (925), above day (900): a live presence fact
    # is more specific than ambient time/weather, but an explicit device/state
    # rule should still win.
    priority = 915

    def __init__(self, hass: HomeAssistant | None = None) -> None:
        self._hass = hass

    async def snapshot(
        self,
        hass: HomeAssistant,
        *,
        now: datetime | None = None,
        entities: frozenset[str] | None = None,
    ) -> OccupancySnapshot:
        sensors: dict[str, tuple[str, datetime]] = {}
        names: dict[str, str] = {}
        # `entities` (the sensors scenes actually reference) lets us read those
        # directly; None means scan the whole binary_sensor domain (back-compat).
        states = state_sources(hass, entities, domain="binary_sensor")
        for s in states:
            if s is None:
                continue  # referenced entity that doesn't exist
            sensors[s.entity_id] = (s.state, s.last_changed)
            names[s.entity_id] = s.attributes.get("friendly_name") or s.entity_id
        return OccupancySnapshot(now=now or dt_util.utcnow(), sensors=sensors, names=names)

    @staticmethod
    def _holds(
        eid: str, snapshot: OccupancySnapshot, *, want_on: bool, seconds: float
    ) -> bool | None:
        """Whether one sensor satisfies the polarity + `for` test.

        None = unobservable (entity absent from the snapshot, or unavailable);
        callers that only need pass/fail collapse None to False.
        """
        cur = snapshot.sensors.get(eid)
        if cur is None:
            return None
        state, changed = cur
        if state in UNAVAILABLE:
            return None
        if (state == "on") is not want_on:
            return False
        return not (seconds > 0 and (snapshot.now - changed).total_seconds() < seconds)

    def matches(self, predicate: Any, snapshot: OccupancySnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        sensors = predicate.get("sensors") or []
        if not sensors:
            return True  # no constraint — nothing to negate either
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        seconds = dur_seconds(predicate.get("for"))

        # In tenure mode the per-sensor verdicts test only the instant polarity
        # (seconds=0); the `for:` gate is applied once to the combined verdict
        # below, off engine tenure — so a sensor handover (one drops, another
        # rises) keeps "any occupied for 20m" running.
        tenure_mode = seconds > 0 and snapshot.tenure is not None
        per_sensor_seconds = 0.0 if tenure_mode else seconds
        # Keep per-sensor verdicts tri-state (None = unobservable) through the
        # quantifier and negate, so an unavailable sensor can never be inverted
        # into a spurious match — "not occupied" must not fire on `unavailable`.
        # A generator lets kleene_any/kleene_all short-circuit (settle without
        # evaluating every sensor) on the hot path.
        verdicts = (
            self._holds(e, snapshot, want_on=want_on, seconds=per_sensor_seconds) for e in sensors
        )
        result = kleene_all(verdicts) if quant == "all" else kleene_any(verdicts)
        if tenure_mode and result is True:
            # Gate the (observably true) combined verdict on its tenure. A None
            # result is left untouched so it stays a miss through negate.
            result = tenure_held(snapshot.tenure, self._gate_key(predicate), snapshot.now, seconds)
        # `negate` wraps the whole match (polarity + quant + `for`): "NOT
        # (vacant for >=20m)" is a different match-set from "occupied for >=20m".
        # An unobservable result (None) stays a miss even under negate.
        if predicate.get("negate"):
            result = kleene_not(result)
        return result is True

    @staticmethod
    def _gate_key(predicate: dict) -> str:
        """Canonical fingerprint of the predicate's pre-negate instant test.

        `negate` is deliberately EXCLUDED: it wraps *outside* the gate (the gate
        clocks the inner polarity+quant+sensors verdict), so "vacant for 20m"
        and "NOT(vacant for 20m)" share one tenure clock."""
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        sensors = "|".join(sorted(predicate.get("sensors") or []))
        return f"{'on' if want_on else 'off'}:{quant}:{sensors}"

    def _gate_label(self, predicate: dict) -> str:
        """Human-readable instant description, for a multi-sensor DURATION trace
        cause (e.g. "any of 2 sensors vacant")."""
        sensors = predicate.get("sensors") or []
        want_on = predicate.get("occupied", True) is not False
        state_word = "occupied" if want_on else "vacant"
        if len(sensors) == 1:
            return f"{sensors[0]} {state_word}"
        quant = predicate.get("quant") or "any"
        return f"{quant} of {len(sensors)} sensors {state_word}"

    def gate_states(self, predicate: Any, snapshot: OccupancySnapshot) -> dict[str, GateReading]:
        """`{gate_key: (instant_truth, anchor)}` for a constraining `for:`
        predicate, else empty. `instant_truth` is the PRE-negate combined
        verdict (negate wraps the gate, not the tenure). The anchor (startup
        seed) is the most recent change among the referenced sensors, a provable
        lower bound, falling back to `snapshot.now`."""
        if not isinstance(predicate, dict):
            return {}
        sensors = predicate.get("sensors") or []
        seconds = dur_seconds(predicate.get("for"))
        if not sensors or seconds <= 0:
            return {}
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        verdicts = (self._holds(e, snapshot, want_on=want_on, seconds=0.0) for e in sensors)
        result = kleene_all(verdicts) if quant == "all" else kleene_any(verdicts)
        changes = [cur[1] for e in sensors if (cur := snapshot.sensors.get(e)) is not None]
        anchor = max(changes) if changes else snapshot.now
        return {self._gate_key(predicate): (result is True, anchor)}

    def describe(self, snapshot: OccupancySnapshot, predicate: Any = None) -> str | None:
        # No predicate: whole-snapshot summary (used by `snapshots_described`).
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        sensors = predicate.get("sensors") or []
        if not sensors:
            return "any sensor (no constraint)"  # wildcard — matches() is vacuously true
        want_on = predicate.get("occupied", True) is not False
        quant = predicate.get("quant") or "any"
        seconds = dur_seconds(predicate.get("for"))
        # In tenure mode the per-sensor marks show only the instant polarity
        # (seconds=0); how long the combined verdict has held is summarised once.
        tenure_mode = seconds > 0 and snapshot.tenure is not None
        per_sensor_seconds = 0.0 if tenure_mode else seconds
        # Preserve the predicate's sensor order so the line maps to the config.
        parts: list[str] = []
        for eid in sensors:
            name = snapshot.names.get(eid, eid)
            cur = snapshot.sensors.get(eid)
            if cur is None:
                parts.append(f"{name}: not found ✗")
                continue
            state, changed = cur
            # In the legacy clock, show how long each sensor has held its state
            # so a recently-changed sensor's ✗ is self-explanatory.
            elapsed = (
                f" {fmt_duration((snapshot.now - changed).total_seconds())}"
                if seconds and not tenure_mode
                else ""
            )
            held = self._holds(eid, snapshot, want_on=want_on, seconds=per_sensor_seconds)
            parts.append(f"{name}: {state}{elapsed} {'✓' if held else '✗'}")
        body = ", ".join(parts)
        if len(sensors) > 1:
            body = f"{'all' if quant == 'all' else 'any'} of: {body}"
        # `negate` inverts the whole match — show it wrapping the per-sensor read.
        if predicate.get("negate"):
            body = f"not({body})"
        if not seconds:
            return body
        # State the duration threshold once; in tenure mode also show how long
        # the gate has actually held (or that it hasn't).
        if tenure_mode:
            since = snapshot.tenure.get(self._gate_key(predicate))
            held_str = (
                f", held {fmt_duration((snapshot.now - since).total_seconds())}"
                if since
                else ", not held"
            )
            return f"{body} (for ≥{fmt_duration(seconds)}{held_str})"
        return f"{body} (for ≥{fmt_duration(seconds)})"

    def _describe_snapshot(self, snapshot: OccupancySnapshot) -> str | None:
        if not snapshot.sensors:
            return "no occupancy sensors"
        total = len(snapshot.sensors)
        active = sorted(
            snapshot.names.get(eid, eid)
            for eid, (state, _) in snapshot.sensors.items()
            if state == "on"
        )
        if active:
            return f"{len(active)} of {total} active ({', '.join(active)})"
        return f"0 of {total} active"

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise ValueError("occupancy predicate must be a dict")
        sensors = predicate.get("sensors")
        if sensors is not None:
            if not isinstance(sensors, list):
                raise ValueError("`sensors` must be a list of binary_sensor.* ids")
            for e in sensors:
                if not isinstance(e, str) or not e.startswith("binary_sensor."):
                    raise ValueError(f"`sensors` entries must be binary_sensor.* ids, got {e!r}")
        occupied = predicate.get("occupied")
        if occupied is not None and not isinstance(occupied, bool):
            raise ValueError(f"`occupied` must be a bool, got {occupied!r}")
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise ValueError(f"`quant` must be one of {_QUANTS}, got {quant!r}")
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise ValueError(f"`negate` must be a bool, got {negate!r}")
        validate_for(predicate.get("for"))

    # --- trigger dependencies -------------------------------------------

    def trigger_deps(self, predicate: Any) -> TriggerSpec:
        if not isinstance(predicate, dict):
            return EMPTY
        sensors = [e for e in (predicate.get("sensors") or []) if isinstance(e, str) and e]
        seconds = dur_seconds(predicate.get("for"))
        gates = (
            frozenset(
                {
                    DurationGate(
                        key=self._gate_key(predicate),
                        seconds=seconds,
                        label=self._gate_label(predicate),
                        entity_id=(sensors[0] if len(sensors) == 1 else None),
                    )
                }
            )
            if seconds > 0 and sensors
            else frozenset()
        )
        return TriggerSpec(entities=frozenset(sensors), duration_gates=gates)

    def is_constraining(self, predicate: Any) -> bool:
        """Empty/absent `sensors` is match-anything (see matches()), so it is a
        wildcard for sorting, not a real constraint."""
        return predicate_has_any(predicate, "sensors")

    # --- sorting (containment lattice) ----------------------------------
    # No order_key: there is no meaningful total order among occupancy
    # predicates, so constrained scenes tie within this slot — but a scene that
    # constrains occupancy still sorts ahead of one that leaves it a wildcard
    # (the slot is ranked by this condition's high priority). `contains` is this
    # condition's only intra-slot sort contribution.

    def contains(self, outer: Any, inner: Any) -> bool:
        """True iff every world-state matching `inner` also matches `outer`
        (inner's match-set ⊆ outer's). Conservative: unprovable -> False."""
        if not isinstance(outer, dict) or not isinstance(inner, dict):
            return False
        # A negated predicate's match-set is a complement, which does not nest
        # under this (sensor-subset / polarity / quant / for) lattice. Be
        # conservative: unprovable -> False.
        if outer.get("negate") or inner.get("negate"):
            return False
        # Empty/absent `sensors` is a wildcard (matches every world-state, per
        # matches()), so its polarity/quant/for are irrelevant. A wildcard outer
        # contains everything; a wildcard inner is the universe, contained only
        # by another wildcard outer (handled above).
        if not outer.get("sensors"):
            return True
        if not inner.get("sensors"):
            return False
        # Both constrained: comparable only when polarity AND quant match (a
        # different polarity or quantifier is a different, non-nesting match-set).
        if (outer.get("occupied", True) is not False) != (inner.get("occupied", True) is not False):
            return False
        if (outer.get("quant") or "any") != (inner.get("quant") or "any"):
            return False
        # inner must hold at least as long as outer (longer for = more specific).
        if dur_seconds(inner.get("for")) < dur_seconds(outer.get("for")):
            return False
        so = frozenset(outer["sensors"])
        si = frozenset(inner["sensors"])
        if (outer.get("quant") or "any") == "any":
            return si <= so  # any over fewer sensors ⊆ any over more
        return so <= si  # all over more sensors ⊆ all over fewer
