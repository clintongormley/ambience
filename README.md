# Ambience

Home Assistant custom integration.

## Installation

### HACS (recommended)

1. Add this repository to HACS as a custom repository (category: Integration).
2. Install **Ambience** from HACS.
3. Restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration** and search for *Ambience*.

### Manual

Copy `custom_components/ambience/` into your Home Assistant `config/custom_components/` directory and restart.

## Development

This repo is wired into the local HA dev environment at `~/workspace/`:

- Alias: `amb`
- Component dir: `custom_components/ambience`
- Main container: `ha-amb-main` (start with `ha-wt amb-main`)
- Feature worktrees: `/new-worktree amb <branch>`

Run tests:

```sh
pip install -e '.[test]'
pytest
```

## Usage

Configure Ambience via the **Ambience** panel (sidebar, admin-only). Add an area, define scene names, pick which matchers participate, then author rules. Activating a scene picks the first matching rule from an ordered list (based on time of day, weather, etc.) and runs its actions.

### Service: `ambience.apply_scene`

```yaml
service: ambience.apply_scene
data:
  area: living_room
  scene: movie_night
```

### Building the panel

The panel is a Lit + TypeScript app bundled to `custom_components/ambience/frontend/ambience-panel.js`. The bundle is checked in so HACS installs need no build step.

To rebuild:

```sh
npm install
npm run build
```

CI verifies that the committed bundle matches a fresh build — keep them in sync.

### WebSocket API

All commands are admin-only.

| Command | Payload | Returns |
|---|---|---|
| `ambience/areas/list` | – | `[{area_id, name}]` |
| `ambience/area/get` | `{area_id}` | full area config |
| `ambience/area/save` | `{area_id, config}` | `{ok: true}` or error |
| `ambience/area/delete` | `{area_id}` | `{ok: true}` |
| `ambience/matchers/list` | – | matchers + descriptions + predicate help |
| `ambience/actions/list` | – | actions + descriptions + target param schemas |
| `ambience/validate` | `{config}` | `{ok: true}` or error |
| `ambience/dry_run` | `{area_id, scene}` | resolved-rule preview |
