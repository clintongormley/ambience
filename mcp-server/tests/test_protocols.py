import pytest
from conftest import FakeClient

from ambience_mcp.ledger import PreviewLedger
from ambience_mcp.protocols import PROTOCOLS
from ambience_mcp.protocols.base import BaseProtocol
from ambience_mcp.protocols.v1 import ProtocolV1
from ambience_mcp.tools import GuideCache


def _v1(results=None):
    return ProtocolV1(FakeClient(results or {}), PreviewLedger(), GuideCache())


def test_protocol_1_is_registered():
    assert PROTOCOLS[1] is ProtocolV1


def test_every_registered_protocol_is_a_base_protocol():
    for protocol in PROTOCOLS.values():
        assert issubclass(protocol, BaseProtocol)


async def test_base_refuses_to_guess_a_protocol_specific_tool():
    # A new protocol adapter that forgets one of the three must fail loudly, not
    # silently inherit another protocol's behaviour.
    base = BaseProtocol(FakeClient(), PreviewLedger(), GuideCache())

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
