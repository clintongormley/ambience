"""Shared redaction for the diagnostics dump and the AI bundle.

Both exports leave the household's home over the wire (a GitHub issue, an AI
chat), so they MUST scrub the same presence/location PII. Keeping the rules in
one module means the AI bundle and `diagnostics.py` can never drift apart on
what gets blanked.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from homeassistant.components.diagnostics import REDACTED, async_redact_data
from homeassistant.core import HomeAssistant

from .const import DATA_TRACE_BUFFER, DOMAIN
from .trace import BufferedUnit, CauseKind, buffered_unit_to_dict

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
# a person/device_tracker cause carries zone names in old/new, and these four
# condition describes render presence/location by name or implication: `people`
# (who is home, by NAME) and `template` (arbitrary rendered state) render a
# person's location; `unavailable` renders the friendly names of currently-down
# entities, which can include a device_tracker (e.g. "Alice's Phone"); `occupancy`
# renders which rooms are occupied right now. Scrubbed below by redact_trace (via
# redact_predicate) and by redact_plan, which checks this set directly for
# snapshots_described and reuses redact_predicate only for its optional explanation.
PRESENCE_PREFIXES = ("person.", "device_tracker.")
_DETAIL_REDACTED_CONDITIONS = {"people", "template", "unavailable", "occupancy"}

# Action params for these service domains can carry secrets — alarm codes, lock
# PINs — that must not ride into an export. Redacted by VALUE wherever an action
# surfaces (scene actions in the store dump, dispatched actions in traces).
_SECURITY_ACTION_DOMAINS = ("alarm_control_panel.", "lock.")

# Exposed-action default VALUES under these field names can carry secrets/PII
# (notification bodies, push tokens, recipients, phone numbers). Key-based
# async_redact_data can't reach these per-action nested defaults, so they're
# scrubbed by value.
_SENSITIVE_DEFAULT_FIELDS = {
    "message",
    "title",
    "data",
    "target",
    "token",
    "api_key",
    "password",
    "credentials",
    "code",
    "pin",
    "phone_number",
}


def _has_presence(eids: Any) -> bool:
    """True if `eids` contains a presence entity (person./device_tracker.)."""
    return bool(eids) and any(isinstance(e, str) and e.startswith(PRESENCE_PREFIXES) for e in eids)


def redact(data: Any) -> Any:
    """Redact the location-revealing keys in `TO_REDACT` from a config payload."""
    return async_redact_data(data, TO_REDACT)


def redact_action(action: dict[str, Any]) -> dict[str, Any]:
    """Blank the param VALUES of a security-domain action (alarm/lock) — an
    alarm code or lock PIN must not leave the home. Non-security actions and
    actions without params are returned unchanged. Handles both the old
    `service` key and the new `action` key for the service id."""
    if not isinstance(action, dict):
        return action
    service = action.get("service") or action.get("action")
    params = action.get("params")
    if (
        isinstance(service, str)
        and service.startswith(_SECURITY_ACTION_DOMAINS)
        and isinstance(params, dict)
        and params
    ):
        return {**action, "params": dict.fromkeys(params, REDACTED)}
    return action


def redact_exposed_action(entry: dict[str, Any]) -> dict[str, Any]:
    """Blank sensitive default VALUES of one exposed-action entry (tokens,
    recipients, message bodies). Field names, ids and visible_fields are kept so
    an AI/contributor still sees the action's shape."""
    if not isinstance(entry, dict):
        return entry
    defaults = entry.get("defaults")
    if not isinstance(defaults, dict) or not any(k in _SENSITIVE_DEFAULT_FIELDS for k in defaults):
        return entry
    return {
        **entry,
        "defaults": {
            k: (REDACTED if k in _SENSITIVE_DEFAULT_FIELDS else v) for k, v in defaults.items()
        },
    }


def _redact_presence_strings(node: Any) -> Any:
    """A copy of `node` with every presence entity id (person./device_tracker.)
    blanked, recursing through dicts and lists. Run over a scene's `when` block so
    a condition that references a presence entity directly — a `state` rule
    testing a person's zone, an `unavailable` rule on a device_tracker — can't
    leak that entity (and the location it implies) into an export. The `people`
    predicate's own `who`/`where` are already blanked by key (see TO_REDACT); this
    catches the presence ids riding in other predicates' entity_id/entities
    fields, which a key-based scrub can't reach."""
    if isinstance(node, str):
        return REDACTED if node.startswith(PRESENCE_PREFIXES) else node
    if isinstance(node, dict):
        return {k: _redact_presence_strings(v) for k, v in node.items()}
    if isinstance(node, list):
        return [_redact_presence_strings(v) for v in node]
    return node


