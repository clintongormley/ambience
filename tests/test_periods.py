"""Tests for the named-period store."""

from __future__ import annotations

import pytest

from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.periods import BUILTIN_PERIODS, PeriodStore


class _FakeStorage:
    """Stand-in for AmbienceStore exposing only the period methods."""

    def __init__(self, periods: dict | None = None) -> None:
        self._periods = periods or {"custom": {}, "hidden": []}
        self.saved: list[dict] = []

    def get_periods(self) -> dict:
        return self._periods

    async def async_save_periods(self, payload: dict) -> None:
        self._periods = payload
        self.saved.append(payload)


def test_builtin_periods_contains_expected_seeds() -> None:
    assert set(BUILTIN_PERIODS) == {
        "dawn",
        "morning",
        "afternoon",
        "evening",
        "nighttime",
        "daytime",
    }


def test_builtin_periods_specific_before_broad_daytime() -> None:
    # Order matters for describe()'s first-match: the all-day "daytime" span must
    # come after the narrower periods so a mid-afternoon time reads "afternoon".
    ids = list(BUILTIN_PERIODS)
    assert ids.index("daytime") > ids.index("afternoon")


def test_builtin_period_anchors() -> None:
    # The seeded boundaries, by sun anchor (offsets all zero).
    def span(pid: str) -> tuple[str, str]:
        defn = BUILTIN_PERIODS[pid]
        return defn["from"]["anchor"], defn["to"]["anchor"]

    assert span("dawn") == ("dawn", "sunrise")
    assert span("morning") == ("sunrise", "noon")
    assert span("afternoon") == ("noon", "sunset")
    assert span("evening") == ("sunset", "dusk")
    assert span("nighttime") == ("sunset", "sunrise")
    assert span("daytime") == ("sunrise", "sunset")


def test_night_containing_periods_precede_nighttime() -> None:
    # nighttime (sunset→sunrise) now contains both the evening (sunset→dusk) and
    # dawn (dawn→sunrise) windows, so those must come first or describe() would
    # read those times as the broad "nighttime".
    ids = list(BUILTIN_PERIODS)
    assert ids.index("evening") < ids.index("nighttime")
    assert ids.index("dawn") < ids.index("nighttime")


def test_builtin_periods_have_from_to_endpoints() -> None:
    for pid, defn in BUILTIN_PERIODS.items():
        assert "from" in defn, pid
        assert "to" in defn, pid
        for ep in (defn["from"], defn["to"]):
            assert ep["kind"] in ("time", "sun"), pid


def test_effective_returns_builtins_when_no_custom_or_hidden() -> None:
    store = PeriodStore(_FakeStorage())
    effective = store.effective()
    assert set(effective) == set(BUILTIN_PERIODS)


def test_effective_excludes_hidden_builtins() -> None:
    store = PeriodStore(_FakeStorage({"custom": {}, "hidden": ["daytime"]}))
    effective = store.effective()
    assert "daytime" not in effective
    assert "morning" in effective


def test_effective_includes_custom_only_periods() -> None:
    store = PeriodStore(
        _FakeStorage(
            {
                "custom": {
                    "wind_down": {
                        "from": {"kind": "time", "hh": 20, "mm": 0},
                        "to": {"kind": "time", "hh": 22, "mm": 0},
                        "label": "Wind down",
                    }
                },
                "hidden": [],
            }
        )
    )
    assert "wind_down" in store.effective()


def test_custom_shadows_builtin_with_same_id() -> None:
    custom_afternoon = {
        "from": {"kind": "time", "hh": 13, "mm": 0},
        "to": {"kind": "time", "hh": 17, "mm": 0},
        "label": None,
    }
    store = PeriodStore(
        _FakeStorage(
            {
                "custom": {"afternoon": custom_afternoon},
                "hidden": [],
            }
        )
    )
    assert store.effective()["afternoon"] == custom_afternoon


