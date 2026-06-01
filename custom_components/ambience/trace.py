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
from typing import Any, Protocol

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DATA_TRACE_BUFFER, DATA_TRACE_SINKS, DOMAIN, TRACE_BUFFER_SIZE
from .engine import Explanation
from .naming import group_names, scope_display_name

# "changes" stream — on whenever the integration's debug logging is on.
_LOGGER = logging.getLogger(f"{__package__}.trace")
# "all" stream — no-op evaluations. Defaulted quiet so the parent going DEBUG
# does NOT switch it on; the user raises this logger explicitly to opt in.
_NOOP_LOGGER = logging.getLogger(f"{__package__}.trace.noop")
if _NOOP_LOGGER.level == logging.NOTSET:
    _NOOP_LOGGER.setLevel(logging.WARNING)


class CauseKind(StrEnum):
    """What kind of event triggered an evaluation. (StrEnum: compares and
    renders as its string value, so raw strings remain interchangeable.)"""

    ENTITY = "entity"
    CLOCK = "clock"
    SUN = "sun"
    HAS_TIME = "has_time"
    SWITCH = "switch"
    MANUAL = "manual"
    STARTUP = "startup"
    REAPPLY = "reapply"
    UNKNOWN = "unknown"


class Outcome(StrEnum):
    """What an evaluated (scope, group) unit did."""

    ACTED = "acted"
    NO_OP = "no_op"
    NO_MATCH = "no_match"
    SKIPPED_SWITCH_OFF = "skipped_switch_off"
    # A periodic re-apply re-fired the current winner's due actions without
    # re-resolving; routed to the changes stream alongside ACTED.
    REAPPLIED = "reapplied"


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
        if self.kind == CauseKind.HAS_TIME:
            return f"duration recheck ({self.detail})" if self.detail else "duration recheck"
        if self.kind == CauseKind.SWITCH:
            return f"switch {self.entity_id} on"
        if self.kind == CauseKind.MANUAL:
            return "manual apply_scene"
        if self.kind == CauseKind.STARTUP:
            return "startup sync"
        if self.kind == CauseKind.REAPPLY:
            return f"reapply ({self.detail})" if self.detail else "reapply"
        return str(self.kind)


@dataclass(frozen=True)
class UnitTrace:
    """One (scope, group) unit's evaluation and outcome.

    `switch_state` and `actions` are populated by the engine wiring and carried
    for the structured trace record (consumed by the future ring buffer); the
    log formatter does not render them.
    """

    scope_kind: str
    scope_id: str | None
    group: str
    switch_state: str
    outcome: Outcome
    explanation: Explanation | None
    winner_name: str | None = None
    actions: list[dict[str, Any]] = field(default_factory=list)
    # Human group/scope names, resolved at emit time (logs show these in
    # preference to the opaque `group` id / raw scope id).
    group_name: str | None = None
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


# (scope_kind, scope_id, group) — the per-bucket key, the analog of one HA automation.
BucketKey = tuple[str, str | None, str]


class BufferSink:
    """A trace sink that retains the last `TRACE_BUFFER_SIZE` evaluations per
    `(scope, group)`. Always-on; in-memory; lost on restart. Single-threaded
    event loop => no locking.

    Bucket keys for scopes/groups that no longer exist are not pruned (each key's
    deque is bounded, and config groups are few and stable); revisit if needed.
    """

    def __init__(self) -> None:
        self._buckets: dict[BucketKey, deque[BufferedUnit]] = {}

    def emit(self, event: TraceEvent) -> None:
        for unit in event.units:
            key: BucketKey = (unit.scope_kind, unit.scope_id, unit.group)
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
        "rules": [
            {
                "index": rule.index,
                "name": rule.name,
                "matched": rule.matched,
                "evaluated": rule.evaluated,
                "disabled": rule.disabled,
                "predicates": [
                    {"matcher_key": p.matcher_key, "passed": p.passed, "detail": p.detail}
                    for p in rule.predicates
                ],
            }
            for rule in explanation.rules
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
        "group": unit.group,
        "group_name": unit.group_name,
        "switch_state": unit.switch_state,
        "outcome": unit.outcome,
        "winner_name": unit.winner_name,
        "actions": unit.actions,
        "explanation": _explanation_to_dict(unit.explanation),
    }


