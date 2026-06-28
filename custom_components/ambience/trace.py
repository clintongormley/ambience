"""Evaluation tracing: cause/unit/event types, log formatting, and sinks.

`emit_trace` is the fan-out seam: a LogSink writes to the HA log, and a
BufferSink (Increment B) retains recent evaluations in memory for the websocket
read API. New sinks plug in here without re-instrumenting the engine.
"""

from __future__ import annotations

import logging
import secrets
from collections import deque
from dataclasses import dataclass, field, replace
from enum import StrEnum
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DATA_TRACE_BUFFER, DATA_TRACE_SINKS, DOMAIN, TRACE_BUFFER_SIZE
from .engine import Explanation
from .naming import category_names, scope_display_name

# "changes" stream — on whenever the integration's debug logging is on.
_LOGGER = logging.getLogger(f"{__package__}.trace")
# "all" stream — no-op evaluations. Defaulted quiet so the parent going DEBUG
# does NOT switch it on; the user raises this logger explicitly to opt in.
_NOOP_LOGGER = logging.getLogger(f"{__package__}.trace.noop")
if _NOOP_LOGGER.level == logging.NOTSET:  # pragma: no branch - import-time one-shot
    _NOOP_LOGGER.setLevel(logging.WARNING)


class CauseKind(StrEnum):
    """What kind of event triggered an evaluation. (StrEnum: compares and
    renders as its string value, so raw strings remain interchangeable.)"""

    ENTITY = "entity"
    CLOCK = "clock"
    SUN = "sun"
    # A `for:` duration recheck fired: a predicate's instant test has now held
    # long enough. A single-entity gate carries the entity, its held state, and
    # the human duration; a multi-entity gate has no single state to read, so it
    # carries the gate's label in `new` and leaves `entity_id` None.
    DURATION = "duration"
    # A periodic clock sweep re-rendered a wall-clock-dependent template (no
    # discrete boundary to schedule, no single entity to name).
    HAS_TIME = "has_time"
    SWITCH = "switch"
    MANUAL = "manual"
    STARTUP = "startup"
    # A config save (not an HA restart) triggered the rerun.
    RELOADED = "reloaded"
    # An idle-reapply timer fired: re-assert a unit's scene after inactivity.
    REAPPLY = "reapply"
    SIMULATED = "simulated"
    UNKNOWN = "unknown"


class Outcome(StrEnum):
    """What an evaluated (scope, category) unit did."""

    ACTED = "acted"
    # Won, but the scene has no actions to run (a pure blocker).
    NO_OP = "no_op"
    # Won with actions, but identical to the last applied winner — the redundant
    # re-fire is suppressed.
    DEBOUNCED = "debounced"
    NO_MATCH = "no_match"
    SKIPPED_SWITCH_OFF = "skipped_switch_off"
    SKIPPED_SCOPE_DISABLED = "skipped_scope_disabled"
    # The triggering change was an entity going unavailable/unknown — a
    # drop-out is not a real-world event worth re-applying for. Apply nothing.
    SKIPPED_UNAVAILABLE = "skipped_unavailable"


@dataclass(frozen=True)
class TriggerCause:
    """What caused an evaluation."""

    kind: CauseKind
    entity_id: str | None = None
    old: str | None = None
    new: str | None = None
    detail: str | None = None

    def describe(self) -> str:
        if self.kind == CauseKind.ENTITY:
            return f"{self.entity_id} changed {self.old!r} -> {self.new!r}"
        if self.kind == CauseKind.CLOCK:
            return f"clock {self.detail}"
        if self.kind == CauseKind.SUN:
            return f"sun {self.detail}"
        if self.kind == CauseKind.DURATION:
            # A single-entity gate names the entity and its held state; a
            # multi-entity gate (entity_id None) carries its label in `new`.
            if self.entity_id is None:
                return f"{self.new} for {self.detail}"
            return f"{self.entity_id} {self.new} for {self.detail}"
        if self.kind == CauseKind.HAS_TIME:
            return "periodic time check"
        if self.kind == CauseKind.SWITCH:
            return f"switch {self.entity_id} on"
        if self.kind == CauseKind.MANUAL:
            return "manual apply"
        if self.kind == CauseKind.STARTUP:
            return "startup sync"
        if self.kind == CauseKind.RELOADED:
            return "config reload"
        if self.kind == CauseKind.REAPPLY:
            return f"reapply ({self.detail})" if self.detail else "reapply"
        if self.kind == CauseKind.SIMULATED:
            return f"simulated {self.detail}" if self.detail else "simulated"
        return str(self.kind)


