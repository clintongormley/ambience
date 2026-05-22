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
from custom_components.ambience.service import async_resolve_only


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
            "matchers": [],  # no matchers ⇒ rule matches purely on scene
            "rules": [
                {
                    "when": {"scene": "movie"},
                    "actions": [
                        {
                            "action": "set_light",
                            "entity_ids": ["light.lamp"],
                            "params": {"brightness": 30, "transition": 2.0},
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
    assert on_calls[0].data["transition"] == 2.0  # passed straight through


async def test_time_of_day_rule_matches_for_area_without_matchers_field(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """Regression: areas loaded from disk have no per-area `matchers` field (it is
    dropped on migration). Matcher enablement is global. A rule with a time_of_day
    predicate must still resolve, which requires the service to source active
    matchers from store.enabled_matchers() rather than the (absent) per-area field.
    """
    store = hass.data[DOMAIN][DATA_STORE]
    # Fresh-install default seeds the global toggleable matchers.
    assert "time_of_day" in store.enabled_matchers()

    # Save an area WITHOUT a `matchers` key — exactly as a disk-loaded, migrated
    # area looks in production.
    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "name": "all-day",
                    # Full-day range (00:00 -> 00:00) is always active regardless of
                    # the real clock, so the assertion is deterministic.
                    "when": {
                        "scene": "movie",
                        "time_of_day": {
                            "from": {"kind": "time", "hh": 0, "mm": 0},
                            "to": {"kind": "time", "hh": 0, "mm": 0},
                        },
                    },
                    "actions": [],
                }
            ],
            "auto_sort": True,
        },
    )

    result = await async_resolve_only(hass, "lr", "movie")

    # The time_of_day matcher must have been activated (snapshot captured)...
    assert "time_of_day" in result["snapshots_described"]
    # ...and the rule must match. Before the fix, no time_of_day snapshot is taken,
    # so resolve() sees no value for the predicate and the rule does not match.
    assert result["matched_rule_index"] == 0
    assert result["rule_name"] == "all-day"


async def test_disabled_matcher_predicate_is_ignored(
    hass: HomeAssistant, installed: MockConfigEntry
) -> None:
    """A predicate for a globally-disabled matcher is treated as dormant: it is
    ignored during resolution (the rule fires as if that condition were absent),
    rather than breaking the rule. Non-destructive — the predicate stays stored."""
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_enabled_matchers(["time_of_day"])  # `day` disabled

    await store.async_save_area(
        "lr",
        {
            "rules": [
                {
                    "name": "movie",
                    "when": {
                        "scene": "movie",
                        # An always-false day predicate (empty include item). If it were
                        # evaluated the rule could never match; because `day` is disabled
                        # the predicate is ignored and the rule matches on scene alone.
                        "day": {"include": [{"kind": "weekday", "days": []}], "exclude": []},
                    },
                    "actions": [],
                }
            ],
            "auto_sort": True,
        },
    )

    result = await async_resolve_only(hass, "lr", "movie")
    assert result["matched_rule_index"] == 0
    # The disabled matcher is not evaluated, so it isn't in the described snapshots.
    assert "day" not in result["snapshots_described"]
    # The predicate is still stored (non-destructive).
    assert "day" in store.get_area("lr")["rules"][0]["when"]
