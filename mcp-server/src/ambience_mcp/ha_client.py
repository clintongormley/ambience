"""A minimal Home Assistant websocket client for the Ambience MCP server.

Speaks the HA websocket auth handshake, then issues id-correlated commands.
We never subscribe to events, so `command` can safely ignore any frame whose id
doesn't match the request it's waiting on."""

from __future__ import annotations

import asyncio
import contextlib
import json
from typing import Any, NamedTuple, Protocol

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
    False means HA never saw it — the socket was already dead when we tried to
    write, or the failure happened while the connection was still being
    ESTABLISHED, so the caller's command had not been written to any socket (see
    `ReconnectingClient._live`) — so even a write is safe to retry. True means it
    may have been applied and only the reply was lost — re-sending a write could
    apply it twice.
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
    message that names WHICH side to upgrade. Never advises a downgrade:
    `uvx ambience-mcp@latest` installs LATEST, so "install an older one" is
    advice the user cannot follow.
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


def _update_ambience(reason: str) -> str:
    """The one remedy for an Ambience whose protocol/version this ambience-mcp
    cannot work with: mirrors `_upgrade_mcp` below — a `reason` prefix, then the
    fixed remedy — just naming HACS + a restart as the mechanism instead of `uvx`.
    """
    return f"{reason} Update Ambience (HACS) and restart Home Assistant."


_UPDATE_AMBIENCE = _update_ambience("Your Ambience is too old for this ambience-mcp.")


def _prerelease_clause(ambience_version: object) -> str:
    """The extra clause an "upgrade ambience-mcp" remedy needs when the BACKEND is a
    pre-release — and nothing at all when it is not.

    A pre-release Ambience is paired with a pre-release `ambience-mcp`, and a plain
    `uvx ambience-mcp@latest` cannot see one: uv's default prerelease strategy skips
    pre-releases whenever a final release exists (`@latest` changes FRESHNESS, not the
    channel). So the moment any final ambience-mcp is published, a beta tester on the
    documented (`@latest`) config who is told to "upgrade ambience-mcp" would restart,
    resolve that same final build again, and loop forever — the exact unfollowable
    advice this handshake exists to make unreachable. `--prerelease=allow` is the only
    way out, and it points FORWARD: it WIDENS what uv may resolve, never asking for a
    pinned or an earlier build (which `uvx` could not install anyway).

    Conservative, and deliberately one-directional:
    - absent / null / not a string / unparseable `ambience_version` → no clause. The
      verdict never changes; only the wording does. A backend we cannot read a version
      from is not one we may guess a channel for.
    - a FINAL backend → no clause. Telling a stable user to allow pre-releases is bad
      advice in the other direction: it would quietly move them onto rc builds.
    """
    if not isinstance(ambience_version, str):
        return ""
    try:
        if not Version(ambience_version).is_prerelease:
            return ""
    except InvalidVersion:
        return ""
    return (
        f" This Ambience ({ambience_version}) is a PRE-RELEASE, so your MCP client must "
        "allow pre-releases too, or `uvx` will keep reinstalling the newest FINAL "
        'ambience-mcp: use args `["--prerelease=allow", "ambience-mcp@latest"]` '
        "(`uvx --prerelease=allow ambience-mcp@latest`)."
    )


def _upgrade_mcp(reason: str, *, ambience_version: object = None) -> str:
    """The one remedy that gets a user from a too-old ambience-mcp to a working one.

    Every clause is load-bearing, and the second exists because the remedy is otherwise
    a NO-OP for anyone who followed the README's "Pinning a version" advice: a pinned
    `ambience-mcp@0.2.0` reinstalls the same pinned build after every restart, so they
    would loop on this message forever. Naming the pin is the only way out — and it
    points FORWARD (remove the pin => get latest), never at an older or a specific
    version, which `uvx` could not install anyway.

    `ambience_version` is the backend's own version, straight off the hello. It adds the
    pre-release channel clause (see `_prerelease_clause`) when — and only when — the
    backend is a pre-release, for the same reason as the pin clause: without it, the
    rest of the remedy is a no-op for the one user it is aimed at.
    """
    return (
        f"{reason} Upgrade ambience-mcp: restart your MCP client — the documented "
        "config runs `ambience-mcp@latest`, which installs the newest release every "
        "time the server starts. If your MCP config pins a version (e.g. args "
        '`["ambience-mcp@0.2.0"]`), remove the pin — a pinned version never upgrades.'
        f"{_prerelease_clause(ambience_version)}"
    )


