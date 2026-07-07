import ambience_mcp.server as server


def test_exposes_a_fastmcp_instance_and_main():
    assert server.mcp is not None
    assert callable(server.main)


async def test_client_closes_the_dead_client_before_reconnecting(monkeypatch):
    closed: list[str] = []

    class _FakeClient:
        def __init__(self, name: str) -> None:
            self.name = name
            self._closed = False

        @property
        def closed(self) -> bool:
            return self._closed

        async def close(self) -> None:
            self._closed = True
            closed.append(self.name)

    made = iter([_FakeClient("a"), _FakeClient("b")])

    async def _fake_connect(ws_url: str, token: str) -> object:
        return next(made)

    monkeypatch.setattr(server, "_client", None)
    monkeypatch.setattr(server, "connect", _fake_connect)
    monkeypatch.setattr(
        server, "load_config", lambda: type("C", (), {"ws_url": "ws://x", "token": "t"})()
    )

    first = await server._client_()  # connects "a"
    first._closed = True  # a transport break marks it closed
    second = await server._client_()  # must close "a", then connect "b"

    assert second.name == "b"
    assert closed == ["a"]  # the dead client's socket/tasks were released


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
