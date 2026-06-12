"""Tests for the exposed-actions store."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from custom_components.ambience.exposed_actions import ExposedActionsStore


class _FakeStorage:
    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions = list(initial or [])
        self.saved: list[list[dict]] = []

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def async_save_exposed_actions(self, actions: list[dict]) -> None:
        self._actions = list(actions)
        self.saved.append(list(actions))


async def test_list_returns_empty_initially() -> None:
    store = ExposedActionsStore(_FakeStorage())
    assert store.list() == []


async def test_save_persists_and_list_returns_saved() -> None:
    storage = _FakeStorage()
    store = ExposedActionsStore(storage)

    await store.save(
        [
            {
                "id": "light.turn_on",
                "label": "Set lights on",
                "visible_fields": ["brightness_pct"],
                "defaults": {"transition": 1},
            },
        ]
    )

    assert store.list() == [
        {
            "id": "light.turn_on",
            "label": "Set lights on",
            "visible_fields": ["brightness_pct"],
            "defaults": {"transition": 1},
        },
    ]
    assert storage.saved == [
        [
            {
                "id": "light.turn_on",
                "label": "Set lights on",
                "visible_fields": ["brightness_pct"],
                "defaults": {"transition": 1},
            },
        ]
    ]


async def test_get_returns_entry_by_id() -> None:
    storage = _FakeStorage(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
        ]
    )
    store = ExposedActionsStore(storage)

    assert store.get("light.turn_on") is not None
    assert store.get("light.turn_off") is None


async def test_save_rejects_duplicate_ids() -> None:
    storage = _FakeStorage()
    store = ExposedActionsStore(storage)
    with pytest.raises(ValueError, match="duplicate"):
        await store.save(
            [
                {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
                {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            ]
        )
    assert storage.saved == []


async def test_save_accepts_field_in_both_visible_and_defaults() -> None:
    """A field may appear in BOTH visible_fields and defaults.

    Meaning: shown in the scene editor pre-filled with the default value.
    The old "cannot be both visible and locked" exclusion no longer applies.
    """
    storage = _FakeStorage()
    store = ExposedActionsStore(storage)
    await store.save(
        [
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {"brightness_pct": 50},
            },
        ]
    )
    assert storage.saved == [
        [
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {"brightness_pct": 50},
            },
        ]
    ]


async def test_save_rejects_malformed_id() -> None:
    storage = _FakeStorage()
    store = ExposedActionsStore(storage)
    with pytest.raises(ValueError, match="service id"):
        await store.save(
            [
                {"id": "no_dot", "label": "", "visible_fields": [], "defaults": {}},
            ]
        )
    assert storage.saved == []


def _hass_with_services(services: dict) -> MagicMock:
    hass = MagicMock()
    hass.services.async_services.return_value = services
    return hass


async def test_validate_against_catalog_passes_for_known_service_and_fields() -> None:
    hass = _hass_with_services(
        {"light": {"turn_on": {"fields": {"brightness_pct": {}, "transition": {}}}}}
    )
    store = ExposedActionsStore(_FakeStorage())
    await store.validate_against_catalog(
        hass,
        [
            {
                "id": "light.turn_on",
                "label": "",
                "visible_fields": ["brightness_pct"],
                "defaults": {"transition": 1},
            },
        ],
    )  # no exception


async def test_validate_against_catalog_rejects_unknown_service() -> None:
    hass = _hass_with_services({"light": {"turn_on": {"fields": {}}}})
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="unknown service"):
        await store.validate_against_catalog(
            hass,
            [
                {"id": "light.nope", "label": "", "visible_fields": [], "defaults": {}},
            ],
        )


async def test_validate_against_catalog_rejects_unknown_field_in_visible() -> None:
    hass = _hass_with_services({"light": {"turn_on": {"fields": {"brightness_pct": {}}}}})
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="unknown field"):
        await store.validate_against_catalog(
            hass,
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": ["bogus_field"],
                    "defaults": {},
                },
            ],
        )


async def test_validate_against_catalog_rejects_unknown_field_in_defaults() -> None:
    hass = _hass_with_services({"light": {"turn_on": {"fields": {"brightness_pct": {}}}}})
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="unknown field"):
        await store.validate_against_catalog(
            hass,
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": [],
                    "defaults": {"bogus_field": 1},
                },
            ],
        )


async def test_validate_against_catalog_stops_at_first_bad_entry() -> None:
    hass = _hass_with_services({"light": {"turn_on": {"fields": {}}}})
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="light.nope"):
        await store.validate_against_catalog(
            hass,
            [
                {"id": "light.nope", "label": "", "visible_fields": [], "defaults": {}},
                {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}},
            ],
        )


async def test_validate_against_catalog_accepts_service_with_no_fields() -> None:
    hass = _hass_with_services({"notify": {"send_message": {"fields": {}}}})
    store = ExposedActionsStore(_FakeStorage())
    await store.validate_against_catalog(
        hass,
        [{"id": "notify.send_message", "label": "", "visible_fields": [], "defaults": {}}],
    )  # no exception


def _entry(**over):
    base = {"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {}}
    base.update(over)
    return base


def test_validate_shape_rejects_non_list_input() -> None:
    """validate_shape raises when actions is not a list (line 54)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="exposed actions must be a list"):
        store.validate_shape({"id": "light.turn_on"})  # type: ignore[arg-type]


