"""Named-period store for the time_of_day matcher.

Provides BUILTIN_PERIODS (code-shipped seeds, immutable) and PeriodStore (the
user-owned slice: custom map + hidden ids, shadowing built-ins).
"""

from __future__ import annotations

import re
from typing import Any, Protocol

# Endpoint shape:
#   {"kind": "time", "hh": int, "mm": int}
#   {"kind": "sun", "anchor": "sunrise"|"sunset"|"noon"|"midnight"|"dawn"|"dusk",
#    "offset_min": int}

_PERIOD_ID_RE = re.compile(r"^[a-z][a-z0-9_]*$")
_VALID_ANCHORS = {"sunrise", "sunset", "noon", "midnight", "dawn", "dusk"}

BUILTIN_PERIODS: dict[str, dict[str, Any]] = {
    "morning": {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": 30},
        "to": {"kind": "sun", "anchor": "noon", "offset_min": -60},
    },
    "afternoon": {
        "from": {"kind": "sun", "anchor": "noon", "offset_min": 60},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": -30},
    },
    "evening": {
        "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
    },
    "night": {
        "from": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "dawn", "offset_min": 0},
    },
    "day": {
        "from": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
        "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
    },
}


def _validate_endpoint(ep: Any) -> None:
    if not isinstance(ep, dict) or "kind" not in ep:
        raise ValueError(f"endpoint must be an object with 'kind': {ep!r}")
    kind = ep["kind"]
    if kind == "time":
        hh, mm = ep.get("hh"), ep.get("mm")
        if not isinstance(hh, int) or not 0 <= hh <= 23:
            raise ValueError(f"invalid hh: {hh!r}")
        if not isinstance(mm, int) or not 0 <= mm <= 59:
            raise ValueError(f"invalid mm: {mm!r}")
    elif kind == "sun":
        if ep.get("anchor") not in _VALID_ANCHORS:
            raise ValueError(f"invalid anchor: {ep.get('anchor')!r}")
        if not isinstance(ep.get("offset_min"), int):
            raise ValueError(f"offset_min must be int: {ep.get('offset_min')!r}")
    else:
        raise ValueError(f"invalid endpoint kind: {kind!r}")


class _StorageLike(Protocol):
    def get_periods(self) -> dict[str, Any]: ...
    async def async_save_periods(self, payload: dict[str, Any]) -> None: ...


class PeriodStore:
    """Manages the user-owned (custom + hidden) period slice and the merged view."""

    def __init__(self, storage: _StorageLike) -> None:
        self._storage = storage

    def effective(self) -> dict[str, dict[str, Any]]:
        """Merged view: (BUILTIN_PERIODS ∪ custom) − hidden, with custom shadowing builtin.

        Iteration order: BUILTIN_PERIODS first (in shipped order), then custom-only ids
        in insertion order.
        """
        user = self._storage.get_periods()
        custom = user.get("custom", {})
        hidden = set(user.get("hidden", []))
        result: dict[str, dict[str, Any]] = {}
        for pid, defn in BUILTIN_PERIODS.items():
            if pid in hidden:
                continue
            result[pid] = custom.get(pid, defn)
        for pid, defn in custom.items():
            if pid in BUILTIN_PERIODS:
                continue  # already handled above
            result[pid] = defn
        return result

    def validate_definition(self, defn: Any) -> None:
        """Raise ValueError if defn is not a well-shaped {from, to} period definition."""
        if not isinstance(defn, dict):
            raise ValueError(f"period definition must be an object: {defn!r}")
        if "from" not in defn or "to" not in defn:
            raise ValueError(f"period definition needs 'from' and 'to': {defn!r}")
        _validate_endpoint(defn["from"])
        _validate_endpoint(defn["to"])

    async def save(self, custom: dict[str, Any], hidden: list[str]) -> None:
        """Validate then persist the user-owned slice atomically.

        Rejects the whole save on any malformed entry; no partial writes."""
        if not isinstance(custom, dict):
            raise ValueError("custom must be an object")
        if not isinstance(hidden, list):
            raise ValueError("hidden must be a list")
        for pid in custom:
            if not isinstance(pid, str) or not _PERIOD_ID_RE.match(pid):
                raise ValueError(f"invalid period id: {pid!r}")
            self.validate_definition(custom[pid])
        for pid in hidden:
            if pid not in BUILTIN_PERIODS:
                raise ValueError(f"only built-in ids can be hidden: {pid!r}")
        await self._storage.async_save_periods({"custom": custom, "hidden": hidden})

    async def reset(self) -> None:
        """Clear custom + hidden."""
        await self._storage.async_save_periods({"custom": {}, "hidden": []})
