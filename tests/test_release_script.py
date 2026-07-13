"""Tests for bin/release.sh.

Ambience is an integration-only HACS repo: the single version source of truth is
custom_components/ambience/manifest.json, and the frontend bundle is committed
under custom_components/ambience/frontend/. The release script bumps the manifest
and, as a safety net, rebuilds the bundle and refuses to proceed if that produces
uncommitted changes (a stale committed bundle).

The real build command is `npm run build`; tests inject a fake via the BUILD_CMD
env var so they need neither node nor the frontend toolchain.

The release branch is deliberately version-less (chore/release): HACS scans every
branch and complains about version numbers in branch names (see CLAUDE.md).
"""

import os
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = REPO_ROOT / "bin" / "release.sh"
BUMP_SCRIPT = REPO_ROOT / "bin" / "bump-version.sh"
RELEASE_BRANCH = "chore/release"


def _clean_env(extra: dict | None = None) -> dict:
    """Return os.environ with GIT_* and COVERAGE_*/COV_CORE_* vars stripped, plus extras.

    GIT_*: without this, subprocess git calls in tests inherit GIT_DIR /
    GIT_WORK_TREE / GIT_INDEX_FILE from a parent context (e.g. a pre-push hook)
    and operate on the wrong repo.

    COVERAGE_*/COV_CORE_*: release.sh now spawns `python3 changelog.py promote`.
    Under `pytest --cov`, COVERAGE_PROCESS_START is set, so a coverage-bootstrap
    .pth would make that grandchild auto-start coverage and write a
    *statement-only* data file that can't be combined with the parent run's
    *branch* data ("Can't combine statement coverage data with branch data").
    We don't measure changelog.py here, so scrub the bootstrap entirely.

    BUILD_CMD / AI_DOCS_CMD default to a no-op so the frontend-build and AI-docs
    freshness guards pass without a real toolchain; individual tests override them.

    MCP_PYPI_CHECK_CMD stands in for the real PyPI lookup, which answers on one line
    with BOTH fields Gate 2 needs: "<protocols> <version>", where <protocols> is a
    comma-joined list (e.g. "1,2 0.2.0" — the published package ships an adapter per
    protocol it supports). The default satisfies the fixture repo (see _init_repo's
    const.py: MCP_PROTOCOL=1, MIN_MCP_VERSION=0.1.0) so Gate 2 passes without hitting
    the real network/PyPI; tests exercising Gate 2 itself override it to simulate
    other published protocols and versions.
    """
    env = {
        k: v for k, v in os.environ.items() if not k.startswith(("GIT_", "COVERAGE_", "COV_CORE_"))
    }
    env.setdefault("BUILD_CMD", "true")
    env.setdefault("AI_DOCS_CMD", "true")
    env.setdefault("MCP_PYPI_CHECK_CMD", "echo '1 0.2.0'")
    if extra:
        env.update(extra)
    return env


def _git(*args: str, cwd: Path, check: bool = True, **kwargs) -> subprocess.CompletedProcess:
    """Run a git command with GIT_* env scrubbed."""
    return subprocess.run(["git", *args], cwd=cwd, check=check, env=_clean_env(), **kwargs)


def _run(cwd: Path, *args: str, env: dict | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["bash", str(SCRIPT), *args],
        cwd=cwd,
        capture_output=True,
        text=True,
        env=_clean_env(env),
    )


def _run_bump(cwd: Path, *args: str, env: dict | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["bash", str(BUMP_SCRIPT), *args],
        cwd=cwd,
        capture_output=True,
        text=True,
        env=_clean_env(env),
    )


def test_rejects_invalid_semver(tmp_path: Path):
    result = _run(tmp_path, "not-a-version")
    assert result.returncode != 0
    assert "semver" in (result.stdout + result.stderr).lower()


def test_accepts_alpha_suffix(tmp_path: Path):
    """The semver check accepts an alpha pre-release suffix. Other pre-flights
    (clean tree, on main, ...) still fail in a bare tmp_path, so we only assert
    the error is NOT a semver error."""
    result = _run(tmp_path, "0.2.0-alpha.1")
    assert "semver" not in (result.stdout + result.stderr).lower()


def test_accepts_beta_suffix(tmp_path: Path):
    result = _run(tmp_path, "0.2.0-beta.2")
    assert "semver" not in (result.stdout + result.stderr).lower()


def test_accepts_rc_suffix(tmp_path: Path):
    result = _run(tmp_path, "0.2.0-rc.1")
    assert "semver" not in (result.stdout + result.stderr).lower()


