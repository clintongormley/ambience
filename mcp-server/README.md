# Ambience MCP server

A local [MCP](https://modelcontextprotocol.io) server that lets Claude author
and diagnose Ambience scenes **live** against your running Home Assistant — no
download/upload of the AI bundle. It is a thin client over Ambience's existing
admin websocket API; it adds no backend code and writes nothing without a
preview + your confirmation.

## Prerequisites

- An Ambience install reachable over HTTP(S).
- A **long-lived access token** from an **admin** HA user (Profile → Security →
    Long-lived access tokens).
- [`uv`](https://docs.astral.sh/uv/) on PATH (the default launcher), or a Python
    3.11+ environment for the `python -m` fallback.

## Configure

The repo ships a project-scoped `.mcp.json`. It reads two env vars — set them in
git-ignored `.claude/settings.local.json` (or your shell) so no secret is
committed:

```json
{
  "env": {
    "AMBIENCE_HA_URL": "http://homeassistant.local:8123",
    "AMBIENCE_HA_TOKEN": "<your admin long-lived token>"
  }
}
```

First use in a project prompts you to approve the `.mcp.json` server. Then
`/mcp` shows it connected with its tools.

**Fallback launcher** (no `uv`): `pip install -e ./mcp-server`, then set the
`.mcp.json` command to your interpreter:
`"command": "python", "args": ["-m", "ambience_mcp"]`.

## Turning it off

The server only loads in **this project** — it is absent in every other project.
To disable it here without deleting config:

- **Live, this session:** `/mcp` → select `ambience` → Disconnect.
- **Persistently:** add `"disabledMcpjsonServers": ["ambience"]` to
    `.claude/settings.local.json`.

Tool schemas are deferred (tool-search) on supported models, so an idle server
costs almost nothing per turn.

## Tools

`ambience_get_context`, `ambience_get_scope`, `ambience_dry_run`,
`ambience_validate`, `ambience_preview_write`, `ambience_apply_write`,
`ambience_list_traces`, `ambience_list_categories`, `ambience_save_categories`.

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
