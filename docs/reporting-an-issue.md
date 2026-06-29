# Reporting an issue

If something isn't behaving as you expect and the
[debugging tools](getting-started/step-9-debugging-scenes.md) haven't explained
it, the most useful things to attach to a
[GitHub issue](https://github.com/clintongormley/ambience/issues) are a
**diagnostics** file and, for trickier problems, a **debug log**.

## Downloading diagnostics

A diagnostics file is a JSON snapshot of your configuration and recent traces.
There are two places to get one, depending on how much you want to share:

- **Scoped to one category** — in the Ambience panel, open a category's **⋮**
    menu and choose **Download diagnostics**. The file covers just that (scope,
    category): its configuration, the relevant global context (categories and
    conditions), and its recent traces. Best when you already know which scene
    group is misbehaving.
- **The whole integration** — go to **Settings ▸ Devices & services ▸ Ambience**
    and use the **Download diagnostics** link. This dumps the full configuration
    *and* all buffered traces in a single file.

Both files include the entity ids that triggered and were acted on, so glance
over the contents before sharing them publicly.

## Capturing a debug log

The Traces viewer covers most questions about Ambience's behaviour. When it is
not enough — for example, if you want to see raw evaluation detail for every
scope at once, or you suspect the problem is happening before the trace is
stored — Ambience writes to two separate log streams in Home Assistant.

### The two streams

**`custom_components.ambience.trace`** — the *changes* stream. Ambience writes
here whenever a scene was **applied** (the outcome the log records as `acted`).
This stream is on whenever the integration's debug logging is on.

**`custom_components.ambience.trace.noop`** — the *everything* stream. Ambience
writes here for evaluations that ran and did nothing — the quiet majority of
evaluations. This stream is kept at `warning` by default, even when the parent
logger is at `debug`, so it does not flood the log. You have to raise it
explicitly.

### From the integration page

Home Assistant has built-in debug logging for any integration:

1. Go to **Settings → Devices & services** and open the **Ambience**
    integration.
1. From the **⋮** menu, choose **Enable debug logging**.
1. Reproduce whatever you are investigating.
1. Choose **Disable debug logging** — Home Assistant downloads the captured log
    automatically, ready to attach to an issue.

This raises the `custom_components.ambience` logger, so it captures the
**changes** stream (`…trace`) and Ambience's general debug output. It leaves the
quiet `…trace.noop` **everything** stream at `warning` by design — if you need
that one too, use the action below.

### With an action

For finer control — in particular to raise the **everything** stream — use
**Developer Tools → Actions**. No restart needed.

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

Run the action, reproduce whatever you are investigating, then read the output
in **Settings → System → Logs**.

### Turning the streams off

If you raised the levels with the action, set them back to `warning` when you
are done (the UI's **Disable debug logging** already does this for its own
logging):

```yaml
action: logger.set_level
data:
  custom_components.ambience.trace: warning
  custom_components.ambience.trace.noop: warning
```

Leaving `trace.noop` at `debug` for an extended period will produce a large
volume of log output, particularly in a home with many entities or frequent
state changes.
