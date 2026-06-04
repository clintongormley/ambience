#!/usr/bin/env bash
# Serve the documentation site locally with live reload during development.
#
# Usage: bin/docs-serve.sh [extra mkdocs args...]
#
# Rebuilds on changes to docs/, mkdocs.yml, and the (Material) theme, and
# live-reloads the browser. Stop with Ctrl-C.

set -euo pipefail

cd "$(dirname "$0")/.."
exec mkdocs serve --verbose --livereload --watch-theme "$@"
