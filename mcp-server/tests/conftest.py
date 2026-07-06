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
