"""Gate 1: what the backend DEMANDS of an MCP client must be installable.

Two demands, one rule — never ask a user for something they cannot get:

- `MCP_PROTOCOL` may never name a protocol the shipped MCP package has no adapter
    for. Bumping it without writing protocols/vN.py would tell every user to "upgrade
    ambience-mcp" to a version that cannot help them.
- `MIN_MCP_VERSION` may never name an ambience-mcp newer than the one this repo
    ships. It is a HARD REFUSAL, checked before the protocol question, and `uvx`
    installs LATEST — so a floor above the newest package is a refusal whose only
    remedy is a version that does not exist.
"""

from __future__ import annotations

import pytest

from bin.check_mcp_protocol import (
    find_mcp_protocol,
    find_min_mcp_version,
    find_package_version,
    find_protocols,
    main,
    version_key,
)

# A repo whose MCP package version is fixed, so the floor is the only variable.
_PACKAGED = "0.2.0-rc.3"


def _repo(tmp_path, *, floor: str = _PACKAGED, packaged: str = _PACKAGED, protocol: int = 1):
    """A minimal stand-in for the three files the gate reads."""
    const = tmp_path / "const.py"
    const.write_text(f"MCP_PROTOCOL = {protocol}\nMIN_MCP_VERSION = {floor!r}\n")
    registry = tmp_path / "registry.py"
    registry.write_text("PROTOCOLS: dict[int, type] = {1: object}\n")
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text(f'[project]\nname = "ambience-mcp"\nversion = "{packaged}"\n')
    return [
        "--const",
        str(const),
        "--registry",
        str(registry),
        "--pyproject",
        str(pyproject),
    ]


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


def test_find_protocols_ignores_nested_assignment_executed_first(tmp_path):
    # ast.walk is breadth-first, so it would visit the nested `if` assignment
    # AFTER the top-level one despite it executing BEFORE it, and report the
    # stale, larger set. Module-level source order must win instead.
    init = tmp_path / "__init__.py"
    init.write_text(
        "if True:\n    PROTOCOLS = {1: object, 2: object, 3: object}\nPROTOCOLS = {1: object}\n"
    )

    assert find_protocols(init) == {1}


def test_find_mcp_protocol_ignores_nested_assignment_executed_first(tmp_path):
    # Same blind spot as above, for find_mcp_protocol.
    const = tmp_path / "const.py"
    const.write_text("if True:\n    MCP_PROTOCOL = 3\nMCP_PROTOCOL = 1\n")

    assert find_mcp_protocol(const) == 1


def test_find_protocols_ignores_assignment_inside_a_function(tmp_path):
    # A same-named local inside a function body is not the module constant.
    init = tmp_path / "__init__.py"
    init.write_text(
        "PROTOCOLS: dict[int, type] = {1: object}\n"
        "\n"
        "def _unrelated():\n"
        "    PROTOCOLS = {1: object, 2: object, 3: object}\n"
        "    return PROTOCOLS\n"
    )

    assert find_protocols(init) == {1}


def test_find_protocols_ignores_assignment_inside_a_class(tmp_path):
    # A same-named class attribute is not the module constant either.
    init = tmp_path / "__init__.py"
    init.write_text(
        "PROTOCOLS: dict[int, type] = {1: object}\n"
        "\n"
        "class _Unrelated:\n"
        "    PROTOCOLS = {1: object, 2: object, 3: object}\n"
    )

    assert find_protocols(init) == {1}


def test_find_mcp_protocol_ignores_assignment_inside_a_function(tmp_path):
    const = tmp_path / "const.py"
    const.write_text(
        "MCP_PROTOCOL = 1\n\ndef _unrelated():\n    MCP_PROTOCOL = 99\n    return MCP_PROTOCOL\n"
    )

    assert find_mcp_protocol(const) == 1


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
    assert main(_repo(tmp_path)) == 0


def test_print_protocol_prints_only_the_number(tmp_path, capsys):
    """bin/release.sh's Gate 2 extracts MCP_PROTOCOL through THIS parser (one
    parser, not two that can disagree), so the flag must emit a bare integer."""
    assert main([*_repo(tmp_path, protocol=7), "--print-protocol"]) == 0

    assert capsys.readouterr().out.strip() == "7"


def test_print_protocol_fails_closed_on_an_unreadable_constant(tmp_path):
    """release.sh must never proceed on a protocol it could not read."""
    const = tmp_path / "const.py"
    const.write_text("OTHER = 1\n")

    with pytest.raises(SystemExit):
        main(["--const", str(const), "--print-protocol"])


