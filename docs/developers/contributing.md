# Contributing

A quick orientation. The full, authoritative guide is
[`CONTRIBUTING.md`](https://github.com/clintongormley/ambience/blob/main/CONTRIBUTING.md)
in the repository root.

## One-time setup

```sh
pip install -e ".[test]"   # Python deps (HA test harness, ruff, coverage)
npm install                # Frontend deps
sh bin/install-hooks.sh    # Local git hooks (mirrors CI)
```

Run `install-hooks.sh` once per clone **and** once per `git worktree` — the hook
config is not shared across worktrees.

## The pre-push gate

`.githooks/pre-push` runs only what's relevant to your changes: fast lint/format
first (`ruff`, Biome + `tsc`, `mdformat`), then the i18n gates, then tests with
coverage for the changed language. If `frontend/src` changed it also rebuilds
the bundle and fails on drift — **always commit the rebuilt bundle**. Bypass in
a genuine emergency with `git push --no-verify`.

## Make targets

Every gate is a `make` target so humans, the hook and CI run the same command:
`make lint-py` / `make lint-js` / `make lint-md`, `make coverage-py` /
`make coverage-js`, `make i18n`, and `make build-check`. See the
[Makefile](https://github.com/clintongormley/ambience/blob/main/Makefile).

## Docs

This site is built with mkdocs from `docs/`. Markdown is formatted with
[mdformat](https://mdformat.readthedocs.io/) (wrap at 80 columns) — run
`make format-md` to apply and `make lint-md` to check. Preview locally with
`mkdocs serve`.
