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

## Version compatibility

There are three version numbers, and only one of them is about compatibility:

| Number                        | Example      | Changes when                                         |
| ----------------------------- | ------------ | ---------------------------------------------------- |
| Ambience (the integration)    | `1.1.0-rc.4` | every Ambience release                               |
| `ambience-mcp` (this package) | `0.2.0rc4`   | every MCP release                                    |
| **MCP protocol**              | **`1`**      | **only when the backend↔MCP contract changes shape** |

On connect, this server asks Ambience which protocol it speaks and loads the
matching adapter. **It ships an adapter for every protocol it supports**, so the
latest `ambience-mcp` still talks to older Ambience installs — which is what
makes the multi-instance setup above work when your two installs are on
different versions.

If the two cannot work together, **every** tool call fails with a message naming
which side to upgrade. It will never tell you to install an *older*
`ambience-mcp`: `uvx` installs the latest, so that would be advice you could not
follow.

- *"Update Ambience"* — your Ambience is older than this server supports. Update
    it in HACS and restart Home Assistant. That is all: the restart drops the
    websocket, the handshake re-runs on the next tool call, and the server heals
    itself — **you do not need to restart the MCP server**.

    You may also see this message for a few seconds *while* Home Assistant is
    starting: Ambience answers the handshake only once it has finished setting
    up, and until then it looks the same as an Ambience that is too old. Ask
    again in a moment — the server re-checks on every call while in this state,
    so it clears itself as soon as Ambience is up.

