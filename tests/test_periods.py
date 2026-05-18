"""Tests for the named-period store."""

from __future__ import annotations

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
    assert set(BUILTIN_PERIODS) == {"morning", "afternoon", "evening", "night", "day"}


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
    store = PeriodStore(_FakeStorage({"custom": {}, "hidden": ["day"]}))
    effective = store.effective()
    assert "day" not in effective
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