def test_effective_iteration_order_builtins_then_custom_only() -> None:
    store = PeriodStore(
        _FakeStorage(
            {
                "custom": {
                    "wind_down": {
                        "from": {"kind": "time", "hh": 20, "mm": 0},
                        "to": {"kind": "time", "hh": 22, "mm": 0},
                        "label": None,
                    }
                },
                "hidden": [],
            }
        )
    )
    ids = list(store.effective())
    assert ids[: len(BUILTIN_PERIODS)] == list(BUILTIN_PERIODS)
    assert ids[-1] == "wind_down"


def test_validate_definition_accepts_time_endpoints() -> None:
    PeriodStore(_FakeStorage()).validate_definition(
        {
            "from": {"kind": "time", "hh": 8, "mm": 0},
            "to": {"kind": "time", "hh": 10, "mm": 30},
        }
    )  # no raise


def test_validate_definition_accepts_sun_endpoints() -> None:
    PeriodStore(_FakeStorage()).validate_definition(
        {
            "from": {"kind": "sun", "anchor": "sunrise", "offset_min": -30},
            "to": {"kind": "sun", "anchor": "sunset", "offset_min": 60},
        }
    )  # no raise


@pytest.mark.parametrize(
    "bad",
    [
        {},
        {"from": {"kind": "time", "hh": 8, "mm": 0}},  # missing to
        {"from": {"kind": "time", "hh": 25, "mm": 0}, "to": {"kind": "time", "hh": 10, "mm": 0}},
        {"from": {"kind": "time", "hh": 8, "mm": 60}, "to": {"kind": "time", "hh": 10, "mm": 0}},
        {
            "from": {"kind": "sun", "anchor": "zenith", "offset_min": 0},
            "to": {"kind": "sun", "anchor": "sunset", "offset_min": 0},
        },
        {
            "from": {"kind": "sun", "anchor": "sunset", "offset_min": "thirty"},
            "to": {"kind": "sun", "anchor": "sunrise", "offset_min": 0},
        },
        {"from": {"kind": "bogus"}, "to": {"kind": "time", "hh": 10, "mm": 0}},
        # clamp must be an object (_validate_clamp non-dict guard)
        {
            "from": {"kind": "sun", "anchor": "sunset", "offset_min": 0, "clamp": "nope"},
            "to": {"kind": "time", "hh": 10, "mm": 0},
        },
        # clamp hh out of range (_validate_clamp hh guard)
        {
            "from": {
                "kind": "sun",
                "anchor": "sunset",
                "offset_min": 0,
                "clamp": {"dir": "not_before", "hh": 99, "mm": 0},
            },
            "to": {"kind": "time", "hh": 10, "mm": 0},
        },
    ],
)
def test_validate_definition_rejects_invalid(bad: dict) -> None:
    with pytest.raises(AmbienceError):
        PeriodStore(_FakeStorage()).validate_definition(bad)


async def test_save_persists_full_payload() -> None:
    storage = _FakeStorage()
    store = PeriodStore(storage)
    payload = {
        "custom": {
            "wind_down": {
                "from": {"kind": "time", "hh": 20, "mm": 0},
                "to": {"kind": "time", "hh": 22, "mm": 0},
                "label": "Wind down",
            }
        },
        "hidden": ["daytime"],
    }
    await store.save(payload["custom"], payload["hidden"])
    assert storage.saved == [payload]


async def test_save_rejects_malformed_custom_entry() -> None:
    storage = _FakeStorage()
    store = PeriodStore(storage)
    with pytest.raises(AmbienceError):
        await store.save({"bad": {"from": {"kind": "time", "hh": 25, "mm": 0}}}, [])
    assert storage.saved == []  # nothing persisted on failure


async def test_save_rejects_invalid_period_id() -> None:
    storage = _FakeStorage()
    store = PeriodStore(storage)
    valid_def = {
        "from": {"kind": "time", "hh": 8, "mm": 0},
        "to": {"kind": "time", "hh": 10, "mm": 0},
        "label": None,
    }
    with pytest.raises(AmbienceError) as exc:
        await store.save({"Has Space": valid_def}, [])
    assert exc.value.translation_key == "named_def_invalid_id"
    with pytest.raises(AmbienceError) as exc:
        await store.save({"1starts_with_digit": valid_def}, [])
    assert exc.value.translation_key == "named_def_invalid_id"


