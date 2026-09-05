"""Constants for the Ambience integration."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .store import AmbienceStore

DOMAIN = "ambience"
STORAGE_KEY = "ambience"
STORAGE_VERSION = 1

# Structure version of the AI bundle (see ai_bundle.py). Bump ONLY when the
# bundle's shape changes incompatibly — the knowledge pack stamps this so the
# skill can refuse a bundle it's too old to read. Independent of the release
# version (which tracks features, not bundle shape).
AI_BUNDLE_VERSION = 1

MCP_PROTOCOL = 1
"""The backend↔MCP contract this install speaks.

NOT a semver, and not either of the two real ones (the integration's, or
ambience-mcp's). A single integer that bumps ONLY when the contract changes shape,
so Ambience can ship 1.2.0 -> 2.0.0 without touching the MCP server at all.

The `ambience-mcp` package ships one frozen adapter per protocol it supports and
loads the one named here. `bin/check_mcp_protocol.py` asserts an adapter for this
value exists in the repo; the release gate asserts one is published to PyPI.
"""

MIN_MCP_VERSION = "0.2.0-rc.3"
"""The oldest `ambience-mcp` this backend will serve.

The one thing MCP_PROTOCOL cannot express: "that build handshakes fine, but it is
known-broken — refuse it". A protocol number can only say the contract changed
shape; this can single out a bad release of an unchanged contract.

It can only refuse a client that ASKS. The floor is read in the MCP's `_negotiate`,
which runs only when the client sends `ambience/mcp/hello` — so it binds FUTURE
clients (every one of which handshakes), and cannot touch a PRE-handshake client. An
ambience-mcp older than the first handshake-capable release never asks: it connects,
authenticates, and calls `ambience/ai_bundle` / `ambience/ai_context` directly, and
this backend still answers those calls — though not byte-for-byte as before: the
payloads no longer carry the pre-handshake format stamps (`ambience_ai_context`,
`ambience_ai_bundle`) such a build read to warn about a too-new backend, so that
frozen client population is served UNCHECKED, and a future incompatible ai_context
reshape would be misread silently. That is the accepted cost of retiring the
per-payload tripwires in favour of the handshake. (The inverse pairing does refuse
itself: a handshake-capable client whose hello gets `unknown_command` concludes
"update Ambience" without this backend's help.)

So this value is deliberately inert today. It does NOT name the first
handshake-capable release — `mcp-v0.2.0-rc.3` is already tagged and published, and is
the last PRE-handshake build (no `protocols/` package, never sends
`ambience/mcp/hello`). The first release that actually speaks the handshake is
whatever this backend's own release publishes to `ambience-mcp`, and it will need a
newer version string than this one (0.2.0-rc.3 is taken). So this value names a
version BELOW the first handshake-capable release, which is what makes it refuse
nothing: any client able to read the floor already handshook successfully, so it is,
by construction, running something newer than this. That is the correct resting
state: a floor is a REFUSAL, and there is nothing to refuse yet.

Raising it is exactly as coupled to an MCP release as bumping MCP_PROTOCOL is: `uvx`
installs LATEST, so a floor above the newest PUBLISHED ambience-mcp refuses every user
and points them at a package that does not exist. Publish the ambience-mcp first, then
raise this to it (`bin/check_mcp_protocol.py` and `bin/release.sh` both enforce that;
see CONTRIBUTING.md).
"""

DATA_EXPOSED_ACTIONS = "exposed_actions"
DATA_CONDITIONS = "conditions"
DATA_PERIODS = "periods"
DATA_LUX_RANGES = "lux_ranges"
DATA_STORE = "store"

# Switch entity
DATA_SWITCHES = "switches"
DATA_SWITCH_ADD_ENTITIES = "switch_add_entities"

# Last-applied scene index: {(scope_kind, scope_id, category_id): scene_index}.
# Written by apply_scene; read by the auto-trigger engine's unchanged-scene guard.
DATA_LAST_APPLIED = "last_applied"

# Current matched scene index per (scope_kind, scope_id, category_id): the live
# "winner" the panel shows as a solid dot. None = no scene currently matches.
# Distinct from DATA_LAST_APPLIED (debounce-internal, wiped on a no-match).
DATA_LAST_MATCHED = "last_matched"

# Sticky "what's physically set" per unit: the scene index whose actions last
# executed. Never cleared on a no-match, so the panel can show a greyed dot for
# a scene that is still applied even though conditions have moved on.
DATA_LAST_APPLIED_SCENE = "last_applied_scene"

# Per-(scope_kind, scope_id, category_id) asyncio.Lock registry, shared by the
# trigger engine and the manual apply path (see service.apply_lock).
DATA_APPLY_LOCKS = "apply_locks"

# Auto-trigger engine instance.
DATA_ENGINE = "engine"
# Cached global action-overlap entity-id set (frozenset), so per-scope WS gets
# don't each re-scan every scope. Refreshed by reconcile_issues (on the same
# config-change / entity-registry signals that drive Repairs) and on save.
DATA_OVERLAP_SET = "overlap_set"
# Registered trace sinks — objects with an `emit(event)` method (see trace.py).
DATA_TRACE_SINKS = "trace_sinks"
# In-memory trace ring buffer (BufferSink) + its per-(scope,category) cap.
DATA_TRACE_BUFFER = "trace_buffer"
TRACE_BUFFER_SIZE = 5
# Key under hass.data[DOMAIN] holding the in-memory undo/redo ChangeHistory.
DATA_HISTORY = "history"

# Dispatcher signal — payload: tuple (scope_kind, scope_id) or None (global defaults changed)
SIGNAL_SWITCH_CONFIG_UPDATED = "ambience_switch_config_updated"

# Dispatcher signal — fired when scenes / condition config change, so the
# auto-trigger engine rebuilds its watch-set. Payload: the affected
# (scope_kind, scope_id) tuple, or None for a global change (reapply all).
SIGNAL_CONFIG_CHANGED = "ambience_config_changed"

# Dispatcher signal — fired after a unit's actions are dispatched (last-applied
# recorded). Payload: the (scope_kind, scope_id, category_id) unit. Drives the
# idle re-apply timer reset.
SIGNAL_UNIT_APPLIED = "ambience_unit_applied"

# Dispatcher signal — fired when the global re-apply settings change. Payload: None.
SIGNAL_REAPPLY_CONFIG_UPDATED = "ambience_reapply_config_updated"

# Dispatcher signal — fired when the voice-assistant exposure map changes (saved
# from the panel's Advanced page). Payload: None. The listener re-applies exposure
# to every live switch.
SIGNAL_EXPOSED_ASSISTANTS_UPDATED = "ambience_exposed_assistants_updated"

# Dispatcher signal — fired when a unit's live state (last_matched or
# last_applied_scene) changes. Payload: the (scope_kind, scope_id, category_id)
# unit. Drives the panel's live scene dots via ambience/live/subscribe.
SIGNAL_UNIT_LIVE = "ambience_unit_live"

# Dispatcher signal — fired when the undo/redo history changes. Payload:
# (op, scope_kind, scope_id) where op is "record" | "undo" | "redo". Drives the
# panel's undo/redo toolbar via ambience/history/subscribe.
SIGNAL_HISTORY_CHANGED = "ambience_history_changed"

# Bus event fired on each apply/run (see service_logbook + logbook.py). It is a
# *described* logbook event (not a bare logbook entry): describing it makes
# Ambience a recognised logbook context source, so the device changes dispatched
# under the same Context render as "triggered by '<category>/<scene>' (<switch>)",
# while the entry stays attached to the scope switch (area-filterable). Event
# data: {"message", "entity_id"}.
EVENT_AMBIENCE_ACTIVITY = "ambience_activity"

# How many scene-list changes the in-memory undo/redo stack retains.
HISTORY_LIMIT = 30

# Note: the idle re-apply defaults (DEFAULT_REAPPLY_ENABLED / *_INTERVAL_SECONDS /
# MIN_REAPPLY_INTERVAL_SECONDS) and DEFAULT_SWITCH_AUTO_ON_DELAY_SECONDS live in
# store.py, their only consumer — keeping them out of const avoids a CodeQL
# py/unsafe-cyclic-import false positive (const has a TYPE_CHECKING-only import of
# store for get_store's annotation).

# Defaults
DEFAULT_SWITCH_NAME = "Ambience"

# The category seeded on a fresh install. It is an ordinary category (renameable,
# deletable when it is not the last category) — these are only its initial values.
GENERAL_CATEGORY_ID = "general"
GENERAL_CATEGORY = {
    "id": GENERAL_CATEGORY_ID,
    "name": "General",
    "icon": "mdi:home",
    "color": "blue-grey",
}

# Options flow
CONF_SHOW_SIDEBAR_PANEL = "show_sidebar_panel"
DEFAULT_SHOW_SIDEBAR_PANEL = True

# Voice-assistant exposure. The per-assistant on/off map is stored in the
# Ambience store (store.DEFAULT_EXPOSED_ASSISTANTS) and edited on the panel's
# Advanced page. KNOWN_ASSISTANTS / ASSISTANT_FIELDS must stay key-aligned with
# store.DEFAULT_EXPOSED_ASSISTANTS (guarded by a store test).
# Pinned copy of homeassistant.components.homeassistant.exposed_entities.
# KNOWN_ASSISTANTS, Assist first. Update this if HA adds a new assistant
# (otherwise it would silently never be exposed).
KNOWN_ASSISTANTS = ("conversation", "cloud.google_assistant", "cloud.alexa")
# Assistant id -> dot-free key used on the websocket wire, in the frontend, and
# as the i18n / test key.
ASSISTANT_FIELDS = {
    "conversation": "expose_assist",
    "cloud.google_assistant": "expose_google",
    "cloud.alexa": "expose_alexa",
}

# hass.data key holding the Lovelace resource id registered for the card, so it
# can be removed on unload.
DATA_CARD_RESOURCE_ID = "card_resource_id"
# hass.data key holding the versioned card URL, needed by the add_extra_js_url
# fallback's removal on unload.
DATA_CARD_RESOURCE_URL = "card_resource_url"
# hass.data keys holding the served ambience-frontend.js content hash and the
# integration's manifest version, both stashed at setup so the
# ambience/frontend_version ws command is a pure in-memory read (no per-call
# integration lookup). The panel uses them to detect a stale cached bundle
# after an upgrade.
DATA_FRONTEND_HASH = "frontend_hash"
DATA_FRONTEND_VERSION = "frontend_version"

# Top-level hass.data key (deliberately NOT inside hass.data[DOMAIN], which
# unload pops) marking that the panel's static path is registered. The aiohttp
# resource it creates lives for the life of the HA process and cannot be
# removed, so it must be registered exactly once however often the entry
# reloads.
DATA_STATIC_PATHS_REGISTERED = "ambience_static_paths_registered"


def get_store(hass: HomeAssistant) -> AmbienceStore | None:
    """The Ambience store for this hass, or None when the integration isn't set
    up yet. Tolerant lookup for read paths that may run before/around setup;
    paths that require the store to exist still index ``hass.data`` directly."""
    return hass.data.get(DOMAIN, {}).get(DATA_STORE)
