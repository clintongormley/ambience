"""Tests for the shared condition helpers in conditions/_common.py."""

from __future__ import annotations

import pytest

from custom_components.ambience.conditions._common import (
    UNAVAILABLE,
    as_float,
    dur_seconds,
    fmt_duration,
    merge_intervals,
    validate_for,
)


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
