"""Tests for the shared condition helpers in conditions/_common.py."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.util import dt as dt_util

from custom_components.ambience.conditions._common import (
    RULE_NOT_FALSE,
    RULE_OR,
    RULE_TRUTHY,
    UNAVAILABLE,
    as_float,
    as_float_state,
    compare_numeric,
    dur_seconds,
    fmt_duration,
    for_comparator_symbol,
    for_elapsed_satisfied,
    kleene_all,
    kleene_any,
    kleene_not,
    materialise_defaults,
    merge_intervals,
    tenure_held,
    tenure_within,
    valid_clock,
    valid_hour,
    valid_minute,
    validate_entity_ids,
    validate_for,
    validate_for_mode,
)
from custom_components.ambience.errors import AmbienceError


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


def test_tenure_within_holds_for_less_than_window() -> None:
    now = dt_util.utcnow()
    # Held for less than the window -> within.
    assert tenure_within({"k": now - timedelta(seconds=59)}, "k", now, 60.0) is True
    # Held for exactly the window -> not within (boundary is exclusive).
    assert tenure_within({"k": now - timedelta(seconds=60)}, "k", now, 60.0) is False
    # Held well past the window -> not within.
    assert tenure_within({"k": now - timedelta(seconds=600)}, "k", now, 60.0) is False
    # Absent key -> instant test only just became true (elapsed ~0) -> within.
    assert tenure_within({}, "k", now, 60.0) is True


def test_for_comparator_symbol_follows_mode() -> None:
    # "less_than" renders "<"; everything else (at_least default / None) renders "≥".
    assert for_comparator_symbol("less_than") == "<"
    assert for_comparator_symbol("at_least") == "≥"
    assert for_comparator_symbol(None) == "≥"


def test_for_elapsed_satisfied_follows_mode() -> None:
    # less_than: elapsed strictly under the window (boundary exclusive).
    assert for_elapsed_satisfied(59.0, 60.0, "less_than") is True
    assert for_elapsed_satisfied(60.0, 60.0, "less_than") is False
    # at_least (default / None): elapsed at or past the window.
    assert for_elapsed_satisfied(60.0, 60.0, "at_least") is True
    assert for_elapsed_satisfied(59.0, 60.0, "at_least") is False
    assert for_elapsed_satisfied(60.0, 60.0, None) is True


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
    with pytest.raises(AmbienceError):
        validate_for(bad)


def test_validate_for_rejects_unknown_keys() -> None:
    """`{"hours": 1}` (a plausible hand-edit) must not validate — dur_seconds
    would silently evaluate it to a 0-second gate."""
    with pytest.raises(AmbienceError) as exc:
        validate_for({"hours": 1})
    assert exc.value.translation_key == "for_keys_invalid"


def test_validate_for_mode_allows_none_and_valid() -> None:
    validate_for_mode(None)  # no raise (means at_least)
    validate_for_mode("at_least")  # no raise
    validate_for_mode("less_than")  # no raise


@pytest.mark.parametrize(
    "bad",
    [
        "at_most",  # not a recognised mode
        "AT_LEAST",  # case-sensitive
        "",
        5,
        {},
    ],
)
def test_validate_for_mode_rejects_unknown_values(bad: object) -> None:
    with pytest.raises(AmbienceError):
        validate_for_mode(bad)


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


# ── validate_entity_ids / translatable validator errors ───────────────────────


def test_validate_for_raises_translatable_keys() -> None:
    """Every `for`/`for_mode` rejection carries a translation key, not prose."""
    with pytest.raises(AmbienceError) as exc:
        validate_for("not-a-dict")
    assert exc.value.translation_key == "for_not_object"
    with pytest.raises(AmbienceError) as exc:
        validate_for({"hours": 1})
    assert exc.value.translation_key == "for_keys_invalid"
    with pytest.raises(AmbienceError) as exc:
        validate_for({"h": -1})
    assert exc.value.translation_key == "for_component_invalid"
    with pytest.raises(AmbienceError) as exc:
        validate_for_mode("at_most")
    assert exc.value.translation_key == "for_mode_invalid"


def test_validate_entity_ids_accepts_well_formed_ids() -> None:
    validate_entity_ids(["sensor.hall_lux", "sensor.x2"], "sensor", key="lux_sensors_not_list")
    validate_entity_ids([], "sensor", key="lux_sensors_not_list")
    # No domain: only the entity-id grammar is enforced.
    validate_entity_ids(["light.kitchen", "person.ann"], key="unavailable_pick_entity")


def test_validate_entity_ids_rejects_non_list() -> None:
    with pytest.raises(AmbienceError) as exc:
        validate_entity_ids("sensor.hall", "sensor", key="lux_sensors_not_list")
    assert exc.value.translation_key == "lux_sensors_not_list"


@pytest.mark.parametrize("bad", ["sensor.", "sensor", "", "sensor.Bad Id", 7, None])
def test_validate_entity_ids_rejects_malformed_ids(bad: object) -> None:
    """A domain prefix alone (`sensor.`) or a space/uppercase in the object id is
    not a valid entity id — the old `startswith` test let all of these through."""
    with pytest.raises(AmbienceError) as exc:
        validate_entity_ids([bad], "sensor", key="lux_sensors_not_list")
    assert exc.value.translation_key == "entity_id_invalid"


def test_validate_entity_ids_rejects_wrong_domain() -> None:
    with pytest.raises(AmbienceError) as exc:
        validate_entity_ids(["person.ann"], "sensor", key="lux_sensors_not_list")
    assert exc.value.translation_key == "entity_id_wrong_domain"
    assert exc.value.translation_placeholders == {"entity_id": "person.ann", "domain": "sensor"}


# --- materialise_defaults -----------------------------------------------------

_DEFAULTS_TABLE = {
    "quant": (RULE_OR, "any"),
    "negate": (RULE_TRUTHY, False),
    "occupied": (RULE_NOT_FALSE, True),
}


def test_materialise_defaults_applies_each_rule() -> None:
    assert materialise_defaults({}, _DEFAULTS_TABLE) == {
        "quant": "any",
        "negate": False,
        "occupied": True,
    }
    # Explicit nulls take the same defaults as absent keys...
    assert materialise_defaults(
        {"quant": None, "negate": None, "occupied": None}, _DEFAULTS_TABLE
    ) == {"quant": "any", "negate": False, "occupied": True}
    # ...except an explicit False for a NOT_FALSE key, which is a real value.
    assert materialise_defaults({"occupied": False}, _DEFAULTS_TABLE)["occupied"] is False


def test_materialise_defaults_keeps_stated_values_and_key_order() -> None:
    pred = {"sensors": ["binary_sensor.a"], "negate": True, "quant": "all"}
    out = materialise_defaults(pred, _DEFAULTS_TABLE)
    assert out == {**pred, "occupied": True}
    # Stated keys keep their position; filled ones follow in table order.
    assert list(out) == ["sensors", "negate", "quant", "occupied"]


def test_materialise_defaults_passes_non_dicts_through() -> None:
    assert materialise_defaults(None, _DEFAULTS_TABLE) is None
    assert materialise_defaults("nonsense", _DEFAULTS_TABLE) == "nonsense"


def test_materialise_defaults_returns_the_same_object_when_nothing_changes() -> None:
    """The common case after save: the stored predicate already states every
    default, so the fill must not allocate a copy per read."""
    pred = {"sensors": ["binary_sensor.a"], "quant": "any", "negate": False, "occupied": True}
    assert materialise_defaults(pred, _DEFAULTS_TABLE) is pred


def test_materialise_defaults_copies_when_a_value_is_not_the_canonical_type() -> None:
    """A hand-edited `1` for a bool key is not `True`; the fast path must not
    wave it through into the stored form."""
    pred = {"quant": "any", "negate": 1, "occupied": True}
    out = materialise_defaults(pred, _DEFAULTS_TABLE)
    assert out is not pred
    assert out["negate"] is True


def test_as_float_state_parses_strings_and_numbers_and_rejects_the_rest() -> None:
    assert as_float_state("12.5") == 12.5
    assert as_float_state(" 7 ") == 7.0
    assert as_float_state(3) == 3.0
    assert as_float_state(None) is None
    assert as_float_state("unavailable") is None
    assert as_float_state({"a": 1}) is None
    assert as_float_state("nan") is None
    assert as_float_state("inf") is None


def test_compare_numeric_covers_the_four_operators_and_rejects_others() -> None:
    assert compare_numeric(5.0, "<", 6.0)
    assert compare_numeric(5.0, "<=", 5.0)
    assert compare_numeric(6.0, ">", 5.0)
    assert compare_numeric(5.0, ">=", 5.0)
    assert not compare_numeric(5.0, "==", 5.0)
    assert not compare_numeric(5.0, "is", 5.0)


def test_valid_clock_helpers_reject_bool_floats_and_out_of_range() -> None:
    assert valid_hour(0) and valid_hour(23)
    assert not valid_hour(24) and not valid_hour(-1) and not valid_hour(True)
    assert not valid_hour(1.0)
    assert valid_minute(0) and valid_minute(59)
    assert not valid_minute(60) and not valid_minute(False) and not valid_minute("5")
    assert valid_clock(9, 30)
    assert not valid_clock(9, 60) and not valid_clock(24, 0)
