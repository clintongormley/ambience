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


def test_list_services_returns_flat_list_with_domain_name_and_description() -> None:
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

    items = list_services(hass)

    ids = [item["id"] for item in items]
    assert ids == ["light.turn_off", "light.turn_on"]  # alpha-sorted
    assert items[0]["target"] is None
    assert items[1]["description"] == "Turn the light on."
    assert items[1]["target"] == {"entity": [{"domain": "light"}]}


def test_get_service_schema_returns_fields_and_target() -> None:
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

    schema = get_service_schema(hass, "light.turn_on")

    assert schema is not None
    assert set(schema["fields"]) == {"brightness_pct", "transition"}
    assert schema["fields"]["brightness_pct"]["selector"] == {"number": {"min": 0, "max": 100}}
    assert schema["target"] == {"entity": [{"domain": "light"}]}


def test_get_service_schema_returns_none_for_unknown_service() -> None:
    hass = _make_hass({"light": {"turn_on": {"fields": {}}}})

    assert get_service_schema(hass, "light.nope") is None
    assert get_service_schema(hass, "nope.nope") is None


def test_get_service_schema_handles_malformed_id() -> None:
    hass = _make_hass({})

    with pytest.raises(ValueError):
        get_service_schema(hass, "no_dot")
