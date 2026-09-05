"""What-if simulator core."""

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.helpers import entity_registry as er

from custom_components.ambience.conditions.script import ScriptCondition, _cache_key
from custom_components.ambience.const import (
    DATA_CONDITIONS,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DOMAIN,
)
from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.exposed_actions import ExposedActionsStore
from custom_components.ambience.simulate import (
    SimulatedWorld,
    _build_override_states,
    _collect_state_attributes,
    _entity_knob,
    _in_domain,
    _is_number,
    _record_attr,
    _safe_category_name,
    _simulate_outcome,
    _SimulatedHass,
    _SimulatedStates,
    _verdict_snapshot,
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
    debug = False


class _RecordingCondition:
    """Captures the hass/now/entities it was snapshotted with."""

    name = "recording"

    async def snapshot(self, hass, *, now=None, entities=None):
        return {
            "now": now,
            "entities": entities,
            "motion": hass.states.get("binary_sensor.motion"),
            "sun": hass.states.get("sun.sun"),
        }


class _EntityRegistry:
    """Empty entity registry: no Ambience switch is registered in these stubs."""

    def async_get_entity_id(self, domain, platform, unique_id):
        return None

    def async_get(self, entity_id):
        return None


class _Hass:
    def __init__(self, states):
        self.config = _Config()
        self.states = _States(states)
        self.data = {
            DOMAIN: {DATA_CONDITIONS: {"recording": _RecordingCondition()}},
            # The switch gate reads the entity registry when a scope's switch
            # entity isn't loaded; er.async_get would build a real one here.
            er.DATA_REGISTRY: _EntityRegistry(),
        }


def test_build_override_states_backdates_clock_for_for_duration():
    # A `for` duration makes the overridden state read as having been held that
    # long, so `for:` conditions evaluate as the user intends.
    hass = _Hass([_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(
        now=FIXED,
        overrides={"binary_sensor.motion": {"state": "on", "for": {"h": 0, "m": 5, "s": 0}}},
    )
    s = _build_override_states(hass, world)["binary_sensor.motion"]
    assert s.state == "on"
    assert s.last_changed == FIXED - timedelta(minutes=5)
    assert s.last_updated == FIXED - timedelta(minutes=5)


def test_build_override_states_clock_defaults_to_now_without_for():
    # No `for` → the entity reads as just-changed at the simulated `now`.
    hass = _Hass([_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    s = _build_override_states(hass, world)["binary_sensor.motion"]
    assert s.last_changed == FIXED
    assert s.last_updated == FIXED


def test_build_override_states_handles_absurd_for_without_crashing():
    # A duration so large that `now - for` underflows datetime must not raise —
    # it reads as "held effectively forever" (backdated to a valid floor).
    hass = _Hass([_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(
        now=FIXED,
        overrides={
            "binary_sensor.motion": {"state": "on", "for": {"h": 100_000_000, "m": 0, "s": 0}}
        },
    )
    s = _build_override_states(hass, world)["binary_sensor.motion"]
    assert s.last_changed < FIXED


def test_build_override_states_clamps_negative_for_to_now():
    # Defense in depth: a negative `for` must not backdate into the future.
    hass = _Hass([_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(
        now=FIXED,
        overrides={"binary_sensor.motion": {"state": "on", "for": {"h": 0, "m": -5, "s": 0}}},
    )
    s = _build_override_states(hass, world)["binary_sensor.motion"]
    assert s.last_changed == FIXED


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
async def test_build_simulated_snapshots_passes_referenced_entities():
    """A referenced map narrows each condition's snapshot to the entities the
    simulated scenes use; conditions absent from the map get an empty set."""
    hass = _Hass([])
    world = SimulatedWorld(now=FIXED, overrides={})
    snaps = await build_simulated_snapshots(
        hass, world, referenced={"recording": frozenset({"sensor.x"})}
    )
    assert snaps["recording"]["entities"] == frozenset({"sensor.x"})


@pytest.mark.asyncio
async def test_build_simulated_snapshots_without_referenced_scans_all():
    """No referenced map -> entities=None (back-compat scan-all)."""
    hass = _Hass([])
    snaps = await build_simulated_snapshots(hass, SimulatedWorld(now=FIXED, overrides={}))
    assert snaps["recording"]["entities"] is None


@pytest.mark.asyncio
async def test_build_simulated_snapshots_injects_synthetic_sun():
    hass = _Hass([])  # no live sun.sun
    snaps = await build_simulated_snapshots(hass, SimulatedWorld(now=FIXED, overrides={}))
    # The condition sees the injected sun.sun through the overlay...
    sun = snaps["recording"]["sun"]
    assert sun is not None
    assert sun.state in ("above_horizon", "below_horizon")
    # ...but the real hass.states is untouched (read-only overlay).
    assert hass.states.get("sun.sun") is None


# ---------------------------------------------------------------------------
# Task 5: simulate_inputs
# ---------------------------------------------------------------------------


class _Store:
    def __init__(self, scenes, weather_entity=None):
        self._scenes = scenes
        self._weather_entity = weather_entity

    def scope_config(self, scope_kind, scope_id):
        return {"scenes": self._scenes}

    def get_condition_config(self, name):
        if name == "weather":
            return {"entity": self._weather_entity, "groups": []}
        return {}


def _inputs_hass(scenes, states, weather_entity=None):
    from custom_components.ambience.conditions.state import StateCondition
    from custom_components.ambience.conditions.weather import WeatherCondition

    hass = _Hass(states)
    conditions = {"state": StateCondition(hass), "weather": WeatherCondition(hass)}
    hass.data[DOMAIN] = {
        DATA_CONDITIONS: conditions,
        DATA_STORE: _Store(scenes, weather_entity),
    }
    return hass


def test_entity_knob_surfaces_unavailable_live_state_as_option():
    """An off-network entity reads `unavailable`, which known_states_for omits
    from a domain's option list. The simulator seeds the state control from the
    live state, so that value must still be selectable — otherwise the <select>
    shows one value (a real state) while the component holds `unavailable` and
    sends it, which the engine treats as unobservable and so silently ignores
    every attribute override on the entity (e.g. a remote's current_activity)."""
    hass = _Hass([_State("remote.cine", "unavailable")])
    knob = _entity_knob(hass, "remote.cine", [], weather_entity=None)
    assert knob["control"] == "select"
    assert knob["live_state"] == "unavailable"
    # The seeded value (live_state) is one of the offered options, so the
    # control's displayed value matches what it sends.
    assert "unavailable" in knob["options"]
    # The normal states are still offered so the user can pick a real one.
    assert "on" in knob["options"]


def test_entity_knob_absent_entity_reads_as_unavailable():
    """A referenced entity can be absent entirely (its integration removes it
    while the hub is offline), not merely `unavailable` — hass.states.get is
    None. It must still read as Unavailable, consistent with a present-but-
    unavailable entity, instead of seeding an empty value the <select> renders
    as a real state while the engine treats it as unknown."""
    hass = _Hass([])  # remote.cine not present at all
    knob = _entity_knob(hass, "remote.cine", [], weather_entity=None)
    assert knob["control"] == "select"
    assert knob["live_state"] == "unavailable"
    assert "unavailable" in knob["options"]
    assert "on" in knob["options"]


@pytest.mark.asyncio
async def test_simulate_inputs_lists_entity_knobs_for_the_category():
    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        },
        {
            "category": "g2",
            "when": {"state": {"kind": "is", "entity_id": "binary_sensor.other", "states": ["on"]}},
        },
    ]
    hass = _inputs_hass(scenes, [_State("binary_sensor.motion", "off")])
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    ids = [k["entity_id"] for k in result["knobs"] if k["kind"] == "entity"]
    assert ids == ["binary_sensor.motion"]  # only g1's dependency
    assert result["knobs"][0]["live_state"] == "off"
    assert result["knobs"][0]["attributes"] == []


@pytest.mark.asyncio
async def test_simulate_inputs_surfaces_weather_threshold_attributes():
    scenes = [
        {
            "category": "g1",
            "when": {
                "weather": {"thresholds": [{"attribute": "temperature", "op": "<", "value": 18}]}
            },
        }
    ]
    hass = _inputs_hass(
        scenes,
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
    from custom_components.ambience.conditions.script import (
        ScriptCondition,
        ScriptSnapshot,
        _cache_key,
    )

    class _ScriptStub(ScriptCondition):
        async def snapshot(self, hass, *, now=None):
            return ScriptSnapshot(results={_cache_key("script.holiday", {}): True})

    scenes = [
        {"category": "g1", "name": "Holiday", "when": {"script": {"script": "script.holiday"}}}
    ]

    class _Store4:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass = _Hass([])
    hass.data[DOMAIN] = {DATA_CONDITIONS: {"script": _ScriptStub(hass)}, DATA_STORE: _Store4()}

    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    verdicts = [k for k in result["knobs"] if k["kind"] == "verdict"]
    assert len(verdicts) == 1
    v = verdicts[0]
    assert v["condition"] == "script"
    assert v["key"] == _cache_key("script.holiday", {})
    assert v["entity_id"] == "script.holiday"
    assert v["live_value"] is True
    assert "has_time" in result


# ---------------------------------------------------------------------------
# Task 6: run_simulation
# ---------------------------------------------------------------------------


class _ExposedStorage:
    def __init__(self, ids):
        self._ids = list(ids)

    def get_exposed_actions(self):
        return [{"id": i, "label": "", "visible_fields": [], "defaults": {}} for i in self._ids]

    async def async_save_exposed_actions(self, actions):
        self._ids = [a["id"] for a in actions]


def _resolve_hass(scenes, states, exposed=("light.turn_on", "light.turn_off")):
    from custom_components.ambience.conditions.state import StateCondition

    hass = _Hass(states)
    hass.data[DOMAIN] = {
        DATA_CONDITIONS: {"state": StateCondition(hass)},
        DATA_STORE: _Store(scenes),
        DATA_EXPOSED_ACTIONS: ExposedActionsStore(_ExposedStorage(exposed)),
    }
    return hass


@pytest.mark.asyncio
async def test_run_simulation_returns_winner_as_buffered_unit():
    scenes = [
        {
            "category": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, _applied = await run_simulation(hass, "area", "kitchen", "g1", world)

    assert result["outcome"] == "acted"
    assert result["winner_name"] == "Motion on"
    assert result["cause"]["kind"] == "simulated"
    assert result["category"] == "g1"
    assert result["explanation"]["scenes"][0]["matched"] is True
    # first win acts and remembers its scene index (0)
    assert _applied == 0


@pytest.mark.asyncio
async def test_run_simulation_marks_unexposed_action():
    """The what-if preview marks an action whose service isn't exposed, matching
    what the live trace would show (it's skipped at dispatch)."""
    scenes = [
        {
            "category": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "fan.toggle", "entity_ids": ["fan.k"], "params": {}}],
        }
    ]
    # fan.toggle is not in the exposed set → flagged.
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, _applied = await run_simulation(hass, "area", "kitchen", "g1", world)

    assert result["outcome"] == "acted"
    assert result["actions"][0]["unexposed"] is True


@pytest.mark.asyncio
async def test_run_simulation_reports_no_op_for_no_action_winner():
    """A winning scene with no actions (a blocker) reports NO_OP, consistent with
    the engine — not ACTED."""
    scenes = [
        {
            "category": "g1",
            "name": "Blocker",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, _applied = await run_simulation(hass, "area", "kitchen", "g1", world)

    assert result["outcome"] == "no_op"
    assert result["winner_name"] == "Blocker"


@pytest.mark.asyncio
async def test_run_simulation_reports_no_match():
    scenes = [
        {
            "category": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={})  # motion stays off
    result, _applied = await run_simulation(hass, "area", "kitchen", "g1", world)
    assert result["outcome"] == "no_match"
    assert result["winner_name"] is None


@pytest.mark.asyncio
async def test_run_simulation_debounces_same_winner():
    """Re-winning the same scene (prev_applied == winner) is DEBOUNCED with no
    actions recorded — matching production's non-reapply."""
    scenes = [
        {
            "category": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, applied = await run_simulation(hass, "area", "kitchen", "g1", world, prev_applied=0)

    assert result["outcome"] == "debounced"
    assert result["winner_name"] == "Motion on"
    assert result["actions"] == []
    assert applied == 0


@pytest.mark.asyncio
async def test_run_simulation_apply_always_reasserts_on_same_winner():
    scenes = [
        {
            "category": "g1",
            "name": "Always on",
            "apply": "always",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, applied = await run_simulation(hass, "area", "kitchen", "g1", world, prev_applied=0)

    assert result["outcome"] == "acted"
    assert result["actions"]  # actions re-asserted
    assert applied == 0


@pytest.mark.asyncio
async def test_run_simulation_blocker_is_transparent_to_applied():
    """A pure blocker (no-action winner) reports NO_OP and leaves prev_applied
    untouched, so a later re-win of the prior scene still debounces."""
    scenes = [
        {
            "category": "g1",
            "name": "Blocker",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.motion": {"state": "on"}})
    result, applied = await run_simulation(hass, "area", "kitchen", "g1", world, prev_applied=7)

    assert result["outcome"] == "no_op"
    assert applied == 7  # transparent


@pytest.mark.asyncio
async def test_run_simulation_no_match_forgets_applied():
    scenes = [
        {
            "category": "g1",
            "name": "Motion on",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
            "actions": [{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {}}],
        }
    ]
    hass = _resolve_hass(scenes, [_State("binary_sensor.motion", "off")])
    world = SimulatedWorld(now=FIXED, overrides={})  # motion stays off -> no match
    result, applied = await run_simulation(hass, "area", "kitchen", "g1", world, prev_applied=0)

    assert result["outcome"] == "no_match"
    assert applied is None  # forgotten


# ---------------------------------------------------------------------------
# Task 3: verdict overrides for opaque conditions
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_build_simulated_snapshots_uses_verdicts_for_script():
    called = {"snapshot": False}

    class _Spy(ScriptCondition):
        async def snapshot(self, hass, *, now=None):  # must NOT be called
            called["snapshot"] = True
            raise AssertionError("real script snapshot should not run under verdicts")

    hass = _Hass([])
    hass.data[DOMAIN] = {DATA_CONDITIONS: {"script": _Spy(hass)}}
    key = _cache_key("script.holiday", {})
    world = SimulatedWorld(now=FIXED, overrides={}, verdicts={"script": {key: True}})

    snaps = await build_simulated_snapshots(hass, world)
    assert called["snapshot"] is False
    assert snaps["script"].results == {key: True}


# ---------------------------------------------------------------------------
# Task 4: simulate_inputs_entities
# ---------------------------------------------------------------------------


def test_simulate_inputs_excludes_time_derived_entities():
    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]},
                "day": {"include": [{"kind": "workday"}]},
            },
        }
    ]
    from custom_components.ambience.conditions.day import DayCondition
    from custom_components.ambience.conditions.state import StateCondition

    hass = _Hass([_State("binary_sensor.motion", "off")])

    class _Store2:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            if name == "day":
                return {"workday_sensor": "binary_sensor.workday", "workday_calendar": None}
            if name == "weather":
                return {"entity": None, "categories": []}
            return {}

    hass.data[DOMAIN] = {
        DATA_CONDITIONS: {"state": StateCondition(hass), "day": DayCondition(hass)},
        DATA_STORE: _Store2(),
    }
    result = simulate_inputs_entities(hass, "area", "kitchen", "g1")
    ids = [k["entity_id"] for k in result]
    assert ids == ["binary_sensor.motion"]  # workday sensor excluded (day condition)


def test_simulate_inputs_control_kinds():
    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {"kind": "is", "entity_id": "binary_sensor.motion", "states": ["on"]}
            },
        },
        {
            "category": "g1",
            "when": {"state": {"kind": "is", "entity_id": "sensor.count", "states": ["2.0"]}},
        },
    ]
    from custom_components.ambience.conditions.state import StateCondition

    hass = _Hass([_State("binary_sensor.motion", "off"), _State("sensor.count", "2.0")])

    class _Store3:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass.data[DOMAIN] = {DATA_CONDITIONS: {"state": StateCondition(hass)}, DATA_STORE: _Store3()}
    knobs = {k["entity_id"]: k for k in simulate_inputs_entities(hass, "area", "kitchen", "g1")}
    assert knobs["binary_sensor.motion"]["control"] == "select"
    assert knobs["binary_sensor.motion"]["options"] == ["on", "off"]
    assert knobs["sensor.count"]["control"] == "number"
    assert "options" not in knobs["sensor.count"]


def test_simulate_inputs_surfaces_state_referenced_attributes():
    """Attributes read by a state predicate (string via is/is_not, numeric via
    >/< ops) become editable sub-rows with the right control."""
    from custom_components.ambience.conditions.state import StateCondition

    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {
                    "kind": "and",
                    "items": [
                        {
                            "kind": "is",
                            "entity_id": "calendar.work",
                            "attribute": "description",
                            "states": ["xxx"],
                        },
                        {
                            "kind": ">",
                            "entity_id": "sensor.dev",
                            "attribute": "battery",
                            "states": ["20"],
                        },
                    ],
                }
            },
        }
    ]
    hass = _Hass(
        [
            _State("calendar.work", "off", {"description": "today"}),
            _State("sensor.dev", "5", {"battery": 80}),
        ]
    )

    class _Store6:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass.data[DOMAIN] = {DATA_CONDITIONS: {"state": StateCondition(hass)}, DATA_STORE: _Store6()}
    knobs = {k["entity_id"]: k for k in simulate_inputs_entities(hass, "area", "kitchen", "g1")}
    assert {"name": "description", "control": "text", "live_value": "today"} in knobs[
        "calendar.work"
    ]["attributes"]
    assert {"name": "battery", "control": "number", "live_value": 80} in knobs["sensor.dev"][
        "attributes"
    ]


def test_simulate_inputs_attribute_with_known_values_becomes_a_select():
    """A string attribute backed by a companion option-list (e.g. a remote's
    `current_activity` reading `activity_list`) becomes a select knob seeded with
    those values — the same lookup the scene editor's value dropdown uses — rather
    than a free-text field."""
    from custom_components.ambience.conditions.state import StateCondition

    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {
                    "kind": "is",
                    "entity_id": "remote.cine",
                    "attribute": "current_activity",
                    "states": ["Nvidia (Projector)"],
                }
            },
        }
    ]
    hass = _Hass(
        [
            _State(
                "remote.cine",
                "on",
                {
                    "current_activity": "Nvidia (Projector)",
                    "activity_list": ["PowerOff", "Nvidia (Projector)", "Watch Apple TV"],
                },
            )
        ]
    )

    class _Store7:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass.data[DOMAIN] = {DATA_CONDITIONS: {"state": StateCondition(hass)}, DATA_STORE: _Store7()}
    knobs = {k["entity_id"]: k for k in simulate_inputs_entities(hass, "area", "lounge", "g1")}
    assert {
        "name": "current_activity",
        "control": "select",
        "live_value": "Nvidia (Projector)",
        "options": ["PowerOff", "Nvidia (Projector)", "Watch Apple TV"],
    } in knobs["remote.cine"]["attributes"]


def test_simulate_inputs_attribute_without_an_option_list_stays_free_text():
    """A string attribute with no companion list (only its current value is
    knowable) stays a free-text field — a single-option native select would
    trap the user on the live value with no way to type a different one."""
    from custom_components.ambience.conditions.state import StateCondition

    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {
                    "kind": "is",
                    "entity_id": "calendar.work",
                    "attribute": "message",
                    "states": ["Standup"],
                }
            },
        }
    ]
    hass = _Hass([_State("calendar.work", "on", {"message": "Standup"})])

    class _Store8:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass.data[DOMAIN] = {DATA_CONDITIONS: {"state": StateCondition(hass)}, DATA_STORE: _Store8()}
    knobs = {k["entity_id"]: k for k in simulate_inputs_entities(hass, "area", "office", "g1")}
    attr = next(a for a in knobs["calendar.work"]["attributes"] if a["name"] == "message")
    assert attr["control"] == "text"
    assert "options" not in attr


