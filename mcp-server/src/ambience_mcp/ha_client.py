"""A minimal Home Assistant websocket client for the Ambience MCP server.

Speaks the HA websocket auth handshake, then issues id-correlated commands.
We never subscribe to events, so `command` can safely ignore any frame whose id
doesn't match the request it's waiting on."""

from __future__ import annotations

import asyncio
import json
from typing import Any, Protocol

_CONNECT_TIMEOUT = 10  # seconds — fail fast on an unreachable / firewalled HA host


class HAError(RuntimeError):
    """Base class for HA websocket failures."""


class HAAuthError(HAError):
    """Authentication was rejected."""


class HAConnectionError(HAError):
    """The websocket failed to open, dropped mid-session, or sent a bad frame."""


class HACommandError(HAError):
    """A command returned success: false."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(f"{code}: {message}")
        self.code = code
        self.message = message


class Transport(Protocol):
    async def send(self, data: str) -> None: ...
    async def recv(self) -> str: ...
    async def close(self) -> None: ...


class HAClient:
    def __init__(self, transport: Transport) -> None:
        self._transport = transport
        self._next_id = 0
        self._lock = asyncio.Lock()
        self._closed = False

    @property
    def closed(self) -> bool:
        """True once a transport failure has broken this client; the caller
        should discard it and reconnect."""
        return self._closed

    async def authenticate(self, token: str) -> None:
        first = json.loads(await self._transport.recv())
        if first.get("type") != "auth_required":
            raise HAAuthError(f"expected auth_required, got {first.get('type')!r}")
        await self._transport.send(json.dumps({"type": "auth", "access_token": token}))
        reply = json.loads(await self._transport.recv())
        if reply.get("type") != "auth_ok":
            raise HAAuthError(reply.get("message") or "authentication failed")

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        # Serialise command/response pairs: one transport allows only one
        # in-flight recv() at a time, and the MCP SDK can dispatch tool calls as
        # concurrent tasks — overlapping commands would otherwise race on recv().
        async with self._lock:
            self._next_id += 1
            cmd_id = self._next_id
            try:
                await self._transport.send(json.dumps({"id": cmd_id, "type": type, **payload}))
                while True:
                    msg = json.loads(await self._transport.recv())
                    if msg.get("id") != cmd_id or msg.get("type") != "result":
                        continue
                    if msg.get("success"):
                        return msg.get("result") or {}
                    error = msg.get("error") or {}
                    raise HACommandError(error.get("code", "unknown"), error.get("message", ""))
            except HACommandError:
                raise  # a normal command-level failure — the connection is fine
            except Exception as exc:  # transport dropped / malformed frame
                self._closed = True
                raise HAConnectionError(f"websocket connection failed: {exc}") from exc

    async def close(self) -> None:
        self._closed = True
        await self._transport.close()


class _WebsocketsTransport:
    def __init__(self, connection: Any) -> None:
        self._connection = connection

    async def send(self, data: str) -> None:
        await self._connection.send(data)

    async def recv(self) -> str:
        frame = await self._connection.recv()
        return frame if isinstance(frame, str) else frame.decode("utf-8")

    async def close(self) -> None:
        await self._connection.close()


async def connect(ws_url: str, token: str) -> HAClient:
    import websockets

    try:
        # max_size=None: the AI bundle can exceed the default 1 MiB frame cap.
        connection = await websockets.connect(ws_url, max_size=None, open_timeout=_CONNECT_TIMEOUT)
    except Exception as exc:  # unreachable host, bad URL, TLS/timeout error
        raise HAConnectionError(f"could not connect to Home Assistant at {ws_url}: {exc}") from exc
    client = HAClient(_WebsocketsTransport(connection))
    try:
        await client.authenticate(token)
    except Exception:
        await connection.close()  # don't leak the socket on a bad token / failed handshake
        raise
    return client
