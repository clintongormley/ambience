# Download and paste

This way works with any AI, and there is nothing to install in Home Assistant.
You download a file that describes your setup, give it to an AI along with your
request, then upload the file it sends back.

## Before you start

Give your AI the Ambience guidance once, so it knows how to write scenes. Pick
the option below that matches your AI.

### Claude Code

Install the plugin. It includes the guidance and the `/ambience-create` and
`/ambience-fix` commands:

```text
/plugin marketplace add clintongormley/ambience@stable
/plugin install ambience@ambience
```

To get new versions automatically, turn on auto-update once: `/plugin` →
**Marketplaces** → `ambience` → enable auto-update.

### claude.ai

Upload the skill folder as a Claude Skill:
[`ai/skill/ambience-author/`](https://github.com/clintongormley/ambience/tree/stable/ai/skill/ambience-author).

### Any other AI

Paste this single guide into your AI:
[`ambience-ai-guide.md`](https://github.com/clintongormley/ambience/blob/stable/docs/developers/ai-authoring/ambience-ai-guide.md).

!!! note "Always use the stable version"

    The `stable` version matches your released Ambience. Before it starts, the AI
    checks that its guidance is up to date. If your Ambience is newer, it asks you
    to update the guidance first. Update with `/plugin marketplace update ambience`
    and re-install, or turn on auto-update.

## The steps

1. **Download your bundle.** In the AI tab, click **Download AI bundle**. This
    is a snapshot of your areas, entities, and actions, so the AI works with
    your real setup. Your private data is removed first.
1. **Give it to your AI.** Send the file to your AI along with what you want,
    for example "add a movie scene to the living room".
1. **Upload the result.** The AI sends back a small file. Upload it in the AI
    tab. Ambience shows you exactly what it will add, change, or remove, and
    you confirm before anything is saved.

## Your privacy

Ambience removes your private data before it leaves Home Assistant. See
[Privacy](../ai-assisted-scenes.md#privacy) for what is hidden.
