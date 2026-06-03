# Contributing to Ambience

## One-time setup

```sh
# Python deps (HA test harness, ruff, coverage)
pip install -e ".[test]"
# Frontend deps
npm install
# Install the local git hooks (mirrors CI)
sh scripts/install-hooks.sh
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
2. **Cheap drift checks:**
   - `make translations` — `strings.json` ↔ `translations/*.json` key parity
   - `make docs-check` — the generated `docs/reference/conditions-and-actions.md`
     is regenerated and unchanged
3. **Tests for the changed language + coverage gates:**
   - Python → `make coverage-py` (pytest + `fail_under` from `pyproject.toml`)
   - Frontend → `make coverage-js` (vitest + thresholds from `vitest.config.ts`)
   - `frontend/src` changed → `make build-check` (rebuilds the bundle and fails
     if the committed output differs — **always commit the rebuilt bundle**)

Bypass in a genuine emergency with `git push --no-verify`.

## Make targets

Every gate is a `make` target so humans, the hook, and CI all run the exact same
command (see `Makefile`). Useful ones:

| Target | What it does |
| --- | --- |
| `make lint-py` / `make lint-js` | Fast lint + format checks |
| `make coverage-py` / `make coverage-js` | Tests with coverage gates |
| `make translations` | Translation key-parity check |
| `make docs-check` | Generated-docs drift check |
| `make build-check` | Rebuild bundle, fail on drift |

## Regenerating artifacts

- **Frontend bundle:** after any `frontend/src` change run `npm run build` and
  commit `custom_components/ambience/frontend/*.js`.
- **Reference docs:** after adding/changing a condition or action run
  `python -m scripts.gen_reference_docs --write` and commit the result.
- **Translations:** `strings.json` is the source of truth; keep
  `translations/en.json` in sync (the translation check enforces parity).

## CI

GitHub Actions runs the same gates plus CodeQL security/quality scanning for
Python and TypeScript. If the pre-push hook passed, CI should too.
