"""Named-period store for the time_of_day condition.

Provides BUILTIN_PERIODS (code-shipped seeds, immutable) and PeriodStore (the
user-owned slice: custom map + hidden ids, shadowing built-ins).
"""

from __future__ import annotations

from typing import Any

from .named_def_store import NamedDefStore

# Endpoint shape:
#   {"kind": "time", "hh": int, "mm": int}
#   {"kind": "sun", "anchor": "sunrise"|"sunset"|"noon"|"midnight"|"dawn"|"dusk",
#    "offset_min": int,
#    "clamp"?: {"dir": "not_before"|"not_after", "hh": int, "mm": int}}

_VALID_ANCHORS = {"sunrise", "sunset", "noon", "midnight", "dawn", "dusk"}

# Key order is "specific-first, broad-last": `describe()` returns the first
# matching period, so e.g. a 2pm time reads as "afternoon" rather than the
# all-day "daytime". (The time-of-day chooser applies its own display order.)
BUILTIN_PERIODS: dict[str, dict[str, Any]] = {
    "morning": {
        "from": {"kind": "sun", "anchor": "dawn", "offset_min": 0},
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
        "from": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "dawn", "offset_min": 0},
    },
    "daytime": {
        "from": {"kind": "sun", "anchor": "dawn", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    },
}


def _validate_clamp(clamp: Any) -> None:
    if not isinstance(clamp, dict):
        raise ValueError(f"clamp must be an object: {clamp!r}")
    if clamp.get("dir") not in ("not_before", "not_after"):
        raise ValueError(f"invalid clamp dir: {clamp.get('dir')!r}")
    hh, mm = clamp.get("hh"), clamp.get("mm")
    if not isinstance(hh, int) or isinstance(hh, bool) or not 0 <= hh <= 23:
        raise ValueError(f"invalid clamp hh: {hh!r}")
    if not isinstance(mm, int) or isinstance(mm, bool) or not 0 <= mm <= 59:
        raise ValueError(f"invalid clamp mm: {mm!r}")


def _validate_endpoint(ep: Any) -> None:
    if not isinstance(ep, dict) or "kind" not in ep:
        raise ValueError(f"endpoint must be an object with 'kind': {ep!r}")
    kind = ep["kind"]
    if kind == "time":
        hh, mm = ep.get("hh"), ep.get("mm")
        if not isinstance(hh, int) or isinstance(hh, bool) or not 0 <= hh <= 23:
            raise ValueError(f"invalid hh: {hh!r}")
        if not isinstance(mm, int) or isinstance(mm, bool) or not 0 <= mm <= 59:
            raise ValueError(f"invalid mm: {mm!r}")
    elif kind == "sun":
        if ep.get("anchor") not in _VALID_ANCHORS:
            raise ValueError(f"invalid anchor: {ep.get('anchor')!r}")
        offset = ep.get("offset_min")
        if not isinstance(offset, int) or isinstance(offset, bool):
            raise ValueError(f"offset_min must be int: {offset!r}")
        clamp = ep.get("clamp")
        if clamp is not None:
            _validate_clamp(clamp)
    else:
        raise ValueError(f"invalid endpoint kind: {kind!r}")


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
        """Raise ValueError if defn is not a well-shaped {from, to} period definition."""
        if not isinstance(defn, dict):
            raise ValueError(f"period definition must be an object: {defn!r}")
        if "from" not in defn or "to" not in defn:
            raise ValueError(f"period definition needs 'from' and 'to': {defn!r}")
        _validate_endpoint(defn["from"])
        _validate_endpoint(defn["to"])
        # from == to (matches all day at runtime) is left valid: rejecting it
        # would block saving the periods store whenever any period holds such a
        # previously-valid definition.