def _scope_label(unit: UnitTrace) -> str:
    group = unit.group_name or unit.group
    scope = unit.scope_name or unit.scope_id or "-"
    return f"{unit.scope_kind}/{scope}/{group}"


def _format_action(action: dict[str, Any]) -> str:
    """One dispatched action as `service [target, …] {params}`."""
    parts = [str(action.get("service", "?"))]
    targets = action.get("entity_ids") or []
    if targets:
        parts.append(f"[{', '.join(targets)}]")
    params = action.get("params") or {}
    if params:
        parts.append(str(params))
    return " ".join(parts)


def format_trace_event(event: TraceEvent) -> list[str]:
    """Render a trace event into log lines (header + per-unit/predicate/action)."""
    lines = [f"trigger: {event.cause.describe()}"]
    for unit in event.units:
        scope = _scope_label(unit)
        if unit.outcome == Outcome.SKIPPED_SWITCH_OFF:
            lines.append(f"  {scope}: skipped (switch off)")
            continue
        explanation = unit.explanation
        winner = ""
        if explanation is not None and explanation.winner_index is not None:
            winner = f" -> rule #{explanation.winner_index} {unit.winner_name!r}"
        elif explanation is None and unit.winner_name is not None:
            # Re-apply: no resolution happened, so no rule index — name only.
            winner = f" -> {unit.winner_name!r}"
        lines.append(f"  {scope}: {unit.outcome}{winner}")
        if explanation is not None:
            for rule_eval in explanation.rules:
                if rule_eval.disabled:
                    lines.append(f"      rule #{rule_eval.index} {rule_eval.name!r}: disabled")
                    continue
                if not rule_eval.evaluated:
                    lines.append(
                        f"      rule #{rule_eval.index} {rule_eval.name!r}: "
                        "not evaluated (winner found)"
                    )
                    continue
                mark = "WON" if rule_eval.matched else "no"
                lines.append(f"      rule #{rule_eval.index} {rule_eval.name!r}: {mark}")
                for pred in rule_eval.predicates:
                    pmark = "pass" if pred.passed else "FAIL"
                    detail = f" [{pred.detail}]" if pred.detail else ""
                    lines.append(f"          {pred.matcher_key}: {pmark}{detail}")
        for action in unit.actions:
            lines.append(f"      → {_format_action(action)}")
    if event.event_id:
        lines = [f"[{event.event_id}] {line}" for line in lines]
    return lines


class TraceSink(Protocol):
    """Sink that receives trace events from emit_trace."""

    def emit(self, event: TraceEvent) -> None: ...


_CHANGES_OUTCOMES = (Outcome.ACTED, Outcome.REAPPLIED)


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
        # ties every line to its scope/group/rule. Partition only inside each
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
    """Fill each unit's `group_name` (store id -> name) and `scope_name`
    (area/floor friendly name, 'Global' for house) so logs show human names
    rather than opaque ids. Best-effort: leaves a name unresolved when the
    store/registry isn't available (e.g. test doubles)."""
    names = group_names(hass)
    units = [
        replace(
            u,
            group_name=names.get(u.group) or u.group_name,
            scope_name=_safe_scope_display_name(hass, u),
        )
        for u in event.units
    ]
    return replace(event, units=units)


def emit_trace(hass: HomeAssistant, event: TraceEvent) -> None:
    """Tag the event with a correlation id, resolve group names, and fan it out
    to every registered sink."""
    sinks = hass.data.get(DOMAIN, {}).get(DATA_TRACE_SINKS, ())
    if not sinks:
        return
    event = _resolve_names(hass, event)
    event = replace(event, event_id=secrets.token_hex(3), timestamp=dt_util.utcnow().isoformat())
    for sink in sinks:
        sink.emit(event)
