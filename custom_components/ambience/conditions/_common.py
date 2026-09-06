"""Small helpers shared across the built-in conditions.

Several conditions need the same primitives: a frozenset of the HA "no real
value" states, a tolerant `{h,m,s}` duration reader, the matching save-time
validator for that duration, a numeric-interval merge, the two float
coercions (bool-rejecting and state-string-tolerant), the ordering-operator
comparison, the clock-field validators (`valid_hour`, `valid_minute`,
`valid_clock`) and the `Reason` / `REASON_EN` table behind a trace's
"why this cannot match". Keeping one copy here avoids the set/tuple and
fix-it-in-one-place drift that crept in when each condition carried its own.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, ClassVar

from homeassistant.core import valid_entity_id

from ..errors import AmbienceError

# States that mean "no real value" — treated as a miss by every condition that
# reads an entity's state.
UNAVAILABLE: frozenset[str] = frozenset({"unavailable", "unknown"})


# Three-valued (Kleene) logic over `bool | None`, where None = "unobservable"
# (an entity is unavailable/unknown/absent). The point of carrying None instead
# of collapsing it to False early is negation: `not None` stays None, so an
# unobservable input can never be inverted into a spurious match. Callers
# collapse the final verdict with `result is True` (None and False both → miss).
def kleene_any(values: Iterable[bool | None]) -> bool | None:
    """OR: True if any term is True; else None if any is unobservable; else False."""
    seen_none = False
    for v in values:
        if v is True:
            return True
        if v is None:
            seen_none = True
    return None if seen_none else False


def kleene_all(values: Iterable[bool | None]) -> bool | None:
    """AND: False if any term is False; else None if any is unobservable; else True."""
    seen_none = False
    for v in values:
        if v is False:
            return False
        if v is None:
            seen_none = True
    return None if seen_none else True


def kleene_not(value: bool | None) -> bool | None:
    """NOT: an unobservable term stays unobservable (None); otherwise invert."""
    return None if value is None else not value


def dur_seconds(dur: Any) -> float:
    """Total seconds for a `{h,m,s}` duration. Tolerant: the save path validates
    these as ints, but the matching path runs against stored data that may have
    been hand-edited, so a non-numeric component counts as 0 rather than raising."""
    if not isinstance(dur, dict):
        return 0.0

    def _num(key: str) -> float:
        try:
            return float(dur.get(key) or 0)
        except (TypeError, ValueError):
            return 0.0

    return _num("h") * 3600 + _num("m") * 60 + _num("s")


def tenure_held(tenure: Mapping[str, datetime], key: str, now: datetime, seconds: float) -> bool:
    """Whether the duration gate ``key``'s instant predicate has held true for at
    least ``seconds``, per the engine-recorded tenure map.

    ``tenure`` maps a gate fingerprint to the time its instant test last became
    true; an absent key means the gate has never been observed true (so it has
    held for zero time). Unlike the legacy exact-state clock, this survives
    state flips that keep the instant test true (a person hopping between two
    away zones, an entity flipping between two listed states)."""
    since = tenure.get(key)
    return since is not None and (now - since).total_seconds() >= seconds


def tenure_within(tenure: Mapping[str, datetime], key: str, now: datetime, seconds: float) -> bool:
    """Whether the duration gate ``key``'s instant predicate has held true for
    *less* than ``seconds`` — the "for less than" mirror of :func:`tenure_held`.

    Callers must have already confirmed the gate's instant test is currently
    true; this only times how long that has been the case. ``tenure`` maps a
    gate fingerprint to the time its instant test last became true. An absent
    key means the instant test only just became true (elapsed ~0), so it is
    still within the window. The boundary is exclusive: holding for exactly
    ``seconds`` is no longer within."""
    since = tenure.get(key)
    return since is None or (now - since).total_seconds() < seconds


def for_comparator_symbol(for_mode: Any) -> str:
    """The comparator symbol for a `for:` gate's describe/trace render: ``<`` for
    the "less than" maximum gate, ``≥`` for "at least" (the default)."""
    return "<" if for_mode == "less_than" else "≥"


def for_elapsed_satisfied(elapsed: float, seconds: float, for_mode: Any) -> bool:
    """Whether an instant test that has held for ``elapsed`` seconds satisfies a
    legacy/fallback (no-engine) `for:` gate of ``seconds``: ``< seconds`` for
    "less than", ``>= seconds`` for "at least" (the default). The tenure-map
    mirror of this pair is :func:`tenure_within` / :func:`tenure_held`."""
    if for_mode == "less_than":
        return elapsed < seconds
    return elapsed >= seconds


def for_contains(outer: Any, inner: Any) -> bool:
    """Whether the `for`/`for_mode` duration axis permits ``inner``'s match-set to
    nest inside ``outer``'s — one input to a condition's ``contains`` lattice.

    An ungated ``outer`` (`for` <= 0) constrains nothing on this axis, so any
    ``inner`` nests. A gated ``outer`` needs ``inner`` gated in the SAME mode:
    differing comparators (``at_least`` vs ``less_than``) describe non-nesting
    match-sets, so that's conservatively False. With ``at_least`` (held >= for) a
    longer threshold is the more specific (smaller) set, so ``inner.for`` must be
    >= ``outer.for``; with ``less_than`` (held < for) a *shorter* threshold is the
    more specific set, so ``inner.for`` must be <= ``outer.for``."""
    outer_for = dur_seconds(outer.get("for"))
    if outer_for <= 0:
        return True
    inner_for = dur_seconds(inner.get("for"))
    if inner_for <= 0:
        return False
    # Read the default here rather than trusting the caller: the conditions
    # materialise `for_mode` at save, but this helper also runs against
    # predicates stored before that, which omit it.
    mode = outer.get("for_mode") or "at_least"
    if mode != (inner.get("for_mode") or "at_least"):
        return False
    if mode == "less_than":
        return inner_for <= outer_for
    return inner_for >= outer_for


def fmt_duration(seconds: float) -> str:
    """Compact h/m/s render of a whole-second duration, for diagnostics: 1500 ->
    '25m', 90 -> '1m30s', 3661 -> '1h1m1s', 0 -> '0s'. Fractions floor."""
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    parts = []
    if h:
        parts.append(f"{h}h")
    if m:
        parts.append(f"{m}m")
    if s:
        parts.append(f"{s}s")
    return "".join(parts) or "0s"


def validate_for(dur: Any) -> None:
    """Validate an optional `for: {h,m,s}` duration at save time. None is allowed
    (no minimum-duration gate). Each component must be a non-negative int."""
    if dur is None:
        return
    if not isinstance(dur, dict):
        raise AmbienceError("for_not_object")
    unknown = set(dur) - {"h", "m", "s"}
    if unknown:
        # e.g. {"hours": 1} — dur_seconds would silently read it as 0 seconds.
        raise AmbienceError("for_keys_invalid", keys=sorted(unknown))
    for k in ("h", "m", "s"):
        v = dur.get(k, 0)
        if not isinstance(v, int) or isinstance(v, bool) or v < 0:
            raise AmbienceError("for_component_invalid", key=k)


def validate_for_mode(mode: Any) -> None:
    """Validate the optional `for_mode` field at save time. None is allowed
    (means "at_least" — the duration gate must have held at least `for`). The
    only other allowed values are the strings "at_least" and "less_than"."""
    if mode is None:
        return
    if mode not in ("at_least", "less_than"):
        raise AmbienceError("for_mode_invalid")


def validate_entity_ids(values: Any, domain: str | None = None, *, key: str) -> None:
    """Validate a save-time list of entity ids, optionally all in one ``domain``.

    ``key`` is the caller's translation key for "this field must be a list of
    entity ids" — raised when ``values`` is not a list at all; the per-entry
    rejections carry the shared ``entity_id_invalid`` / ``entity_id_wrong_domain``
    keys. Each entry is checked against HA's own entity-id grammar, so a bare
    domain prefix (``sensor.``) and an id carrying a space or capital
    (``person.Bad Id``) are both rejected — a ``startswith`` prefix test admits
    them, and they can never name a real entity."""
    if not isinstance(values, list):
        # The key is the caller's string literal; check_exceptions_keys reads it
        # off the `key=` argument at each call site.
        raise AmbienceError(key)  # i18n-ignore
    for value in values:
        if not isinstance(value, str) or not valid_entity_id(value):
            raise AmbienceError("entity_id_invalid", entity_id=value)
        if domain is not None and value.split(".", 1)[0] != domain:
            raise AmbienceError("entity_id_wrong_domain", entity_id=value, domain=domain)


# --- predicate defaults -------------------------------------------------------
#
# Conditions whose predicates have documented defaults declare them as a table
# of `key -> (rule, default)` and let `materialise_defaults` apply it, so the
# save path and every read path fill them by the same rule. The three rules are
# named rather than inferred from the default's type so the table is plain data
# the mcp-server's diff.py mirrors literally.
RULE_OR = "or"  # falsy (including absent) -> default
RULE_TRUTHY = "truthy"  # bool(value); absent -> False
RULE_NOT_FALSE = "not_false"  # only an explicit False means False

PredicateDefaults = Mapping[str, tuple[str, Any]]

_MISSING = object()


def _defaulted(predicate: Mapping[str, Any], key: str, rule: str, default: Any) -> Any:
    """One key's materialised value, by the named rule."""
    if rule == RULE_TRUTHY:
        return bool(predicate.get(key))
    if rule == RULE_NOT_FALSE:
        return predicate.get(key, default) is not False
    return predicate.get(key) or default


