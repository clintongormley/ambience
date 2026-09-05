"""Small helpers shared across the built-in conditions.

Several conditions need the same primitives: a frozenset of the HA "no real
value" states, a tolerant `{h,m,s}` duration reader, the matching save-time
validator for that duration, a numeric-interval merge, and a bool-rejecting
float coercion. Keeping one copy here avoids the set/tuple and
fix-it-in-one-place drift that crept in when each condition carried its own.
"""

from __future__ import annotations

import math
from collections.abc import Callable, Iterable, Mapping
from datetime import datetime
from typing import Any

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


def wrap_quantified(parts: list[str], quant: Any, negate: bool) -> str:
    """Join per-sensor ``describe`` cells and wrap them for a sensor-quantifier
    condition: an ``all of:``/``any of:`` prefix when more than one sensor, then a
    ``not(...)`` wrap when the predicate is negated. Callers append exactly one
    ``part`` per sensor, so ``len(parts)`` is the sensor count."""
    body = ", ".join(parts)
    if len(parts) > 1:
        body = f"{'all' if quant == 'all' else 'any'} of: {body}"
    if negate:
        body = f"not({body})"
    return body


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
