from typing import Any

import pytest
from conftest import FakeClient

from ambience_mcp import server
from ambience_mcp.ha_client import (
    HACommandError,
    HAConnectionError,
    IncompatibleError,
    ProtocolChangedError,
    ReconnectingClient,
)
from ambience_mcp.protocols.v1 import ProtocolV1


def _reconnecting(hello, *, supported=frozenset({1}), mcp_version="0.2.0rc3"):
    """A ReconnectingClient whose connect() yields a FakeClient scripted with `hello`."""
    fake = FakeClient({"ambience/mcp/hello": hello, "ambience/ping": {"ok": True}})

    async def connect(ws_url, token):
        return fake

    client = ReconnectingClient(
        connect,
        lambda: type("Cfg", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=supported,
        mcp_version=mcp_version,
    )
    return client, fake


async def test_compatible_backend_agrees_a_protocol():
    client, _ = _reconnecting({"protocol": 1, "min_mcp_version": "0.2.0-rc.3"})

    assert await client.ready() == 1


async def test_backend_ahead_says_upgrade_the_mcp_server():
    client, _ = _reconnecting({"protocol": 2, "min_mcp_version": "0.2.0-rc.3"})

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()
    assert "ambience-mcp" in str(exc.value)
    assert "uv cache clean" in str(exc.value)


async def test_backend_behind_says_upgrade_ambience():
    client, _ = _reconnecting({"protocol": 1}, supported=frozenset({2, 3}))

    # match="(?i)ambience" would also match the upgrade-ambience-mcp messages
    # (they say "ambience-mcp" too) — proving only that *some* IncompatibleError
    # was raised, not that it named the right side. Pin the actual text.
    with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
        await client.ready()


async def test_pre_protocol_backend_says_upgrade_ambience():
    client, _ = _reconnecting(HACommandError("unknown_command", "nope"))

    with pytest.raises(IncompatibleError, match="(?i)update Ambience"):
        await client.ready()


async def test_a_client_below_the_backend_floor_is_refused():
    client, _ = _reconnecting(
        {"protocol": 1, "min_mcp_version": "0.2.0-rc.3"}, mcp_version="0.2.0rc2"
    )

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()
    assert "ambience-mcp" in str(exc.value)
    assert "uv cache clean" in str(exc.value)


async def test_pep440_ordering_not_string_ordering():
    # "0.2.0rc10" < "0.2.0rc9" under a naive string compare. It must not be.
    client, _ = _reconnecting(
        {"protocol": 1, "min_mcp_version": "0.2.0rc9"}, mcp_version="0.2.0rc10"
    )

    assert await client.ready() == 1


async def test_absent_min_mcp_version_states_no_floor_and_passes():
    client, _ = _reconnecting({"protocol": 1})

    assert await client.ready() == 1


async def test_unparseable_min_mcp_version_states_no_floor_and_passes():
    client, _ = _reconnecting({"protocol": 1, "min_mcp_version": "not-a-version"})

    assert await client.ready() == 1


async def test_absent_protocol_blocks():
    client, _ = _reconnecting({"ambience_version": "1.1.0"})

    with pytest.raises(IncompatibleError, match="(?i)update Ambience"):
        await client.ready()


async def test_one_handshake_per_connection_not_per_call():
    client, fake = _reconnecting({"protocol": 1})

    await client.ready()
    await client.command("ambience/ping")
    await client.command("ambience/ping")

    hellos = [c for c in fake.calls if c["type"] == "ambience/mcp/hello"]
    assert len(hellos) == 1


async def test_every_command_raises_while_incompatible():
    client, _ = _reconnecting({"protocol": 2})

    with pytest.raises(IncompatibleError):
        await client.command("ambience/ping")


async def test_no_message_ever_asks_for_a_downgrade():
    # The invariant: `uvx ambience-mcp` installs LATEST, so a user cannot follow
    # advice to install an older one. Every remedy must point forward.
    #
    # ALL FOUR incompatibility messages, not three. The "backend behind" one
    # (supported={2,3}, backend says 1) is the only message not built by a shared
    # helper — an inline f-string — so it is the only one that could be reworded
    # with no test noticing. That is exactly what this test exists to prevent.
    cases = [
        ({"protocol": 2}, frozenset({1})),  # backend ahead → upgrade ambience-mcp
        ({"protocol": 1}, frozenset({2, 3})),  # backend behind → update Ambience
        ({"protocol": 1, "min_mcp_version": "9.9.9"}, frozenset({1})),  # below the floor
        (HACommandError("unknown_command", "nope"), frozenset({1})),  # pre-handshake
    ]
    messages = []
    for hello, supported in cases:
        client, _ = _reconnecting(hello, supported=supported, mcp_version="0.2.0rc3")
        with pytest.raises(IncompatibleError) as exc:
            await client.ready()
        messages.append(str(exc.value).lower())

    assert len(messages) == 4
    for message in messages:
        assert "older" not in message
        assert "downgrade" not in message
        assert "pin an older" not in message


async def test_re_handshakes_after_a_reconnect():
    """Upgrading Ambience restarts HA, which drops the socket. The next call must
    re-handshake — a stale verdict cannot be allowed to survive the very upgrade
    that would change it."""
    hellos = [{"protocol": 2}, {"protocol": 1}]  # before the fix, then after
    connections: list[FakeClient] = []

    async def connect(ws_url, token):
        fake = FakeClient({"ambience/mcp/hello": hellos.pop(0), "ambience/ping": {"ok": True}})
        connections.append(fake)
        return fake

    client = ReconnectingClient(
        connect,
        lambda: type("Cfg", (), {"ws_url": "ws://x", "token": "t"})(),
        supported_protocols=frozenset({1}),
        mcp_version="0.2.0rc3",
    )

    # Backend on an unsupported protocol → refused.
    with pytest.raises(IncompatibleError):
        await client.ready()

    # HA restarts (socket drops) and the user has upgraded Ambience meanwhile.
    connections[0].closed = True

    # Self-healing: no MCP-server restart needed.
    assert await client.ready() == 1
    assert len(connections) == 2


async def test_two_servers_against_different_backends_are_independent():
    """The README promises multi-instance 'even on different Ambience versions'.
    Each MCP entry is its own process with its own client, so each negotiates
    separately."""
    home, _ = _reconnecting({"protocol": 1}, supported=frozenset({1, 2}))
    test_box, _ = _reconnecting({"protocol": 2}, supported=frozenset({1, 2}))

    assert await home.ready() == 1
    assert await test_box.ready() == 2


class _HandshakeThenScriptedClient:
    """An HAClient stand-in whose hello is scripted once, then replays scripted
    outcomes for subsequent commands — for testing the interaction between the
    reconnect-retry path and a re-handshake on the new connection."""

    def __init__(self, hello: Any, *outcomes: Any) -> None:
        self._hello = hello
        self._outcomes = list(outcomes)
        self.closed = False
        self.calls: list[str] = []

    async def command(self, type: str, **payload: Any) -> Any:
        self.calls.append(type)
        if type == "ambience/mcp/hello":
            if isinstance(self._hello, Exception):
                raise self._hello
            return self._hello
        outcome = self._outcomes.pop(0)
        if isinstance(outcome, Exception):
            if isinstance(outcome, HAConnectionError):
                self.closed = True
            raise outcome
        return outcome

    async def close(self) -> None:
        self.closed = True


def _cfg() -> Any:
    return type("Cfg", (), {"ws_url": "ws://x", "token": "t"})()


async def test_retry_after_reconnect_checks_the_new_verdict_before_sending():
    """Critical 1: `command()`'s reconnect-retry must not send to a backend the
    *retry's own* `_live()` call just declared incompatible.

    Scenario: a compatible link is established, then the socket goes stale (an
    HA restart after an Ambience upgrade). The next command fails on send
    (sent=False) and triggers the retry. The retry's `_live()` reconnects and
    re-handshakes — and discovers the new backend speaks an unsupported
    protocol. The retry must raise IncompatibleError instead of sending the
    tool command to the backend it just declared incompatible."""
    stale = _HandshakeThenScriptedClient(
        {"protocol": 1}, HAConnectionError("stale socket", sent=False)
    )
    incompatible = _HandshakeThenScriptedClient({"protocol": 2}, {"ok": True})
    connections = [stale, incompatible]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    assert await client.ready() == 1  # first connection: compatible

    with pytest.raises(IncompatibleError):
        await client.command("ambience/ping")

    # The new client saw ONLY the hello — the tool command must never be sent.
    assert incompatible.calls == ["ambience/mcp/hello"]


async def test_a_supported_but_different_protocol_after_a_reconnect_is_not_sent_to():
    """Important 1, the WITHIN-A-CALL case: `_checked_live()` blocks INCOMPATIBLE
    protocols. A protocol that is SUPPORTED but DIFFERENT sails straight through it.

    Scenario (MCP supports {1, 2}; the user upgrades Ambience 1 → 2, which restarts
    HA): the command goes out on a stale-but-not-yet-known-dead client, fails on send
    (sent=False), and the retry reconnects and re-handshakes to protocol 2 — and,
    without this guard, re-sends the protocol-1 command to the V2 backend. That is the
    silent v1-adapter-reads-v2-payload mismatch the frozen adapters exist to prevent.

    The CONCURRENT case — two adapters in flight over the one shared client, which no
    re-read of `self._protocol` can save — is the next test.

    Unreachable while PROTOCOLS == {1} (any other protocol is refused as
    incompatible). Live the moment a `v2.py` ships.
    """
    stale = _HandshakeThenScriptedClient(
        {"protocol": 1}, HAConnectionError("stale socket", sent=False)
    )
    upgraded = _HandshakeThenScriptedClient({"protocol": 2}, {"ok": True})
    connections = [stale, upgraded]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1, 2}), mcp_version="0.2.0rc3"
    )

    assert await client.ready() == 1  # the V1 adapter is built from this

    with pytest.raises(ProtocolChangedError, match="protocol 2"):
        await client.command_for(1, "ambience/ai_context")

    # The V1 command never reached the V2 backend — only the handshake did.
    assert upgraded.calls == ["ambience/mcp/hello"]
    # And the loss is one call, not the session: the model retries, and the next
    # `_protocol_()` derives the V2 adapter from the freshly agreed protocol.
    assert await client.ready() == 2


