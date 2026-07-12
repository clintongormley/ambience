import pytest
from conftest import FakeTransport

from ambience_mcp.ha_client import (
    HAAuthError,
    HAClient,
    HACommandError,
    HAConnectionError,
    ReconnectingClient,
)


class _ScriptedClient:
    """An HAClient stand-in whose command() replays a scripted outcome per call.

    `ambience/mcp/hello` is answered transparently with an always-compatible
    protocol 1 and never consumes from `_outcomes` — these tests are about the
    reconnect/resend machinery, not the handshake (see test_handshake.py), so the
    scripted outcomes must line up with the real commands under test exactly as
    before the handshake was added."""

    def __init__(self, *outcomes) -> None:
        self._outcomes = list(outcomes)
        self.closed = False
        self.sent: list[str] = []

    async def command(self, type: str, **payload):
        if type == "ambience/mcp/hello":
            return {"protocol": 1}
        self.sent.append(type)
        outcome = self._outcomes.pop(0)
        if isinstance(outcome, Exception):
            if isinstance(outcome, HAConnectionError):
                self.closed = True
            raise outcome
        return outcome

    async def close(self) -> None:
        self.closed = True


def _reconnecting(*clients):
    """A ReconnectingClient that hands out the given clients, in order."""
    made = iter(clients)

    async def _connect(ws_url: str, token: str):
        return next(made)

    return ReconnectingClient(
        _connect,
        lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )


async def test_authenticate_ok():
    t = FakeTransport([{"type": "auth_required"}, {"type": "auth_ok"}])
    client = HAClient(t)
    await client.authenticate("secret")
    assert t.sent == [{"type": "auth", "access_token": "secret"}]


async def test_authenticate_invalid_raises():
    t = FakeTransport([{"type": "auth_required"}, {"type": "auth_invalid", "message": "bad token"}])
    client = HAClient(t)
    with pytest.raises(HAAuthError, match="bad token"):
        await client.authenticate("secret")


async def test_command_returns_result():
    t = FakeTransport([{"id": 1, "type": "result", "success": True, "result": {"scenes": []}}])
    client = HAClient(t)
    result = await client.command("ambience/house/get")
    assert result == {"scenes": []}
    assert t.sent[0]["type"] == "ambience/house/get"


async def test_command_sends_type_and_payload_with_incrementing_id():
    t = FakeTransport(
        [
            {"id": 1, "type": "result", "success": True, "result": {"a": 1}},
            {"id": 2, "type": "result", "success": True, "result": {"b": 2}},
        ]
    )
    client = HAClient(t)
    await client.command("ambience/area/get", area_id="living_room")
    await client.command("ambience/house/get")
    assert t.sent == [
        {"id": 1, "type": "ambience/area/get", "area_id": "living_room"},
        {"id": 2, "type": "ambience/house/get"},
    ]


async def test_command_failure_raises_with_code():
    t = FakeTransport(
        [
            {
                "id": 1,
                "type": "result",
                "success": False,
                "error": {"code": "validation_error", "message": "nope"},
            }
        ]
    )
    client = HAClient(t)
    with pytest.raises(HACommandError) as exc:
        await client.command("ambience/validate", config={})
    assert exc.value.code == "validation_error"
    assert exc.value.message == "nope"


async def test_command_ignores_non_matching_frames():
    t = FakeTransport(
        [
            {"id": 99, "type": "event", "event": {}},
            {"id": 1, "type": "result", "success": True, "result": {"ok": True}},
        ]
    )
    client = HAClient(t)
    assert await client.command("ambience/apply", house=True) == {"ok": True}


async def test_command_serialises_sequential_calls():
    t = FakeTransport(
        [
            {"id": 1, "type": "result", "success": True, "result": {"a": 1}},
            {"id": 2, "type": "result", "success": True, "result": {"b": 2}},
        ]
    )
    client = HAClient(t)
    assert await client.command("x") == {"a": 1}
    assert await client.command("y") == {"b": 2}
    assert client.closed is False


