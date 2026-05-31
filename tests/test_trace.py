"""Trace types and log formatting (pure parts)."""

from __future__ import annotations

from custom_components.ambience.engine import (
    Explanation,
    PredicateResult,
    RuleEval,
)
from custom_components.ambience.trace import (
    TraceEvent,
    TriggerCause,
    UnitTrace,
    format_trace_event,
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
