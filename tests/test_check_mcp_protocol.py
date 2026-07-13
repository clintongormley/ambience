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
    is_prerelease,
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


def test_a_bool_mcp_protocol_is_refused(tmp_path, capsys):
    """`isinstance(True, int)` is True in Python, so a bare type check passes
    `MCP_PROTOCOL = True` and then coerces it to 1 — the gate would report a value the
    backend never had. The RUNTIME rejects a bool protocol explicitly (`_negotiate`
    excludes `isinstance(protocol, bool)`), so the backend would broadcast
    `{"protocol": true}`, EVERY client would be told to update Ambience, and updating
    could not help. The gate that feeds that runtime must hold the same line."""
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = True\n")

    with pytest.raises(SystemExit):
        find_mcp_protocol(const)

    err = capsys.readouterr().err
    assert "bool" in err


def test_parse_is_not_cached_between_reads(tmp_path):
    """The finders must always read what is ON DISK. An `@functools.cache` on the parse
    (a micro-optimisation to save one re-parse of const.py per run) makes the tree sticky
    per-path for the life of the process, so an in-process caller that reads a path,
    rewrites it, and reads it again silently gets the STALE value — in a gate, the one
    failure mode that must never happen."""
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = 1\n")
    assert find_mcp_protocol(const) == 1

    const.write_text("MCP_PROTOCOL = 2\n")
    assert find_mcp_protocol(const) == 2


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


def test_find_mcp_protocol_handles_a_chained_assignment(tmp_path):
    # `MCP_PROTOCOL = OTHER = 1` is a single ast.Assign node with TWO targets — the
    # multi-target shape _module_level_assignments' arity-agnostic branch must still
    # find `MCP_PROTOCOL` in, alongside the ordinary single-target `a = 1` shape.
    const = tmp_path / "const.py"
    const.write_text("MCP_PROTOCOL = OTHER = 1\n")

    assert find_mcp_protocol(const) == 1


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


# --- --check-floor-against: the floor vs the PUBLISHED ambience-mcp ------------------
# Gate 1 above compares the floor with THIS REPO's mcp-server/pyproject.toml, which the
# post-release bump routinely runs ahead of PyPI — so passing it does not mean a user
# can install the floor. `bin/release.sh`'s Gate 2 calls back in through this flag with
# the version PyPI reports, so the two halves share ONE PEP 440 comparator.


def test_check_floor_against_refuses_a_floor_newer_than_published(tmp_path, capsys):
    """The deadlock Gate 1 alone cannot see: pyproject.toml says 0.4.0 (so Gate 1 is
    happy), the protocol never moved (so the protocol half of Gate 2 is happy), and PyPI
    still only has 0.3.0 — every user is told to upgrade to a package that does not
    exist."""
    argv = _repo(tmp_path, floor="0.4.0", packaged="0.4.0")

    with pytest.raises(SystemExit) as exc_info:
        main([*argv, "--check-floor-against", "0.3.0"])

    assert exc_info.value.code == 1
    err = capsys.readouterr().err
    assert "MIN_MCP_VERSION='0.4.0'" in err
    assert "'0.3.0'" in err
    assert "PyPI" in err


@pytest.mark.parametrize("published", ["0.2.0-rc.3", "0.3.0", "0.2.0rc3"])
def test_check_floor_against_passes_at_or_below_published(tmp_path, published):
    """Equal (in any legal spelling) and older both pass — the floor names something a
    `uvx` user can actually get."""
    assert main([*_repo(tmp_path), "--check-floor-against", published]) == 0


def test_check_floor_against_is_pep440_not_string_ordering(tmp_path):
    # "0.2.0rc9" > "0.2.0rc10" as STRINGS: a shell `[ x \> y ]` would block this
    # releasable pair and pass the unreleasable one below.
    assert main([*_repo(tmp_path, floor="0.2.0rc9"), "--check-floor-against", "0.2.0rc10"]) == 0

    with pytest.raises(SystemExit):
        main([*_repo(tmp_path, floor="0.2.0rc10"), "--check-floor-against", "0.2.0rc9"])