class _Negotiated(NamedTuple):
    """The outcome of one handshake, stored as ONE immutable value.

    `message` is the incompatibility message (None when the pair can work
    together); `protocol` is the agreed protocol (set exactly when `message`
    is None). Bundling them makes a half-set state unrepresentable: readers
    see either the previous complete outcome or the new one, never a mix —
    a torn read of separate fields shipped a real wedge once.

    Caching policy (see `_live`): a CLEAN outcome is cached for the life of
    the connection (the backend's protocol can only change across an HA
    restart, which drops the socket and re-handshakes). ANY failure outcome is
    re-derived on every call — the call was going to fail anyway, the extra
    hello costs one round trip on a failing path, and it is what lets the
    connection heal the moment the backend can answer: the config entry
    finishes setting up, the user upgrades Ambience, a reload completes.
    Caching a failure was how a user who followed the remedy stayed refused
    until they restarted their MCP client.
    """

    message: str | None
    protocol: int | None


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
        # Both recvs are bounded: this runs while the reconnect lock is held,
        # so a peer that opens the socket but never speaks (a half-configured
        # reverse proxy) would otherwise wedge every tool call forever.
        try:
            first = json.loads(await asyncio.wait_for(self._transport.recv(), _COMMAND_TIMEOUT))
            if first.get("type") != "auth_required":
                raise HAAuthError(f"expected auth_required, got {first.get('type')!r}")
            await self._transport.send(json.dumps({"type": "auth", "access_token": token}))
            reply = json.loads(await asyncio.wait_for(self._transport.recv(), _COMMAND_TIMEOUT))
            if reply.get("type") != "auth_ok":
                raise HAAuthError(reply.get("message") or "authentication failed")
        except HAAuthError:
            raise
        except Exception as exc:  # transport dropped / timeout / malformed frame
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
    would re-run the tool's local side effects, and `apply_write` only spends its
    single-use confirm token once a save has actually succeeded, so a whole-tool
    re-entry after that point would report a bogus "bad confirm_token" for a write
    that in fact already landed, instead of telling the caller it's done.

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
        # The one handshake outcome, or None before the first handshake on this
        # connection. Written ONLY by _handshake (single assignment, post-await);
        # read ONCE per call in _live/_live_for so message+protocol move together.
        self._negotiated: _Negotiated | None = None

    def _own_version(self) -> Version:
        """This ambience-mcp's own version, parsed.

        Split out from the backend's floor because the two unparseable cases have
        OPPOSITE right answers: a floor we cannot read is "no floor stated" (conservative
        — the backend never meant to refuse anyone we cannot understand it as refusing),
        while a version of OURSELVES we cannot read is a packaging bug in this build.
        Swallowing that one — as a single try/except around both would — silently
        disables the refusal floor entirely, which is the backend's strongest safety
        valve. Ignore the backend's garbage; fail loudly on our own.
        """
        try:
            return Version(self._mcp_version)
        except InvalidVersion as exc:
            raise RuntimeError(
                f"ambience-mcp cannot parse its OWN version ({self._mcp_version!r}), so "
                f"the minimum-version floor this Ambience declares cannot be enforced. "
                f"This is a packaging bug in ambience-mcp, not a problem with Ambience."
            ) from exc

    async def _negotiate(self, client: HAClient) -> _Negotiated:
        """Handshake over `client`. Returns the outcome — see `_Negotiated` — without
        touching any shared state; the caller (`_handshake`) does the one assignment."""
        try:
            hello = await client.command("ambience/mcp/hello")
        except HACommandError as exc:
            if exc.code == "unknown_command":
                # Either a genuinely pre-handshake Ambience, or — indistinguishably, and
                # far more often — a current one whose config entry has not finished
                # setting up yet (HA answers `unknown_command` for the whole startup
                # window; see `_Negotiated`). The message must still be raised on every
                # call, because for the old Ambience it is the correct and only remedy.
                # What it must NOT be is CACHED — that follows from the failure-outcomes-
                # are-always-re-derived policy in `_Negotiated`'s docstring: this re-derives
                # on the next tool call, over this same healthy socket, so a current
                # Ambience heals the instant its setup completes — no reconnect, no
                # MCP-server restart.
                return _Negotiated(_UPDATE_AMBIENCE, None)
            raise

        # The backend's OWN version — not a compatibility input (the protocol and the
        # floor decide that), but it decides which ambience-mcp CHANNEL the "upgrade
        # ambience-mcp" remedy has to name: a pre-release Ambience is paired with a
        # pre-release ambience-mcp, which `uvx ambience-mcp@latest` will never
        # resolve while a final release exists. It only ever changes the message's
        # WORDING — see `_prerelease_clause` — so an absent, null, or unparseable
        # value simply omits a clause and every verdict below stands exactly as it
        # would have.
        ambience_version = hello.get("ambience_version")

        # The backend refusing THIS client outranks any protocol question: it is the
        # one thing a protocol number cannot express ("that build is known-broken").
        floor = hello.get("min_mcp_version")
        if isinstance(floor, str):
            try:
                required = Version(floor)
            except InvalidVersion:
                required = None  # no floor we understand == no floor stated
            if required is not None and self._own_version() < required:
                return _Negotiated(
                    _upgrade_mcp(
                        f"This Ambience needs ambience-mcp >= {floor}; you are running "
                        f"{self._mcp_version}.",
                        ambience_version=ambience_version,
                    ),
                    None,
                )

        protocol = hello.get("protocol")
        # bool is an int subclass (`isinstance(True, int)` is True), so a backend
        # replying {"protocol": true} would otherwise "agree" a protocol of True —
        # exclude it explicitly so a bool is treated as missing/invalid.
        if not isinstance(protocol, int) or isinstance(protocol, bool):
            # pre-protocol: silence never grants permission — the backend ANSWERED,
            # it just said nothing we can use. Re-derived per call like every
            # failure outcome — see `_Negotiated`.
            return _Negotiated(_UPDATE_AMBIENCE, None)
        if not self._supported:
            # Unreachable in a shipped build (Gate 1 refuses a repo whose PROTOCOLS is
            # empty), but `supported_protocols` is the one value this class does not
            # derive itself — it is INJECTED. Empty, `max()` below would raise a bare
            # ValueError on every tool call, replacing the actionable message this whole
            # design exists to deliver with a traceback.
            return _Negotiated(
                _upgrade_mcp("This ambience-mcp ships no MCP protocol adapters."), None
            )
        if protocol in self._supported:
            return _Negotiated(None, protocol)
        if protocol > max(self._supported):
            return _Negotiated(
                _upgrade_mcp(
                    f"This Ambience speaks MCP protocol {protocol}; this ambience-mcp "
                    f"speaks {sorted(self._supported)}.",
                    ambience_version=ambience_version,
                ),
                None,
            )
        return _Negotiated(
            _update_ambience(
                f"This ambience-mcp no longer supports MCP protocol {protocol} (it speaks "
                f"{sorted(self._supported)})."
            ),
            None,
        )

    async def _handshake(self, client: HAClient) -> None:
        """Negotiate over `client` and record the outcome. The caller holds `self._lock`.

        ONE assignment, AFTER the hello completes. A hello that raises — a
        cancelled tool call, an error reply, a timeout — leaves the previous
        outcome standing: for the re-derive path that outcome is the failure
        verdict being re-derived, which is still true; for establishment the
        client is never published, so the stale value is unreachable. The
        previous shape (clear three fields first, then negotiate) latched a
        half-cleared state on any non-connection error and wedged every later
        call until the process restarted.
        """
        self._negotiated = await self._negotiate(client)

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
                    # ESTABLISHMENT — connect, authenticate, handshake. The caller's
                    # command is still sitting in `command_for`'s locals throughout: not
                    # one byte of it has been written to any socket. So an
                    # HAConnectionError from in here says NOTHING about that command
                    # having reached HA, and the `sent` flags these three sources carry
                    # cannot be believed as if it did:
                    #   - `connect()` (the socket never opened) and `HAClient.
                    #     authenticate()` both raise with the default `sent=True`;
                    #   - the hello inside `_negotiate` can raise `sent=True` from its OWN
                    #     recv path (a `_COMMAND_TIMEOUT`) — true of the HELLO, but read by
                    #     `command_for` as if it described the CALLER's command. One
                    #     command's flag must never answer for another's.
                    # Left as-is, a write that hits a reconnect here defaults to sent=True
                    # (see above) and so is never auto-resent — surfaced to the caller as
                    # "may already have been applied" when nothing was sent at all: not one
                    # byte of this connection attempt ever reached HA. A write that never
                    # left this process must not be reported to the AI as "may have landed".
                    # Re-raise as sent=False instead: nothing the caller asked for has been
                    # written, so even a write is safe to re-send.
                    try:
                        client = await self._connect(cfg.ws_url, cfg.token)
                        # Handshake ONCE per connection, before publishing the client —
                        # so it costs one round trip, and re-runs on every reconnect.
                        # Changing the backend's protocol means restarting HA, which
                        # drops the socket, so a stale verdict cannot survive the very
                        # upgrade that would change it. That makes this self-healing.
                        try:
                            await self._handshake(client)
                        except BaseException:
                            # The handshake itself failed (bad auth, dropped socket
                            # mid-hello, a cancelled tool call, ...). The client was never
                            # published to self._client, so nothing else will ever close
                            # it — release it now or every subsequent call leaks a socket.
                            with contextlib.suppress(Exception):
                                await client.close()
                            raise
                    except HAConnectionError as exc:
                        # ONLY a connection failure is reclassified. Everything else means
                        # what it says and must reach the caller untouched: HAAuthError (a
                        # rejected token), HACommandError (a hello that answered with a
                        # real error code), a CancelledError.
                        raise HAConnectionError(str(exc), sent=False) from exc
                    self._client = client
                    return client
        # A clean outcome is cached (one handshake per connection); ANY failure
        # outcome is re-derived here, on the healthy socket, so the connection
        # heals the moment the backend can answer — its config entry finishes
        # setting up, a reload completes, the user upgrades. Only calls that
        # were already failing pay the extra hello.
        negotiated = self._negotiated
        if negotiated is None or negotiated.message is not None:
            async with self._lock:
                client = self._client
                negotiated = self._negotiated
                if (
                    client is not None
                    and not client.closed
                    and (negotiated is None or negotiated.message is not None)
                ):
                    # Same sent=False reclassification as ESTABLISHMENT above, and
                    # for the same reason: this hello goes out on the socket, but
                    # the CALLER's command is still in `command_for`'s locals.
                    try:
                        await self._handshake(client)
                    except HAConnectionError as exc:
                        raise HAConnectionError(str(exc), sent=False) from exc
        return self._client

    async def _live_for(self, agreed: int | None) -> tuple[HAClient, int | None]:
        """A live client, verdict-checked, whose protocol is still the one
        `agreed` — the one the caller's adapter was built from.

        `self._negotiated` is read ONCE into a local: message and protocol
        travel together, so this method can never pair one outcome's message
        with another's protocol. Raises IncompatibleError BEFORE any command
        is sent (an incompatible pair must not touch the backend), then
        ProtocolChangedError if a reconnect re-agreed a different protocol
        than the caller's adapter assumes. `agreed=None` (a bare `command()`,
        or `ready()`) skips the protocol hold and adopts what the handshake
        agreed.
        """
        client = await self._live()
        negotiated = self._negotiated
        if negotiated is not None and negotiated.message is not None:
            raise IncompatibleError(negotiated.message)
        protocol = negotiated.protocol if negotiated is not None else None
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
        # `_live_for(None)` IS "verdict-checked live, then read the agreed protocol":
        # with no `agreed` to hold it to, it skips the ProtocolChangedError branch and
        # just hands back what the handshake resolved. Going through it here — instead
        # of re-deriving the same two steps and reading `self._negotiated` directly —
        # reuses the one IncompatibleError check `_live_for` already does, rather than
        # duplicating it.
        _, protocol = await self._live_for(None)
        if protocol is None:
            # A clean outcome (message=None) always carries a protocol — this would
            # mean _negotiate() returned a clean outcome without agreeing one, which is
            # a bug in _negotiate(), not a runtime condition callers can hit. Raise
            # rather than `assert`: assertions are stripped under `python -O`,
            # and a bare None here would surface downstream as an opaque
            # `KeyError: None` from `PROTOCOLS[await client.ready()]`.
            raise RuntimeError(
                "ReconnectingClient.ready(): no compatibility verdict was set for "
                "an agreed protocol — this is a bug in _negotiate()"
            )
        return protocol

    async def command_for(self, agreed: int | None, type: str, **payload: Any) -> dict[str, Any]:
        """Send a command on behalf of a caller that assumes protocol `agreed`.

        `agreed` comes from the CALLER — the protocol its adapter was built for (see
        `BaseProtocol.protocol`) — and never from `self._negotiated`, which is shared
        mutable state that any concurrent tool call can move under us. MCP clients
        dispatch tool calls as parallel tasks over this one client, so re-reading the
        current protocol here would compare the caller's assumption against nothing at
        all: two tool calls can both build a V1 adapter, the first can reconnect into a
        protocol-2 backend, and the second's V1 command would then find
        `_negotiated.protocol == 2` "agreed" and go out — the exact
        v1-adapter-hits-a-v2-backend mismatch the frozen adapters exist to prevent.

        `None` means "no adapter behind this call" (a bare `command()`): it adopts
        whatever protocol the handshake agrees, and only the retry inside this one call
        is then held to it.
        """
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

    async def command(self, type: str, **payload: Any) -> dict[str, Any]:
        """An unpinned command: it adopts the protocol this connection agrees.

        The tools do NOT come through here — they go through their adapter, which pins
        the protocol it was built for (`command_for`). This is for callers that have no
        protocol assumption to hold yet.
        """
        return await self.command_for(None, type, **payload)

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
    except BaseException:
        # BaseException, not Exception — `asyncio.CancelledError` is a BaseException, and
        # a tool call cancelled mid-auth is precisely when this socket would be abandoned
        # with nobody left holding a reference to close it. `_live()` guards its own
        # handshake the same way, but cannot help here: this failure happens INSIDE
        # `self._connect(...)`, before it has a client to close.
        with contextlib.suppress(Exception):
            await connection.close()  # don't leak the socket on a bad token / a cancel
        raise
    return client
