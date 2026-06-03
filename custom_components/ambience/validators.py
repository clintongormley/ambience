"""Shared validation for the per-action `reapply_seconds` setting.

`reapply_seconds` appears on both exposed-action catalog entries (the default)
and per-scene actions (the override), and the resolver in `service.py` reads it
back. Centralising the bound here keeps the three sites from drifting.
"""

from __future__ import annotations

from typing import Any

# An action re-applies only at intervals of at least this many seconds; anything
# below (but non-zero) is rejected at save time. 0 means "off".
MIN_REAPPLY_SECONDS = 10


def validate_reapply_seconds(context: str, value: Any) -> None:
    """`reapply_seconds`, when present, must be an int that is 0 or >= the floor.

    Raises ValueError (prefixed with `context`) for bools, non-ints, negatives,
    and values between 1 and the floor.
    """
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError(f"{context}: reapply_seconds must be an integer")
    if value != 0 and value < MIN_REAPPLY_SECONDS:
        raise ValueError(f"{context}: reapply_seconds must be 0 or at least {MIN_REAPPLY_SECONDS}")
