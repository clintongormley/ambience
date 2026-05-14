"""End-to-end: install the integration, seed the store, call the service, observe service calls."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_mock_service,
)

from custom_components.ambience.const import DATA_STORE, DOMAIN


async def _setup_with_sun(hass: HomeAssistant) -> None:
    # Mock sun.sun so TimeOfDayMatcher.snapshot succeeds
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
    on_calls = async_mock_service(hass, "light", "turn_on")
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area(
        "lr",
        {
            "scenes": ["movie"],
            "matchers": [],  # no matchers ⇒ rule matches purely on scene
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "set_light",
                            "targets": {"light.lamp": {"brightness": 30, "transition": 2}},
                        }
                    ],
                }
            ],
        },
    )

    await hass.services.async_call(
        DOMAIN,
        "apply_scene",
        {"area": "lr", "scene": "movie"},
        blocking=True,
    )

    assert len(on_calls) == 1
    assert on_calls[0].data["entity_id"] == "light.lamp"
    assert on_calls[0].data["brightness_pct"] == 30
    assert on_calls[0].data["transition"] == 2