# ---------------------------------------------------------------------------
# New characterization tests for previously uncovered lines
# ---------------------------------------------------------------------------


# --- _in_domain (lines 83-87) ---


def test_in_domain_with_string_domain_match():
    """_in_domain returns True when entity prefix equals the string domain."""
    assert _in_domain("sensor.temperature", "sensor") is True


def test_in_domain_with_string_domain_no_match():
    """_in_domain returns False when entity prefix differs from the string domain."""
    assert _in_domain("sensor.temperature", "binary_sensor") is False


def test_in_domain_with_list_domain_match():
    """_in_domain accepts an iterable of domains and returns True if prefix is in it."""
    assert _in_domain("light.ceiling", ["light", "switch"]) is True


def test_in_domain_with_list_domain_no_match():
    """_in_domain returns False when the entity's domain is not in the list."""
    assert _in_domain("light.ceiling", ["sensor", "binary_sensor"]) is False


# --- _SimulatedStates.async_all domain filtering (branch 75->74) ---


def test_simulated_states_async_all_excludes_override_outside_domain():
    """async_all with a domain filter skips overrides whose entity is in a different domain."""

    class _FakeState:
        def __init__(self, entity_id, state):
            self.entity_id = entity_id
            self.state = state

    class _RealStates:
        def async_all(self, domain=None):
            return [_FakeState("light.living", "on")]

    # Override is binary_sensor domain; we're asking for light domain only.
    overrides = {"binary_sensor.motion": _FakeState("binary_sensor.motion", "on")}
    sim_states = _SimulatedStates(_RealStates(), overrides)
    result = sim_states.async_all(domain="light")
    ids = [s.entity_id for s in result]
    assert "binary_sensor.motion" not in ids
    assert "light.living" in ids


