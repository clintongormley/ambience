# Architecture

An orientation for contributors. The authoritative, always-current version is
[`ARCHITECTURE.md`](https://github.com/clintongormley/ambience/blob/main/ARCHITECTURE.md)
in the repository root; this page summarises it for the docs site.

## Overview

Ambience is a condition-based scene engine. For each *(scope, category)* pair it
keeps an ordered list of scenes. When a scope is (re-)evaluated it walks the
list, tests each scene's conditions against live snapshots, and applies the
**first** matching scene's actions. Scopes are hierarchical — House → Floor →
Area — and each has its own on/off switch that gates automatic application.

## Resolution model

The core logic lives in `custom_components/ambience/engine.py` and is
deliberately free of Home Assistant imports, so it can be unit-tested in
isolation.

- A **scene** is a plain dict: an optional `name`, a `when` mapping of
    `{condition_key: predicate}`, and the actions to apply on a match.
- **Matching** walks the scene list in order, skipping disabled scenes. A
    predicate of `None` (or an absent key) is a wildcard; an unknown condition
    or a `None` snapshot fails; evaluation short-circuits on the first failure.
    The first scene whose every predicate passes wins, and later scenes are not
    evaluated.
- A scene that can never win because an always-matching scene precedes it is
    **shadowed**; the explained-evaluation path records a trace so the panel can
    warn about it.

## Scopes & switches

Implemented in `custom_components/ambience/switch.py`. The three scope levels
(House, Floor, Area) each get a switch that gates *automatic* scene application
for that scope only. Turning a switch off (or on) cascades one-directionally to
descendants. An optional auto-on timer (default 0 = disabled) can re-enable a
paused scope after a delay. Switch defaults are global, set once in **Settings →
Ambience**.

## Frontend & API

The panel is a Lit + TypeScript single-page app in `frontend/src/`, compiled to
the bundles in `custom_components/ambience/frontend/` (checked into the repo, so
HACS installs need no build step). It talks to the backend exclusively over the
WebSocket API in `custom_components/ambience/websocket.py` — there are no REST
endpoints. See [Code layout](code-layout.md) for the file map and
[Contributing](contributing.md) for the build commands.
