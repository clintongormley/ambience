"""The AI bundle: the single export an external AI consults to author and
diagnose Ambience config (entity/area catalog + exposed-action schemas +
definitions + the redacted store config + traces)."""

from __future__ import annotations

import pytest
from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr

from custom_components.ambience.ai_bundle import build_ai_bundle
from custom_components.ambience.const import DATA_STORE, DATA_TRACE_BUFFER, DOMAIN
from custom_components.ambience.store import AmbienceStore


@pytest.fixture
async def seeded_store(hass: HomeAssistant) -> AmbienceStore:
    """A loaded store with sensitive condition config and a scene."""
    store = AmbienceStore(hass)
    await store.async_load()
    await store.async_save_condition_config(
        "day",
        {"workday_sensor": "binary_sensor.workday", "workday_calendar": "calendar.work"},
    )
    await store.async_save_area(
        "living_room",
        {
            "scenes": [
                {
                    "category": "general",
                    "when": {"people": {"who": ["person.alice"], "where": "zone.work"}},
                    "actions": [
                        {
                            "service": "light.turn_on",
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


async def test_bundle_includes_area_floor_and_entity_catalog(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    area = ar.async_get(hass).async_create("Living Room")
    fr.async_get(hass).async_create("Upstairs")
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create("light", "ambience", "lamp1", suggested_object_id="lamp")
    ent_reg.async_update_entity(entry.entity_id, area_id=area.id)
    hass.states.async_set(entry.entity_id, "on", {"friendly_name": "Lamp"})

    bundle = await build_ai_bundle(hass)

    assert bundle["ambience_ai_bundle"] == 1
    assert {"area_id": area.id, "name": "Living Room"} in bundle["catalog"]["areas"]
    assert any(f["name"] == "Upstairs" for f in bundle["catalog"]["floors"])
    lamp = next(e for e in bundle["catalog"]["entities"] if e["entity_id"] == entry.entity_id)
    assert lamp["domain"] == "light"
    assert lamp["area_id"] == area.id
    assert lamp["state"] == "on"


async def test_entity_inherits_area_from_its_device(hass: HomeAssistant) -> None:
    """An entity with no explicit area still reports the area of its device, so
    the AI can place a scene action against it without the user re-mapping."""
    from homeassistant.helpers import device_registry as dr
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    store = AmbienceStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = {DATA_STORE: store}

    area = ar.async_get(hass).async_create("Kitchen")
    entry = MockConfigEntry(domain="demo")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={("demo", "dev1")},
    )
    dr.async_get(hass).async_update_device(device.id, area_id=area.id)
    ent_reg = er.async_get(hass)
    ent = ent_reg.async_get_or_create(
        "light", "demo", "k1", suggested_object_id="kitchen", device_id=device.id
    )

    bundle = await build_ai_bundle(hass)

    found = next(e for e in bundle["catalog"]["entities"] if e["entity_id"] == ent.entity_id)
    assert found["area_id"] == area.id


async def test_bundle_includes_exposed_actions(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    bundle = await build_ai_bundle(hass)

    assert isinstance(bundle["actions"]["exposed"], list)
    # Schemas is a service_id -> schema map (best-effort; service may be absent).
    assert isinstance(bundle["actions"]["schemas"], dict)


async def test_bundle_includes_definitions(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    bundle = await build_ai_bundle(hass)

    assert any(c["id"] == "general" for c in bundle["definitions"]["categories"])
    # Named-definition builtins live here so the AI sees the full vocabulary.
    assert "builtins" in bundle["definitions"]["periods"]
    assert "builtins" in bundle["definitions"]["lux_ranges"]


async def test_bundle_redacts_config_and_includes_traces(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
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

    bundle = await build_ai_bundle(hass)

    # Sensitive config is redacted with the same rules as diagnostics.
    assert bundle["config"]["conditions"]["day"]["workday_sensor"] == REDACTED
    scene = bundle["config"]["areas"]["living_room"]["scenes"][0]
    assert scene["when"]["people"]["who"] == REDACTED
    # Traces ride along for diagnosis.
    assert any(t["scope_id"] == "living_room" for t in bundle["traces"])
    assert "person.alice" not in str(bundle["traces"])


async def test_bundle_does_not_mutate_store(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    await build_ai_bundle(hass)

    assert seeded_store.get_condition_config("day")["workday_sensor"] == "binary_sensor.workday"


async def test_catalog_redacts_presence_entity_state(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    """A person/device_tracker entity's id stays visible (the AI needs it to author
    people conditions), but its live state is its current location — that must be
    redacted, like the diagnostics path scrubs presence PII."""
    ent_reg = er.async_get(hass)
    person = ent_reg.async_get_or_create("person", "demo", "alice", suggested_object_id="alice")
    tracker = ent_reg.async_get_or_create(
        "device_tracker", "demo", "phone", suggested_object_id="alice_phone"
    )
    hass.states.async_set(person.entity_id, "home")
    hass.states.async_set(tracker.entity_id, "Secret Work Zone")
    light = ent_reg.async_get_or_create("light", "demo", "l", suggested_object_id="lamp")
    hass.states.async_set(light.entity_id, "on")

    bundle = await build_ai_bundle(hass)
    by_id = {e["entity_id"]: e for e in bundle["catalog"]["entities"]}

    # The ids survive (needed for authoring), the location state does not.
    assert person.entity_id in by_id
    assert by_id[person.entity_id]["state"] == REDACTED
    assert by_id[tracker.entity_id]["state"] == REDACTED
    # A non-presence entity keeps its state.
    assert by_id[light.entity_id]["state"] == "on"
    assert "Secret Work Zone" not in str(bundle["catalog"])


async def test_entities_skip_disabled_and_report_null_area(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    ent_reg = er.async_get(hass)
    free = ent_reg.async_get_or_create("light", "ambience", "free", suggested_object_id="free")
    disabled = ent_reg.async_get_or_create("light", "ambience", "dis", suggested_object_id="dis")
    ent_reg.async_update_entity(disabled.entity_id, disabled_by=er.RegistryEntryDisabler.USER)

    bundle = await build_ai_bundle(hass)
    ids = {e["entity_id"] for e in bundle["catalog"]["entities"]}

    assert free.entity_id in ids
    assert disabled.entity_id not in ids
    found = next(e for e in bundle["catalog"]["entities"] if e["entity_id"] == free.entity_id)
    assert found["area_id"] is None


async def test_action_schemas_dedupe_and_skip_non_string_ids(
    hass: HomeAssistant, seeded_store: AmbienceStore, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.ambience import ai_bundle

    monkeypatch.setattr(
        seeded_store,
        "get_exposed_actions",
        lambda: [{"id": "light.turn_on"}, {"id": "light.turn_on"}, {"id": 123}, {"no_id": 1}],
    )

    async def fake_schema(_hass: HomeAssistant, _service: str) -> dict:
        return {"fields": {}}

    monkeypatch.setattr(ai_bundle, "get_service_schema", fake_schema)

    bundle = await ai_bundle.build_ai_bundle(hass)

    # Duplicate id collapsed to one; the non-string id and the id-less entry skipped.
    assert list(bundle["actions"]["schemas"]) == ["light.turn_on"]


async def test_action_schemas_tolerate_fetch_errors(
    hass: HomeAssistant, seeded_store: AmbienceStore, monkeypatch: pytest.MonkeyPatch
) -> None:
    from custom_components.ambience import ai_bundle

    monkeypatch.setattr(seeded_store, "get_exposed_actions", lambda: [{"id": "light.turn_on"}])

    async def boom(_hass: HomeAssistant, _service: str) -> dict:
        raise RuntimeError("service registry exploded")

    monkeypatch.setattr(ai_bundle, "get_service_schema", boom)

    bundle = await ai_bundle.build_ai_bundle(hass)

    # A bad service is omitted, not fatal.
    assert bundle["actions"]["schemas"] == {}


async def test_bundle_redacts_partial_presence_cause(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    """A presence cause missing one of old/new must still scrub the fields it has."""
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
            TriggerCause(kind="entity", entity_id="person.alice", old=None, new="home"),
            [UnitTrace("area", "living_room", "general", "on", Outcome.ACTED, None)],
            event_id="p",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer

    cause = (await build_ai_bundle(hass))["traces"][0]["cause"]
    assert cause["entity_id"] == REDACTED
    assert cause["new"] == REDACTED
