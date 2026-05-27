"""The Ambience integration."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

import voluptuous as vol
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .actions.set_light import SetLightAction
from .const import (
    DATA_ACTIONS,
    DATA_MATCHERS,
    DATA_PERIODS,
    DATA_STORE,
    DOMAIN,
)
from .matchers.day import DayMatcher
from .matchers.scene import SceneMatcher
from .matchers.script import ScriptMatcher
from .matchers.state import StateMatcher
from .matchers.time_of_day import TimeOfDayMatcher
from .matchers.weather import WeatherMatcher
from .periods import PeriodStore
from .registry import register_action, register_matcher
from .service import async_apply_scene
from .store import AmbienceStore
from .websocket import async_register_commands, async_unregister_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_PANEL_URL = "ambience"
_PANEL_STATIC_PATH = "/ambience-panel"
_PANEL_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-panel.js"

_APPLY_SCENE_SCHEMA = vol.Schema(
    {
        vol.Required("area"): cv.string,
        vol.Optional("scene"): cv.string,
    }
)


def _hash_bundle(bundle_path: Path) -> str:
    """Return a short content hash of the panel bundle, or 'missing' if absent."""
    try:
        return hashlib.sha256(bundle_path.read_bytes()).hexdigest()[:12]
    except OSError:
        return "missing"


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data[DATA_MATCHERS] = {}
    domain_data[DATA_ACTIONS] = {}

    store = AmbienceStore(hass)
    await store.async_load()
    domain_data[DATA_STORE] = store

    period_store = PeriodStore(store)
    domain_data[DATA_PERIODS] = period_store

    register_matcher(hass, SceneMatcher())
    register_matcher(hass, TimeOfDayMatcher(period_lookup=period_store.effective))
    register_matcher(hass, DayMatcher(hass=hass))
    register_matcher(hass, WeatherMatcher(hass=hass))
    register_matcher(hass, StateMatcher(hass=hass))
    register_matcher(hass, ScriptMatcher(hass=hass))
    register_action(hass, SetLightAction())

    async def _handle_apply_scene(call: ServiceCall) -> None:
        await async_apply_scene(hass, call.data["area"], call.data.get("scene"))

    hass.services.async_register(
        DOMAIN,
        "apply_scene",
        _handle_apply_scene,
        schema=_APPLY_SCENE_SCHEMA,
    )

    async_register_commands(hass)

    async def _handle_area_registry_update(event: Event) -> None:
        """Drop an area's config when the HA area is deleted from the registry."""
        if event.data["action"] != "remove":
            return
        await store.async_delete_area(event.data["area_id"])

    entry.async_on_unload(
        hass.bus.async_listen(ar.EVENT_AREA_REGISTRY_UPDATED, _handle_area_registry_update)
    )

    # Serve the bundled JS from the integration's frontend/ directory.
    bundle_dir = Path(__file__).parent / "frontend"
    bundle_path = bundle_dir / "ambience-panel.js"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(_PANEL_STATIC_PATH, str(bundle_dir), False)]
    )

    # Append a content hash so browsers fetch the fresh bundle after a rebuild
    # instead of serving a stale cached copy.
    bundle_hash = await hass.async_add_executor_job(_hash_bundle, bundle_path)
    module_url = f"{_PANEL_JS_URL}?hash={bundle_hash}"

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="Ambience",
        sidebar_icon="mdi:lightbulb-multiple",
        frontend_url_path=_PANEL_URL,
        require_admin=True,
        config={
            "_panel_custom": {
                "name": "ambience-panel",
                "module_url": module_url,
                "embed_iframe": False,
                "trust_external": False,
            }
        },
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    async_remove_panel(hass, _PANEL_URL)
    hass.services.async_remove(DOMAIN, "apply_scene")
    async_unregister_commands(hass)
    hass.data.pop(DOMAIN, None)
    return True