- *"Upgrade ambience-mcp"* — your Ambience is newer than this server, or is
    refusing this build. **This one does need a restart of the MCP server**, and
    reconnecting alone will not do: the running process *is* the old version, so
    it would only re-handshake its way to the same verdict. Quit your MCP
    client, run `uv cache clean ambience-mcp`, then restart it. The cache clean
    matters too: `uvx` caches the old version, and the running server holds the
    cache lock, so restarting alone will not pick up the new one. And if your
    config [pins a version](#pinning-a-version), remove the pin — a pinned
    version never upgrades, so the cache clean would just reinstall the same
    build.

    If your Ambience is a **pre-release**, that message will also tell you to
    allow pre-releases — see below. It is not optional: without it, `uvx`
    reinstalls the same build every time and the upgrade never happens.

## Testing an Ambience pre-release

**Your `ambience-mcp` channel must match your Ambience channel.**

| Your Ambience                    | The `ambience-mcp` you want         | How you get it        |
| -------------------------------- | ----------------------------------- | --------------------- |
| a **final** release (`1.6.0`)    | the newest **final** `ambience-mcp` | plain `uvx` (default) |
| a **pre-release** (`1.6.0-rc.1`) | the newest **pre-release** or final | `--prerelease=allow`  |

A pre-release Ambience ships with a pre-release `ambience-mcp`, and **`uvx` will
not install one by default**: it skips pre-releases whenever a final release
exists, so it would keep handing you the last stable `ambience-mcp` — which may
be too old for the beta you are testing. You would be told to upgrade, clean the
cache, restart, and land on the same build again.

So if you run an Ambience beta, opt the MCP server into the same channel:

```json
{
  "mcpServers": {
    "ambience": {
      "command": "uvx",
      "args": ["--prerelease=allow", "ambience-mcp"],
      "env": {
        "AMBIENCE_HA_URL": "http://homeassistant.local:8123",
        "AMBIENCE_HA_TOKEN": "<your admin long-lived token>"
      }
    }
  }
}
```

**Claude Code** (terminal, and the VS Code extension) — the same command you
used above, with `--prerelease=allow` added.

Mac and Linux:

```sh
claude mcp add ambience --scope user \
  --env AMBIENCE_HA_URL=http://homeassistant.local:8123 \
  --env AMBIENCE_HA_TOKEN=YOUR_TOKEN \
  -- uvx --prerelease=allow ambience-mcp
```

Windows:

```text
claude mcp add ambience --scope user --env AMBIENCE_HA_URL=http://homeassistant.local:8123 --env AMBIENCE_HA_TOKEN=YOUR_TOKEN -- uvx --prerelease=allow ambience-mcp
```

If you already added `ambience`, remove it first
(`claude mcp remove ambience --scope user`) — re-adding with the same name does
not overwrite the old entry's args.

This is **not** a [pin](#pinning-a-version) — it widens what `uvx` may install
rather than fixing it, so you keep getting the newest build and the upgrade path
still works. When you go back to a final Ambience, drop the flag: leaving it on
would keep you on `ambience-mcp` release candidates you did not ask for.

## Turning it off

- **Live, this session:** `/mcp` → select `ambience` → Disconnect (no restart).
- **Remove it:** `claude mcp remove ambience --scope user` (Claude Code and the
    VS Code extension — pass the scope you added it with), or delete the entry
    from `claude_desktop_config.json` and restart (Claude Desktop).

Tool schemas are deferred (tool-search) on supported models, so an idle server
costs almost nothing per turn.

## Tools

`ambience_get_context`, `ambience_find_entities`, `ambience_get_scope`,
`ambience_get_guide`, `ambience_dry_run`, `ambience_validate`,
`ambience_preview_write`, `ambience_apply_write`, `ambience_list_traces`,
`ambience_list_categories`, `ambience_save_categories`.

`ambience_get_context` carries entity COUNTS, not rows — a real house has
thousands of entities. `ambience_find_entities` is the paged search that returns
real entity ids to author with; nothing is filtered out of the catalog, only
paged.

`ambience_get_guide` fetches the scene-authoring guide (schema + cookbook) live
from your install, so it always matches your Ambience version — no separately
installed guide to keep in sync.

`ambience_dry_run` is always redacted, the same way a trace already is:
presence/location detail and security-action params (lock PINs, alarm codes)
never come back in the result. Against an Ambience too old to redact, the result
carries a visible `notice` instead of the raw values — update Ambience (HACS)
and restart Home Assistant to get redaction there too.

## The write gate

`ambience_apply_write` refuses to commit unless you first call
`ambience_preview_write` for the **exact** scope+scenes and pass back its
`confirm_token`. Every write is a normal scope save — reversible via Ambience
undo/redo.

`ambience_preview_write`'s diff also reports `updating_categories` (an existing
category `new_categories` would overwrite, with before/after) and, when you
resubmit stored scenes without their `priority`/`pinned` fields, an `order_note`
saying evaluation order will be re-derived.

A failed `ambience_apply_write` keeps its `confirm_token` — it is only spent on
a write that actually commits, so once whatever caused the failure is fixed you
retry the same call rather than previewing all over again.

## The result budget

An MCP client caps how much one tool result may return, so every result here is
bounded — at any house size. The budget is **60,000 characters of the wire
payload** (roughly 15k tokens), overridable with
`AMBIENCE_MCP_MAX_RESULT_CHARS`.

"Wire payload" is deliberate: FastMCP pretty-prints a result *and* repeats it as
`structuredContent`, so what the client receives is ~2-3x the compact JSON.
Measuring the compact form would under-count by up to 3x and let an "it fits"
result sail through that the client then rejects.

Nothing is ever **silently** truncated. A result that doesn't fit degrades in a
way that says so, and says how to get the rest:

| Tool                     | Over budget →                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `ambience_find_entities` | fewer rows, `cursor` re-pointed at the first row dropped, `truncated: true` — page on to reach the rest |
| `ambience_list_traces`   | fewer traces + a `notice` saying how many were omitted                                                  |
| `ambience_get_context`   | sheds action *schemas* biggest-first, naming them in `schemas_omitted` (action ids all remain)          |
| `ambience_preview_write` | the diff is **summarised**, not cut — see below                                                         |
| anything else            | `{"error": "result_too_large", ...}` — a small, honest refusal, never a partial payload                 |

### Why a partial result is sometimes worse than none

`ambience_apply_write` **replaces a whole scope** — any scene you leave out is
deleted. So a *truncated* `ambience_get_scope` would be actively dangerous: read
a short scene list, carry it forward, write it back, and the omitted scenes are
gone. It is refused outright instead. Same for anything else with no safe way to
shrink: an honest error beats a payload that quietly lies about what's in the
house.

The two tools that *do* shrink safely — `find_entities` and `list_traces` — are
safe precisely because neither is written back wholesale, and both hand you a
way to reach what was left out.

### `preview_write` summarises its diff

Replacing a full scope lists every scene twice in the diff (once removed, once
added), which busts the budget on a large scope. Truncating that diff would be
unsafe — it is the surface a human approves the write from.

So when it doesn't fit, the scene **bodies** are elided and **every changed
scene is still listed** — by name, category, and (for updates) which fields
changed — with `diff_summarised: true`. A real 21-scene scope replaced wholesale
drops from ~75,000 chars to ~7,700 while still naming all 21 changes. The
`confirm_token` stays usable: you are approving a complete picture of *what*
changes, just not the full body of each. Use `ambience_get_scope` or
`ambience_dry_run` to inspect any one of them in detail.

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

You normally never need this — one build spans Ambience versions.

**A pin opts you out of the upgrade path.** If Ambience ever asks you to
[upgrade `ambience-mcp`](#version-compatibility), a pinned config will keep
reinstalling the pinned build no matter how often you clean the cache or
restart, and every tool call will keep failing. Remove the pin to get out.

When you do want one:

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