async def test_a_second_adapter_in_flight_is_never_sent_to_the_new_protocol(monkeypatch):
    """Important 1, the CONCURRENT case — the one a single call chain cannot show.

    MCP clients dispatch tool calls as parallel tasks, and every one of them shares the
    single `ReconnectingClient`. Nothing serialises them, so the protocol an adapter was
    built for CANNOT be recovered by re-reading the client's current `_protocol`: a
    sibling call can move it between the handshake and the send.

      1. Tool calls A and B both handshake protocol 1 → both build a V1 adapter.
      2. A's command hits the stale socket, reconnects, re-handshakes → the backend now
         speaks protocol 2 → A is correctly dropped.
      3. B still holds its V1 adapter — and the client's `_protocol` now says 2. If the
         "agreed" protocol were re-read from the client here, B's V1 command would
         "agree" with the V2 backend and go out: exactly the v1-adapter-reads-a-v2-
         payload mismatch the frozen adapters exist to prevent.

    So the assumption travels WITH the adapter (`BaseProtocol.protocol` →
    `ReconnectingClient.command_for`), and B raises instead of sending.

    Driven through the real `server._protocol_()` — the construction under test is
    precisely "what does a tool call hold while another one reconnects".
    """
    stale = _HandshakeThenScriptedClient(
        {"protocol": 1}, HAConnectionError("stale socket", sent=False)
    )
    upgraded = _HandshakeThenScriptedClient({"protocol": 2}, {"ok": True}, {"ok": True})
    connections = [stale, upgraded]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1, 2}), mcp_version="0.2.0rc3"
    )
    monkeypatch.setattr(server, "_client_", lambda: client)

    # Two tool calls, in flight together, over the one client.
    call_a = await server._protocol_()
    call_b = await server._protocol_()
    assert isinstance(call_a, ProtocolV1) and isinstance(call_b, ProtocolV1)
    assert call_a.protocol == 1 and call_b.protocol == 1

    # A reconnects into the protocol-2 backend and is dropped...
    with pytest.raises(ProtocolChangedError, match="protocol 2"):
        await call_a.get_context()
    assert client._protocol == 2  # ...and the shared state has moved under B's feet.

    # B's V1 adapter must NOT send to that backend.
    with pytest.raises(ProtocolChangedError, match="protocol 2"):
        await call_b.get_context()

    # Neither V1 command reached the V2 backend: it has seen only the handshake.
    assert upgraded.calls == ["ambience/mcp/hello"]
    # The loss is those calls, not the session — the next tool call derives its adapter
    # from the freshly agreed protocol.
    assert await client.ready() == 2


