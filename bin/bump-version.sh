#!/usr/bin/env bash
# Bumps the integration version across every version-carrying file, verified.
#
# Single source of truth for the version bump, shared by bin/release.sh (local
# release prep) and .github/workflows/release.yml (post-release next-minor PR),
# so the two can never drift.
#
# Usage: bin/bump-version.sh <version>          bump all files to <version>
#        bin/bump-version.sh --validate <version>   semver-check only, no writes
#
# Operates on the current working directory's repo (relative paths), so callers
# must invoke it from the repo root.
#
# Files bumped:
#   - custom_components/ambience/manifest.json   (the HA/HACS version of record)
#   - package.json                               (npm panel ships with the integration)
#   - package-lock.json                          (root version: top-level + packages[""])
#   - pyproject.toml                             ([project] version)
#
# Every write is verified; an edit that fails to land is a hard error rather
# than a silently stale version.

set -euo pipefail

SEMVER_RE='^[0-9]+\.[0-9]+\.[0-9]+(-(alpha|beta|rc)\.[0-9]+)?$'

validate() {
  local v="${1:-}"
  if ! [[ "$v" =~ $SEMVER_RE ]]; then
    echo "error: not a valid semver version: $v" >&2
    echo "expected format: MAJOR.MINOR.PATCH or MAJOR.MINOR.PATCH-(alpha|beta|rc).N" >&2
    exit 1
  fi
}

require_file() {
  if [ ! -f "$1" ]; then
    echo "error: expected version file not found: $1" >&2
    exit 1
  fi
}

if [ "${1:-}" = "--validate" ]; then
  validate "${2:-}"
  exit 0
fi

if [ $# -lt 1 ]; then
  echo "usage: $0 <version> | --validate <version>" >&2
  exit 2
fi

VERSION="$1"
validate "$VERSION"

MANIFEST="custom_components/ambience/manifest.json"
require_file "$MANIFEST"
require_file package.json
require_file package-lock.json
require_file pyproject.toml

# manifest.json and package.json each carry the version exactly once. Use sed
# (not a JSON reserialiser) so manifest's required key order is preserved.
sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MANIFEST"
rm -f "$MANIFEST.bak"
grep -q "\"version\": \"$VERSION\"" "$MANIFEST" \
  || { echo "error: failed to bump version in $MANIFEST" >&2; exit 1; }

sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json
rm -f package.json.bak
grep -q "\"version\": \"$VERSION\"" package.json \
  || { echo "error: failed to bump version in package.json" >&2; exit 1; }

# pyproject's [project] version (never published, but a stale number misleads).
sed -i.bak "s/^version = \"[^\"]*\"/version = \"$VERSION\"/" pyproject.toml
rm -f pyproject.toml.bak
grep -q "^version = \"$VERSION\"" pyproject.toml \
  || { echo "error: failed to bump version in pyproject.toml" >&2; exit 1; }

# The Claude plugin's version (.claude-plugin/plugin.json) tracks the integration
# version so a `/plugin marketplace update` actually pulls the refreshed knowledge
# pack each release. Optional — absent on older checkouts, so skip rather than fail.
PLUGIN=".claude-plugin/plugin.json"
if [ -f "$PLUGIN" ]; then
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$PLUGIN"
  rm -f "$PLUGIN.bak"
  grep -q "\"version\": \"$VERSION\"" "$PLUGIN" \
    || { echo "error: failed to bump version in $PLUGIN" >&2; exit 1; }
fi

# package-lock.json carries the root version twice (top-level + packages[""]).
# Restrict the edit to the header block before the first "node_modules/" entry
# so dependency versions are never touched.
sed -i.bak "/\"node_modules\//,\$ ! s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package-lock.json
rm -f package-lock.json.bak
# Verify the bump landed: count the bumped version entries in the header block
# (before the first "node_modules/" entry) — there must be at least the two
# root occurrences (top-level + packages[""]). Uses awk/grep (no Python
# subprocess: a python3 child here gets coverage-instrumented under pytest-cov
# and corrupts the combined coverage data).
ROOT_BUMPED=$(
  awk '/"node_modules\//{exit} {print}' package-lock.json \
    | grep -cF "\"version\": \"$VERSION\"" || true
)
if [ "$ROOT_BUMPED" -lt 2 ]; then
  echo "error: failed to bump package-lock.json root version" >&2
  echo "  expected >=2 root \"version\": \"$VERSION\" entries, found $ROOT_BUMPED" >&2
  exit 1
fi
