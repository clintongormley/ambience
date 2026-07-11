"""A minimal Home Assistant websocket client for the Ambience MCP server.

Speaks the HA websocket auth handshake, then issues id-correlated commands.
We never subscribe to events, so `command` can safely ignore any frame whose id
doesn't match the request it's waiting on."""

from __future__ import annotations

import asyncio
import contextlib
import json
from typing import Any, Protocol

_CONNECT_TIMEOUT = 10  # seconds — fail fast on an unreachable / firewalled HA host
_COMMAND_TIMEOUT = 10  # seconds — fail fast + reconnect if HA never answers a command


class HAError(RuntimeError):
    """Base class for HA websocket failures."""


class HAAuthError(HAError):
    """Authentication was rejected."""


class HAConnectionError(HAError):
    """The websocket failed to open, dropped mid-session, or sent a bad frame.

    `sent` says whether the command reached Home Assistant before the failure.
    False (the socket was already dead when we tried to write) means HA never saw
    it, so even a write is safe to retry. True means it may have been applied and
    only the reply was lost — re-sending a write could apply it twice.
    """

    def __init__(self, message: str, *, sent: bool = True) -> None:
        super().__init__(message)
        self.sent = sent


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
        # Same contract as command(): a genuine auth rejection is HAAuthError,
        # but a dropped socket / malformed or non-object frame becomes
        # HAConnectionError so callers never see raw json/transport exceptions.
        try:
            first = json.loads(await self._transport.recv())
            if first.get("type") != "auth_required":
                raise HAAuthError(f"expected auth_required, got {first.get('type')!r}")
            await self._transport.send(json.dumps({"type": "auth", "access_token": token}))
            reply = json.loads(await self._transport.recv())
            if reply.get("type") != "auth_ok":
                raise HAAuthError(reply.get("message") or "authentication failed")
        except HAAuthError:
            raise
        except Exception as exc:  # transport dropped / malformed or non-object frame
            self._closed = True
            raise HAConnectionError(f"websocket connection failed during auth: {exc}") from exc

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        # Serialise command/response pairs: one transport allows only one
        # in-flight recv() at a time, and the MCP SDK can dispatch tool calls as
        # concurrent tasks — overlapping commands would otherwise race on recv().
        async with self._lock:
            # Never send on a client already known dead. A command queued behind a
            # slow one would otherwise go out on a socket that is about to be torn
            # down, then die on RECEIVE — classified sent=True and so never re-sent,
            # leaving a write with an unknowable outcome. Failing here makes it
            # sent=False, and the caller re-sends it on a fresh socket.
            if self._closed:
                raise HAConnectionError("connection is closed", sent=False)
            self._next_id += 1
            cmd_id = self._next_id
            # Serialise BEFORE the try: a non-serialisable payload is our bug, not a
            # transport failure, and must not tear down a healthy socket.
            frame = json.dumps({"id": cmd_id, "type": type, **payload})
            # Send and receive are reported separately: a socket that went stale
            # while idle (an HA restart) fails here, before HA sees anything, and
            # the caller can safely re-send it — even a write. See HAConnectionError.
            try:
                await self._transport.send(frame)
            except Exception as exc:
                self._closed = True
                raise HAConnectionError(f"websocket command failed: {exc}", sent=False) from exc
            try:
                # Bounded so a live-but-unresponsive HA can't wedge the lock (and
                # thus every other tool call) forever — fail fast, then reconnect.
                return await asyncio.wait_for(self._recv_result(cmd_id), _COMMAND_TIMEOUT)
            except HACommandError:
                raise  # a normal command-level failure — the connection is fine
            except Exception as exc:  # timeout / transport dropped / malformed frame
                self._closed = True
                raise HAConnectionError(f"websocket command failed: {exc}", sent=True) from exc

    async def _recv_result(self, cmd_id: int) -> dict[str, Any]:
        while True:
            msg = json.loads(await self._transport.recv())
            if msg.get("id") != cmd_id or msg.get("type") != "result":
                continue
            if msg.get("success"):
                return msg.get("result") or {}
            error = msg.get("error") or {}
            raise HACommandError(error.get("code", "unknown"), error.get("message", ""))

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


def _mutates(command: str) -> bool:
    """Whether a command changes state in Home Assistant.

    Classified by the command itself — a fact about the protocol — rather than by a
    flag each tool has to remember to set. Every Ambience write is a `/save`
    (`ambience/{area,floor,house}/save`, `ambience/categories/save`); everything else
    reads.
    """
    return command.endswith("/save")


class ReconnectingClient:
    """Owns the live `HAClient` and re-sends a command that provably never left us.

    Home Assistant closes every websocket when it restarts, and we only discover
    that on the *next* command — so without this the first tool call after any HA
    restart fails and only the one after it reconnects.

    The retry sits here, at the **command** layer, rather than around a whole tool:
    a command that failed on `send` never reached HA, so re-sending that one frame
    on a fresh socket is safe for reads and writes alike, and needs no per-tool
    "is this idempotent?" annotation. Retrying a whole tool would be neither — it
    would re-run the tool's local side effects, and `apply_write` consumes its
    single-use confirm token *before* it writes, so a re-entry would report a bogus
    "bad confirm_token" for what was only a dropped socket.

    A command that HA *did* receive (`sent=True`) is never re-sent: it may have been
    applied with only the reply lost.
    """

    def __init__(self, connect_fn: Any, config_fn: Any) -> None:
        self._connect = connect_fn
        self._config = config_fn
        self._client: HAClient | None = None
        self._lock = asyncio.Lock()

    async def _live(self) -> HAClient:
        # Reconnect if we have no client yet, or the last one broke on a transport
        # failure (HA restart, dropped socket) and marked itself closed.
        if self._client is None or self._client.closed:
            async with self._lock:
                if self._client is None or self._client.closed:
                    if self._client is not None:
                        # Release the dead client's socket + keepalive/reader tasks;
                        # a malformed frame can mark it closed while the socket is
                        # still open, so they'd otherwise leak. Best-effort.
                        with contextlib.suppress(Exception):
                            await self._client.close()
                    cfg = self._config()
                    self._client = await self._connect(cfg.ws_url, cfg.token)
        return self._client

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        try:
            return await (await self._live()).command(type, **payload)
        except HAConnectionError as exc:
            # Never reached HA → always safe to re-send, read or write.
            # Reached HA but the reply was lost → safe only for a read; a write may
            # have been applied, and re-sending could apply it twice.
            if exc.sent and _mutates(type):
                raise
            return await (await self._live()).command(type, **payload)

    async def close(self) -> None:
        if self._client is not None:
            await self._client.close()


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
