"""Named-period store for the time_of_day condition.

Provides BUILTIN_PERIODS (code-shipped seeds, immutable) and PeriodStore (the
user-owned slice: custom map + hidden ids, shadowing built-ins).
"""

from __future__ import annotations

from typing import Any

from .conditions._common import valid_hour, valid_minute
from .errors import AmbienceError
from .named_def_store import NamedDefStore

# Endpoint shape:
#   {"kind": "time", "hh": int, "mm": int}
#   {"kind": "sun", "anchor": "sunrise"|"sunset"|"noon"|"midnight"|"dawn"|"dusk",
#    "offset_min": int,
#    "clamp"?: {"dir": "not_before"|"not_after", "hh": int, "mm": int}}

_VALID_ANCHORS = {"sunrise", "sunset", "noon", "midnight", "dawn", "dusk"}

# Key order is "specific-first, broad-last": `describe()` returns the first
# matching period, so e.g. a 2pm time reads as "afternoon" rather than the
# all-day "daytime". Likewise the broad "nighttime" (sunset→sunrise) contains
# both "evening" (sunset→dusk) and "dawn" (dawn→sunrise), so those narrower
# windows are listed first. (The time-of-day chooser applies its own display
# order.)
BUILTIN_PERIODS: dict[str, dict[str, Any]] = {
    "dawn": {
        "from": {"kind": "sun", "anchor": "dawn", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
    },
    "morning": {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "noon", "offset_min": 0},
    },
    "afternoon": {
        "from": {"kind": "sun", "anchor": "noon", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    },
    "evening": {
        "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
    },
    "nighttime": {
        "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
    },
    "daytime": {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    },
}


def _validate_clamp(clamp: Any) -> None:
    if not isinstance(clamp, dict):
        raise AmbienceError("period_clamp_not_object")
    if clamp.get("dir") not in ("not_before", "not_after"):
        raise AmbienceError("period_invalid_clamp_dir", value=clamp.get("dir"))
    hh, mm = clamp.get("hh"), clamp.get("mm")
    if not valid_hour(hh):
        raise AmbienceError("period_invalid_clamp_hh", value=hh)
    if not valid_minute(mm):
        raise AmbienceError("period_invalid_clamp_mm", value=mm)


def _validate_endpoint(ep: Any) -> None:
    if not isinstance(ep, dict) or "kind" not in ep:
        raise AmbienceError("period_endpoint_not_object")
    kind = ep["kind"]
    if kind == "time":
        hh, mm = ep.get("hh"), ep.get("mm")
        if not valid_hour(hh):
            raise AmbienceError("period_invalid_hh", value=hh)
        if not valid_minute(mm):
            raise AmbienceError("period_invalid_mm", value=mm)
    elif kind == "sun":
        if ep.get("anchor") not in _VALID_ANCHORS:
            raise AmbienceError("period_invalid_anchor", value=ep.get("anchor"))
        offset = ep.get("offset_min")
        if not isinstance(offset, int) or isinstance(offset, bool):
            raise AmbienceError("period_offset_not_int", value=offset)
        clamp = ep.get("clamp")
        if clamp is not None:
            _validate_clamp(clamp)
    else:
        raise AmbienceError("period_invalid_endpoint_kind", value=kind)


class PeriodStore(NamedDefStore):
    """Named-period store for the time_of_day condition (custom + hidden over
    BUILTIN_PERIODS). Shared store machinery lives in NamedDefStore; this class
    supplies the built-ins, the {from, to} validation, and the storage hooks."""

    builtins = BUILTIN_PERIODS
    kind = "period"

    def _read(self) -> dict[str, Any]:
        return self._storage.get_periods()

    async def _write(self, payload: dict[str, Any]) -> None:
        await self._storage.async_save_periods(payload)

    def validate_definition(self, defn: Any) -> None:
        """Raise AmbienceError if defn is not a well-shaped {from, to} period definition."""
        if not isinstance(defn, dict):
            raise AmbienceError("period_def_not_object")
        if "from" not in defn or "to" not in defn:
            raise AmbienceError("period_def_missing_from_to")
        _validate_endpoint(defn["from"])
        _validate_endpoint(defn["to"])
        # from == to (matches all day at runtime) is left valid: rejecting it
        # would block saving the periods store whenever any period holds such a
        # previously-valid definition.
