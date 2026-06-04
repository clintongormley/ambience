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

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = REPO_ROOT / "bin" / "release.sh"
BUMP_SCRIPT = REPO_ROOT / "bin" / "bump-version.sh"
RELEASE_BRANCH = "chore/release"


def _clean_env(extra: dict | None = None) -> dict:
    """Return os.environ with all GIT_* vars stripped, plus any extras.

    Without this, subprocess git calls in tests inherit GIT_DIR / GIT_WORK_TREE /
    GIT_INDEX_FILE from a parent context (e.g. a pre-push hook) and operate on the
    wrong repo. BUILD_CMD defaults to a no-op so the frontend build guard passes
    without a real toolchain; individual tests override it.
    """
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    env.setdefault("BUILD_CMD", "true")
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

    # The npm package ships with the integration, so its version is kept in
    # lockstep with the manifest. The lockfile carries the root version twice
    # (top-level and packages[""]) plus an unrelated dependency at the same
    # version, which must NOT be touched.
    (tmp_path / "package.json").write_text(
        '{\n  "name": "ambience-panel",\n  "version": "0.1.0",\n  "private": true\n}\n'
    )
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
    _git("clone", "-q", str(origin), str(other), cwd=tmp_path)
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


def test_does_not_leak_to_parent_git_dir_via_env(tmp_path: Path, monkeypatch):
    """If GIT_DIR is set in the env, the test fixtures must not write to that repo."""
    parent = tmp_path / "parent_repo"
    parent.mkdir()
    subprocess.run(["git", "init", "-q", "-b", "main", str(parent)], check=True)
    parent_git = parent / ".git"
    config_before = (parent_git / "config").read_text()

    monkeypatch.setenv("GIT_DIR", str(parent_git))

    fixture = tmp_path / "fixture"
    fixture.mkdir()
    _init_repo(fixture)

    config_after = (parent_git / "config").read_text()
    assert config_before == config_after
