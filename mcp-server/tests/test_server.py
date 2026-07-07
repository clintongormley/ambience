import ambience_mcp.server as server


def test_exposes_a_fastmcp_instance_and_main():
    assert server.mcp is not None
    assert callable(server.main)


def test_all_tool_wrappers_exist():
    for name in [
        "ambience_get_context",
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
