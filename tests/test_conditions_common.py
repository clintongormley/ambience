"""Tests for the shared condition helpers in conditions/_common.py."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions._common import (
    UNAVAILABLE,
    as_float,
    dur_seconds,
    fmt_duration,
    kleene_all,
    kleene_any,
    kleene_not,
    merge_intervals,
    tenure_held,
    validate_for,
)


def test_tenure_held_requires_recorded_since_at_or_past_window() -> None:
    now = dt_util.utcnow()
    # Gate never seen true -> not held.
    assert tenure_held({}, "k", now, 60.0) is False
    # Recorded, but not held long enough yet.
    assert tenure_held({"k": now - timedelta(seconds=59)}, "k", now, 60.0) is False
    # Held for exactly the window -> held.
    assert tenure_held({"k": now - timedelta(seconds=60)}, "k", now, 60.0) is True
    # Held well past the window -> held.
    assert tenure_held({"k": now - timedelta(seconds=600)}, "k", now, 60.0) is True
    # A different gate key is absent -> not held.
    assert tenure_held({"other": now - timedelta(seconds=600)}, "k", now, 60.0) is False


def test_kleene_any_truth_table() -> None:
    assert kleene_any([False, True, None]) is True  # any True wins
    assert kleene_any([False, None, False]) is None  # no True, an unobservable
    assert kleene_any([False, False]) is False  # all observably false
    assert kleene_any([]) is False  # vacuous


def test_kleene_all_truth_table() -> None:
    assert kleene_all([True, False, None]) is False  # any False wins
    assert kleene_all([True, None, True]) is None  # no False, an unobservable
    assert kleene_all([True, True]) is True  # all observably true
    assert kleene_all([]) is True  # vacuous


def test_kleene_not_preserves_unobservable() -> None:
    assert kleene_not(True) is False
    assert kleene_not(False) is True
    assert kleene_not(None) is None


def test_fmt_duration_compact_hms() -> None:
    assert fmt_duration(5) == "5s"
    assert fmt_duration(300) == "5m"
    assert fmt_duration(1500) == "25m"
    assert fmt_duration(90) == "1m30s"
    assert fmt_duration(3600) == "1h"
    assert fmt_duration(3661) == "1h1m1s"
    assert fmt_duration(0) == "0s"
    # Fractional seconds floor to whole seconds.
    assert fmt_duration(5.9) == "5s"


def test_unavailable_contains_the_ha_no_value_states() -> None:
    assert "unavailable" in UNAVAILABLE
    assert "unknown" in UNAVAILABLE
    assert "on" not in UNAVAILABLE


def test_dur_seconds_sums_components() -> None:
    assert dur_seconds({"h": 1, "m": 2, "s": 3}) == 3723.0
    assert dur_seconds({}) == 0.0


def test_dur_seconds_non_dict_is_zero() -> None:
    assert dur_seconds(None) == 0.0
    assert dur_seconds("nope") == 0.0


def test_dur_seconds_tolerates_non_numeric_stored_fields() -> None:
    """The matching path runs against stored data that may be hand-edited; a
    malformed component counts as 0 rather than raising."""
    assert dur_seconds({"h": "abc"}) == 0.0
    assert dur_seconds({"h": 1, "m": "x", "s": None}) == 3600.0


def test_validate_for_allows_none_and_valid() -> None:
    validate_for(None)  # no raise
    validate_for({"h": 0, "m": 30, "s": 0})  # no raise


@pytest.mark.parametrize(
    "bad",
    [
        "not-a-dict",
        {"h": -1},
        {"m": 1.5},
        {"s": True},  # bool is not an int here
    ],
)
def test_validate_for_rejects_bad_shapes(bad: object) -> None:
    with pytest.raises(ValueError):
        validate_for(bad)


def test_validate_for_rejects_unknown_keys() -> None:
    """`{"hours": 1}` (a plausible hand-edit) must not validate — dur_seconds
    would silently evaluate it to a 0-second gate."""
    with pytest.raises(ValueError, match="h/m/s"):
        validate_for({"hours": 1})


def test_merge_intervals_merges_overlaps_and_sorts() -> None:
    assert merge_intervals([(2.0, 3.0), (0.0, 1.0), (0.5, 2.5)]) == [(0.0, 3.0)]
    assert merge_intervals([(0.0, 1.0), (2.0, 3.0)]) == [(0.0, 1.0), (2.0, 3.0)]
    assert merge_intervals([]) == []


def test_as_float_coerces_numbers_and_rejects_bool_and_non_numbers() -> None:
    assert as_float(3) == 3.0
    assert as_float(2.5) == 2.5
    assert as_float(True) is None
    assert as_float("5") is None
    assert as_float(None) is None


def test_as_float_rejects_non_finite() -> None:
    """NaN passes every bound comparison the wrong way (nan < lo and nan >= hi
    are both False) — treat non-finite as unobservable, like lux already does."""
    assert as_float(float("nan")) is None
    assert as_float(float("inf")) is None
    assert as_float(float("-inf")) is None