def _redact_scene(scene: Any) -> Any:
    """A copy of one scene with its action params redacted and presence entity ids
    scrubbed from its `when` conditions. Defensive: a scene of an unexpected shape
    (non-dict, or `actions`/`when` not of the expected type) has those parts
    passed through unchanged rather than coerced — these run on export payloads
    that may be hand-edited."""
    if not isinstance(scene, dict):
        return scene
    out = scene
    if isinstance(scene.get("actions"), list):
        out = {**out, "actions": [redact_action(a) for a in scene["actions"]]}
    if isinstance(out.get("when"), dict):
        out = {**out, "when": _redact_presence_strings(out["when"])}
    return out


def redact_scene_actions(scope_config: Any) -> Any:
    """Return a copy of one scope's config with every scene's actions redacted.
    A non-dict config, or one whose `scenes` isn't a list, is passed through."""
    if not isinstance(scope_config, dict) or not isinstance(scope_config.get("scenes"), list):
        return scope_config
    return {**scope_config, "scenes": [_redact_scene(s) for s in scope_config["scenes"]]}


def map_scope_configs(config: dict[str, Any], fn: Callable[[Any], Any]) -> dict[str, Any]:
    """A shallow copy of `config` with `fn` applied to every area/floor/house
    scope config (the same `areas`/`floors`/`house` shape `store.as_dict()`
    dumps). Shared by `redact_store` (transform: `redact_scene_actions`) and
    `ai_context._thin_config` (transform: `_thin_scope`) so the two exports
    can't drift on which scopes get walked. Never mutates `config`."""
    out = dict(config)
    for container_key in ("areas", "floors"):
        container = out.get(container_key)
        if isinstance(container, dict):
            out[container_key] = {sid: fn(cfg) for sid, cfg in container.items()}
    if isinstance(out.get("house"), dict):
        out["house"] = fn(out["house"])
    return out


def redact_store(dump: Any) -> Any:
    """Full store redaction for the diagnostics dump and the AI bundle config:
    the key-based presence/location scrub of `redact`, PLUS the value-based
    secret scrub of security-domain scene-action params and sensitive
    exposed-action defaults. Operates on a copy; never mutates the input."""
    out = redact(dump)
    if not isinstance(out, dict):
        return out
    out = map_scope_configs(out, redact_scene_actions)
    if isinstance(out.get("exposed_actions"), list):
        out["exposed_actions"] = [redact_exposed_action(e) for e in out["exposed_actions"]]
    return out


# The panel-only half of a predicate's detail: a `trace_reason` key plus its
# placeholders, which only the panel's bundle can render. Dropped from every
# redacted predicate — a redacted trace is the EXTERNAL view (MCP, diagnostics,
# AI bundle), and every external reader takes the English `detail`. Dropping
# rather than nulling is load-bearing twice over: the placeholders repeat the
# very names a blanked detail hid, and the MCP's `traces_list`/`dry_run` payload
# shape is frozen per protocol (tests/test_protocol_shape.py), so a
# panel-presentation field must not appear in it at all.
_PANEL_DETAIL_KEYS = ("detail_key", "detail_placeholders")


def redact_predicate(predicate: dict[str, Any]) -> dict[str, Any]:
    """Blank a predicate's free-text detail, drop its panel-only localisation
    hints, and scrub presence-revealing entity_ids (person./device_tracker.).
    Detail is blanked for conditions in `_DETAIL_REDACTED_CONDITIONS`
    (people/template/unavailable/occupancy — each renders presence or location
    by name or implication) AND for any predicate that references a presence
    entity directly — e.g. a `state` rule on a person renders the live location
    in its detail."""
    out = predicate
    if any(k in out for k in _PANEL_DETAIL_KEYS):
        out = {k: v for k, v in out.items() if k not in _PANEL_DETAIL_KEYS}
    eids = out.get("entity_ids")
    presence = _has_presence(eids)
    if out.get("detail") and (out.get("condition_key") in _DETAIL_REDACTED_CONDITIONS or presence):
        out = {**out, "detail": REDACTED}
    if presence:
        out = {
            **out,
            "entity_ids": [
                REDACTED if (isinstance(e, str) and e.startswith(PRESENCE_PREFIXES)) else e
                for e in eids
            ],
        }
    return out


