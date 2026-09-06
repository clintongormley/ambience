"""WebSocket commands for the scene category list."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from ..const import DATA_STORE, DOMAIN
from ..errors import AmbienceError
from ..store import CategoryInUseError, LastCategoryError
from .common import send_ambience_error


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "ambience/categories/list"})
@websocket_api.async_response
async def _ws_categories_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    connection.send_result(msg["id"], {"categories": store.categories()})


def _validate_categories(categories: list[dict[str, Any]]) -> None:
    """Reject a categories payload the voluptuous schema can't express: a blank
    id or name, and ids/names that collide (names case-insensitively, since the
    picker shows them to a human)."""
    seen_ids: set[str] = set()
    seen_names: set[str] = set()
    for category in categories:
        cid = category.get("id")
        name = category.get("name")
        if not isinstance(cid, str) or not cid.strip():
            raise AmbienceError("category_id_empty")
        if cid in seen_ids:
            raise AmbienceError("duplicate_category_id", cid=cid)
        seen_ids.add(cid)
        if not isinstance(name, str) or not name.strip():
            raise AmbienceError("category_name_empty", cid=cid)
        key = name.strip().casefold()
        if key in seen_names:
            raise AmbienceError("duplicate_category_name", name=name.strip())
        seen_names.add(key)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/categories/save",
        vol.Required("categories"): [
            {
                vol.Required("id"): str,
                vol.Required("name"): str,
                vol.Optional("icon"): vol.Any(str, None),
                vol.Optional("color"): vol.Any(str, None),
            }
        ],
    }
)
@websocket_api.async_response
async def _ws_categories_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    # One chokepoint for both the shape rules validated here and the
    # last-category / in-use invariants the store owns (shared with the delete
    # path), so every rejection is reported the same way.
    try:
        _validate_categories(msg["categories"])
        await store.async_save_categories(msg["categories"])
    # The store's two typed errors subclass AmbienceError, so they must be
    # caught ahead of the generic shape rejection or they lose their own code.
    except LastCategoryError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_last")
        return
    except CategoryInUseError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_in_use")
        return
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc, code="invalid_categories")
        return
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "ambience/categories/delete",
        vol.Required("category_id"): str,
    }
)
@websocket_api.async_response
async def _ws_categories_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    try:
        await store.async_delete_category(msg["category_id"])
    except LastCategoryError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_last")
        return
    except CategoryInUseError as exc:
        send_ambience_error(connection, msg["id"], exc, code="category_in_use")
        return
    except (HomeAssistantError, ValueError) as exc:
        send_ambience_error(connection, msg["id"], exc)
        return
    connection.send_result(msg["id"])
