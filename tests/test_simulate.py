"""What-if simulator core."""

from datetime import UTC, datetime

import pytest

from custom_components.ambience.const import DATA_MATCHERS, DATA_STORE, DOMAIN
from custom_components.ambience.matchers.script import ScriptMatcher, _cache_key
from custom_components.ambience.simulate import (
    SimulatedWorld,
    build_simulated_snapshots,
    run_simulation,
    simulate_inputs,
    simulate_inputs_entities,
)
from custom_components.ambience.trace import CauseKind, TriggerCause


def test_simulated_cause_kind_exists_and_describes():
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail="2026-12-21T17:30:00")
    assert CauseKind.SIMULATED == "simulated"
    assert "2026-12-21T17:30:00" in cause.describe()


# ---------------------------------------------------------------------------
# Task 4: build_simulated_snapshots
# ---------------------------------------------------------------------------

FIXED = datetime(2026, 6, 21, 12, 0, tzinfo=UTC)


class _State:
    def __init__(self, entity_id, state, attributes=None):
        self.entity_id = entity_id
        self.state = state
        self.attributes = attributes or {}
        self.last_changed = FIXED
        self.last_updated = FIXED


class _States:
    def __init__(self, states):
        self._states = {s.entity_id: s for s in states}

    def get(self, entity_id):
        return self._states.get(entity_id)

    def async_all(self, domain=None):
        if domain is None:
            return list(self._states.values())
        return [s for s in self._states.values() if s.entity_id.split(".", 1)[0] == domain]


class _Config:
    latitude = 51.5
    longitude = -0.12
    elevation = 0
    time_zone = "UTC"


class _RecordingMatcher:
    """Captures the hass/now it was snapshotted with."""

    name = "recording"

    async def snapshot(self, hass, *, now=None):
        return {
            "now": now,
            "motion": hass.states.get("binary_sensor.motion"),
            "sun": hass.states.get("sun.sun"),
        }


class _Hass:
    def __init__(self, states):
        self.config = _Config()
        self.states = _States(states)
        self.data = {DOMAIN: {DATA_MATCHERS: {"recording": _RecordingMatcher()}}}


