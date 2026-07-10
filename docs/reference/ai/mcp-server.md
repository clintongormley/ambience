# Using the MCP server

The MCP server lets an AI assistant work with your Home Assistant directly. You
ask it to build or fix a scene in an ordinary conversation, it reads your
current setup, and it shows you a preview to confirm before anything is saved.
It works with Claude Desktop, Claude Code, and VS Code.

## What you need

- An AI assistant that supports MCP, such as Claude Desktop, Claude Code, or VS
    Code.
- [`uv` installed on your computer](https://docs.astral.sh/uv/getting-started/installation/).
    This is a small tool that runs the server for you.
- An **admin** long-lived access token from Home Assistant. Create one in your
    profile, under **Security → Long-lived access tokens**.
- The web address of your Home Assistant. This can be a local address such as
    `http://homeassistant.local:8123`, or a remote address over HTTPS such as a
    Nabu Casa address or your own domain. Any address you can reach from the
    computer running your AI assistant will work.

## Set it up in Claude Desktop

Add the `ambience` server to your `claude_desktop_config.json` file, then
restart Claude Desktop:

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

Replace the address and token with your own.

## Set it up in Claude Code (and VS Code)

Run the command below, with your own address and token.

On Mac and Linux:

```sh
claude mcp add ambience --scope user \
  --env AMBIENCE_HA_URL=http://homeassistant.local:8123 \
  --env AMBIENCE_HA_TOKEN=YOUR_TOKEN \
  -- uvx ambience-mcp
```

On Windows:

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

Open a **new** Claude Code conversation — one that is already running will not
notice the change. Nothing else is needed for VS Code: the Claude Code extension
reads the same settings, so the server is available there too.

Run `/mcp` to see the server and whether it connected. It works the same in
Claude Code in a terminal and in VS Code.

## Use it

Ask your assistant to build or fix a scene in plain English. For example:

> In the living room, dim the lights when a film starts.

It reads your setup, shows you a preview, and saves the scene once you confirm.
The assistant gets everything it needs about Ambience straight from your
install, so it always matches your version.

## Connect more than one, or pin a version

To connect to several Home Assistant installs, or to install a specific version,
see the
[mcp-server README](https://github.com/clintongormley/ambience/blob/stable/mcp-server/README.md).

## Your privacy

Ambience removes your private data before it reaches the AI. See
[Privacy](../ai-assisted-scenes.md#privacy) for what is hidden.

______________________________________________________________________

Next: [Download and paste](download-and-paste.md).