def materialise_defaults(predicate: Any, defaults: PredicateDefaults) -> Any:
    """A predicate with its ``defaults`` table materialised.

    Non-dict predicates (None — the wildcard — and hand-edited junk) pass
    through untouched. Pure and idempotent: the input is never mutated, and a
    predicate that already states every default is returned AS IS, so the common
    post-save case allocates nothing. Key order matches ``{**predicate,
    **filled}``: stated keys keep their position, newly filled ones follow in
    table order."""
    if not isinstance(predicate, dict):
        return predicate
    filled: dict[str, Any] | None = None
    for key, (rule, default) in defaults.items():
        value = _defaulted(predicate, key, rule, default)
        # Identity, not equality: every rule returns either the stored object
        # itself or a bool/str singleton, so `is` is exact — it rejects a stored
        # `1` standing in for `True`, which equality would wave through and
        # leak into the stored form.
        if predicate.get(key, _MISSING) is value:
            continue
        if filled is None:
            filled = {}
        filled[key] = value
    if filled is None:
        return predicate
    return {**predicate, **filled}


class NormalisesPredicate:
    """Mixin giving a condition the save-time ``normalize_predicate`` hook,
    driven by its ``_DEFAULTS`` table."""

    _DEFAULTS: ClassVar[PredicateDefaults]

    def normalize_predicate(self, predicate: Any) -> Any:
        """Materialise the predicate's documented defaults for storage, so a
        stored predicate says what it means instead of leaning on a reader's
        `or`. Semantically a no-op: every read path applies the same defaults to
        a predicate that omits them. Called once at save (``canonicalise``).
        Pure: never mutates the input."""
        return materialise_defaults(predicate, self._DEFAULTS)