@pytest.mark.asyncio
async def test_build_simulated_snapshots_injects_now_and_overrides():
    hass = _Hass([_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(
        now=FIXED,
        overrides={"binary_sensor.motion": {"state": "on", "attributes": {}}},
    )
    snaps = await build_simulated_snapshots(hass, world)
    assert snaps["recording"]["now"] == FIXED
    assert snaps["recording"]["motion"].state == "on"  # override applied


@pytest.mark.asyncio
async def test_build_simulated_snapshots_injects_synthetic_sun():
    hass = _Hass([])  # no live sun.sun
    snaps = await build_simulated_snapshots(hass, SimulatedWorld(now=FIXED, overrides={}))
    # The matcher sees the injected sun.sun through the overlay...
    sun = snaps["recording"]["sun"]
    assert sun is not None
    assert sun.state in ("above_horizon", "below_horizon")
    # ...but the real hass.states is untouched (read-only overlay).
    assert hass.states.get("sun.sun") is None


# ---------------------------------------------------------------------------
# Task 5: simulate_inputs
# ---------------------------------------------------------------------------


class _Store:
    def __init__(self, rules, weather_entity=None):
        self._rules = rules
        self._weather_entity = weather_entity

    def scope_config(self, scope_kind, scope_id):
        return {"rules": self._rules}

    def get_matcher_config(self, name):
        if name == "weather":
            return {"entity": self._weather_entity, "groups": []}
        return {}


def _inputs_hass(rules, states, weather_entity=None):
    from custom_components.ambience.matchers.state import StateMatcher
    from custom_components.ambience.matchers.weather import WeatherMatcher

    hass = _Hass(states)
    matchers = {"state": StateMatcher(hass), "weather": WeatherMatcher(hass)}
    hass.data[DOMAIN] = {
        DATA_MATCHERS: matchers,
        DATA_STORE: _Store(rules, weather_entity),
    }
    return hass


@pytest.mark.asyncio
async def test_simulate_inputs_lists_entity_knobs_for_the_group():
    rules = [
        {
            "group": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        },
        {
            "group": "g2",
            "when": {"state": {"kind": "is", "entity_id": "binary_sensor.other", "states": ["on"]}},
        },
    ]
    hass = _inputs_hass(rules, [_State("binary_sensor.motion", "off")])
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    ids = [k["entity_id"] for k in result["knobs"] if k["kind"] == "entity"]
    assert ids == ["binary_sensor.motion"]  # only g1's dependency
    assert result["knobs"][0]["live_state"] == "off"
    assert result["knobs"][0]["attributes"] == []


@pytest.mark.asyncio
async def test_simulate_inputs_surfaces_weather_threshold_attributes():
    rules = [
        {
            "group": "g1",
            "when": {
                "weather": {"thresholds": [{"attribute": "temperature", "op": "<", "value": 18}]}
            },
        }
    ]
    hass = _inputs_hass(
        rules,
        [_State("weather.home", "rainy", {"temperature": 9.0, "humidity": 80})],
        weather_entity="weather.home",
    )
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    weather_knob = next(k for k in result["knobs"] if k.get("entity_id") == "weather.home")
    assert weather_knob["live_state"] == "rainy"
    assert weather_knob["attributes"] == [
        {"name": "temperature", "control": "number", "live_value": 9.0}
    ]


@pytest.mark.asyncio
async def test_simulate_inputs_emits_script_verdict_knob():
    from custom_components.ambience.matchers.script import ScriptMatcher, ScriptSnapshot, _cache_key

    class _ScriptStub(ScriptMatcher):
        async def snapshot(self, hass, *, now=None):
            return ScriptSnapshot(results={_cache_key("script.holiday", {}): True})

    rules = [{"group": "g1", "name": "Holiday", "when": {"script": {"script": "script.holiday"}}}]

    class _Store4:
        def scope_config(self, sk, si):
            return {"rules": rules}

        def get_matcher_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass = _Hass([])
    hass.data[DOMAIN] = {DATA_MATCHERS: {"script": _ScriptStub(hass)}, DATA_STORE: _Store4()}

    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    verdicts = [k for k in result["knobs"] if k["kind"] == "verdict"]
    assert len(verdicts) == 1
    v = verdicts[0]
    assert v["matcher"] == "script"
    assert v["key"] == _cache_key("script.holiday", {})
    assert v["entity_id"] == "script.holiday"
    assert v["live_value"] is True
    assert "has_time" in result


# ---------------------------------------------------------------------------
# Task 6: run_simulation
# ---------------------------------------------------------------------------


def _resolve_hass(rules, states):
    from custom_components.ambience.matchers.state import StateMatcher

    hass = _Hass(states)
    hass.data[DOMAIN] = {
        DATA_MATCHERS: {"state": StateMatcher(hass)},
        DATA_STORE: _Store(rules),
    }
    return hass


@pytest.mark.asyncio
async def test_run_simulation_returns_winner_as_buffered_unit():
    rules = [
        {
            "group": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}],
        }
    ]
    hass = _resolve_hass(rules, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result = await run_simulation(hass, "area", "kitchen", "g1", world)

    assert result["outcome"] == "acted"
    assert result["winner_name"] == "Motion on"
    assert result["cause"]["kind"] == "simulated"
    assert result["group"] == "g1"
    assert result["explanation"]["rules"][0]["matched"] is True


@pytest.mark.asyncio
async def test_run_simulation_reports_no_match():
    rules = [
        {
            "group": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        }
    ]
    hass = _resolve_hass(rules, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={})  # motion stays off
    result = await run_simulation(hass, "area", "kitchen", "g1", world)
    assert result["outcome"] == "no_match"
    assert result["winner_name"] is None


# ---------------------------------------------------------------------------
# Task 3: verdict overrides for opaque matchers
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_build_simulated_snapshots_uses_verdicts_for_script():
    called = {"snapshot": False}

    class _Spy(ScriptMatcher):
        async def snapshot(self, hass, *, now=None):  # must NOT be called
            called["snapshot"] = True
            raise AssertionError("real script snapshot should not run under verdicts")

    hass = _Hass([])
    hass.data[DOMAIN] = {DATA_MATCHERS: {"script": _Spy(hass)}}
    key = _cache_key("script.holiday", {})
    world = SimulatedWorld(now=FIXED, overrides={}, verdicts={"script": {key: True}})

    snaps = await build_simulated_snapshots(hass, world)
    assert called["snapshot"] is False
    assert snaps["script"].results == {key: True}


# ---------------------------------------------------------------------------
# Task 4: simulate_inputs_entities
# ---------------------------------------------------------------------------


def test_simulate_inputs_excludes_time_derived_entities():
    rules = [
        {
            "group": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]},
                "day": {"include": [{"kind": "workday"}]},
            },
        }
    ]
    from custom_components.ambience.matchers.day import DayMatcher
    from custom_components.ambience.matchers.state import StateMatcher

    hass = _Hass([_State("binary_sensor.motion", "off")])

    class _Store2:
        def scope_config(self, sk, si):
            return {"rules": rules}

        def get_matcher_config(self, name):
            if name == "day":
                return {"workday_sensor": "binary_sensor.workday", "workday_calendar": None}
            if name == "weather":
                return {"entity": None, "groups": []}
            return {}

    hass.data[DOMAIN] = {
        DATA_MATCHERS: {"state": StateMatcher(hass), "day": DayMatcher(hass)},
        DATA_STORE: _Store2(),
    }
    result = simulate_inputs_entities(hass, "area", "kitchen", "g1")
    ids = [k["entity_id"] for k in result]
    assert ids == ["binary_sensor.motion"]  # workday sensor excluded (day matcher)


def test_simulate_inputs_control_kinds():
    rules = [
        {
            "group": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        },
        {
            "group": "g1",
            "when": {"state": {"kind": "is", "entity_id": "sensor.count", "states": ["2.0"]}},
        },
    ]
    from custom_components.ambience.matchers.state import StateMatcher

    hass = _Hass([_State("binary_sensor.motion", "off"), _State("sensor.count", "2.0")])

    class _Store3:
        def scope_config(self, sk, si):
            return {"rules": rules}

        def get_matcher_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass.data[DOMAIN] = {DATA_MATCHERS: {"state": StateMatcher(hass)}, DATA_STORE: _Store3()}
    knobs = {k["entity_id"]: k for k in simulate_inputs_entities(hass, "area", "kitchen", "g1")}
    assert knobs["binary_sensor.motion"]["control"] == "select"
    assert knobs["binary_sensor.motion"]["options"] == ["on", "off"]
    assert knobs["sensor.count"]["control"] == "number"
    assert "options" not in knobs["sensor.count"]
