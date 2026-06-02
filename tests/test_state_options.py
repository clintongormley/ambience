"""Plausible-states helper, shared by the websocket API and the simulator."""

from custom_components.ambience.state_options import known_states_for


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