async def test_transport_failure_marks_client_closed_and_wraps_error():
    """The send succeeded, so HA may have applied a write and only the reply was
    lost: `sent` is True and the command must NOT be re-sent."""

    class BoomTransport:
        async def send(self, data: str) -> None: ...
        async def recv(self) -> str:
            raise ConnectionResetError("socket dropped")

        async def close(self) -> None: ...

    client = HAClient(BoomTransport())
    with pytest.raises(HAConnectionError, match="socket dropped") as exc:
        await client.command("ambience/house/get")
    assert client.closed is True
    assert exc.value.sent is True


async def test_a_failed_send_reports_the_command_never_left_the_client():
    """A socket that went stale while idle (an HA restart) fails on send — HA
    never saw the command, so it is provably safe to re-send, even a write."""

    class DeadOnSend:
        async def send(self, data: str) -> None:
            raise ConnectionResetError("received 1000 (OK)")

        async def recv(self) -> str: ...
        async def close(self) -> None: ...

    client = HAClient(DeadOnSend())
    with pytest.raises(HAConnectionError) as exc:
        await client.command("ambience/house/get")
    assert exc.value.sent is False
    assert client.closed is True


async def test_a_client_already_marked_dead_refuses_to_send():
    """Without this guard a command queued behind a slow one goes out on a socket
    that is already marked dead and about to be torn down — and dies on RECEIVE, so
    it is classified sent=True and never retried. A WRITE could then reach Home
    Assistant on a doomed socket and fail with an unknowable outcome. Refusing up
    front makes it sent=False, so the caller transparently re-sends it on a fresh
    socket."""
    t = FakeTransport([{"id": 1, "type": "result", "success": True, "result": {}}])
    client = HAClient(t)
    await client.close()

    with pytest.raises(HAConnectionError) as exc:
        await client.command("ambience/house/save", config={})
    assert exc.value.sent is False
    assert t.sent == []  # nothing was put on the doomed socket


async def test_a_read_is_resent_even_when_the_reply_was_lost():
    """Reads have no side effects, so a lost reply (a timeout, a socket that dies
    after the send) is safe to re-request. Only a mutating command is given up on."""
    dead = _ScriptedClient(HAConnectionError("reply lost", sent=True))
    fresh = _ScriptedClient({"scenes": []})
    client = _reconnecting(dead, fresh)

    assert await client.command("ambience/area/get", area_id="lr") == {"scenes": []}
    assert fresh.sent == ["ambience/area/get"]


async def test_a_write_whose_reply_was_lost_is_never_resent():
    """It may have been applied with only the reply lost — re-sending could apply
    it twice."""
    dead = _ScriptedClient(HAConnectionError("reply lost", sent=True))
    fresh = _ScriptedClient({"ok": True})
    client = _reconnecting(dead, fresh)

    with pytest.raises(HAConnectionError):
        await client.command("ambience/area/save", config={})
    assert fresh.sent == []


async def test_reconnects_and_resends_a_command_that_never_left_the_client():
    """HA closes every socket when it restarts and we only find out on the next
    command. A command that failed on *send* never reached HA, so re-sending it on
    a fresh socket is safe — this is what stops the first call after every HA
    restart from failing."""
    dead = _ScriptedClient(HAConnectionError("stale socket", sent=False))
    fresh = _ScriptedClient({"ok": True})
    client = _reconnecting(dead, fresh)

    assert await client.command("ambience/house/get") == {"ok": True}
    assert dead.sent == ["ambience/house/get"]
    assert fresh.sent == ["ambience/house/get"]
    assert dead.closed is True  # the dead socket's tasks were released


