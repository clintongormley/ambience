"""Trace types and log formatting (pure parts)."""

from __future__ import annotations

import json
import logging
from datetime import datetime

from custom_components.ambience.const import DATA_STORE, DATA_TRACE_BUFFER, DATA_TRACE_SINKS, DOMAIN
from custom_components.ambience.engine import (
    Explanation,
    PredicateResult,
    SceneEval,
)
from custom_components.ambience.trace import (
    BufferedUnit,
    CauseKind,
    LogSink,
    Outcome,
    TraceEvent,
    TriggerCause,
    UnitTrace,
    _explanation_to_dict,
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
        scenes=[
            SceneEval(0, "night", [PredicateResult("tod", False, "value=day")], False, True),
            SceneEval(1, "day", [PredicateResult("tod", True, "value=day")], True, True),
        ],
    )
    unit = UnitTrace(
        scope_kind="area",
        scope_id="kitchen",
        category="General",
        switch_state="on",
        outcome="acted",
        explanation=explanation,
        winner_name="day",
        actions=[{"service": "light.turn_on"}],
    )
    event = TraceEvent(cause=TriggerCause(kind="clock", detail="08:00"), units=[unit])
    text = "\n".join(format_trace_event(event))
    assert "trigger: clock 08:00" in text
    # Scene numbers are shown 1-based: winner_index 1 → scene #2.
    assert "area/kitchen/General: acted -> scene #2 'day'" in text
    assert "scene #2 'day': WON" in text
    assert "tod: pass [value=day]" in text
    assert "scene #1 'night': no" in text
    assert "tod: FAIL [value=day]" in text


def test_format_switch_off_unit_is_terse():
    unit = UnitTrace("area", "kitchen", "General", "off", "skipped_switch_off", None)
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "area/kitchen/General: skipped (switch off)" in text


def test_format_skipped_scope_disabled():
    unit = UnitTrace("area", "kitchen", "General", "off", "skipped_scope_disabled", None)
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "area/kitchen/General: skipped (scope disabled)" in text


def test_format_marks_unevaluated_scenes():
    explanation = Explanation(
        winner_index=0,
        scenes=[
            SceneEval(0, "a", [PredicateResult("mode", True, None)], True, True),
            SceneEval(1, "b", [], False, False),
        ],
    )
    unit = UnitTrace("house", None, "General", "on", "acted", explanation, winner_name="a")
    event = TraceEvent(TriggerCause(kind="startup"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "house/-/General: acted" in text
    assert "scene #2 'b': not evaluated (winner found)" in text


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
    hass = _Hass({DOMAIN: {}})
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        assert tracing_active(hass) is True


def test_format_renders_actions_for_acted_unit():
    explanation = Explanation(
        winner_index=0,
        scenes=[
            SceneEval(0, "evening", [PredicateResult("tod", True, "value=evening")], True, True)
        ],
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
    assert "reapplied -> 'evening'" in text  # winner name shown without a scene index
    assert "light.turn_on" in text


def test_logsink_routes_reapplied_to_changes_stream(caplog):
    unit = UnitTrace("area", "kitchen", "General", "on", "reapplied", None, winner_name="evening")
    event = TraceEvent(TriggerCause(kind="reapply", detail="10s"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    assert "reapplied" in caplog.text


def test_emit_trace_resolves_category_name_for_log(caplog):
    class StoreStub:
        def categories(self):
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


def test_emit_trace_keeps_category_id_when_store_lacks_names(caplog):
    # A store double without categories() (or a missing store) must not crash; the
    # log falls back to the category id.
    unit = UnitTrace("area", "master_bedroom", "abc123", "on", "acted", None)
    event = TraceEvent(TriggerCause(kind="manual"), [unit])
    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [LogSink()]}})
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        emit_trace(hass, event)
    assert "area/master_bedroom/abc123" in caplog.text


def test_tracing_active_true_when_buffer_registered():
    # No trace logger at DEBUG, but a buffer is registered -> active.
    hass = _Hass({DOMAIN: {DATA_TRACE_BUFFER: object()}})
    assert tracing_active(hass) is True


def test_tracing_active_false_with_no_buffer_and_no_debug(caplog):
    hass = _Hass({DOMAIN: {}})
    with caplog.at_level(logging.WARNING, logger="custom_components.ambience"):
        assert tracing_active(hass) is False


def test_emit_trace_assigns_a_timestamp():
    received = []

    class CaptureSink:
        def emit(self, event):
            received.append(event)

    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [CaptureSink()]}})
    emit_trace(hass, TraceEvent(TriggerCause(kind="manual"), []))
    # A parseable ISO-8601 timestamp was assigned (not just any truthy string).
    datetime.fromisoformat(received[0].timestamp)


