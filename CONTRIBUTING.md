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

Releases follow a **cut → soak → flip** flow:

1. **Cut.** `bin/release.sh <version>` opens the `chore/release` PR; merge it
    and push the `v<version>` tag. The release workflow publishes the release
    as a **prerelease** (never "latest") and rolls `main` forward to the next
    minor.
1. **Soak.** The prerelease is installable by HACS users who opt into betas, so
    you can check it live without affecting default installs.
1. **Flip.** When you're happy, promote the release to **latest** with:
    `gh release edit v<version> --prerelease=false --latest=true`. That single
    action advances the `stable` branch (the AI knowledge pack) and deploys the
    docs — which then reflect that release and show its version in the navbar.
    Default HACS users get it at the same moment. **Use the `gh` CLI rather
    than the GitHub web UI "Set as latest" checkbox** — the checkbox may not
    emit the `released` event the `promote`/`docs` workflows trigger on, so the
    flip could silently fail to advance `stable` or deploy the docs.

A manual `workflow_dispatch` on the **docs** workflow can redeploy the docs for
a chosen tag (or the current latest) if you ever need to reseed the site.

### Releasing a protocol bump

`MCP_PROTOCOL` (in `custom_components/ambience/const.py`) is the backend↔MCP
contract. It is **not** either semver, and it bumps only when the contract
changes shape.

**When it bumps, publish the MCP server first.** The coupling is
one-directional:

- A **new MCP** against an **old backend** is fine — it ships a frozen adapter
    for every protocol it supports and loads the one the backend asks for.
- A **new backend** against an **old MCP** is a deadlock: users are told
    "upgrade ambience-mcp", and `uvx` installs latest — which does not speak the
    new protocol yet.

So: tag `mcp-v<version>` and let it publish, **then** run `bin/release.sh`. The
release script enforces this (it asks PyPI what the published MCP speaks and
refuses to go first), and fails closed if PyPI cannot be reached.

Ambience releases that do **not** bump `MCP_PROTOCOL` need no MCP release at
all.

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

## Working on the MCP server

The repo ships a project-scoped `ambience-dev` MCP server (`.mcp.json`) that
points your editor's AI at the worktree's own Home Assistant container, so you
can drive the real tools while developing. A few things about the reload path
routinely make a correct change look broken:

- **The MCP server is spawned by your editor, not by you.** `.mcp.json` runs
    `uvx --from ./mcp-server ambience-mcp` from the **editor's** process, so
    editing `mcp-server/src/…` changes nothing until you **fully quit and reopen
    the editor**. In VS Code a *window reload is not enough* — it reuses the
    same extension host. To check a change without restarting, exercise the
    module directly (`cd mcp-server && uv run python -c '…'`) rather than
    calling the MCP tool.
- **`.mcp.json`'s `${…}` env vars are read from the editor's environment.** They
    are resolved when the editor launches, not from a fresh login shell, so
    adding or renaming an export in `~/.zshrc` also needs a **full editor
    restart**. Until then the server receives the literal unexpanded string and
    fails with `AMBIENCE_HA_URL must start with http:// or https:// (got '${…}')`.
- **A regenerated guide looks stale over MCP.** The server caches the authoring
    guide keyed on the install's `ambience_version`, which does **not** change
    when you run `make ai-docs` — so `ambience_get_guide` keeps serving the copy
    it already holds until the server restarts. Harmless for users (their guide
    only changes when they upgrade Ambience, which does bump the version), but
    in the dev loop, restart the editor after regenerating the guide.
- **The backend needs only a container restart.** The worktree's
    `custom_components/` is bind-mounted into its HA container, so
    `docker restart ha-amb-<branch>` picks up backend changes with no rebuild.
    HA answers on `:8123` within a few seconds but Ambience's entities take ~25s
    more — poll for `switch.house_ambience` rather than guessing a sleep.

## CI

GitHub Actions runs the same gates plus CodeQL security/quality scanning for
Python and TypeScript. If the pre-push hook passed, CI should too.

A separate **nightly** workflow (`.github/workflows/nightly.yml`, daily +
`workflow_dispatch`) re-runs the backend tests, frontend build/tests, and
hassfest/HACS validation against the **latest** upstream dependencies (newest
published Home Assistant plus HA `dev` from git, and npm deps resolved without
the lockfile). It is intentionally kept out of PR/push CI so an upstream release
breaking us is an early-warning signal rather than a blocked PR.
