"""Tests for the named lux-range store."""

from __future__ import annotations

import pytest

from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.lux_ranges import BUILTIN_LUX_RANGES, LuxRangeStore


class _FakeStorage:
    """Stand-in for AmbienceStore exposing only the lux-range methods."""

    def __init__(self, ranges: dict | None = None) -> None:
        self._ranges = ranges or {"custom": {}, "hidden": []}
        self.saved: list[dict] = []

    def get_lux_ranges(self) -> dict:
        return self._ranges

    async def async_save_lux_ranges(self, payload: dict) -> None:
        self._ranges = payload
        self.saved.append(payload)


def test_builtin_lux_ranges_contains_expected_seeds() -> None:
    assert set(BUILTIN_LUX_RANGES) == {"dark", "dim", "normal", "bright", "very_bright"}


def test_builtin_lux_ranges_are_contiguous_half_open() -> None:
    # Adjacent bands meet at a single value with no gap/overlap: a band's `max`
    # equals the next band's `min`.
    assert BUILTIN_LUX_RANGES["dark"] == {"max": 10}
    assert BUILTIN_LUX_RANGES["dim"] == {"min": 10, "max": 50}
    assert BUILTIN_LUX_RANGES["normal"] == {"min": 50, "max": 300}
    assert BUILTIN_LUX_RANGES["bright"] == {"min": 300, "max": 1000}
    assert BUILTIN_LUX_RANGES["very_bright"] == {"min": 1000}


def test_effective_returns_builtins_when_no_custom_or_hidden() -> None:
    store = LuxRangeStore(_FakeStorage())
    assert set(store.effective()) == set(BUILTIN_LUX_RANGES)


def test_effective_excludes_hidden_builtins() -> None:
    store = LuxRangeStore(_FakeStorage({"custom": {}, "hidden": ["dark"]}))
    effective = store.effective()
    assert "dark" not in effective
    assert "dim" in effective


def test_effective_includes_custom_only_ranges() -> None:
    store = LuxRangeStore(
        _FakeStorage({"custom": {"gloomy": {"min": 5, "max": 30, "label": "Gloomy"}}, "hidden": []})
    )
    assert "gloomy" in store.effective()


def test_custom_shadows_builtin_with_same_id() -> None:
    custom_dark = {"max": 5, "label": None}
    store = LuxRangeStore(_FakeStorage({"custom": {"dark": custom_dark}, "hidden": []}))
    assert store.effective()["dark"] == custom_dark


def test_effective_iteration_order_builtins_then_custom_only() -> None:
    store = LuxRangeStore(_FakeStorage({"custom": {"gloomy": {"min": 5, "max": 30}}, "hidden": []}))
    ids = list(store.effective())
    assert ids[: len(BUILTIN_LUX_RANGES)] == list(BUILTIN_LUX_RANGES)
    assert ids[-1] == "gloomy"


def test_validate_definition_accepts_both_bounds() -> None:
    LuxRangeStore(_FakeStorage()).validate_definition({"min": 10, "max": 50})  # no raise


def test_validate_definition_accepts_open_bounds() -> None:
    LuxRangeStore(_FakeStorage()).validate_definition({"max": 10})  # no raise
    LuxRangeStore(_FakeStorage()).validate_definition({"min": 1000})  # no raise


@pytest.mark.parametrize(
    "bad",
    [
        {},  # neither bound
        {"min": None, "max": None},  # neither bound
        {"min": 50, "max": 10},  # min >= max
        {"min": 10, "max": 10},  # min == max (empty half-open band)
        {"min": -1, "max": 10},  # negative
        {"min": 1.5},  # not an int
        {"max": True},  # bool is not a valid int bound
        {"min": "10"},  # not an int
    ],
)
def test_validate_definition_rejects_invalid(bad: dict) -> None:
    with pytest.raises(AmbienceError):
        LuxRangeStore(_FakeStorage()).validate_definition(bad)