# --- _SimulatedHass.__getattr__ (line 98) ---


def test_simulated_hass_getattr_delegates_to_real():
    """Attributes not on _SimulatedHass are transparently forwarded to the real hass."""

    class _RealHass:
        config = "real_config"

        def custom_method(self):
            return "from_real"

    class _FakeStates:
        pass

    sim = _SimulatedHass(_RealHass(), _FakeStates())
    assert sim.config == "real_config"
    assert sim.custom_method() == "from_real"


# --- _build_override_states: sun.sun already overridden (branch 111->113) ---


@pytest.mark.asyncio
async def test_build_simulated_snapshots_honours_explicit_sun_override():
    """When the caller overrides sun.sun directly the synthetic sun is NOT injected."""
    hass = _Hass([])
    world = SimulatedWorld(
        now=FIXED,
        overrides={"sun.sun": {"state": "above_horizon", "attributes": {"elevation": 45.0}}},
    )
    snaps = await build_simulated_snapshots(hass, world)
    sun = snaps["recording"]["sun"]
    assert sun is not None
    assert sun.state == "above_horizon"
    assert sun.attributes.get("elevation") == 45.0


# --- _verdict_snapshot: template path and unknown key raise (lines 123-125) ---


def test_verdict_snapshot_template_returns_template_snapshot():
    """_verdict_snapshot('template', ...) returns a TemplateSnapshot with the given results."""
    from custom_components.ambience.conditions.template import TemplateSnapshot

    snap = _verdict_snapshot("template", {"tmpl_key": True})
    assert isinstance(snap, TemplateSnapshot)
    assert snap.results == {"tmpl_key": True}


