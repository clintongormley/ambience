import asyncio
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
    _Negotiated,
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


async def test_an_unknown_command_verdict_is_never_cached():
    """Critical 1. `ambience/mcp/hello` is registered when Ambience's config entry sets
    up; HA's websocket API and auth come up in EARLY BOOTSTRAP, long before any custom
    integration. So for a window after every HA restart — seconds, or much longer under a
    ConfigEntryNotReady backoff — an authenticated socket gets `unknown_command` from a
    perfectly CURRENT Ambience.

    Latching that verdict makes it permanent: the connection is healthy, so `_live()`
    never reconnects, so the handshake never re-runs, so every tool call for the life of
    the client tells a fully up-to-date user to update Ambience. It must be RE-DERIVED on
    the next call instead — on the same socket, with no reconnect."""
    fake = FakeClient(
        {
            "ambience/mcp/hello": HACommandError("unknown_command", "nope"),
            "ambience/ping": {"ok": True},
        }
    )
    sockets = 0

    async def connect(ws_url: str, token: str) -> Any:
        nonlocal sockets
        sockets += 1
        return fake

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
        await client.command("ambience/ping")
    with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
        await client.command("ambience/ping")

    # The second call re-sent the hello on the SAME connection — no cached verdict, and
    # no reconnect. (And the tool command was still never sent to the backend.)
    assert [c["type"] for c in fake.calls] == ["ambience/mcp/hello"] * 2
    assert sockets == 1


async def test_a_backend_that_finishes_setting_up_heals_the_next_call_with_no_reconnect():
    """Critical 1, the payoff. The README promises exactly this flow — "update it in
    HACS and restart Home Assistant… the handshake re-runs and the server heals itself" —
    and a user who OBEYS it lands inside HA's startup window, where a latched verdict
    would tell them to do the very thing they just did, forever.

    The heal must need no reconnect and no MCP-server restart: the same healthy socket,
    one more hello."""
    fake = FakeClient(
        {
            "ambience/mcp/hello": HACommandError("unknown_command", "not set up yet"),
            "ambience/ping": {"ok": True},
        }
    )
    sockets = 0

    async def connect(ws_url: str, token: str) -> Any:
        nonlocal sockets
        sockets += 1
        return fake

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    with pytest.raises(IncompatibleError):
        await client.command("ambience/ping")

    # Ambience's config entry finishes setting up and registers its ws commands.
    fake.results["ambience/mcp/hello"] = {"protocol": 1, "min_mcp_version": "0.2.0-rc.3"}

    assert await client.command("ambience/ping") == {"ok": True}
    assert await client.ready() == 1
    assert sockets == 1, "healed on the existing connection — no reconnect"
    # And once the verdict is CLEAN it is cached again: the heal costs one hello, not one
    # per call forever.
    assert [c["type"] for c in fake.calls] == [
        "ambience/mcp/hello",  # the refusal
        "ambience/mcp/hello",  # re-derived on the next call...
        "ambience/ping",  # ...and it healed
    ]


async def test_a_genuinely_old_backend_still_says_update_ambience_on_every_call():
    """The other side of Critical 1: not caching the verdict must not SOFTEN it. An
    Ambience that predates the handshake answers `unknown_command` forever, and its user
    must keep getting the one instruction that helps — on every call, before anything is
    sent."""
    client, fake = _reconnecting(HACommandError("unknown_command", "nope"))

    for _ in range(3):
        with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
            await client.command("ambience/ping")

    # Every call re-asked (and never sent the tool command to the backend).
    assert [c["type"] for c in fake.calls] == ["ambience/mcp/hello"] * 3


