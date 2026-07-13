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

# True (0) when $1 is a bare non-negative integer. Used instead of a direct
# `[ x -gt y ]` comparison wherever $1 might not be a number: that comparison exits 2
# ("integer expression expected") on non-numeric input, and inside an `if` condition
# bash reads ANY nonzero status as false under `set -e` — so a garbled value would
# silently take the "not greater than" branch instead of the refusal this gate exists
# to run. Checking first, with this, keeps the gate failing closed.
_is_uint() {
  case "$1" in
    ''|*[!0-9]*) return 1 ;;
  esac
}

# True (0) when $1 is a comma-joined list of bare non-negative integers ("1" or
# "1,2,3"). The published-protocols probe answers with the FULL list — the gate
# checks membership, not the ceiling: a published package that dropped an old
# adapter must not satisfy a backend still declaring that protocol.
_is_uint_list() {
  case "$1" in
    ''|,*|*,|*,,*) return 1 ;;
  esac
  local part
  local IFS=','
  for part in $1; do
    _is_uint "$part" || return 1
  done
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

# --- Gate 2: never release a backend the published ambience-mcp cannot satisfy ------
# TWO demands, one rule — never ask a user for something they cannot get:
#
#   a) MCP_PROTOCOL must be spoken by the PUBLISHED ambience-mcp.
#   b) MIN_MCP_VERSION must NAME a PUBLISHED ambience-mcp.
#
# "PUBLISHED" means published IN THIS RELEASE'S CHANNEL — the ambience-mcp this
# release's users will actually resolve. See the channel block below.
#
# The coupling is one-directional. A NEW MCP against an OLD backend is fine (it ships
# an adapter for every protocol it supports). A NEW backend against an OLD MCP is a
# DEADLOCK: every user is told "upgrade ambience-mcp" — to a version that does not
# exist yet. `uvx` installs LATEST, so they cannot obey. Fail closed.
#
# (b) is NOT covered by Gate 1: that one holds the floor to the version in THIS REPO's
# mcp-server/pyproject.toml, which the post-release bump routinely runs ahead of PyPI.
# A maintainer who bumps pyproject.toml and raises the floor to match passes Gate 1,
# passes (a) (the protocol never moved, so CONTRIBUTING says no MCP release is needed),
# and ships a backend that refuses EVERY user — pointing them at a package that was
# never published. So the lookup asks PyPI for the published VERSION as well as the
# protocol, and the floor is compared against it.
#
# The constant is extracted by Gate 1's script (`--print-protocol`), not by a second
# `ast` walk of our own: two parsers of the same constant can disagree (this one only
# handled `ast.Assign`, Gate 1 also handles `AnnAssign`), and the one that
# under-reports is the one that lets a deadlock ship. One parser, one answer.
MCP_PROTOCOL=$(python3 "$(dirname "$0")/check_mcp_protocol.py" \
  --print-protocol --const custom_components/ambience/const.py) || {
  echo "error: could not read MCP_PROTOCOL from custom_components/ambience/const.py" >&2
  exit 1
}

# Fail CLOSED on anything that isn't a bare non-negative integer, for the same reason
# the PUBLISHED check below does: inside an `if`, `[ x -gt y ]`'s "integer expression
# expected" status reads as false and would silently skip the refusal.
if ! _is_uint "$MCP_PROTOCOL"; then
  echo "error: MCP_PROTOCOL did not read back as an integer (got: '${MCP_PROTOCOL}')." >&2
  exit 1
fi