async def test_resends_a_write_too_when_it_never_left_the_client():
    """The retry is safe for writes as well: HA never saw the command. Crucially
    only the one frame is re-sent — the *tool* is not re-entered, so single-use
    state like apply_write's confirm token is never consumed twice."""
    dead = _ScriptedClient(HAConnectionError("stale socket", sent=False))
    fresh = _ScriptedClient({"ok": True})
    client = _reconnecting(dead, fresh)

    assert await client.command("ambience/area/save", config={}) == {"ok": True}
    assert fresh.sent == ["ambience/area/save"]


async def test_does_not_resend_a_command_that_reached_home_assistant():
    """The send succeeded, so HA may have applied it and only the reply was lost.
    Re-sending could apply it twice — give up instead."""
    dead = _ScriptedClient(HAConnectionError("dropped mid-flight", sent=True))
    fresh = _ScriptedClient({"ok": True})
    client = _reconnecting(dead, fresh)

    with pytest.raises(HAConnectionError):
        await client.command("ambience/area/save", config={})
    assert fresh.sent == []  # never re-sent


async def test_a_failed_connect_is_retried_for_a_non_mutating_command():
    """Important 3: before Task 5's handshake, a `connect()` failure (not just a
    mid-command socket drop) still got a second connect attempt for a read —
    `command()`'s first `_live()` call was inside the try/except. Task 5 moved
    that first call outside the try, so a `connect()` failure (which defaults
    to `sent=True`) propagated on the very first attempt instead of retrying.
    Folding both `_live()` calls behind `_checked_live()` inside the same
    try/except (the Critical-1 fix) restores this."""
    fake = _ScriptedClient({"scenes": []})
    attempts = [HAConnectionError("unreachable", sent=True), None]

    async def _connect(ws_url: str, token: str):
        outcome = attempts.pop(0)
        if outcome is not None:
            raise outcome
        return fake

    client = ReconnectingClient(
        _connect,
        lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )

    assert await client.command("ambience/house/get") == {"scenes": []}
    assert fake.sent == ["ambience/house/get"]


async def test_a_resend_that_fails_again_propagates():
    first = _ScriptedClient(HAConnectionError("stale", sent=False))
    second = _ScriptedClient(HAConnectionError("still dead", sent=False))
    client = _reconnecting(first, second)

    with pytest.raises(HAConnectionError):
        await client.command("ambience/house/get")


async def test_a_command_level_error_is_not_a_connection_failure():
    """success:false is a normal answer — the socket is fine, don't reconnect."""
    live = _ScriptedClient(HACommandError("validation_error", "nope"))
    spare = _ScriptedClient({"ok": True})
    client = _reconnecting(live, spare)

    with pytest.raises(HACommandError):
        await client.command("ambience/validate", scenes=[])
    assert spare.sent == []
    assert live.closed is False


async def test_command_error_does_not_mark_client_closed():
    t = FakeTransport(
        [
            {
                "id": 1,
                "type": "result",
                "success": False,
                "error": {"code": "validation_error", "message": "nope"},
            }
        ]
    )
    client = HAClient(t)
    with pytest.raises(HACommandError):
        await client.command("ambience/validate", config={})
    assert client.closed is False


async def test_authenticate_wraps_malformed_frame_as_connection_error():
    class BadJsonTransport:
        async def send(self, data: str) -> None: ...
        async def recv(self) -> str:
            return "this is not json"

        async def close(self) -> None: ...

    client = HAClient(BadJsonTransport())
    with pytest.raises(HAConnectionError):
        await client.authenticate("secret")
    assert client.closed is True


async def test_command_times_out_and_marks_the_client_closed(monkeypatch):
    import asyncio

    from ambience_mcp import ha_client

    class HangingTransport:
        async def send(self, data: str) -> None: ...
        async def recv(self) -> str:
            await asyncio.Event().wait()  # never returns — a live but stalled HA
            return ""  # unreachable

        async def close(self) -> None: ...

    monkeypatch.setattr(ha_client, "_COMMAND_TIMEOUT", 0.02)
    client = HAClient(HangingTransport())
    with pytest.raises(HAConnectionError):
        await client.command("ambience/dry_run", house=True)
    assert client.closed is True
