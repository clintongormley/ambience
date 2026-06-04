#!/bin/sh
# Point git at the committed hooks directory. Run once per clone/worktree.
set -eu
git config core.hooksPath .githooks
chmod +x .githooks/pre-push
echo "Installed: core.hooksPath -> .githooks (pre-push active)."
echo "Bypass in an emergency with: git push --no-verify"
