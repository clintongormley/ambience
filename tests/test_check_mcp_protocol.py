"""Gate 1: the integration may never declare a protocol the shipped MCP package has
no adapter for. Bumping MCP_PROTOCOL without writing protocols/vN.py would tell every
user to "upgrade ambience-mcp" to a version that cannot help them."""

from __future__ import annotations

import pytest

from bin.check_mcp_protocol import find_mcp_protocol, find_protocols, main


def test_the_real_repo_passes():
    # The gate itself, against the live files. This is the assertion that bites.
    assert main() == 0


def test_reads_the_backend_protocol(tmp_path):
    const = tmp_path / "const.py"
    const.write_text('AI_BUNDLE_VERSION = 1\nMCP_PROTOCOL = 3\nOTHER = "x"\n')

    assert find_mcp_protocol(const) == 3


def test_reads_the_adapter_registry(tmp_path):
    init = tmp_path / "__init__.py"
    init.write_text(
        "from .v1 import ProtocolV1\n"
        "from .v2 import ProtocolV2\n"
        "PROTOCOLS: dict[int, type] = {1: ProtocolV1, 2: ProtocolV2}\n"
    )

    assert find_protocols(init) == {1, 2}


def test_missing_backend_constant_is_an_error(tmp_path):
    const = tmp_path / "const.py"
    const.write_text("AI_BUNDLE_VERSION = 1\n")

    with pytest.raises(SystemExit):
        find_mcp_protocol(const)
