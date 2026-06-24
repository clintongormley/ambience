# Changelog

All notable user-facing changes to Ambience are documented here. This project
adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases before
0.24.0 are recorded only in
[GitHub Releases](https://github.com/clintongormley/ambience/releases).

## [Unreleased]

### Fixed

- Deleting the Ambience integration now also removes its stored data (scenes,
  scopes, switch and condition settings). Previously this data was kept on disk,
  so removing and re-adding the integration silently restored all your old
  settings instead of starting fresh. A reload or Home Assistant restart still
  preserves your data as before — only an explicit delete clears it.
- When configuring an action's fields, each field's checkbox now lines up with
  the field name at the top of the row instead of floating in the vertical
  centre of multi-line descriptions.

## [0.26.0] - 2026-06-23

### Added

- Scenes can now have an optional description. Add one from the scene editor via
  the "+ Add description" link below Scope. On the panel it appears as a "?"
  tooltip next to the scene name, and inline beneath the scene when you expand
  it.
- Undo / redo for scene changes: the panel now keeps the last 30 scene edits in
  memory. Use the Undo and Redo buttons at the top of the panel — or Ctrl/⌘+Z and
  Ctrl/⌘+Shift+Z — to step back and forward through add, edit, delete, reorder,
  unpin and enable/disable changes. A caption beside the buttons always names
  the next change. The history is shared across browser tabs (which refresh
  automatically when you change scenes elsewhere) and clears when Home Assistant
  restarts.

## [0.25.0] - 2026-06-22

### Added

- Live scene indicator: each scene in the panel now shows a small dot for its
  live state — a green dot on the scene that currently matches, and a hollow dot
  on a scene whose actions are still applied but no longer match. It updates
  automatically; tap a dot for an explanation.

### Fixed

- Long scene conditions and scope names now wrap inside the card on narrow and
  mobile screens, instead of overflowing and pushing the toggle and menu off the
  right edge.

## [0.24.0] - 2026-06-21

### Fixed

- Scene updates sensor is now filterable in the Home Assistant logbook.
