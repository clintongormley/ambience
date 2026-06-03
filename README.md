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

Configure Ambience via the **Ambience** panel (sidebar, admin-only). Add an area, define scene names, pick which conditions participate, then author scenes. Activating a scene picks the first matching scene from an ordered list (based on time of day, weather, etc.) and runs its actions.

### Per-scope switches

Each scope (the house, every HA floor, and every HA area) gets its own
`switch.*_ambience` entity. Each switch independently gates only its own
scope's scenes — `ambience.apply_scene` for an area is a no-op iff *that
area's* switch is off; same for floor and house. There is no cascade, so
turning a floor off does not affect rooms on that floor. Switches
auto-turn-on after a configurable delay (default 2h; 0 disables). Defaults
and per-scope overrides live in **Settings → Ambience**.

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
| `ambience/conditions/list` | – | conditions + descriptions + predicate help |
| `ambience/services/list` | – | HA services available for use as actions |
| `ambience/exposed_actions/list` | – | configured action definitions (id, label, service, …) |
| `ambience/exposed_actions/save` | `{actions}` | `{ok: true}` |
| `ambience/validate` | `{config}` | `{ok: true}` or error |
| `ambience/dry_run` | `{area_id, scene}` | resolved-scene preview |
| `ambience/switch_defaults/list` | – | `{name, auto_on_delay_seconds}` |
| `ambience/switch_defaults/save` | `{name, auto_on_delay_seconds}` | `{ok: true}` |
| `ambience/house/switch/save` | `{name\|null, auto_on_delay_seconds\|null}` | `{ok: true}` |
| `ambience/floor/switch/save` | `{floor_id, name\|null, auto_on_delay_seconds\|null}` | `{ok: true}` |
| `ambience/area/switch/save` | `{area_id, name\|null, auto_on_delay_seconds\|null}` | `{ok: true}` |