@pytest.mark.parametrize("pinned", [False, True])
async def test_a_write_that_may_have_landed_is_still_never_re_sent(pinned):
    """The protocol-change guard sits on the SAME retry path as the write-safety
    rule, so lock that rule in here: a `/save` that reached HA (sent=True) and lost
    only its reply must still raise rather than reconnect and re-apply.

    Both entry points, because both are real: `command()` (unpinned) and the
    `command_for()` an adapter uses for every tool call.
    """
    flaky = _HandshakeThenScriptedClient(
        {"protocol": 1}, HAConnectionError("reply lost", sent=True)
    )
    connections = [flaky, _HandshakeThenScriptedClient({"protocol": 1}, {"ok": True})]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    save = (
        client.command_for(1, "ambience/area/save", scope={})
        if pinned
        else client.command("ambience/area/save", scope={})
    )
    with pytest.raises(HAConnectionError):
        await save

    # It never reconnected — the second client was never taken from the list.
    assert len(connections) == 1


async def test_a_reconnect_to_the_same_protocol_still_retries():
    """The guard must not break the ordinary HA-restart case it shares a path with:
    same protocol on the far side => the command is re-sent, as before."""
    stale = _HandshakeThenScriptedClient(
        {"protocol": 1}, HAConnectionError("stale socket", sent=False)
    )
    fresh = _HandshakeThenScriptedClient({"protocol": 1}, {"ok": True})
    connections = [stale, fresh]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    assert await client.ready() == 1
    assert await client.command("ambience/ping") == {"ok": True}
    assert fresh.calls == ["ambience/mcp/hello", "ambience/ping"]


