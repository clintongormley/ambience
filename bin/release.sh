#!/usr/bin/env bash
# Prepares a release PR for the Ambience integration.
#
# Usage: bin/release.sh <version> [--no-push]
#
# Example: bin/release.sh 0.2.0
#          bin/release.sh 0.2.0-rc.1
#
# What it does:
#   1. Pre-flight: valid semver, on main, clean tree, tag not taken, main up to
#      date with origin.
#   2. Rebuilds the frontend bundle and refuses to continue if that produces
#      uncommitted changes (guards against shipping a stale committed bundle).
#   3. Creates the version-less `chore/release` branch, bumps the version across
#      manifest.json + package.json + package-lock.json (via bin/bump-version.sh),
#      commits, pushes, and opens a PR.
#
# After the PR merges, push the v<version> tag to publish the GitHub Release:
#   git tag v<version> && git push origin v<version>
# The release is published as a PRERELEASE (not "latest"), and main is rolled
# forward to the next minor. When you're ready, flip the release to latest
# (gh release edit v<version> --prerelease=false --latest=true) to advance the
# `stable` channel and deploy the docs. See CONTRIBUTING.md.
#
# The release branch is deliberately version-less: HACS scans every branch and
# complains about version numbers in branch names (see CLAUDE.md).

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: $0 <version> [--no-push]" >&2
  exit 2
fi

VERSION="$1"

# Single semver contract, shared with CI (release.yml uses the same call).
"$(dirname "$0")/bump-version.sh" --validate "$VERSION"

# Must be on main.
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "error: must be on main (currently on $CURRENT_BRANCH)" >&2
  exit 1
fi

# Working tree must be clean.
if [ -n "$(git status --porcelain)" ]; then
  echo "error: working tree is not clean; commit or stash first" >&2
  exit 1
fi

# Tag must not exist locally or on origin.
TAG="v$VERSION"
if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
  echo "error: tag $TAG already exists locally" >&2
  exit 1
fi
# True (0) when the full ref path $1 exists on origin. Captures ls-remote
# first and aborts on failure: inside `if`, a network/auth error is
# indistinguishable from "ref not found" and the guard would silently pass.
# Repos without an origin (tests) report "absent".
remote_ref_exists() {
  git remote get-url origin >/dev/null 2>&1 || return 1
  local refs
  refs=$(git ls-remote origin "$1") \
    || { echo "error: cannot reach origin while checking $1" >&2; exit 1; }
  printf '%s\n' "$refs" | awk '{print $2}' | grep -qx "$1"
}

if remote_ref_exists "refs/tags/$TAG"; then
  echo "error: tag $TAG already exists on origin" >&2
  exit 1
fi

# Local main must be up to date with origin/main.
if git remote get-url origin >/dev/null 2>&1; then
  git fetch -q origin main
  LOCAL=$(git rev-parse main)
  REMOTE=$(git rev-parse origin/main)
  if [ "$LOCAL" != "$REMOTE" ]; then
    echo "error: local main is not up to date with origin/main" >&2
    echo "  local:  $LOCAL" >&2
    echo "  origin: $REMOTE" >&2
    exit 1
  fi
fi