def _init_repo(tmp_path: Path, *, branch: str = "main", dirty: bool = False) -> Path:
    """Create a tiny git repo mirroring ambience's release-relevant layout."""
    _git("init", "-q", "-b", branch, cwd=tmp_path)
    _git("config", "user.email", "t@test", cwd=tmp_path)
    _git("config", "user.name", "t", cwd=tmp_path)

    comp = tmp_path / "custom_components" / "ambience"
    (comp / "frontend").mkdir(parents=True)
    (comp / "manifest.json").write_text('{\n  "domain": "ambience",\n  "version": "0.1.0"\n}\n')
    (comp / "frontend" / "ambience-panel.js").write_text("// built bundle\n")
    # Gate 2 (release.sh) reads BOTH constants out of const.py, through
    # bin/check_mcp_protocol.py: MCP_PROTOCOL (--print-protocol) and MIN_MCP_VERSION
    # (--check-floor-against, which compares it with the PUBLISHED ambience-mcp).
    (comp / "const.py").write_text('MCP_PROTOCOL = 1\nMIN_MCP_VERSION = "0.1.0"\n')

    # The npm package ships with the integration, so its version is kept in
    # lockstep with the manifest. The lockfile carries the root version twice
    # (top-level and packages[""]) plus an unrelated dependency at the same
    # version, which must NOT be touched.
    (tmp_path / "package.json").write_text(
        '{\n  "name": "ambience-panel",\n  "version": "0.1.0",\n  "private": true\n}\n'
    )
    # pyproject's [project] version is bumped too (a stale number misleads).
    (tmp_path / "pyproject.toml").write_text('[project]\nname = "ambience"\nversion = "0.1.0"\n')
    # The Claude plugin manifest version tracks the integration version.
    plugin_dir = tmp_path / ".claude-plugin"
    plugin_dir.mkdir()
    (plugin_dir / "plugin.json").write_text('{\n  "name": "ambience",\n  "version": "0.1.0"\n}\n')
    (tmp_path / "package-lock.json").write_text(
        "{\n"
        '  "name": "ambience-panel",\n'
        '  "version": "0.1.0",\n'
        '  "lockfileVersion": 3,\n'
        '  "packages": {\n'
        '    "": {\n'
        '      "name": "ambience-panel",\n'
        '      "version": "0.1.0"\n'
        "    },\n"
        '    "node_modules/esbuild": {\n'
        '      "version": "0.1.0"\n'
        "    }\n"
        "  }\n"
        "}\n"
    )

    (tmp_path / "CHANGELOG.md").write_text(
        "# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- A user-facing fix.\n"
    )

    _git("add", ".", cwd=tmp_path)
    _git("commit", "-qm", "init", cwd=tmp_path)

    if dirty:
        (tmp_path / "dirt").write_text("x")

    return tmp_path


def _manifest_version(repo: Path) -> str:
    import json

    return json.loads((repo / "custom_components" / "ambience" / "manifest.json").read_text())[
        "version"
    ]


