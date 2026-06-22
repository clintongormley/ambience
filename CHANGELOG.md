# Changelog

All notable user-facing changes to Ambience are documented here. This project
adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases before
0.24.0 are recorded only in
[GitHub Releases](https://github.com/clintongormley/ambience/releases).

## [Unreleased]

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
