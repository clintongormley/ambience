# Ambience MCP server

A local [MCP](https://modelcontextprotocol.io) server that lets Claude author
and diagnose Ambience scenes **live** against your running Home Assistant. It is
a thin client over Ambience's admin websocket API and writes nothing without a
preview + your confirmation.

## Prerequisites

- An Ambience install reachable over HTTP(S) from wherever Claude runs.
- A **long-lived access token** from an **admin** HA user (Profile → Security →
    Long-lived access tokens). Admin is required — Ambience's config commands
    are admin-only.
- [`uv`](https://docs.astral.sh/uv/) on PATH (one-line install; provides `uvx`).

## Install

**Claude Desktop** — add to `claude_desktop_config.json`, then restart:

```json
{
  "mcpServers": {
    "ambience": {
      "command": "uvx",
      "args": ["ambience-mcp"],
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
  -- uvx ambience-mcp
```

## Multiple Home Assistant instances

Point at more than one install — home plus a test box, say, even on different
Ambience versions — by adding a second entry with its own URL + token. Both stay
available; name the one you mean when you ask Claude, and each serves its own
version's authoring guide automatically.

```json
{
  "mcpServers": {
    "ambience-home": {
      "command": "uvx",
      "args": ["ambience-mcp"],
      "env": { "AMBIENCE_HA_URL": "http://home.local:8123", "AMBIENCE_HA_TOKEN": "<token A>" }
    },
    "ambience-test": {
      "command": "uvx",
      "args": ["ambience-mcp"],
      "env": { "AMBIENCE_HA_URL": "http://test.local:8123", "AMBIENCE_HA_TOKEN": "<token B>" }
    }
  }
}
```

## Compatibility

One build works across Ambience versions — there is nothing to pin. If your
Ambience is **older** than the server supports, it says so and refuses writes
(telling you the version to update to) rather than failing cryptically.

## Turning it off

- **Live, this session:** `/mcp` → select `ambience` → Disconnect (no restart).
- **Remove it:** `claude mcp remove ambience` (Claude Code), or delete the entry
    from `claude_desktop_config.json` and restart (Claude Desktop).

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

______________________________________________________________________

## For contributors & advanced use

### From a checkout

If you have the repo checked out, it ships a **project-scoped** `.mcp.json` at
the repo root that launches the server from the working tree
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
your other projects. First use prompts you to approve the `.mcp.json` server. To
disable it without removing the file, add
`"disabledMcpjsonServers": ["ambience"]` to `.claude/settings.local.json`.

### Pinning a version

You normally never need this — one build spans Ambience versions. When you do:

- **A specific released version:** `uvx ambience-mcp@0.2.0` (args:
    `["ambience-mcp@0.2.0"]`).

- **An unreleased / dev version:** run from a branch or a local checkout so the
    server matches the backend you're building. Use these `args`:

    ```json
    ["--from", "git+https://github.com/clintongormley/ambience.git@my-branch#subdirectory=mcp-server", "ambience-mcp"]
    ```

    or `uvx --from ./mcp-server ambience-mcp` from a worktree.

### Develop

```sh
cd mcp-server
pip install -e '.[test]'
python -m pytest -q
ruff check . && ruff format --check .
```

These tests aren't wired into the repo's pre-push hook / CI yet (only ruff
sweeps the subtree), so run `python -m pytest` here before pushing changes under
`mcp-server/`.
