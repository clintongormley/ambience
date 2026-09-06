"""The Ambience integration."""

from __future__ import annotations

import asyncio
import hashlib
import logging
from pathlib import Path

from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from .builtin_services import (
    async_register_builtin_services,
    async_unregister_builtin_services,
)
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
from .conditions.unavailable import UnavailableCondition
from .conditions.weather import WeatherCondition
from .config_health_issues import reconcile_issues, referenced_entity_ids
from .const import (
    CONF_SHOW_SIDEBAR_PANEL,
    DATA_CARD_RESOURCE_URL,
    DATA_CONDITIONS,
    DATA_ENGINE,
    DATA_EXPOSED_ACTIONS,
    DATA_FRONTEND_HASH,
    DATA_FRONTEND_VERSION,
    DATA_HISTORY,
    DATA_LAST_APPLIED,
    DATA_LUX_RANGES,
    DATA_PERIODS,
    DATA_STATIC_PATHS_REGISTERED,
    DATA_STORE,
    DATA_SWITCH_ADD_ENTITIES,
    DATA_SWITCHES,
    DATA_SWITCHES_PENDING,
    DATA_TRACE_BUFFER,
    DATA_TRACE_SINKS,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
    SIGNAL_CONFIG_CHANGED,
    SIGNAL_EXPOSED_ASSISTANTS_UPDATED,
    SIGNAL_REAPPLY_CONFIG_UPDATED,
    SIGNAL_SWITCH_CONFIG_UPDATED,
    SIGNAL_UNIT_APPLIED,
    STORAGE_KEY,
    STORAGE_UNREADABLE_ISSUE,
    get_store,
)
from .errors import async_preload_translations
from .exposed_actions import ExposedActionsStore
from .exposure import async_reapply_all_switch_exposure
from .history import ChangeHistory
from .lux_ranges import LuxRangeStore
from .periods import PeriodStore
from .service import (
    clear_last_applied,
    clear_live_state,
)
from .services_meta import get_service_schema
from .store import SEEDED_BUILTIN_IDS, AmbienceStore
from .switch import _remove_scope_device
from .trace import BufferSink, LogSink
from .trigger_engine import AutoTriggerEngine
from .websocket import async_register_commands, async_unregister_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)

_PANEL_URL = "ambience"
_PANEL_STATIC_PATH = "/ambience-panel"
_PANEL_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-panel.js"
_CARD_JS_URL = f"{_PANEL_STATIC_PATH}/ambience-card.js"

# Coalesce a burst of config-health triggers (a multi-scope save, a device
# integration registering its entities) into one scan.
_HEALTH_DEBOUNCE_SECONDS = 1.0


