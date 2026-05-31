"""Trace types and log formatting (pure parts)."""

from __future__ import annotations

import logging

from custom_components.ambience.const import DATA_TRACE_SINKS, DOMAIN
from custom_components.ambience.engine import (
    Explanation,
    PredicateResult,
    RuleEval,
)
from custom_components.ambience.trace import (
    LogSink,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    emit_trace,
    format_trace_event,
    tracing_active,
)


def test_cause_describe_entity():
    cause = TriggerCause(kind="entity", entity_id="binary_sensor.motion", old="off", new="on")
    assert cause.describe() == "binary_sensor.motion changed 'off' -> 'on'"


def test_cause_describe_clock_and_manual():
    assert TriggerCause(kind="clock", detail="20:00").describe() == "clock 20:00"
    assert TriggerCause(kind="manual").describe() == "manual apply_scene"


def test_format_acted_unit_lists_predicates():
    explanation = Explanation(
        winner_index=1,
        rules=[
            RuleEval(0, "night", [PredicateResult("tod", False, "value=day")], False, True),
            RuleEval(1, "day", [PredicateResult("tod", True, "value=day")], True, True),
        ],
    )
    unit = UnitTrace(
        scope_kind="area",
        scope_id="kitchen",
        group="General",
        switch_state="on",
        outcome="acted",
        explanation=explanation,
        winner_name="day",
        actions=[{"service": "light.turn_on"}],
    )
    event = TraceEvent(cause=TriggerCause(kind="clock", detail="08:00"), units=[unit])
    text = "\n".join(format_trace_event(event))
    assert "trigger: clock 08:00" in text
    assert "area/kitchen/General: acted" in text
    assert "rule #1 'day': WON" in text
    assert "tod: pass [value=day]" in text
    assert "rule #0 'night': no" in text
    assert "tod: FAIL [value=day]" in text


def test_format_switch_off_unit_is_terse():
    unit = UnitTrace("area", "kitchen", "General", "off", "skipped_switch_off", None)
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "area/kitchen/General: skipped (switch off)" in text


def test_format_marks_unevaluated_rules():
    explanation = Explanation(
        winner_index=0,
        rules=[
            RuleEval(0, "a", [PredicateResult("mode", True, None)], True, True),
            RuleEval(1, "b", [], False, False),
        ],
    )
    unit = UnitTrace("house", None, "General", "on", "acted", explanation, winner_name="a")
    event = TraceEvent(TriggerCause(kind="startup"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "house/-/General: acted" in text
    assert "rule #1 'b': not evaluated (winner found)" in text


class _Hass:
    def __init__(self, data):
        self.data = data


def test_emit_trace_fans_out_to_registered_sinks():
    received = []

    class CaptureSink:
        def emit(self, event):
            received.append(event)

    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [CaptureSink()]}})
    event = TraceEvent(TriggerCause(kind="manual"), [])
    emit_trace(hass, event)
    assert received == [event]


def test_emit_trace_no_sinks_is_noop():
    emit_trace(_Hass({DOMAIN: {}}), TraceEvent(TriggerCause(kind="manual"), []))
    emit_trace(_Hass({}), TraceEvent(TriggerCause(kind="manual"), []))


def test_logsink_writes_acted_to_changes_stream(caplog):
    unit = UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name="day")
    event = TraceEvent(TriggerCause(kind="clock", detail="08:00"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    assert "area/kitchen/General: acted" in caplog.text


def test_logsink_suppresses_noop_unless_noop_logger_enabled(caplog):
    unit = UnitTrace("area", "kitchen", "General", "on", "no_op", None, winner_name="day")
    event = TraceEvent(TriggerCause(kind="clock", detail="08:00"), [unit])
    # Only the changes stream at DEBUG -> no-op must NOT be logged.
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    assert "no_op" not in caplog.text
    # Raise the noop stream -> it is logged.
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace.noop"):
        LogSink().emit(event)
    assert "no_op" in caplog.text


def test_tracing_active_reflects_logger_levels(caplog):
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        assert tracing_active() is True