def test_verdict_snapshot_unknown_key_raises():
    """_verdict_snapshot raises AmbienceError for an unrecognised condition key."""
    with pytest.raises(AmbienceError) as exc_info:
        _verdict_snapshot("unknown_opaque", {})
    assert exc_info.value.translation_key == "no_verdict_snapshot"
    assert exc_info.value.translation_placeholders == {"condition_key": "unknown_opaque"}


# --- build_simulated_snapshots: snapshot exception degrades to None (lines 148-149) ---


@pytest.mark.asyncio
async def test_build_simulated_snapshots_degraded_on_exception():
    """A condition whose snapshot() raises is stored as None and a warning is emitted."""

    class _FailingCondition:
        name = "failing"

        async def snapshot(self, hass, *, now=None, entities=None):
            raise RuntimeError("snapshot boom")

    hass = _Hass([])
    hass.data[DOMAIN] = {DATA_CONDITIONS: {"failing": _FailingCondition()}}
    world = SimulatedWorld(now=FIXED)
    snaps = await build_simulated_snapshots(hass, world)
    assert snaps["failing"] is None


# --- _record_attr: text wins over number (branch 176->exit) ---


def test_record_attr_text_control_is_not_overwritten_by_number():
    """Once an attribute is recorded as 'text', a subsequent 'number' write is ignored."""
    out: dict = {}
    _record_attr(out, "sensor.x", "value", "number")
    assert out["sensor.x"]["value"] == "number"
    _record_attr(out, "sensor.x", "value", "text")
    assert out["sensor.x"]["value"] == "text"
    # 'number' must NOT overwrite 'text'
    _record_attr(out, "sensor.x", "value", "number")
    assert out["sensor.x"]["value"] == "text"