# ---------------------------------------------------------------------------
# BufferSink tests
# ---------------------------------------------------------------------------

from custom_components.ambience.const import TRACE_BUFFER_SIZE  # noqa: E402
from custom_components.ambience.trace import BufferSink  # noqa: E402


def _event(cause_detail, units, event_id="e", ts="2026-06-01T00:00:00"):
    return TraceEvent(
        TriggerCause(kind="clock", detail=cause_detail), units, event_id=event_id, timestamp=ts
    )


def test_buffersink_splits_event_into_per_scope_category_buckets():
    sink = BufferSink()
    u_kitchen = UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name="a")
    u_hall = UnitTrace("area", "hall", "General", "on", "acted", None, winner_name="b")
    sink.emit(_event("08:00", [u_kitchen, u_hall]))
    records = sink.records()
    assert {(r.unit.scope_id, r.unit.category) for r in records} == {
        ("kitchen", "General"),
        ("hall", "General"),
    }
    # Each record carries the event's trigger context.
    assert all(r.event_id == "e" and r.cause.detail == "08:00" for r in records)


def test_buffersink_bounds_each_bucket_at_trace_buffer_size():
    sink = BufferSink()
    for i in range(TRACE_BUFFER_SIZE + 3):
        unit = UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name=f"r{i}")
        ts = f"2026-06-01T00:00:{str(i).zfill(2)}"
        sink.emit(_event("08:00", [unit], event_id=f"e{i}", ts=ts))
    records = sink.records()
    assert len(records) == TRACE_BUFFER_SIZE  # only one bucket, capped
    # The oldest were evicted; the newest survive.
    assert records[0].unit.winner_name == f"r{TRACE_BUFFER_SIZE + 2}"


def test_buffersink_records_newest_first_across_buckets():
    sink = BufferSink()
    sink.emit(
        _event(
            "08:00",
            [UnitTrace("area", "kitchen", "General", "on", "acted", None)],
            ts="2026-06-01T00:00:00",
        )
    )
    sink.emit(
        _event(
            "09:00",
            [UnitTrace("area", "hall", "General", "on", "acted", None)],
            ts="2026-06-01T00:00:05",
        )
    )
    records = sink.records()
    assert records[0].cause.detail == "09:00"  # newest first
    assert records[1].cause.detail == "08:00"


def test_buffersink_records_empty_when_fresh():
    assert BufferSink().records() == []


def test_buffersink_clear_empties_all_buckets():
    sink = BufferSink()
    sink.emit(_event("08:00", [UnitTrace("area", "kitchen", "General", "on", "acted", None)]))
    sink.clear()
    assert sink.records() == []


def test_emit_trace_feeds_the_registered_buffer():
    buffer = BufferSink()
    hass = _Hass({DOMAIN: {DATA_TRACE_SINKS: [buffer], DATA_TRACE_BUFFER: buffer}})
    unit = UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name="a")
    emit_trace(hass, TraceEvent(TriggerCause(kind="manual"), [unit]))
    records = buffer.records()
    assert len(records) == 1
    assert records[0].unit.scope_id == "kitchen"
    assert records[0].event_id and records[0].timestamp  # enriched by emit_trace


# ---------------------------------------------------------------------------
# buffered_unit_to_dict tests
# ---------------------------------------------------------------------------

from custom_components.ambience.trace import buffered_unit_to_dict  # noqa: E402


