"""Named lux-range store for the lux condition.

Provides BUILTIN_LUX_RANGES (code-shipped seeds, immutable) and LuxRangeStore
(the user-owned slice: custom map + hidden ids, shadowing built-ins).

A lux range is a half-open numeric band ``min <= lux < max``; either bound may
be omitted for an open range. Mirrors the named-period machinery in periods.py.
"""

from __future__ import annotations

from typing import Any

from .errors import AmbienceError
from .named_def_store import NamedDefStore

# Half-open bands (min <= lux < max), contiguous with no gaps/overlaps. Ascending
# by brightness; since the bands don't overlap, order doesn't affect matching.
BUILTIN_LUX_RANGES: dict[str, dict[str, Any]] = {
    "dark": {"max": 10},
    "dim": {"min": 10, "max": 50},
    "normal": {"min": 50, "max": 300},
    "bright": {"min": 300, "max": 1000},
    "very_bright": {"min": 1000},
}


def validate_int_bound(value: Any, which: str) -> None:
    """Validate an optional lux bound: None, or a non-negative int (rejecting
    bool, an int subclass). Shared by the store and the lux condition."""
    if value is None:
        return
    # bool is an int subclass — reject it so True/False can't become 1/0.
    if not isinstance(value, int) or isinstance(value, bool):
        raise AmbienceError("lux_not_integer", which=which, value=value)
    if value < 0:
        raise AmbienceError("lux_negative", which=which, value=value)


class LuxRangeStore(NamedDefStore):
    """Named lux-range store for the lux condition (custom + hidden over
    BUILTIN_LUX_RANGES). Shared store machinery lives in NamedDefStore; this
    class supplies the built-ins, the {min?, max?} band validation, and the
    storage hooks."""

    builtins = BUILTIN_LUX_RANGES
    kind = "lux range"

    def _read(self) -> dict[str, Any]:
        return self._storage.get_lux_ranges()

    async def _write(self, payload: dict[str, Any]) -> None:
        await self._storage.async_save_lux_ranges(payload)

    def validate_definition(self, defn: Any) -> None:
        """Raise AmbienceError if defn is not a well-shaped {min?, max?} band."""
        if not isinstance(defn, dict):
            raise AmbienceError("lux_def_not_object")
        lo, hi = defn.get("min"), defn.get("max")
        if lo is None and hi is None:
            raise AmbienceError("lux_def_needs_min_or_max")
        validate_int_bound(lo, "min")
        validate_int_bound(hi, "max")
        if lo is not None and hi is not None and lo >= hi:
            raise AmbienceError("lux_min_not_below_max", min=lo, max=hi)
