# Claude Code Instructions

## Git Workflow

- **NEVER commit directly to main** — always create a feature branch first.
- **Branch naming**: descriptive (e.g. `feat/initial-config-flow`, `fix/setup-crash`). Never include version numbers in branch names — HACS scans all branches and complains about non-compliant ones, even after deletion.
- Do NOT merge PRs automatically — wait for user approval.
- When merging a PR (after approval), delete the feature branch.

## Code Quality

- Before creating a PR, run `ruff check .` and `ruff format .` to fix any linting issues.
- Before creating a release, update docs, translations, and tests.
- The `manifest.json` keys must be sorted: `domain`, `name` first, then all remaining keys in alphabetical order.

## Integration Layout

- Component lives in `custom_components/ambience/`.
- Domain: `ambience`. Alias in `~/workspace/tools/worktree.py`: `amb`.
- Main HA dev container: `ha-amb-main` (start with `ha-wt amb-main`).
- Feature worktrees: `/new-worktree amb <branch>`.