@dataclass(frozen=True)
class UnitTrace:
    """One (scope, category) unit's evaluation and outcome.

    `switch_state` and `actions` are populated by the engine wiring and carried
    for the structured trace record (consumed by the future ring buffer); the
    log formatter does not render them.
    """

    scope_kind: str
    scope_id: str | None
    category: str
    switch_state: str
    outcome: Outcome
    explanation: Explanation | None
    winner_name: str | None = None
    actions: list[dict[str, Any]] = field(default_factory=list)
    # Human category/scope names, resolved at emit time (logs show these in
    # preference to the opaque `category` id / raw scope id).
    category_name: str | None = None
    scope_name: str | None = None


@dataclass(frozen=True)
class TraceEvent:
    """One trigger event: a cause and every unit that re-evaluated.

    `event_id` is a short correlation tag assigned by `emit_trace`; every log
    line of the event carries it as a `[id]` prefix, so a tool that splits the
    record can still reconstruct which lines belong together. `timestamp` is an
    ISO-8601 UTC string, also assigned by `emit_trace`, for the ring buffer.
    """

    cause: TriggerCause
    units: list[UnitTrace]
    event_id: str | None = None
    timestamp: str | None = None


@dataclass(frozen=True)
class BufferedUnit:
    """One unit's evaluation as retained in the ring buffer, with the trigger
    context needed to display and correlate it."""

    event_id: str | None
    timestamp: str | None
    cause: TriggerCause
    unit: UnitTrace


# (scope_kind, scope_id, category) — the per-bucket key, the analog of one HA automation.
BucketKey = tuple[str, str | None, str]


class BufferSink:
    """A trace sink that retains the last `TRACE_BUFFER_SIZE` evaluations per
    `(scope, category)`. Always-on; in-memory; lost on restart. Single-threaded
    event loop => no locking.

    Bucket keys for scopes/categories that no longer exist are not pruned (each key's
    deque is bounded, and config categories are few and stable); revisit if needed.
    """

    def __init__(self) -> None:
        self._buckets: dict[BucketKey, deque[BufferedUnit]] = {}

    def emit(self, event: TraceEvent) -> None:
        for unit in event.units:
            key: BucketKey = (unit.scope_kind, unit.scope_id, unit.category)
            bucket = self._buckets.setdefault(key, deque(maxlen=TRACE_BUFFER_SIZE))
            bucket.append(BufferedUnit(event.event_id, event.timestamp, event.cause, unit))

    def records(self) -> list[BufferedUnit]:
        """All buffered units across buckets, newest-first (by timestamp)."""
        everything = [record for bucket in self._buckets.values() for record in bucket]
        return sorted(everything, key=lambda r: r.timestamp or "", reverse=True)

    def clear(self) -> None:
        self._buckets.clear()


def _cause_to_dict(cause: TriggerCause) -> dict[str, Any]:
    return {
        "kind": cause.kind,
        "entity_id": cause.entity_id,
        "old": cause.old,
        "new": cause.new,
        "detail": cause.detail,
    }


def _explanation_to_dict(explanation: Explanation | None) -> dict[str, Any] | None:
    if explanation is None:
        return None
    return {
        "winner_index": explanation.winner_index,
        "scenes": [
            {
                "index": scene.index,
                "name": scene.name,
                "matched": scene.matched,
                "evaluated": scene.evaluated,
                "disabled": scene.disabled,
                "predicates": [
                    {
                        "condition_key": p.condition_key,
                        "passed": p.passed,
                        "detail": p.detail,
                        "entity_ids": list(p.entity_ids),
                    }
                    for p in scene.predicates
                ],
            }
            for scene in explanation.scenes
        ],
    }


