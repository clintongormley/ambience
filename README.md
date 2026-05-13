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

Ambience applies contextual scenes — activating a named scene picks the first matching rule from an ordered list (based on time of day, weather, etc.) and runs its actions. Configuration happens via the WebSocket API (a dedicated panel is the next deliverable).

### Service: `ambience.apply_scene`

```yaml
service: ambience.apply_scene
data:
  area: living_room
  scene: movie_night
```

### WebSocket API

All commands are admin-only. Use HA's developer tools or any WS client.

| Command | Payload | Returns |
|---|---|---|
| `ambience/areas/list` | – | `[{area_id, name}]` |
| `ambience/area/get` | `{area_id}` | full area config |
| `ambience/area/save` | `{area_id, config}` | `{ok: true}` or error |
| `ambience/area/delete` | `{area_id}` | `{ok: true}` |
| `ambience/matchers/list` | – | registered matchers |
| `ambience/actions/list` | – | registered actions |
| `ambience/validate` | `{config}` | `{ok: true}` or error |
| `ambience/dry_run` | `{area_id, scene}` | resolved-rule preview |