def test_syncs_package_json_and_lockfile_to_manifest(tmp_path: Path):
    """package.json and package-lock.json (root version, both occurrences) are
    bumped in lockstep with the manifest; unrelated dependency versions in the
    lockfile are left untouched."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push")
    assert result.returncode == 0, result.stdout + result.stderr

    _git("checkout", "-q", RELEASE_BRANCH, cwd=tmp_path)

    import json

    pkg = json.loads((tmp_path / "package.json").read_text())
    assert pkg["version"] == "0.2.0"

    lock = json.loads((tmp_path / "package-lock.json").read_text())
    assert lock["version"] == "0.2.0"
    assert lock["packages"][""]["version"] == "0.2.0"
    # The dependency pinned at the old version must NOT have been rewritten.
    assert lock["packages"]["node_modules/esbuild"]["version"] == "0.1.0"


# --- bin/bump-version.sh: the shared bump used by release.sh and the workflow ---


def test_bump_version_bumps_all_files_and_verifies(tmp_path: Path):
    """The standalone bump script updates manifest, package.json, and both root
    lockfile occurrences, leaving unrelated dependency versions alone."""
    import json

    _init_repo(tmp_path)
    result = _run_bump(tmp_path, "0.2.0")
    assert result.returncode == 0, result.stdout + result.stderr

    assert _manifest_version(tmp_path) == "0.2.0"
    assert json.loads((tmp_path / "package.json").read_text())["version"] == "0.2.0"
    lock = json.loads((tmp_path / "package-lock.json").read_text())
    assert lock["version"] == "0.2.0"
    assert lock["packages"][""]["version"] == "0.2.0"
    assert lock["packages"]["node_modules/esbuild"]["version"] == "0.1.0"
    assert 'version = "0.2.0"' in (tmp_path / "pyproject.toml").read_text()
    # The Claude plugin manifest is bumped in lockstep so plugin users get the
    # refreshed knowledge pack on a marketplace update.
    assert json.loads((tmp_path / ".claude-plugin" / "plugin.json").read_text())["version"] == (
        "0.2.0"
    )


def test_bump_version_rejects_invalid_semver(tmp_path: Path):
    _init_repo(tmp_path)
    result = _run_bump(tmp_path, "not-a-version")
    assert result.returncode != 0
    assert "semver" in (result.stdout + result.stderr).lower()
    assert _manifest_version(tmp_path) == "0.1.0"  # nothing written


def test_bump_version_validate_mode_writes_nothing(tmp_path: Path):
    _init_repo(tmp_path)
    result = _run_bump(tmp_path, "--validate", "0.2.0")
    assert result.returncode == 0, result.stdout + result.stderr
    assert _manifest_version(tmp_path) == "0.1.0"


def test_bump_version_fails_loudly_when_write_does_not_land(tmp_path: Path):
    """If the version pattern doesn't match (e.g. unexpected formatting), the
    bump must fail rather than silently ship a stale version."""
    _init_repo(tmp_path)
    # Compact manifest with no space after the colon: the bump's sed pattern
    # (which expects `"version": "..."`) won't match, so the write is a no-op.
    (tmp_path / "custom_components" / "ambience" / "manifest.json").write_text(
        '{"domain":"ambience","version":"0.1.0"}\n'
    )
    _git("add", ".", cwd=tmp_path)
    _git("commit", "-qm", "compact manifest", cwd=tmp_path)
    result = _run_bump(tmp_path, "0.2.0")
    assert result.returncode != 0, result.stdout + result.stderr


def test_bump_version_fails_loudly_when_lockfile_does_not_land(tmp_path: Path):
    """The lockfile root version must be verified too: if the bump doesn't land
    (e.g. unexpected formatting), fail rather than ship a stale lockfile."""
    _init_repo(tmp_path)
    # Compact lockfile: the bump's spaced `"version": "..."` pattern won't match
    # the unspaced `"version":"0.1.0"`, so the root version edit is a no-op.
    (tmp_path / "package-lock.json").write_text(
        '{"name":"ambience-panel","version":"0.1.0",'
        '"packages":{"":{"name":"ambience-panel","version":"0.1.0"}}}\n'
    )
    _git("add", ".", cwd=tmp_path)
    _git("commit", "-qm", "compact lockfile", cwd=tmp_path)
    result = _run_bump(tmp_path, "0.2.0")
    assert result.returncode != 0, result.stdout + result.stderr


def test_rejects_when_release_branch_already_exists(tmp_path: Path):
    """A leftover chore/release branch (aborted/undeleted prior release) must be
    reported clearly in pre-flight, not crash `git checkout -b` mid-run."""
    _init_repo(tmp_path)
    _git("branch", RELEASE_BRANCH, cwd=tmp_path)
    # A marker the fake build touches: it must NOT exist if the branch-exists
    # check fails fast in pre-flight, before the (slow) build runs.
    marker = tmp_path / "build_ran"
    result = _run(tmp_path, "0.2.0", "--no-push", env={"BUILD_CMD": f"touch {marker}"})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "chore/release" in combined
    assert "exists" in combined or "already" in combined
    assert not marker.exists(), "build ran before the branch-exists pre-flight check"
    # Pre-flight must fail before mutating: still on main.
    branch = _git(
        "rev-parse", "--abbrev-ref", "HEAD", cwd=tmp_path, capture_output=True, text=True
    ).stdout.strip()
    assert branch == "main"


def test_rejects_non_main_branch(tmp_path: Path):
    _init_repo(tmp_path, branch="feature")
    result = _run(tmp_path, "0.2.0")
    assert result.returncode != 0
    assert "main" in (result.stdout + result.stderr).lower()


def test_rejects_dirty_tree(tmp_path: Path):
    _init_repo(tmp_path, dirty=True)
    result = _run(tmp_path, "0.2.0")
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "clean" in combined or "dirty" in combined or "uncommitted" in combined


def test_rejects_existing_tag(tmp_path: Path):
    _init_repo(tmp_path)
    _git("tag", "v0.2.0", cwd=tmp_path)
    result = _run(tmp_path, "0.2.0")
    assert result.returncode != 0
    assert "tag" in (result.stdout + result.stderr).lower()


def test_rejects_main_behind_origin(tmp_path: Path):
    """If local main has fewer commits than origin/main, fail."""
    origin = tmp_path / "origin.git"
    _git("init", "-q", "--bare", "-b", "main", str(origin), cwd=tmp_path)

    local = tmp_path / "local"
    local.mkdir()
    _init_repo(local)
    _git("remote", "add", "origin", str(origin), cwd=local)
    _git("push", "-q", "origin", "main", cwd=local)

    other = tmp_path / "other"
    # --no-local: a default local-path clone copies/hardlinks the bare repo's
    # loose objects directly, which intermittently races a concurrent repack of
    # origin.git (objects vanish mid-copy -> "failed to copy file ... No such
    # file or directory" / "hardlink different from source"). --no-local forces
    # git's normal pack-transfer protocol, which never touches individual source
    # objects, making the clone deterministic.
    _git("clone", "-q", "--no-local", str(origin), str(other), cwd=tmp_path)
    _git("config", "user.email", "t@test", cwd=other)
    _git("config", "user.name", "t", cwd=other)
    (other / "new.txt").write_text("x")
    _git("add", ".", cwd=other)
    _git("commit", "-qm", "new", cwd=other)
    _git("push", "-q", "origin", "main", cwd=other)

    result = _run(local, "0.2.0")
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "up to date" in combined or "behind" in combined


# --- Gate 2: never release a backend the published ambience-mcp cannot satisfy ---
# The fixture's const.py fixes MCP_PROTOCOL=1 and MIN_MCP_VERSION="0.1.0" (see
# _init_repo); MCP_PYPI_CHECK_CMD stands in for the real `uvx --no-cache --from
# ambience-mcp ...` PyPI lookup so these stay fast and network-free. The real lookup
# answers on one line with BOTH fields: "<protocols> <version>", where <protocols> is
# a comma-joined list (e.g. "1,2 0.2.0"). The default is "echo '1 0.2.0'", used by
# every other test in this file to make Gate 2 a no-op while exercising unrelated
# behaviour.


def test_rejects_when_mcp_protocol_ahead_of_published(tmp_path: Path):
    """A backend release that speaks a protocol newer than the published MCP must
    be refused — this is the deadlock Gate 2 exists to prevent."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '0 0.2.0'"})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "protocol" in combined
    assert "publish" in combined  # tells the operator to publish the MCP first
    # Must fail before any mutation: still on main, no release branch.
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


