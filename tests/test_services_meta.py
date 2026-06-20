"""Tests for the HA service catalog wrapper."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from custom_components.ambience.errors import AmbienceError
from custom_components.ambience.services_meta import (
    _flatten_field_groups,
    _registry_is_dict_stubbed,
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

    with pytest.raises(AmbienceError) as exc_info:
        await get_service_schema(hass, "no_dot")
    assert exc_info.value.translation_key == "invalid_service_id_format"
    assert exc_info.value.translation_placeholders == {"service_id": "no_dot"}


def test_flatten_field_groups_returns_empty_dict_for_non_dict_input() -> None:
    """Line 41: non-dict input short-circuits to {}."""
    assert _flatten_field_groups(None) == {}
    assert _flatten_field_groups([]) == {}
    assert _flatten_field_groups("string") == {}


def test_registry_is_dict_stubbed_skips_empty_domain_maps() -> None:
    """Line 61: domains with no services are skipped; if all domains are empty
    the registry is treated as real (found_any stays False → returns False)."""
    # Empty domain map — the `continue` branch on line 61.
    registry = {"light": {}, "switch": {}}
    assert _registry_is_dict_stubbed(registry) is False


def test_registry_is_dict_stubbed_returns_false_for_non_dict_service_objects() -> None:
    """Line 65: a domain map whose first value is a Service object (not dict)
    returns False immediately — this is a real HA registry, not a stub."""

    class _FakeService:
        pass

    registry = {"light": {"turn_on": _FakeService()}}
    assert _registry_is_dict_stubbed(registry) is False


async def test_descriptions_falls_back_to_runtime_registry_when_loader_raises() -> None:
    """Lines 83-95: when async_get_all_descriptions raises, list_services
    falls back to a degraded runtime-registry view (ids present, no fields)."""
    # Provide a Service object so _registry_is_dict_stubbed returns False,
    # forcing the code to call async_get_all_descriptions.

    class _FakeService:
        pass

    hass = MagicMock()
    hass.services.async_services.return_value = {"light": {"turn_on": _FakeService()}}

    # The import happens inside the try block; patching the module attribute
    # means the `from X import Y` picks up the mock.
    import homeassistant.helpers.service as _svc_module

    async def _raise(*_a, **_kw):
        raise RuntimeError("no descriptions on disk")

    with patch.object(_svc_module, "async_get_all_descriptions", _raise):
        items = await list_services(hass)

    assert len(items) == 1
    assert items[0]["id"] == "light.turn_on"
    # Degraded path: no name/description/target populated from spec
    assert items[0]["name"] == ""
    assert items[0]["description"] == ""
    assert items[0]["target"] is None


async def test_get_service_schema_includes_name_when_present() -> None:
    """get_service_schema returns the catalog name so the UI can display it."""
    hass = _make_hass(
        {
            "ambience": {
                "turn_on": {
                    "name": "Turn on",
                    "fields": {},
                    "target": None,
                },
            },
        }
    )

    schema = await get_service_schema(hass, "ambience.turn_on")

    assert schema is not None
    assert schema["name"] == "Turn on"


async def test_get_service_schema_returns_none_name_when_absent() -> None:
    """When the spec has no `name` key, the returned dict carries name=None."""
    hass = _make_hass(
        {
            "light": {
                "turn_on": {
                    "fields": {},
                    "target": {"entity": [{"domain": "light"}]},
                },
            },
        }
    )

    schema = await get_service_schema(hass, "light.turn_on")

    assert schema is not None
    assert schema["name"] is None


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
