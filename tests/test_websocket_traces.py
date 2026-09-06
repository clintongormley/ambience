"""WebSocket read API for the in-memory trace buffer."""

from __future__ import annotations

from typing import Any

from custom_components.ambience.const import DATA_STORE, DATA_TRACE_BUFFER, DOMAIN
from custom_components.ambience.trace import (
    BufferSink,
    CauseKind,
    TraceEvent,
    TriggerCause,
    UnitTrace,
)
from custom_components.ambience.websocket import async_register_commands


async def _ws_send(hass_ws_client, **payload: Any) -> dict:
    client = await hass_ws_client()
    payload.setdefault("id", 1)
    await client.send_json(payload)
    return await client.receive_json()


def _seed_buffer(hass) -> BufferSink:
    """Replace the buffer installed by async_setup_entry with a fresh one."""
    buffer = BufferSink()
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_TRACE_BUFFER] = buffer
    return buffer


async def test_traces_list_returns_serialized_records_newest_first(
    hass, installed, hass_ws_client
) -> None:
    buffer = _seed_buffer(hass)
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="clock", detail="08:00"),
            [UnitTrace("area", "kitchen", "General", "on", "acted", None, winner_name="a")],
            event_id="e1",
            timestamp="2026-06-01T00:00:00",
        )
    )
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="clock", detail="09:00"),
            [UnitTrace("area", "hall", "General", "on", "acted", None, winner_name="b")],
            event_id="e2",
            timestamp="2026-06-01T00:00:05",
        )
    )

    resp = await _ws_send(hass_ws_client, type="ambience/traces/list")
    assert resp["success"]
    traces = resp["result"]["traces"]
    assert [t["cause"]["detail"] for t in traces] == ["09:00", "08:00"]  # newest first
    assert traces[0]["scope_id"] == "hall"


async def test_traces_list_respects_limit(hass, installed, hass_ws_client) -> None:
    buffer = _seed_buffer(hass)
    for i in range(4):
        buffer.emit(
            TraceEvent(
                TriggerCause(kind="clock", detail=f"0{i}:00"),
                [UnitTrace("area", f"a{i}", "General", "on", "acted", None)],
                event_id=f"e{i}",
                timestamp=f"2026-06-01T00:00:0{i}",
            )
        )
    resp = await _ws_send(hass_ws_client, type="ambience/traces/list", limit=2)
    assert resp["success"]
    assert len(resp["result"]["traces"]) == 2


async def test_traces_clear_empties_the_buffer(hass, installed, hass_ws_client) -> None:
    buffer = _seed_buffer(hass)
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="clock", detail="08:00"),
            [UnitTrace("area", "kitchen", "General", "on", "acted", None)],
            event_id="e1",
            timestamp="2026-06-01T00:00:00",
        )
    )
    resp = await _ws_send(hass_ws_client, type="ambience/traces/clear")
    assert resp["success"]
    assert buffer.records() == []


async def test_traces_list_no_buffer_returns_empty(hass, installed, hass_ws_client) -> None:
    # Remove the buffer that async_setup_entry created.
    hass.data.setdefault(DOMAIN, {}).pop(DATA_TRACE_BUFFER, None)
    resp = await _ws_send(hass_ws_client, type="ambience/traces/list")
    assert resp["success"]
    assert resp["result"]["traces"] == []


def _seed_pii_trace(hass) -> BufferSink:
    """A trace whose cause is a person entity's zone change and whose action
    is a lock unlock carrying a PIN — the two PII/secret carriers this route
    can leak: the unredacted feed must show them (panel behaviour unchanged),
    the redacted feed must not (what the MCP server always requests)."""
    buffer = _seed_buffer(hass)
    buffer.emit(
        TraceEvent(
            TriggerCause(kind=CauseKind.ENTITY, entity_id="person.alice", old="work", new="home"),
            [
                UnitTrace(
                    "area",
                    "front_door",
                    "General",
                    "on",
                    "acted",
                    None,
                    actions=[{"service": "lock.unlock", "params": {"code": "1234"}}],
                )
            ],
            event_id="e1",
            timestamp="2026-06-01T00:00:00",
        )
    )
    return buffer


async def test_traces_list_is_unredacted_by_default(hass, installed, hass_ws_client) -> None:
    # No `redact` flag — the HA panel's behaviour, unchanged: the real cause
    # entity and the real PIN are both present.
    _seed_pii_trace(hass)

    resp = await _ws_send(hass_ws_client, type="ambience/traces/list")

    assert resp["success"]
    trace = resp["result"]["traces"][0]
    assert trace["cause"]["entity_id"] == "person.alice"
    assert trace["cause"]["new"] == "home"
    assert trace["actions"][0]["params"]["code"] == "1234"


async def test_traces_list_redacts_when_asked(hass, installed, hass_ws_client) -> None:
    # `redact: true` — what ambience-mcp's list_traces always sends. The same
    # redaction ambience/ai_bundle applies must scrub the person cause and the
    # lock PIN before the trace reaches an external AI.
    from homeassistant.components.diagnostics import REDACTED

    _seed_pii_trace(hass)

    resp = await _ws_send(hass_ws_client, type="ambience/traces/list", redact=True)

    assert resp["success"]
    trace = resp["result"]["traces"][0]
    assert trace["cause"]["entity_id"] == REDACTED
    assert trace["cause"]["new"] == REDACTED
    assert trace["actions"][0]["params"]["code"] == REDACTED


async def test_traces_list_rejects_non_positive_limit(hass, installed, hass_ws_client) -> None:
    async_register_commands(hass)
    _seed_buffer(hass)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "ambience/traces/list", "limit": 0})
    response = await client.receive_json()
    assert response["success"] is False


# --- traces/clear: no buffer installed (line 932->934 branch) ---


async def test_traces_clear_succeeds_when_no_buffer(hass, installed, hass_ws_client) -> None:
    """traces/clear is a no-op (and still succeeds) when the trace buffer is absent.
    This covers the branch at line 932 where buffer is None."""
    # Remove the buffer that async_setup_entry installed.
    hass.data.setdefault(DOMAIN, {}).pop(DATA_TRACE_BUFFER, None)
    resp = await _ws_send(hass_ws_client, type="ambience/traces/clear")
    assert resp["success"] is True


async def test_ws_scope_diagnostics_returns_bundle(hass, installed, hass_ws_client) -> None:
    store = hass.data[DOMAIN][DATA_STORE]
    await store.async_save_area("a", {"scenes": []})
    buffer = _seed_buffer(hass)
    buffer.emit(
        TraceEvent(
            TriggerCause(kind="reloaded"),
            [UnitTrace("area", "a", "general", "on", "acted", None)],
            event_id="x",
            timestamp="2026-06-09T10:00:00+00:00",
        )
    )

    resp = await _ws_send(
        hass_ws_client,
        type="ambience/diagnostics/scope",
        scope_kind="area",
        scope_id="a",
        category="general",
    )
    assert resp["success"] is True
    assert resp["result"]["scope"]["scope_id"] == "a"
    assert len(resp["result"]["traces"]) == 1


async def test_traces_list_rejects_boolean_limit(hass, installed, hass_ws_client) -> None:
    # `True` is an int in Python; a bool must not slip through as limit 1.
    resp = await _ws_send(hass_ws_client, type="ambience/traces/list", limit=True)

    assert resp["success"] is False
    assert resp["error"]["code"] == "invalid_format"
