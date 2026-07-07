# AI-assisted scenes

!!! warning "Beta"

    This feature is new and still evolving — the workflow and the knowledge pack may
    change between releases. Everything an AI produces is **previewed and imported
    by you**; nothing is written to Home Assistant automatically, and every import
    is reversible with undo.

Describe what you want in plain English to an AI (Claude, ChatGPT, …) and let it
write the scenes — conditions *and* actions — for your real entities. Or hand it
a diagnostic and ask **"why didn't my scene fire?"**: it reads the trace,
explains what blocked the scene, and gives you a corrected version.

The AI tab is hidden by default. Enable it in **Settings → Devices & services →
Ambience → Configure → Enable the AI authoring tab (beta)**, then open the
Ambience panel and find it under **Settings → the AI tab**.

## Two ways to author

- **MCP server (recommended)** — Claude authors *live* against your running Home
    Assistant: no download/upload, and it always has your current schema, ids
    and entities. Best if you use **Claude Desktop** or **Claude Code**.
- **Download and paste** — hand a snapshot bundle to *any* AI (Claude, ChatGPT,
    Gemini …) and upload the result. Works with any AI and needs nothing
    installed.

Either way, every change is **previewed and imported by you** — nothing is
written to Home Assistant until you confirm, and every import is reversible with
undo.

### MCP server (live)

Install the server once — no clone and no `git` needed. You need
[`uv`](https://docs.astral.sh/uv/) on PATH and an **admin** long-lived access
token (Profile → Security → Long-lived access tokens). `AMBIENCE_HA_URL` can be
a local address or a **remote HTTPS URL** (Nabu Casa, your own domain) —
anywhere your Home Assistant is reachable from the machine running Claude.

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

**Claude Code** — one command:

```sh
claude mcp add ambience \
  --env AMBIENCE_HA_URL=http://homeassistant.local:8123 \
  --env AMBIENCE_HA_TOKEN=<your admin long-lived token> \
  -- uvx ambience-mcp
```

Then ask Claude to author or fix a scene — it reads your live config, shows a
preview, and you confirm. The authoring guide is served **live from your
install**, so there's no separate pack to install for this path. Multiple
instances, version pinning and other options are in the
[mcp-server README](https://github.com/clintongormley/ambience/blob/stable/mcp-server/README.md).

### Download and paste (any AI)

1. **Install the skill or pack** (see [below](#installing-the-ai-pack)) — once
    per AI. This teaches the AI the Ambience schema and how to read a
    diagnostic.
1. **Download your AI bundle.** In the AI tab, click **Download AI bundle**.
    It's a snapshot of your areas, floors, entities, exposed actions and
    current config — so the AI references *your* real ids, not made-up ones.
    Give the file to the AI along with your request.
1. **Upload the result.** The AI returns a small YAML (or JSON) file. Upload it
    in the AI tab — Ambience **previews** exactly what it will add, update or
    remove (and any new category it will create) before you confirm.

!!! question "Can you do better than the AI?"

    This feature is only as good as the knowledge pack behind it — and **you can
    help make it better**. If the AI gives you bad advice, please
    [open a GitHub issue](https://github.com/clintongormley/ambience/issues/new)
    with:

    - **the AI's suggestion** — the import block it produced,
    - **your corrected version**, and
    - **a short note** on what was wrong and why your version is better.

    Real before/after examples like these are exactly what's used to improve the
    cookbook the AI learns from — so the next person (and the next *you*) gets
    better answers.

## Installing the AI pack

This is for the **download-and-paste** path — the MCP server serves the guide
live from your install, so you don't install a pack for it.

The "AI pack" teaches the AI the Ambience schema and how to read a diagnostic.
Install it in whichever form suits your AI. **Always install the `stable`
version** — it matches the released integration; the `main` branch is unreleased
development and may be incompatible.

### Claude Code

Install the plugin (it bundles the skill and the `/ambience-create` /
`/ambience-fix` commands):

```text
/plugin marketplace add clintongormley/ambience@stable
/plugin install ambience@ambience
```

The `@stable` is important — it pins the pack to the latest release. To get new
versions automatically, enable **auto-update** for the marketplace once:
`/plugin` → **Marketplaces** → `ambience` → enable auto-update.

### claude.ai

Upload the skill folder as a Claude Skill:
[`ai/skill/ambience-author/`](https://github.com/clintongormley/ambience/tree/stable/ai/skill/ambience-author)
(from the `stable` branch). It contains the skill plus its reference docs.

### Any other AI

Paste the single self-contained guide into your AI:
[`ambience-ai-guide.md`](https://github.com/clintongormley/ambience/blob/stable/docs/developers/ai-authoring/ambience-ai-guide.md)
(from the `stable` branch).

!!! tip "Keep the pack in step with Ambience"

    Before authoring, the skill checks that the bundle's Ambience version matches
    the pack. If your installed Ambience is **newer** than the pack, it asks you to
    update the plugin first (so it isn't working from an out-of-date schema) —
    update with `/plugin marketplace update ambience` then re-install, or enable
    auto-update as above.

## Privacy

Both paths read the **same redacted bundle** — a local download you choose when
and to whom to send, or the live read the MCP server makes. Presence and
location data is redacted before it leaves Home Assistant: person and
device-tracker locations, the zones in your traces, your weather/workday
entities, and the rendered output of `people`/`template` conditions. Secrets in
your actions are scrubbed too — alarm/lock codes, and the default values of
sensitive fields such as a notification's message, recipients or push token.

Person *ids and names* do remain, so the AI can write presence conditions that
reference the right people — a household member's name may therefore appear in
the bundle — but their current location does not.

## What it's good at

- **Building a scene group** from a description — e.g. *"in the evening, when
    it's dark in the living room and someone's home, dim the lights and close
    the blinds."*
- **Diagnosing** a scene that didn't fire — it reads the recent traces in your
    bundle, finds the condition that blocked it, and proposes a fix.

The AI never changes Home Assistant directly: it produces a file, you review the
preview, and you import it.
