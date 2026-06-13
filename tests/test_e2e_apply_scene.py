"""End-to-end: install the integration, seed the store, call the service, observe service calls."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    async_mock_service,
)

from custom_components.ambience.const import (
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_STORE,
    DATA_SWITCHES,
    DOMAIN,
)
from custom_components.ambience.service import async_resolve_only


async def _make_area_scope(hass: HomeAssistant, name: str = "E2E Room") -> tuple[str, str]:
    """Create a real HA area (which spawns its scope switch via the registry
    listener) and return (area_id, scope_switch_entity_id)."""
    area = ar.async_get(hass).async_create(name)
    await hass.async_block_till_done()
    switch = hass.data[DOMAIN][DATA_SWITCHES][("area", area.id)]
    return area.id, switch.entity_id


async def _setup_with_sun(hass: HomeAssistant) -> None:
    # Mock sun.sun so TimeOfDayCondition.snapshot succeeds
    now = datetime.now(UTC)
    hass.states.async_set(
        "sun.sun",
        "above_horizon",
        {
            "next_rising": (now + timedelta(hours=1)).isoformat(),
            "next_setting": (now + timedelta(hours=12)).isoformat(),
            "next_dawn": (now + timedelta(minutes=30)).isoformat(),
            "next_dusk": (now + timedelta(hours=13)).isoformat(),
            "next_noon": (now + timedelta(hours=6)).isoformat(),
            "next_midnight": (now + timedelta(hours=18)).isoformat(),
        },
    )


@pytest.fixture
async def installed(hass: HomeAssistant, mock_config_entry: MockConfigEntry) -> MockConfigEntry:
    await _setup_with_sun(hass)
    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()
    return mock_config_entry


async def test_service_call_invokes_light_turn_on(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    # Pre-expose the service the scene will reference.
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct", "transition"],
                "defaults": {},
            }
        ]
    )
    area_id, _ = await _make_area_scope(hass)
    await store.async_save_area(
        area_id,
        {
            "conditions": [],
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},  # wildcard scene ⇒ always matches
                    "actions": [
                        {
                            "service": "light.turn_on",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness_pct": 30, "transition": 2.0},
                        }
                    ],
                }
            ],
        },
    )
    # Register the mock after seeding so a debounced engine auto-apply (if any)
    # isn't counted; only the explicit service call below should fire it.
    on_calls = async_mock_service(hass, "light", "turn_on")

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"scope": [f"area:{area_id}"]},
        blocking=True,
    )

    assert len(on_calls) == 1
    assert on_calls[0].data["entity_id"] == ["light.lamp"]
    assert on_calls[0].data["brightness_pct"] == 30
    assert on_calls[0].data["transition"] == 2.0  # passed straight through


async def test_apply_scene_applies_all_categories(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """apply_scene applies every category's winner concurrently and records each."""
    from custom_components.ambience.service import async_apply_scene, get_last_applied

    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
                {
                    "category": "blinds",
                    "when": {},
                    "actions": [
                        {
                            "service": "cover.open_cover",
                            "entity_ids": ["cover.blind"],
                            "params": {},
                        }
                    ],
                },
            ],
        },
    )

    await async_apply_scene(hass, "area", "lr")

    assert get_last_applied(hass, "area", "lr", "lighting") is not None
    assert get_last_applied(hass, "area", "lr", "blinds") is not None
    assert len(light_calls) == 1
    assert len(cover_calls) == 1


