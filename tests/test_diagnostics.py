"""Diagnostics dump for the Ambience integration."""

from __future__ import annotations

import pytest
from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.diagnostics import (
    async_get_config_entry_diagnostics,
    async_get_device_diagnostics,
)
from custom_components.ambience.store import AmbienceStore


@pytest.fixture
async def seeded_store(hass: HomeAssistant) -> AmbienceStore:
    """A store populated with scenes and condition config carrying sensitive data."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_condition_config(
        "day",
        {"workday_sensor": "binary_sensor.workday", "workday_calendar": "calendar.work"},
    )
    await store.async_save_condition_config("weather", {"entity": "weather.home", "groups": []})
    await store.async_save_area(
        "living_room",
        {
            "scenes": [
                {
                    "category": "general",
                    "when": {
                        "people": {"who": ["person.alice"], "where": "zone.work"},
                        "template": {"template": "{{ is_state('person.bob', 'home') }}"},
                    },
                    "actions": [
                        {
                            "action": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 30},
                        }
                    ],
                }
            ]
        },
    )
    hass.data[DOMAIN] = {DATA_STORE: store}
    return store


async def test_config_entry_diagnostics_dumps_full_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    # Full store is dumped: structure and non-sensitive content survive.
    assert "living_room" in result["areas"]
    scene = result["areas"]["living_room"]["scenes"][0]
    assert scene["category"] == "general"
    assert scene["actions"][0]["entity_ids"] == ["light.lamp"]
    assert scene["actions"][0]["params"] == {"brightness_pct": 30}


async def test_config_entry_diagnostics_redacts_sensitive_keys(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    assert result["conditions"]["day"]["workday_sensor"] == REDACTED
    assert result["conditions"]["day"]["workday_calendar"] == REDACTED
    assert result["conditions"]["weather"]["entity"] == REDACTED

    when = result["areas"]["living_room"]["scenes"][0]["when"]
    assert when["people"]["who"] == REDACTED
    assert when["people"]["where"] == REDACTED
    # The template condition's predicate key is itself `template`, so the whole
    # predicate value is redacted (the key — i.e. that a template scene exists —
    # still survives).
    assert when["template"] == REDACTED


async def test_diagnostics_redacts_security_action_params(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    """A lock/alarm code authored into a scene action is scrubbed from the dump."""
    await seeded_store.async_save_area(
        "hallway",
        {
            "scenes": [
                {
                    "category": "general",
                    "when": {},
                    "actions": [
                        {
                            "service": "lock.unlock",
                            "entity_ids": ["lock.front"],
                            "params": {"code": "4321"},
                        }
                    ],
                }
            ]
        },
    )

    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    action = result["areas"]["hallway"]["scenes"][0]["actions"][0]
    assert action["params"]["code"] == REDACTED
    assert action["entity_ids"] == ["lock.front"]
    assert "4321" not in str(result)


async def test_diagnostics_redacts_exposed_action_defaults(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    seeded_store._data["exposed_actions"] = [
        {
            "id": "notify.mobile",
            "visible_fields": [],
            "defaults": {"data": {"token": "SECRET-TOKEN"}},
        },
    ]

    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    entry = next(e for e in result["exposed_actions"] if e["id"] == "notify.mobile")
    assert entry["defaults"]["data"] == REDACTED
    assert "SECRET-TOKEN" not in str(result)


async def test_config_entry_diagnostics_does_not_mutate_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    await async_get_config_entry_diagnostics(hass, mock_config_entry)

    # Redaction must operate on a copy — the live store keeps its real values.
    assert seeded_store.get_condition_config("day")["workday_sensor"] == "binary_sensor.workday"


async def test_config_entry_diagnostics_includes_traces(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None)],
            event_id="abc",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    assert "traces" in result
    assert any(t["scope_id"] == "living_room" for t in result["traces"])
    assert result["traces"][0]["cause"]["kind"] == "reloaded"


async def test_scope_diagnostics_bundles_config_context_and_traces(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.diagnostics import scope_diagnostics
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [
                UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None),
                UnitTrace("area", "other", "general", "on", Outcome.ACTED, None),
            ],
            event_id="abc",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = scope_diagnostics(hass, "area", "living_room", "general")

    assert result["scope"]["scope_kind"] == "area"
    assert result["scope"]["scope_id"] == "living_room"
    assert "scenes" in result["scope"]["config"]
    assert "categories" in result["context"]
    assert "conditions" in result["context"]
    # Only this scope+category's traces are included.
    assert len(result["traces"]) == 1
    assert result["traces"][0]["scope_id"] == "living_room"


async def test_scope_diagnostics_house_scope(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.diagnostics import scope_diagnostics
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [
                UnitTrace("house", None, "general", "on", Outcome.ACTED, None),
                UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None),
            ],
            event_id="xyz",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = scope_diagnostics(hass, "house", None, "general")

    assert result["scope"]["scope_kind"] == "house"
    assert result["scope"]["scope_id"] is None
    assert "scenes" in result["scope"]["config"]
    # Only the house unit must be included — the area unit is filtered out.
    assert len(result["traces"]) == 1
    assert result["traces"][0]["scope_id"] is None


async def test_scope_diagnostics_does_not_mutate_store(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    """scope_diagnostics redacts the LIVE scope_config() reference (not a deep
    copy, unlike the full-store dump), so it must build copies and never mutate
    the store — the redacted output blanks secrets while the store keeps them."""
    from custom_components.ambience.diagnostics import scope_diagnostics

    await seeded_store.async_save_area(
        "hallway",
        {
            "scenes": [
                {
                    "category": "general",
                    "when": {},
                    "actions": [
                        {
                            "service": "lock.unlock",
                            "entity_ids": ["lock.front"],
                            "params": {"code": "4321"},
                        }
                    ],
                }
            ]
        },
    )

    result = scope_diagnostics(hass, "area", "hallway", "general")

    assert result["scope"]["config"]["scenes"][0]["actions"][0]["params"]["code"] == REDACTED
    # The live store still holds the real code — redaction copied, never mutated.
    live = seeded_store.scope_config("area", "hallway")
    assert live["scenes"][0]["actions"][0]["params"]["code"] == "4321"


async def test_device_diagnostics_dumps_redacted_store(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    mock_config_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=mock_config_entry.entry_id,
        identifiers={(DOMAIN, "ambience")},
    )

    result = await async_get_device_diagnostics(hass, mock_config_entry, device)

    assert "living_room" in result["areas"]
    assert result["conditions"]["day"]["workday_sensor"] == REDACTED


async def test_diagnostics_traces_redact_presence_pii(
    hass: HomeAssistant, mock_config_entry: MockConfigEntry, seeded_store: AmbienceStore
) -> None:
    """The structured who/where/template keys are redacted, but the same PII
    also rides in free text: person/device_tracker causes carry zone names in
    old/new, and people/template predicate `detail` strings render each
    person's location. A diagnostics dump attached to a GitHub issue must not
    publish the household's presence history."""
    from custom_components.ambience.const import DATA_TRACE_BUFFER
    from custom_components.ambience.engine import Explanation, PredicateResult, SceneEval
    from custom_components.ambience.trace import (
        BufferSink,
        Outcome,
        TraceEvent,
        TriggerCause,
        UnitTrace,
    )

    explanation = Explanation(
        winner_index=0,
        scenes=[
            SceneEval(
                index=0,
                name="evening",
                matched=True,
                evaluated=True,
                disabled=False,
                predicates=[
                    PredicateResult(
                        "people", True, "Alice: home ✓ … want any at home", ("person.alice",)
                    ),
                    PredicateResult("template", True, "rendered → True"),
                    PredicateResult("time_of_day", True, "evening"),
                    PredicateResult("occupancy", True, "Hall: on ✓", ("binary_sensor.hall",)),
                ],
            )
        ],
    )
    buffer = BufferSink()
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="entity", entity_id="person.alice", old="home", new="Secret Zone"),
            [UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, explanation)],
            event_id="abc",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    result = await async_get_config_entry_diagnostics(hass, mock_config_entry)

    trace = result["traces"][0]
    assert trace["cause"]["entity_id"] == REDACTED
    assert trace["cause"]["old"] == REDACTED
    assert trace["cause"]["new"] == REDACTED
    preds = {p["condition_key"]: p for p in trace["explanation"]["scenes"][0]["predicates"]}
    assert preds["people"]["detail"] == REDACTED
    assert preds["template"]["detail"] == REDACTED
    # Presence-revealing entity_ids are scrubbed too (person./device_tracker.),
    # the same identifiers the cause scrub removes — they ride in the new
    # per-predicate entity_ids list.
    assert preds["people"]["entity_ids"] == [REDACTED]
    # Non-presence details and entity_ids stay useful for debugging.
    assert preds["time_of_day"]["detail"] == "evening"
    assert preds["occupancy"]["entity_ids"] == ["binary_sensor.hall"]
    assert "person.alice" not in str(result)
    assert "Secret Zone" not in str(result)