async def test_reset_clears_custom_and_hidden() -> None:
    storage = _FakeStorage(
        {
            "custom": {
                "wind_down": {
                    "from": {"kind": "time", "hh": 20, "mm": 0},
                    "to": {"kind": "time", "hh": 22, "mm": 0},
                    "label": None,
                }
            },
            "hidden": ["daytime"],
        }
    )
    store = PeriodStore(storage)
    await store.reset()
    assert storage.saved == [{"custom": {}, "hidden": []}]


# ---------------------------------------------------------------------------
# Line 46 – _validate_endpoint: non-dict or dict missing 'kind'
# ---------------------------------------------------------------------------


def test_validate_definition_rejects_endpoint_not_a_dict() -> None:
    """_validate_endpoint raises when an endpoint is not a dict."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {"from": "08:00", "to": {"kind": "time", "hh": 10, "mm": 0}}
        )
    assert exc.value.translation_key == "period_endpoint_not_object"


def test_validate_definition_rejects_endpoint_without_kind() -> None:
    """_validate_endpoint raises when an endpoint dict has no 'kind' key."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {"from": {"hh": 8, "mm": 0}, "to": {"kind": "time", "hh": 10, "mm": 0}}
        )
    assert exc.value.translation_key == "period_endpoint_not_object"


# ---------------------------------------------------------------------------
# Line 106 – validate_definition: defn is not a dict
# ---------------------------------------------------------------------------


def test_validate_definition_rejects_non_dict() -> None:
    """validate_definition raises when defn is not a dict."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition("not-a-dict")
    assert exc.value.translation_key == "period_def_not_object"


# ---------------------------------------------------------------------------
# Lines 117 / 119 – save(): custom not a dict; hidden not a list
# ---------------------------------------------------------------------------


async def test_save_rejects_custom_not_a_dict() -> None:
    """save() raises when custom is not a dict."""
    store = PeriodStore(_FakeStorage())
    with pytest.raises(AmbienceError) as exc:
        await store.save(["not", "a", "dict"], [])  # type: ignore[arg-type]
    assert exc.value.translation_key == "named_def_custom_not_object"


async def test_save_rejects_hidden_not_a_list() -> None:
    """save() raises when hidden is not a list."""
    store = PeriodStore(_FakeStorage())
    with pytest.raises(AmbienceError) as exc:
        await store.save({}, "daytime")  # type: ignore[arg-type]
    assert exc.value.translation_key == "named_def_hidden_not_list"


# ---------------------------------------------------------------------------
# Line 126 – save(): hidden id that is not a built-in
# ---------------------------------------------------------------------------


async def test_save_rejects_hiding_non_builtin_id() -> None:
    """save() raises when hidden contains an id that is not a built-in."""
    store = PeriodStore(_FakeStorage())
    with pytest.raises(AmbienceError) as exc:
        await store.save({}, ["wind_down"])  # custom id, not a built-in
    assert exc.value.translation_key == "named_def_only_builtin_hideable"


# ---------------------------------------------------------------------------
# Clamped sun endpoints
# ---------------------------------------------------------------------------


def test_validate_definition_accepts_clamped_sun() -> None:
    PeriodStore(_FakeStorage()).validate_definition(
        {
            "from": {
                "kind": "sun",
                "anchor": "sunrise",
                "offset_min": 0,
                "clamp": {"dir": "not_before", "hh": 8, "mm": 30},
            },
            "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
        }
    )  # no raise


def test_validate_definition_rejects_bool_offset() -> None:
    # bool is an int subclass — reject it so `True` can't become a 1-min offset.
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {
                "from": {"kind": "sun", "anchor": "sunrise", "offset_min": True},
                "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
            }
        )
    assert exc.value.translation_key == "period_offset_not_int"


def test_validate_definition_rejects_bad_clamp_dir() -> None:
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {
                "from": {
                    "kind": "sun",
                    "anchor": "sunrise",
                    "offset_min": 0,
                    "clamp": {"dir": "nope", "hh": 8, "mm": 30},
                },
                "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
            }
        )
    assert exc.value.translation_key == "period_invalid_clamp_dir"
    assert exc.value.translation_placeholders["value"] == "nope"


def test_validate_definition_rejects_bad_clamp_time() -> None:
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {
                "from": {
                    "kind": "sun",
                    "anchor": "sunrise",
                    "offset_min": 0,
                    "clamp": {"dir": "not_before", "hh": 8, "mm": 99},
                },
                "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
            }
        )
    assert exc.value.translation_key == "period_invalid_clamp_mm"


def test_view_for_ui_returns_builtins_custom_hidden() -> None:
    storage = _FakeStorage(
        {
            "custom": {
                "wind_down": {
                    "from": {"kind": "time", "hh": 20, "mm": 0},
                    "to": {"kind": "time", "hh": 22, "mm": 0},
                    "label": "Wind down",
                }
            },
            "hidden": ["daytime"],
        }
    )
    store = PeriodStore(storage)
    view = store.view_for_ui()
    assert view["builtins"] == BUILTIN_PERIODS
    assert view["custom"] == storage.get_periods()["custom"]
    assert view["hidden"] == ["daytime"]


def test_validate_definition_rejects_bool_clock() -> None:
    """bool is an int subclass; `hh: true` must not validate as hour 1 (the
    trigger scheduler rejects bools, so the boundary would never fire)."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {
                "from": {"kind": "time", "hh": True, "mm": 0},
                "to": {"kind": "time", "hh": 10, "mm": 0},
            }
        )
    assert exc.value.translation_key == "period_invalid_hh"