# Which ambience-mcp CHANNEL is this release's? Your ambience-mcp channel must match
# your Ambience channel:
#
#   a FINAL Ambience   → the newest FINAL ambience-mcp        (plain `uvx`)
#   a PRE-RELEASE one  → the newest PRE-RELEASE-or-final one  (`uvx --prerelease=allow`)
#
# `uvx --from ambience-mcp` (no specifier) uses uv's default prerelease strategy, which
# EXCLUDES pre-releases whenever a final release exists. So once any final ambience-mcp
# is published, the plain probe below can no longer SEE the rc that a pre-release
# Ambience is paired with: it would resolve the older final, report its protocol, and
# refuse a perfectly legitimate rc release — while the beta tester's own (documented,
# unpinned) `uvx` config resolved that same final and looped forever on "upgrade
# ambience-mcp". A gate must ask about the channel it is actually releasing into.
#
# The pre-release/final question is answered by Gate 1's script, for the same reason the
# protocol is: it owns the repo's one vendored PEP 440 implementation, and a second one
# here (a `case "$VERSION" in *-rc.*`, say) is a parser that can disagree with it. Fails
# CLOSED — a version we cannot classify gets no channel guess.
RELEASE_IS_PRERELEASE=$(python3 "$(dirname "$0")/check_mcp_protocol.py" \
  --is-prerelease "$VERSION") || RELEASE_IS_PRERELEASE=""

case "$RELEASE_IS_PRERELEASE" in
  true)
    MCP_CHANNEL_FLAG="--prerelease=allow"
    MCP_CHANNEL_LABEL="pre-release channel"
    ;;
  false)
    MCP_CHANNEL_FLAG=""
    MCP_CHANNEL_LABEL="final channel"
    ;;
  *)
    echo "error: could not tell whether ${VERSION} is a pre-release or a final release." >&2
    echo "  The gate fails CLOSED: without the channel it cannot ask PyPI the right" >&2
    echo "  question — a pre-release Ambience must be checked against the pre-release" >&2
    echo "  ambience-mcp channel, which a plain \`uvx\` never resolves." >&2
    exit 1
    ;;
esac

echo "→ Gate 2: this release speaks MCP protocol ${MCP_PROTOCOL}; checking PyPI (${MCP_CHANNEL_LABEL})…"
# Overridable (mirrors BUILD_CMD / AI_DOCS_CMD below) so tests can fake the PyPI
# lookup instead of hitting the real network on every pre-flight-check test.
#
# ONE lookup answers both questions — the protocol(s) the published ambience-mcp
# speaks AND its version — on a single line: "<protocols> <version>", where
# <protocols> is a comma-joined list (e.g. "1,2 0.2.0rc3"). One
# `uvx --no-cache` resolution, so the two answers cannot disagree about which release
# they describe, and the cache is still bypassed (a stale `uv` cache is what caused the
# original incident: the gate must ask PyPI, never a cache). The channel flag rides on
# that same resolution, so the VERSION the floor is measured against is the one from the
# channel this release ships into.
MCP_PYPI_CHECK_CMD="${MCP_PYPI_CHECK_CMD:-}"
if [ -n "$MCP_PYPI_CHECK_CMD" ]; then
  # A stale exported override is the same failure class as the stale `uv` cache
  # that prompted this whole gate: it silently disables a fail-closed check.
  # Announce it so an accidental bypass is visible in the release log.
  echo "warning: Gate 2's PyPI lookup is overridden by MCP_PYPI_CHECK_CMD — not asking PyPI" >&2
else
  # Assembled from single-quoted halves so the inner `\"` escapes (which the eval'd
  # `python -c "…"` needs) survive verbatim while $MCP_CHANNEL_FLAG still expands.
  MCP_PYPI_CHECK_CMD='uvx --no-cache '"${MCP_CHANNEL_FLAG:+$MCP_CHANNEL_FLAG }"'--from ambience-mcp python -c "import importlib.metadata as md; from ambience_mcp.protocols import PROTOCOLS; print(\",\".join(str(p) for p in sorted(PROTOCOLS)), md.version(\"ambience-mcp\"))"'
fi
PUBLISHED=$(eval "$MCP_PYPI_CHECK_CMD" 2>/dev/null) || PUBLISHED=""

# Split the reply into its two fields. Anything that is not EXACTLY one line of exactly
# two fields — empty, a multi-line answer (e.g. "0\nnote: deprecated" from a noisy `uv`
# warning), a stray third field — is blanked here, so the fail-closed checks below
# refuse it rather than silently reading a truncated or garbled value.
PUBLISHED_PROTOCOLS=""
PUBLISHED_VERSION=""
PUBLISHED_EXTRA=""
case "$PUBLISHED" in
  *$'\n'*) PUBLISHED="" ;;
