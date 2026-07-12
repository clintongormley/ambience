"""A minimal Home Assistant websocket client for the Ambience MCP server.

Speaks the HA websocket auth handshake, then issues id-correlated commands.
We never subscribe to events, so `command` can safely ignore any frame whose id
doesn't match the request it's waiting on."""

from __future__ import annotations

import asyncio
import contextlib
import json
from typing import Any, Protocol

from packaging.version import InvalidVersion, Version

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


class IncompatibleError(HAError):
    """This ambience-mcp and this Ambience cannot work together.

    Raised from every tool call, not just the one that noticed, and carrying a
    message that names WHICH side to upgrade. Never advises a downgrade: `uvx
    ambience-mcp` installs LATEST, so "install an older one" is advice the user
    cannot follow.
    """


class ProtocolChangedError(HAError):
    """The backend's protocol changed under a reconnect, after the command was built.

    Not an incompatibility — both protocols are supported. It is a TRANSIENT: the
    caller's adapter was chosen from the protocol agreed on the previous handshake,
    and the backend on the far side of the reconnect speaks a different one. Sending
    a v1-shaped command to a v2 backend is precisely the silent mismatch the frozen
    per-protocol adapters exist to prevent, so the command is dropped instead. The
    next tool call re-derives the adapter from the new protocol and succeeds.
    """


_UPDATE_AMBIENCE = (
    "Your Ambience is too old for this ambience-mcp. Update Ambience (HACS) and "
    "restart Home Assistant."
)