async def test_time_of_day_scene_matches_for_area_without_conditions_field(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Regression: areas loaded from disk may have no per-area `conditions` field.
    All registered conditions are always active, so a scene with a time_of_day
    predicate must still resolve regardless of whether the area has a conditions key.
    """
    store = hass.data[DOMAIN][DATA_STORE]

    # Save an area WITHOUT a `conditions` key — exactly as a disk-loaded, migrated
    # area looks in production.
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "name": "all-day",
                    # Full-day range (00:00 -> 00:00) is always active regardless of
                    # the real clock, so the assertion is deterministic.
                    "when": {
                        "time_of_day": {
                            "from": {"kind": "time", "hh": 0, "mm": 0},
                            "to": {"kind": "time", "hh": 0, "mm": 0},
                        },
                    },
                    "actions": [],
                }
            ],
        },
    )

    result = await async_resolve_only(hass, "area", "lr")

    # The time_of_day condition must have been activated (snapshot captured)...
    assert "time_of_day" in result["snapshots_described"]
    # ...and the scene must match. Before the fix, no time_of_day snapshot is taken,
    # so resolve() sees no value for the predicate and the scene does not match.
    assert result["matched_scene_index"] == 0
    assert result["scene_name"] == "all-day"


async def test_apply_scene_house_target_is_clean_noop(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Calling with scope=["house"] resolves and runs (no scenes configured ⇒ a clean no-op)."""
    await hass.services.async_call(DOMAIN, "apply_scene", {"scope": ["house"]}, blocking=True)


async def test_apply_scene_rejects_unknown_area(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    from homeassistant.exceptions import ServiceValidationError

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "apply_scene", {"scope": ["area:ghost_area"]}, blocking=True
        )


async def test_apply_scene_empty_targets_all_scopes_noop(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    # No target and no configured scenes => clean no-op across every scope.
    await hass.services.async_call(DOMAIN, "apply_scene", {}, blocking=True)


async def test_apply_scene_rejects_non_admin_user(
    hass: HomeAssistant, installed: MockConfigEntry, hass_read_only_user
) -> None:
    """A non-admin user must not be able to trigger scene application."""
    from homeassistant.core import Context
    from homeassistant.exceptions import Unauthorized

    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            "apply_scene",
            {"scope": ["house"]},
            blocking=True,
            context=Context(user_id=hass_read_only_user.id),
        )


async def test_apply_scene_allows_admin_user(
    hass: HomeAssistant, installed: MockConfigEntry, hass_admin_user
) -> None:
    """An admin user may trigger scene application."""
    from homeassistant.core import Context

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"scope": ["house"]},
        blocking=True,
        context=Context(user_id=hass_admin_user.id),
    )


async def test_engine_auto_applies_state_scene_on_config_change(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Saving an auto-scene that matches current state makes the engine apply it
    (SIGNAL_CONFIG_CHANGED -> rebuild -> initial_sync), exercising the wiring."""
    calls = async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    await hass.async_block_till_done()
    # The config-change refresh is debounced; advance past the cooldown.
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert len(calls) >= 1  # the engine auto-applied the matching state scene


async def test_config_change_emits_reloaded_not_startup(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Saving a scope after setup emits a RELOADED trace, not STARTUP."""
    from custom_components.ambience.const import DATA_TRACE_BUFFER

    async_mock_service(hass, "light", "turn_on")
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}]
    )
    hass.states.async_set("binary_sensor.motion", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                }
            ]
        },
    )
    await hass.async_block_till_done()
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(seconds=1))
    await hass.async_block_till_done()
    buffer = hass.data[DOMAIN][DATA_TRACE_BUFFER]
    causes = {r.cause.kind for r in buffer.records()}
    assert "reloaded" in causes
    assert "startup" not in causes


async def test_engine_torn_down_on_unload(hass: HomeAssistant, installed: MockConfigEntry) -> None:
    hass.states.async_set("binary_sensor.motion", "on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": [
                {
                    "when": {
                        "state": {
                            "kind": "is",
                            "entity_id": "binary_sensor.motion",
                            "states": ["on"],
                        }
                    },
                    "actions": [],
                }
            ]
        },
    )
    await hass.async_block_till_done()
    engine = hass.data[DOMAIN][DATA_ENGINE]
    assert engine._unsubs  # subscribed to binary_sensor.motion
    assert await hass.config_entries.async_unload(installed.entry_id)
    await hass.async_block_till_done()
    assert engine._unsubs == []  # async_shutdown ran on unload


async def test_service_call_category_limits_to_one_category(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    exposed_store = hass.data[DOMAIN][DATA_EXPOSED_ACTIONS]
    await exposed_store.save(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            {"id": "cover.open_cover", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    area_id, _ = await _make_area_scope(hass)
    await store.async_save_area(
        area_id,
        {
            "scenes": [
                {
                    "category": "lighting",
                    "when": {},
                    "actions": [
                        {"service": "light.turn_on", "entity_ids": ["light.lamp"], "params": {}}
                    ],
                },
                {
                    "category": "blinds",
                    "when": {},
                    "actions": [
                        {"service": "cover.open_cover", "entity_ids": ["cover.b"], "params": {}}
                    ],
                },
            ],
        },
    )
    light_calls = async_mock_service(hass, "light", "turn_on")
    cover_calls = async_mock_service(hass, "cover", "open_cover")

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"scope": [f"area:{area_id}"], "category": ["lighting"]},
        blocking=True,
    )

    assert len(light_calls) == 1
    assert len(cover_calls) == 0
