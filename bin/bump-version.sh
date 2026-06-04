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

# package-lock.json carries the root version twice (top-level + packages[""]).
# Restrict the edit to the header block before the first "node_modules/" entry
# so dependency versions are never touched.
sed -i.bak "/\"node_modules\//,\$ ! s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package-lock.json
rm -f package-lock.json.bak
# Verify both root occurrences landed using a JSON-aware read (tolerant of
# formatting), which also confirms we did not corrupt the file.
python3 - "$VERSION" <<'PY'
import json, sys
want = sys.argv[1]
lock = json.load(open("package-lock.json"))
root = lock.get("version")
pkg = lock.get("packages", {}).get("", {}).get("version")
if root != want or pkg != want:
    sys.exit(
        f"error: failed to bump package-lock.json root version "
        f"(top-level={root!r}, packages['']={pkg!r}, want={want!r})"
    )
PY