@pytest.mark.parametrize("published", ["", "not-a-version", "0.2.0-rc.3+dirty"])
def test_check_floor_against_fails_closed_on_an_unreadable_published_version(tmp_path, published):
    """A published version the gate cannot compare is not one it may ignore: an
    unreachable/garbled PyPI must never read as 'the floor is fine'. (The local segment
    is refused outright — PyPI cannot host it, and `packaging` orders it ABOVE the plain
    version, so measuring a floor against it would silently pass a refuse-everyone
    release.)"""
    with pytest.raises(SystemExit):
        main([*_repo(tmp_path), "--check-floor-against", published])


def test_check_floor_against_fails_closed_on_an_unreadable_floor(tmp_path):
    """The other half of the same comparison."""
    with pytest.raises(SystemExit):
        main([*_repo(tmp_path, floor="not-a-version"), "--check-floor-against", "9.9.9"])


# --- --is-prerelease: which ambience-mcp CHANNEL does a release belong to? -----------
# `uvx --from ambience-mcp` uses uv's default prerelease strategy, which EXCLUDES
# pre-releases whenever a final release exists. So a PRE-RELEASE Ambience — paired with a
# PRE-RELEASE ambience-mcp — must be gated against (and tested with) `--prerelease=allow`,
# and a FINAL one against the plain, final-only channel. `bin/release.sh`'s Gate 2 asks
# this about the version it is cutting; the answer comes from the same vendored PEP 440
# machinery as every other version question, not a second `case "$VERSION" in *-rc.*`.


@pytest.mark.parametrize(
    "version",
    ["1.6.0-rc.1", "1.6.0rc1", "1.6.0-alpha.1", "1.6.0-beta.2", "1.6.0a1", "1.6.0.dev1"],
)
def test_a_prerelease_version_is_a_prerelease(version):
    """Every spelling bin/bump-version.sh's semver check accepts (`-alpha.N`, `-beta.N`,
    `-rc.N`), plus the PEP 440 forms they normalise to, and a dev build."""
    assert is_prerelease(version, what="test") is True


@pytest.mark.parametrize("version", ["1.6.0", "1.6", "1.6.0.post1", "1!1.6.0"])
def test_a_final_version_is_not_a_prerelease(version):
    """A final release — including a post-release, which `packaging` also calls final.
    Getting this wrong sends a stable release to the pre-release channel, where an rc
    ambience-mcp would satisfy a gate that a plain `uvx` user could never satisfy."""
    assert is_prerelease(version, what="test") is False


@pytest.mark.parametrize("version", ["", "banana", "1.6.0+dirty", 3])
def test_is_prerelease_fails_closed_on_anything_it_cannot_classify(version):
    """A version the gate cannot read is not one it may guess a channel for: guessing
    "final" would probe the wrong PyPI channel and pass a release nobody can use."""
    with pytest.raises(SystemExit):
        is_prerelease(version, what="test")


def test_is_prerelease_agrees_with_packaging_on_every_version():
    """The differential, in the same style as the ordering one below: `packaging` is what
    the MCP RUNTIME uses to decide whether the backend is a pre-release (and so whether to
    tell the user to allow pre-releases). If the gate and the runtime disagree about what
    a pre-release IS, one of them is talking about a channel the other never probed."""
    from packaging.version import Version

    for raw in _SPREAD:
        assert is_prerelease(raw, what="test") == Version(raw).is_prerelease, raw


def test_is_prerelease_flag_prints_true_for_a_prerelease(capsys):
    """bin/release.sh's Gate 2 reads this on stdout — a bare `true`/`false`, nothing else,
    because it `case`s on the exact string and fails closed on anything unrecognised."""
    assert main(["--is-prerelease", "1.6.0-rc.1"]) == 0
    assert capsys.readouterr().out.strip() == "true"

    assert main(["--is-prerelease", "1.6.0"]) == 0
    assert capsys.readouterr().out.strip() == "false"


def test_is_prerelease_flag_asks_nothing_of_the_repo(tmp_path):
    """It answers a question about a version STRING, so it must not fail (or pass) for
    reasons that have nothing to do with the release being cut — an unreadable const.py
    included."""
    const = tmp_path / "const.py"
    const.write_text("OTHER = 1\n")

    assert main(["--const", str(const), "--is-prerelease", "1.6.0-rc.1"]) == 0


def test_is_prerelease_flag_fails_closed_on_garbage(tmp_path, capsys):
    with pytest.raises(SystemExit):
        main([*_repo(tmp_path), "--is-prerelease", "not-a-version"])

    assert "not a PEP 440 version" in capsys.readouterr().err


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


