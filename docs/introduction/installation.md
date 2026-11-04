# Installation

Ambience is in the community catalog that both the **Marketplace** and **HACS**
read, and either one handles installs and updates for you. Which of the two you
use depends on your version of Home Assistant.

## Prerequisites

- Home Assistant 2025.2.0 or newer.
- On Home Assistant 2026.10 or older, [HACS](https://hacs.xyz/) installed
    (recommended).

## Install on Home Assistant 2026.11 or newer

Home Assistant 2026.11 replaced HACS with the built-in **Marketplace**. It reads
the same catalog, and it comes with Home Assistant, so there is nothing else to
install first.

### Quick add (My Home Assistant link)

[Open Ambience in your Home Assistant](https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ambience&category=integration).

Confirm the dialog in your Home Assistant to open the Ambience page, then select
**Install**.

### From the Marketplace

1. Go to **Settings > Marketplace**. The first time you open it, Home Assistant
    warns you that everything in the Marketplace comes from the community and
    is not reviewed by the Home Assistant project. You need to accept that
    warning before you can install anything.
1. Search for **Ambience** and open it.
1. Select **Install**, check the version in the dialog, and select **Install**
    again.

The setup page for the integration normally opens when the installation
finishes. If it doesn't, Home Assistant raises a repair asking you to restart.

## Install on Home Assistant 2026.10 or older

Older versions of Home Assistant don't have the Marketplace, so you install
through [HACS](https://hacs.xyz/) (the Home Assistant Community Store).

### Quick add (My Home Assistant link)

[Open Ambience in your Home Assistant](https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ambience&category=integration).

Confirm the dialog in your Home Assistant to open the Ambience page in HACS,
click **Download**, then restart Home Assistant.

### Search in HACS

1. Open **HACS** in the Home Assistant sidebar.
1. Search for **Ambience** and open it.
1. Click **Download**.
1. Restart Home Assistant.

## Install manually

If you can't use the Marketplace or HACS:

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
