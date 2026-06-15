"""Tests for the config-health detector."""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar

from custom_components.ambience.config_health import (
    _build_ref_context,
    entity_exists,
    missing_lux_refs,
    missing_period_refs,
    referenced_entities_by_scene,
    scan,
    scene_annotations,
    scene_config_issues,
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
    # No missing_entity problem (the entity exists). The service may be unexposed but
    # that is a separate problem kind introduced by pass 3 and is not this test's concern.
    assert [p for p in scan(hass, [("area", "a", cfg)]) if p.kind == "missing_entity"] == []


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
    assert annos[0] == {"missing_entities": [], "overlap_entities": [], "config_issues": []}


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


async def test_scene_config_issues_flags_workday_sensor_unset(
    hass: HomeAssistant, installed
) -> None:
    # No workday_sensor configured (default). A scene using a workday item dangles.
    ctx = _build_ref_context(hass)
    scene = {
        "name": "wd",
        "category": "c1",
        "when": {"day": {"include": [{"kind": "workday"}]}},
        "actions": [],
    }
    assert scene_config_issues(ctx, scene) == [("missing_workday_sensor", "workday_sensor")]


async def test_scene_config_issues_clean_when_workday_sensor_set(
    hass: HomeAssistant, installed
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_condition_config("day", {"workday_sensor": "binary_sensor.wd"})
    ctx = _build_ref_context(hass)
    scene = {"when": {"day": {"include": [{"kind": "workday"}]}}, "actions": []}
    assert scene_config_issues(ctx, scene) == []


async def test_scene_config_issues_disabled_scene_is_clean(
    hass: HomeAssistant, installed
) -> None:
    ctx = _build_ref_context(hass)
    scene = {"enabled": False, "when": {"day": {"include": [{"kind": "workday"}]}}, "actions": []}
    assert scene_config_issues(ctx, scene) == []


async def test_scene_config_issues_ignores_non_string_weather_group(
    hass: HomeAssistant, installed
) -> None:
    ctx = _build_ref_context(hass)
    # A partial/corrupt save could leave a non-string group id; it must not produce
    # a spurious ("missing_weather_group", None) tuple.
    scene = {"when": {"weather": {"groups": [None]}}, "actions": []}
    assert ("missing_weather_group", None) not in scene_config_issues(ctx, scene)


async def test_scene_config_issues_workday_calendar(hass: HomeAssistant, installed) -> None:
    ctx = _build_ref_context(hass)
    scene = {"when": {"day": {"include": [{"kind": "first_workday"}]}}, "actions": []}
    assert scene_config_issues(ctx, scene) == [("missing_workday_calendar", "workday_calendar")]


async def test_scene_config_issues_weather_entity_and_group(
    hass: HomeAssistant, installed
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    # entity unset + a group id that isn't among the configured groups.
    await store.async_save_condition_config(
        "weather", {"entity": None, "groups": [{"id": "sunny", "label": "S", "conditions": []}]}
    )
    ctx = _build_ref_context(hass)
    scene = {"when": {"weather": {"groups": ["sunny", "ghost"]}}, "actions": []}
    assert scene_config_issues(ctx, scene) == [
        ("missing_weather_entity", "weather_entity"),
        ("missing_weather_group", "ghost"),
    ]


async def test_scene_config_issues_period_and_lux(hass: HomeAssistant, installed) -> None:
    ctx = _build_ref_context(hass)
    scene = {
        "when": {"time_of_day": {"period": "ghost"}, "lux": {"range": "gone"}},
        "actions": [],
    }
    assert ("missing_period", "ghost") in scene_config_issues(ctx, scene)
    assert ("missing_lux_range", "gone") in scene_config_issues(ctx, scene)


async def test_scene_config_issues_unexposed_action(hass: HomeAssistant, installed) -> None:
    ctx = _build_ref_context(hass)
    scene = {"when": {}, "actions": [{"service": "fan.toggle", "entity_ids": ["fan.x"]}]}
    assert scene_config_issues(ctx, scene) == [("unexposed_action", "fan.toggle")]


async def test_scan_aggregates_config_refs_globally_per_ref(
    hass: HomeAssistant, installed
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    a1 = ar.async_get(hass).async_create("Kitchen").id
    a2 = ar.async_get(hass).async_create("Hall").id
    wd_scene = {"name": "wd", "category": "c1", "when": {"day": {"include": [{"kind": "workday"}]}}, "actions": []}
    await store.async_save_area(a1, {"scenes": [wd_scene]})
    await store.async_save_area(a2, {"scenes": [wd_scene]})
    problems = scan(hass, store.all_scope_configs())
    wd = [p for p in problems if p.kind == "missing_workday_sensor"]
    assert len(wd) == 1                       # one issue, global per ref
    assert wd[0].ref == "workday_sensor"
    assert len(wd[0].locations) == 2          # both scopes listed


async def test_scene_annotations_emits_config_issues(hass: HomeAssistant, installed) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    cfg = {"scenes": [
        {"name": "wd", "category": "c1",
         "when": {"day": {"include": [{"kind": "workday"}]}}, "actions": []},
        {"name": "ok", "category": "c1", "when": {}, "actions": []},
    ]}
    await store.async_save_area(ar.async_get(hass).async_create("LR").id, cfg)
    annos = scene_annotations(hass, cfg)
    assert annos[0]["config_issues"] == [{"kind": "missing_workday_sensor", "ref": "workday_sensor"}]
    assert annos[1]["config_issues"] == []


# ---------------------------------------------------------------------------
# Branch 121->123: weather entity IS set, predicate active → no "missing_entity"
# issue, jumps straight to the group loop.
# ---------------------------------------------------------------------------


async def test_scene_config_issues_entity_set_checks_groups(
    hass: HomeAssistant, installed
) -> None:
    """With entity configured, the 'missing_weather_entity' issue is NOT emitted;
    a dangling group id IS (exercises the 121->123 branch where entity is truthy)."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_condition_config(
        "weather",
        {
            "entity": "weather.home",
            "groups": [{"id": "sunny", "label": "Sunny", "conditions": ["sunny"]}],
        },
    )
    ctx = _build_ref_context(hass)
    scene = {"when": {"weather": {"groups": ["ghost"]}}, "actions": []}
    issues = scene_config_issues(ctx, scene)
    kinds = {k for k, _ in issues}
    assert "missing_weather_entity" not in kinds
    assert ("missing_weather_group", "ghost") in issues


# ---------------------------------------------------------------------------
# Branch 141->140: dedup in scene_config_issues — same issue emitted twice from
# different slots must collapse to one entry.
# ---------------------------------------------------------------------------


async def test_scene_config_issues_deduplicates_same_issue(
    hass: HomeAssistant, installed
) -> None:
    """Two day-slots of the same kind both missing the workday sensor → one entry."""
    ctx = _build_ref_context(hass)
    scene = {
        "name": "wd",
        "category": "c1",
        "when": {
            "day": {
                "include": [{"kind": "workday"}, {"kind": "workday"}]
            }
        },
        "actions": [],
    }
    issues = scene_config_issues(ctx, scene)
    assert issues.count(("missing_workday_sensor", "workday_sensor")) == 1


# ---------------------------------------------------------------------------
# Branch 230->exit: dedup in note_missing — same Location not added twice.
# Two separate scope-configs whose matching scenes share (scope_kind, scope_id,
# category, name) produce the same Location; the second call must be a no-op.
# ---------------------------------------------------------------------------


async def test_scan_note_missing_deduplicates_identical_locations(
    hass: HomeAssistant, installed
) -> None:
    """Passing the same config twice → note_missing hits loc-in-bucket path (230->exit)."""
    # Two configs for the SAME scope (same scope_kind/scope_id) that share the
    # same scene name/category — both reference the missing entity so note_missing
    # is called twice with identical Location objects.
    cfg = _cfg(
        [
            {
                "name": "s",
                "category": "c1",
                "when": {},
                "actions": [{"service": "light.turn_on", "entity_ids": ["light.ghost"]}],
            }
        ]
    )
    # Pass the same config twice with the same scope triple → identical Location
    # entries for light.ghost; second call exercises the 230->exit branch.
    problems = scan(hass, [("area", "a", cfg), ("area", "a", cfg)])
    missing = [p for p in problems if p.kind == "missing_entity" and p.ref == "light.ghost"]
    assert len(missing) == 1
    # Only one unique location (duplicates collapsed).
    assert len(missing[0].locations) == 1


# ---------------------------------------------------------------------------
# Branch 278->275: dedup in config_refs — same (kind, ref) location not added twice.
# ---------------------------------------------------------------------------


async def test_scan_config_refs_dedup_identical_locations(
    hass: HomeAssistant, installed
) -> None:
    """Passing the same config twice → config_refs hits loc-in-bucket (278->275)."""
    cfg = _cfg(
        [
            {
                "name": "wd",
                "category": "c1",
                "when": {"day": {"include": [{"kind": "workday"}]}},
                "actions": [],
            }
        ]
    )
    # Same scope triple repeated → identical Location; second call exercises 278->275.
    problems = scan(hass, [("area", "a", cfg), ("area", "a", cfg)])
    wd = [p for p in problems if p.kind == "missing_workday_sensor"]
    assert len(wd) == 1
    # Location deduped: only one entry despite two identical configs.
    assert len(wd[0].locations) == 1


# ---------------------------------------------------------------------------
# Branch 134->132: action service IS exposed or empty/non-string — loop continues.
# ---------------------------------------------------------------------------


async def test_scene_config_issues_exposed_service_not_flagged(
    hass: HomeAssistant, installed
) -> None:
    """An action whose service IS in exposed_services must not produce an issue
    (exercises the 134->132 branch where the condition is False and we loop back)."""
    store = hass.data[DOMAIN][DATA_STORE]
    # Register one exposed service so it IS in ctx.exposed_services.
    await store.async_save_exposed_actions([
        {"id": "light.turn_on", "visible_fields": [], "defaults": {}},
    ])
    ctx = _build_ref_context(hass)
    scene = {
        "when": {},
        "actions": [
            {"service": "light.turn_on", "entity_ids": []},   # exposed → no issue
            {"service": "fan.toggle", "entity_ids": []},       # unexposed → issue
        ],
    }
    issues = scene_config_issues(ctx, scene)
    assert ("unexposed_action", "fan.toggle") in issues
    assert ("unexposed_action", "light.turn_on") not in issues


# ---------------------------------------------------------------------------
# Branch 156->160: missing_period_refs with a dict that has no "period" key.
# ---------------------------------------------------------------------------


def test_missing_period_refs_dict_without_period_key_returns_empty() -> None:
    """A dict predicate without a 'period' key (e.g. inline range) → [] (156->160)."""
    # An inline {from/to} dict: not None, not a list, is a dict but has no "period"
    result = missing_period_refs({"from": {"kind": "time", "hh": 8, "mm": 0}, "to": {"kind": "time", "hh": 12, "mm": 0}}, {"morning"})
    assert result == []


def test_missing_period_refs_non_dict_non_list_non_none_returns_empty() -> None:
    """A non-dict, non-list, non-None predicate (e.g. a string) → [] (156->160)."""
    assert missing_period_refs("garbage", {"morning"}) == []
    assert missing_period_refs(42, {"morning"}) == []
