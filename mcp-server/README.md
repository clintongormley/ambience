# Ambience MCP server

A local [MCP](https://modelcontextprotocol.io) server that lets Claude author
and diagnose Ambience scenes **live** against your running Home Assistant. It is
a thin client over Ambience's admin websocket API and writes nothing without a
preview and your confirmation.

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

**Claude Code** (terminal, and the VS Code extension) — one command, with your
own address and token.

Mac and Linux:

```sh
claude mcp add ambience --scope user \
  --env AMBIENCE_HA_URL=http://homeassistant.local:8123 \
  --env AMBIENCE_HA_TOKEN=YOUR_TOKEN \
  -- uvx ambience-mcp
```

Windows:

```text
claude mcp add ambience --scope user --env AMBIENCE_HA_URL=http://homeassistant.local:8123 --env AMBIENCE_HA_TOKEN=YOUR_TOKEN -- uvx ambience-mcp
```

It confirms where it saved the server, with a line like this.

On Linux:

```text
File modified: /home/your_home_dir/.claude.json
```

On Mac:

```text
File modified: /Users/your_home_dir/.claude.json
```

On Windows:

```text
File modified: C:\Users\your_home_dir\.claude.json
```

## Check that it is running

Open a **new** Claude Code conversation — a running session does not pick up the
change. Nothing further is needed for VS Code: the extension reads the same
`~/.claude.json`, so a user-scoped server is available there too.

Run `/mcp` to see the server and whether it connected. It works the same in
Claude Code in a terminal and in VS Code.

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

If your Ambience is **older** than the server supports, it will refuse to write
changes and will tell you how to update to the correct version.

## Turning it off

- **Live, this session:** `/mcp` → select `ambience` → Disconnect (no restart).
- **Remove it:** `claude mcp remove ambience --scope user` (Claude Code and the
    VS Code extension — pass the scope you added it with), or delete the entry
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
the repo root defining a second server, **`ambience-dev`**, which launches from
the working tree (`uvx --from ./mcp-server ambience-mcp`) rather than from PyPI.
It takes its address and token from **`AMBIENCE_DEV_HA_URL`** and
**`AMBIENCE_DEV_HA_TOKEN`** — set them in git-ignored
`.claude/settings.local.json` (or your shell) so no secret is committed:

```json
{
  "env": {
    "AMBIENCE_DEV_HA_URL": "http://homeassistant.local:8123",
    "AMBIENCE_DEV_HA_TOKEN": "<your admin long-lived token>"
  }
}
```

The `_DEV_` prefix keeps the two servers' settings from being mistaken for one
another. Inside `.mcp.json` those values are handed to the server under the
names it actually reads, which never change:

```json
"env": {
  "AMBIENCE_HA_URL": "${AMBIENCE_DEV_HA_URL}",
  "AMBIENCE_HA_TOKEN": "${AMBIENCE_DEV_HA_TOKEN}"
}
```

Because `.mcp.json` always sets those two keys, they shadow any `AMBIENCE_HA_*`
exported in your shell — `ambience-dev` can never quietly borrow the released
server's Home Assistant. If a `AMBIENCE_DEV_*` variable is missing, the
unexpanded `${…}` text reaches the server and it fails naming the variable,
rather than falling back to something that looks like it works.

The `${VAR}` references are expanded by Claude Code, not by your shell, so the
file works unchanged on Windows; the settings file above is the portable way to
supply the values.

It is named `ambience-dev`, not `ambience`, so it sits **alongside** any
user-scoped `ambience` you have rather than hiding it — a project server takes
the name for the whole directory, even while disabled, so a same-named one would
leave you unable to reach the released build at all. The distinct name also
makes each call attributable: you can see `mcp__ambience-dev__…` in the
transcript and know which build ran.

Both expose the same write-capable tools against the same Home Assistant, so
**keep exactly one enabled at a time** — normally `ambience-dev` while you are
working on the server. Toggle them with `/mcp`.

This config is active only inside an Ambience worktree, so it never loads in
your other projects. First use prompts you to approve the `.mcp.json` server. To
disable it without removing the file, add
`"disabledMcpjsonServers": ["ambience-dev"]` to `.claude/settings.local.json`.

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

These tests run in CI and in the pre-push hook whenever you change anything
under `mcp-server/` (via `make mcp-tests`, which runs them in an isolated
environment with `uv`, so no manual setup is needed).
