"""Tests for websocket_helpers.py — characterization tests for pure helper functions.

All functions tested here are pure (no I/O, no HA side-effects) so we test
them directly, constructing lightweight stubs for hass / store only where the
helpers read from hass.data.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import MagicMock

import pytest

from custom_components.ambience.conditions.weather import weather_predicate_active
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DOMAIN,
    GENERAL_CATEGORY_ID,
)
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.websocket_helpers import (
    annotate_scenes,
    canonicalise,
    coerce_scene_categories,
    validate_scope_config,
    validate_weather_groups,
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
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, "not a dict")  # type: ignore[arg-type]
        assert exc.value.translation_key == "scene_config_not_object"

    def test_rejects_unknown_condition_key(self) -> None:
        hass = _make_hass(conditions={})  # empty registry → all keys unknown
        config = {"scenes": [{"when": {"nonexistent_condition": {"some": "value"}}, "actions": []}]}
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_unknown_condition"
        assert exc.value.translation_placeholders["key"] == "nonexistent_condition"

    def test_allows_none_predicate_without_validation(self) -> None:
        """A None predicate is treated as 'no constraint' and skipped entirely —
        the condition need not be in the registry."""
        hass = _make_hass(conditions={})  # empty registry
        config = {"scenes": [{"when": {"some_condition": None}, "actions": []}]}
        # Should NOT raise even though 'some_condition' is not registered.
        validate_scope_config(hass, config)

    def test_accepts_empty_scenes(self) -> None:
        hass = _make_hass()
        validate_scope_config(hass, {"scenes": []})  # no error

    def test_accepts_string_description(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {"category": "general", "when": {}, "actions": [], "description": "Evening lights."}
            ]
        }
        validate_scope_config(hass, config)  # must not raise

    def test_rejects_non_string_description(self) -> None:
        hass = _make_hass(conditions={})
        config = {"scenes": [{"category": "general", "when": {}, "actions": [], "description": 5}]}
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_description_not_string"
        assert exc.value.translation_placeholders["scene_idx"] == "0"

    def test_rejects_malformed_service_missing_dot(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "scenes": [
                {
                    "when": {},
                    "actions": [{"service": "no_dot", "entity_ids": [], "params": {}}],
                }
            ]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_action_service_invalid"

    def test_allows_unexposed_action(self) -> None:
        # A well-formed action whose service isn't exposed must no longer block the
        # save; it surfaces via Repairs + the scene badge instead.
        hass = _make_hass(conditions={}, exposed_actions=_make_exposed([]))
        cfg = {
            "scenes": [
                {"when": {}, "actions": [{"service": "fan.toggle", "entity_ids": ["fan.x"]}]}
            ]
        }
        validate_scope_config(hass, cfg)  # must not raise

    def test_rejects_non_list_entity_ids(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "scenes": [
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
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_action_entity_ids_not_list"

    def test_rejects_non_string_entity_id_element(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "scenes": [
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
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_action_entity_ids_not_strings"

    def test_rejects_non_dict_params(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "scenes": [
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
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_action_params_not_object"

    def test_accepts_valid_action(self) -> None:
        exposed = _make_exposed(["light.turn_on"])
        hass = _make_hass(exposed_actions=exposed)
        config = {
            "scenes": [
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

    def test_rejects_non_int_priority(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {"name": "A", "category": "c", "when": {}, "actions": [], "priority": "high"}
            ]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_priority_invalid"

    def test_rejects_bool_priority(self) -> None:
        # bool is an int subclass; a `True`/`False` priority is a mistake, not a number.
        hass = _make_hass(conditions={})
        config = {
            "scenes": [{"name": "A", "category": "c", "when": {}, "actions": [], "priority": True}]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_priority_invalid"

    def test_accepts_int_priority(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [{"name": "A", "category": "c", "when": {}, "actions": [], "priority": 2048}]
        }
        validate_scope_config(hass, config)  # no error

    def test_rejects_non_bool_pinned(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [{"name": "A", "category": "c", "when": {}, "actions": [], "pinned": "yes"}]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_pinned_invalid"

    def test_accepts_bool_pinned(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [{"name": "A", "category": "c", "when": {}, "actions": [], "pinned": True}]
        }
        validate_scope_config(hass, config)  # no error

    def test_calls_validate_predicate_for_known_condition(self) -> None:
        # Line 49: condition is registered, validate_predicate is called on the predicate.
        mock_condition = MagicMock()
        mock_condition.validate_predicate.side_effect = ValueError("bad predicate")
        hass = _make_hass(conditions={"time_of_day": mock_condition})
        config = {"scenes": [{"when": {"time_of_day": {"period": "garbage"}}, "actions": []}]}
        with pytest.raises(ValueError, match="bad predicate"):
            validate_scope_config(hass, config)
        mock_condition.validate_predicate.assert_called_once_with({"period": "garbage"})

    # --- scene-name uniqueness (server-side backstop for the frontend rule) ---

    def test_rejects_duplicate_scene_name_in_same_category(self) -> None:
        hass = _make_hass()
        config = {
            "scenes": [
                {"name": "Movie", "category": "a", "when": {}, "actions": []},
                {"name": "Movie", "category": "a", "when": {}, "actions": []},
            ]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_dup_name"

    def test_allows_same_scene_name_in_different_categories(self) -> None:
        hass = _make_hass()
        config = {
            "scenes": [
                {"name": "Movie", "category": "a", "when": {}, "actions": []},
                {"name": "Movie", "category": "b", "when": {}, "actions": []},
            ]
        }
        validate_scope_config(hass, config)  # no error

    def test_duplicate_scene_name_match_is_case_insensitive_and_trimmed(self) -> None:
        hass = _make_hass()
        config = {
            "scenes": [
                {"name": "  Movie ", "category": "a", "when": {}, "actions": []},
                {"name": "MOVIE", "category": "a", "when": {}, "actions": []},
            ]
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_dup_name"

    def test_allows_duplicate_empty_or_missing_scene_names(self) -> None:
        # Empty/whitespace/absent names are exempt from the uniqueness check.
        hass = _make_hass()
        config = {
            "scenes": [
                {"name": "", "category": "a", "when": {}, "actions": []},
                {"name": "   ", "category": "a", "when": {}, "actions": []},
                {"category": "a", "when": {}, "actions": []},
            ]
        }
        validate_scope_config(hass, config)  # no error

    def test_non_string_category_raises_value_error_not_typeerror(self) -> None:
        # A corrupted/hand-edited category that isn't a string must surface a
        # clean AmbienceError (caught by the websocket handler), not an unhashable
        # TypeError that escapes the validation path.
        hass = _make_hass()
        config = {
            "scenes": [{"name": "Movie", "category": ["a"], "when": {}, "actions": []}],
        }
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_category_not_string"

    def test_category_type_is_checked_for_unnamed_scenes_too(self) -> None:
        """The category is a hash key downstream (sorting's per-category buckets,
        the MCP diff): an unhashable value must be a clean validation error for
        EVERY scene, not a TypeError that escapes the save path as unknown_error."""
        hass = _make_hass()
        with pytest.raises(AmbienceError) as err:
            validate_scope_config(
                hass,
                {"scenes": [{"category": {"x": 1}, "when": {}, "actions": []}]},  # no name
            )
        assert err.value.translation_key == "scene_category_not_string"

    def test_accepts_scene_apply_once(self) -> None:
        hass = _make_hass()
        validate_scope_config(hass, {"scenes": [{"when": {}, "actions": [], "apply": "once"}]})

    def test_accepts_scene_apply_always(self) -> None:
        hass = _make_hass()
        validate_scope_config(hass, {"scenes": [{"when": {}, "actions": [], "apply": "always"}]})

    def test_accepts_scene_without_apply(self) -> None:
        hass = _make_hass()
        validate_scope_config(hass, {"scenes": [{"when": {}, "actions": []}]})

    def test_rejects_invalid_apply_value(self) -> None:
        hass = _make_hass()
        config = {"scenes": [{"when": {}, "actions": [], "apply": "sometimes"}]}
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_apply_invalid"

    def test_rejects_non_string_apply(self) -> None:
        hass = _make_hass()
        config = {"scenes": [{"when": {}, "actions": [], "apply": {"mode": "once"}}]}
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, config)
        assert exc.value.translation_key == "scene_apply_invalid"

    def test_rejects_unknown_top_level_key(self) -> None:
        """A scope save carries `scenes` plus the tolerated-but-stripped legacy
        keys (`enabled`, `conditions`); anything else is rejected."""
        hass = _make_hass()
        with pytest.raises(AmbienceError) as exc:
            validate_scope_config(hass, {"scenes": [], "foo": 1})
        assert exc.value.translation_key == "scene_config_unknown_key"
        assert exc.value.translation_placeholders["key"] == "foo"

    def test_accepts_legacy_enabled_key(self) -> None:
        # Accepted for backward compatibility with older clients; canonicalise
        # strips it, so it never reaches the store.
        validate_scope_config(_make_hass(), {"scenes": [], "enabled": False})


# ---------------------------------------------------------------------------
# validate_weather_groups
# ---------------------------------------------------------------------------


class TestValidateWeatherGroups:
    def test_none_returns_empty_list(self) -> None:
        # Line 176: groups=None
        assert validate_weather_groups(None) == []

    def test_non_list_raises(self) -> None:
        # Line 178: groups not a list
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups({"id": "wet"})
        assert exc.value.translation_key == "weather_groups_not_list"

    def test_non_dict_element_raises(self) -> None:
        # Line 184: element not a dict
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups(["not_a_dict"])
        assert exc.value.translation_key == "weather_group_not_object"

    def test_missing_id_raises(self) -> None:
        # Line 189: id missing
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups([{"label": "Wet", "conditions": ["rainy"]}])
        assert exc.value.translation_key == "weather_group_id_empty"

    def test_empty_string_id_raises(self) -> None:
        # Line 189: id is empty string
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups([{"id": "", "label": "Wet", "conditions": ["rainy"]}])
        assert exc.value.translation_key == "weather_group_id_empty"

    def test_duplicate_id_raises(self) -> None:
        groups = [
            {"id": "wet", "label": "Wet", "conditions": ["rainy"]},
            {"id": "wet", "label": "Wet again", "conditions": ["pouring"]},
        ]
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups(groups)
        assert exc.value.translation_key == "weather_group_id_duplicate"

    def test_missing_label_raises(self) -> None:
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups([{"id": "wet", "conditions": ["rainy"]}])
        assert exc.value.translation_key == "weather_group_label_empty"

    def test_empty_label_raises(self) -> None:
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups([{"id": "wet", "label": "", "conditions": ["rainy"]}])
        assert exc.value.translation_key == "weather_group_label_empty"

    def test_invalid_condition_raises(self) -> None:
        # Line 194: condition not in WEATHER_CONDITIONS
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups(
                [{"id": "wet", "label": "Wet", "conditions": ["not-a-real-condition"]}]
            )
        assert exc.value.translation_key == "weather_group_invalid_conditions"

    def test_non_list_conditions_raises(self) -> None:
        # conditions key not a list at all
        with pytest.raises(AmbienceError) as exc:
            validate_weather_groups([{"id": "wet", "label": "Wet", "conditions": "rainy"}])
        assert exc.value.translation_key == "weather_group_invalid_conditions"

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
# coerce_scene_categories
# ---------------------------------------------------------------------------


class TestCoerceSceneCategories:
    def _make_store(self, category_ids: list[str]) -> Any:
        store = MagicMock()
        store.categories.return_value = [{"id": cid} for cid in category_ids]
        return store

    def test_unknown_category_is_coerced_to_general(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID, "lighting"])
        config = {"scenes": [{"name": "scene", "category": "nonexistent"}]}
        coerce_scene_categories(store, config)
        assert config["scenes"][0]["category"] == GENERAL_CATEGORY_ID

    def test_missing_category_key_is_coerced_to_general(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID])
        config = {"scenes": [{"name": "no cat scene"}]}
        coerce_scene_categories(store, config)
        assert config["scenes"][0]["category"] == GENERAL_CATEGORY_ID

    def test_known_category_is_not_changed(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID, "lighting"])
        config = {"scenes": [{"name": "light scene", "category": "lighting"}]}
        coerce_scene_categories(store, config)
        assert config["scenes"][0]["category"] == "lighting"

    def test_empty_scenes_is_a_no_op(self) -> None:
        store = self._make_store([GENERAL_CATEGORY_ID])
        config = {"scenes": []}
        coerce_scene_categories(store, config)  # should not raise
        assert config["scenes"] == []

    def test_when_general_deleted_falls_back_to_first_category(self) -> None:
        # If GENERAL_CATEGORY_ID is not in known, target becomes first category.
        store = self._make_store(["custom_cat"])
        config = {"scenes": [{"name": "scene", "category": "nonexistent"}]}
        coerce_scene_categories(store, config)
        assert config["scenes"][0]["category"] == "custom_cat"


# ---------------------------------------------------------------------------
# canonicalise  (smoke test — verify shadowed_by key is stripped)
# ---------------------------------------------------------------------------


class TestCanonicalise:
    def test_strips_shadowed_by_from_scenes(self) -> None:
        # Build a minimal conditions registry (empty) and a config with one scene
        # that has a transient `shadowed_by` key.
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {"name": "r1", "when": {}, "actions": [], "shadowed_by": 0},
            ]
        }
        result = canonicalise(hass, config)
        assert "shadowed_by" not in result["scenes"][0]

    def test_preserves_other_scene_fields(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {"name": "keep me", "when": {}, "actions": [], "shadowed_by": None},
            ]
        }
        result = canonicalise(hass, config)
        assert result["scenes"][0]["name"] == "keep me"

    def test_strips_problem_fields_from_scenes(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {
                    "name": "r1",
                    "when": {},
                    "actions": [],
                    "shadowed_by": 0,
                    "missing_entities": ["light.x"],
                    "overlap_entities": ["light.y"],
                    "config_issues": [{"kind": "missing_workday_sensor", "ref": "workday_sensor"}],
                },
            ]
        }
        result = canonicalise(hass, config)
        assert "shadowed_by" not in result["scenes"][0]
        assert "missing_entities" not in result["scenes"][0]
        assert "overlap_entities" not in result["scenes"][0]
        assert "config_issues" not in result["scenes"][0]

    def test_strips_scope_enabled_flag(self) -> None:
        """`enabled` is written only by ambience/set_scope_enabled, so the
        storage form of a scene save never carries it."""
        hass = _make_hass(conditions={})
        result = canonicalise(hass, {"scenes": [], "enabled": False})
        assert "enabled" not in result

    def test_strips_legacy_conditions_field(self) -> None:
        """The dead top-level `conditions` field is tolerated on the wire but
        never reaches storage."""
        hass = _make_hass(conditions={})
        result = canonicalise(hass, {"scenes": [], "conditions": ["time_of_day"]})
        assert "conditions" not in result

    def test_canonicalise_preserves_description(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {
                    "category": "general",
                    "when": {},
                    "actions": [],
                    "description": "Living room evening.",
                }
            ]
        }
        out = canonicalise(hass, config)
        assert out["scenes"][0]["description"] == "Living room evening."

    def test_normalises_state_predicate_redundant_nesting(self) -> None:
        # canonicalise runs each scene's `when` predicate through the condition's
        # optional normalize_predicate, so editor-produced redundant nesting
        # (here OR[ OR[AND[a,b]], c ]) is flattened in the stored form.
        from custom_components.ambience.conditions.state import StateCondition

        def atom(eid: str) -> dict:
            return {"kind": "is", "entity_id": eid, "states": ["on"]}

        inner_and = {"kind": "and", "items": [atom("a"), atom("b")]}
        hass = _make_hass(conditions={"state": StateCondition()})
        config = {
            "scenes": [
                {
                    "name": "r1",
                    "when": {
                        "state": {
                            "kind": "or",
                            "items": [{"kind": "or", "items": [inner_and]}, atom("c")],
                        }
                    },
                    "actions": [],
                }
            ]
        }
        out = canonicalise(hass, config)
        assert out["scenes"][0]["when"]["state"] == {
            "kind": "or",
            "items": [inner_and, atom("c")],
        }
        # The original config is left untouched (canonicalise is pure).
        assert config["scenes"][0]["when"]["state"]["items"][0]["kind"] == "or"

    def test_leaves_predicate_without_normaliser_unchanged(self) -> None:
        # A condition with no normalize_predicate method: the predicate passes
        # through unchanged (canonicalise must not assume the method exists).
        hass = _make_hass(conditions={"some_condition": object()})
        config = {"scenes": [{"name": "r1", "when": {"some_condition": {"x": 1}}, "actions": []}]}
        out = canonicalise(hass, config)
        assert out["scenes"][0]["when"]["some_condition"] == {"x": 1}

    def test_minimise_pins_drops_redundant_pins(self) -> None:
        # Two empty-`when` scenes, both pinned, numbered in the same order the sort
        # would already give them (array/stable order) → the pins are redundant, so
        # the flag drops both while preserving the order.
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {
                    "name": "A",
                    "category": "c",
                    "when": {},
                    "actions": [],
                    "priority": 2048,
                    "pinned": True,
                },
                {
                    "name": "B",
                    "category": "c",
                    "when": {},
                    "actions": [],
                    "priority": 1024,
                    "pinned": True,
                },
            ]
        }
        out = canonicalise(hass, config, minimise_pins=True)
        assert [s["name"] for s in out["scenes"]] == ["A", "B"]  # order preserved
        assert all(not s.get("pinned") for s in out["scenes"])  # both pins dropped

    def test_without_minimise_flag_keeps_pins(self) -> None:
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {
                    "name": "A",
                    "category": "c",
                    "when": {},
                    "actions": [],
                    "priority": 2048,
                    "pinned": True,
                },
                {
                    "name": "B",
                    "category": "c",
                    "when": {},
                    "actions": [],
                    "priority": 1024,
                    "pinned": True,
                },
            ]
        }
        out = canonicalise(hass, config)  # default: no minimisation
        assert all(s.get("pinned") for s in out["scenes"])  # pins preserved verbatim


# ---------------------------------------------------------------------------
# annotate_scenes  (merge unit — shadowed_by + scene_annotations; the heavy
# missing/overlap computation is covered in test_config_health.py, so the
# computation is stubbed here to isolate the merge.)
# ---------------------------------------------------------------------------


class TestAnnotateScenes:
    def test_adds_problem_fields_to_every_scene(self, monkeypatch) -> None:
        import custom_components.ambience.websocket_helpers as wh

        monkeypatch.setattr(
            wh,
            "scene_annotations",
            lambda hass, cfg, **_kw: [
                {"missing_entities": [], "overlap_entities": []} for _ in cfg["scenes"]
            ],
        )
        hass = _make_hass(conditions={})
        config = {
            "scenes": [
                {"name": "r1", "when": {}, "actions": []},
                {"name": "r2", "when": {}, "actions": []},
            ]
        }
        result = annotate_scenes(hass, config)
        for r in result["scenes"]:
            assert "shadowed_by" in r
            assert r["missing_entities"] == []
            assert r["overlap_entities"] == []

    def test_does_not_mutate_original_config(self, monkeypatch) -> None:
        import custom_components.ambience.websocket_helpers as wh

        monkeypatch.setattr(
            wh,
            "scene_annotations",
            lambda hass, cfg, **_kw: [{"missing_entities": ["x"], "overlap_entities": []}],
        )
        hass = _make_hass(conditions={})
        config = {"scenes": [{"name": "r1", "when": {}, "actions": []}]}
        result = annotate_scenes(hass, config)
        assert "missing_entities" not in config["scenes"][0]
        assert result["scenes"][0]["missing_entities"] == ["x"]
        assert "shadowed_by" in result["scenes"][0]

    def test_forwards_fresh_overlap_to_scene_annotations(self, monkeypatch) -> None:
        import custom_components.ambience.websocket_helpers as wh

        captured: dict[str, object] = {}

        def fake(hass, cfg, *, fresh_overlap=False):
            captured["fresh_overlap"] = fresh_overlap
            return [{"missing_entities": [], "overlap_entities": []} for _ in cfg["scenes"]]

        monkeypatch.setattr(wh, "scene_annotations", fake)
        hass = _make_hass(conditions={})
        config = {"scenes": [{"name": "r1", "when": {}, "actions": []}]}
        annotate_scenes(hass, config, fresh_overlap=True)
        assert captured["fresh_overlap"] is True
