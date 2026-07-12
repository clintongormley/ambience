import ast
from pathlib import Path

import pytest
from conftest import FakeClient

from ambience_mcp.ledger import PreviewLedger
from ambience_mcp.protocols import PROTOCOLS
from ambience_mcp.protocols.base import BaseProtocol
from ambience_mcp.protocols.v1 import ProtocolV1
from ambience_mcp.tools import GuideCache

_PROTOCOLS_DIR = Path(__file__).resolve().parent.parent / "src" / "ambience_mcp" / "protocols"


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


def _client_command_bypasses(path: Path) -> list[int]:
    """Line numbers of every call shaped like `<something>.client.command(...)` in
    `path` — the exact bypass this guard exists to forbid.

    AST, not a grep/string search: `BaseProtocol.command`'s own docstring (a few
    lines above, in base.py) contains the literal prose `self.client.command(...)`
    to explain what NOT to do — a text-based check would trip on that documentation.
    Parsing means only an actual call expression counts, never a comment or string.
    """
    tree = ast.parse(path.read_text(), filename=str(path))
    lines = []
    for node in ast.walk(tree):
        func = getattr(node, "func", None)
        if (
            isinstance(node, ast.Call)
            and isinstance(func, ast.Attribute)
            and func.attr == "command"
            and isinstance(func.value, ast.Attribute)
            and func.value.attr == "client"
        ):
            lines.append(node.lineno)
    return lines


def test_no_protocol_method_bypasses_the_command_funnel():
    """`self.client` is reachable from every adapter, and nothing but convention
    stops a future `vN.py` method from calling `self.client.command(...)` directly
    — skipping `BaseProtocol.command`'s protocol pin entirely.
    `test_every_adapter_command_carries_the_protocol_it_was_built_for` (above) only
    exercises the methods that exist today; it says nothing about a method added
    tomorrow. This test makes the bypass structurally unreachable rather than
    merely currently-absent: it parses every module under `protocols/` and fails if
    ANY call site reaches `.client.command(...)` instead of the funnel.
    """
    offenders = {}
    for path in sorted(_PROTOCOLS_DIR.glob("*.py")):
        lines = _client_command_bypasses(path)
        if lines:
            offenders[path.name] = lines

    assert not offenders, (
        f"direct `.client.command(...)` call(s) found in protocols/, bypassing the "
        f"protocol pin: {offenders}.\n"
        "Why this fails: an adapter method that calls the client's command() "
        "directly (instead of `self.command(...)`) can send a vN-shaped command to "
        "a backend that has since reconnected at a DIFFERENT protocol — the "
        "client's own idea of the current protocol is shared mutable state that a "
        "concurrent tool call can change, while only the adapter itself knows which "
        "protocol it was built for.\n"
        "What to do: call `self.command(...)` instead — the BaseProtocol funnel — "
        "which carries the protocol this adapter was built for."
    )


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
