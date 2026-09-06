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
from functools import partial
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..errors import AmbienceError
from ..triggers import EMPTY, DurationGate, GateReading, TriggerSpec
from ._common import (
    RULE_NOT_FALSE,
    RULE_OR,
    RULE_TRUTHY,
    UNAVAILABLE,
    Detail,
    NormalisesPredicate,
    PredicateDefaults,
    dur_seconds,
    ent,
    fmt_duration,
    for_comparator_symbol,
    for_contains,
    for_elapsed_satisfied,
    kleene_all,
    kleene_any,
    kleene_not,
    materialise_defaults,
    miss_cell,
    phrase,
    predicate_has_any,
    sensor_quant_contains,
    state_sources,
    tenure_held,
    tenure_within,
    text,
    validate_entity_ids,
    validate_for,
    validate_for_mode,
    wrap_quantified_segs,
)

_QUANTS = ("any", "all")


# `sensors` is deliberately absent: present-but-empty and missing are the same
# wildcard, so filling it would state nothing.
_PREDICATE_DEFAULTS: PredicateDefaults = {
    "occupied": (RULE_NOT_FALSE, True),
    "quant": (RULE_OR, "any"),
    "negate": (RULE_TRUTHY, False),
    "for_mode": (RULE_OR, "at_least"),
}

# Every read path funnels through here — ``_gate_key`` included, whose string
# keys the engine's tenure clocks — so a predicate stored before the defaults
# were materialised at save reads identically to one stored after.
_norm = partial(materialise_defaults, defaults=_PREDICATE_DEFAULTS)


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


