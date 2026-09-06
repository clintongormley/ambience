# Code layout

Where things live in the repository.

## Top level

| Path                                   | What's there                                    |
| -------------------------------------- | ----------------------------------------------- |
| `custom_components/ambience/`          | The Home Assistant integration (Python).        |
| `frontend/src/`                        | The Lit + TypeScript panel and card source.     |
| `custom_components/ambience/frontend/` | The compiled JS bundles (checked in).           |
| `tests/`                               | Python tests (pytest).                          |
| `test/`                                | Frontend tests (vitest).                        |
| `docs/`                                | This documentation site (mkdocs).               |
| `ai/`                                  | The AI knowledge pack shipped to AI assistants. |
| `bin/`                                 | Release, doc-generation and helper scripts.     |
| `.githooks/`                           | The shared `pre-push` gate.                     |

## Integration (`custom_components/ambience/`)

| File            | Responsibility                                |
| --------------- | --------------------------------------------- |
| `engine.py`     | The pure resolution engine (no HA imports).   |
| `switch.py`     | Scope switch entities and the on/off cascade. |
| `websocket/`    | The WebSocket API the panel talks to.         |
| `conditions/`   | One module per condition type.                |
| `store.py`      | Persisted configuration and defaults.         |
| `manifest.json` | Integration metadata (keys kept sorted).      |

## Frontend (`frontend/src/`)

| File / dir             | Responsibility                                   |
| ---------------------- | ------------------------------------------------ |
| `ambience-frontend.ts` | Panel entry point.                               |
| `views/`               | The panel's screens (scene editor, settings, …). |
| `api.ts`               | Typed wrappers over the WebSocket commands.      |
| `docs.ts`              | In-app links to this documentation site.         |

See [Architecture](architecture.md) for how these fit together, and
[Contributing](contributing.md) for the build and test commands.