async def test_a_clean_verdict_is_still_cached_across_many_calls():
    """The happy path must NOT pay for the fix: a verdict Ambience actually sent can only
    change by restarting HA, which drops the socket — so it stays cached, one handshake
    per connection, however many tool calls ride on it."""
    client, fake = _reconnecting({"protocol": 1, "min_mcp_version": "0.2.0-rc.3"})

    for _ in range(5):
        assert await client.command("ambience/ping") == {"ok": True}

    hellos = [c for c in fake.calls if c["type"] == "ambience/mcp/hello"]
    assert len(hellos) == 1


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
    # ALL SIX incompatibility messages, not four. The "backend behind" one
    # (supported={2,3}, backend says 1) is the only message not built by a shared
    # helper — an inline f-string — so it is the only one that could be reworded
    # with no test noticing. That is exactly what this test exists to prevent.
    #
    # The last two are the PRE-RELEASE-backend wordings, which carry an extra clause
    # (`--prerelease=allow`). It is the one remedy that could plausibly be written as a
    # backwards step ("pin the rc"), and it must not be: `--prerelease=allow` WIDENS
    # what uv may resolve — it never names an earlier or a pinned build.
    cases = [
        ({"protocol": 2}, frozenset({1})),  # backend ahead → upgrade ambience-mcp
        ({"protocol": 1}, frozenset({2, 3})),  # backend behind → update Ambience
        ({"protocol": 1, "min_mcp_version": "9.9.9"}, frozenset({1})),  # below the floor
        (HACommandError("unknown_command", "nope"), frozenset({1})),  # pre-handshake
        # ...and the same two "upgrade ambience-mcp" verdicts against a PRE-RELEASE
        # backend, which is a different message.
        ({"protocol": 2, "ambience_version": "1.6.0-rc.1"}, frozenset({1})),
        (
            {"protocol": 1, "min_mcp_version": "9.9.9", "ambience_version": "1.6.0-rc.1"},
            frozenset({1}),
        ),
    ]
    messages = []
    for hello, supported in cases:
        client, _ = _reconnecting(hello, supported=supported, mcp_version="0.2.0rc3")
        with pytest.raises(IncompatibleError) as exc:
            await client.ready()
        messages.append(str(exc.value).lower())

    assert len(messages) == 6
    for message in messages:
        assert "older" not in message
        assert "downgrade" not in message
        assert "pin an older" not in message
    # And the new clause really is in the swept set — otherwise this test would go on
    # passing while saying nothing about it.
    assert sum("--prerelease=allow" in message for message in messages) == 2


# --- the release CHANNEL: a pre-release backend needs a pre-release ambience-mcp ------
# `uvx --from ambience-mcp` uses uv's default prerelease strategy, which SKIPS
# pre-releases whenever a final release exists. So the moment any final ambience-mcp is
# published, a beta tester running a pre-release Ambience on the documented (unpinned,
# plain-`uvx`) config who is told to "upgrade ambience-mcp" cleans the cache, restarts,
# resolves that same final build again — and loops forever. The remedy must name
# `--prerelease=allow`, or it is advice they cannot follow, which is the one thing this
# whole handshake exists to make unreachable.


@pytest.mark.parametrize(
    "hello",
    [
        # backend ahead of us → upgrade ambience-mcp
        {"protocol": 2, "ambience_version": "1.6.0-rc.1"},
        # below the backend's refusal floor → also upgrade ambience-mcp
        {"protocol": 1, "min_mcp_version": "9.9.9", "ambience_version": "1.6.0-rc.1"},
    ],
    ids=["protocol_ahead", "below_the_floor"],
)
async def test_a_prerelease_backend_tells_the_user_to_allow_prereleases(hello):
    """BOTH "upgrade ambience-mcp" verdicts, because both are reachable from a
    pre-release backend and either one alone would strand the tester."""
    client, _ = _reconnecting(hello, supported=frozenset({1}), mcp_version="0.2.0rc3")

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()

    message = str(exc.value)
    assert "--prerelease=allow" in message
    assert "1.6.0-rc.1" in message  # names the pre-release it is talking about
    assert "uv cache clean" in message  # ...and keeps the rest of the remedy