def buffered_unit_to_dict(record: BufferedUnit) -> dict[str, Any]:
    """A JSON-serializable view of one buffered unit, for the websocket API."""
    unit = record.unit
    return {
        "event_id": record.event_id,
        "timestamp": record.timestamp,
        "cause": _cause_to_dict(record.cause),
        "scope_kind": unit.scope_kind,
        "scope_id": unit.scope_id,
        "scope_name": unit.scope_name,
        "category": unit.category,
        "category_name": unit.category_name,
        "switch_state": unit.switch_state,
        "outcome": unit.outcome,
        "winner_name": unit.winner_name,
        "actions": unit.actions,
        "explanation": _explanation_to_dict(unit.explanation),
    }


def _scope_label(unit: UnitTrace) -> str:
    category = unit.category_name or unit.category
    scope = unit.scope_name or unit.scope_id or "-"
    return f"{unit.scope_kind}/{scope}/{category}"


def _format_action(action: dict[str, Any]) -> str:
    """One dispatched action as `service [target, …] {params}`."""
    parts = [str(action.get("service", "?"))]
    # Be tolerant of a hand-edited/malformed action: a bare-string entity_ids is
    # wrapped (not char-split), non-string ids are coerced, and any other shape
    # is skipped — so a bad action can't crash the trace log rendering.
    targets = action.get("entity_ids")
    if isinstance(targets, str):
        targets = [targets]
    if isinstance(targets, list) and targets:
        parts.append(f"[{', '.join(str(t) for t in targets)}]")
    params = action.get("params")
    if isinstance(params, dict) and params:
        # Log param KEYS only, never their values — action params can carry
        # secrets (alarm/lock codes, push tokens, message bodies) and trace debug
        # logs get pasted into issues. The full values stay available via the
        # admin-gated trace API. (redact.py can't be imported here — it imports
        # this module — so this is a local, allowlist-free scrub.) Only a dict is
        # introspected; any other (malformed) shape is skipped so it can't leak.
        parts.append("{" + ", ".join(sorted(map(str, params))) + "}")
    if action.get("unexposed"):
        parts.append("(skipped — not exposed)")
    return " ".join(parts)


def format_trace_event(event: TraceEvent) -> list[str]:
    """Render a trace event into log lines (header + per-unit/predicate/action)."""
    lines = [f"trigger: {event.cause.describe()}"]
    for unit in event.units:
        scope = _scope_label(unit)
        if unit.outcome == Outcome.SKIPPED_SWITCH_OFF:
            lines.append(f"  {scope}: skipped (switch off)")
            continue
        if unit.outcome == Outcome.SKIPPED_SCOPE_DISABLED:
            lines.append(f"  {scope}: skipped (scope disabled)")
            continue
        if unit.outcome == Outcome.SKIPPED_UNAVAILABLE:
            lines.append(f"  {scope}: skipped (went unavailable)")
            continue
        explanation = unit.explanation
        winner = ""
        if explanation is not None and explanation.winner_index is not None:
            # Scene numbers are shown 1-based; winner_index is the 0-based position.
            winner = f" -> scene #{explanation.winner_index + 1} {unit.winner_name!r}"
        elif explanation is None and unit.winner_name is not None:
            winner = f" -> {unit.winner_name!r}"
        lines.append(f"  {scope}: {unit.outcome}{winner}")
        if explanation is not None:
            for scene_eval in explanation.scenes:
                # Scene numbers are shown 1-based; index is the 0-based position.
                num = scene_eval.index + 1
                if scene_eval.disabled:
                    lines.append(f"      scene #{num} {scene_eval.name!r}: disabled")
                    continue
                if not scene_eval.evaluated:
                    lines.append(
                        f"      scene #{num} {scene_eval.name!r}: not evaluated (winner found)"
                    )
                    continue
                mark = "WON" if scene_eval.matched else "no"
                lines.append(f"      scene #{num} {scene_eval.name!r}: {mark}")
                for pred in scene_eval.predicates:
                    pmark = "pass" if pred.passed else "FAIL"
                    detail = f" [{pred.detail}]" if pred.detail else ""
                    lines.append(f"          {pred.condition_key}: {pmark}{detail}")
        for action in unit.actions:
            lines.append(f"      → {_format_action(action)}")
    if event.event_id:
        lines = [f"[{event.event_id}] {line}" for line in lines]
    return lines