# --- _collect_state_attributes: 'not' node (lines 191-192) ---


def test_collect_state_attributes_not_node():
    """A 'not' node recurses into its 'item' and collects attributes there."""
    out: dict = {}
    _collect_state_attributes(
        {
            "kind": "not",
            "item": {
                "kind": "is",
                "entity_id": "sensor.x",
                "attribute": "battery",
                "states": ["100"],
            },
        },
        out,
    )
    assert out == {"sensor.x": {"battery": "text"}}


# --- _referenced_attributes: weather threshold without attribute key (branch 214->213) ---


def test_referenced_attributes_skips_threshold_without_attribute():
    """A weather threshold dict lacking an 'attribute' key produces no attribute entry."""

    scenes = [
        {
            "category": "g1",
            "when": {
                # threshold has no 'attribute' key — must be silently skipped
                "weather": {"thresholds": [{"op": "<", "value": 10}]}
            },
        }
    ]
    hass = _inputs_hass(scenes, [_State("weather.home", "sunny")], weather_entity="weather.home")
    result = simulate_inputs_entities(hass, "area", "kitchen", "g1")
    weather_knob = next(k for k in result if k.get("entity_id") == "weather.home")
    # No attributes emitted because the threshold had no 'attribute' key.
    assert weather_knob["attributes"] == []