async def test_a_final_backend_is_never_told_to_allow_prereleases():
    """The other direction, and just as important: telling a STABLE user to allow
    pre-releases would quietly move them onto rc builds. The clause is opt-in to the
    channel the backend is actually on."""
    client, _ = _reconnecting(
        {"protocol": 2, "ambience_version": "1.6.0"}, supported=frozenset({1})
    )

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()

    assert "--prerelease" not in str(exc.value)
    assert "uv cache clean" in str(exc.value)  # the ordinary remedy is untouched


@pytest.mark.parametrize(
    "hello",
    [
        {"protocol": 2},  # absent
        {"protocol": 2, "ambience_version": None},  # null (ambience_version() may be None)
        {"protocol": 2, "ambience_version": "not-a-version"},  # unparseable
        {"protocol": 2, "ambience_version": 16},  # not even a string
    ],
    ids=["absent", "null", "unparseable", "not_a_string"],
)
async def test_an_unreadable_ambience_version_omits_the_clause_and_changes_no_verdict(hello):
    """`ambience_version` is a MESSAGE input, never a compatibility one. A backend whose
    version we cannot read (the backend's own `ambience_version()` can return None) must
    still get exactly the verdict the protocol and the floor dictate — we just cannot say
    which channel it is on, so we say nothing about channels. Never crash, never block,
    never soften."""
    client, _ = _reconnecting(hello, supported=frozenset({1}), mcp_version="0.2.0rc3")

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()

    message = str(exc.value)
    assert "--prerelease" not in message
    assert "uv cache clean" in message  # the verdict, and the rest of the remedy, stand