def test_allows_when_published_protocol_meets_or_exceeds(tmp_path: Path):
    """A published MCP that already speaks the backend's protocol (or newer) must
    not block the release. A real newer package ships every adapter it supports
    (per protocols/__init__.py's design), so the fake lists both {1,2}, not just {2}
    — a bare "2" would be the dropped-adapter case, not this one."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '1,2 0.2.0'"})
    assert result.returncode == 0, result.stdout + result.stderr


def test_gate2_refuses_a_published_mcp_that_dropped_the_backends_protocol(tmp_path):
    """Membership, not ceiling: a published ambience-mcp speaking {2,3} does NOT
    satisfy a backend declaring protocol 1 — every user would loop on
    'update Ambience' with no update that helps."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '2,3 0.2.0'"})
    assert result.returncode != 0
    assert "speaks MCP protocol" in result.stderr


# --- Gate 2b: MIN_MCP_VERSION must name a PUBLISHED ambience-mcp ---
# Gate 1 (bin/check_mcp_protocol.py) only holds the floor to the version in THIS REPO's
# mcp-server/pyproject.toml — which the post-release bump routinely runs AHEAD of PyPI.
# So a maintainer could bump pyproject.toml to 0.4.0, raise MIN_MCP_VERSION to "0.4.0",
# pass Gate 1 (0.4.0 <= 0.4.0), pass the protocol half of Gate 2 (the protocol never
# moved — and CONTRIBUTING says a release that doesn't bump MCP_PROTOCOL needs no MCP
# release at all), and ship a backend that refuses EVERY user: `uvx` installs the latest
# PUBLISHED (0.3.0), which is below the floor, and there is nothing to upgrade to.


def test_rejects_when_min_mcp_version_is_newer_than_published(tmp_path: Path):
    """The hole Gate 1's docstring claimed Gate 2 closed, and did not."""
    _init_repo(tmp_path)
    const = tmp_path / "custom_components" / "ambience" / "const.py"
    const.write_text('MCP_PROTOCOL = 1\nMIN_MCP_VERSION = "0.4.0"\n')
    _git("commit", "-aqm", "raise the floor", cwd=tmp_path)

    # The published ambience-mcp speaks the right protocol — only the floor is out of
    # reach, so nothing but this check can catch it.
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '1 0.3.0'"})
    assert result.returncode != 0
    combined = result.stdout + result.stderr
    assert "MIN_MCP_VERSION" in combined
    assert "0.4.0" in combined and "0.3.0" in combined
    assert "publish" in combined.lower()
    # Must fail before any mutation.
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


