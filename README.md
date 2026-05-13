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
