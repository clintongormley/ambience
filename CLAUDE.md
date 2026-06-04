# Claude Code Instructions

## Git Workflow

- **NEVER commit directly to main** — always create a feature branch first.
- **Branch naming**: descriptive (e.g. `feat/initial-config-flow`, `fix/setup-crash`). Never include version numbers in branch names — HACS scans all branches and complains about non-compliant ones, even after deletion.
- Do NOT merge PRs automatically — wait for user approval.
- When merging a PR (after approval), delete the feature branch.

## Code Quality

- Run `sh bin/install-hooks.sh` once per clone/worktree. The committed `.githooks/pre-push` mirrors CI: fast lint/format first, then tests for the changed language, plus coverage/translation/docs-drift gates. Bypass in an emergency with `git push --no-verify`. See `CONTRIBUTING.md`.
- Before creating a PR, run `ruff check .` and `ruff format .` (Python) and `npm run ci` (frontend Biome lint+format) to fix any issues — or just let the pre-push hook run them.
- Before creating a release, update docs, translations, and tests.
- The `manifest.json` keys must be sorted: `domain`, `name` first, then all remaining keys in alphabetical order.

## Integration Layout

- Component lives in `custom_components/ambience/`.
- Domain: `ambience`. Alias in `~/workspace/tools/worktree.py`: `amb`.
- Main HA dev container: `ha-amb-main` (start with `ha-wt amb-main`).
- Feature worktrees: `/new-worktree amb <branch>`.