# The spread the differential below compares. Every entry is a version this repo could
# plausibly hold in MIN_MCP_VERSION or mcp-server/pyproject.toml, plus the spellings
# that break a naive compare: the two spellings of the SAME rc (a false "newer" here
# refuses every current user), rc9 vs rc10 (string ordering gets it backwards), an rc
# vs its final, `1.0` vs `1.0.0`, and dev/post/alpha/beta/epoch.
_SPREAD = (
    "0.1.0",
    "0.2.0-rc.3",
    "0.2.0rc3",
    "0.2.0rc9",
    "0.2.0rc10",
    "0.2.0",
    "0.2.1",
    "0.3.0",
    "1.0",
    "1.0.0",
    "1.0.0a1",
    "1.0.0b2",
    "1.0.0rc1",
    "1.0.0rc1.dev1",
    "1.0.0.dev1",
    "1.0.0.post1",
    "1.0.0.post1.dev1",
    "2.0.0",
    "1!0.1.0",
)


def _sign(left, right) -> int:
    return (left > right) - (left < right)


def test_vendored_pep440_agrees_with_packaging_on_every_pair():
    """The differential: the vendored comparison must order versions EXACTLY as real
    `packaging.version.Version` does.

    The two implementations are not interchangeable by choice — they are two halves of
    ONE decision. This gate (stdlib-only: CI's `quality` job pip-installs nothing) says
    "MIN_MCP_VERSION is installable"; the MCP runtime (`ha_client._negotiate`, which has
    `packaging`) enforces the same floor against the client's own version. Wherever the
    two orderings disagree, the gate passes a release whose runtime then refuses users —
    the exact deadlock the gate exists to prevent.

    Hand-picked assertions cannot hold that line: they did not catch the local-segment
    divergence (`0.2.0-rc.3+dirty` > `0.2.0-rc.3` for `packaging`, EQUAL for a vendored
    key that dropped the segment → gate PASS, runtime refuse-all). This compares every
    pair, so a divergence has nowhere to hide.

    `packaging` is a Home Assistant dependency, so it is importable in the test venv —
    it is only the zero-install `quality` job that lacks it. Imported here, never in
    `bin/check_mcp_protocol.py`.
    """
    from itertools import combinations

    from packaging.version import Version

    for left, right in combinations(_SPREAD, 2):
        ours = _sign(version_key(left, what="test"), version_key(right, what="test"))
        theirs = _sign(Version(left), Version(right))
        assert ours == theirs, (
            f"vendored PEP 440 disagrees with packaging on {left!r} vs {right!r}: "
            f"vendored says {ours}, packaging says {theirs}. The gate and the MCP "
            f"runtime must order versions identically."
        )


def test_a_local_version_segment_fails_closed(capsys):
    """The divergence that a wildcard-shrug would have shipped: `packaging` orders
    `0.2.0-rc.3+dirty` ABOVE `0.2.0-rc.3`, so a floor carrying a local segment refuses
    every client at runtime — while a vendored key that merely IGNORED the segment
    would call the two equal and pass the gate. A local version cannot be published to
    PyPI either, so it can never be a floor a user could install. Fail, loudly."""
    with pytest.raises(SystemExit):
        version_key("0.2.0-rc.3+dirty", what="MIN_MCP_VERSION")

    err = capsys.readouterr().err
    assert "local version segment" in err
    assert "MIN_MCP_VERSION" in err


def test_a_floor_with_a_local_segment_is_refused_by_the_gate(tmp_path, capsys):
    """End to end, because this is the shape the bug takes in the wild: the gate would
    have PASSED (floor == packaged, once the segment is dropped) and every user of the
    released Ambience would then have been refused by the runtime."""
    with pytest.raises(SystemExit):
        main(_repo(tmp_path, floor="0.2.0-rc.3+dirty", packaged="0.2.0-rc.3"))

    assert "local version segment" in capsys.readouterr().err


def test_a_packaged_version_with_a_local_segment_is_refused_by_the_gate(tmp_path, capsys):
    """The other side of the same comparison: a dirty-tree version in
    mcp-server/pyproject.toml is not a package anyone can install, so the gate must not
    quietly measure the floor against it."""
    with pytest.raises(SystemExit):
        main(_repo(tmp_path, floor="0.2.0-rc.3", packaged="0.2.0-rc.3+dirty"))

    assert "local version segment" in capsys.readouterr().err
