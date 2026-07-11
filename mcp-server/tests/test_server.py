import pytest

import ambience_mcp.server as server
from ambience_mcp.ha_client import HAConnectionError


def test_exposes_a_fastmcp_instance_and_main():
    assert server.mcp is not None
    assert callable(server.main)


async def test_client_closes_the_dead_client_before_reconnecting(monkeypatch):
    closed: list[str] = []

    class _FakeClient:
        def __init__(self, name: str) -> None:
            self.name = name
            self._closed = False

        @property
        def closed(self) -> bool:
            return self._closed

        async def close(self) -> None:
            self._closed = True
            closed.append(self.name)

    made = iter([_FakeClient("a"), _FakeClient("b")])

    async def _fake_connect(ws_url: str, token: str) -> object:
        return next(made)

    monkeypatch.setattr(server, "_client", None)
    monkeypatch.setattr(server, "connect", _fake_connect)
    monkeypatch.setattr(
        server, "load_config", lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})()
    )

    first = await server._client_()  # connects "a"
    first._closed = True  # a transport break marks it closed
    second = await server._client_()  # must close "a", then connect "b"

    assert second.name == "b"
    assert closed == ["a"]  # the dead client's socket/tasks were released


def _stub_connection(monkeypatch, clients: list[object]) -> None:
    """Point server._client_ at a scripted sequence of clients."""
    made = iter(clients)

    async def _fake_connect(ws_url: str, token: str) -> object:
        return next(made)

    monkeypatch.setattr(server, "_client", None)
    monkeypatch.setattr(server, "connect", _fake_connect)
    monkeypatch.setattr(
        server, "load_config", lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})()
    )


class _Client:
    def __init__(self) -> None:
        self._closed = False

    @property
    def closed(self) -> bool:
        return self._closed

    async def close(self) -> None:
        self._closed = True


async def test_a_read_retries_on_a_stale_socket_so_an_ha_restart_costs_no_call(monkeypatch):
    """HA restarts kill the websocket silently. The failure only surfaces on the
    next command, so without a retry the first tool call after every HA restart
    fails and only the one after it reconnects."""
    _stub_connection(monkeypatch, [_Client(), _Client()])
    calls: list[str] = []

    async def _tool(client, **kwargs):
        calls.append("call")
        if len(calls) == 1:
            client._closed = True
            raise HAConnectionError("websocket command failed", sent=False)
        return {"ok": True}

    assert await server._call(_tool) == {"ok": True}
    assert len(calls) == 2  # failed once, reconnected, succeeded


async def test_a_write_is_not_retried_once_it_reached_home_assistant(monkeypatch):
    """The command was sent, so HA may have applied it and only the reply was
    lost. Re-sending would risk applying the write twice."""
    _stub_connection(monkeypatch, [_Client(), _Client()])
    calls: list[str] = []

    async def _write(client, **kwargs):
        calls.append("call")
        client._closed = True
        raise HAConnectionError("websocket command failed", sent=True)

    with pytest.raises(HAConnectionError):
        await server._call(_write, idempotent=False)
    assert len(calls) == 1  # never re-sent


async def test_a_read_retries_even_when_the_command_had_been_sent(monkeypatch):
    """Reads have no side effects, so a lost reply is safe to re-request."""
    _stub_connection(monkeypatch, [_Client(), _Client()])
    calls: list[str] = []

    async def _read(client, **kwargs):
        calls.append("call")
        if len(calls) == 1:
            client._closed = True
            raise HAConnectionError("websocket command failed", sent=True)
        return {"ok": True}

    assert await server._call(_read, idempotent=True) == {"ok": True}
    assert len(calls) == 2


async def test_a_retry_that_fails_again_propagates(monkeypatch):
    _stub_connection(monkeypatch, [_Client(), _Client()])

    async def _always_dead(client, **kwargs):
        client._closed = True
        raise HAConnectionError("websocket command failed", sent=False)

    with pytest.raises(HAConnectionError):
        await server._call(_always_dead)


def test_all_tool_wrappers_exist():
    for name in [
        "ambience_get_context",
        "ambience_get_scope",
        "ambience_get_guide",
        "ambience_dry_run",
        "ambience_validate",
        "ambience_preview_write",
        "ambience_apply_write",
        "ambience_list_traces",
        "ambience_list_categories",
        "ambience_save_categories",
    ]:
        assert hasattr(server, name), f"missing tool wrapper {name}"