async def test_a_failed_handshake_closes_the_client_instead_of_leaking_it():
    """Important 2: a hello that itself raises (e.g. `unauthorized` for a
    non-admin token) must not abandon the freshly-connected client. It was never
    published to `self._client`, so nothing else will ever close it — leaving it
    open leaks a socket (+ reader/keepalive tasks) on every single tool call,
    forever."""
    fakes = [
        FakeClient({"ambience/mcp/hello": HACommandError("unauthorized", "no admin")})
        for _ in range(2)
    ]
    connections = iter(fakes)

    async def connect(ws_url: str, token: str) -> Any:
        return next(connections)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    with pytest.raises(HACommandError, match="unauthorized"):
        await client.ready()
    with pytest.raises(HACommandError, match="unauthorized"):
        await client.ready()

    # Every failed handshake attempt closed its own client — none leaked.
    assert all(fake.closed for fake in fakes)


async def test_ready_raises_instead_of_asserting_when_protocol_is_unset():
    """Minor 4: `assert` is stripped under `python -O`, where `ready()` would
    silently return `None` and Task 6's `PROTOCOLS[await client.ready()]` would
    raise an opaque `KeyError: None`. Simulate the "clean verdict but no agreed
    protocol" state directly (unreachable through `_negotiate` as written) to
    prove the guard is a real `raise`, not an assertion."""
    client, _ = _reconnecting({"protocol": 1})
    await client.ready()
    client._protocol = None  # the "should never happen" state the guard covers

    with pytest.raises(RuntimeError, match="_negotiate"):
        await client.ready()


async def test_bool_protocol_is_not_treated_as_valid():
    """Minor 8: `bool` is an `int` subclass, and `True in frozenset({1})` is
    `True` — so `{"protocol": True}` must not silently "agree" protocol True.
    Without the `not isinstance(protocol, bool)` guard this would pass."""
    client, _ = _reconnecting({"protocol": True}, supported=frozenset({1}))

    with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
        await client.ready()
