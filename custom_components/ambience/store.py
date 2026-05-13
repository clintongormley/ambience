"""Persistent store for Ambience configuration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


class AmbienceStore:
    """Typed wrapper over HA's Store for Ambience data."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = self._empty()

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {"version": STORAGE_VERSION, "areas": {}}

    async def async_load(self) -> None:
        raw = await self._store.async_load()
        if raw is None:
            self._data = self._empty()
            return
        areas = raw.get("areas")
        if not isinstance(raw, dict) or "areas" not in raw or not isinstance(areas, dict):
            _LOGGER.warning("ambience storage payload is malformed; starting empty")
            self._data = self._empty()
            return
        self._data = raw

    def areas(self) -> dict[str, dict[str, Any]]:
        return dict(self._data["areas"])

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        return self._data["areas"].get(area_id)

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> None:
        self._data["areas"][area_id] = config
        await self._store.async_save(self._data)

    async def async_delete_area(self, area_id: str) -> None:
        if area_id in self._data["areas"]:
            del self._data["areas"][area_id]
            await self._store.async_save(self._data)
