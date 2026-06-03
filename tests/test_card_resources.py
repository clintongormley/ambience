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


async def test_register_skips_async_load_when_already_loaded(hass: HomeAssistant) -> None:
    """When resources.loaded is True, async_load() must NOT be called again."""
    resources = FakeResources()
    resources.loaded = True  # pre-set to skip the load call
    hass.data["lovelace"] = FakeLovelace(resources)

    # Spy on async_load to make sure it isn't called.
    original_load = resources.async_load
    load_calls = []

    async def spy_load() -> None:
        load_calls.append(True)
        await original_load()

    resources.async_load = spy_load

    await async_register_card_resource(hass, BASE_URL, CARD_URL)

    assert load_calls == []  # branch 48->51: skip load when already loaded
    assert resources.created == [{"id": "res_1", "res_type": "module", "url": CARD_URL}]


async def test_register_skips_non_matching_item_and_creates_new(hass: HomeAssistant) -> None:
    """An item whose URL neither equals nor starts with base_url is ignored (56->51 branch)."""
    unrelated = {"id": "res_3", "res_type": "module", "url": "/other-component/card.js?hash=xyz"}
    resources = FakeResources([unrelated])
    hass.data["lovelace"] = FakeLovelace(resources)

    await async_register_card_resource(hass, BASE_URL, CARD_URL)

    # The unrelated item is left alone and a new one is created.
    assert resources.updated == []
    assert len(resources.created) == 1
    assert resources.created[0]["url"] == CARD_URL
    assert resources.created[0]["res_type"] == "module"
    new_id = resources.created[0]["id"]
    assert hass.data[DOMAIN][DATA_CARD_RESOURCE_ID] == new_id


async def test_register_falls_back_to_extra_js_on_exception(hass: HomeAssistant) -> None:
    """If any exception is raised by the resource API, fall back to add_extra_js_url."""
    resources = FakeResources()

    async def boom() -> None:
        raise RuntimeError("storage unavailable")

    resources.async_load = boom
    hass.data["lovelace"] = FakeLovelace(resources)

    with patch("custom_components.ambience.card_resources.frontend") as mock_frontend:
        await async_register_card_resource(hass, BASE_URL, CARD_URL)

    # Lines 63-64: exception is caught, falls through to add_extra_js_url.
    mock_frontend.add_extra_js_url.assert_called_once_with(hass, CARD_URL)


async def test_unregister_swallows_remove_extra_js_error(hass: HomeAssistant) -> None:
    """remove_extra_js_url raising must be silently swallowed (lines 79-80)."""
    with patch("custom_components.ambience.card_resources.frontend") as mock_frontend:
        mock_frontend.remove_extra_js_url.side_effect = RuntimeError("url not registered")
        # Must not raise.
        await async_unregister_card_resource(hass, CARD_URL)

    mock_frontend.remove_extra_js_url.assert_called_once_with(hass, CARD_URL)


async def test_unregister_skips_delete_when_no_resources_available(hass: HomeAssistant) -> None:
    """If resources collection is unavailable (84->exit), nothing is deleted."""
    # Store a resource_id but provide no lovelace → _get_resources returns None.
    hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = "res_42"

    # Should complete without error and without trying to delete.
    await async_unregister_card_resource(hass, CARD_URL)

    # resource_id was popped from hass.data.
    assert DATA_CARD_RESOURCE_ID not in hass.data.get(DOMAIN, {})


async def test_unregister_swallows_delete_exception(hass: HomeAssistant) -> None:
    """async_delete_item raising must be silently swallowed (lines 87-88)."""
    resources = FakeResources([{"id": "res_9", "res_type": "module", "url": CARD_URL}])

    async def boom(item_id: str) -> None:
        raise RuntimeError("storage write error")

    resources.async_delete_item = boom
    hass.data["lovelace"] = FakeLovelace(resources)
    hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = "res_9"

    # Must not raise.
    await async_unregister_card_resource(hass, CARD_URL)
