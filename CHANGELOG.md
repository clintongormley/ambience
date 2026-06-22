# Changelog

All notable user-facing changes to Ambience are documented here. This project
adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases before
0.24.0 are recorded only in
[GitHub Releases](https://github.com/clintongormley/ambience/releases).

## [Unreleased]

### Added

- Scenes can now have an optional description. Add one from the scene editor via
  the "+ Add description" link below Scope. On the panel it appears as a "?"
  tooltip next to the scene name, and inline beneath the scene when you expand
  it.
- Undo / redo for scene changes: the panel now keeps the last 30 scene edits in
  memory. Use the Undo and Redo buttons at the top of the panel — or Ctrl/⌘+Z and
  Ctrl/⌘+Shift+Z — to step back and forward through add, edit, delete, reorder,
  unpin and enable/disable changes. Hovering a button shows which change is next.
  The history is shared across browser tabs and clears when Home Assistant
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