_CHANGES_OUTCOMES = (Outcome.ACTED,)


class LogSink:
    """Renders trace events to the standard HA log.

    Units that dispatched actions (acted / re-applied) go to the `…trace`
    (changes) stream; no-op/no-match/switch-off units go to the `…trace.noop`
    (opt-in) stream. Each is gated on its own logger level so building a
    TraceEvent for a stream nobody watches is cheap.
    """

    def emit(self, event: TraceEvent) -> None:
        # One whole event = one log record (lines joined). Concurrent
        # evaluations therefore can't interleave their lines in the log; each
        # trigger is a single self-contained entry, and indentation within it
        # ties every line to its scope/category/scene. Partition only inside each
        # guard, so an off stream costs nothing.
        if _LOGGER.isEnabledFor(logging.DEBUG):
            changes = [u for u in event.units if u.outcome in _CHANGES_OUTCOMES]
            if changes:
                _LOGGER.debug("%s", "\n".join(format_trace_event(TraceEvent(event.cause, changes))))
        if _NOOP_LOGGER.isEnabledFor(logging.DEBUG):
            other = [u for u in event.units if u.outcome not in _CHANGES_OUTCOMES]
            if other:
                _NOOP_LOGGER.debug(
                    "%s", "\n".join(format_trace_event(TraceEvent(event.cause, other)))
                )


def tracing_active(hass: HomeAssistant) -> bool:
    """True if any trace consumer wants data — a registered ring buffer
    (always-on) or a trace logger at DEBUG — so building explanations (with
    `describe()`) is worth the cost. Returns False when nothing is listening."""
    if DATA_TRACE_BUFFER in hass.data.get(DOMAIN, {}):
        return True
    return _LOGGER.isEnabledFor(logging.DEBUG) or _NOOP_LOGGER.isEnabledFor(logging.DEBUG)


def _safe_scope_display_name(hass: HomeAssistant, unit: UnitTrace) -> str | None:
    """Best-effort friendly scope name; None when the registry isn't available
    (e.g. a bare test-double hass), so the label falls back to the raw id."""
    try:
        return scope_display_name(hass, unit.scope_kind, unit.scope_id)
    except Exception:  # noqa: BLE001 — a stub hass without registries must not crash tracing
        return None


def _resolve_names(hass: HomeAssistant, event: TraceEvent) -> TraceEvent:
    """Fill each unit's `category_name` (store id -> name) and `scope_name`
    (area/floor friendly name, 'House' for house) so logs show human names
    rather than opaque ids. Best-effort: leaves a name unresolved when the
    store/registry isn't available (e.g. test doubles)."""
    names = category_names(hass)
    units = [
        replace(
            u,
            category_name=names.get(u.category) or u.category_name,
            scope_name=_safe_scope_display_name(hass, u),
        )
        for u in event.units
    ]
    return replace(event, units=units)


def emit_trace(hass: HomeAssistant, event: TraceEvent) -> None:
    """Tag the event with a correlation id, resolve category names, and fan it out
    to every registered sink."""
    sinks = hass.data.get(DOMAIN, {}).get(DATA_TRACE_SINKS, ())
    if not sinks:
        return
    event = _resolve_names(hass, event)
    event = replace(event, event_id=secrets.token_hex(3), timestamp=dt_util.utcnow().isoformat())
    for sink in sinks:
        sink.emit(event)
