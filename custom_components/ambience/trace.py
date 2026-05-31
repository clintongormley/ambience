"""Evaluation tracing: cause/unit/event types, log formatting, and sinks.

Increment A ships a LogSink only. `emit_trace` is the seam a future in-memory
ring buffer (Increment B) plugs into without re-instrumenting the engine.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any, Protocol

from homeassistant.core import HomeAssistant

from .const import DATA_TRACE_SINKS, DOMAIN
from .engine import Explanation

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
    UNKNOWN = "unknown"


class Outcome(StrEnum):
    """What an evaluated (scope, group) unit did."""

    ACTED = "acted"
    NO_OP = "no_op"
    NO_MATCH = "no_match"
    SKIPPED_SWITCH_OFF = "skipped_switch_off"


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


@dataclass(frozen=True)
class TraceEvent:
    """One trigger event: a cause and every unit that re-evaluated."""

    cause: TriggerCause
    units: list[UnitTrace]


def _scope_label(unit: UnitTrace) -> str:
    return f"{unit.scope_kind}/{unit.scope_id or '-'}/{unit.group}"


def format_trace_event(event: TraceEvent) -> list[str]:
    """Render a trace event into log lines (header + per-unit/predicate)."""
    lines = [f"trigger: {event.cause.describe()}"]
    for unit in event.units:
        scope = _scope_label(unit)
        if unit.outcome == Outcome.SKIPPED_SWITCH_OFF:
            lines.append(f"  {scope}: skipped (switch off)")
            continue
        explanation = unit.explanation
        if explanation is None:
            lines.append(f"  {scope}: {unit.outcome}")
            continue
        winner = ""
        if explanation.winner_index is not None:
            winner = f" -> rule #{explanation.winner_index} {unit.winner_name!r}"
        lines.append(f"  {scope}: {unit.outcome}{winner}")
        for rule_eval in explanation.rules:
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
    return lines


class TraceSink(Protocol):
    """Sink that receives trace events from emit_trace."""

    def emit(self, event: TraceEvent) -> None: ...


class LogSink:
    """Renders trace events to the standard HA log.

    Acted units go to the `…trace` (changes) stream; no-op/no-match/switch-off
    units go to the `…trace.noop` (opt-in) stream. Each is gated on its own
    logger level so building a TraceEvent for a stream nobody watches is cheap.
    """

    def emit(self, event: TraceEvent) -> None:
        # Partition only inside each guard, so an off stream costs nothing.
        if _LOGGER.isEnabledFor(logging.DEBUG):
            acted = [u for u in event.units if u.outcome == Outcome.ACTED]
            if acted:
                for line in format_trace_event(TraceEvent(event.cause, acted)):
                    _LOGGER.debug("%s", line)
        if _NOOP_LOGGER.isEnabledFor(logging.DEBUG):
            other = [u for u in event.units if u.outcome != Outcome.ACTED]
            if other:
                for line in format_trace_event(TraceEvent(event.cause, other)):
                    _NOOP_LOGGER.debug("%s", line)


def tracing_active() -> bool:
    """True if any trace stream is enabled — so building explanations is worth
    the cost. (Increment B also returns True when a buffer sink is registered.)"""
    return _LOGGER.isEnabledFor(logging.DEBUG) or _NOOP_LOGGER.isEnabledFor(logging.DEBUG)


def emit_trace(hass: HomeAssistant, event: TraceEvent) -> None:
    """Fan a trace event out to every registered sink."""
    for sink in hass.data.get(DOMAIN, {}).get(DATA_TRACE_SINKS, ()):
        sink.emit(event)