def test_validate_definition_accepts_identical_endpoints() -> None:
    """from == to (matches all day at runtime) is left valid — rejecting it
    would block saving the periods store for an existing such definition."""
    PeriodStore(_FakeStorage()).validate_definition(
        {
            "from": {"kind": "time", "hh": 10, "mm": 0},
            "to": {"kind": "time", "hh": 10, "mm": 0},
        }
    )


# ---------------------------------------------------------------------------
# Representative AmbienceError key + placeholder assertions (A4 TDD)
# ---------------------------------------------------------------------------


def test_period_invalid_clamp_dir_key_and_placeholder() -> None:
    """period_invalid_clamp_dir carries the bad dir value as a placeholder."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {
                "from": {
                    "kind": "sun",
                    "anchor": "sunrise",
                    "offset_min": 0,
                    "clamp": {"dir": "wrong", "hh": 8, "mm": 0},
                },
                "to": {"kind": "sun", "anchor": "dusk", "offset_min": 0},
            }
        )
    assert exc.value.translation_key == "period_invalid_clamp_dir"
    assert exc.value.translation_placeholders["value"] == "wrong"


def test_period_def_missing_from_to_key() -> None:
    """period_def_missing_from_to fires when a period dict lacks 'from' or 'to'."""
    with pytest.raises(AmbienceError) as exc:
        PeriodStore(_FakeStorage()).validate_definition(
            {"from": {"kind": "time", "hh": 8, "mm": 0}}
        )
    assert exc.value.translation_key == "period_def_missing_from_to"


# ---------------------------------------------------------------------------
# save(): a non-string hidden entry
# ---------------------------------------------------------------------------


async def test_save_rejects_non_string_hidden_entry() -> None:
    """A non-string hidden entry is a validation error, not an unhashable-type crash."""
    store = PeriodStore(_FakeStorage())
    with pytest.raises(AmbienceError) as exc:
        await store.save({}, [["daytime"]])  # type: ignore[list-item]
    assert exc.value.translation_key == "named_def_hidden_not_string"
    assert exc.value.translation_placeholders["kind"] == store.kind
