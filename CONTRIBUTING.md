# Contributing to Ambience

## One-time setup

```sh
# Python deps (HA test harness, ruff, coverage)
pip install -e ".[test]"
# Frontend deps
npm install
# Install the local git hooks (mirrors CI)
sh bin/install-hooks.sh
```

`install-hooks.sh` points `core.hooksPath` at the committed `.githooks/`
directory, activating the `pre-push` gate. Run it once per clone **and** once
per `git worktree` (hook config is not shared across worktrees).

## The pre-push gate

Pushing runs `.githooks/pre-push`, which is designed to be lightweight but to
catch almost everything CI would, so a red CI run should be rare. It inspects
the commits you are about to push and runs only what is relevant:

1. **Fast lint/format first** (this is what usually fails CI):
    - Python changed → `make lint-py` (`ruff check` + `ruff format --check`)
    - Frontend `.ts` changed → `make lint-js` (`npm run ci` Biome + `tsc`)
    - Markdown changed → `make lint-md` (`mdformat --check`; the AI knowledge
        pack and generated AI-authoring docs are excluded)
1. **Cheap i18n gates:**
    - `make i18n` — all five i18n checks: key parity, shipped-locale
        completeness, exceptions-key validation, and no-hardcoded lints (Python +
        TypeScript)
1. **Tests for the changed language + coverage gates:**
    - Python → `make coverage-py` (pytest + `fail_under` from `pyproject.toml`)
    - Frontend → `make coverage-js` (vitest + thresholds from `vitest.config.ts`)
    - `frontend/src` changed → `make build-check` (rebuilds the bundle and fails
        if the committed output differs — **always commit the rebuilt bundle**)

Bypass in a genuine emergency with `git push --no-verify`.

## Changelog

User-facing PRs — those titled `feat:`, `fix:`, or `perf:` — must add an entry
under `## [Unreleased]` in `CHANGELOG.md`. Use the Keep a Changelog categories
(`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`).

Non-user-facing PRs (`chore:`, `ci:`, `test:`, `build:`, `refactor:`, `docs:`,
`style:`) are exempt. The `changelog` CI job enforces this from the PR title.
The pre-push hook enforces the same gate locally, but — having no PR title — it
keys off the branch's own commit subjects instead: any commit whose type is not
one of those exempt types (so `feat:`/`fix:`/`perf:`, but also any other
non-exempt or non-conventional subject) requires an entry. The two gates can
diverge in edge cases (e.g. a `feat:`-titled PR whose commits are all `chore:`);
CI's PR-title check is authoritative.

At release time, `bin/release.sh` promotes `[Unreleased]` into a dated version
section, and the release workflow publishes that section as the GitHub Release
notes (falling back to auto-generated notes when there are no user-facing
entries).

## Make targets

Every gate is a `make` target so humans, the hook, and CI all run the exact same
command (see `Makefile`). Useful ones:

| Target                                  | What it does                                                             |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `make lint-py` / `make lint-js`         | Fast lint + format checks                                                |
| `make lint-md` / `make format-md`       | Markdown format check / apply (mdformat)                                 |
| `make coverage-py` / `make coverage-js` | Tests with coverage gates                                                |
| `make i18n`                             | All i18n gates (parity, shipped-locale completeness, no-hardcoded lints) |
| `make translations`                     | Translation key-parity check                                             |
| `make build-check`                      | Rebuild bundle, fail on drift                                            |

## Markdown formatting

Markdown is formatted with [mdformat](https://mdformat.readthedocs.io/). The
toolchain is pinned in the `Makefile` (`mdformat` + the `gfm`, `mkdocs`, and
`frontmatter` plugins) and run via `uvx`, so the only prerequisite is
[`uv`](https://docs.astral.sh/uv/). `make format-md` applies it and
`make lint-md` checks it; both read `.mdformat.toml` (wrap at 80 columns; the
`mkdocs` plugin gives the 4-space list-continuation indent).

The AI knowledge pack (`ai/`) and the generated AI-authoring docs
(`docs/developers/ai-authoring/`) are **excluded** — they're produced and
assembled by `bin/gen_ai_docs.py` and guarded by `make ai-docs-check`, so
formatting them here would fight the generator.

For format-on-save in your editor, point an mdformat extension at a virtualenv
that has those three plugins installed; with `.mdformat.toml` checked in, the
wrap width and exclusions come from the repo automatically.

## Regenerating artifacts

- **Frontend bundle:** after any `frontend/src` change run `npm run build` and
    commit `custom_components/ambience/frontend/*.js`.
- **Translations:** `strings.json` is the source of truth; `en` and `es` are
    shipped locales and must stay complete (the i18n checks enforce parity,
    shipped-locale completeness, that every exceptions key referenced in code
    exists, and that no user-facing string is hardcoded). `es` is
    machine-drafted pending native review.

## CI

GitHub Actions runs the same gates plus CodeQL security/quality scanning for
Python and TypeScript. If the pre-push hook passed, CI should too.

A separate **nightly** workflow (`.github/workflows/nightly.yml`, daily +
`workflow_dispatch`) re-runs the backend tests, frontend build/tests, and
hassfest/HACS validation against the **latest** upstream dependencies (newest
published Home Assistant plus HA `dev` from git, and npm deps resolved without
the lockfile). It is intentionally kept out of PR/push CI so an upstream release
breaking us is an early-warning signal rather than a blocked PR.
