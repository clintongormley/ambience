"""Tests for the config-health detector."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar

from custom_components.ambience.config_health import (
    entity_exists,
    missing_lux_refs,
    missing_period_refs,
    referenced_entities_by_scene,
    scan,
    scene_annotations,
)
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_OVERLAP_SET,
    DATA_STORE,
    DOMAIN,
)


def _cfg(scenes: list[dict[str, Any]]) -> dict[str, Any]:
    return {"scenes": scenes}


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry) -> Any:
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_entity_exists_true_for_state(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.real", "on")
    assert entity_exists(hass, "light.real") is True


async def test_entity_exists_false_for_unknown(hass: HomeAssistant, installed) -> None:
    assert entity_exists(hass, "light.nope") is False


async def test_unavailable_entity_still_exists(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("binary_sensor.offline", "unavailable")
    assert entity_exists(hass, "binary_sensor.offline") is True


async def test_scan_flags_missing_action_entity(hass: HomeAssistant, installed) -> None:
    cfg = _cfg(
        [
            {
                "name": "go",
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            }
        ]
    )
    problems = scan(hass, [("area", "a", cfg)])
    p = next(p for p in problems if p.kind == "missing_entity")
    assert p.ref == "light.ghost"
    assert p.locations[0].scope_kind == "area"
    assert p.locations[0].scene_name == "go"


async def test_scan_flags_missing_condition_entity(hass: HomeAssistant, installed) -> None:
    cfg = _cfg(
        [
            {
                "name": "watch",
                "when": {"occupancy": {"sensors": ["binary_sensor.ghost"]}},
                "category": "c1",
                "actions": [],
            }
        ]
    )
    problems = scan(hass, [("area", "a", cfg)])
    kinds = {(p.kind, p.ref) for p in problems}
    assert ("missing_entity", "binary_sensor.ghost") in kinds


async def test_scan_does_not_flag_existing_entity(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.real", "on")
    cfg = _cfg(
        [
            {
                "name": "go",
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.real"]}],
            }
        ]
    )
    assert scan(hass, [("area", "a", cfg)]) == []


async def test_scan_skips_disabled_scene(hass: HomeAssistant, installed) -> None:
    cfg = _cfg(
        [
            {
                "name": "off",
                "enabled": False,
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            }
        ]
    )
    assert scan(hass, [("area", "a", cfg)]) == []


async def test_scan_flags_cross_category_overlap(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.shared", "on")
    cfg = _cfg(
        [
            {
                "name": "a",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
            },
            {
                "name": "b",
                "when": {},
                "category": "cat2",
                "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
            },
        ]
    )
    problems = scan(hass, [("area", "a", cfg)])
    overlap = [p for p in problems if p.kind == "action_overlap"]
    assert len(overlap) == 1
    assert overlap[0].ref == "light.shared"
    assert {loc.category_id for loc in overlap[0].locations} == {"cat1", "cat2"}


async def test_scan_no_overlap_within_one_category(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.shared", "on")
    cfg = _cfg(
        [
            {
                "name": "a",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
            },
            {
                "name": "b",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
            },
        ]
    )
    assert [p for p in scan(hass, [("area", "a", cfg)]) if p.kind == "action_overlap"] == []


async def test_scan_no_overlap_for_nonexistent_entity(hass: HomeAssistant, installed) -> None:
    # A missing entity acted on by two groups: only the missing_entity problem is
    # reported, never an action_overlap (overlap on a non-existent entity is moot).
    cfg = _cfg(
        [
            {
                "name": "a",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            },
            {
                "name": "b",
                "when": {},
                "category": "cat2",
                "actions": [{"service": "light.turn_off", "entity_ids": ["light.ghost"]}],
            },
        ]
    )
    problems = scan(hass, [("area", "a", cfg)])
    assert [p for p in problems if p.kind == "action_overlap"] == []
    assert any(p.kind == "missing_entity" and p.ref == "light.ghost" for p in problems)


async def test_scan_dedups_same_scene_refs_and_skips_malformed(hass, installed) -> None:
    # The same missing entity referenced by BOTH a condition and an action in one
    # scene collapses to a single location; malformed entity_ids are ignored.
    cfg = _cfg(
        [
            {
                "name": "s",
                "category": "c1",
                "when": {"occupancy": {"sensors": ["binary_sensor.ghost"]}},
                "actions": [
                    {"service": "light.turn_on", "entity_ids": ["binary_sensor.ghost", "", 123]}
                ],
            }
        ]
    )
    missing = [p for p in scan(hass, [("area", "a", cfg)]) if p.kind == "missing_entity"]
    # "" and 123 are skipped; only the real id is a problem.
    assert {p.ref for p in missing} == {"binary_sensor.ghost"}
    # Condition + action references in the same scene dedup to one location.
    ghost = next(p for p in missing if p.ref == "binary_sensor.ghost")
    assert len(ghost.locations) == 1


async def test_scan_empty_inputs(hass: HomeAssistant, installed) -> None:
    assert scan(hass, []) == []
    assert scan(hass, [("area", "a", {})]) == []  # no "scenes" key


async def test_entity_exists_true_for_registry_only(hass: HomeAssistant, installed) -> None:
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(hass)
    entry = registry.async_get_or_create("light", "demo", "abc123")
    # Registered but no state set → entity_exists must still be True.
    assert hass.states.get(entry.entity_id) is None
    assert entity_exists(hass, entry.entity_id) is True


async def test_scan_aggregates_one_entity_across_scenes(hass: HomeAssistant, installed) -> None:
    cfg = _cfg(
        [
            {
                "name": "s1",
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            },
            {
                "name": "s2",
                "when": {"occupancy": {"sensors": ["light.ghost"]}},
                "category": "c1",
                "actions": [],
            },
        ]
    )
    problems = scan(hass, [("area", "a", cfg)])
    missing = [p for p in problems if p.kind == "missing_entity" and p.ref == "light.ghost"]
    assert len(missing) == 1  # aggregated into ONE Problem
    scene_names = {loc.scene_name for loc in missing[0].locations}
    assert scene_names == {"s1", "s2"}  # both referencing scenes recorded


async def test_scan_flags_cross_scope_overlap(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.shared", "on")
    area_cfg = _cfg(
        [
            {
                "name": "a",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
            }
        ]
    )
    house_cfg = _cfg(
        [
            {
                "name": "h",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
            }
        ]
    )
    problems = scan(hass, [("area", "a", area_cfg), ("house", None, house_cfg)])
    overlap = [p for p in problems if p.kind == "action_overlap"]
    assert len(overlap) == 1
    assert {(loc.scope_kind, loc.scope_id) for loc in overlap[0].locations} == {
        ("area", "a"),
        ("house", None),
    }


async def test_referenced_entities_by_scene_collects_monitored_and_acted(
    hass: HomeAssistant, installed
) -> None:
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    cfg = _cfg(
        [
            {
                "name": "watch+act",
                "when": {"occupancy": {"sensors": ["binary_sensor.mon"]}},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.act"]}],
            }
        ]
    )
    refs = referenced_entities_by_scene(conditions, cfg)
    assert refs[0] == {"binary_sensor.mon", "light.act"}


async def test_referenced_entities_by_scene_skips_disabled(hass: HomeAssistant, installed) -> None:
    conditions = hass.data[DOMAIN][DATA_CONDITIONS]
    cfg = _cfg(
        [
            {
                "name": "off",
                "enabled": False,
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.act"]}],
            }
        ]
    )
    assert referenced_entities_by_scene(conditions, cfg) == {}


async def test_scene_annotations_flags_missing(hass: HomeAssistant, installed) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = {
        "scenes": [
            {
                "name": "go",
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            }
        ]
    }
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, cfg)
    annos = scene_annotations(hass, cfg)
    assert annos[0]["missing_entities"] == ["light.ghost"]
    assert annos[0]["overlap_entities"] == []


async def test_scene_annotations_flags_overlap(hass: HomeAssistant, installed) -> None:
    hass.states.async_set("light.shared", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = {
        "scenes": [
            {
                "name": "a",
                "when": {},
                "category": "cat1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
            },
            {
                "name": "b",
                "when": {},
                "category": "cat2",
                "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
            },
        ]
    }
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, cfg)
    annos = scene_annotations(hass, cfg)
    assert annos[0]["overlap_entities"] == ["light.shared"]
    assert annos[1]["overlap_entities"] == ["light.shared"]
    assert annos[0]["missing_entities"] == []


async def test_scene_annotations_disabled_scene_has_no_annotations(
    hass: HomeAssistant, installed
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = {
        "scenes": [
            {
                "name": "off",
                "enabled": False,
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            }
        ]
    }
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, cfg)
    annos = scene_annotations(hass, cfg)
    assert annos[0] == {"missing_entities": [], "overlap_entities": []}


_OVERLAP_CFG = {
    "scenes": [
        {
            "name": "a",
            "when": {},
            "category": "cat1",
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.shared"]}],
        },
        {
            "name": "b",
            "when": {},
            "category": "cat2",
            "actions": [{"service": "light.turn_off", "entity_ids": ["light.shared"]}],
        },
    ]
}


async def test_scene_annotations_reads_cached_overlap_set(hass: HomeAssistant, installed) -> None:
    # A cache that flags an entity the live config would NOT (a single group): proves
    # scene_annotations reads the cache rather than running a fresh scan.
    hass.states.async_set("light.cached", "on")
    hass.data[DOMAIN][DATA_OVERLAP_SET] = frozenset({"light.cached"})
    cfg = {
        "scenes": [
            {
                "name": "a",
                "when": {},
                "category": "c1",
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.cached"]}],
            }
        ]
    }
    annos = scene_annotations(hass, cfg)
    assert annos[0]["overlap_entities"] == ["light.cached"]


async def test_scene_annotations_cold_cache_computes_and_populates(
    hass: HomeAssistant, installed
) -> None:
    hass.states.async_set("light.shared", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, _OVERLAP_CFG)
    hass.data[DOMAIN].pop(DATA_OVERLAP_SET, None)  # force a cold cache
    annos = scene_annotations(hass, _OVERLAP_CFG)
    assert annos[0]["overlap_entities"] == ["light.shared"]
    # The compute path also populates the cache for subsequent gets.
    assert hass.data[DOMAIN][DATA_OVERLAP_SET] == frozenset({"light.shared"})


async def test_scene_annotations_fresh_overlap_ignores_stale_cache(
    hass: HomeAssistant, installed
) -> None:
    hass.states.async_set("light.shared", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, _OVERLAP_CFG)
    hass.data[DOMAIN][DATA_OVERLAP_SET] = frozenset({"light.stale"})  # poison the cache
    annos = scene_annotations(hass, _OVERLAP_CFG, fresh_overlap=True)
    assert annos[0]["overlap_entities"] == ["light.shared"]
    assert hass.data[DOMAIN][DATA_OVERLAP_SET] == frozenset({"light.shared"})


def test_missing_period_refs_flags_unknown_id() -> None:
    assert missing_period_refs({"period": "gone"}, {"morning"}) == ["gone"]
    assert missing_period_refs({"period": "morning"}, {"morning"}) == []
    assert missing_period_refs(None, {"morning"}) == []
    assert missing_period_refs([{"period": "gone"}, {"period": "morning"}], {"morning"}) == ["gone"]


def test_missing_lux_refs_flags_unknown_id() -> None:
    assert missing_lux_refs({"range": "gone"}, {"dim"}) == ["gone"]
    assert missing_lux_refs({"range": "dim"}, {"dim"}) == []
    assert missing_lux_refs({"min": 0, "max": 5}, {"dim"}) == []
