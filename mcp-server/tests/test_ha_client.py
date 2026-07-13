import asyncio
import json

import pytest
from conftest import FakeTransport

from ambience_mcp import ha_client
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
    Folding both `_live()` calls behind `_live_for()` inside the same
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


async def test_a_failed_connect_is_retried_for_a_WRITE_too():
    """A failure while the connection is still being ESTABLISHED cannot have sent the
    caller's command — it is still sitting in `command_for`'s locals, unwritten. But
    `connect()` raises HAConnectionError with the default `sent=True`, so `command_for`
    read one command's flag as if it described another and refused the write.

    The cost is not just a lost retry: refused this way, a write that never left the
    process would be reported to the AI as though it "may have landed" — the same
    ambiguous verdict a write HA genuinely received but lost the reply to deserves,
    and this one does not. `apply_write` only spends its single-use confirm token
    AFTER its save succeeds (never before), so this failure alone would not have
    burned it — but the user would still be wrongly told to treat an unsent write
    with the same caution as one that might have landed. `_live()` now re-raises any
    establishment failure as `sent=False`, so `command_for` retries it transparently
    instead of surfacing that false verdict."""
    fake = _ScriptedClient({"ok": True})
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

    assert await client.command("ambience/area/save", config={}) == {"ok": True}
    assert fake.sent == ["ambience/area/save"]  # re-sent exactly once, on the good socket


async def test_a_failed_authenticate_is_retried_for_a_WRITE_too():
    """The same establishment invariant, through the REAL `HAClient.authenticate()` —
    which raises HAConnectionError with the default `sent=True` even though the caller's
    command has not been written to any socket (the auth round trip has not even
    finished, so there is no session to have sent it on)."""

    class _DeadDuringAuth:
        async def send(self, data: str) -> None: ...

        async def recv(self) -> str:
            raise ConnectionResetError("socket dropped mid-auth")

        async def close(self) -> None: ...

    fresh = _ScriptedClient({"ok": True})
    attempts = [0]

    async def _connect(ws_url: str, token: str):
        attempts[0] += 1
        if attempts[0] == 1:
            await HAClient(_DeadDuringAuth()).authenticate(token)  # raises, sent=True
        return fresh

    client = ReconnectingClient(
        _connect,
        lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )

    assert await client.command("ambience/area/save", config={}) == {"ok": True}
    assert fresh.sent == ["ambience/area/save"]


async def test_a_write_sent_on_a_socket_that_lost_the_reply_is_still_never_re_sent():
    """THE invariant the establishment fix must not weaken, driven through a real
    `HAClient` and a real transport: the handshake completes, then the save's frame IS
    written and the socket dies before the reply. HA may have applied it, so re-sending
    could apply it twice.

    That failure comes from `HAClient.command`'s RECV path — not from `_live()` — so it
    keeps its `sent=True` and must never be laundered into a retry by the establishment
    fix, which only ever reclassifies failures raised while the connection is still
    being built."""

    class _AnswersTheHelloThenDies:
        """Replies to the hello; the next frame it is sent goes out and is never
        answered — the socket drops with the save already on the wire."""

        def __init__(self) -> None:
            self.sent: list[dict] = []

        async def send(self, data: str) -> None:
            self.sent.append(json.loads(data))

        async def recv(self) -> str:
            if len(self.sent) == 1:  # the hello
                return json.dumps(
                    {"id": 1, "type": "result", "success": True, "result": {"protocol": 1}}
                )
            raise ConnectionResetError("socket dropped after the send")

        async def close(self) -> None: ...

    doomed = _AnswersTheHelloThenDies()
    fresh = _ScriptedClient({"ok": True})
    made = iter([HAClient(doomed), fresh])

    async def _connect(ws_url: str, token: str):
        return next(made)

    client = ReconnectingClient(
        _connect,
        lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )

    with pytest.raises(HAConnectionError) as exc:
        await client.command("ambience/area/save", config={})
    assert exc.value.sent is True
    assert doomed.sent[1]["type"] == "ambience/area/save"  # it really did go out...
    assert fresh.sent == []  # ...and the fresh client saw NOTHING — never re-applied


async def test_a_second_consecutive_establishment_failure_propagates():
    """Establishment failures are `sent=False`, so `command_for` now retries them — for
    writes as well as reads. That is one extra connect attempt, not a loop: the retry's
    own failure propagates."""
    attempts = 0

    async def _connect(ws_url: str, token: str):
        nonlocal attempts
        attempts += 1
        raise HAConnectionError("unreachable", sent=True)

    client = ReconnectingClient(
        _connect,
        lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )

    with pytest.raises(HAConnectionError, match="unreachable"):
        await client.command("ambience/area/save", config={})
    assert attempts == 2  # the original + exactly one retry


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


@pytest.mark.parametrize(
    "failure",
    [BaseException, Exception],
    ids=["cancelled", "auth_rejected"],
)
async def test_connect_never_leaks_the_socket_when_auth_does_not_complete(monkeypatch, failure):
    """`connect()` owns the raw websocket until `authenticate()` returns; if auth does
    not complete, nothing else holds a reference and the socket (plus its reader/keepalive
    tasks) leaks.

    `asyncio.CancelledError` is a BaseException, so an `except Exception` here misses the
    one case most likely to hit it — an MCP client cancelling a tool call while the auth
    round trip is in flight. `_live()` guards its handshake with `except BaseException`
    for exactly this hazard but cannot help: this happens INSIDE `self._connect(...)`,
    before it has a client to close.
    """
    import asyncio
    import sys
    import types

    from ambience_mcp import ha_client

    raised = asyncio.CancelledError() if failure is BaseException else RuntimeError("boom")

    class _Connection:
        def __init__(self) -> None:
            self.closed = False

        async def send(self, data: str) -> None: ...

        async def recv(self) -> str:
            raise raised

        async def close(self) -> None:
            self.closed = True

    connection = _Connection()

    async def _connect(url, **kwargs):
        return connection

    monkeypatch.setitem(sys.modules, "websockets", types.SimpleNamespace(connect=_connect))

    with pytest.raises(BaseException):  # noqa: B017,PT011 — CancelledError OR HAConnectionError
        await ha_client.connect("ws://ha.local/api/websocket", "token")

    assert connection.closed is True


async def test_authentication_times_out_instead_of_hanging(monkeypatch):
    """connect()'s open_timeout bounds the socket OPEN; nothing bounded the
    auth frames. A proxy that completes the websocket upgrade but never
    forwards a frame must fail fast (the reconnect lock is held throughout),
    not hang every tool call forever."""
    monkeypatch.setattr(ha_client, "_COMMAND_TIMEOUT", 0.05)

    class _SilentTransport:
        def __init__(self):
            self.closed = False

        async def send(self, data):
            pass

        async def recv(self):
            await asyncio.Event().wait()  # never resolves

        async def close(self):
            self.closed = True

    client = HAClient(_SilentTransport())
    with pytest.raises(HAConnectionError):
        await client.authenticate("token")
    assert client.closed
