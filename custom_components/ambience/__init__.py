"""The Ambience integration."""

from __future__ import annotations

import asyncio
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
from homeassistant.core import Event, HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.service import async_register_admin_service
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .card_resources import (
    async_register_card_resource,
    async_unregister_card_resource,
)
from .conditions.day import DayCondition
from .conditions.lux import LuxCondition
from .conditions.occupancy import OccupancyCondition
from .conditions.people import PeopleCondition
from .conditions.script import ScriptCondition
from .conditions.state import StateCondition
from .conditions.sun import SunCondition
from .conditions.template import TemplateCondition
from .conditions.time_of_day import TimeOfDayCondition
from .conditions.weather import WeatherCondition
from .config_health_issues import reconcile_issues
from .const import (
    CONF_EXPOSED_ASSISTANTS,
    CONF_SHOW_SIDEBAR_PANEL,
    DATA_CARD_RESOURCE_URL,
    DATA_CONDITIONS,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_EXPOSED_ASSISTANTS,
    DATA_LAST_APPLIED,
    DATA_LUX_RANGES,
    DATA_PERIODS,
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DATA_TRACE_BUFFER,
    DATA_TRACE_SINKS,
    DEFAULT_EXPOSED_ASSISTANTS,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
    SIGNAL_CONFIG_CHANGED,
    SIGNAL_SWITCH_CONFIG_UPDATED,
)
from .exposed_actions import ExposedActionsStore
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .service import async_apply_named_scene, async_apply_scene, clear_last_applied
from .store import AmbienceStore
from .switch import scope_for_unique_id
from .trace import BufferSink, LogSink
from .trigger_engine import AutoTriggerEngine
from .websocket import async_register_commands, async_unregister_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_PANEL_URL = "ambience"
_PANEL_STATIC_PATH = "/ambience-panel"
_PANEL_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-panel.js"
_CARD_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-card.js"


def _scene_requires_category(value: dict) -> dict:
    """Validator: a `scene` name may only be given together with a `category`."""
    if "scene" in value and "category" not in value:
        raise vol.Invalid("apply_scene: 'scene' requires 'category'")
    return value


_APPLY_SCENE_SCHEMA = vol.All(
    vol.Schema(
        {
            # The scope is chosen by its switch entity (house/floor/area each have
            # one); the handler resolves it back to (scope_kind, scope_id).
            vol.Required("scope"): cv.entity_id,
            vol.Optional("category"): cv.string,
            vol.Optional("scene"): cv.string,
            vol.Optional("force"): cv.boolean,
        }
    ),
    _scene_requires_category,
)


def _hash_bundle(bundle_path: Path) -> str:
    """Return a short content hash of *bundle_path*, or 'missing' if absent."""
    try:
        return hashlib.sha256(bundle_path.read_bytes()).hexdigest()[:12]
    except OSError:
        return "missing"