def test_buffered_unit_to_dict_acted_with_explanation():
    explanation = Explanation(
        winner_index=1,
        scenes=[
            SceneEval(0, "night", [PredicateResult("tod", False, "evening")], False, True),
            SceneEval(1, "evening", [PredicateResult("tod", True, "evening")], True, True),
        ],
    )
    unit = UnitTrace(
        "area",
        "kitchen",
        "General",
        "on",
        "acted",
        explanation,
        winner_name="evening",
        actions=[{"service": "light.turn_on", "entity_ids": ["light.k"], "params": {"x": 1}}],
        category_name="Kitchen Scenes",
        scope_name="Kitchen",
    )
    record = BufferedUnit(
        "abc123", "2026-06-01T00:00:00", TriggerCause(kind="clock", detail="08:00"), unit
    )
    data = buffered_unit_to_dict(record)
    # JSON-serializable (StrEnums included).
    assert json.loads(json.dumps(data)) == data
    assert data["event_id"] == "abc123"
    assert data["timestamp"] == "2026-06-01T00:00:00"
    assert data["cause"] == {
        "kind": "clock",
        "entity_id": None,
        "old": None,
        "new": None,
        "detail": "08:00",
    }
    assert data["scope_kind"] == "area"
    assert data["scope_id"] == "kitchen"
    assert data["scope_name"] == "Kitchen"
    assert data["category"] == "General"
    assert data["category_name"] == "Kitchen Scenes"
    assert data["outcome"] == "acted"
    assert data["winner_name"] == "evening"
    assert data["actions"] == [
        {"service": "light.turn_on", "entity_ids": ["light.k"], "params": {"x": 1}}
    ]
    assert data["explanation"]["winner_index"] == 1
    assert data["explanation"]["scenes"][1] == {
        "index": 1,
        "name": "evening",
        "matched": True,
        "evaluated": True,
        "disabled": False,
        "predicates": [
            {"condition_key": "tod", "passed": True, "detail": "evening", "entity_ids": []}
        ],
    }


def test_buffered_unit_to_dict_reapplied_has_null_explanation():
    unit = UnitTrace("area", "kitchen", "General", "on", "reapplied", None, winner_name="evening")
    record = BufferedUnit(
        "e", "2026-06-01T00:00:00", TriggerCause(kind="reapply", detail="10s"), unit
    )
    data = buffered_unit_to_dict(record)
    assert data["outcome"] == "reapplied"
    assert data["explanation"] is None
    assert json.loads(json.dumps(data)) == data


def test_format_marks_disabled_scenes():
    explanation = Explanation(
        winner_index=1,
        scenes=[
            SceneEval(0, "off", [], False, False, disabled=True),
            SceneEval(1, "win", [PredicateResult("mode", True, None)], True, True),
        ],
    )
    unit = UnitTrace("house", None, "General", "on", "acted", explanation, winner_name="win")
    event = TraceEvent(TriggerCause(kind="startup"), [unit])
    text = "\n".join(format_trace_event(event))
    assert "scene #1 'off': disabled" in text
    assert "not evaluated" not in text


def test_explanation_to_dict_includes_disabled():
    explanation = Explanation(
        winner_index=None,
        scenes=[SceneEval(0, "off", [], False, False, disabled=True)],
    )
    result = _explanation_to_dict(explanation)
    assert result["scenes"][0]["disabled"] is True


def test_explanation_to_dict_serialises_predicate_entity_ids():
    """Each predicate's entity_ids are emitted as a JSON list so the trace UI
    can link them to more-info; an empty tuple becomes an empty list."""
    explanation = Explanation(
        winner_index=0,
        scenes=[
            SceneEval(
                0,
                "shower",
                [
                    PredicateResult(
                        "occupancy", True, "Zone Shower: on ✓", ("binary_sensor.zone_1",)
                    ),
                    PredicateResult("tod", True, "evening"),
                ],
                True,
                True,
            )
        ],
    )
    result = _explanation_to_dict(explanation)
    preds = result["scenes"][0]["predicates"]
    assert preds[0]["entity_ids"] == ["binary_sensor.zone_1"]
    assert preds[1]["entity_ids"] == []
    # Still JSON-serializable.
    assert json.loads(json.dumps(result)) == result


# ---------------------------------------------------------------------------
# TriggerCause.describe() — uncovered branches
# ---------------------------------------------------------------------------


def test_cause_describe_sun():
    cause = TriggerCause(kind=CauseKind.SUN, detail="below_horizon")
    assert cause.describe() == "sun below_horizon"


