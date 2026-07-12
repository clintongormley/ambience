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


def test_mcp_protocol_not_an_integer_literal_is_an_error(tmp_path):
    const = tmp_path / "const.py"
    const.write_text('MCP_PROTOCOL = "1"\n')

    with pytest.raises(SystemExit):
        find_mcp_protocol(const)


def test_protocols_not_a_dict_literal_is_an_error(tmp_path):
    init = tmp_path / "__init__.py"
    init.write_text("PROTOCOLS = dict(one=1)\n")  # not an ast.Dict literal

    with pytest.raises(SystemExit):
        find_protocols(init)


def test_protocols_with_non_integer_key_is_an_error(tmp_path):
    init = tmp_path / "__init__.py"
    init.write_text('PROTOCOLS = {"v1": object}\n')

    with pytest.raises(SystemExit):
        find_protocols(init)


def test_missing_protocols_dict_is_an_error(tmp_path):
    init = tmp_path / "__init__.py"
    init.write_text("OTHER = 1\n")

    with pytest.raises(SystemExit):
        find_protocols(init)


def test_find_mcp_protocol_last_assignment_wins(tmp_path):
    # A stale first assignment must not be reported over the one actually in
    # effect at runtime.
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 1\nMCP_PROTOCOL = 2\n")

    assert find_mcp_protocol(const) == 2


def test_find_protocols_last_assignment_wins_when_growing(tmp_path):
    # Under-reporting fails loudly (safe direction) — locked in so a future
    # refactor can't flip this into the dangerous, over-reporting direction.
    init = tmp_path / "__init__.py"
    init.write_text(
        "PROTOCOLS: dict[int, type] = {1: object}\nPROTOCOLS = {1: object, 2: object}\n"
    )

    assert find_protocols(init) == {1, 2}


def test_find_protocols_last_assignment_wins_when_shrinking(tmp_path):
    # The dangerous direction: reporting the stale (first) assignment here would
    # over-report the supported set, so a real mismatch would silently PASS.
    init = tmp_path / "__init__.py"
    init.write_text(
        "PROTOCOLS: dict[int, type] = {1: object, 2: object}\nPROTOCOLS = {1: object}\n"
    )

    assert find_protocols(init) == {1}


def test_main_fails_on_a_protocol_mismatch(tmp_path, capsys):
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 2\n")
    registry = tmp_path / "registry.py"
    registry.write_text("PROTOCOLS: dict[int, type] = {1: object}\n")

    with pytest.raises(SystemExit) as exc_info:
        main(["--const", str(const), "--registry", str(registry)])

    assert exc_info.value.code == 1
    err = capsys.readouterr().err
    # The actionable message: names the declared protocol and the shipped adapters.
    assert "MCP_PROTOCOL=2" in err
    assert "only ships adapters for [1]" in err
    assert "protocols/v2.py" in err


def test_main_passes_on_a_matching_pair(tmp_path):
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 1\n")
    registry = tmp_path / "registry.py"
    registry.write_text("PROTOCOLS: dict[int, type] = {1: object}\n")

    assert main(["--const", str(const), "--registry", str(registry)]) == 0
