# Ambience MCP server

A local [MCP](https://modelcontextprotocol.io) server that lets Claude author
and diagnose Ambience scenes **live** against your running Home Assistant — no
download/upload of the AI bundle, and the authoring guide is served straight
from your install so it always matches your version. It is a thin client over
Ambience's admin websocket API and writes nothing without a preview + your
confirmation.

You do **not** need to check out this repository to use it — `uvx` runs it
straight from GitHub (see below).

## Prerequisites

- An Ambience install reachable over HTTP(S) from wherever Claude runs.
- A **long-lived access token** from an **admin** HA user (Profile → Security →
    Long-lived access tokens). Admin is required — Ambience's config commands
    are admin-only.
- [`uv`](https://docs.astral.sh/uv/) on PATH (one-line install; provides `uvx`).

## Install (no checkout needed)

`uvx` fetches, builds, and runs the server from GitHub on demand — nothing to
clone or `pip install`. Point your MCP client at it and pass your HA URL + token
as env vars.

**Claude Desktop** — add to `claude_desktop_config.json`, then restart:

```json
{
  "mcpServers": {
    "ambience": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/clintongormley/ambience.git#subdirectory=mcp-server",
        "ambience-mcp"
      ],
      "env": {
        "AMBIENCE_HA_URL": "http://homeassistant.local:8123",
        "AMBIENCE_HA_TOKEN": "<your admin long-lived token>"
      }
    }
  }
}
```

**Claude Code** — one command (stores it in your user config):

```sh
claude mcp add ambience \
  --env AMBIENCE_HA_URL=http://homeassistant.local:8123 \
  --env AMBIENCE_HA_TOKEN=<your admin long-lived token> \
  -- uvx --from "git+https://github.com/clintongormley/ambience.git#subdirectory=mcp-server" ambience-mcp
```

> A PyPI release is planned so this shortens to `uvx ambience-mcp` (no git URL).

## From a checkout (contributors)

If you *do* have the repo checked out, it also ships a **project-scoped**
`.mcp.json` at the repo root that launches the server from the working tree
(`uvx --from ./mcp-server ambience-mcp`). It reads the same two env vars — set
them in git-ignored `.claude/settings.local.json` (or your shell) so no secret
is committed:

```json
{
  "env": {
    "AMBIENCE_HA_URL": "http://homeassistant.local:8123",
    "AMBIENCE_HA_TOKEN": "<your admin long-lived token>"
  }
}
```

This config is active only inside an Ambience worktree, so it never loads in
your other projects. First use prompts you to approve the `.mcp.json` server.

## Multiple installs, or a specific version

The server is a thin transport, so one build works across Ambience versions —
you rarely pin anything. When you do:

- **Two Home Assistant instances** (e.g. home + a test box, even on different
    Ambience versions): add a second entry with its own URL + token. Both stay
    available; name the one you mean when you ask Claude, and each serves its
    own version's authoring guide automatically.

    ```json
    {
      "mcpServers": {
        "ambience-home": {
          "command": "uvx",
          "args": ["--from", "git+https://github.com/clintongormley/ambience.git#subdirectory=mcp-server", "ambience-mcp"],
          "env": { "AMBIENCE_HA_URL": "http://home.local:8123", "AMBIENCE_HA_TOKEN": "<token A>" }
        },
        "ambience-test": {
          "command": "uvx",
          "args": ["--from", "git+https://github.com/clintongormley/ambience.git#subdirectory=mcp-server", "ambience-mcp"],
          "env": { "AMBIENCE_HA_URL": "http://test.local:8123", "AMBIENCE_HA_TOKEN": "<token B>" }
        }
      }
    }
    ```

- **A specific released version:** pin a tag in the `--from` URL —
    `git+https://github.com/clintongormley/ambience.git@v1.2.0#subdirectory=mcp-server`.

- **An unreleased / dev version:** point at the branch, or a local checkout, so
    the server matches the backend you're building —
    `git+…@my-branch#subdirectory=mcp-server`, or `--from ./mcp-server` from a
    worktree (the committed `.mcp.json` already does this).

## Turning it off

- **Live, this session:** `/mcp` → select `ambience` → Disconnect (no restart).
- **Remove it:** `claude mcp remove ambience` (Claude Code), or delete the entry
    from `claude_desktop_config.json` and restart (Claude Desktop).
- **Keep the config but disable a project-scoped `.mcp.json`:** add
    `"disabledMcpjsonServers": ["ambience"]` to `.claude/settings.local.json`.

Tool schemas are deferred (tool-search) on supported models, so an idle server
costs almost nothing per turn.

## Tools

`ambience_get_context`, `ambience_get_scope`, `ambience_get_guide`,
`ambience_dry_run`, `ambience_validate`, `ambience_preview_write`,
`ambience_apply_write`, `ambience_list_traces`, `ambience_list_categories`,
`ambience_save_categories`.

`ambience_get_guide` fetches the scene-authoring guide (schema + cookbook) live
from your install, so it always matches your Ambience version — no separately
installed guide to keep in sync.

## The write gate

`ambience_apply_write` refuses to commit unless you first call
`ambience_preview_write` for the **exact** scope+scenes and pass back its
`confirm_token`. Every write is a normal scope save — reversible via Ambience
undo/redo.

## Develop

```sh
cd mcp-server
pip install -e '.[test]'
python -m pytest -q
ruff check . && ruff format --check .
```

## Not in v1 (follow-ups)

- **PyPI release** so the install shortens to `uvx ambience-mcp` (no git URL).
- **`ambience_simulate`** (the what-if simulator over `ambience/simulate`) is
    not included yet — the author → dry-run → preview → apply loop is complete
    without it. Deferred as a read-only diagnostic that needs its own payload
    schema.
- **Preview staleness:** the confirm-token binds the exact scope + scenes, not a
    snapshot of live state. If the scope changes between
    `ambience_preview_write` and `ambience_apply_write` (a panel edit, a
    reapply, another session), the write overwrites that change — reversible via
    Ambience undo. `ambience_dry_run` is the authoritative behavioural preview.
- **Test gating:** these tests aren't yet wired into the repo's pre-push hook /
    CI (only ruff sweeps the subtree). Run `python -m pytest` here before
    pushing changes under `mcp-server/`.
