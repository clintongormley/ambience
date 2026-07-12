import pytest
from conftest import FakeClient

from ambience_mcp.ha_client import HACommandError, IncompatibleError, ReconnectingClient


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

    with pytest.raises(IncompatibleError, match="(?i)ambience"):
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
    messages = []
    for hello in (
        {"protocol": 2},
        {"protocol": 1, "min_mcp_version": "9.9.9"},
        HACommandError("unknown_command", "nope"),
    ):
        client, _ = _reconnecting(hello, mcp_version="0.2.0rc3")
        with pytest.raises(IncompatibleError) as exc:
            await client.ready()
        messages.append(str(exc.value).lower())

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