def test_validate_shape_rejects_non_dict_entry() -> None:
    """validate_shape raises when an entry is not a dict (line 58)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="entry must be an object"):
        store.validate_shape(["light.turn_on"])  # type: ignore[list-item]


def test_validate_shape_rejects_service_id_with_empty_domain() -> None:
    """validate_shape raises when a service id has an empty domain segment (line 64)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="invalid service id"):
        store.validate_shape(
            [{"id": ".turn_on", "label": "", "visible_fields": [], "defaults": {}}]
        )


def test_validate_shape_rejects_service_id_with_empty_name() -> None:
    """validate_shape raises when a service id has an empty name segment (line 64)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="invalid service id"):
        store.validate_shape([{"id": "light.", "label": "", "visible_fields": [], "defaults": {}}])


def test_validate_shape_rejects_non_string_label() -> None:
    """validate_shape raises when label is not a string (line 70)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="label must be a string"):
        store.validate_shape(
            [{"id": "light.turn_on", "label": 42, "visible_fields": [], "defaults": {}}]
        )


def test_validate_shape_rejects_non_list_visible_fields() -> None:
    """validate_shape raises when visible_fields is not a list of strings (line 74)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="visible_fields must be a list of strings"):
        store.validate_shape(
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": "brightness_pct",
                    "defaults": {},
                }
            ]
        )


def test_validate_shape_rejects_visible_fields_with_non_string_elements() -> None:
    """validate_shape raises when visible_fields contains a non-string (line 74)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="visible_fields must be a list of strings"):
        store.validate_shape(
            [{"id": "light.turn_on", "label": "", "visible_fields": [123], "defaults": {}}]
        )


def test_validate_shape_rejects_non_dict_defaults() -> None:
    """validate_shape raises when defaults is not a dict (line 76)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="defaults must be an object keyed by string"):
        store.validate_shape(
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": [],
                    "defaults": ["brightness_pct"],
                }
            ]
        )


def test_validate_shape_rejects_defaults_with_non_string_key() -> None:
    """validate_shape raises when defaults has a non-string key (line 76)."""
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="defaults must be an object keyed by string"):
        store.validate_shape(
            [{"id": "light.turn_on", "label": "", "visible_fields": [], "defaults": {1: "val"}}]  # type: ignore[dict-item]
        )


async def test_validate_against_catalog_degraded_skips_field_checks() -> None:
    """When async_get_all_descriptions raises, field validation is skipped.

    The catalog is degraded — service-existence can still be checked (the
    fallback view includes all registered services), but field-existence
    cannot be reliably checked. We must accept valid entries whose
    visible_fields are non-empty, and only reject entries for unknown services.
    """
    hass = MagicMock()
    # Non-stubbed registry: async_services returns Service objects (use MagicMock so
    # _registry_is_dict_stubbed returns False, falling through to the real loader path).
    mock_service = MagicMock()  # not a dict → _registry_is_dict_stubbed returns False
    hass.services.async_services.return_value = {
        "light": {"turn_on": mock_service},
    }

    store = ExposedActionsStore(_FakeStorage())

    with (
        patch(
            "custom_components.ambience.services_meta.async_get_all_descriptions",
            side_effect=RuntimeError("descriptions unavailable in test"),
            create=True,
        ),
        patch(
            "homeassistant.helpers.service.async_get_all_descriptions",
            side_effect=RuntimeError("descriptions unavailable in test"),
            create=True,
        ),
    ):
        # A valid entry with visible_fields: must pass (degraded → skip field checks).
        await store.validate_against_catalog(
            hass,
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": ["brightness_pct"],
                    "defaults": {},
                },
            ],
        )  # no exception

        # An entry for an unknown service must still fail (service-existence check
        # uses the fallback dict which has the correct domain/service keys).
        with pytest.raises(ValueError, match="unknown service"):
            await store.validate_against_catalog(
                hass,
                [
                    {
                        "id": "light.no_such_service",
                        "label": "",
                        "visible_fields": [],
                        "defaults": {},
                    },
                ],
            )
