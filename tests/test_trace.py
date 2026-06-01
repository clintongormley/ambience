"""Trace types and log formatting (pure parts)."""

from __future__ import annotations

import logging

from custom_components.ambience.const import DATA_STORE, DATA_TRACE_SINKS, DOMAIN
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


def test_format_uses_scope_name_when_present():
    # A resolved friendly scope name replaces the raw id in the label.
    unit = UnitTrace(
        "area", "mbr_id", "g", "on", "acted", None, winner_name="r", scope_name="Master Bedroom"
    )
    text = "\n".join(format_trace_event(TraceEvent(TriggerCause(kind="manual"), [unit])))
    assert "area/Master Bedroom/g: acted" in text


async def test_emit_trace_resolves_scope_name_for_log(hass, caplog):
    from homeassistant.helpers import area_registry as ar

    area = ar.async_get(hass).async_create("Kitchen")
    hass.data.setdefault(DOMAIN, {})[DATA_TRACE_SINKS] = [LogSink()]
    unit = UnitTrace("area", area.id, "general", "on", "acted", None, winner_name="r")
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        emit_trace(hass, event)
    assert "area/Kitchen/general" in caplog.text


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
    assert len(received) == 1
    assert received[0].cause == event.cause
    assert received[0].event_id  # emit_trace tagged it with a correlation id


def test_emit_trace_assigns_distinct_event_ids():
    received = []

    class CaptureSink:
        def emit(self, event):
            received.append(event)

    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [CaptureSink()]}})
    emit_trace(hass, TraceEvent(TriggerCause(kind="manual"), []))
    emit_trace(hass, TraceEvent(TriggerCause(kind="manual"), []))
    assert received[0].event_id != received[1].event_id


def test_format_prefixes_every_line_with_event_id():
    unit = UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name="r")
    event = TraceEvent(TriggerCause(kind="manual"), [unit], event_id="ab12cd")
    lines = format_trace_event(event)
    assert lines  # non-empty
    assert all(line.startswith("[ab12cd] ") for line in lines)


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


def test_format_renders_actions_for_acted_unit():
    explanation = Explanation(
        winner_index=0,
        rules=[RuleEval(0, "evening", [PredicateResult("tod", True, "value=evening")], True, True)],
    )
    unit = UnitTrace(
        "area",
        "kitchen",
        "General",
        "on",
        "acted",
        explanation,
        winner_name="evening",
        actions=[
            {
                "service": "light.turn_on",
                "entity_ids": ["light.kitchen"],
                "params": {"brightness_pct": 60},
            }
        ],
    )
    text = "\n".join(format_trace_event(TraceEvent(TriggerCause(kind="manual"), [unit])))
    assert "light.turn_on" in text
    assert "light.kitchen" in text
    assert "brightness_pct" in text


def test_format_renders_reapply_unit_with_actions():
    unit = UnitTrace(
        "area",
        "kitchen",
        "General",
        "on",
        "reapplied",
        None,
        winner_name="evening",
        actions=[{"service": "light.turn_on", "entity_ids": ["light.kitchen"]}],
    )
    text = "\n".join(
        format_trace_event(TraceEvent(TriggerCause(kind="reapply", detail="10s"), [unit]))
    )
    assert "reapply (10s)" in text  # cause describes the interval
    assert "reapplied -> 'evening'" in text  # winner name shown without a rule index
    assert "light.turn_on" in text


def test_logsink_routes_reapplied_to_changes_stream(caplog):
    unit = UnitTrace("area", "kitchen", "General", "on", "reapplied", None, winner_name="evening")
    event = TraceEvent(TriggerCause(kind="reapply", detail="10s"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    assert "reapplied" in caplog.text


def test_emit_trace_resolves_group_name_for_log(caplog):
    class StoreStub:
        def groups(self):
            return [{"id": "749f3cb81a8d4c3a811c3fd9c0c1d23e", "name": "Master Lights"}]

    unit = UnitTrace(
        "area", "master_bedroom", "749f3cb81a8d4c3a811c3fd9c0c1d23e", "on", "acted", None
    )
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [LogSink()], DATA_STORE: StoreStub()}})
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        emit_trace(hass, event)
    assert "area/master_bedroom/Master Lights" in caplog.text
    assert "749f3cb8" not in caplog.text


def test_logsink_emits_one_record_per_event(caplog):
    # All of an event's lines must land in a SINGLE log record, so concurrent
    # evaluations can never interleave their lines in the log.
    units = [
        UnitTrace("area", "a", "G1", "on", "acted", None, winner_name="r1"),
        UnitTrace("area", "b", "G2", "on", "acted", None, winner_name="r2"),
    ]
    event = TraceEvent(TriggerCause(kind="entity", entity_id="x", old="off", new="on"), units)
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    records = [r for r in caplog.records if r.name == "custom_components.ambience.trace"]
    assert len(records) == 1  # one record for the whole event
    message = records[0].getMessage()
    assert "area/a/G1: acted -> 'r1'" in message
    assert "area/b/G2: acted -> 'r2'" in message


def test_emit_trace_keeps_group_id_when_store_lacks_names(caplog):
    # A store double without groups() (or a missing store) must not crash; the
    # log falls back to the group id.
    unit = UnitTrace("area", "master_bedroom", "abc123", "on", "acted", None)
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [LogSink()]}})
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        emit_trace(hass, event)
    assert "area/master_bedroom/abc123" in caplog.text