# --- Gate 2: never release a backend before the MCP that speaks its protocol -------
# The coupling is one-directional. A NEW MCP against an OLD backend is fine (it ships
# an adapter for every protocol it supports). A NEW backend against an OLD MCP is a
# DEADLOCK: every user is told "upgrade ambience-mcp" — to a version that does not
# exist yet. `uvx` installs LATEST, so they cannot obey. Fail closed.
MCP_PROTOCOL=$(python3 -c "
import ast, pathlib
tree = ast.parse(pathlib.Path('custom_components/ambience/const.py').read_text())
for node in ast.walk(tree):
    if isinstance(node, ast.Assign):
        for t in node.targets:
            if getattr(t, 'id', None) == 'MCP_PROTOCOL':
                print(node.value.value); raise SystemExit(0)
raise SystemExit('MCP_PROTOCOL not found')
")

echo "→ Gate 2: this release speaks MCP protocol ${MCP_PROTOCOL}; checking PyPI…"
# Overridable (mirrors BUILD_CMD / AI_DOCS_CMD below) so tests can fake the PyPI
# lookup instead of hitting the real network on every pre-flight-check test.
MCP_PYPI_CHECK_CMD="${MCP_PYPI_CHECK_CMD:-}"
if [ -z "$MCP_PYPI_CHECK_CMD" ]; then
  MCP_PYPI_CHECK_CMD='uvx --no-cache --from ambience-mcp python -c "from ambience_mcp.protocols import PROTOCOLS; print(max(PROTOCOLS))"'
fi
PUBLISHED=$(eval "$MCP_PYPI_CHECK_CMD" 2>/dev/null) || PUBLISHED=""

if [ -z "$PUBLISHED" ]; then
  echo "error: could not determine which MCP protocol the published ambience-mcp speaks." >&2
  echo "  The gate fails CLOSED: an unreachable PyPI must not be read as 'compatible'." >&2
  echo "  (A published ambience-mcp older than the protocols/ package predates this check;" >&2
  echo "   publish an mcp-v* tag first, then retry.)" >&2
  exit 1
fi

if [ "$MCP_PROTOCOL" -gt "$PUBLISHED" ]; then
  echo "error: this release speaks MCP protocol ${MCP_PROTOCOL}, but the published" >&2
  echo "  ambience-mcp only speaks ${PUBLISHED}." >&2
  echo "" >&2
  echo "  Publish the MCP server FIRST (tag mcp-v<version>), or every user on this" >&2
  echo "  release will be told to upgrade ambience-mcp to a version that does not exist." >&2
  exit 1
fi
echo "  published ambience-mcp speaks protocol ${PUBLISHED} ✓"

MANIFEST="custom_components/ambience/manifest.json"
BRANCH="chore/release"

# The release branch has a fixed name, so a leftover one from an aborted or
# undeleted prior release would make `git checkout -b` crash mid-run. Catch it
# here, before the slow build, with a clear message.
if git rev-parse -q --verify "refs/heads/$BRANCH" >/dev/null; then
  echo "error: branch $BRANCH already exists locally; delete it first:" >&2
  echo "  git branch -D $BRANCH" >&2
  exit 1
fi
if remote_ref_exists "refs/heads/$BRANCH"; then
  echo "error: branch $BRANCH already exists on origin; delete it first:" >&2
  echo "  git push origin --delete $BRANCH" >&2
  exit 1
fi

# Optional --no-push flag for tests.
NO_PUSH=false
if [ "${2:-}" = "--no-push" ]; then
  NO_PUSH=true
fi

FRONTEND_DIR="custom_components/ambience/frontend"

# Rebuild the frontend bundle and bail if the committed output is stale. The
# bundle ships inside the integration, so a stale commit would ship stale UI.
# The rebuilt bundle is left in the working tree for the user to inspect/commit.
BUILD_CMD="${BUILD_CMD:-npm run build}"
eval "$BUILD_CMD"
if [ -n "$(git status --porcelain -- "$FRONTEND_DIR")" ]; then
  echo "error: rebuilding the frontend changed the committed bundle in $FRONTEND_DIR" >&2
  echo "  the committed bundle was stale; the freshly built bundle is left in your" >&2
  echo "  working tree — review it, commit it, then retry the release" >&2
  exit 1
fi

# Regenerate the AI knowledge pack and bail if the committed output is stale.
# The pack ships with the integration (and as a plugin/skill an AI consults), so
# a release must never ship authoring docs that lag the code.
AI_DOCS_DIRS="docs/developers/ai-authoring ai/skill"
AI_DOCS_CMD="${AI_DOCS_CMD:-python3 -m bin.gen_ai_docs}"
eval "$AI_DOCS_CMD"
if [ -n "$(git status --porcelain -- $AI_DOCS_DIRS)" ]; then
  echo "error: regenerating the AI knowledge pack changed committed output" >&2
  echo "  the committed AI docs were stale; the freshly generated docs are left in" >&2
  echo "  your working tree — review them, commit them, then retry the release" >&2
  exit 1
fi

git checkout -q -b "$BRANCH"

# From here until the release commit lands, a failure — a bad bump or an
# unpromotable CHANGELOG (no [Unreleased], or a leftover duplicate version
# section) — must not strand a half-prepared chore/release branch. Discard the
# partial work, return to the original branch, and delete the branch so a retry
# starts clean (instead of tripping the "branch already exists" pre-flight).
# Disarmed right after the commit, so a later push/PR failure keeps the
# committed work for a manual retry.
_abort_release() {
  git checkout -q -f "$CURRENT_BRANCH" 2>/dev/null || true
  git branch -qD "$BRANCH" 2>/dev/null || true
}
trap _abort_release ERR

# Bump the version across manifest.json, package.json, and package-lock.json
# (shared with the release workflow's next-minor bump so they can't drift).
"$(dirname "$0")/bump-version.sh" "$VERSION"

# Re-stamp the AI knowledge pack now that the version has bumped — the pack
# records the Ambience version it was built for (so the skill can require a
# matching plugin), so it must be regenerated AFTER the bump and committed below.
eval "$AI_DOCS_CMD"

# Promote the changelog's [Unreleased] section into a dated version section so
# the chore/release commit — and the published Release notes — carry it. Invoked
# by path (not `python -m bin.changelog`) so it resolves regardless of cwd.
python3 "$(dirname "$0")/changelog.py" promote "$VERSION"

git add -A
# --allow-empty supports the "version already bumped in an earlier feature commit"
# workflow: the release branch still gets a clear `chore: release` marker commit.
git commit --allow-empty -qm "chore: release $TAG"
trap - ERR  # the branch now holds committed work — keep it on any later failure

if [ "$NO_PUSH" = "true" ]; then
  echo "Branch $BRANCH prepared. --no-push given; skipping push and PR creation."
  exit 0
fi

# Push the release branch.
git push -u origin "$BRANCH"

# Open the PR.
gh pr create \
  --title "chore: release $TAG" \
  --body "Release \`$TAG\`: bumps the version to \`$VERSION\` (manifest + npm package).

After merge, push the tag to publish the GitHub Release:

\`\`\`
git tag $TAG
git push origin $TAG
\`\`\`
"

echo "Release $TAG branch pushed and PR opened."