async def test_a_prerelease_backend_we_can_work_with_is_not_nagged_about_channels():
    """The clause rides on the "upgrade ambience-mcp" remedy, not on the pre-release-ness
    of the backend: a compatible pair says nothing at all, whatever channel it is on."""
    client, _ = _reconnecting({"protocol": 1, "ambience_version": "1.6.0-rc.1"})

    assert await client.ready() == 1


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
    """Important 1, the WITHIN-A-CALL case: `_live_for()` blocks INCOMPATIBLE
    protocols. A protocol that is SUPPORTED but DIFFERENT sails straight through it.

    Scenario (MCP supports {1, 2}; the user upgrades Ambience 1 → 2, which restarts
    HA): the command goes out on a stale-but-not-yet-known-dead client, fails on send
    (sent=False), and the retry reconnects and re-handshakes to protocol 2 — and,
    without this guard, re-sends the protocol-1 command to the V2 backend. That is the
    silent v1-adapter-reads-v2-payload mismatch the frozen adapters exist to prevent.

    The CONCURRENT case — two adapters in flight over the one shared client, which no
    re-read of `self._negotiated.protocol` can save — is the next test.

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
    built for CANNOT be recovered by re-reading the client's current
    `_negotiated.protocol`: a sibling call can move it between the handshake and the
    send.

      1. Tool calls A and B both handshake protocol 1 → both build a V1 adapter.
      2. A's command hits the stale socket, reconnects, re-handshakes → the backend now
         speaks protocol 2 → A is correctly dropped.
      3. B still holds its V1 adapter — and the client's `_negotiated.protocol` now
         says 2. If the "agreed" protocol were re-read from the client here, B's V1
         command would "agree" with the V2 backend and go out: exactly the
         v1-adapter-reads-a-v2-payload mismatch the frozen adapters exist to prevent.

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
    # ...and the shared state has moved under B's feet.
    assert client._negotiated.protocol == 2

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


async def test_a_hello_that_times_out_does_not_condemn_the_callers_write():
    """The subtlest of the three establishment failures: the hello inside `_negotiate`
    can itself raise `HAConnectionError(sent=True)` from its OWN recv path (a
    `_COMMAND_TIMEOUT` — a live-but-stalled HA). That flag is the truth about the HELLO.

    It then propagates `_negotiate` → `_handshake` → `_live()` → `_live_for()` →
    straight into `command_for`'s `except HAConnectionError`, which reads `exc.sent`
    against the CALLER's command type. One command's flag answering for another: the
    caller's `/save` would be refused as "may already have been applied" when the
    connection it would have travelled on never even finished handshaking — a write
    that never left the process, reported to the AI as though it may have landed.
    `apply_write` only spends its single-use confirm token AFTER its save succeeds, so
    this refusal would not burn it — but the user would still be wrongly told to treat
    an unsent write with the same caution as one HA might actually have received.

    `_live()` re-raises establishment failures as `sent=False`, so the write is retried
    on a fresh connection — and, because only the one frame is re-sent, it reaches the
    backend exactly once."""
    stalled = _HandshakeThenScriptedClient(HAConnectionError("hello timed out", sent=True))
    fresh = _HandshakeThenScriptedClient({"protocol": 1}, {"ok": True})
    connections = [stalled, fresh]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    assert await client.command_for(1, "ambience/area/save", scope={}) == {"ok": True}

    # The stalled connection saw only its own hello, and was closed rather than leaked.
    assert stalled.calls == ["ambience/mcp/hello"]
    assert stalled.closed is True
    # The write reached the backend EXACTLY ONCE, on the connection that handshook.
    assert fresh.calls == ["ambience/mcp/hello", "ambience/area/save"]


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
    client._negotiated = _Negotiated(None, None)  # the "should never happen" state

    with pytest.raises(RuntimeError, match="_negotiate"):
        await client.ready()


async def test_an_mcp_with_no_adapters_says_so_instead_of_dying_in_max():
    """`supported_protocols` is the one value this class does not derive itself — it is
    INJECTED. Empty, `max(self._supported)` raises a bare ValueError on every tool call,
    replacing the actionable "which side to upgrade" message the whole design exists to
    deliver with a traceback. Unreachable in a shipped build (Gate 1 refuses an empty
    PROTOCOLS), but this is the seam where an unvalidated injection lands."""
    client, _ = _reconnecting({"protocol": 1}, supported=frozenset())

    with pytest.raises(IncompatibleError) as exc:
        await client.ready()
    assert "no MCP protocol adapters" in str(exc.value)
    assert "uv cache clean" in str(exc.value)  # still the actionable upgrade remedy


async def test_an_unparseable_version_of_OURSELVES_fails_loudly_not_silently():
    """The two InvalidVersion cases have OPPOSITE right answers, so one shared
    `except InvalidVersion` cannot serve both:

    - a floor from the BACKEND we cannot parse == no floor stated → pass (conservative:
      the backend never meant to refuse a client we cannot read it as refusing). Locked in
      by `test_unparseable_min_mcp_version_states_no_floor_and_passes`.
    - a version of OURSELVES we cannot parse is a packaging bug in this build. Swallowing
      it silently disables the refusal floor — the backend's strongest safety valve — for
      precisely the malformed build most likely to need refusing.
    """
    client, _ = _reconnecting(
        {"protocol": 1, "min_mcp_version": "0.3.0"}, mcp_version="not-a-version"
    )

    with pytest.raises(RuntimeError, match="(?i)own version") as exc:
        await client.ready()
    assert not isinstance(exc.value, IncompatibleError)  # our bug, not the user's


async def test_our_own_version_is_only_parsed_when_a_floor_is_stated():
    """The corollary: a backend that states no floor asks nothing of our version, so it
    must not be the thing that breaks the connection."""
    client, _ = _reconnecting({"protocol": 1}, mcp_version="not-a-version")

    assert await client.ready() == 1


async def test_bool_protocol_is_not_treated_as_valid():
    """Minor 8: `bool` is an `int` subclass, and `True in frozenset({1})` is
    `True` — so `{"protocol": True}` must not silently "agree" protocol True.
    Without the `not isinstance(protocol, bool)` guard this would pass."""
    client, _ = _reconnecting({"protocol": True}, supported=frozenset({1}))

    with pytest.raises(IncompatibleError, match=r"Update Ambience \(HACS\)"):
        await client.ready()


class _StartupWindowClient:
    """An HAClient stand-in whose hello answers from a QUEUE, so one connection can
    reply `unknown_command` first and then stall — the real shape of an HA that is
    still starting up. An HAConnectionError from the hello marks the client closed,
    exactly as the real `HAClient.command`'s recv-failure path does."""

    def __init__(self, hellos: list[Any], *outcomes: Any) -> None:
        self._hellos = list(hellos)
        self._outcomes = list(outcomes)
        self.closed = False
        self.calls: list[str] = []

    async def command(self, type: str, **payload: Any) -> Any:
        self.calls.append(type)
        outcome = self._hellos.pop(0) if type == "ambience/mcp/hello" else self._outcomes.pop(0)
        if isinstance(outcome, Exception):
            if isinstance(outcome, HAConnectionError):
                self.closed = True
            raise outcome
        return outcome

    async def close(self) -> None:
        self.closed = True


