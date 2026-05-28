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
from homeassistant.const import Platform
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.typing import ConfigType

from .const import (
    DATA_EXPOSED_ACTIONS,
    DATA_MATCHERS,
    DATA_PERIODS,
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DOMAIN,
)
from .exposed_actions import ExposedActionsStore
from .matchers.day import DayMatcher
from .matchers.scene import SceneMatcher
from .matchers.script import ScriptMatcher
from .matchers.state import StateMatcher
from .matchers.time_of_day import TimeOfDayMatcher
from .matchers.weather import WeatherMatcher
from .periods import PeriodStore
from .registry import register_matcher
from .service import async_apply_scene
from .store import AmbienceStore
from .websocket import async_register_commands, async_unregister_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_PANEL_URL = "ambience"
_PANEL_STATIC_PATH = "/ambience-panel"
_PANEL_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-panel.js"


def _exactly_one_scope(value: dict) -> dict:
    """Validator: exactly one of {area, floor, house} must be present."""
    present = [k for k in ("area", "floor", "house") if k in value]
    if len(present) != 1:
        raise vol.Invalid(f"apply_scene requires exactly one of area/floor/house, got: {present!r}")
    return value


def _house_must_be_true(value: object) -> bool:
    """Validator: `house` must be exactly True (not False, not truthy-but-non-bool)."""
    if value is not True:
        raise vol.Invalid("house must be true")
    return value


_APPLY_SCENE_SCHEMA = vol.All(
    vol.Schema(
        {
            vol.Optional("area"): cv.string,
            vol.Optional("floor"): cv.string,
            vol.Optional("house"): _house_must_be_true,
            vol.Optional("scene"): cv.string,
        }
    ),
    _exactly_one_scope,
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
    domain_data[DATA_SWITCHES] = {}

    store = AmbienceStore(hass)
    await store.async_load()

    # Reconcile against HA registries: drop stored configs whose registry
    # entry has gone away (e.g. while HA was down).
    area_reg = ar.async_get(hass)
    known_area_ids = {a.id for a in area_reg.async_list_areas()}
    for orphan in [aid for aid in store.areas() if aid not in known_area_ids]:
        _LOGGER.info("ambience: dropping orphan area config %r", orphan)
        await store.async_delete_area(orphan)

    floor_reg = fr.async_get(hass)
    known_floor_ids = {f.floor_id for f in floor_reg.async_list_floors()}
    for orphan in [fid for fid in store.floors() if fid not in known_floor_ids]:
        _LOGGER.info("ambience: dropping orphan floor config %r", orphan)
        await store.async_delete_floor(orphan)

    domain_data[DATA_STORE] = store

    exposed_store = ExposedActionsStore(store)
    domain_data[DATA_EXPOSED_ACTIONS] = exposed_store

    period_store = PeriodStore(store)
    domain_data[DATA_PERIODS] = period_store

    register_matcher(hass, SceneMatcher())
    register_matcher(hass, TimeOfDayMatcher(period_lookup=period_store.effective))
    register_matcher(hass, DayMatcher(hass=hass))
    register_matcher(hass, WeatherMatcher(hass=hass))
    register_matcher(hass, StateMatcher(hass=hass))
    register_matcher(hass, ScriptMatcher(hass=hass))

    async def _handle_apply_scene(call: ServiceCall) -> None:
        scene = call.data.get("scene")
        if "area" in call.data:
            await async_apply_scene(hass, "area", call.data["area"], scene)
        elif "floor" in call.data:
            await async_apply_scene(hass, "floor", call.data["floor"], scene)
        else:  # house
            await async_apply_scene(hass, "house", None, scene)

    hass.services.async_register(
        DOMAIN,
        "apply_scene",
        _handle_apply_scene,
        schema=_APPLY_SCENE_SCHEMA,
    )

    async_register_commands(hass)

    await hass.config_entries.async_forward_entry_setups(entry, [Platform.SWITCH])

    async def _handle_area_registry_update(event: Event) -> None:
        action = event.data["action"]
        area_id = event.data["area_id"]
        if action == "create":
            from .switch import AmbienceScopeSwitch

            add_entities = domain_data.get(DATA_SWITCH_ADD_ENTITIES)
            area = area_reg.async_get_area(area_id)
            if add_entities is not None and area is not None:
                add_entities([AmbienceScopeSwitch("area", area_id, area.name)])
            return
        if action == "remove":
            await store.async_delete_area(area_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("area", area_id), None)
            ent_reg = er.async_get(hass)
            ent_id = ent_reg.async_get_entity_id(
                "switch", DOMAIN, f"ambience_switch_area_{area_id}"
            )
            if ent_id is not None:
                ent_reg.async_remove(ent_id)

    entry.async_on_unload(
        hass.bus.async_listen(ar.EVENT_AREA_REGISTRY_UPDATED, _handle_area_registry_update)
    )

    async def _handle_floor_registry_update(event: Event) -> None:
        action = event.data["action"]
        floor_id = event.data["floor_id"]
        if action == "create":
            from .switch import AmbienceScopeSwitch

            add_entities = domain_data.get(DATA_SWITCH_ADD_ENTITIES)
            floor = floor_reg.async_get_floor(floor_id)
            if add_entities is not None and floor is not None:
                add_entities([AmbienceScopeSwitch("floor", floor_id, floor.name)])
            return
        if action == "remove":
            await store.async_delete_floor(floor_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("floor", floor_id), None)
            ent_reg = er.async_get(hass)
            ent_id = ent_reg.async_get_entity_id(
                "switch", DOMAIN, f"ambience_switch_floor_{floor_id}"
            )
            if ent_id is not None:
                ent_reg.async_remove(ent_id)

    entry.async_on_unload(
        hass.bus.async_listen(fr.EVENT_FLOOR_REGISTRY_UPDATED, _handle_floor_registry_update)
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
    await hass.config_entries.async_unload_platforms(entry, [Platform.SWITCH])
    async_remove_panel(hass, _PANEL_URL)
    hass.services.async_remove(DOMAIN, "apply_scene")
    async_unregister_commands(hass)
    hass.data.pop(DOMAIN, None)
    return True
