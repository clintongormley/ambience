import json

import ambience_mcp.server as server
from ambience_mcp import budget
from ambience_mcp.ha_client import ReconnectingClient
from ambience_mcp.protocols import PROTOCOLS


def _wire(result):
    """The dict a bounded tool actually puts on the wire. Structured output is
    disabled (see _BoundedFastMCP.add_tool), so FastMCP returns a plain content
    sequence — one text block whose text is the indent=2 JSON of the tool's dict
    result — not a (content, structuredContent) tuple. Parse it back so a test can
    assert on the fields the client receives."""
    assert isinstance(result, list), f"expected a content sequence, got {type(result)}"
    assert len(result) == 1 and result[0].type == "text"
    return json.loads(result[0].text)


def _serving(**tools):
    """Make the server's tools run against a stub adapter instead of a live HA.

    Every tool body now goes through `server._protocol_()`, which handshakes with
    the backend to pick an adapter — so a server-level test has to stand in at that
    seam, not at a module function."""
    stub = type("StubProtocol", (), tools)()

    async def _protocol_():
        return stub

    return _protocol_


def test_exposes_a_fastmcp_instance_and_main():
    assert server.mcp is not None
    assert callable(server.main)


def test_reuses_one_reconnecting_client_across_tool_calls(monkeypatch):
    """Reconnect + resend live in ReconnectingClient (see test_ha_client), so the
    server just holds one of them. Tools never reason about retry-safety."""
    monkeypatch.setattr(server, "_client", None)
    first = server._client_()
    assert isinstance(first, ReconnectingClient)
    assert server._client_() is first


def test_the_handshake_offers_every_protocol_this_package_ships(monkeypatch):
    """The set we tell the backend we speak IS the adapter registry — never a
    hand-maintained literal. Adding a `vN.py` (and registering it) must be all it
    takes for the handshake to accept a backend speaking N; a second list to
    remember would silently refuse it."""
    monkeypatch.setattr(server, "_client", None)
    assert server._client_()._supported == frozenset(PROTOCOLS)


async def test_the_backends_protocol_chooses_the_adapter(monkeypatch):
    """The payoff: the adapter is picked from what `ready()` negotiated, so one
    installed ambience-mcp can serve HA installs on different Ambience versions."""

    class _Ready:
        async def ready(self):
            return 1

    client = _Ready()
    monkeypatch.setattr(server, "_client_", lambda: client)

    protocol = await server._protocol_()

    assert isinstance(protocol, PROTOCOLS[1])
    assert protocol.client is client
    assert protocol.ledger is server._ledger
    assert protocol.guide_cache is server._guide_cache
    # The adapter is told WHICH protocol it was looked up under, and carries it into
    # every command it sends — the client cannot re-derive it from shared state that a
    # concurrent tool call may have moved. See ReconnectingClient.command_for.
    assert protocol.protocol == 1


def test_all_tool_wrappers_exist():
    for name in [
        "ambience_get_context",
        "ambience_find_entities",
        "ambience_get_scope",
        "ambience_get_guide",
        "ambience_dry_run",
        "ambience_validate",
        "ambience_preview_write",
        "ambience_apply_write",
        "ambience_list_traces",
        "ambience_list_categories",
        "ambience_save_categories",
    ]:
        assert hasattr(server, name), f"missing tool wrapper {name}"


def test_tool_get_guide_accepts_part():
    # The pagination arg has to reach the tool schema, not just the handler, or a
    # model can never ask for part 2 of an over-budget section.
    import inspect

    assert "part" in inspect.signature(server.ambience_get_guide).parameters


# The result-budget boundary: budget.fit_result must run on EVERY tool's return
# value, not just the 3 (get_context/find_entities/list_traces) that carry a
# shape-aware fit_* strategy of their own in the protocol adapter
# (protocols/v1.py). These prove it is wired in structurally (via
# _BoundedFastMCP.add_tool), not per-tool.