@pytest.mark.parametrize(
    ("floor", "published"),
    [("0.3.0", "0.3.0"), ("0.1.0", "0.3.0"), ("0.2.0rc9", "0.2.0rc10")],
    ids=["equal", "older", "pep440_not_string_ordering"],
)
def test_allows_a_floor_at_or_below_the_published_version(tmp_path: Path, floor, published):
    """Equal is fine (the floor names the newest published build), older is the normal
    state — and the ordering is PEP 440, not a string compare, which would call
    "0.2.0rc9" NEWER than "0.2.0rc10" and block a perfectly releasable backend."""
    _init_repo(tmp_path)
    const = tmp_path / "custom_components" / "ambience" / "const.py"
    const.write_text(f'MCP_PROTOCOL = 1\nMIN_MCP_VERSION = "{floor}"\n')
    # --allow-empty: the "older" case rewrites the fixture's own floor, so there may be
    # nothing to commit — the release only needs a CLEAN tree, not a new commit.
    _git("commit", "-aqm", "set the floor", "--allow-empty", cwd=tmp_path)

    result = _run(
        tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": f"echo '1 {published}'"}
    )
    assert result.returncode == 0, result.stdout + result.stderr


def test_rejects_a_floor_newer_than_published_under_pep440_ordering(tmp_path: Path):
    """The string-compare trap in the blocking direction: "0.2.0rc10" > "0.2.0rc9" as
    versions, but `[ "0.2.0rc10" \\> "0.2.0rc9" ]` is FALSE as strings. A shell compare
    would let this floor — one no user can install — through."""
    _init_repo(tmp_path)
    const = tmp_path / "custom_components" / "ambience" / "const.py"
    const.write_text('MCP_PROTOCOL = 1\nMIN_MCP_VERSION = "0.2.0rc10"\n')
    _git("commit", "-aqm", "raise the floor", cwd=tmp_path)

    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '1 0.2.0rc9'"})
    assert result.returncode != 0
    assert "MIN_MCP_VERSION" in result.stdout + result.stderr


@pytest.mark.parametrize(
    "check_cmd",
    ["echo '1 not-a-version'", "echo '1 0.2.0+dirty'", "echo 1"],
    ids=[
        "garbage_version",  # a garbled PyPI reply
        "local_segment",  # unpublishable, and NEWER than the plain version to `packaging`
        "version_missing",  # a one-field reply (e.g. a stale pre-two-field override)
    ],
)
def test_rejects_an_unreadable_published_version(tmp_path: Path, check_cmd: str):
    """The floor half of Gate 2 must fail CLOSED on a published version it cannot read.
    A version it cannot compare is not a version it may ignore: shrugging here ships the
    exact refuse-every-user release the gate exists to prevent."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": check_cmd})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "fails closed" in combined or "fail closed" in combined
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


@pytest.mark.parametrize(
    "check_cmd",
    ["false", "echo 'garbage 0.2.0'", "printf '0 0.2.0\\nnote: x\\n'", "echo 'v0 0.2.0'"],
    ids=[
        "unavailable",  # network down / published package predates protocols/
        "non_numeric",  # garbled PyPI response
        "multiline",  # a real (and here dangerously LOWER) digit plus a stray note line
        "leading_non_digit",  # a version-prefixed tag (e.g. from a misconfigured probe)
    ],
)
def test_rejects_an_unparseable_published_protocol(tmp_path: Path, check_cmd: str):
    """A published PROTOCOL LIST that isn't a comma-joined list of bare non-negative
    integers must be rejected by `_is_uint_list` before the membership check, not
    silently pass. A raw `[ "$MCP_PROTOCOL" -gt "$PUBLISHED_PROTOCOLS" ]` would exit 2
    ("integer expression expected") on non-numeric input, and inside an `if` condition
    that status reads as false under `set -e` — which would let a garbled PyPI response
    fail OPEN instead of closed, exactly the trap `_is_uint_list` closes before the
    `case ",$PUBLISHED_PROTOCOLS," in *",$MCP_PROTOCOL,"*)` membership test ever runs.
    This subsumes the plain-emptiness check: an empty string, whitespace, HTML, or a
    multi-line value (e.g. "0 0.2.0\\nnote: deprecated" from a noisy `uv` warning) are
    all rejected here, before they ever reach the comparison — even when (the
    "multiline" case) the first line is itself a well-formed, and here dangerously
    LOWER, reply: the true published protocol list ("0") would not include the
    fixture's backend protocol (1), exactly the deadlock Gate 2 exists to prevent,
    so this must block rather than silently compare against a truncated/garbled
    reading."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": check_cmd})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "fails closed" in combined or "fail closed" in combined
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


# --- Gate 2c: the release CHANNEL — your ambience-mcp channel must match Ambience's ---
# `uvx --from ambience-mcp` (no specifier) uses uv's default prerelease strategy, which
# EXCLUDES pre-releases whenever a final release exists. Today every published
# ambience-mcp is an rc, so uv falls back to the newest rc and the plain probe works by
# accident. The moment a FINAL ambience-mcp ships, it stops working: an rc Ambience
# paired with an rc ambience-mcp would be measured against the older FINAL one, and a
# legitimate rc release would be refused — while the beta tester's own unpinned `uvx`
# resolved that same final and looped forever on "upgrade ambience-mcp".
#
# So Gate 2 probes the channel the release being cut ships into. These tests stub `uvx`
# on PATH (rather than MCP_PYPI_CHECK_CMD) so what is asserted is the REAL command line
# release.sh builds — the override would hide exactly the thing under test.