def _remove_scope_device(hass: HomeAssistant, scope_kind: str, scope_id: str) -> None:
    """Remove a floor/area scope's sub-device from the device registry."""
    from .switch import _device_identifiers

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device(identifiers=_device_identifiers(scope_kind, scope_id))
    if device is not None:
        dev_reg.async_remove_device(device.id)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = hass.data.setdefault(DOMAIN, {})
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

    lux_range_store = LuxRangeStore(store)
    domain_data[DATA_LUX_RANGES] = lux_range_store

    # The built-in conditions, keyed by their `name`. Conditions are an internal
    # implementation detail — there is deliberately no registration hook for
    # third-party conditions.
    domain_data[DATA_CONDITIONS] = {
        "time_of_day": TimeOfDayCondition(period_lookup=period_store.effective),
        "day": DayCondition(hass=hass),
        "lux": LuxCondition(hass=hass, range_lookup=lux_range_store.effective),
        "weather": WeatherCondition(hass=hass),
        "sun": SunCondition(hass=hass),
        "state": StateCondition(hass=hass),
        "occupancy": OccupancyCondition(hass=hass),
        "people": PeopleCondition(hass=hass),
        "script": ScriptCondition(hass=hass),
        "template": TemplateCondition(hass=hass),
    }

    async def _handle_apply_scene(call: ServiceCall) -> None:
        scope_entity_id = call.data["scope"]
        reg_entry = er.async_get(hass).async_get(scope_entity_id)
        scope = (
            scope_for_unique_id(reg_entry.unique_id)
            if reg_entry is not None and reg_entry.platform == DOMAIN
            else None
        )
        if scope is None:
            raise ServiceValidationError(f"{scope_entity_id!r} is not an Ambience scope switch")
        scope_kind, scope_id = scope
        category = call.data.get("category")
        scene = call.data.get("scene")
        force = call.data.get("force", False)
        if scene is not None:
            # Schema (_scene_requires_category) guarantees category is present here,
            # so index call.data directly to keep the category argument non-optional.
            await async_apply_named_scene(
                hass, scope_kind, scope_id, call.data["category"], scene, force=force
            )
        else:
            await async_apply_scene(hass, scope_kind, scope_id, category=category, force=force)

    # Admin-only: applying a scene dispatches real device service calls, so it must
    # not be reachable by non-admin users (HA services are not admin-gated by default).
    async_register_admin_service(
        hass,
        DOMAIN,
        "apply_scene",
        _handle_apply_scene,
        schema=_APPLY_SCENE_SCHEMA,
    )

    async_register_commands(hass)

    domain_data[DATA_EXPOSED_ASSISTANTS] = entry.options.get(
        CONF_EXPOSED_ASSISTANTS, DEFAULT_EXPOSED_ASSISTANTS
    )

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
        if action == "update":
            # An area rename must refresh the scope device names. The global
            # signal is a no-op for scopes whose name is unchanged.
            async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
            return
        if action == "remove":
            from .switch import switch_unique_id

            await store.async_delete_area(area_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("area", area_id), None)
            clear_last_applied(hass, "area", area_id)
            ent_reg = er.async_get(hass)
            ent_id = ent_reg.async_get_entity_id(
                "switch", DOMAIN, switch_unique_id("area", area_id)
            )
            if ent_id is not None:
                ent_reg.async_remove(ent_id)
            _remove_scope_device(hass, "area", area_id)

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
        if action == "update":
            # A floor rename must refresh the scope device names. The global
            # signal is a no-op for scopes whose name is unchanged.
            async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
            return
        if action == "remove":
            from .switch import switch_unique_id

            await store.async_delete_floor(floor_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("floor", floor_id), None)
            clear_last_applied(hass, "floor", floor_id)
            ent_reg = er.async_get(hass)
            ent_id = ent_reg.async_get_entity_id(
                "switch", DOMAIN, switch_unique_id("floor", floor_id)
            )
            if ent_id is not None:
                ent_reg.async_remove(ent_id)
            _remove_scope_device(hass, "floor", floor_id)

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
    bundle_hash, card_hash, frontend_hash = await asyncio.gather(
        hass.async_add_executor_job(_hash_bundle, bundle_path),
        hass.async_add_executor_job(_hash_bundle, card_path),
        hass.async_add_executor_job(_hash_bundle, frontend_path),
    )
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

    # Register the (tiny) card loader as a Lovelace resource so it loads AFTER
    # HA's scoped-custom-element-registry is installed (loading it earlier via
    # add_extra_js_url makes the card fail to resolve on a cold load — see
    # card_resources.py). The heavy frontend chunk is lazy-loaded by the card
    # only when it actually renders.
    domain_data[DATA_CARD_RESOURCE_URL] = card_url
    await async_register_card_resource(hass, _CARD_JS_URL, card_url)

    engine = AutoTriggerEngine(hass)
    domain_data[DATA_ENGINE] = engine

    async def _engine_start(_event: object) -> None:
        await engine.async_start()

    # Build + sync once HA has finished starting (states settled). If HA is
    # already running (e.g. integration reload), this fires immediately.
    entry.async_on_unload(async_at_started(hass, _engine_start))

    @callback
    def _on_config_changed(affected: tuple[str, str | None] | None = None) -> None:
        # Record what changed so the debounced refresh re-applies only that, then
        # request the (debounced) reload. A burst of saves coalesces into one
        # rebuild; their affected scopes accumulate.
        engine.note_config_changed(affected)
        hass.async_create_task(engine.async_request_refresh())

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, _on_config_changed))
    entry.async_on_unload(engine.async_shutdown)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    @callback
    def _reconcile_health(*_args: object) -> None:
        reconcile_issues(hass)

    # Run once states have settled, then on every config change and whenever the
    # entity registry changes (a fixed typo / a returned device clears its issue).
    entry.async_on_unload(async_at_started(hass, _reconcile_health))
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, _reconcile_health))
    entry.async_on_unload(
        hass.bus.async_listen(er.EVENT_ENTITY_REGISTRY_UPDATED, _reconcile_health)
    )

    return True


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the config entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, [Platform.SWITCH])
    if not unload_ok:
        # Entities are still live and reference hass.data[DOMAIN] — tearing the
        # rest down anyway would leave them pointing at a missing store.
        return False
    async_remove_panel(hass, _PANEL_URL, warn_if_unknown=False)
    card_url = hass.data.get(DOMAIN, {}).get(DATA_CARD_RESOURCE_URL, "")
    await async_unregister_card_resource(hass, card_url)
    hass.services.async_remove(DOMAIN, "apply_scene")
    async_unregister_commands(hass)
    hass.data.pop(DOMAIN, None)
    return True
