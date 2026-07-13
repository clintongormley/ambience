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

Ambience releases that do **not** bump `MCP_PROTOCOL` need no MCP release at all
— **unless they raise `MIN_MCP_VERSION`**, which is coupled to an MCP release in
exactly the same way (see below).

### The release channel: cut the pair in the same one

**An Ambience release is checked against the `ambience-mcp` its own users will
resolve** — and which one that is depends on the channel:

- a **final** Ambience → the newest **final** `ambience-mcp` (plain `uvx`, which
    is what a stable user runs)
- a **pre-release** Ambience → the newest **pre-release-or-final**
    `ambience-mcp` (`uvx --prerelease=allow`, which is what a beta tester runs —
    see the MCP server's README)

This is not a preference: `uvx --from ambience-mcp` uses uv's default prerelease
strategy, which **excludes pre-releases whenever a final release exists**. So an
rc `ambience-mcp` is simply not installable without the flag, and measuring a
release against an `ambience-mcp` from the wrong channel means measuring it
against a package its users cannot get. Gate 2 asks PyPI in the channel matching
the version being cut, and says in the release log which one it asked.

**Cutting an rc pair** (say Ambience `1.6.0-rc.1` with a protocol bump):

1. Bump `MCP_PROTOCOL` in `custom_components/ambience/const.py`.
1. Write the new frozen adapter, `mcp-server/src/ambience_mcp/protocols/vN.py`,
    and register it in `PROTOCOLS`.
1. Re-record the shape golden (`mcp-server/tests/`), so the new adapter's wire
    shape is pinned.
1. Bump `mcp-server/pyproject.toml` to the matching MCP rc (e.g. `1.1.0rc1`).
1. Tag `mcp-v1.1.0-rc.1` and let the workflow publish it to PyPI.
1. Run `bin/release.sh 1.6.0-rc.1`. Gate 2 probes the **pre-release** channel,
    sees the rc that speaks the new protocol, and lets the release through.

Then, when the beta soaks clean and you want to go final: publish a **final**
`ambience-mcp` (tag `mcp-v1.1.0`) **before** `bin/release.sh 1.6.0`. Gate 2 now
probes the **final** channel, where the rc does not count — and that is correct,
not an obstacle to route around: a stable user's plain `uvx` cannot install an
rc either, so shipping the final backend first would tell every one of them to
upgrade to something they cannot get.

### `MIN_MCP_VERSION` — the refusal floor

`MIN_MCP_VERSION` (also in `const.py`) is the **oldest `ambience-mcp` this
backend will serve**. It is the one thing `MCP_PROTOCOL` cannot express: *"that
build handshakes fine, but it is known-broken — refuse it"*. A protocol number
can only say the contract changed shape; this singles out a bad release of an
unchanged one.

It can only refuse a client that **asks**. The floor is read during the
`ambience/mcp/hello` handshake, so it binds every **future** `ambience-mcp`
(they all handshake) and cannot touch a **pre-handshake** one — an old client
never sends the hello, it just calls `ambience/ai_context` directly. That is why
the current value is inert: `mcp-v0.2.0-rc.3` is already published, and is the
**last pre-handshake** release (no `protocols/` package, never sends the hello)
— not the first one that speaks it. The floor names a version **below** the
first handshake-capable release (whatever version this backend's own release
actually publishes), which is the lowest value that refuses nobody: any client
able to read the floor already handshook successfully, so it is, by
construction, running something newer than this. A floor is a refusal, and there
is nothing to refuse yet.

It is also the **strongest** refusal the backend can issue — the MCP checks it
first, ahead of the protocol question — so it carries the strongest rule:

> **It may never name an `ambience-mcp` that is not published yet.**

`uvx` installs *latest*. A floor above the newest **published** `ambience-mcp`
tells **every** user, on **every** tool call, to upgrade to a version that does
not exist. It is a one-line edit with no adapter to write and no shape to
re-record, which makes it the easiest of all these levers to pull by mistake —
so two gates hold it:

- `bin/check_mcp_protocol.py` (Gate 1, `make mcp-gate`, runs on every push)
    refuses a floor newer than the `ambience-mcp` **in this repo**. That makes
    the floor *shippable* — but the repo version routinely runs ahead of PyPI
    (the post-release bump), so it does not yet make it *installable*.
- `bin/release.sh` (Gate 2) asks PyPI for the **published** `ambience-mcp` — its
    protocol(s) *and* its version — and refuses the release unless the published
    package's protocol list **includes** the backend's protocol (membership, not
    a ceiling: a published package that dropped an old adapter is refused too),
    **or** if `MIN_MCP_VERSION` names something newer than it. It asks in the
    channel the release ships into (see above), so the floor is held to the
    `ambience-mcp` this release's users can actually install. It fails closed if
    PyPI cannot be reached or its answer cannot be read.

To raise it: bump `mcp-server/pyproject.toml`, tag `mcp-v<version>`, **let it
publish** — then raise `MIN_MCP_VERSION` to it and release Ambience. Same order
as a protocol bump, for the same reason. And the same channel rule: a floor
naming an rc `ambience-mcp` is releasable in an Ambience rc, but not in a final
release — a stable user's `uvx` would never install its way above it.

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
| `make mcp-gate`                         | Gate 1: `MCP_PROTOCOL` has an adapter, `MIN_MCP_VERSION` is installable  |
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