# --- _is_number: None input returns False (line 238) ---


def test_is_number_none_returns_false():
    """_is_number(None) must return False without raising."""
    assert _is_number(None) is False


# --- _entity_knob: text fallback (line 269) ---


def test_entity_knob_falls_back_to_text_when_no_state_and_no_options():
    """Entity with no live state and no known options (known_states_for returns []) uses 'text'."""

    scenes = [
        {
            "category": "g1",
            "when": {
                "state": {
                    "kind": "is",
                    "entity_id": "sensor.mystery",
                    "states": ["hello"],
                }
            },
        }
    ]
    # No live state → known_states_for returns [] → no categorical, live_state=None
    # → _is_number(None) is False → falls through to "text" branch (line 269).
    hass = _inputs_hass(scenes, [])  # entity not in live states at all
    knobs = simulate_inputs_entities(hass, "area", "kitchen", "g1")
    knob = next(k for k in knobs if k["entity_id"] == "sensor.mystery")
    assert knob["control"] == "text"
    assert "options" not in knob


# --- _verdict_identity: template path (line 319) ---


@pytest.mark.asyncio
async def test_verdict_knobs_template_has_no_entity_id():
    """A template verdict knob uses the scene name as its label and has no entity_id."""
    from custom_components.ambience.conditions.template import TemplateCondition, TemplateSnapshot

    class _TemplateStub(TemplateCondition):
        async def snapshot(self, hass, *, now=None):
            return TemplateSnapshot(results={})

    scenes = [
        {
            "category": "g1",
            "name": "Is daytime",
            "when": {"template": {"template": "{{ true }}"}},
        }
    ]

    class _StoreT:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass = _Hass([])
    hass.data[DOMAIN] = {
        # Pass hass=None so TemplateCondition.trigger_deps skips rendering
        # (returns TriggerSpec(opaque=True)) and avoids a real HA hass fixture.
        DATA_CONDITIONS: {"template": _TemplateStub(None)},
        DATA_STORE: _StoreT(),
    }
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    verdicts = [k for k in result["knobs"] if k["kind"] == "verdict"]
    assert len(verdicts) == 1
    v = verdicts[0]
    assert v["condition"] == "template"
    assert "entity_id" not in v
    assert v["label"] == "Is daytime"