async def test_a_stalled_re_derive_hello_does_not_condemn_the_callers_write():
    """The last place a hello's `sent` flag can answer for the caller's command.

    The `unknown_command` verdict is deliberately NOT cached, so while HA is starting
    each tool call re-sends the hello on the existing healthy socket. If THAT hello dies
    on its own recv path it raises `sent=True` — true of the hello, and meaningless about
    the caller's write, which is still sitting in `command_for`'s locals.

    This branch runs ONLY in the startup window, i.e. precisely when a not-yet-ready HA
    is likeliest to leave a hello unanswered — so it is the likeliest place of all to
    refuse a `/save` as "may already have been applied" when nothing was sent, burning
    the confirm token `apply_write` has already spent."""
    # One connection: Ambience is not up yet (unknown_command), and by the next tool
    # call HA is stalled hard enough that the re-derived hello times out.
    starting = _StartupWindowClient(
        [
            HACommandError("unknown_command", "nope"),
            HAConnectionError("hello timed out", sent=True),
        ]
    )
    ready = _StartupWindowClient([{"protocol": 1}], {"ok": True})  # Ambience finished setup
    connections = [starting, ready]

    async def connect(ws_url: str, token: str) -> Any:
        return connections.pop(0)

    client = ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="0.2.0rc3"
    )

    # Ambience is still setting up: the right, actionable answer — and not cached.
    with pytest.raises(IncompatibleError):
        await client.command_for(1, "ambience/area/save", scope={})

    # The re-derived hello stalls. The write never left, so it must be RETRIED on a
    # fresh connection — not condemned as "may already have been applied".
    assert await client.command_for(1, "ambience/area/save", scope={}) == {"ok": True}

    # The stalled connection saw only its two hellos — the write never went out on it.
    assert starting.calls == ["ambience/mcp/hello", "ambience/mcp/hello"]
    # And it reached the backend exactly once, on the connection that handshook.
    assert ready.calls == ["ambience/mcp/hello", "ambience/area/save"]


class _ScriptedHello:
    """An HAClient stand-in whose command() pops the next scripted outcome for
    ambience/mcp/hello and answers every other command with {}.

    Outcomes: a dict is returned; an HAConnectionError is raised AND marks the
    client closed (mirroring HAClient.command's recv path); any other
    BaseException (HACommandError, CancelledError) is raised WITHOUT closing —
    a cancelled wait_for / an error reply leaves the socket healthy; a
    ("wait", event, dict) tuple blocks on the event then returns the dict."""

    def __init__(self, hellos):
        self.hellos = list(hellos)
        self.closed = False
        self.hello_count = 0

    async def command(self, type, **payload):
        if type == "ambience/mcp/hello":
            self.hello_count += 1
            outcome = self.hellos.pop(0) if self.hellos else {"protocol": 1}
            if isinstance(outcome, tuple) and outcome[0] == "wait":
                await outcome[1].wait()
                return outcome[2]
            if isinstance(outcome, HAConnectionError):
                self.closed = True
                raise outcome
            if isinstance(outcome, BaseException):
                raise outcome
            return outcome
        return {}

    async def close(self) -> None:
        self.closed = True


