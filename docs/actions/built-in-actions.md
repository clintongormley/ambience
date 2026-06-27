# Built-in actions

Alongside Home Assistant's own services, Ambience provides a few **built-in
actions** that are smarter than a plain service call. They appear in the
**Settings → Actions** picker like any other service (search for "Ambience").

**Turn on / Turn off**: A single on/off action that targets any mix of supported
entities (lights, switches, fans, input booleans, and more) and skips any entity
that is already in the target state, so scenes don't fire redundant commands.

**Safe cover actions**:

- **Open cover (safe)** / **Close cover (safe)** — open or close the targeted
    covers, but skip any that are already fully open / fully closed.
- **Set cover position (safe)** / **Set cover tilt (safe)** — move the targeted
    covers to a position (or tilt), skipping any already there.

The "safe" variants read each cover's current position before acting, so a cover
that is already where you want it never receives a command — avoiding the relay
*click* some covers make when told to open while already open. A cover that is
mid-travel, or whose state can't be read, is always commanded.

The built-in actions are added on first install, but they are not otherwise
special. You can edit them, delete them, and re-add them again later.

______________________________________________________________________

Next: [Using an action in a scene](using-actions.md).