def _hash_bundle(bundle_path: Path) -> str:
    """Return a short content hash of *bundle_path*, or 'missing' if absent."""
    try:
        return hashlib.sha256(bundle_path.read_bytes()).hexdigest()[:12]
    except OSError:
        return "missing"


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    # Warm the en.json read behind error rendering in the executor, alongside
    # the rest of setup rather than ahead of it. Awaited before the websocket
    # commands register: their error renderer is the only consumer, and it must
    # never do that read on the event loop.
    preload_translations = hass.async_create_task(async_preload_translations(hass))

    domain_data = hass.data.setdefault(DOMAIN, {})
    domain_data[DATA_SWITCHES] = {}
    # hass.data[DOMAIN] survives a setup that raised after this point, so a
    # pending-add claim left by the failed attempt would block that scope's
    # switch until its TTL expired.
    domain_data[DATA_SWITCHES_PENDING] = {}
    domain_data[DATA_LAST_APPLIED] = {}
    trace_buffer = BufferSink()
    domain_data[DATA_TRACE_BUFFER] = trace_buffer
    domain_data[DATA_TRACE_SINKS] = [LogSink(), trace_buffer]

    store = AmbienceStore(hass)
    await store.async_load()

    # A damaged file is left in place for recovery (store.async_load), so the
    # only other signal is one warning in the log — surface it in Repairs.
    if store.payload_unreadable:
        ir.async_create_issue(
            hass,
            DOMAIN,
            STORAGE_UNREADABLE_ISSUE,
            is_fixable=False,
            severity=ir.IssueSeverity.ERROR,
            translation_key=STORAGE_UNREADABLE_ISSUE,
            translation_placeholders={"path": f".storage/{STORAGE_KEY}"},
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, STORAGE_UNREADABLE_ISSUE)

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
    domain_data[DATA_HISTORY] = ChangeHistory(hass)

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
        "unavailable": UnavailableCondition(hass=hass),
        "script": ScriptCondition(hass=hass),
        "template": TemplateCondition(hass=hass),
    }

    async_register_builtin_services(hass)

    # Seeding (in store.async_load) runs before the services above are
    # registered, so it can't resolve their localized names. Now that they're
    # registered, backfill the seeded built-ins' labels from HA's service
    # catalog (uses the instance language, English fallback) — once, so a user
    # who later clears a label isn't fought. Skip the catalog lookups entirely
    # once labelled, so later starts don't pull catalog-building into setup.
    if not store.builtins_labeled():
        builtin_labels: dict[str, str] = {}
        for service_id in SEEDED_BUILTIN_IDS:
            schema = await get_service_schema(hass, service_id)
            name = schema.get("name") if schema else None
            if isinstance(name, str) and (label := name.strip()):
                builtin_labels[service_id] = label
        await store.async_apply_builtin_labels(builtin_labels)

    await hass.config_entries.async_forward_entry_setups(entry, [Platform.SWITCH])

    async def _handle_area_registry_update(event: Event) -> None:
        action = event.data["action"]
        area_id = event.data["area_id"]
        if action == "create":
            from .switch import make_scope_switch

            add_entities = domain_data.get(DATA_SWITCH_ADD_ENTITIES)
            area = area_reg.async_get_area(area_id)
            if add_entities is not None and area is not None:
                add_entities([make_scope_switch(hass, "area", area_id)])
            return
        if action == "update":
            # An area rename must refresh the scope device names. The global
            # signal is a no-op for scopes whose name is unchanged.
            async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
            return
        if action == "remove":
            from .switch import switch_registry_entry

            await store.async_delete_area(area_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("area", area_id), None)
            clear_last_applied(hass, "area", area_id)
            clear_live_state(hass, "area", area_id)
            switch_entry = switch_registry_entry(hass, "area", area_id)
            if switch_entry is not None:
                er.async_get(hass).async_remove(switch_entry.entity_id)
            _remove_scope_device(hass, entry.entry_id, "area", area_id)

    entry.async_on_unload(
        hass.bus.async_listen(ar.EVENT_AREA_REGISTRY_UPDATED, _handle_area_registry_update)
    )

    async def _handle_floor_registry_update(event: Event) -> None:
        action = event.data["action"]
        floor_id = event.data["floor_id"]
        if action == "create":
            from .switch import make_scope_switch

            add_entities = domain_data.get(DATA_SWITCH_ADD_ENTITIES)
            floor = floor_reg.async_get_floor(floor_id)
            if add_entities is not None and floor is not None:
                add_entities([make_scope_switch(hass, "floor", floor_id)])
            return
        if action == "update":
            # A floor rename must refresh the scope device names. The global
            # signal is a no-op for scopes whose name is unchanged.
            async_dispatcher_send(hass, SIGNAL_SWITCH_CONFIG_UPDATED, None)
            return
        if action == "remove":
            from .switch import switch_registry_entry

            await store.async_delete_floor(floor_id)
            domain_data.get(DATA_SWITCHES, {}).pop(("floor", floor_id), None)
            clear_last_applied(hass, "floor", floor_id)
            clear_live_state(hass, "floor", floor_id)
            switch_entry = switch_registry_entry(hass, "floor", floor_id)
            if switch_entry is not None:
                er.async_get(hass).async_remove(switch_entry.entity_id)
            _remove_scope_device(hass, entry.entry_id, "floor", floor_id)

    entry.async_on_unload(
        hass.bus.async_listen(fr.EVENT_FLOOR_REGISTRY_UPDATED, _handle_floor_registry_update)
    )

    # Serve the bundled JS from the integration's frontend/ directory.
    bundle_dir = Path(__file__).parent / "frontend"
    bundle_path = bundle_dir / "ambience-panel.js"
    if not hass.data.get(DATA_STATIC_PATHS_REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(_PANEL_STATIC_PATH, str(bundle_dir), False)]
        )
        hass.data[DATA_STATIC_PATHS_REGISTERED] = True

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
    domain_data[DATA_FRONTEND_HASH] = frontend_hash
    # Stash the manifest version once (the integration is loaded by now, so this
    # is a cached lookup) so the ws command needn't resolve it per call.
    integration = await async_get_integration(hass, DOMAIN)
    domain_data[DATA_FRONTEND_VERSION] = str(integration.version)
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
    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_UNIT_APPLIED, engine.note_unit_applied)
    )
    entry.async_on_unload(
        async_dispatcher_connect(
            hass, SIGNAL_REAPPLY_CONFIG_UPDATED, engine.note_reapply_config_changed
        )
    )

    @callback
    def _on_exposed_assistants_updated(_: object = None) -> None:
        async_reapply_all_switch_exposure(hass)

    entry.async_on_unload(
        async_dispatcher_connect(
            hass, SIGNAL_EXPOSED_ASSISTANTS_UPDATED, _on_exposed_assistants_updated
        )
    )
    entry.async_on_unload(engine.async_shutdown)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    # The entity ids any scope references, kept current so the registry listener
    # can reject the flood of events about entities Ambience never mentions.
    health_refs = referenced_entity_ids(hass)

    async def _reconcile_health() -> None:
        reconcile_issues(hass)

    health_debouncer = Debouncer(
        hass,
        _LOGGER,
        cooldown=_HEALTH_DEBOUNCE_SECONDS,
        immediate=False,
        function=_reconcile_health,
    )
    entry.async_on_unload(health_debouncer.async_shutdown)

    @callback
    def _health_on_started(_event: object) -> None:
        reconcile_issues(hass)

    @callback
    def _health_on_config_changed(*_args: object) -> None:
        nonlocal health_refs
        health_refs = referenced_entity_ids(hass)
        health_debouncer.async_schedule_call()

    @callback
    def _health_event_filter(data: er.EventEntityRegistryUpdatedData) -> bool:
        # A rename fires under the new id, so the old one must match too —
        # otherwise renaming a referenced entity away never clears its issue.
        return data["entity_id"] in health_refs or data.get("old_entity_id") in health_refs

    @callback
    def _health_on_registry_updated(_event: Event) -> None:
        health_debouncer.async_schedule_call()

    # Run once states have settled, then on every config change and whenever a
    # referenced entity's registry entry changes (a fixed typo / a returned
    # device clears its issue).
    entry.async_on_unload(async_at_started(hass, _health_on_started))
    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_CONFIG_CHANGED, _health_on_config_changed)
    )
    entry.async_on_unload(
        hass.bus.async_listen(
            er.EVENT_ENTITY_REGISTRY_UPDATED,
            _health_on_registry_updated,
            event_filter=_health_event_filter,
        )
    )

    # Last: the commands read hass.data[DOMAIN], so none may be servable before
    # every key (the engine included) is in place, and the en.json pre-warm must
    # have finished — the ws error renderer must never do that read on the loop.
    # (`asyncio.gather` and not a bare `await preload_translations`: CodeQL reads
    # a lone `await <name>` statement as having no effect.)
    await asyncio.gather(preload_translations)
    async_register_commands(hass)

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
    async_unregister_builtin_services(hass)
    async_unregister_commands(hass)
    # Flush any pending delayed store save before dropping our reference, so a
    # subsequent removal can't be resurrected by a late write from this instance
    # (see AmbienceStore.async_flush). Only runs on a clean unload.
    store = get_store(hass)
    if store is not None:
        await store.async_flush()
    hass.data.pop(DOMAIN, None)
    return True


async def async_remove_entry(hass: HomeAssistant, _entry: ConfigEntry) -> None:
    """Delete persisted Ambience data when the integration is removed.

    HA calls this only on a genuine delete — never on reload/restart/unload — so
    wiping the single global store (`.storage/ambience`) here makes delete-and-
    recreate behave like a fresh install instead of resurrecting the old config.
    """
    await AmbienceStore(hass).async_remove()
    # HA's config-entry cleanup clears the device and entity registries but not
    # the issue registry, so drop any Ambience repairs issues too — otherwise a
    # deleted integration leaves stale warnings in Settings -> Repairs.
    registry = ir.async_get(hass)
    for domain, issue_id in list(registry.issues):
        if domain == DOMAIN:
            ir.async_delete_issue(hass, DOMAIN, issue_id)