def _redact_actions(actions: list[Any]) -> list[Any]:
    """Every action in `actions` run through `redact_action`. Shared by
    `redact_trace` and `redact_plan` so the same action-list scrub isn't
    duplicated between them."""
    return [redact_action(a) for a in actions]


def _redact_explanation(explanation: dict[str, Any]) -> dict[str, Any]:
    """A copy of an `Explanation` dict with every scene's predicates run through
    `redact_predicate`. Shared by `redact_trace` and `redact_plan` so the same
    `explanation` shape — reachable via a serialised trace OR a dry-run plan
    with `explain=True` — is scrubbed identically on both doors rather than
    risking drift between two copies of the same walk."""
    scenes = []
    for scene in explanation.get("scenes", []):
        predicates = [redact_predicate(p) for p in scene.get("predicates", [])]
        scenes.append({**scene, "predicates": predicates})
    return {**explanation, "scenes": scenes}


def redact_plan(plan: Any) -> Any:
    """Scrub one resolve/dry-run plan (the `async_resolve_only` shape): the
    winning scene's security action params (alarm codes, lock PINs — the same
    value scrub as `redact_action`), the presence/location-revealing condition
    describes in `snapshots_described` (`people` renders who is home by NAME;
    `template` renders arbitrary rendered state; `unavailable` renders the
    friendly names of currently-down entities, which can include a
    device_tracker; `occupancy` renders which rooms are occupied right now —
    see `_DETAIL_REDACTED_CONDITIONS`), and — should this path ever be called
    with `explain=True` — the same per-predicate detail/entity_ids scrub
    `redact_trace` applies to a serialised trace's `explanation`, via
    `redact_predicate`. Other describes (sun, lux, period…) carry no PII and
    are kept. Never mutates the input; unexpected shapes pass through
    unchanged."""
    if not isinstance(plan, dict):
        return plan
    out = dict(plan)
    if isinstance(out.get("actions"), list):
        out["actions"] = _redact_actions(out["actions"])
    described = out.get("snapshots_described")
    if isinstance(described, dict):
        out["snapshots_described"] = {
            name: (REDACTED if name in _DETAIL_REDACTED_CONDITIONS and desc is not None else desc)
            for name, desc in described.items()
        }
    if isinstance(out.get("explanation"), dict):
        out["explanation"] = _redact_explanation(out["explanation"])
    return out


def redact_trace(trace: dict[str, Any]) -> dict[str, Any]:
    """Scrub presence PII and secrets from one serialised trace record: presence
    causes (old/new zone names), the multi-entity `for:` gate label, security
    action params, and the per-predicate detail/entity_ids."""
    out = dict(trace)
    cause = dict(trace.get("cause") or {})
    entity_id = cause.get("entity_id")
    if isinstance(entity_id, str) and entity_id.startswith(PRESENCE_PREFIXES):
        for key in ("entity_id", "old", "new"):
            if cause.get(key) is not None:
                cause[key] = REDACTED
    elif (
        cause.get("kind") == CauseKind.DURATION
        and entity_id is None
        and cause.get("new") is not None
    ):
        # A multi-entity duration gate carries its label in `new`; a people
        # gate's label embeds the raw zone ("anybody in zone.work"). There's no
        # entity_id to prefix-match and the dict carries no condition, so blank
        # the label outright (`detail` is a plain human duration, kept). This
        # over-redacts a benign occupancy count label — acceptable for safety.
        cause["new"] = REDACTED
    out["cause"] = cause
    if isinstance(out.get("actions"), list):
        out["actions"] = _redact_actions(out["actions"])
    if isinstance(out.get("explanation"), dict):
        out["explanation"] = _redact_explanation(out["explanation"])
    return out


def buffer_records(hass: HomeAssistant) -> list[BufferedUnit]:
    """The buffered trace records, or [] when no buffer has been populated."""
    buffer = hass.data.get(DOMAIN, {}).get(DATA_TRACE_BUFFER)
    return buffer.records() if buffer is not None else []


def redacted_traces(
    hass: HomeAssistant, records: list[BufferedUnit] | None = None
) -> list[dict[str, Any]]:
    """Buffered traces, serialised and fully redacted.

    Defaults to every buffered trace (`buffer_records(hass)`); pass `records`
    to redact a specific subset (e.g. `ambience/traces/list`'s already-limited
    page, or `scope_diagnostics`'s per-unit filter) through this SAME rule
    rather than duplicating it at the call site.
    """
    if records is None:
        records = buffer_records(hass)
    return async_redact_data([redact_trace(buffered_unit_to_dict(r)) for r in records], TO_REDACT)
