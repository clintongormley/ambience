"""The Ambience integration."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

import voluptuous as vol
from homeassistant.components.frontend import (
    add_extra_js_url,
    async_register_built_in_panel,
    async_remove_panel,
    remove_extra_js_url,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import Event, HomeAssistant, ServiceCall, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_SHOW_SIDEBAR_PANEL,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_LAST_APPLIED,
    DATA_MATCHERS,
    DATA_PERIODS,
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DATA_TRACE_BUFFER,
    DATA_TRACE_SINKS,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
    SIGNAL_CONFIG_CHANGED,
)
from .exposed_actions import ExposedActionsStore
from .matchers.day import DayMatcher
from .matchers.people import PeopleMatcher
from .matchers.script import ScriptMatcher
from .matchers.state import StateMatcher
from .matchers.sun import SunMatcher
from .matchers.template import TemplateMatcher
from .matchers.time_of_day import TimeOfDayMatcher
from .matchers.weather import WeatherMatcher
from .periods import PeriodStore
from .registry import register_matcher
from .service import async_apply_scene, clear_last_applied
from .store import AmbienceStore
from .trace import BufferSink, LogSink
from .trigger_engine import AutoTriggerEngine
from .websocket import async_register_commands, async_unregister_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_PANEL_URL = "ambience"
_PANEL_STATIC_PATH = "/ambience-panel"
_PANEL_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-panel.js"
_CARD_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-card.js"


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
        }
    ),
    _exactly_one_scope,
)


def _hash_bundle(bundle_path: Path) -> str:
    """Return a short content hash of *bundle_path*, or 'missing' if absent."""
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
    domain_data[DATA_LAST_APPLIED] = {}
    trace_buffer = BufferSink()
    domain_data[DATA_TRACE_BUFFER] = trace_buffer
    domain_data[DATA_TRACE_SINKS] = [LogSink(), trace_buffer]

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

    register_matcher(hass, TimeOfDayMatcher(period_lookup=period_store.effective))
    register_matcher(hass, DayMatcher(hass=hass))
    register_matcher(hass, WeatherMatcher(hass=hass))
    register_matcher(hass, SunMatcher(hass=hass))
    register_matcher(hass, StateMatcher(hass=hass))
    register_matcher(hass, PeopleMatcher(hass=hass))
    register_matcher(hass, ScriptMatcher(hass=hass))
    register_matcher(hass, TemplateMatcher(hass=hass))

    async def _handle_apply_scene(call: ServiceCall) -> None:
        if "area" in call.data:
            await async_apply_scene(hass, "area", call.data["area"])
        elif "floor" in call.data:
            await async_apply_scene(hass, "floor", call.data["floor"])
        else:  # house
            await async_apply_scene(hass, "house", None)

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
            clear_last_applied(hass, "area", area_id)
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
            clear_last_applied(hass, "floor", floor_id)
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

    # Content hashes for cache-busting. Each loader URL carries its own bundle
    # hash (`?hash=`) so an edited loader is re-fetched, plus the shared
    # ambience-frontend.js chunk hash (`?fe=`), which the loaders read off their
    # own URL and forward when lazily importing the chunk.
    card_path = bundle_dir / "ambience-card.js"
    frontend_path = bundle_dir / "ambience-frontend.js"
    bundle_hash = await hass.async_add_executor_job(_hash_bundle, bundle_path)
    card_hash = await hass.async_add_executor_job(_hash_bundle, card_path)
    frontend_hash = await hass.async_add_executor_job(_hash_bundle, frontend_path)
    module_url = f"{_PANEL_JS_URL}?hash={bundle_hash}&fe={frontend_hash}"
    card_url = f"{_CARD_JS_URL}?hash={card_hash}&fe={frontend_hash}"

    if entry.options.get(CONF_SHOW_SIDEBAR_PANEL, DEFAULT_SHOW_SIDEBAR_PANEL):
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

    # Register the (tiny) card loader on every frontend page so the Ambience
    # card is discoverable in the card picker. The heavy frontend chunk is
    # lazy-loaded by the card only when it actually renders.
    add_extra_js_url(hass, card_url)
    entry.async_on_unload(lambda: remove_extra_js_url(hass, card_url))

    engine = AutoTriggerEngine(hass)
    domain_data[DATA_ENGINE] = engine

    async def _engine_start(_event: object) -> None:
        await engine.async_start()

    # Build + sync once HA has finished starting (states settled). If HA is
    # already running (e.g. integration reload), this fires immediately.
    entry.async_on_unload(async_at_started(hass, _engine_start))

    @callback
    def _on_config_changed() -> None:
        # Debounced full refresh (rebuild + resubscribe + re-sync) so an edit
        # takes effect now, while a burst of saves coalesces into one rebuild.
        hass.async_create_task(engine.async_request_refresh())

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, _on_config_changed))
    entry.async_on_unload(engine.async_shutdown)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the config entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await hass.config_entries.async_unload_platforms(entry, [Platform.SWITCH])
    async_remove_panel(hass, _PANEL_URL, warn_if_unknown=False)
    hass.services.async_remove(DOMAIN, "apply_scene")
    async_unregister_commands(hass)
    hass.data.pop(DOMAIN, None)
    return True