# --- _verdict_knobs: snapshot exception path (lines 333-335) ---


@pytest.mark.asyncio
async def test_verdict_knobs_live_snapshot_failure_defaults_to_false():
    """When a live verdict snapshot() raises, the knob's live_value defaults to False."""
    from custom_components.ambience.conditions.script import ScriptCondition

    class _FailingScript(ScriptCondition):
        async def snapshot(self, hass, *, now=None):
            raise RuntimeError("verdict snapshot failed")

    scenes = [
        {
            "category": "g1",
            "name": "Holiday",
            "when": {"script": {"script": "script.holiday"}},
        }
    ]

    class _StoreV:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass = _Hass([])
    hass.data[DOMAIN] = {
        DATA_CONDITIONS: {"script": _FailingScript(hass)},
        DATA_STORE: _StoreV(),
    }
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    verdicts = [k for k in result["knobs"] if k["kind"] == "verdict"]
    assert len(verdicts) == 1
    assert verdicts[0]["live_value"] is False


# --- _verdict_knobs: dedup of duplicate (name, key) pairs (line 347) ---


@pytest.mark.asyncio
async def test_verdict_knobs_deduplicates_same_predicate_across_scenes():
    """The same opaque predicate appearing in two scenes produces only one verdict knob."""
    from custom_components.ambience.conditions.script import (
        ScriptCondition,
        ScriptSnapshot,
        _cache_key,
    )

    class _ScriptStub(ScriptCondition):
        async def snapshot(self, hass, *, now=None):
            return ScriptSnapshot(results={_cache_key("script.holiday", {}): True})

    shared_key = _cache_key("script.holiday", {})
    scenes = [
        {"category": "g1", "name": "Scene A", "when": {"script": {"script": "script.holiday"}}},
        {"category": "g1", "name": "Scene B", "when": {"script": {"script": "script.holiday"}}},
    ]

    class _StoreD:
        def scope_config(self, sk, si):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {"entity": None, "groups": []} if name == "weather" else {}

    hass = _Hass([])
    hass.data[DOMAIN] = {
        DATA_CONDITIONS: {"script": _ScriptStub(hass)},
        DATA_STORE: _StoreD(),
    }
    result = await simulate_inputs(hass, "area", "kitchen", "g1")
    verdicts = [k for k in result["knobs"] if k["kind"] == "verdict"]
    # Both scenes reference the same script → only one knob.
    assert len(verdicts) == 1
    assert verdicts[0]["key"] == shared_key


