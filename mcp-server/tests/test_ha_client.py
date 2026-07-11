import pytest
from conftest import FakeTransport

from ambience_mcp.ha_client import HAAuthError, HAClient, HACommandError, HAConnectionError


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
    class BoomTransport:
        async def send(self, data: str) -> None: ...
        async def recv(self) -> str:
            raise ConnectionResetError("socket dropped")

        async def close(self) -> None: ...

    client = HAClient(BoomTransport())
    with pytest.raises(HAConnectionError, match="socket dropped"):
        await client.command("ambience/house/get")
    assert client.closed is True


async def test_a_failed_send_reports_the_command_never_left_the_client():
    """A socket that went stale while idle (an HA restart) fails on send — HA
    never saw the command, so it is provably safe to retry, even a write."""

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


async def test_a_failed_receive_reports_the_command_may_have_run():
    """The send succeeded, so HA may have applied a write and only the reply was
    lost. Retrying is NOT safe — the caller must be told."""

    class DeadOnRecv:
        async def send(self, data: str) -> None: ...
        async def recv(self) -> str:
            raise ConnectionResetError("socket dropped")

        async def close(self) -> None: ...

    client = HAClient(DeadOnRecv())
    with pytest.raises(HAConnectionError) as exc:
        await client.command("ambience/house/get")
    assert exc.value.sent is True


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