def _scripted_reconnecting(clients):
    """A ReconnectingClient whose connect_fn pops the next scripted client."""
    queue = list(clients)

    async def connect(ws_url, token):
        return queue.pop(0)

    return ReconnectingClient(
        connect, _cfg, supported_protocols=frozenset({1}), mcp_version="1.0.0"
    )


async def test_a_cancelled_re_derive_does_not_wedge_the_connection():
    """A tool call cancelled mid re-derived hello must leave the previous
    verdict standing — not a half-cleared state that turns every later call
    into RuntimeError('…this is a bug in _negotiate()')."""
    client = _ScriptedHello(
        [
            HACommandError("unknown_command", "startup window"),
            asyncio.CancelledError(),
            {"protocol": 1},
        ]
    )
    rc = _scripted_reconnecting([client])
    with pytest.raises(IncompatibleError):
        await rc.ready()  # startup-window verdict, re-derived per call
    with pytest.raises(asyncio.CancelledError):
        await rc.ready()  # user aborts mid-hello — must not corrupt state
    assert await rc.ready() == 1  # backend now answers: the connection heals


async def test_an_erroring_re_derive_does_not_wedge_the_connection():
    """Same latch via HACommandError (e.g. 'unauthorized' once the admin-gated
    hello registers): the error surfaces once, the old verdict stands, and the
    connection heals when the hello answers."""
    client = _ScriptedHello(
        [
            HACommandError("unknown_command", "startup window"),
            HACommandError("unauthorized", "admin required"),
            {"protocol": 1},
        ]
    )
    rc = _scripted_reconnecting([client])
    with pytest.raises(IncompatibleError):
        await rc.ready()
    with pytest.raises(HACommandError):
        await rc.ready()
    assert await rc.ready() == 1


async def test_a_concurrent_call_during_a_re_derive_never_sees_a_half_set_state():
    """While one call's re-derived hello is in flight, a parallel call must
    resolve to a complete state (old verdict or new protocol) — never
    RuntimeError('bug in _negotiate') or a ProtocolChangedError naming
    protocol None."""
    release = asyncio.Event()
    client = _ScriptedHello(
        [
            HACommandError("unknown_command", "startup window"),
            ("wait", release, {"protocol": 1}),
        ]
    )
    rc = _scripted_reconnecting([client])
    with pytest.raises(IncompatibleError):
        await rc.ready()
    task1 = asyncio.create_task(rc.ready())
    await asyncio.sleep(0)  # task1 enters the re-derive and blocks on the hello
    task2 = asyncio.create_task(rc.ready())
    await asyncio.sleep(0)
    release.set()
    assert await task1 == 1
    assert await task2 == 1
    # Exactly 2 hellos: the initial failing verdict, then ONE shared re-derive.
    # Pins the double-checked-lock re-read in `_live` — without it, task2 would
    # find the pre-lock verdict still failing and fire its own redundant hello
    # (3 total) instead of seeing task1's fresh clean outcome once it gets the lock.
    assert client.hello_count == 2


async def test_an_incompatible_verdict_heals_after_the_prescribed_upgrade():
    """'Update Ambience (HACS) and restart Home Assistant' must actually work:
    after the restart kills the socket, the next calls reconnect and
    re-handshake instead of serving the stale verdict forever."""
    old = _ScriptedHello([{"protocol": 99}, HAConnectionError("socket died")])
    new = _ScriptedHello([{"protocol": 1}])
    rc = _scripted_reconnecting([old, new])
    with pytest.raises(IncompatibleError):
        await rc.ready()  # protocol 99: incompatible
    with pytest.raises(HAConnectionError):
        await rc.ready()  # re-derive discovers the dead socket (HA restarted)
    assert await rc.ready() == 1  # reconnects to the upgraded backend