# --- _safe_category_name: exception returns None (lines 397-398) ---


def test_safe_category_name_returns_none_on_broken_store():
    """_safe_category_name returns None rather than propagating exceptions from the store."""

    class _RaisingData:
        """Raises on any attribute access so category_names() itself throws."""

        def get(self, key, default=None):  # noqa: ANN001
            raise RuntimeError("store exploded")

        def __getitem__(self, key):  # noqa: ANN001
            raise RuntimeError("store exploded")

    class _BrokenHass:
        def __init__(self):
            self.data = _RaisingData()

    assert _safe_category_name(_BrokenHass(), "g1") is None


# ---------------------------------------------------------------------------
# Simulator: the what-if simulator honours the `unavailable` condition.
# Mirrors the run_simulation pattern used for 'state' scenes above.
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_run_simulation_unavailable_condition_matches_when_entity_unavailable():
    """An `unavailable` guard wins in the simulator when the overridden entity
    is set to 'unavailable' — confirming the condition integrates end-to-end
    through build_simulated_snapshots and run_simulation."""
    from custom_components.ambience.conditions.unavailable import UnavailableCondition

    scenes = [
        {
            "category": "g1",
            "name": "Sensor down",
            "when": {"unavailable": {"entities": ["binary_sensor.x"]}},
            "actions": [],  # guard — no actions; outcome is no_op when it wins
        }
    ]

    class _UnavailStore:
        def scope_config(self, scope_kind, scope_id):
            return {"scenes": scenes}

        def get_condition_config(self, name):
            return {}

    hass = _Hass([_State("binary_sensor.x", "on")])  # live state is "on" (available)
    hass.data[DOMAIN] = {
        DATA_CONDITIONS: {"unavailable": UnavailableCondition(hass=hass)},
        DATA_STORE: _UnavailStore(),
    }

    # Override the entity to "unavailable" in the simulated world.
    world = SimulatedWorld(now=FIXED, overrides={"binary_sensor.x": {"state": "unavailable"}})
    result, _applied = await run_simulation(hass, "area", "kitchen", "g1", world)

    # The guard wins (no_op because it has no actions), confirming the condition matched.
    assert result["outcome"] == "no_op"
    assert result["winner_name"] == "Sensor down"
    assert result["explanation"]["scenes"][0]["matched"] is True


# ---------------------------------------------------------------------------
# Task 1: _simulate_outcome debounce decision helper
# ---------------------------------------------------------------------------


def test_simulate_outcome_first_win_acts_and_remembers():
    from custom_components.ambience.trace import Outcome

    assert _simulate_outcome(None, 5, True, None) == (Outcome.ACTED, 5)


def test_simulate_outcome_no_match_forgets():
    from custom_components.ambience.trace import Outcome

    assert _simulate_outcome(5, None, False, None) == (Outcome.NO_MATCH, None)


def test_simulate_outcome_blocker_is_no_op_and_transparent():
    from custom_components.ambience.trace import Outcome

    # winner with no actions leaves prev_applied untouched
    assert _simulate_outcome(5, 2, False, None) == (Outcome.NO_OP, 5)


def test_simulate_outcome_same_winner_debounces():
    from custom_components.ambience.trace import Outcome

    assert _simulate_outcome(5, 5, True, None) == (Outcome.DEBOUNCED, 5)
    assert _simulate_outcome(5, 5, True, "once") == (Outcome.DEBOUNCED, 5)


def test_simulate_outcome_apply_always_reasserts():
    from custom_components.ambience.trace import Outcome

    assert _simulate_outcome(5, 5, True, "always") == (Outcome.ACTED, 5)


def test_simulate_outcome_new_winner_acts():
    from custom_components.ambience.trace import Outcome

    assert _simulate_outcome(5, 2, True, None) == (Outcome.ACTED, 2)
