import ambience_mcp.server as server
from ambience_mcp.ha_client import ReconnectingClient


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
