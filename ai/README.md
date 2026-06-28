# Ambience AI knowledge pack

This directory packages everything an AI needs to **author** and **diagnose**
Ambience (Home Assistant) scene configuration, in three install forms:

- a **Claude Code plugin** (one command to install — bundles the skill + slash
  commands),
- a **Claude Skill** (for claude.ai — upload the skill folder),
- a **portable doc** (for any AI — ChatGPT, Gemini, etc. — paste one file).

All three are built from one canonical source in
[`docs/developers/ai-authoring/`](../docs/developers/ai-authoring/) (schema,
conditions cookbook, actions, diagnostics guide, import format, examples). The
code-derived parts (`*.generated.md`) and the portable doc are regenerated on
every release, so the pack never drifts from the integration.

Whichever form you use, the workflow is the same:

1. Enable the AI tab first — it's off by default (Settings → Devices & services →
   Ambience → Configure → **Enable the AI authoring tab**). Then, in the Ambience
   panel, open Settings → the **AI** tab and **Download the AI bundle** (your real
   areas/entities, exposed services, vocabulary, config, and recent traces —
   person/location data redacted).
2. Give the AI the bundle plus your request.
3. The AI returns a **single-scope import block** (YAML or JSON).
4. Paste/upload it into the panel's **Import** view, preview, and confirm. Every
   import is reversible via undo/redo.

The AI never writes to Home Assistant directly — you review and import its output.

---

> **User-facing guide:** the install + workflow docs live at
> <https://clintongormley.github.io/ambience/ai-assisted-scenes/>. This README is
> the in-repo reference.

**Always install from `@stable`**, not the default branch — `stable` tracks the
latest release; `main` is unreleased dev work and may be incompatible with your
installed integration. (`stable` is maintained automatically by the release
workflow.)

## A) Claude Code users — install the plugin

```text
/plugin marketplace add clintongormley/ambience@stable
/plugin install ambience@ambience
```

- The first line registers this repo (at `stable`) as a plugin marketplace (the
  marketplace is named `ambience` in [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json)).
- The second installs the `ambience` plugin, which bundles:
  - the **`ambience-author` skill** (auto-activates when you talk about Ambience
    scenes), and
  - the **`/ambience-create`** and **`/ambience-fix`** slash commands.

Then just describe what you want (e.g. "create an evening dim scene for the
living room") or paste a bundle and ask "why didn't my scene fire?". The skill
will ask for your AI bundle if it needs it.

### Keeping the plugin in step with the integration

The pack records the Ambience version it was built for, and the AI bundle records
the version that produced it. Before authoring, the skill compares them and
**stops if your installed Ambience is newer than the plugin** (its knowledge of
conditions/actions may be out of date). To update:

```text
/plugin marketplace update ambience
/plugin install ambience@ambience
```

(or a clean reinstall: `/plugin uninstall ambience@ambience` then
`/plugin install ambience@ambience`). The updated skill loads on your **next
session**, so restart and re-run. **To make this automatic**, enable auto-update
for the marketplace once: `/plugin` → **Marketplaces** → `ambience` → enable
auto-update. New releases then land at session start with no manual step.

## B) claude.ai users — install just the skill

Upload the skill folder
[`ai/skill/ambience-author/`](https://github.com/clintongormley/ambience/tree/stable/ai/skill/ambience-author)
(from the `stable` branch) as a Claude Skill — it contains `SKILL.md`, its
`reference/` docs, and the two command flows. Then start a chat, paste your
downloaded AI bundle, and describe your request — the skill drives the rest.

## C) Any other AI — use the portable doc

Open
[`ambience-ai-guide.md`](https://github.com/clintongormley/ambience/blob/stable/docs/developers/ai-authoring/ambience-ai-guide.md)
(from the `stable` branch — a single self-contained markdown). Paste or upload it into your AI of choice,
then paste your downloaded AI bundle and describe what you want. The guide
contains the full schema, conditions cookbook, actions reference, diagnostics
guide, and import format.

> The portable doc is **generated**. If you're reading it before the first
> generator run, assemble the equivalent by concatenating the curated docs in
> [`docs/developers/ai-authoring/`](../docs/developers/ai-authoring/).

---

## What's in this directory

```text
ai/
├── README.md                     # this file
└── skill/
    └── ambience-author/
        ├── SKILL.md              # skill entry point (frontmatter + flow)
        ├── commands/
        │   ├── ambience-create.md  # /ambience-create flow
        │   └── ambience-fix.md     # /ambience-fix flow
        └── reference/            # skill-local copies of the canonical docs,
            ├── schema.md           # kept aligned by the doc generator
            ├── conditions-cookbook.md
            ├── actions.md
            ├── import-format.md
            └── diagnostics-guide.md
```

The plugin manifests live one level up, at the repo root, where Claude Code
expects them:

```text
.claude-plugin/
├── marketplace.json              # hosts the `ambience` plugin
└── plugin.json                   # the plugin manifest (points at the skill +
                                  #   commands above)
```
