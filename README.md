# Ambience

[![GitHub release](https://img.shields.io/github/v/release/clintongormley/ambience?include_prereleases)](https://github.com/clintongormley/ambience/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.2.0%2B-blue.svg)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/github/license/clintongormley/ambience)](https://github.com/clintongormley/ambience/blob/main/LICENSE)

Ambience is a **condition-based scene engine** for Home Assistant. You describe
scenes for a room — _"Room is empty"_, _"Movie time"_ — along with the
conditions under which each scene should apply — _"Projector is turned on"_,
_"Person in room"_, _"Daytime"_, _"Cloudy weather"_. Ambience watches your home
and applies the best-matching scene automatically.

**Full documentation is published at
[clintongormley.github.io/ambience](https://clintongormley.github.io/ambience/).**

![Ambience scene management panel.](https://raw.githubusercontent.com/clintongormley/ambience/main/docs/images/readme-panel.png "Ambience scene management panel.")

## Installation

Requires Home Assistant **2025.2.0** or newer, and [HACS](https://hacs.xyz/) for
the recommended path.

### HACS (recommended)

Click the button below to open the custom-repository dialog in your Home
Assistant pre-filled, then confirm it:

[![Open your Home Assistant instance and open this repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ambience&category=integration)

Or add it by hand: in **HACS**, open the **⋮** menu → **Custom repositories**,
paste `https://github.com/clintongormley/ambience`, set the **Type** to
**Integration**, and click **Add**.

Then:

1. Find **Ambience** in the HACS list and click **Download**.
1. Restart Home Assistant.
1. Go to **Settings → Devices & Services → Add Integration** and search for
    *Ambience*.

See the [full documentation](https://clintongormley.github.io/ambience/) for
details.

## For developers

- **[ARCHITECTURE.md](https://github.com/clintongormley/ambience/blob/main/ARCHITECTURE.md)**
    — how Ambience works inside: the engine, scene resolution, WebSocket API,
    and the frontend build pipeline.
- **[CONTRIBUTING.md](https://github.com/clintongormley/ambience/blob/main/CONTRIBUTING.md)**
    — dev environment setup, quality gates, and how to run tests.
