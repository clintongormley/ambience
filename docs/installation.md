# Installation

Ambience is distributed as a **HACS custom repository**. You add the repository
to HACS once; from then on HACS handles installs and updates the same way as for
any other HACS integration.

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
1. Click the **kebab menu** (⋮, top right) → **Custom repositories**. Paste
    `https://github.com/clintongormley/ambience` into the **Repository** field,
    set **Type** to **Integration**, and click **Add**. Close the dialog.
1. Find **Ambience** in the HACS integrations list and click **Download**.
1. Restart Home Assistant.

## Install manually

If you can't use HACS:

1. Download the latest release archive from the
    [Releases page](https://github.com/clintongormley/ambience/releases).
1. Unpack it and copy `custom_components/ambience/` into your HA config's
    `custom_components/` folder.
1. Restart Home Assistant.

## After installing

1. Go to **Settings → Devices & Services → Add Integration**, search for
    **Ambience**, and add the entry.
1. A modal **Name and assign** dialog opens up asking for the device name and
    area. Click **Skip and finish**.
1. Click the new **Ambience** panel in the HA sidebar to open the Ambience UI.

Next, head to [Getting started](getting-started.md) to create your first scene.