# The fakes live OUTSIDE the repo (tmp_path/…, repo at tmp_path/repo): anything written
# inside it is an untracked file, and release.sh's very first pre-flight refuses a dirty
# tree — the gate under test would never even run.
def _channel_repo(tmp_path: Path, *, protocol: int = 1, floor: str = "0.1.0") -> Path:
    repo = tmp_path / "repo"
    repo.mkdir()
    _init_repo(repo)
    const = repo / "custom_components" / "ambience" / "const.py"
    const.write_text(f'MCP_PROTOCOL = {protocol}\nMIN_MCP_VERSION = "{floor}"\n')
    _git("commit", "-aqm", "set the protocol and the floor", "--allow-empty", cwd=repo)
    return repo


def _fake_uvx(tmp_path: Path, body: str) -> dict:
    """Put a fake `uvx` on PATH and disarm the MCP_PYPI_CHECK_CMD override, so release.sh
    builds and runs its REAL PyPI probe — the command line under test. Overriding the whole
    command instead would hide the very thing these tests are about. `body` is the fake's
    payload; it sees the probe's own arguments in "$@"."""
    fake_bin = tmp_path / "fake_bin"
    fake_bin.mkdir()
    (fake_bin / "uvx").write_text(f"#!/usr/bin/env bash\n{body}\n")
    (fake_bin / "uvx").chmod(0o755)
    return {"PATH": f"{fake_bin}:{os.environ['PATH']}", "MCP_PYPI_CHECK_CMD": ""}


def test_a_prerelease_release_probes_the_prerelease_channel(tmp_path: Path):
    """An rc Ambience must be checked against the newest PRE-RELEASE-or-final
    ambience-mcp — the one its testers will actually resolve."""
    repo = _channel_repo(tmp_path)
    args_log = tmp_path / "uvx_args.txt"
    env = _fake_uvx(tmp_path, f'echo "$@" > {args_log}\necho "1 0.2.0"')

    result = _run(repo, "0.2.0-rc.1", "--no-push", env=env)
    assert result.returncode == 0, result.stdout + result.stderr

    invocation = args_log.read_text()
    assert "--prerelease=allow" in invocation
    assert "--no-cache" in invocation  # never a cache — the gate must ask PyPI
    assert "--from ambience-mcp" in invocation
    assert "pre-release channel" in result.stdout  # the log is honest about what it asked


def test_a_final_release_probes_the_final_channel(tmp_path: Path):
    """And a final Ambience must NOT: allowing pre-releases here would let an rc
    ambience-mcp satisfy a gate that a plain-`uvx` stable user never could."""
    repo = _channel_repo(tmp_path)
    args_log = tmp_path / "uvx_args.txt"
    env = _fake_uvx(tmp_path, f'echo "$@" > {args_log}\necho "1 0.2.0"')

    result = _run(repo, "0.2.0", "--no-push", env=env)
    assert result.returncode == 0, result.stdout + result.stderr

    invocation = args_log.read_text()
    assert "--prerelease" not in invocation
    assert "--no-cache" in invocation
    assert "--from ambience-mcp" in invocation
    assert "final channel" in result.stdout


# A channel-aware fake PyPI, and the exact state a maintainer is in mid-rc: the FINAL
# channel's newest ambience-mcp (1.0.0) speaks protocol 1; the PRE-RELEASE channel also
# has the freshly tagged 1.1.0rc1, which speaks protocols {1,2} (a real newer package
# ships every adapter it supports, per protocols/__init__.py's design — it has not
# dropped 1, it has ADDED 2).
_CHANNEL_AWARE_PYPI = """
case "$*" in
  *--prerelease=allow*) echo "1,2 1.1.0rc1" ;;
  *) echo "1 1.0.0" ;;
esac
"""


def test_a_prerelease_release_is_allowed_by_a_prerelease_mcp(tmp_path: Path):
    """The bug this closes. The backend speaks protocol 2 and an ambience-mcp that speaks
    protocol 2 IS published — as an rc, alongside its own Ambience rc. The plain probe
    could not see it (uv skips pre-releases once a final exists), resolved the older FINAL
    1.0.0, and refused a legitimate release."""
    repo = _channel_repo(tmp_path, protocol=2)

    result = _run(repo, "0.2.0-rc.1", "--no-push", env=_fake_uvx(tmp_path, _CHANNEL_AWARE_PYPI))
    assert result.returncode == 0, result.stdout + result.stderr
    assert "1.1.0rc1" in result.stdout  # it really did read the rc's answer