def test_validate_definition_rejects_non_dict() -> None:
    with pytest.raises(AmbienceError) as exc:
        LuxRangeStore(_FakeStorage()).validate_definition("nope")
    assert exc.value.translation_key == "lux_def_not_object"


async def test_save_persists_full_payload() -> None:
    storage = _FakeStorage()
    store = LuxRangeStore(storage)
    payload = {"custom": {"gloomy": {"min": 5, "max": 30, "label": "Gloomy"}}, "hidden": ["dark"]}
    await store.save(payload["custom"], payload["hidden"])
    assert storage.saved == [payload]


async def test_save_rejects_malformed_custom_entry() -> None:
    storage = _FakeStorage()
    store = LuxRangeStore(storage)
    with pytest.raises(AmbienceError):
        await store.save({"bad": {"min": 50, "max": 10}}, [])
    assert storage.saved == []


async def test_save_rejects_invalid_range_id() -> None:
    store = LuxRangeStore(_FakeStorage())
    valid = {"min": 5, "max": 30, "label": None}
    with pytest.raises(AmbienceError) as exc:
        await store.save({"Has Space": valid}, [])
    assert exc.value.translation_key == "named_def_invalid_id"
    with pytest.raises(AmbienceError) as exc:
        await store.save({"1starts_with_digit": valid}, [])
    assert exc.value.translation_key == "named_def_invalid_id"


async def test_save_rejects_custom_not_a_dict() -> None:
    with pytest.raises(AmbienceError) as exc:
        await LuxRangeStore(_FakeStorage()).save(["nope"], [])  # type: ignore[arg-type]
    assert exc.value.translation_key == "named_def_custom_not_object"


async def test_save_rejects_hidden_not_a_list() -> None:
    with pytest.raises(AmbienceError) as exc:
        await LuxRangeStore(_FakeStorage()).save({}, "dark")  # type: ignore[arg-type]
    assert exc.value.translation_key == "named_def_hidden_not_list"


async def test_save_rejects_hiding_non_builtin_id() -> None:
    with pytest.raises(AmbienceError) as exc:
        await LuxRangeStore(_FakeStorage()).save({}, ["gloomy"])
    assert exc.value.translation_key == "named_def_only_builtin_hideable"


async def test_reset_clears_custom_and_hidden() -> None:
    storage = _FakeStorage({"custom": {"gloomy": {"min": 5, "max": 30}}, "hidden": ["dark"]})
    store = LuxRangeStore(storage)
    await store.reset()
    assert storage.saved == [{"custom": {}, "hidden": []}]


def test_view_for_ui_returns_builtins_custom_hidden() -> None:
    storage = _FakeStorage({"custom": {"gloomy": {"min": 5, "max": 30}}, "hidden": ["dark"]})
    view = LuxRangeStore(storage).view_for_ui()
    assert view["builtins"] == BUILTIN_LUX_RANGES
    assert view["custom"] == storage.get_lux_ranges()["custom"]
    assert view["hidden"] == ["dark"]


# ---------------------------------------------------------------------------
# Representative AmbienceError key + placeholder assertions (A4 TDD)
# ---------------------------------------------------------------------------


def test_lux_not_integer_key_and_placeholders() -> None:
    """lux_not_integer carries which/value placeholders."""
    from custom_components.ambience.lux_ranges import validate_int_bound

    with pytest.raises(AmbienceError) as exc:
        validate_int_bound(1.5, "min")
    assert exc.value.translation_key == "lux_not_integer"
    assert exc.value.translation_placeholders["which"] == "min"
    assert exc.value.translation_placeholders["value"] == "1.5"


def test_lux_min_not_below_max_key_and_placeholders() -> None:
    """lux_min_not_below_max carries min/max placeholders."""
    with pytest.raises(AmbienceError) as exc:
        LuxRangeStore(_FakeStorage()).validate_definition({"min": 100, "max": 50})
    assert exc.value.translation_key == "lux_min_not_below_max"
    assert exc.value.translation_placeholders["min"] == "100"
    assert exc.value.translation_placeholders["max"] == "50"
