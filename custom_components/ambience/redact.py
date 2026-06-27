"""Shared redaction for the diagnostics dump and the AI bundle.

Both exports leave the household's home over the wire (a GitHub issue, an AI
chat), so they MUST scrub the same presence/location PII. Keeping the rules in
one module means the AI bundle and `diagnostics.py` can never drift apart on
what gets blanked.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import REDACTED, async_redact_data
from homeassistant.core import HomeAssistant

from .const import DATA_TRACE_BUFFER, DOMAIN
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
# rendered template. Scrubbed by redact_trace below.
PRESENCE_PREFIXES = ("person.", "device_tracker.")
_DETAIL_REDACTED_CONDITIONS = {"people", "template"}


def redact(data: Any) -> Any:
    """Redact the location-revealing keys in `TO_REDACT` from a config payload."""
    return async_redact_data(data, TO_REDACT)


def redact_predicate(predicate: dict[str, Any]) -> dict[str, Any]:
    """Blank a people/template predicate's free-text detail (it renders each
    person's location / the rendered template), and scrub presence-revealing
    entity_ids (person./device_tracker.) from the predicate's `entity_ids` —
    the same identifiers redact_trace removes from causes. A people predicate
    carries person.* ids there; any predicate may reference a device_tracker."""
    out = predicate
    if out.get("condition_key") in _DETAIL_REDACTED_CONDITIONS and out.get("detail"):
        out = {**out, "detail": REDACTED}
    eids = out.get("entity_ids")
    if eids and any(e.startswith(PRESENCE_PREFIXES) for e in eids):
        out = {
            **out,
            "entity_ids": [REDACTED if e.startswith(PRESENCE_PREFIXES) else e for e in eids],
        }
    return out


def redact_trace(trace: dict[str, Any]) -> dict[str, Any]:
    """Scrub presence PII from one serialised trace record (see above)."""
    out = dict(trace)
    cause = dict(trace.get("cause") or {})
    entity_id = cause.get("entity_id")
    if isinstance(entity_id, str) and entity_id.startswith(PRESENCE_PREFIXES):
        for key in ("entity_id", "old", "new"):
            if cause.get(key) is not None:
                cause[key] = REDACTED
    out["cause"] = cause
    explanation = trace.get("explanation")
    if isinstance(explanation, dict):
        scenes = []
        for scene in explanation.get("scenes", []):
            predicates = [redact_predicate(p) for p in scene.get("predicates", [])]
            scenes.append({**scene, "predicates": predicates})
        out["explanation"] = {**explanation, "scenes": scenes}
    return out


def buffer_records(hass: HomeAssistant) -> list[BufferedUnit]:
    """The buffered trace records, or [] when no buffer has been populated."""
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    return buffer.records() if buffer is not None else []


def redacted_traces(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Every buffered trace, serialised and fully redacted."""
    return async_redact_data(
        [redact_trace(buffered_unit_to_dict(r)) for r in buffer_records(hass)], TO_REDACT
    )
