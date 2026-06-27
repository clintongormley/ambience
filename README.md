# Ambience

A condition-based scene engine for Home Assistant.

## What it does

You describe scenes for each room and give each one the conditions that should bring it about — time of day, weather, who is home, and so on. Ambience watches your home and applies the best-matching scene automatically. Home Assistant's built-in Scenes are saved snapshots; Ambience scenes are conditional, so the right lighting, temperature, and mood follow you without manual intervention.

## Installation

### HACS (recommended)

1. Add this repository to HACS as a custom repository (category: Integration).
2. Install **Ambience** from HACS.
3. Restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration** and search for *Ambience*.

### Manual

Copy `custom_components/ambience/` into your Home Assistant `config/custom_components/` directory and restart.

Requires Home Assistant **2025.2.0** or newer.

See the [full documentation](https://clintongormley.github.io/ambience/) for details.

## Documentation

Full documentation — concepts, configuration reference, and tips — is published at [clintongormley.github.io/ambience](https://clintongormley.github.io/ambience/). The source lives in [`docs/`](docs/index.md).

## For developers

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — how Ambience works inside: the engine, scene resolution, WebSocket API, and the frontend build pipeline.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — dev environment setup, quality gates, and how to run tests.
