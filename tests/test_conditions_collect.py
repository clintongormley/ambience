"""Shared scope-predicate collector used by script/template conditions."""

from __future__ import annotations

from custom_components.ambience.conditions._collect import collect_scope_predicates


class _StoreStub:
    """Minimal store stub exposing area/floor/house scopes for the collector."""

    def __init__(
        self,
        areas: dict[str, dict] | None = None,
        floors: dict[str, dict] | None = None,
        house: dict | None = None,
    ) -> None:
        self._areas = areas or {}
        self._floors = floors or {}
        self._house = house or {}

    def all_scope_configs(self) -> list[tuple[str, str | None, dict]]:
        return [
            *(("area", aid, cfg) for aid, cfg in self._areas.items()),
            *(("floor", fid, cfg) for fid, cfg in self._floors.items()),
            ("house", None, self._house),
        ]


def test_collects_from_areas_floors_and_house() -> None:
    store = _StoreStub(
        areas={"kitchen": {"scenes": [{"when": {"k": "area-pred"}}]}},
        floors={"f1": {"scenes": [{"when": {"k": "floor-pred"}}]}},
        house={"scenes": [{"when": {"k": "house-pred"}}]},
    )
    assert list(collect_scope_predicates(store, "k")) == [
        "area-pred",
        "floor-pred",
        "house-pred",
    ]


def test_skips_scenes_without_the_key() -> None:
    store = _StoreStub(
        areas={
            "kitchen": {
                "scenes": [
                    {"when": {"other": "x"}},
                    {"when": {"k": "wanted"}},
                    {"when": {}},
                    {},
                ]
            }
        },
    )
    assert list(collect_scope_predicates(store, "k")) == ["wanted"]


def test_skips_none_wildcard_predicates() -> None:
    store = _StoreStub(
        areas={"kitchen": {"scenes": [{"when": {"k": None}}, {"when": {"k": "real"}}]}},
    )
    assert list(collect_scope_predicates(store, "k")) == ["real"]


def test_empty_when_no_scopes() -> None:
    assert list(collect_scope_predicates(_StoreStub(), "k")) == []


def test_house_may_be_empty() -> None:
    store = _StoreStub(house=None)
    assert list(collect_scope_predicates(store, "k")) == []


def test_yields_dict_predicates_unchanged() -> None:
    pred = {"script": "script.foo", "args": {"x": 1}}
    store = _StoreStub(areas={"a": {"scenes": [{"when": {"script": pred}}]}})
    assert list(collect_scope_predicates(store, "script")) == [pred]


def test_skips_disabled_scenes() -> None:
    """A disabled scene's predicate must never reach the collector's callers —
    otherwise its `when.script` runs (side effects, timeouts) on every snapshot."""
    store = _StoreStub(
        areas={
            "kitchen": {
                "scenes": [
                    {"enabled": False, "when": {"k": "disabled-pred"}},
                    {"enabled": True, "when": {"k": "enabled-pred"}},
                    {"when": {"k": "default-pred"}},
                ]
            }
        },
    )
    assert list(collect_scope_predicates(store, "k")) == ["enabled-pred", "default-pred"]