def test_cause_describe_has_time_is_periodic_time_check():
    # HAS_TIME is now only the periodic clock sweep (template re-render), with no
    # entity to name — it always reads as a periodic time check.
    assert TriggerCause(kind=CauseKind.HAS_TIME).describe() == "periodic time check"


def test_cause_describe_duration_names_entity_state_and_duration():
    cause = TriggerCause(
        kind=CauseKind.DURATION, entity_id="binary_sensor.motion", new="off", detail="5m"
    )
    assert cause.describe() == "binary_sensor.motion off for 5m"


def test_cause_describe_duration_multi_entity_uses_label():
    # A multi-entity gate has no single entity/state; `new` carries the gate
    # label, entity_id is None — render "<label> for <duration>".
    cause = TriggerCause(kind=CauseKind.DURATION, new="nobody home", detail="30m")
    assert cause.describe() == "nobody home for 30m"


def test_cause_describe_switch():
    cause = TriggerCause(kind=CauseKind.SWITCH, entity_id="switch.ambience_living_room")
    assert cause.describe() == "switch switch.ambience_living_room on"


def test_cause_describe_simulated_with_detail():
    cause = TriggerCause(kind=CauseKind.SIMULATED, detail="evening")
    assert cause.describe() == "simulated evening"


def test_cause_describe_simulated_without_detail():
    cause = TriggerCause(kind=CauseKind.SIMULATED)
    assert cause.describe() == "simulated"


def test_cause_describe_reloaded():
    cause = TriggerCause(kind=CauseKind.RELOADED)
    assert cause.describe() == "config reload"


def test_cause_describe_unknown_falls_back_to_string():
    # CauseKind.UNKNOWN has no dedicated branch — it falls through to str(self.kind).
    cause = TriggerCause(kind=CauseKind.UNKNOWN)
    assert cause.describe() == "unknown"


# ---------------------------------------------------------------------------
# LogSink — empty-list guard branches (304->308, 310->exit)
# ---------------------------------------------------------------------------


def test_logsink_no_changes_units_does_not_log_on_changes_stream(caplog):
    # All units are no_op, so the changes-stream filter produces an empty list.
    # The LogSink must NOT call _LOGGER.debug (branch 304->308 false path).
    unit = UnitTrace("area", "kitchen", "General", "on", Outcome.NO_OP, None)
    event = TraceEvent(TriggerCause(kind=CauseKind.CLOCK, detail="08:00"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace"):
        LogSink().emit(event)
    records = [r for r in caplog.records if r.name == "custom_components.ambience.trace"]
    assert len(records) == 0


def test_logsink_no_noop_units_does_not_log_on_noop_stream(caplog):
    # All units are acted, so the noop-stream filter produces an empty list.
    # The LogSink must NOT call _NOOP_LOGGER.debug (branch 310->exit false path).
    unit = UnitTrace("area", "kitchen", "General", "on", Outcome.ACTED, None, winner_name="r")
    event = TraceEvent(TriggerCause(kind=CauseKind.CLOCK, detail="08:00"), [unit])
    with caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace.noop"):
        LogSink().emit(event)
    records = [r for r in caplog.records if r.name == "custom_components.ambience.trace.noop"]
    assert len(records) == 0


def test_logsink_changes_logger_disabled_skips_changes_block(caplog):
    # When the changes logger is below DEBUG, the entire changes block (304->308)
    # is bypassed.  Only the noop stream is at DEBUG so that side runs,
    # but changes must produce zero records on the changes logger.
    unit = UnitTrace("area", "kitchen", "General", "on", Outcome.ACTED, None, winner_name="r")
    event = TraceEvent(TriggerCause(kind=CauseKind.CLOCK, detail="08:00"), [unit])
    # noop logger at DEBUG, changes logger explicitly at WARNING — exercises 304->308.
    with (
        caplog.at_level(logging.WARNING, logger="custom_components.ambience.trace"),
        caplog.at_level(logging.DEBUG, logger="custom_components.ambience.trace.noop"),
    ):
        LogSink().emit(event)
    changes_records = [r for r in caplog.records if r.name == "custom_components.ambience.trace"]
    assert len(changes_records) == 0
