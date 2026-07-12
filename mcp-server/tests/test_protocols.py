import pytest
from conftest import FakeClient

from ambience_mcp.ledger import PreviewLedger
from ambience_mcp.protocols import PROTOCOLS
from ambience_mcp.protocols.base import BaseProtocol
from ambience_mcp.protocols.v1 import ProtocolV1
from ambience_mcp.tools import GuideCache


def _v1(results=None):
    return ProtocolV1(FakeClient(results or {}), PreviewLedger(), GuideCache(), protocol=1)


def test_protocol_1_is_registered():
    assert PROTOCOLS[1] is ProtocolV1


def test_every_registered_protocol_is_a_base_protocol():
    for protocol in PROTOCOLS.values():
        assert issubclass(protocol, BaseProtocol)


async def test_every_adapter_command_carries_the_protocol_it_was_built_for():
    """The adapter — not the client's current, shared, mutable `_protocol` — is what
    holds the vN assumption, so EVERY command it sends must state it. A tool that
    reached for `self.client.command(...)` directly would bypass the protocol-change
    guard and could put a v1-shaped command on a v2 backend.

    `protocol=7` (a protocol that does not exist) so this cannot pass by coincidence
    with the one protocol that does.
    """
    client = FakeClient(
        {
            "ambience/house/get": {"scenes": []},
            "ambience/categories/list": {"categories": []},
            "ambience/ai_context": {"catalog": {"entity_summary": {}}},
        }
    )
    adapter = ProtocolV1(client, PreviewLedger(), GuideCache(), protocol=7)

    await adapter.get_scope({"kind": "house"})
    await adapter.list_categories()
    await adapter.get_context()

    assert client.agreed == [7, 7, 7]
    # ...and every command still went through the client — the pin is out-of-band,
    # not a payload key smuggled onto the wire.
    assert client.calls == [
        {"type": "ambience/house/get"},
        {"type": "ambience/categories/list"},
        {"type": "ambience/ai_context"},
    ]


async def test_base_refuses_to_guess_a_protocol_specific_tool():
    # A new protocol adapter that forgets one of the three must fail loudly, not
    # silently inherit another protocol's behaviour.
    base = BaseProtocol(FakeClient(), PreviewLedger(), GuideCache(), protocol=1)

    for call in (base.get_context(), base.find_entities(), base.list_traces()):
        with pytest.raises(NotImplementedError):
            await call


async def test_v1_get_context_reads_ai_context():
    protocol = _v1({"ambience/ai_context": {"catalog": {"entity_summary": {}}}})

    await protocol.get_context()

    assert protocol.client.calls == [{"type": "ambience/ai_context"}]


async def test_v1_find_entities_forwards_only_set_filters():
    protocol = _v1({"ambience/entities/find": {"entities": []}})

    await protocol.find_entities(domain="light", cursor=0)

    assert protocol.client.calls == [
        {"type": "ambience/entities/find", "domain": "light", "cursor": 0}
    ]


async def test_v1_list_traces_always_asks_for_redaction():
    protocol = _v1({"ambience/traces/list": {"traces": []}})

    await protocol.list_traces()

    assert protocol.client.calls == [{"type": "ambience/traces/list", "redact": True}]


async def test_v1_get_scope_ranks_scenes():
    protocol = _v1({"ambience/area/get": {"scenes": [{"name": "X", "category": "c"}]}})

    result = await protocol.get_scope({"kind": "area", "id": "living_room"})

    assert result["scenes"][0]["rank"] == 1


async def test_get_guide_no_longer_echoes_the_bundle_version():
    # It described a payload the MCP never fetches: get_context reads ai_context.
    protocol = _v1(
        {"ambience/ai_guide": {"guide": "# Title\n\n# A\n\nbody", "ambience_version": "1"}}
    )

    result = await protocol.get_guide()

    assert "ambience_ai_bundle" not in result