# --- MIN_MCP_VERSION: the floor must always be installable -------------------------
def test_a_floor_newer_than_the_packaged_mcp_is_refused(tmp_path, capsys):
    """The fourth way to get this wrong: a one-line MIN_MCP_VERSION bump needs no
    adapter and no shape re-record, yet it refuses EVERY client — pointing them at
    an ambience-mcp that was never published. `uvx` installs latest; they cannot obey.
    """
    with pytest.raises(SystemExit) as exc_info:
        main(_repo(tmp_path, floor="0.3.0"))

    assert exc_info.value.code == 1
    err = capsys.readouterr().err
    # Actionable: names both offending values and both ways out.
    assert "MIN_MCP_VERSION='0.3.0'" in err
    assert "'0.2.0-rc.3'" in err
    assert "mcp-server/pyproject.toml" in err


def test_a_floor_equal_to_the_packaged_mcp_passes(tmp_path):
    """The real repo's state. Note the two spellings NORMALISE to the same version —
    a string compare would call `0.2.0rc3` != `0.2.0-rc.3` and fail this."""
    assert main(_repo(tmp_path, floor="0.2.0rc3", packaged="0.2.0-rc.3")) == 0


def test_a_floor_older_than_the_packaged_mcp_passes(tmp_path):
    # The normal case after an MCP release: the floor lags the package.
    assert main(_repo(tmp_path, floor="0.1.0", packaged="0.2.0-rc.3")) == 0


def test_an_unparseable_floor_fails_loudly(tmp_path, capsys):
    # A gate that cannot read one of the two values it compares must never shrug
    # and pass — that is how a real refusal ships unnoticed.
    with pytest.raises(SystemExit):
        main(_repo(tmp_path, floor="not-a-version"))

    assert "not a PEP 440 version" in capsys.readouterr().err


def test_a_missing_floor_is_an_error(tmp_path):
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 1\n")

    with pytest.raises(SystemExit):
        find_min_mcp_version(const)


def test_a_floor_that_is_not_a_string_literal_is_an_error(tmp_path):
    # Broadcast to every client as a hard refusal; a gate cannot read a floor it
    # would have to execute code to compute.
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 1\nMIN_MCP_VERSION = _derive()\n")

    with pytest.raises(SystemExit):
        find_min_mcp_version(const)


def test_find_min_mcp_version_last_assignment_wins(tmp_path):
    const = tmp_path / "const.py"
    const.write_text('MIN_MCP_VERSION = "0.1.0"\nMIN_MCP_VERSION = "0.2.0"\n')

    assert find_min_mcp_version(const) == "0.2.0"


def test_reads_the_packaged_mcp_version(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text('[project]\nname = "ambience-mcp"\nversion = "0.2.0-rc.3"\n')

    assert find_package_version(pyproject) == "0.2.0-rc.3"


def test_a_pyproject_without_a_version_is_an_error(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text('[project]\nname = "ambience-mcp"\n')

    with pytest.raises(SystemExit):
        find_package_version(pyproject)


def test_an_unparseable_pyproject_is_an_error(tmp_path):
    pyproject = tmp_path / "pyproject.toml"
    pyproject.write_text("[project\nname =\n")

    with pytest.raises(SystemExit):
        find_package_version(pyproject)


# --- the vendored PEP 440 comparison ------------------------------------------------
# `packaging` is not stdlib and CI's `quality` job installs nothing, so the ordering
# the gate depends on lives in this file. These pin the traps a naive compare falls in.
def test_pep440_ordering_is_not_string_ordering():
    key = lambda raw: version_key(raw, what="test")  # noqa: E731

    # "0.2.0rc10" < "0.2.0rc9" as STRINGS. It must not be.
    assert key("0.2.0rc9") < key("0.2.0rc10")
    # A pre-release precedes its final; a final precedes its post.
    assert key("1.0.0rc1") < key("1.0.0")
    assert key("1.0.0") < key("1.0.0.post1")
    assert key("1.0.0.dev1") < key("1.0.0rc1")
    # Trailing zeros in the release segment do not change the version.
    assert key("1.0") == key("1.0.0")
    # Every legal spelling of the SAME pre-release compares equal.
    assert key("0.2.0-rc.3") == key("0.2.0rc3") == key("0.2.0_c_3") == key("0.2.0preview3")


def test_version_key_rejects_garbage():
    with pytest.raises(SystemExit):
        version_key("banana", what="test")
    with pytest.raises(SystemExit):
        version_key(3, what="test")
