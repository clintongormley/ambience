# AI-assisted scenes

!!! warning "Beta"
    This feature is new and still evolving — the workflow and the knowledge pack
    may change between releases. Everything an AI produces is **previewed and
    imported by you**; nothing is written to Home Assistant automatically, and
    every import is reversible with undo.

Describe what you want in plain English to an AI (Claude, ChatGPT, …) and let it
write the scenes — conditions *and* actions — for your real entities. Or hand it a
diagnostic and ask **"why didn't my scene fire?"**: it reads the trace, explains
what blocked the scene, and gives you a corrected version.

Open it from the Ambience panel → **Settings → the AI tab**.

## How it works — three steps

1. **Install the skill or plugin.** This teaches the AI the Ambience schema and how
   to read a diagnostic. Pick the form that fits your AI:
    - **Claude Code** — install the plugin (one command).
    - **claude.ai** — install the skill.
    - **Any other AI** — paste the portable guide.

    See the [install &amp; usage guide](https://github.com/clintongormley/ambience/blob/main/ai/README.md)
    for the exact steps.

2. **Download your AI bundle.** In the AI tab, click **Download AI bundle**. It's a
   snapshot of your areas, floors, entities, exposed actions and current config —
   so the AI references *your* real ids, not made-up ones. Give the file to the AI
   along with your request.

3. **Upload the result.** The AI returns a small YAML (or JSON) file. Upload it in
   the AI tab — Ambience **previews** exactly what it will add, update or remove
   (and any new category it will create) before you confirm.

## Privacy

The AI bundle is a **local download** — you choose when and to whom to send it.
Presence and location data is redacted before it leaves Home Assistant: person and
device-tracker locations, the zones in your traces, your weather/workday entities,
and the rendered output of `people`/`template` conditions. Person *ids* remain so
the AI can still write presence conditions, but their current location does not.

## Keeping the pack in step with Ambience

The knowledge pack is versioned together with the integration. Before authoring,
the skill checks that the bundle's Ambience version matches the pack — if your
installed Ambience is **newer** than the pack, it asks you to update the plugin
first (so it isn't working from an out-of-date schema). To avoid doing this each
release, enable **auto-update** for the plugin marketplace once; new versions then
arrive automatically. The exact commands are in the
[install &amp; usage guide](https://github.com/clintongormley/ambience/blob/main/ai/README.md).

## What it's good at

- **Building a scene group** from a description — e.g. *"in the evening, when it's
  dark in the living room and someone's home, dim the lights and close the
  blinds."*
- **Diagnosing** a scene that didn't fire — it reads the recent traces in your
  bundle, finds the condition that blocked it, and proposes a fix.

The AI never changes Home Assistant directly: it produces a file, you review the
preview, and you import it.
