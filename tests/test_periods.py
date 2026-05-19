"""Tests for the named-period store."""

from __future__ import annotations

import pytest

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
    assert set(BUILTIN_PERIODS) == {"morning", "afternoon", "evening", "nighttime", "daytime"}


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
    ],
)
def test_validate_definition_rejects_invalid(bad: dict) -> None:
    with pytest.raises(ValueError):
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
    with pytest.raises(ValueError):
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
    with pytest.raises(ValueError, match="invalid period id"):
        await store.save({"Has Space": valid_def}, [])
    with pytest.raises(ValueError, match="invalid period id"):
        await store.save({"1starts_with_digit": valid_def}, [])


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
