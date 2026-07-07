# AI-assisted scenes

!!! warning "Beta"

    This feature is new and still changing. You review and confirm everything an AI
    suggests, so nothing is saved on its own, and every change can be undone.

    The AI tab is hidden until you turn it on:

    1. Go to **Settings → Devices & services → Ambience → Configure**.
    1. Enable **the AI authoring tab (beta)**.
    1. Open the Ambience panel. The **AI** tab appears under **Settings**.

Ask an AI to build your scenes for you. Describe what you want in plain English,
such as "in the evening, when the living room is dark and someone is home, dim
the lights and close the blinds", and the AI writes the conditions and actions
for your real devices. You can also paste in a diagnostic and ask why a scene
did not fire. The AI reads the trace and suggests a fix.

Ambience always shows you a preview before anything is saved.

## Two ways to work with an AI

Pick whichever suits you. Both show you a preview before saving, and both hide
your private data first.

- **[Use the MCP server](ai/mcp-server.md)** (recommended). The AI works with
    your Home Assistant directly, in an ordinary conversation. Best if you use
    Claude Desktop or Claude Code.
- **[Download and paste](ai/download-and-paste.md)**. You download a file, give
    it to any AI, and upload what it sends back. Works with any AI, and installs
    nothing.

## What it does well

- Builds a group of scenes from a description.
- Explains why a scene did not fire, and suggests a fix, by reading your recent
    traces.

## Privacy

Whichever way you choose, Ambience sends the same information, and it hides your
private data first. Before anything leaves Home Assistant, it removes:

- where people and their devices are,
- the zones shown in your traces,
- your weather and workday entities,
- the results of your `people` and `template` conditions,
- secrets in your actions, such as alarm and lock codes and the contents of
    notifications.

Your household names stay in, so the AI can write conditions about who is home.
Their locations do not.

## Help improve it

This feature is only as good as the guidance behind it, and you can help make it
better. If an AI gives you bad advice, please
[open a GitHub issue](https://github.com/clintongormley/ambience/issues/new)
with:

- the AI's suggestion,
- your corrected version, and
- a short note on what was wrong.

Real before-and-after examples like these are used to improve the guidance the
AI learns from.
