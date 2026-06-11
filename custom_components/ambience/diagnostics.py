"""Diagnostics support for Ambience.

Implementing both handlers makes Home Assistant render a "Download diagnostics"
link on the integration page (config entry) and on the Ambience device page
(device). All of Ambience's configuration lives in :class:`AmbienceStore`, so
both dumps return the full persisted store with location-revealing fields
redacted.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import REDACTED, async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry

from .const import DATA_STORE, DATA_TRACE_BUFFER, DOMAIN
from .trace import BufferedUnit, buffered_unit_to_dict

# Keys whose values can reveal where people live or go: the workday/calendar
# sensors a household keys off, the configured weather entity, and the
# person/zone references and free-form templates carried by `people`/`template`
# scene predicates. Redacting by key keeps the scene structure intact.
TO_REDACT = {
    "workday_sensor",
    "workday_calendar",
    "entity",
    "who",
    "where",
    "template",
}

# Presence PII also rides in trace free text outside the structured keys above:
# a person/device_tracker cause carries zone names in old/new, and the people/
# template predicate `detail` strings render each person's location / the
# rendered template. Scrubbed by _redact_trace below.
_PRESENCE_PREFIXES = ("person.", "device_tracker.")
_DETAIL_REDACTED_CONDITIONS = {"people", "template"}


def _redact_predicate(predicate: dict[str, Any]) -> dict[str, Any]:
    """Blank a people/template predicate's free-text detail (it renders each
    person's location / the rendered template), and scrub presence-revealing
    entity_ids (person./device_tracker.) from the predicate's `entity_ids` —
    the same identifiers _redact_trace removes from causes. A people predicate
    carries person.* ids there; any predicate may reference a device_tracker."""
    out = predicate
    if out.get("condition_key") in _DETAIL_REDACTED_CONDITIONS and out.get("detail"):
        out = {**out, "detail": REDACTED}
    eids = out.get("entity_ids")
    if eids and any(e.startswith(_PRESENCE_PREFIXES) for e in eids):
        out = {
            **out,
            "entity_ids": [REDACTED if e.startswith(_PRESENCE_PREFIXES) else e for e in eids],
        }
    return out


def _redact_trace(trace: dict[str, Any]) -> dict[str, Any]:
    """Scrub presence PII from one serialised trace record (see above)."""
    out = dict(trace)
    cause = dict(trace.get("cause") or {})
    entity_id = cause.get("entity_id")
    if isinstance(entity_id, str) and entity_id.startswith(_PRESENCE_PREFIXES):
        for key in ("entity_id", "old", "new"):
            if cause.get(key) is not None:
                cause[key] = REDACTED
    out["cause"] = cause
    explanation = trace.get("explanation")
    if isinstance(explanation, dict):
        scenes = []
        for scene in explanation.get("scenes", []):
            predicates = [_redact_predicate(p) for p in scene.get("predicates", [])]
            scenes.append({**scene, "predicates": predicates})
        out["explanation"] = {**explanation, "scenes": scenes}
    return out


def _buffer_records(hass: HomeAssistant) -> list[BufferedUnit]:
    """The buffered trace records, or [] when no buffer has been populated."""
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    return buffer.records() if buffer is not None else []


def _traces_dump(hass: HomeAssistant) -> list[dict[str, Any]]:
    return async_redact_data(
        [_redact_trace(buffered_unit_to_dict(r)) for r in _buffer_records(hass)], TO_REDACT
    )


def _store_dump(hass: HomeAssistant) -> dict[str, Any]:
    store = hass.data[DOMAIN][DATA_STORE]
    dump = async_redact_data(store.as_dict(), TO_REDACT)
    dump["traces"] = _traces_dump(hass)
    return dump


def scope_diagnostics(
    hass: HomeAssistant, scope_kind: str, scope_id: str | None, category: str
) -> dict[str, Any]:
    """A focused diagnostic bundle for one (scope, category): that scope's config,
    the global context needed to read it, and that unit's buffered traces — all
    redacted."""
    store = hass.data[DOMAIN][DATA_STORE]
    mine = [
        r
        for r in _buffer_records(hass)
        if r.unit.scope_kind == scope_kind
        and r.unit.scope_id == scope_id
        and r.unit.category == category
    ]
    payload = {
        "scope": {
            "scope_kind": scope_kind,
            "scope_id": scope_id,
            "category": category,
            "config": store.scope_config(scope_kind, scope_id),
        },
        "context": {
            "categories": store.categories(),
            "conditions": store.get_conditions(),
        },
        "traces": [_redact_trace(buffered_unit_to_dict(r)) for r in mine],
    }
    return async_redact_data(payload, TO_REDACT)


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for the config entry."""
    return _store_dump(hass)


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry, device: DeviceEntry
) -> dict[str, Any]:
    """Return diagnostics for an Ambience device.

    Ambience has one device per scope (the main service device plus per-floor and
    per-area sub-devices), but they all share the one store, so every device dump
    is the same redacted store as the config-entry dump.
    """
    return _store_dump(hass)