def test_a_final_release_is_blocked_when_only_a_prerelease_mcp_speaks_the_protocol(tmp_path: Path):
    """The other half — and NOT a bug: cutting FINAL Ambience against that same PyPI must
    still BLOCK. An rc ambience-mcp is invisible to a plain `uvx`, so every stable user of
    this release would be told to upgrade to a build they cannot install. A final Ambience
    needs a final ambience-mcp published first."""
    repo = _channel_repo(tmp_path, protocol=2)

    result = _run(repo, "0.2.0", "--no-push", env=_fake_uvx(tmp_path, _CHANNEL_AWARE_PYPI))
    assert result.returncode != 0
    combined = result.stdout + result.stderr
    assert "protocol" in combined.lower()
    assert "1.0.0" in combined  # it measured against the FINAL channel's answer
    assert "final channel" in combined
    # Must fail before any mutation.
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=repo, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


def test_a_floor_naming_the_rc_mcp_is_releasable_as_an_rc(tmp_path: Path):
    """The floor half of Gate 2 rides on the SAME probe, so it inherits the channel: an rc
    Ambience whose MIN_MCP_VERSION names the rc ambience-mcp is releasable, because the
    testers it refuses below that floor can install their way out of it."""
    repo = _channel_repo(tmp_path, floor="1.1.0rc1")

    result = _run(repo, "0.2.0-rc.1", "--no-push", env=_fake_uvx(tmp_path, _CHANNEL_AWARE_PYPI))
    assert result.returncode == 0, result.stdout + result.stderr


def test_that_same_floor_blocks_a_final_release(tmp_path: Path):
    """...and on a FINAL release that very floor is a refusal nobody can escape: a plain
    `uvx` resolves 1.0.0, and the only ambience-mcp above the floor is an rc it will never
    install."""
    repo = _channel_repo(tmp_path, floor="1.1.0rc1")

    result = _run(repo, "0.2.0", "--no-push", env=_fake_uvx(tmp_path, _CHANNEL_AWARE_PYPI))
    assert result.returncode != 0
    assert "MIN_MCP_VERSION" in result.stdout + result.stderr


def test_warns_when_pypi_check_cmd_overridden(tmp_path: Path):
    """A maintainer with a stale exported MCP_PYPI_CHECK_CMD (e.g. left over from
    debugging Gate 2 itself) silently disables a fail-closed release gate --
    identical failure class to the stale `uv` cache incident that prompted this
    whole gate. The override must announce itself on stderr."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push", env={"MCP_PYPI_CHECK_CMD": "echo '1 0.2.0'"})
    assert result.returncode == 0, result.stdout + result.stderr
    assert "MCP_PYPI_CHECK_CMD" in result.stderr
    assert "overrid" in result.stderr.lower()


def test_bumps_manifest_and_creates_versionless_branch(tmp_path: Path):
    """The happy path: bump manifest.json on a version-less release branch."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push")
    assert result.returncode == 0, result.stdout + result.stderr

    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH in branches

    _git("checkout", "-q", RELEASE_BRANCH, cwd=tmp_path)
    assert _manifest_version(tmp_path) == "0.2.0"

    # The marker commit names the release.
    last_msg = _git(
        "log", "-1", "--format=%s", cwd=tmp_path, capture_output=True, text=True
    ).stdout.strip()
    assert "0.2.0" in last_msg