def predicate_has_any(predicate: Any, *keys: str) -> bool:
    """Whether a predicate dict carries at least one non-empty value among
    `keys` — the shared body behind the conditions' ``is_constraining`` hooks
    (a predicate with none of them matches everything: a sorting wildcard)."""
    return isinstance(predicate, dict) and any(bool(predicate.get(k)) for k in keys)


def sensor_quant_contains(
    outer: Any,
    inner: Any,
    axis_contains: Callable[[dict[str, Any], dict[str, Any]], bool],
) -> bool:
    """The shared ``contains`` lattice for the sensor-quantifier conditions
    (occupancy, lux): True iff every world-state matching ``inner`` also matches
    ``outer`` on the axes both share — negation, the empty-``sensors`` wildcard,
    the quantifier, and the sensor-set subset rule. The condition-specific axis
    (occupancy polarity + ``for``, lux band) is decided by
    ``axis_contains(outer, inner)``, called only once both are constrained.
    Conservative: anything unprovable -> False."""
    if not isinstance(outer, dict) or not isinstance(inner, dict):
        return False
    # A negated predicate's match-set is a complement; it doesn't nest here.
    if outer.get("negate") or inner.get("negate"):
        return False
    # Empty/absent `sensors` is a wildcard: a wildcard outer contains everything;
    # a wildcard inner is the universe, contained only by another wildcard outer.
    if not outer.get("sensors"):
        return True
    if not inner.get("sensors"):
        return False
    quant = outer.get("quant") or "any"
    if quant != (inner.get("quant") or "any"):
        return False
    if not axis_contains(outer, inner):
        return False
    so = frozenset(outer["sensors"])
    si = frozenset(inner["sensors"])
    if quant == "any":
        return si <= so  # any over fewer sensors ⊆ any over more
    return so <= si  # all over more sensors ⊆ all over fewer


