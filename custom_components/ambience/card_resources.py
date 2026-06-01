"""Lovelace resource registration for the Ambience card.

The Ambience card must be registered as a Lovelace *resource* rather than loaded
via ``frontend.add_extra_js_url``. add_extra_js_url injects the module into the
index, which runs before Home Assistant lazily installs
``@webcomponents/scoped-custom-element-registry`` (on first Lovelace render).
Installing that polyfill swaps ``window.customElements`` for a fresh registry,
dropping any element defined beforehand — so the card fails to resolve
("Configuration error: custom element doesn't exist") on a cold load. Lovelace
resources are imported during Lovelace init, after the swap, so the card
registers in the registry HA actually queries.

Falls back to ``add_extra_js_url`` when the resources collection is unavailable
(e.g. Lovelace in YAML mode), which still works for the running session.
"""

from __future__ import annotations

import logging

from homeassistant.components import frontend
from homeassistant.core import HomeAssistant

from .const import DATA_CARD_RESOURCE_ID, DOMAIN

_LOGGER = logging.getLogger(__name__)


def _get_resources(hass: HomeAssistant) -> object | None:
    """Return the Lovelace resource collection if it supports mutation."""
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None)
    if resources is not None and hasattr(resources, "async_create_item"):
        return resources
    return None


async def async_register_card_resource(hass: HomeAssistant, base_url: str, card_url: str) -> None:
    """Register the card JS as a Lovelace resource (idempotent).

    ``base_url`` is the card path without the cache-bust query; ``card_url`` is
    the versioned URL. An existing resource for the same ``base_url`` is updated
    to ``card_url`` so a rebuilt bundle is picked up.
    """
    try:
        resources = _get_resources(hass)
        if resources is not None:
            if not resources.loaded:
                await resources.async_load()
                resources.loaded = True
            for item in resources.async_items():
                url = item.get("url", "")
                if url == card_url:
                    hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = item["id"]
                    return  # Already the current version.
                if url.startswith(base_url):
                    await resources.async_update_item(item["id"], {"url": card_url})
                    hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = item["id"]
                    return
            item = await resources.async_create_item({"res_type": "module", "url": card_url})
            hass.data.setdefault(DOMAIN, {})[DATA_CARD_RESOURCE_ID] = item["id"]
            return
    except Exception:  # noqa: BLE001 — resource API is best-effort; fall back below.
        _LOGGER.debug(
            "ambience: could not register card as a Lovelace resource; "
            "falling back to add_extra_js_url",
            exc_info=True,
        )

    frontend.add_extra_js_url(hass, card_url)


async def async_unregister_card_resource(hass: HomeAssistant, card_url: str) -> None:
    """Remove the card's Lovelace resource (or extra-js fallback) on unload."""
    resource_id = hass.data.get(DOMAIN, {}).pop(DATA_CARD_RESOURCE_ID, None)
    if resource_id is None:
        try:
            frontend.remove_extra_js_url(hass, card_url)
        except Exception:  # noqa: BLE001
            _LOGGER.debug("ambience: could not remove card extra-js url", exc_info=True)
        return

    resources = _get_resources(hass)
    if resources is not None and hasattr(resources, "async_delete_item"):
        try:
            await resources.async_delete_item(resource_id)
        except Exception:  # noqa: BLE001
            _LOGGER.debug(
                "ambience: could not remove Lovelace resource %s", resource_id, exc_info=True
            )