esac
read -r PUBLISHED_PROTOCOLS PUBLISHED_VERSION PUBLISHED_EXTRA <<<"$PUBLISHED" || true
if [ -n "$PUBLISHED_EXTRA" ]; then
  PUBLISHED_PROTOCOLS=""
  PUBLISHED_VERSION=""
fi

# Reject a protocol list that isn't a comma-joined list of bare non-negative integers
# BEFORE the membership check below. `[ "$MCP_PROTOCOL" -gt "$PUBLISHED_PROTOCOLS" ]`
# would return exit status 2 ("integer expression expected") on a non-numeric value;
# inside an `if` condition, `set -e` does not fire and bash reads status 2 as false, so
# the refusal branch would be silently skipped and the release would proceed. This
# subsumes the plain-emptiness check: an empty string, whitespace, HTML, or a
# multi-line value are all rejected here, before they ever reach the comparison.
if ! _is_uint_list "$PUBLISHED_PROTOCOLS"; then
  echo "error: could not determine which MCP protocol(s) the published ambience-mcp speaks." >&2
  echo "  (Asked the ${MCP_CHANNEL_LABEL}, because ${VERSION} ships into it.)" >&2
  echo "  The gate fails CLOSED: an unreachable PyPI must not be read as 'compatible'." >&2
  echo "  (Expected one line, '<protocols> <version>' (e.g. \"1\" or \"1,2\"); got: '${PUBLISHED}')" >&2
  echo "  (A published ambience-mcp older than the protocols/ package predates this check;" >&2
  echo "   publish an mcp-v* tag first, then retry.)" >&2
  exit 1
fi

case ",$PUBLISHED_PROTOCOLS," in
  *",$MCP_PROTOCOL,"*)
    : # the published package speaks this release's protocol
    ;;
  *)
    echo "error: this release speaks MCP protocol ${MCP_PROTOCOL}, but the published" >&2
    echo "  ambience-mcp in the ${MCP_CHANNEL_LABEL} (${PUBLISHED_VERSION}) only speaks" >&2
    echo "  {${PUBLISHED_PROTOCOLS}}." >&2
    echo "" >&2
    echo "  Publish the MCP server FIRST (tag mcp-v<version>), or every user on this" >&2
    echo "  release will be told to upgrade ambience-mcp to a version that does not exist." >&2
    echo "" >&2
    echo "  The CHANNEL is part of the rule: ${VERSION} is a ${MCP_CHANNEL_LABEL} release, so" >&2
    echo "  it is measured against the ambience-mcp its users will actually resolve. A FINAL" >&2
    echo "  Ambience needs a FINAL ambience-mcp — an rc does not count, because a plain" >&2
    echo "  \`uvx\` never installs one. See CONTRIBUTING.md." >&2
    exit 1
    ;;
esac
echo "  published ambience-mcp ${PUBLISHED_VERSION} (${MCP_CHANNEL_LABEL}) speaks protocol(s) {${PUBLISHED_PROTOCOLS}} ✓"

# The refusal floor must name a PUBLISHED ambience-mcp — see the header above. The
# PEP 440 comparison is delegated to Gate 1's script (`--check-floor-against`), not
# re-implemented here: two implementations of one ordering is precisely the seam this
# branch already closed once, and a shell `[ x \> y ]` string compare would call
# "0.2.0rc10" OLDER than "0.2.0rc9". It fails CLOSED on a version it cannot parse — an
# empty PUBLISHED_VERSION (a one-field reply) included.
if ! python3 "$(dirname "$0")/check_mcp_protocol.py" \
  --const custom_components/ambience/const.py \
  --check-floor-against "$PUBLISHED_VERSION"; then
  echo "error: MIN_MCP_VERSION does not name a published ambience-mcp (see above)." >&2
  echo "  The gate fails CLOSED: a floor above the newest PUBLISHED ambience-mcp tells" >&2
  echo "  every user, on every tool call, to upgrade to a version that does not exist." >&2
  exit 1
fi

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
