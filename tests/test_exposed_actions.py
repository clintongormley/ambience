"""Tests for the exposed-actions store."""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest

from custom_components.ambience.exposed_actions import ExposedActionsStore


class _FakeStorage:
    def __init__(self, initial: list[dict] | None = None) -> None:
        self._actions = list(initial or [])
        self.async_save_exposed_actions = AsyncMock(side_effect=self._save)

    def get_exposed_actions(self) -> list[dict]:
        return list(self._actions)

    async def _save(self, actions: list[dict]) -> None:
        self._actions = list(actions)


@pytest.mark.asyncio
async def test_list_returns_empty_initially() -> None:
    store = ExposedActionsStore(_FakeStorage())
    assert store.list() == []


@pytest.mark.asyncio
async def test_save_persists_and_list_returns_saved() -> None:
    storage = _FakeStorage()
    store = ExposedActionsStore(storage)

    await store.save(
        [
            {
                "id": "light.turn_on",
                "label": "Set lights on",
                "visible_fields": ["brightness_pct"],
                "locked_values": {"transition": 1},
            },
        ]
    )

    assert store.list() == [
        {
            "id": "light.turn_on",
            "label": "Set lights on",
            "visible_fields": ["brightness_pct"],
            "locked_values": {"transition": 1},
        },
    ]


@pytest.mark.asyncio
async def test_get_returns_entry_by_id() -> None:
    storage = _FakeStorage(
        [
            {"id": "light.turn_on", "label": "", "visible_fields": [], "locked_values": {}},
        ]
    )
    store = ExposedActionsStore(storage)

    assert store.get("light.turn_on") is not None
    assert store.get("light.turn_off") is None


@pytest.mark.asyncio
async def test_save_rejects_duplicate_ids() -> None:
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="duplicate"):
        await store.save(
            [
                {"id": "light.turn_on", "label": "", "visible_fields": [], "locked_values": {}},
                {"id": "light.turn_on", "label": "", "visible_fields": [], "locked_values": {}},
            ]
        )


@pytest.mark.asyncio
async def test_save_rejects_field_in_both_visible_and_locked() -> None:
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="cannot be both"):
        await store.save(
            [
                {
                    "id": "light.turn_on",
                    "label": "",
                    "visible_fields": ["brightness_pct"],
                    "locked_values": {"brightness_pct": 50},
                },
            ]
        )


@pytest.mark.asyncio
async def test_save_rejects_malformed_id() -> None:
    store = ExposedActionsStore(_FakeStorage())
    with pytest.raises(ValueError, match="service id"):
        await store.save(
            [
                {"id": "no_dot", "label": "", "visible_fields": [], "locked_values": {}},
            ]
        )
