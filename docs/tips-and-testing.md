# Tips & testing

## Traces — why a scene won

Every time Ambience evaluates a scope/category pair it records a *trace*: what triggered the evaluation, which scene won (if any), and how each condition came out. The Traces viewer lets you browse these recent evaluations without leaving the Ambience panel.

### Opening the viewer

In the Ambience panel, each category card has a small **Traces** button. Clicking it opens a modal filtered to that category within the current scope. The modal title shows the category name; a **Refresh** button appears highlighted (and labelled "● New traces — refresh") when Ambience has recorded newer entries since you opened the modal. A **Download diagnostics** button downloads a JSON file scoped to that one (scope, category): its configuration, the relevant global context (categories and conditions), and its recent traces — handy for attaching to a bug report. The traces include the entity ids that triggered and were acted on, so glance over the file before sharing it publicly.

!!! info "📷 Screenshot"

### Reading a trace entry

Each entry shows four things across the top row:

- **Outcome badge** — one of: `acted` (Ambience ran actions and something changed), `debounced` (a scene won but it is the same one already applied, so its identical actions were suppressed), `no op` (a scene won but it has no actions to run — e.g. a blocker scene), `no match` (no scene matched), or `skipped switch off` (the category's enable switch was off). Re-apply evaluations that dispatch commands also record `acted` — you can tell them apart by the `reapply` cause badge.
- **Cause** — what triggered the evaluation. Entity causes read as `sensor.my_sensor off → on`; time-based causes read as `clock`, `sun`, or `duration recheck`. `Reloaded` means a configuration save re-applied the scope (only the scope you changed is re-evaluated); `Startup` means Home Assistant restarted. `reapply (1h30m)` means the idle re-apply timer fired after the configured inactivity period.
- **Time** — the local time of the evaluation.

Below the top row, if a scene won, its name is shown in green ("Won: *scene name*"). If any actions ran, a one-line summary follows showing the service called and the number of entities affected.

### Expanding the detail

Click **▸ Why this scene won** (or **▸ Why nothing matched**) to expand the full explanation. The expanded view has two sections:

**Scene evaluation** lists every scene that was considered, in priority order, with its outcome (`WON` or `no`). Beneath each scene, each condition is shown with a tick (met) or cross (not met), its condition type, and a bracketed detail — for example `[3 of 5 home (Alice, Bob)]` or `[evening]`.

**Actions taken** lists every service call that was made, with the friendly action name, any parameters (for example `Turn on light · Brightness: 60`), and the individual entities that were targeted.

!!! info "📷 Screenshot"

---

## Simulator — what if

The Simulator lets you ask "what would Ambience do if conditions were different?" without touching your home. It runs a full scene evaluation against invented inputs and shows you the result using the same trace-detail view as the Traces viewer.

### Opening the simulator

Each category card also has a **Simulate** button. Clicking it opens a modal labelled "Simulate · *category name*". The inputs load pre-filled with live values from your home, so the initial run (before you change anything) shows you what Ambience would decide right now.

### What you can set

**Date and time.** If any of the category's conditions depend on time (time of day, sun position, weekday, workday), a *When* row appears with a date picker and a time picker. Changing these drives all time-derived conditions at once — sun elevation, period of day, day of week, and workday status all update together.

**Entity states and attributes.** Each entity that one of the category's conditions depends on appears as a row. Entities with a fixed set of states (such as a person's presence) show a dropdown; numeric entities show a number field; others show a text field. Where the entity has relevant attributes (for example a weather entity's condition description), those appear as indented rows beneath it. Every row has a reset button (↺) that restores the live value.

**Opaque condition verdicts.** Some conditions cannot be broken down into individual entity controls — for example a template condition or a third-party integration. These appear as true/false dropdowns labelled with the condition or entity name.

### Running the simulation

Click **Simulate ▸** to send the current inputs to Ambience. The result appears below the button as a single trace-detail card. Expand it with **▸ Why this scene won** (or **▸ Why nothing matched**) to see which conditions passed and which actions would have run. The outcome badge reads `acted`, `no op` (a scene won but has no actions), or `no match` — it describes what *would* have happened, not what actually happened in your home. (The simulator never shows `debounced`, which depends on what was last applied at runtime.)

!!! info "📷 Screenshot"

---

## Troubleshooting with logs (advanced)

The Traces viewer covers most questions about Ambience's behaviour. When it is not enough — for example, if you want to see raw evaluation detail for every scope at once, or if you suspect the problem is happening before the trace is stored — Ambience writes to two separate log streams in Home Assistant. (For a one-shot snapshot of everything at once, the integration's **Download diagnostics** link — Settings ▸ Devices & services ▸ Ambience — dumps the full configuration *and* all buffered traces in a single JSON file.)

### The two streams

**`custom_components.ambience.trace`** — the *changes* stream. Ambience writes here whenever an evaluation caused something to happen (outcome `acted`). This stream is on whenever the integration's debug logging is on.

**`custom_components.ambience.trace.noop`** — the *everything* stream. Ambience writes here for evaluations that ran and did nothing — the quiet majority of evaluations. This stream is kept at `warning` by default, even when the parent logger is at `debug`, so it does not flood the log. You have to raise it explicitly.

### Turning the streams on

The easiest way is via **Developer Tools → Actions** — no restart needed.

To see only what changed:

```yaml
action: logger.set_level
data:
  custom_components.ambience.trace: debug
```

To see every evaluation, including the quiet ones:

```yaml
action: logger.set_level
data:
  custom_components.ambience.trace: debug
  custom_components.ambience.trace.noop: debug
```

Run the action, reproduce whatever you are investigating, then read the output in **Settings → System → Logs**.

### Turning the streams off

Set the levels back to `warning` when you are done:

```yaml
action: logger.set_level
data:
  custom_components.ambience.trace: warning
  custom_components.ambience.trace.noop: warning
```

Leaving `trace.noop` at `debug` for an extended period will produce a large volume of log output, particularly in a home with many entities or frequent state changes.