def state_sources(hass: Any, entities: frozenset[str] | None, domain: str | None = None) -> Any:
    """The states a snapshot should read: just the referenced `entities` when
    the trigger engine supplies them, else a full (optionally domain-filtered)
    scan — the simulator path. Entries may be None (referenced entity that
    doesn't exist); callers skip those."""
    if entities is not None:
        return (hass.states.get(eid) for eid in entities)
    return hass.states.async_all(domain) if domain else hass.states.async_all()


def merge_intervals(intervals: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """Merge overlapping/touching closed intervals into a minimal sorted list."""
    if not intervals:
        return []
    ordered = sorted(intervals)
    merged = [ordered[0]]
    for start, end in ordered[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged


def as_float(value: Any) -> float | None:
    """Coerce a numeric value to float, rejecting bools, non-numbers and
    non-finite values (→ None). NaN compares uselessly against bounds (nan < lo
    and nan >= hi are both False), so it must read as unobservable."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    result = float(value)
    return result if math.isfinite(result) else None


def as_float_state(value: Any) -> float | None:
    """Coerce an entity state (or any user-typed value) to a finite float, else
    None. Accepts numeric strings, unlike `as_float`, because HA states are
    strings. Non-finite values are unobservable: NaN fails every band
    comparison (`nan < lo` and `nan >= hi` are both False), which would
    otherwise make a NaN reading match every band."""
    try:
        result = float(value)
    except (TypeError, ValueError):
        return None
    return result if math.isfinite(result) else None


def compare_numeric(actual: float, op: str, threshold: float) -> bool:
    """`actual <op> threshold` for the four ordering operators; False for any
    other op so an unknown operator never matches."""
    if op == "<":
        return actual < threshold
    if op == "<=":
        return actual <= threshold
    if op == ">":
        return actual > threshold
    if op == ">=":
        return actual >= threshold
    return False


def valid_hour(hh: Any) -> bool:
    """True if `hh` is an in-range clock hour (rejecting bool, an int subclass)."""
    return isinstance(hh, int) and not isinstance(hh, bool) and 0 <= hh <= 23


def valid_minute(mm: Any) -> bool:
    """True if `mm` is an in-range clock minute (rejecting bool, an int subclass)."""
    return isinstance(mm, int) and not isinstance(mm, bool) and 0 <= mm <= 59


def valid_clock(hh: Any, mm: Any) -> bool:
    """True if hh/mm together are an in-range clock time."""
    return valid_hour(hh) and valid_minute(mm)


@dataclass(frozen=True)
class Reason:
    """A translatable "why this predicate cannot match": a key into the panel's
    `trace_reason` bundle plus its placeholders.

    `render()` is the English the backend puts in the trace's `detail` for logs,
    diagnostics and the MCP; the panel localises `key` itself and falls back to
    that English. `tests/test_trace_reasons.py` keeps `REASON_EN` equal to the
    bundle's `en` table so the two can never drift."""

    key: str
    placeholders: Mapping[str, str] = field(default_factory=dict)

    # `placeholders` is an arbitrary Mapping, so the generated hash would raise
    # on the usual dict. Unhashable by declaration rather than by accident.
    __hash__ = None  # type: ignore[assignment]

    def render(self) -> str:
        return REASON_EN[self.key].format(**self.placeholders)


# The English for every `Reason` key. Mirrored (and pinned) by the panel bundle's
# `trace_reason` namespace in frontend/src/i18n-data.ts.
REASON_EN: dict[str, str] = {
    "day_workday_sensor_unconfigured": "workday sensor not configured",
    "day_workday_calendar_unconfigured": "workday calendar not configured",
    "lux_range_missing": "lux range {range} no longer exists",
    "lux_sensor_not_numeric": "{name} ({value}) does not report a number",
    "period_missing": "time-of-day period {period} no longer exists",
    "sun_not_configured": "the sun integration is not set up",
    "sun_anchor_undefined": "{anchor} is undefined at this location today",
    "weather_entity_unconfigured": "weather entity not configured",
    "weather_group_missing": "weather group {group} no longer exists",
}


@dataclass(frozen=True)
class Seg:
    """One segment of a translatable trace `detail`: literal text, an entity
    (its friendly name plus `entity_id` so the panel can link it), or a phrase
    (a `trace_detail` key plus placeholders the panel localises). Exactly one of
    text/entity/phrase is populated per seg."""

    t: str | None = None
    e: str | None = None
    k: str | None = None
    p: Mapping[str, str] = field(default_factory=dict)

    # `p` is an arbitrary Mapping, so the generated hash would raise on the usual
    # dict. Unhashable by declaration rather than by accident.
    __hash__ = None  # type: ignore[assignment]


Detail = list[Seg]


def text(s: str) -> Seg:
    return Seg(t=s)


def ent(entity_id: str, name: str) -> Seg:
    return Seg(e=entity_id, t=name)


def phrase(key: str, **ph: str) -> Seg:
    return Seg(k=key, p=ph)


def miss_cell(entity_id: str, name: str, key: str) -> Detail:
    """A per-entity describe cell for a sensor/person with no usable reading: its
    linkable name, a reason phrase (``not_found``/``unavailable``) and the ✗
    mark. Shared by the per-entity conditions (occupancy, lux, people)."""
    return [ent(entity_id, name), text(": "), phrase(key), text(" ✗")]


def _seg_text(s: Seg) -> str:
    return DETAIL_EN[s.k].format(**s.p) if s.k is not None else (s.t or "")


def render_detail(segs: Detail) -> str:
    return "".join(_seg_text(s) for s in segs)


def detail_to_wire(segs: Detail) -> list[dict]:
    """Serialise segments for the trace's `detail_segments`: every seg carries
    `t` (its English), a phrase also carries `k`+`p`, an entity also carries `e`.
    The panel localises a phrase by `k` and falls back to `t`, so a missing
    bundle key still renders English for every reader."""
    out: list[dict] = []
    for s in segs:
        if s.k is not None:
            out.append({"k": s.k, "p": dict(s.p), "t": _seg_text(s)})
        elif s.e is not None:
            out.append({"e": s.e, "t": s.t or ""})
        else:
            out.append({"t": s.t or ""})
    return out


def join_segs(cells: list[Detail], sep: str = ", ") -> Detail:
    out: Detail = []
    for i, cell in enumerate(cells):
        if i:
            out.append(text(sep))
        out.extend(cell)
    return out


def wrap_quantified_segs(cells: list[Detail], quant: Any, negate: bool) -> Detail:
    """Join per-cell ``describe`` segments for a sensor-quantifier condition: an
    ``all of:``/``any of:`` phrase prefix when more than one cell, then a
    ``not(...)`` wrap when negated."""
    body = join_segs(cells)
    if len(cells) > 1:
        body = [phrase("all_of" if quant == "all" else "any_of"), text(" "), *body]
    if negate:
        body = [phrase("negate"), text("("), *body, text(")")]
    return body


# The English for every `phrase` key. Mirrored (and pinned) by the panel bundle's
# `trace_detail` namespace in frontend/src/i18n-data.ts.
DETAIL_EN: dict[str, str] = {
    "not_found": "not found",
    "unavailable": "unavailable",
    "all_of": "all of:",
    "any_of": "any of:",
    "negate": "not",
    "any_sensor": "any sensor (no constraint)",
    "for_hold": "for {rel}{dur}",
    "held": "held {dur}",
    "not_held": "not held",
    "no_people_tracked": "no people tracked",
    "summary_home": "{n} of {total} home ({names})",
    "summary_home_zero": "0 of {total} home",
    "want": "want",
    "quant_anyone": "anyone",
    "quant_everyone": "everyone",
    "quant_nobody": "nobody",
    "where_home": "home",
    "where_not_home": "not home",
    "where_in": "in {zone}",
    "where_not_in": "not in {zone}",
    "loc_home": "home",
    "loc_away": "away",
    "loc_in": "in {zone}",
    "loc_not_in": "not in {zone}",
    "no_occupancy_sensors": "no occupancy sensors",
    "summary_active": "{n} of {total} active ({names})",
    "summary_active_zero": "0 of {total} active",
    "no_lux_sensors": "no lux sensors",
    "no_lux_readings": "no lux readings",
    "unknown_range": "unknown lux range: {range}",
    "want_band": "want {band}",
    "is": "is {values}",
    "is_not": "is not {values}",
    "no_entities": "no entities",
    "unavailable_any": "any unavailable",
    "summary_unavailable": "{n} of {total} unavailable ({names})",
    "summary_unavailable_zero": "0 of {total} unavailable",
    "sun_prefix": "Sun",
    "sun_elevation": "{deg}° elevation",
    "sun_azimuth": "{deg}° azimuth ({sector})",
}
