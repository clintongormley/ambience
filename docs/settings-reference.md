# Settings reference

Open the Settings modal with the cogwheel (⚙) in the Ambience panel header. It
has four tabs — **Categories**, **Conditions**, **Actions**, and **Advanced** —
and every control has a `(?)` help button next to it that opens a short
explanation in place.

Almost everything the Settings modal configures is covered in context elsewhere
in these docs; this page is a map to where.

## Where each tab is documented

- **Categories** — add, rename, recolour, and delete the categories you group
    scenes under. See
    [Scopes and categories](getting-started/step-1-scopes-and-categories.md).
- **Conditions** — global settings for the few conditions that have them (the
    rest are configured per-scene). See
    [Time of day](conditions/time-of-day.md), [Day](conditions/day.md#settings),
    [Weather](conditions/weather.md), and
    [Lux](conditions/lux.md#named-lux-ranges).
- **Actions** — choose which Home Assistant services are exposed as actions in
    the scene editor. See
    [Exposing actions](getting-started/step-3-exposing-actions.md) and the
    [Actions](actions/index.md) reference.
- **Advanced → Scope switches** — the per-scope pause switches and their
    settings (switch name, auto-resume delay, and voice-assistant exposure). See
    [Pausing & disabling scopes](getting-started/step-8-pausing-and-disabling-scopes.md).
- **Advanced → Re-run** — periodically re-apply a unit's winning scene to
    recover dropped commands. See
    [Re-run all scenes after inactivity](actions/apply-on-every-match.md#re-run-all-scenes-after-inactivity).

Undo / redo is a feature of the scene manager itself, not a setting — see
[The panel and the card](panel-and-card.md#undo-redo).
