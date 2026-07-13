"""Shared test doubles."""

from __future__ import annotations

import json
from typing import Any


class FakeTransport:
    """A scripted Transport: `recv()` pops the next queued frame; `send()` records."""

    def __init__(self, incoming: list[dict[str, Any]]) -> None:
        self._incoming = [json.dumps(m) for m in incoming]
        self.sent: list[dict[str, Any]] = []
        self.closed = False

    async def send(self, data: str) -> None:
        self.sent.append(json.loads(data))

    async def recv(self) -> str:
        if not self._incoming:
            raise AssertionError("FakeTransport: no more scripted frames")
        return self._incoming.pop(0)

    async def close(self) -> None:
        self.closed = True


class FakeClient:
    """Stands in for HAClient in tool tests. Records commands and returns
    scripted results keyed by command type; raises HACommandError for types
    whose scripted value is an exception."""

    def __init__(self, results: dict[str, Any] | None = None) -> None:
        self.results = results or {}
        self.calls: list[dict[str, Any]] = []
        self.agreed: list[int | None] = []
        self.closed = False

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        self.calls.append({"type": type, **payload})
        value = self.results.get(type, {})
        if isinstance(value, Exception):
            raise value
        return value

    async def command_for(self, agreed: int | None, type: str, **payload: Any) -> dict[str, Any]:
        """The pinned form a protocol adapter uses (see `ReconnectingClient.command_for`).

        The agreed protocol is recorded SEPARATELY from the payload — it is an
        assertion the caller makes about the connection, not a wire field — so
        `calls` stays the exact command the backend would see.
        """
        self.agreed.append(agreed)
        return await self.command(type, **payload)

    async def close(self) -> None:
        self.closed = True
