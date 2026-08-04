# Installation

Ambience is available in **HACS** (the Home Assistant Community Store), which
handles installs and updates for you.

## Prerequisites

- Home Assistant 2025.2.0 or newer.
- [HACS](https://hacs.xyz/) installed (recommended).

## Install via HACS (recommended)

### Quick add (My Home Assistant button)

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ambience&category=integration)

Click the button to open Ambience directly in HACS, click **Download**, then
restart Home Assistant.

### Search in HACS

1. Open **HACS** in the Home Assistant sidebar.
1. Search for **Ambience** and open it.
1. Click **Download**.
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

Next, head to [Getting started](../getting-started/index.md) to create your
first scene.
