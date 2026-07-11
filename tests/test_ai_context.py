"""The AI context: the BOUNDED export the MCP server reads.

Unlike the AI bundle (download-and-paste, which must carry everything because the
AI on the other end has no tools), the MCP consumer has tools — so this export
carries counts, not rows, and points at ambience/entities/find, ambience/{scope}/get
and ambience/traces/list for the detail."""

from __future__ import annotations

import pytest
from homeassistant.components.diagnostics import REDACTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er

from custom_components.ambience.ai_context import build_ai_context
from custom_components.ambience.const import DATA_STORE, DOMAIN
from custom_components.ambience.store import AmbienceStore


@pytest.fixture
async def seeded_store(hass: HomeAssistant) -> AmbienceStore:
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
                    "actions": [{"service": "light.turn_on", "entity_ids": ["light.lamp"]}],
                },
                {
                    "category": "general",
                    "actions": [{"service": "light.turn_off", "entity_ids": ["light.lamp"]}],
                },
            ]
        },
    )
    hass.data[DOMAIN] = {DATA_STORE: store}
    return store


async def test_context_carries_an_entity_summary_not_entity_rows(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    area = ar.async_get(hass).async_create("Kitchen")
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create("light", "ambience", "l1", suggested_object_id="lamp")
    ent_reg.async_update_entity(entry.entity_id, area_id=area.id)
    hass.states.async_set(entry.entity_id, "on")

    context = await build_ai_context(hass)

    assert context["ambience_ai_context"] == 1
    assert "entities" not in context["catalog"]  # the 240k of rows is the whole problem
    summary = context["catalog"]["entity_summary"]
    assert summary["total"] >= 1
    assert summary["by_domain"]["light"] >= 1
    assert summary["by_area"][area.id] >= 1
    # areas/floors stay — they are provably small and scenes cannot be scoped without them
    assert any(a["area_id"] == area.id for a in context["catalog"]["areas"])
    assert "floors" in context["catalog"]


async def test_context_omits_traces(hass: HomeAssistant, seeded_store: AmbienceStore) -> None:
    # 51k chars in the fat bundle, and ambience_list_traces already serves them.
    context = await build_ai_context(hass)

    assert "traces" not in context


async def test_context_replaces_scene_lists_with_counts(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    # 51.8k of the fat bundle's 56k config is scene lists; ambience_get_scope serves them.
    context = await build_ai_context(hass)

    living_room = context["config"]["areas"]["living_room"]
    assert living_room["scene_count"] == 2
    assert "scenes" not in living_room


async def test_context_keeps_house_level_settings_verbatim(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    # get_scope does NOT serve these, so thinning must not drop them.
    context = await build_ai_context(hass)

    assert "conditions" in context["config"]
    # workday_sensor is presence-adjacent, so redact_store scrubs it — the same
    # rule the AI bundle applies (see test_ai_bundle.py's equivalent assertion).
    # Thinning must not change that; it only replaces `scenes` with a count.
    assert context["config"]["conditions"]["day"]["workday_sensor"] == REDACTED
    # A setting untouched by redaction survives byte-for-byte, proving "verbatim".
    assert context["config"]["switch_defaults"]["name"] == "Ambience"


async def test_context_carries_actions_and_definitions(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    context = await build_ai_context(hass)

    assert "exposed" in context["actions"]
    assert "schemas" in context["actions"]
    assert "categories" in context["definitions"]
    assert "periods" in context["definitions"]
    assert "lux_ranges" in context["definitions"]


async def test_context_house_scope_is_thinned_too(
    hass: HomeAssistant, seeded_store: AmbienceStore
) -> None:
    await seeded_store.async_save_house({"scenes": [{"category": "general", "actions": []}]})

    context = await build_ai_context(hass)

    assert context["config"]["house"]["scene_count"] == 1
    assert "scenes" not in context["config"]["house"]
