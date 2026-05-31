"""Tests for the HA service catalog wrapper."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from custom_components.ambience.services_meta import (
    get_service_schema,
    list_services,
)


def _make_hass(services: dict) -> MagicMock:
    hass = MagicMock()
    hass.services.async_services.return_value = services
    return hass


async def test_list_services_returns_flat_list_with_domain_name_and_description() -> None:
    hass = _make_hass(
        {
            "light": {
                "turn_on": {
                    "name": "Turn on",
                    "description": "Turn the light on.",
                    "fields": {"brightness_pct": {"selector": {"number": {"min": 0, "max": 100}}}},
                    "target": {"entity": [{"domain": "light"}]},
                },
                "turn_off": {
                    "name": "Turn off",
                    "description": "Turn the light off.",
                    "fields": {},
                },
            },
        }
    )

    items = await list_services(hass)

    ids = [item["id"] for item in items]
    assert ids == ["light.turn_off", "light.turn_on"]  # alpha-sorted
    assert items[0]["target"] is None
    assert items[0]["name"] == "Turn off"
    assert items[1]["description"] == "Turn the light on."
    assert items[1]["name"] == "Turn on"
    assert items[1]["target"] == {"entity": [{"domain": "light"}]}


async def test_list_services_name_defaults_to_empty_when_absent() -> None:
    hass = _make_hass({"climate": {"set_temperature": {"description": "Set it."}}})

    items = await list_services(hass)

    assert items[0]["name"] == ""


async def test_get_service_schema_returns_fields_and_target() -> None:
    hass = _make_hass(
        {
            "light": {
                "turn_on": {
                    "fields": {
                        "brightness_pct": {
                            "selector": {"number": {"min": 0, "max": 100}},
                            "description": "Percent brightness",
                        },
                        "transition": {
                            "selector": {"number": {"min": 0}},
                        },
                    },
                    "target": {"entity": [{"domain": "light"}]},
                },
            },
        }
    )

    schema = await get_service_schema(hass, "light.turn_on")

    assert schema is not None
    assert set(schema["fields"]) == {"brightness_pct", "transition"}
    assert schema["fields"]["brightness_pct"]["selector"] == {"number": {"min": 0, "max": 100}}
    assert schema["target"] == {"entity": [{"domain": "light"}]}


async def test_get_service_schema_returns_none_for_unknown_service() -> None:
    hass = _make_hass({"light": {"turn_on": {"fields": {}}}})

    assert await get_service_schema(hass, "light.nope") is None
    assert await get_service_schema(hass, "nope.nope") is None


async def test_get_service_schema_handles_malformed_id() -> None:
    hass = _make_hass({})

    with pytest.raises(ValueError):
        await get_service_schema(hass, "no_dot")


async def test_get_service_schema_flattens_nested_field_groups() -> None:
    """HA's `advanced_fields`-style nested groups are flattened into the
    top-level fields dict — the group entry itself disappears."""
    hass = _make_hass(
        {
            "light": {
                "turn_on": {
                    "fields": {
                        "brightness_pct": {"selector": {"number": {"min": 0, "max": 100}}},
                        "transition": {"selector": {"number": {"min": 0}}},
                        "advanced_fields": {
                            "collapsed": True,
                            "fields": {
                                "white": {"selector": {"number": {}}},
                                "profile": {"selector": {"text": {}}},
                            },
                        },
                    },
                },
            },
        }
    )

    schema = await get_service_schema(hass, "light.turn_on")

    assert schema is not None
    assert set(schema["fields"]) == {"brightness_pct", "transition", "white", "profile"}
    assert "advanced_fields" not in schema["fields"]