async def test_bounded_add_tool_disables_structured_output():
    """Every tool is registered with structured output OFF, so FastMCP emits a
    result once (the indent=2 text content block) instead of twice (a second,
    byte-identical structuredContent copy). That halves the wire size size_of
    measures — see _BoundedFastMCP.add_tool and budget.size_of.

    Registered via @tool() (the real path a production tool takes), NOT
    add_tool() directly: @tool() ALWAYS forwards structured_output explicitly as
    None ("auto-detect from the return annotation"), so the guard has to override
    that None — a bare `setdefault` on a missing key would leave the second copy
    on. FastMCP returns a plain content sequence when structured output is off and
    a (content, structuredContent) tuple when it is on, so the tuple's absence is
    the proof the second copy is gone."""
    probe = server._BoundedFastMCP("probe")

    @probe.tool()
    async def demo() -> dict[str, object]:
        return {"a": 1, "b": "x" * 20}

    result = await probe.call_tool("demo", {})

    assert not isinstance(result, tuple)  # no structuredContent second channel
    assert isinstance(result, list) and len(result) == 1 and result[0].type == "text"


async def test_a_newly_registered_tool_is_bounded_with_no_fit_call_of_its_own(monkeypatch):
    """A brand-new tool that never calls any fit_* helper — exactly the shape of
    the 8 tools that had no guard before this fix — still cannot ship an
    unbounded result, because registration itself (add_tool, which @tool()
    calls under the hood) applies the guard. Nothing about this tool opts in.

    fit_result no longer trims: an oversized result comes back as the small,
    bounded error object, never a mangled truncation of the tool's own list
    fields (see budget.fit_result's docstring for why a generic trim is
    unsafe)."""
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "1000")
    probe = server._BoundedFastMCP("probe")

    @probe.tool()
    async def oversized_tool() -> dict[str, object]:
        return {"items": [{"x": "y" * 100} for _ in range(50)]}

    structured = _wire(await probe.call_tool("oversized_tool", {}))

    assert budget.size_of(structured) <= 1000
    assert structured["error"] == "result_too_large"
    assert "items" not in structured


async def test_list_categories_is_bounded_despite_having_no_fit_strategy(monkeypatch):
    """ambience_list_categories is one of the originally-unguarded 8: the adapter's
    list_categories just forwards the backend's reply verbatim. Proves the real
    production `mcp` server (not a throwaway probe) closes that exact gap."""
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "1500")

    async def oversized_categories(self):
        return {"categories": [{"id": f"c{i}", "name": "x" * 50} for i in range(30)]}

    monkeypatch.setattr(server, "_protocol_", _serving(list_categories=oversized_categories))

    structured = _wire(await server.mcp.call_tool("ambience_list_categories", {}))

    assert budget.size_of(structured) <= 1500
    assert structured["error"] == "result_too_large"
    assert "categories" not in structured


async def test_a_sync_tool_is_bounded_too(monkeypatch):
    """_bounded must not assume every tool is async — FastMCP supports sync
    tools, and awaiting a sync function's return value directly would raise at
    call time. Proves the sync branch actually applies fit_result."""
    monkeypatch.setenv("AMBIENCE_MCP_MAX_RESULT_CHARS", "1000")
    probe = server._BoundedFastMCP("probe")

    @probe.tool()
    def oversized_sync_tool() -> dict[str, object]:
        return {"items": [{"x": "y" * 100} for _ in range(50)]}

    structured = _wire(await probe.call_tool("oversized_sync_tool", {}))

    assert budget.size_of(structured) <= 1000
    assert structured["error"] == "result_too_large"


async def test_an_already_bounded_tool_result_passes_through_unchanged(monkeypatch):
    """fit_result early-returns once a result already fits, so the boundary
    guard is a genuine no-op — not a second trim pass — for the 3 tools whose
    protocol adapter (protocols/v1.py) already fitted the result."""

    async def small_categories(self):
        return {"categories": [{"id": "lighting"}]}

    monkeypatch.setattr(server, "_protocol_", _serving(list_categories=small_categories))

    structured = _wire(await server.mcp.call_tool("ambience_list_categories", {}))

    assert structured == {"categories": [{"id": "lighting"}]}
    assert "omitted" not in structured