def _upgrade_mcp(reason: str) -> str:
    """The one remedy that gets a user from a too-old ambience-mcp to a working one.

    Every clause is load-bearing, and the third exists because the remedy is otherwise
    a NO-OP for anyone who followed the README's "Pinning a version" advice: a pinned
    `ambience-mcp@0.2.0` reinstalls the same pinned build after any cache clean or
    restart, so they would loop on this message forever. Naming the pin is the only
    way out — and it points FORWARD (remove the pin => get latest), never at an older
    or a specific version, which `uvx` could not install anyway.
    """
    return (
        f"{reason} Upgrade ambience-mcp: quit your MCP client, run "
        "`uv cache clean ambience-mcp`, then restart it. (`uvx` caches the old "
        "version and the running server holds the cache lock, so the restart alone "
        "is not enough.) If your MCP config pins a version (e.g. args "
        '`["ambience-mcp@0.2.0"]`), remove the pin — a pinned version never upgrades.'
    )


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

    def __init__(
        self,
        connect_fn: Any,
        config_fn: Any,
        *,
        supported_protocols: frozenset[int],
        mcp_version: str,
    ) -> None:
        self._connect = connect_fn
        self._config = config_fn
        self._client: HAClient | None = None
        self._lock = asyncio.Lock()
        # Injected, not imported: `protocols/` references HAClient, so importing it
        # here would be a cycle.
        self._supported = supported_protocols
        self._mcp_version = mcp_version
        self._verdict: str | None = None  # the incompatibility message, if any
        self._protocol: int | None = None

    async def _negotiate(self, client: HAClient) -> str | None:
        """Handshake over a freshly-connected client. Returns the incompatibility
        message, or None when the pair can work together."""
        try:
            hello = await client.command("ambience/mcp/hello")
        except HACommandError as exc:
            if exc.code == "unknown_command":
                return _UPDATE_AMBIENCE  # predates the handshake entirely
            raise

        # The backend refusing THIS client outranks any protocol question: it is the
        # one thing a protocol number cannot express ("that build is known-broken").
        floor = hello.get("min_mcp_version")
        if isinstance(floor, str):
            try:
                too_old = Version(self._mcp_version) < Version(floor)
            except InvalidVersion:
                too_old = False  # no floor we understand == no floor stated
            if too_old:
                return _upgrade_mcp(
                    f"This Ambience needs ambience-mcp >= {floor}; you are running "
                    f"{self._mcp_version}."
                )

        protocol = hello.get("protocol")
        # bool is an int subclass (`isinstance(True, int)` is True), so a backend
        # replying {"protocol": true} would otherwise "agree" a protocol of True —
        # exclude it explicitly so a bool is treated as missing/invalid.
        if not isinstance(protocol, int) or isinstance(protocol, bool):
            return _UPDATE_AMBIENCE  # pre-protocol: silence never grants permission
        if protocol in self._supported:
            self._protocol = protocol
            return None
        if protocol > max(self._supported):
            return _upgrade_mcp(
                f"This Ambience speaks MCP protocol {protocol}; this ambience-mcp "
                f"speaks {sorted(self._supported)}."
            )
        return (
            f"This ambience-mcp no longer supports MCP protocol {protocol} (it speaks "
            f"{sorted(self._supported)}). Update Ambience (HACS)."
        )

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
                    client = await self._connect(cfg.ws_url, cfg.token)
                    # Handshake ONCE per connection, before publishing the client —
                    # so it costs one round trip, and re-runs on every reconnect.
                    # Changing the backend's protocol means restarting HA, which
                    # drops the socket, so a stale verdict cannot survive the very
                    # upgrade that would change it. That makes this self-healing.
                    self._protocol = None
                    self._verdict = None  # don't let the previous connection's verdict linger
                    try:
                        self._verdict = await self._negotiate(client)
                    except BaseException:
                        # The handshake itself failed (bad auth, dropped socket
                        # mid-hello, ...). The client was never published to
                        # self._client, so nothing else will ever close it —
                        # release it now or every subsequent call leaks a socket.
                        with contextlib.suppress(Exception):
                            await client.close()
                        raise
                    self._client = client
        return self._client

    async def _checked_live(self) -> HAClient:
        """`_live()`, then re-check the verdict it may have just set.

        A single `_verdict` check at the top of `command()`/`ready()` is not
        enough: the reconnect-and-retry path calls `_live()` a second time, and
        *that* call can be the one that reconnects, re-handshakes, and discovers
        incompatibility. Every call to `_live()` that might send a command must
        be paired with a fresh verdict check, or the retry can send a tool
        command to a backend it just declared incompatible.
        """
        client = await self._live()
        if self._verdict is not None:
            # Raise BEFORE sending: an incompatible pair must not touch the backend.
            raise IncompatibleError(self._verdict)
        return client

    async def _live_for(self, agreed: int | None) -> tuple[HAClient, int | None]:
        """`_checked_live()`, then refuse to hand back a client whose protocol is no
        longer the one `agreed` — the one the caller's adapter was built from.

        `_checked_live()` blocks only INCOMPATIBLE protocols. A protocol that is
        SUPPORTED but DIFFERENT sails straight through it: `_live()` can hand back a
        stale-but-not-yet-known-dead client (the normal state right after an HA
        restart), the adapter gets built from the cached protocol, and the reconnect
        that discovers the new one happens later, inside `command()` — with no way to
        tell the already-constructed adapter that the ground moved. Unreachable while
        only one protocol exists; live the moment a `v2.py` ships, which is the whole
        point of the frozen-adapter design.

        Returns the live protocol so a caller that had none yet (a `command()` before
        any `ready()`) adopts the one this handshake agreed.
        """
        client = await self._checked_live()
        protocol = self._protocol
        if agreed is not None and protocol != agreed:
            raise ProtocolChangedError(
                f"Home Assistant reconnected and now speaks MCP protocol {protocol} "
                f"(it was {agreed}). This call was built for the old protocol, so it "
                f"was NOT sent. Nothing is wrong — just try again."
            )
        return client, protocol

    async def ready(self) -> int:
        """Connect and negotiate. Raises IncompatibleError if the pair cannot work
        together; otherwise returns the agreed protocol."""
        await self._checked_live()
        if self._protocol is None:
            # A clean verdict (None) always sets _protocol — this would mean
            # _negotiate() returned None without agreeing a protocol, which is a
            # bug in _negotiate(), not a runtime condition callers can hit. Raise
            # rather than `assert`: assertions are stripped under `python -O`,
            # and a bare None here would surface downstream as an opaque
            # `KeyError: None` from `PROTOCOLS[await client.ready()]`.
            raise RuntimeError(
                "ReconnectingClient.ready(): no compatibility verdict was set for "
                "an agreed protocol — this is a bug in _negotiate()"
            )
        return self._protocol

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        # `agreed` is the protocol the CALLER's adapter was built from — read before
        # anything can reconnect. `_live_for` refuses to send once the backend on the
        # far side of a reconnect is a different (even if supported) protocol; losing
        # one tool call is the safe direction, because the model just retries and the
        # retry re-derives the adapter from the new protocol.
        agreed = self._protocol
        try:
            client, agreed = await self._live_for(agreed)
            return await client.command(type, **payload)
        except HAConnectionError as exc:
            # Never reached HA → always safe to re-send, read or write.
            # Reached HA but the reply was lost → safe only for a read; a write may
            # have been applied, and re-sending could apply it twice.
            if exc.sent and _mutates(type):
                raise
            client, _ = await self._live_for(agreed)
            return await client.command(type, **payload)

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
