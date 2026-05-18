"""Named-period store for the time_of_day matcher.

Provides BUILTIN_PERIODS (code-shipped seeds, immutable) and PeriodStore (the
user-owned slice: custom map + hidden ids, shadowing built-ins).
"""

from __future__ import annotations

from typing import Any, Protocol

# Endpoint shape:
#   {"kind": "time", "hh": int, "mm": int}
#   {"kind": "sun", "anchor": "sunrise"|"sunset"|"noon"|"midnight"|"dawn"|"dusk",
#    "offset_min": int}

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
