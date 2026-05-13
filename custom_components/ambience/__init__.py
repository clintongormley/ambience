"""The Ambience integration."""

from __future__ import annotations

import logging

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .actions.set_light import SetLightAction
from .const import (
    DATA_ACTIONS,
    DATA_MATCHERS,
    DATA_STORE,
    DOMAIN,
)
from .matchers.time_of_day import TimeOfDayMatcher
from .registry import register_action, register_matcher
from .service import async_apply_scene
from .store import AmbienceStore
from .websocket import async_register_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_APPLY_SCENE_SCHEMA = vol.Schema(
    {
        vol.Required("area"): cv.string,
        vol.Required("scene"): cv.string,
    }
)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data[DATA_MATCHERS] = {}
    domain_data[DATA_ACTIONS] = {}

    store = AmbienceStore(hass)
    await store.async_load()
    domain_data[DATA_STORE] = store

    register_matcher(hass, TimeOfDayMatcher())
    register_action(hass, SetLightAction())

    async def _handle_apply_scene(call: ServiceCall) -> None:
        await async_apply_scene(hass, call.data["area"], call.data["scene"])

    hass.services.async_register(
        DOMAIN,
        "apply_scene",
        _handle_apply_scene,
        schema=_APPLY_SCENE_SCHEMA,
    )

    async_register_commands(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.services.async_remove(DOMAIN, "apply_scene")
    hass.data.pop(DOMAIN, None)
    return True
