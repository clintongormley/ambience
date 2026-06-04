# Installation

Ambience is distributed as a **HACS custom repository** — it's not (yet) in
HACS's default integration list. You add the repository to HACS once; from then
on HACS handles installs and updates the same way as for any other HACS
integration. You'll need a working Home Assistant install to add it to.

## Prerequisites

- Home Assistant 2025.2.0 or newer.
- [HACS](https://hacs.xyz/) installed (recommended).

## Install via HACS (recommended)

The fastest path uses Home Assistant's "My" redirect to pre-fill the
custom-repository dialog. The manual path below has the same effect.

### Quick add (My Home Assistant button)

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ambience&category=integration)

Click the button, confirm the dialog in your Home Assistant, and HACS will add
the repository. Then continue from step 3 of the manual flow below.

### Manual add

1. Open **HACS** in the Home Assistant sidebar.
2. Click the **kebab menu** (⋮, top right) → **Custom repositories**. Paste
   `https://github.com/clintongormley/ambience` into the **Repository** field,
   set **Type** to **Integration**, and click **Add**. Close the dialog.
3. Find **Ambience** in the HACS integrations list and click **Download**.
4. Restart Home Assistant.

## Install manually

If you can't use HACS:

1. Download the latest release archive from the
   [Releases page](https://github.com/clintongormley/ambience/releases).
2. Unpack it and copy `custom_components/ambience/` into your HA config's
   `custom_components/` folder.
3. Restart Home Assistant.

## After installing

1. Go to **Settings → Devices & Services → Add Integration**, search for
   **Ambience**, and add the entry. The setup prompts present the same options
   described in [Configuration](#configuration) below.
2. The **Ambience** panel appears in the HA sidebar for administrator users
   only — Home Assistant hides it from non-admin users. If the panel doesn't
   show up for you and you are an admin, hard-refresh the HA web UI
   (Ctrl-F5 / Cmd-Shift-R).

## Configuration

Ambience has a small set of options you can change at any time after installing.
Go to **Settings → Devices & Services**, find the Ambience integration, and open
its **Configure** dialog.

!!! info "📷 Screenshot"
    The Ambience **Configure** dialog, showing the **Show sidebar panel** option.

**Show sidebar panel** controls the **Ambience** entry in the Home Assistant
sidebar. It is enabled by default; uncheck it to remove the sidebar entry.

As an alternative to the sidebar, you can add the **Ambience card** to any
dashboard. The card provides the same interface and is useful if you want to
embed Ambience within an existing dashboard layout rather than giving it a
dedicated panel. You add it like any other card, through the dashboard editor.

## Voice assistants

Ambience can create one switch entity per scope (`switch.living_room_ambience`,
`switch.house_ambience`, etc.) that you can use from dashboards, automations, or
voice assistants. To enable this, open the Ambience panel's Settings modal
(cogwheel ⚙), go to the **Advanced** tab, and turn on **Scope-level pause
switch**. Disabling a scope while this is on deletes its switch entity. Changes
take effect live.

When per-scope switches are enabled, you can choose which voice assistants they
are exposed to. There is one toggle per assistant — **Assist**, **Google
Assistant**, and **Alexa**. By default the switches are exposed to **Assist**
(Home Assistant's built-in voice agent) only; the Google and Alexa toggles
require Home Assistant Cloud (or a manual setup) to have any effect. Because each
switch is named after its scope (for example "Living Room Ambience") and assigned
to the matching area, you can say things like "turn off Living Room Ambience".

Changing these toggles re-applies the exposure to every Ambience switch in place,
so any per-switch exposure you had set manually in **Settings → Voice assistants
→ Expose** for these entities is overwritten.

Next, head to [Getting started](getting-started.md) to create your first scene.
