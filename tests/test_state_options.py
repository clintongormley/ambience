"""Plausible-states helper, shared by the websocket API and the simulator."""

from custom_components.ambience.state_options import (
    known_attribute_values_for,
    known_states_for,
)


class _State:
    def __init__(self, state, attributes=None):
        self.state = state
        self.attributes = attributes or {}


class _States:
    def __init__(self, by_id):
        self._by_id = by_id

    def get(self, entity_id):
        return self._by_id.get(entity_id)

    def async_all(self, domain=None):
        return [s for eid, s in self._by_id.items() if eid.split(".", 1)[0] == domain]


class _Hass:
    def __init__(self, by_id):
        self.states = _States(by_id)


def test_binary_sensor_gets_on_off():
    hass = _Hass({"binary_sensor.motion": _State("off")})
    assert known_states_for(hass, "binary_sensor.motion") == ["on", "off"]


def test_unknown_domain_with_no_state_is_empty():
    hass = _Hass({})
    assert known_states_for(hass, "sensor.temp") == []


def test_person_includes_zone_names():
    hass = _Hass(
        {
            "person.alice": _State("home"),
            "zone.work": _State("0", {"friendly_name": "Work"}),
        }
    )
    result = known_states_for(hass, "person.alice")
    assert "home" in result and "not_home" in result and "Work" in result


def test_select_entity_options_are_included() -> None:
    """Lines 57-59: entities with an `options` list attribute (input_select /
    select) have each string option added to the result."""
    hass = _Hass(
        {
            "input_select.mode": _State("away", {"options": ["home", "away", "night"]}),
        }
    )
    result = known_states_for(hass, "input_select.mode")
    assert "home" in result
    assert "away" in result
    assert "night" in result


def test_select_entity_non_string_options_are_skipped() -> None:
    """Branch 58->57: non-string items in the `options` list are silently
    skipped; only string entries are added to the result."""
    hass = _Hass(
        {
            "input_select.mode": _State("home", {"options": [1, None, "home", True]}),
        }
    )
    result = known_states_for(hass, "input_select.mode")
    assert result.count("home") == 1
    assert 1 not in result
    assert None not in result


def test_zone_without_friendly_name_uses_entity_id_suffix() -> None:
    """Line 67: when a zone has no friendly_name attribute, the part after the
    dot in its entity_id is used as the zone label."""

    class _StateWithId(_State):
        """_State extended with entity_id, matching real HA state objects."""

        def __init__(self, entity_id, state, attributes=None):
            super().__init__(state, attributes)
            self.entity_id = entity_id

    hass = _Hass(
        {
            "person.bob": _StateWithId("person.bob", "home"),
            "zone.countryside": _StateWithId("zone.countryside", "0"),  # no friendly_name
        }
    )
    result = known_states_for(hass, "person.bob")
    assert "countryside" in result


def test_unavailable_state_is_not_added_to_options() -> None:
    """Line 69->72: when the entity's current state is 'unavailable' or
    'unknown', it is not appended to the options list."""
    hass_unavailable = _Hass({"binary_sensor.door": _State("unavailable")})
    result_unavailable = known_states_for(hass_unavailable, "binary_sensor.door")
    assert "unavailable" not in result_unavailable

    hass_unknown = _Hass({"binary_sensor.door": _State("unknown")})
    result_unknown = known_states_for(hass_unknown, "binary_sensor.door")
    assert "unknown" not in result_unknown


# --- known_attribute_values_for -------------------------------------------


def test_attribute_values_from_companion_list() -> None:
    """A light's `effect` reads its possible values from `effect_list`."""
    hass = _Hass(
        {
            "light.lamp": _State(
                "on", {"effect": "None", "effect_list": ["None", "Rainbow", "Colorloop"]}
            ),
        }
    )
    result = known_attribute_values_for(hass, "light.lamp", "effect")
    assert result == ["None", "Rainbow", "Colorloop"]


def test_attribute_values_appends_current_when_not_in_list() -> None:
    """The current value is always selectable, even if absent from the list."""
    hass = _Hass(
        {
            "light.lamp": _State("on", {"effect": "Custom", "effect_list": ["None", "Rainbow"]}),
        }
    )
    result = known_attribute_values_for(hass, "light.lamp", "effect")
    assert result == ["None", "Rainbow", "Custom"]


def test_attribute_values_no_mapping_returns_only_current() -> None:
    """An attribute with no companion list falls back to just its current value."""
    hass = _Hass({"light.lamp": _State("on", {"brightness": 254})})
    assert known_attribute_values_for(hass, "light.lamp", "brightness") == ["254"]


def test_attribute_values_empty_when_no_value_and_no_list() -> None:
    hass = _Hass({"light.lamp": _State("on", {})})
    assert known_attribute_values_for(hass, "light.lamp", "effect") == []


def test_attribute_values_missing_entity_is_empty() -> None:
    hass = _Hass({})
    assert known_attribute_values_for(hass, "light.lamp", "effect") == []


def test_attribute_values_non_string_list_items_are_stringified() -> None:
    hass = _Hass(
        {
            "climate.x": _State("cool", {"fan_mode": 2, "fan_modes": [1, 2, 3]}),
        }
    )
    assert known_attribute_values_for(hass, "climate.x", "fan_mode") == ["1", "2", "3"]
