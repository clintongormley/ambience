"""Tests for Lovelace card resource registration."""

from __future__ import annotations

from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components.ambience.card_resources import (
    async_register_card_resource,
    async_unregister_card_resource,
)
from custom_components.ambience.const import DATA_CARD_RESOURCE_ID, DOMAIN

BASE_URL = "/ambience-panel/ambience-card.js"
CARD_URL = "/ambience-panel/ambience-card.js?hash=abc123&fe=def456"


class FakeResources:
    """Minimal stand-in for HA's Lovelace ResourceStorageCollection."""

    def __init__(self, items: list[dict] | None = None) -> None:
        self.loaded = False
        self._items = list(items or [])
        self.created: list[dict] = []
        self.updated: list[tuple[str, dict]] = []
        self.deleted: list[str] = []
        self._next = 1

    async def async_load(self) -> None:
        self.loaded = True

    def async_items(self) -> list[dict]:
        return list(self._items)

    async def async_create_item(self, data: dict) -> dict:
        item = {"id": f"res_{self._next}", **data}
        self._next += 1
        self._items.append(item)
        self.created.append(item)
        return item

    async def async_update_item(self, item_id: str, changes: dict) -> dict:
        self.updated.append((item_id, changes))
        for it in self._items:
            if it["id"] == item_id:
                it.update(changes)
        return next(it for it in self._items if it["id"] == item_id)

    async def async_delete_item(self, item_id: str) -> None:
        self.deleted.append(item_id)
        self._items = [it for it in self._items if it["id"] != item_id]


class FakeLovelace:
    def __init__(self, resources: FakeResources) -> None:
        self.resources = resources


async def test_register_creates_resource(hass: HomeAssistant) -> None:
    resources = FakeResources()
    hass.data["lovelace"] = FakeLovelace(resources)

    await async_register_card_resource(hass, BASE_URL, CARD_URL)

    assert resources.loaded is True
    assert resources.created == [{"id": "res_1", "res_type": "module", "url": CARD_URL}]
    assert hass.data[DOMAIN][DATA_CARD_RESOURCE_ID] == "res_1"


async def test_register_skips_when_already_current(hass: HomeAssistant) -> None:
    resources = FakeResources([{"id": "res_9", "res_type": "module", "url": CARD_URL}])
    hass.data["lovelace"] = FakeLovelace(resources)

    await async_register_card_resource(hass, BASE_URL, CARD_URL)

    assert resources.created == []
    assert resources.updated == []
    assert hass.data[DOMAIN][DATA_CARD_RESOURCE_ID] == "res_9"


async def test_register_updates_old_version(hass: HomeAssistant) -> None:
    old = {"id": "res_9", "res_type": "module", "url": f"{BASE_URL}?hash=old&fe=old"}
    resources = FakeResources([old])
    hass.data["lovelace"] = FakeLovelace(resources)

    await async_register_card_resource(hass, BASE_URL, CARD_URL)

    assert resources.created == []
    assert resources.updated == [("res_9", {"url": CARD_URL})]
    assert hass.data[DOMAIN][DATA_CARD_RESOURCE_ID] == "res_9"


async def test_register_falls_back_to_extra_js_when_no_resources(hass: HomeAssistant) -> None:
    # No "lovelace" in hass.data → no resource collection available.
    with patch("custom_components.ambience.card_resources.frontend") as mock_frontend:
        await async_register_card_resource(hass, BASE_URL, CARD_URL)

    mock_frontend.add_extra_js_url.assert_called_once_with(hass, CARD_URL)
    assert DATA_CARD_RESOURCE_ID not in hass.data.get(DOMAIN, {})


async def test_unregister_deletes_resource(hass: HomeAssistant) -> None:
    resources = FakeResources([{"id": "res_9", "res_type": "module", "url": CARD_URL}])
    hass.data["lovelace"] = FakeLovelace(resources)
    hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = "res_9"

    await async_unregister_card_resource(hass, CARD_URL)

    assert resources.deleted == ["res_9"]
    assert DATA_CARD_RESOURCE_ID not in hass.data[DOMAIN]


async def test_unregister_falls_back_to_extra_js_when_no_resource_id(hass: HomeAssistant) -> None:
    with patch("custom_components.ambience.card_resources.frontend") as mock_frontend:
        await async_unregister_card_resource(hass, CARD_URL)

    mock_frontend.remove_extra_js_url.assert_called_once_with(hass, CARD_URL)
