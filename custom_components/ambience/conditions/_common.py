"""Small helpers shared across the built-in conditions.

Several conditions need the same primitives: a frozenset of the HA "no real
value" states, a tolerant `{h,m,s}` duration reader, the matching save-time
validator for that duration, a numeric-interval merge, and a bool-rejecting
float coercion. Keeping one copy here avoids the set/tuple and
fix-it-in-one-place drift that crept in when each condition carried its own.
"""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

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
        raise ValueError("`for` must be a dict {h,m,s} or null")
    for k in ("h", "m", "s"):
        v = dur.get(k, 0)
        if not isinstance(v, int) or isinstance(v, bool) or v < 0:
            raise ValueError(f"`for.{k}` must be a non-negative int")


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
    """Coerce a numeric value to float, rejecting bools and non-numbers (→ None)."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    return float(value)
