"""A minimal Home Assistant websocket client for the Ambience MCP server.

Speaks the HA websocket auth handshake, then issues id-correlated commands.
We never subscribe to events, so `command` can safely ignore any frame whose id
doesn't match the request it's waiting on."""

from __future__ import annotations

import json
from typing import Any, Protocol


class HAError(RuntimeError):
    """Base class for HA websocket failures."""


class HAAuthError(HAError):
    """Authentication was rejected."""


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

    async def authenticate(self, token: str) -> None:
        first = json.loads(await self._transport.recv())
        if first.get("type") != "auth_required":
            raise HAAuthError(f"expected auth_required, got {first.get('type')!r}")
        await self._transport.send(json.dumps({"type": "auth", "access_token": token}))
        reply = json.loads(await self._transport.recv())
        if reply.get("type") != "auth_ok":
            raise HAAuthError(reply.get("message") or "authentication failed")

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        self._next_id += 1
        cmd_id = self._next_id
        await self._transport.send(json.dumps({"id": cmd_id, "type": type, **payload}))
        while True:
            msg = json.loads(await self._transport.recv())
            if msg.get("id") != cmd_id or msg.get("type") != "result":
                continue
            if msg.get("success"):
                return msg.get("result") or {}
            error = msg.get("error") or {}
            raise HACommandError(error.get("code", "unknown"), error.get("message", ""))

    async def close(self) -> None:
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

    # max_size=None: the AI bundle can exceed the default 1 MiB frame cap.
    connection = await websockets.connect(ws_url, max_size=None)
    client = HAClient(_WebsocketsTransport(connection))
    await client.authenticate(token)
    return client