class OccupancyCondition(NormalisesPredicate):
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
    _DEFAULTS = _PREDICATE_DEFAULTS

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
        eid: str,
        snapshot: OccupancySnapshot,
        *,
        want_on: bool,
        seconds: float,
        mode: str | None = None,
    ) -> bool | None:
        """Whether one sensor satisfies the polarity + `for` test.

        None = unobservable (entity absent from the snapshot, or unavailable);
        callers that only need pass/fail collapse None to False. `mode`
        ("at_least"/None vs "less_than") flips the legacy `for` comparator: held
        iff elapsed >= seconds by default, or elapsed < seconds for "less_than".
        """
        cur = snapshot.sensors.get(eid)
        if cur is None:
            return None
        state, changed = cur
        if state in UNAVAILABLE:
            return None
        if (state == "on") is not want_on:
            return False
        if seconds <= 0:
            return True
        return for_elapsed_satisfied((snapshot.now - changed).total_seconds(), seconds, mode)

    def matches(self, predicate: Any, snapshot: OccupancySnapshot) -> bool:
        if predicate is None:
            return True
        if not isinstance(predicate, dict):
            return False
        sensors = predicate.get("sensors") or []
        if not sensors:
            return True  # no constraint — nothing to negate either
        pred = _norm(predicate)
        want_on = pred["occupied"]
        quant = pred["quant"]
        seconds = dur_seconds(pred.get("for"))
        # "at_least" gates the `for:` clock as "held >= for"; with "less_than"
        # the same clock means "held LESS than for" (boundary exclusive: at
        # exactly `for`, at_least holds and less_than does not).
        mode = pred["for_mode"]

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
            self._holds(e, snapshot, want_on=want_on, seconds=per_sensor_seconds, mode=mode)
            for e in sensors
        )
        result = kleene_all(verdicts) if quant == "all" else kleene_any(verdicts)
        if tenure_mode and result is True:
            # Gate the (observably true) combined verdict on its tenure. A None
            # result is left untouched so it stays a miss through negate. The
            # comparator follows `for_mode`: held >= for, or (less_than) < for.
            gate = tenure_within if mode == "less_than" else tenure_held
            result = gate(snapshot.tenure, self._gate_key(pred), snapshot.now, seconds)
        # `negate` wraps the whole match (polarity + quant + `for`): "NOT
        # (vacant for >=20m)" is a different match-set from "occupied for >=20m".
        # An unobservable result (None) stays a miss even under negate.
        if pred["negate"]:
            result = kleene_not(result)
        return result is True

    @staticmethod
    def _gate_key(predicate: dict) -> str:
        """Canonical fingerprint of the predicate's pre-negate instant test.

        `negate` is deliberately EXCLUDED: it wraps *outside* the gate (the gate
        clocks the inner polarity+quant+sensors verdict), so "vacant for 20m"
        and "NOT(vacant for 20m)" share one tenure clock."""
        pred = _norm(predicate)
        sensors = "|".join(sorted(pred.get("sensors") or []))
        return f"{'on' if pred['occupied'] else 'off'}:{pred['quant']}:{sensors}"

    def _gate_label(self, predicate: dict) -> str:
        """Human-readable instant description, for a multi-sensor DURATION trace
        cause (e.g. "any of 2 sensors vacant")."""
        pred = _norm(predicate)
        sensors = pred.get("sensors") or []
        state_word = "occupied" if pred["occupied"] else "vacant"
        if len(sensors) == 1:
            return f"{sensors[0]} {state_word}"
        return f"{pred['quant']} of {len(sensors)} sensors {state_word}"

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
        pred = _norm(predicate)
        want_on = pred["occupied"]
        verdicts = (self._holds(e, snapshot, want_on=want_on, seconds=0.0) for e in sensors)
        result = kleene_all(verdicts) if pred["quant"] == "all" else kleene_any(verdicts)
        changes = [cur[1] for e in sensors if (cur := snapshot.sensors.get(e)) is not None]
        anchor = max(changes) if changes else snapshot.now
        return {self._gate_key(pred): (result is True, anchor)}

    def describe(self, snapshot: OccupancySnapshot, predicate: Any = None) -> Detail | None:
        # No predicate: whole-snapshot summary (used by `snapshots_described`).
        if predicate is None:
            return self._describe_snapshot(snapshot)
        if not isinstance(predicate, dict):
            return None
        pred = _norm(predicate)
        sensors = pred.get("sensors") or []
        if not sensors:
            return [phrase("any_sensor")]  # wildcard — matches() is vacuously true
        want_on = pred["occupied"]
        quant = pred["quant"]
        seconds = dur_seconds(pred.get("for"))
        mode = pred["for_mode"]
        # In tenure mode the per-sensor marks show only the instant polarity
        # (seconds=0); how long the combined verdict has held is summarised once.
        tenure_mode = seconds > 0 and snapshot.tenure is not None
        per_sensor_seconds = 0.0 if tenure_mode else seconds
        # Preserve the predicate's sensor order so the line maps to the config.
        cells: list[Detail] = []
        for eid in sensors:
            name = snapshot.names.get(eid, eid)
            cur = snapshot.sensors.get(eid)
            if cur is None:
                cells.append(miss_cell(eid, name, "not_found"))
                continue
            state, changed = cur
            # In the legacy clock, show how long each sensor has held its state
            # so a recently-changed sensor's ✗ is self-explanatory.
            elapsed = (
                f" {fmt_duration((snapshot.now - changed).total_seconds())}"
                if seconds and not tenure_mode
                else ""
            )
            held = self._holds(
                eid, snapshot, want_on=want_on, seconds=per_sensor_seconds, mode=mode
            )
            cells.append([ent(eid, name), text(f": {state}{elapsed} {'✓' if held else '✗'}")])
        body = wrap_quantified_segs(cells, quant, pred["negate"])
        if not seconds:
            return body
        # State the duration threshold once; the comparator follows `for_mode`
        # ("for <" for less_than, "for ≥" otherwise). In tenure mode also show
        # how long the gate has actually held (or that it hasn't).
        rel = for_comparator_symbol(mode)
        for_hold = phrase("for_hold", rel=rel, dur=fmt_duration(seconds))
        if tenure_mode:
            since = snapshot.tenure.get(self._gate_key(pred))
            held_part = (
                [
                    text(", "),
                    phrase("held", dur=fmt_duration((snapshot.now - since).total_seconds())),
                ]
                if since
                else [text(", "), phrase("not_held")]
            )
            return [*body, text(" ("), for_hold, *held_part, text(")")]
        return [*body, text(" ("), for_hold, text(")")]

    def _describe_snapshot(self, snapshot: OccupancySnapshot) -> Detail | None:
        if not snapshot.sensors:
            return [phrase("no_occupancy_sensors")]
        total = len(snapshot.sensors)
        active = sorted(
            snapshot.names.get(eid, eid)
            for eid, (state, _) in snapshot.sensors.items()
            if state == "on"
        )
        if active:
            return [
                phrase(
                    "summary_active",
                    n=str(len(active)),
                    total=str(total),
                    names=", ".join(active),
                )
            ]
        return [phrase("summary_active_zero", total=str(total))]

    def validate_predicate(self, predicate: Any) -> None:
        if predicate is None:
            return
        if not isinstance(predicate, dict):
            raise AmbienceError("occupancy_predicate_not_object")
        sensors = predicate.get("sensors")
        if sensors is not None:
            validate_entity_ids(sensors, "binary_sensor", key="occupancy_sensors_not_list")
        occupied = predicate.get("occupied")
        if occupied is not None and not isinstance(occupied, bool):
            raise AmbienceError("occupancy_occupied_invalid", value=occupied)
        quant = predicate.get("quant")
        if quant is not None and quant not in _QUANTS:
            raise AmbienceError("quant_invalid", quants=list(_QUANTS), value=quant)
        negate = predicate.get("negate")
        if negate is not None and not isinstance(negate, bool):
            raise AmbienceError("negate_invalid", value=negate)
        validate_for(predicate.get("for"))
        validate_for_mode(predicate.get("for_mode"))

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

        def _axis(o: dict[str, Any], i: dict[str, Any]) -> bool:
            # Comparable only when polarity matches (occupied vs vacant are
            # different match-sets); then the `for`/`for_mode` duration axis must
            # permit inner ⊆ outer (at_least: longer is stricter; less_than:
            # shorter is stricter).
            if o["occupied"] != i["occupied"]:
                return False
            return for_contains(o, i)

        return sensor_quant_contains(_norm(outer), _norm(inner), _axis)
