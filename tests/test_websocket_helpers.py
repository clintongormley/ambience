"""Tests for websocket_helpers.py — characterization tests for pure helper functions.

All functions tested here are pure (no I/O, no HA side-effects) so we test
them directly, constructing lightweight stubs for hass / store only where the
helpers read from hass.data.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DOMAIN,
    GENERAL_CATEGORY_ID,
)
from custom_components.ambience.websocket_helpers import (
    canonicalise,
    coerce_rule_categories,
    dangling_day_entity_warnings,
    dangling_weather_warnings,
    missing_period_refs,
    validate_scope_config,
    validate_weather_groups,
    weather_predicate_active,
    with_shadows,
)

# ---------------------------------------------------------------------------
# Minimal stubs
# ---------------------------------------------------------------------------


def _make_hass(
    conditions: dict | None = None,
    exposed_actions: dict | None = None,
    store=None,
) -> Any:
    """Return a minimal hass stub with the DOMAIN sub-dict populated."""
    hass = MagicMock()
    hass.data = {
        DOMAIN: {
            DATA_CONDITIONS: conditions if conditions is not None else {},
            DATA_EXPOSED_ACTIONS: exposed_actions if exposed_actions is not None else {},
            DATA_STORE: store,
        }
    }
    return hass


def _make_exposed(service_ids: list[str]) -> dict:
    """Stub exposed_actions store: get(id) returns a sentinel or None."""
    sentinel = object()
    return dict.fromkeys(service_ids, sentinel)


# ---------------------------------------------------------------------------
# validate_scope_config
# ---------------------------------------------------------------------------


class TestValidateScopeConfig:
    def test_rejects_non_dict_config(self) -> None:
        hass = _make_hass()
        with pytest.raises(ValueError, match="config must be an object"):
            validate_scope_config(hass, "not a dict")  # type: ignore[arg-type]

    def test_rejects_unknown_condition_key(self) -> None:
        hass = _make_hass(conditions={})  # empty registry → all keys unknown
        config = {"rules": [{"when": {"nonexistent_condition": {"some": "value"}}, "actions": []}]}
        with pytest.raises(ValueError, match="unknown condition nonexistent_condition"):
            validate_scope_config(hass, config)

    def test_allows_none_predicate_without_validation(self) -> None:
        """A None predicate is treated as 'no constraint' and skipped entirely —
        the condition need not be in the registry."""
        hass = _make_hass(conditions={})  # empty registry
        config = {"rules": [{"when": {"some_condition": None}, "actions": []}]}
        # Should NOT raise even though 'some_condition' is not registered.
        validate_scope_config(hass, config)

    def test_accepts_empty_rules(self) -> None:
        hass = _make_hass()
        validate_scope_config(hass, {"rules": []})  # no error

    def test_rejects_malformed_service_missing_dot(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [{"service": "no_dot", "entity_ids": [], "params": {}}],
                }
            ]
        }
        with pytest.raises(ValueError, match="missing or malformed"):
            validate_scope_config(hass, config)

    def test_rejects_service_not_exposed(self) -> None:
        hass = _make_hass(exposed_actions={})  # nothing exposed
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [{"service": "light.turn_on", "entity_ids": [], "params": {}}],
                }
            ]
        }
        with pytest.raises(ValueError, match="not exposed"):
            validate_scope_config(hass, config)

    def test_rejects_non_list_entity_ids(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": "light.a",  # should be a list
                            "params": {},
                        }
                    ],
                }
            ]
        }
        with pytest.raises(ValueError, match="entity_ids must be a list"):
            validate_scope_config(hass, config)

    def test_rejects_non_string_entity_id_element(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": [123],
                            "params": {},
                        }
                    ],
                }
            ]
        }
        with pytest.raises(ValueError, match="entity_ids must be non-empty strings"):
            validate_scope_config(hass, config)

    def test_rejects_non_dict_params(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": [],
                            "params": ["bad"],
                        }
                    ],
                }
            ]
        }
        with pytest.raises(ValueError, match="params must be an object"):
            validate_scope_config(hass, config)

    def test_accepts_valid_action(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.a"],
                            "params": {"brightness_pct": 50},
                        }
                    ],
                }
            ]
        }
        validate_scope_config(hass, config)  # no error

    def test_calls_validate_predicate_for_known_condition(self) -> None:
        # Line 49: condition is registered, validate_predicate is called on the predicate.
        mock_condition = MagicMock()
        mock_condition.validate_predicate.side_effect = ValueError("bad predicate")
        hass = _make_hass(conditions={"time_of_day": mock_condition})
        config = {"rules": [{"when": {"time_of_day": {"period": "garbage"}}, "actions": []}]}
        with pytest.raises(ValueError, match="bad predicate"):
            validate_scope_config(hass, config)
        mock_condition.validate_predicate.assert_called_once_with({"period": "garbage"})

    def test_validates_reapply_seconds_when_present(self) -> None:
        # Line 79: reapply_seconds in action_spec triggers validate_reapply_seconds.
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": [],
                            "params": {},
                            "reapply_seconds": 5,  # invalid: not 0 and < 10
                        }
                    ],
                }
            ]
        }
        with pytest.raises(ValueError, match="reapply_seconds"):
            validate_scope_config(hass, config)

    def test_accepts_zero_reapply_seconds(self) -> None:
        # 0 is the only non-minimum valid value for reapply_seconds.
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "rules": [
                {
                    "when": {},
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": [],
                            "params": {},
                            "reapply_seconds": 0,
                        }
                    ],
                }
            ]
        }
        validate_scope_config(hass, config)  # no error


# ---------------------------------------------------------------------------
# missing_period_refs
# ---------------------------------------------------------------------------


class TestMissingPeriodRefs:
    def test_none_predicate_returns_empty(self) -> None:
        # Line 128: early-return for None predicate
        result = missing_period_refs(None, {"morning", "evening"})
        assert result == []

    def test_list_predicate_recurses_and_aggregates(self) -> None:
        # Lines 130-133: list branch
        predicate = [
            {"period": "morning"},
            {"period": "ghost"},
        ]
        result = missing_period_refs(predicate, {"morning"})
        assert result == ["ghost"]

    def test_list_predicate_all_present_returns_empty(self) -> None:
        predicate = [{"period": "morning"}, {"period": "evening"}]
        result = missing_period_refs(predicate, {"morning", "evening"})
        assert result == []

    def test_dict_with_period_missing_returns_id(self) -> None:
        predicate = {"period": "nonexistent"}
        result = missing_period_refs(predicate, {"morning"})
        assert result == ["nonexistent"]

    def test_dict_with_period_present_returns_empty(self) -> None:
        predicate = {"period": "morning"}
        result = missing_period_refs(predicate, {"morning"})
        assert result == []

    def test_dict_without_period_key_returns_empty(self) -> None:
        # Line 138: fallthrough for dict with no 'period' key
        predicate = {"some_other_key": "value"}
        result = missing_period_refs(predicate, {"morning"})
        assert result == []

    def test_non_string_period_value_not_reported(self) -> None:
        # period value must be a str — non-string ids are ignored
        predicate = {"period": 42}
        result = missing_period_refs(predicate, {"morning"})
        assert result == []

    def test_scalar_non_dict_non_list_returns_empty(self) -> None:
        # Line 138: arbitrary non-list, non-dict value → empty
        result = missing_period_refs("some string", {"morning"})
        assert result == []

    def test_nested_list_recurses_fully(self) -> None:
        predicate = [
            [{"period": "missing1"}, {"period": "morning"}],
            {"period": "missing2"},
        ]
        result = missing_period_refs(predicate, {"morning"})
        assert "missing1" in result
        assert "missing2" in result
        assert "morning" not in result


# ---------------------------------------------------------------------------
# dangling_day_entity_warnings
# ---------------------------------------------------------------------------


def _make_store_with_rules(rules_per_scope: list[tuple[str, str | None, dict]]) -> Any:
    """Return a store stub whose all_scope_configs() yields the given triples."""
    store = MagicMock()
    store.all_scope_configs.return_value = rules_per_scope
    return store


class TestDanglingDayEntityWarnings:
    def test_no_rules_returns_empty(self) -> None:
        store = _make_store_with_rules([])
        hass = _make_hass(store=store)
        result = dangling_day_entity_warnings(hass, {"workday_sensor": None})
        assert result == []

    def test_rule_with_non_dict_day_pred_is_skipped(self) -> None:
        # Line 150: non-dict day predicate → continue
        store = _make_store_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "test",
                                "when": {"day": "not_a_dict"},
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": None, "workday_calendar": None}
        result = dangling_day_entity_warnings(hass, cfg)
        assert result == []

    def test_workday_kind_without_sensor_emits_warning(self) -> None:
        # Lines 153→162: workday kind, sensor unset
        store = _make_store_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "Pay day",
                                "when": {
                                    "day": {
                                        "include": [{"kind": "workday"}],
                                        "exclude": [],
                                    }
                                },
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": None, "workday_calendar": None}
        result = dangling_day_entity_warnings(hass, cfg)
        assert len(result) == 1
        w = result[0]
        assert w["scope_kind"] == "area"
        assert w["scope_id"] == "area_1"
        assert w["rule_name"] == "Pay day"
        assert "workday_sensor" in w["reason"]

    def test_holiday_kind_without_sensor_emits_warning(self) -> None:
        # holiday is also in _SENSOR_DEPENDENT_KINDS
        store = _make_store_with_rules(
            [
                (
                    "area",
                    "area_2",
                    {
                        "rules": [
                            {
                                "name": "Holiday rule",
                                "when": {
                                    "day": {
                                        "include": [{"kind": "holiday"}],
                                        "exclude": [],
                                    }
                                },
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": None, "workday_calendar": "calendar.work"}
        result = dangling_day_entity_warnings(hass, cfg)
        assert any("workday_sensor" in w["reason"] for w in result)

    def test_first_workday_kind_without_calendar_emits_warning(self) -> None:
        # Line 163: calendar-dependent kind, calendar_ok = False
        store = _make_store_with_rules(
            [
                (
                    "floor",
                    "floor_1",
                    {
                        "rules": [
                            {
                                "name": "First workday",
                                "when": {
                                    "day": {
                                        "include": [{"kind": "first_workday"}],
                                        "exclude": [],
                                    }
                                },
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": "binary_sensor.workday", "workday_calendar": None}
        result = dangling_day_entity_warnings(hass, cfg)
        assert len(result) == 1
        w = result[0]
        assert w["scope_kind"] == "floor"
        assert "workday_calendar" in w["reason"]

    def test_last_workday_kind_without_calendar_emits_warning(self) -> None:
        # last_workday is in _CALENDAR_DEPENDENT_KINDS
        store = _make_store_with_rules(
            [
                (
                    "area",
                    "area_3",
                    {
                        "rules": [
                            {
                                "name": "Month end",
                                "when": {
                                    "day": {
                                        "include": [],
                                        "exclude": [{"kind": "last_workday"}],
                                    }
                                },
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": None, "workday_calendar": None}
        result = dangling_day_entity_warnings(hass, cfg)
        assert any("workday_calendar" in w["reason"] for w in result)

    def test_no_warning_when_sensor_is_set(self) -> None:
        store = _make_store_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "Workday rule",
                                "when": {
                                    "day": {
                                        "include": [{"kind": "workday"}],
                                        "exclude": [],
                                    }
                                },
                            }
                        ]
                    },
                )
            ]
        )
        hass = _make_hass(store=store)
        cfg = {"workday_sensor": "binary_sensor.workday", "workday_calendar": None}
        result = dangling_day_entity_warnings(hass, cfg)
        assert result == []


# ---------------------------------------------------------------------------
# validate_weather_groups
# ---------------------------------------------------------------------------


class TestValidateWeatherGroups:
    def test_none_returns_empty_list(self) -> None:
        # Line 176: groups=None
        assert validate_weather_groups(None) == []

    def test_non_list_raises(self) -> None:
        # Line 178: groups not a list
        with pytest.raises(ValueError, match="groups must be a list"):
            validate_weather_groups({"id": "wet"})

    def test_non_dict_element_raises(self) -> None:
        # Line 184: element not a dict
        with pytest.raises(ValueError, match="each group must be an object"):
            validate_weather_groups(["not_a_dict"])

    def test_missing_id_raises(self) -> None:
        # Line 189: id missing
        with pytest.raises(ValueError, match="group id must be a non-empty string"):
            validate_weather_groups([{"label": "Wet", "conditions": ["rainy"]}])

    def test_empty_string_id_raises(self) -> None:
        # Line 189: id is empty string
        with pytest.raises(ValueError, match="group id must be a non-empty string"):
            validate_weather_groups([{"id": "", "label": "Wet", "conditions": ["rainy"]}])

    def test_duplicate_id_raises(self) -> None:
        groups = [
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
            {"id": "wet", "label": "Wet again", "conditions": ["pouring"]},
        ]
        with pytest.raises(ValueError, match="duplicate group id"):
            validate_weather_groups(groups)

    def test_missing_label_raises(self) -> None:
        with pytest.raises(ValueError, match="label must be a non-empty string"):
            validate_weather_groups([{"id": "wet", "conditions": ["rainy"]}])

    def test_empty_label_raises(self) -> None:
        with pytest.raises(ValueError, match="label must be a non-empty string"):
            validate_weather_groups([{"id": "wet", "label": "", "conditions": ["rainy"]}])

    def test_invalid_condition_raises(self) -> None:
        # Line 194: condition not in WEATHER_CONDITIONS
        with pytest.raises(ValueError, match="invalid condition"):
            validate_weather_groups(
                [{"id": "wet", "label": "Wet", "conditions": ["not-a-real-condition"]}]
            )

    def test_non_list_conditions_raises(self) -> None:
        # conditions key not a list at all
        with pytest.raises(ValueError, match="invalid condition"):
            validate_weather_groups([{"id": "wet", "label": "Wet", "conditions": "rainy"}])

    def test_valid_groups_returns_cleaned_list(self) -> None:
        groups = [
            {"id": "wet", "label": "Wet", "conditions": ["rainy", "pouring"]},
            {"id": "sunny", "label": "Sunny", "conditions": ["sunny"]},
        ]
        result = validate_weather_groups(groups)
        assert len(result) == 2
        assert result[0] == {"id": "wet", "label": "Wet", "conditions": ["rainy", "pouring"]}
        assert result[1]["id"] == "sunny"

    def test_empty_list_returns_empty(self) -> None:
        assert validate_weather_groups([]) == []


# ---------------------------------------------------------------------------
# weather_predicate_active
# ---------------------------------------------------------------------------


class TestWeatherPredicateActive:
    def test_none_is_inactive(self) -> None:
        assert weather_predicate_active(None) is False

    def test_empty_dict_is_inactive(self) -> None:
        assert weather_predicate_active({}) is False

    def test_dict_with_empty_groups_and_no_thresholds_is_inactive(self) -> None:
        assert weather_predicate_active({"groups": [], "thresholds": []}) is False

    def test_dict_with_non_empty_groups_is_active(self) -> None:
        assert weather_predicate_active({"groups": ["wet"]}) is True

    def test_dict_with_thresholds_is_active(self) -> None:
        assert weather_predicate_active({"thresholds": [{"attr": "temperature"}]}) is True

    def test_string_is_inactive(self) -> None:
        assert weather_predicate_active("sunny") is False


# ---------------------------------------------------------------------------
# dangling_weather_warnings
# ---------------------------------------------------------------------------


class TestDanglingWeatherWarnings:
    def _make_hass_with_rules(self, rules_per_scope: list[tuple[str, str | None, dict]]) -> Any:
        store = _make_store_with_rules(rules_per_scope)
        return _make_hass(store=store)

    def test_no_scopes_returns_empty(self) -> None:
        hass = self._make_hass_with_rules([])
        result = dangling_weather_warnings(hass, {"groups": []}, {"groups": [], "entity": None})
        assert result == []

    def test_entity_cleared_emits_warning_for_active_weather_rule(self) -> None:
        # Line 223: entity_cleared branch
        hass = self._make_hass_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "Rainy",
                                "when": {"weather": {"groups": ["wet"], "thresholds": []}},
                            }
                        ]
                    },
                )
            ]
        )
        old_cfg = {"entity": "weather.home", "groups": [{"id": "wet"}]}
        new_cfg = {"entity": None, "groups": [{"id": "wet"}]}  # entity cleared
        result = dangling_weather_warnings(hass, old_cfg, new_cfg)
        assert len(result) == 1
        w = result[0]
        assert w["scope_kind"] == "area"
        assert w["scope_id"] == "area_1"
        assert w["rule_name"] == "Rainy"
        assert "weather entity is unset" in w["reason"]

    def test_removed_group_emits_warning(self) -> None:
        hass = self._make_hass_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "Wet rule",
                                "when": {"weather": {"groups": ["wet"], "thresholds": []}},
                            }
                        ]
                    },
                )
            ]
        )
        old_cfg = {
            "entity": "weather.home",
            "groups": [{"id": "wet"}, {"id": "sunny"}],
        }
        new_cfg = {
            "entity": "weather.home",
            "groups": [{"id": "sunny"}],  # "wet" removed
        }
        result = dangling_weather_warnings(hass, old_cfg, new_cfg)
        assert len(result) == 1
        w = result[0]
        assert "wet" in w["reason"]

    def test_no_warning_when_nothing_changed(self) -> None:
        hass = self._make_hass_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "Wet rule",
                                "when": {"weather": {"groups": ["wet"], "thresholds": []}},
                            }
                        ]
                    },
                )
            ]
        )
        cfg = {
            "entity": "weather.home",
            "groups": [{"id": "wet"}],
        }
        result = dangling_weather_warnings(hass, cfg, cfg)
        assert result == []

    def test_inactive_weather_predicate_is_not_warned(self) -> None:
        # weather predicate present but inactive (empty groups + empty thresholds)
        hass = self._make_hass_with_rules(
            [
                (
                    "area",
                    "area_1",
                    {
                        "rules": [
                            {
                                "name": "No weather",
                                "when": {"weather": {"groups": [], "thresholds": []}},
                            }
                        ]
                    },
                )
            ]
        )
        old_cfg = {"entity": "weather.home", "groups": [{"id": "wet"}]}
        new_cfg = {"entity": None, "groups": []}
        result = dangling_weather_warnings(hass, old_cfg, new_cfg)
        assert result == []


# ---------------------------------------------------------------------------
# coerce_rule_categories
# ---------------------------------------------------------------------------


class TestCoerceRuleCategories:
    def _make_store(self, category_ids: list[str]) -> Any:
        store = MagicMock()
        store.categories.return_value = [{"id": cid} for cid in category_ids]
        return store

    def test_unknown_category_is_coerced_to_general(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID, "lighting"])
        config = {"rules": [{"name": "rule", "category": "nonexistent"}]}
        coerce_rule_categories(store, config)
        assert config["rules"][0]["category"] == GENERAL_CATEGORY_ID

    def test_missing_category_key_is_coerced_to_general(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID])
        config = {"rules": [{"name": "no cat rule"}]}
        coerce_rule_categories(store, config)
        assert config["rules"][0]["category"] == GENERAL_CATEGORY_ID

    def test_known_category_is_not_changed(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID, "lighting"])
        config = {"rules": [{"name": "light rule", "category": "lighting"}]}
        coerce_rule_categories(store, config)
        assert config["rules"][0]["category"] == "lighting"

    def test_empty_rules_is_a_no_op(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID])
        config = {"rules": []}
        coerce_rule_categories(store, config)  # should not raise
        assert config["rules"] == []

    def test_when_general_deleted_falls_back_to_first_category(self) -> None:
        # If GENERAL_CATEGORY_ID is not in known, target becomes first category.
        store = self._make_store(["custom_cat"])
        config = {"rules": [{"name": "rule", "category": "nonexistent"}]}
        coerce_rule_categories(store, config)
        assert config["rules"][0]["category"] == "custom_cat"


# ---------------------------------------------------------------------------
# canonicalise  (smoke test — verify shadowed_by key is stripped)
# ---------------------------------------------------------------------------


class TestCanonicalise:
    def test_strips_shadowed_by_from_rules(self) -> None:
        # Build a minimal conditions registry (empty) and a config with one rule
        # that has a transient `shadowed_by` key.
        hass = _make_hass(conditions={})
        config = {
            "rules": [
                {"name": "r1", "when": {}, "actions": [], "shadowed_by": 0},
            ]
        }
        result = canonicalise(hass, config)
        assert "shadowed_by" not in result["rules"][0]

    def test_preserves_other_rule_fields(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "rules": [
                {"name": "keep me", "when": {}, "actions": [], "shadowed_by": None},
            ]
        }
        result = canonicalise(hass, config)
        assert result["rules"][0]["name"] == "keep me"


# ---------------------------------------------------------------------------
# with_shadows  (smoke test — verify shadowed_by key is added)
# ---------------------------------------------------------------------------


class TestWithShadows:
    def test_adds_shadowed_by_key_to_every_rule(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "rules": [
                {"name": "r1", "when": {}, "actions": []},
                {"name": "r2", "when": {}, "actions": []},
            ]
        }
        result = with_shadows(hass, config)
        assert all("shadowed_by" in r for r in result["rules"])

    def test_does_not_mutate_original_config(self) -> None:
        hass = _make_hass(conditions={})
        config = {"rules": [{"name": "r1", "when": {}, "actions": []}]}
        result = with_shadows(hass, config)
        assert "shadowed_by" not in config["rules"][0]
        assert "shadowed_by" in result["rules"][0]