def test_branch_name_has_no_version_number(tmp_path: Path):
    """HACS scans every branch and rejects version numbers in branch names, so the
    release branch must be a fixed, version-less name."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push")
    assert result.returncode == 0, result.stdout + result.stderr

    branches = _git(
        "branch", "--format=%(refname:short)", cwd=tmp_path, capture_output=True, text=True
    ).stdout
    for name in branches.split():
        assert "0.2.0" not in name, f"branch {name!r} contains a version number"


def test_fails_when_build_produces_uncommitted_bundle(tmp_path: Path):
    """If rebuilding the frontend changes the committed bundle, the script must
    refuse to release (the shipped bundle would be stale)."""
    _init_repo(tmp_path)
    # Fake build writes new content into the committed bundle.
    bundle = tmp_path / "custom_components" / "ambience" / "frontend" / "ambience-panel.js"
    build = f"printf '// rebuilt\\n' > {bundle}"
    result = _run(tmp_path, "0.2.0", "--no-push", env={"BUILD_CMD": build})
    assert result.returncode != 0
    combined = (result.stdout + result.stderr).lower()
    assert "bundle" in combined or "stale" in combined or "build" in combined

    # And it must NOT have created the release branch.
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches


def test_clean_build_does_not_block_release(tmp_path: Path):
    """A build that reproduces the committed bundle byte-for-byte must not block."""
    _init_repo(tmp_path)
    bundle = tmp_path / "custom_components" / "ambience" / "frontend" / "ambience-panel.js"
    # Rewrite the SAME content -> git sees no change.
    build = f"printf '// built bundle\\n' > {bundle}"
    result = _run(tmp_path, "0.2.0", "--no-push", env={"BUILD_CMD": build})
    assert result.returncode == 0, result.stdout + result.stderr
    _git("checkout", "-q", RELEASE_BRANCH, cwd=tmp_path)
    assert _manifest_version(tmp_path) == "0.2.0"


def test_pushes_and_opens_pr(tmp_path: Path):
    repo = tmp_path / "repo"
    repo.mkdir()
    _init_repo(repo)

    fake_bin = tmp_path / "fake_bin"
    fake_bin.mkdir()
    log = tmp_path / "calls.log"

    (fake_bin / "gh").write_text(
        f'#!/usr/bin/env bash\necho "gh $*" >> "{log}"\necho https://github.com/fake/repo/pull/1\n'
    )
    (fake_bin / "gh").chmod(0o755)

    real_git = subprocess.check_output(["which", "git"], text=True).strip()
    (fake_bin / "git").write_text(
        f'#!/usr/bin/env bash\nif [ "$1" = "push" ]; then echo "git $*" >> "{log}"; exit 0; fi\n'
        f'exec {real_git} "$@"\n'
    )
    (fake_bin / "git").chmod(0o755)

    env = _clean_env({"PATH": f"{fake_bin}:{os.environ['PATH']}"})
    result = subprocess.run(
        ["bash", str(SCRIPT), "0.2.0"], cwd=repo, capture_output=True, text=True, env=env
    )
    assert result.returncode == 0, result.stdout + result.stderr

    call_log = log.read_text()
    assert "git push" in call_log
    assert "gh pr create" in call_log
    assert RELEASE_BRANCH in call_log


def test_promotes_changelog_unreleased_to_version(tmp_path: Path):
    """release.sh moves CHANGELOG.md's [Unreleased] into a dated version section
    on the release branch."""
    _init_repo(tmp_path)
    result = _run(tmp_path, "0.2.0", "--no-push")
    assert result.returncode == 0, result.stdout + result.stderr

    _git("checkout", "-q", RELEASE_BRANCH, cwd=tmp_path)
    changelog = (tmp_path / "CHANGELOG.md").read_text()
    assert "## [0.2.0] - " in changelog
    assert "- A user-facing fix." in changelog
    # [Unreleased] is emptied: the bullet now lives under the dated heading only.
    unreleased = changelog.split("## [0.2.0]")[0]
    assert "- A user-facing fix." not in unreleased


def test_does_not_leak_to_parent_git_dir_via_env(tmp_path: Path, monkeypatch):
    """If GIT_DIR is set in the env, the test fixtures must not write to that repo."""
    parent = tmp_path / "parent_repo"
    parent.mkdir()
    # Scrub GIT_* here too: under a pre-push hook an inherited GIT_DIR would make
    # this `git init` re-init the real repo instead of creating parent/.git.
    subprocess.run(["git", "init", "-q", "-b", "main", str(parent)], check=True, env=_clean_env())
    parent_git = parent / ".git"
    config_before = (parent_git / "config").read_text()

    monkeypatch.setenv("GIT_DIR", str(parent_git))

    fixture = tmp_path / "fixture"
    fixture.mkdir()
    _init_repo(fixture)

    config_after = (parent_git / "config").read_text()
    assert config_before == config_after


def test_cleans_up_release_branch_when_promote_fails(tmp_path: Path):
    """A failure between creating chore/release and the release commit (here: an
    unpromotable CHANGELOG with no [Unreleased]) must not strand a half-prepared
    branch. release.sh returns to the original branch, discards the partial bump,
    and deletes chore/release so a retry starts clean."""
    _init_repo(tmp_path)
    # Remove the [Unreleased] section the fixture seeds so `changelog.py promote`
    # fails — after the version bump, before the release commit.
    (tmp_path / "CHANGELOG.md").write_text("# Changelog\n\n## [0.1.0] - 2026-01-01\n\n- old\n")
    _git("commit", "-aqm", "changelog without Unreleased", cwd=tmp_path)

    result = _run(tmp_path, "0.2.0", "--no-push")
    assert result.returncode != 0

    # Back on the original branch, not stranded on the release branch.
    head = _git(
        "rev-parse", "--abbrev-ref", "HEAD", cwd=tmp_path, capture_output=True, text=True
    ).stdout.strip()
    assert head == "main"

    # The release branch was cleaned up (a retry won't trip the "branch exists" guard).
    branches = _git(
        "branch", "--list", RELEASE_BRANCH, cwd=tmp_path, capture_output=True, text=True
    ).stdout
    assert RELEASE_BRANCH not in branches

    # No stranded uncommitted bump left in the working tree.
    porcelain = _git("status", "--porcelain", cwd=tmp_path, capture_output=True, text=True).stdout
    assert porcelain == "", f"stranded changes: {porcelain!r}"
