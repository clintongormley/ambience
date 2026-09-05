# Changelog

All notable user-facing changes to Ambience are documented here. This project
adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Releases before
0.24.0 are recorded only in
[GitHub Releases](https://github.com/clintongormley/ambience/releases).

## [Unreleased]

### Fixed

- A damaged Ambience storage file is no longer overwritten with an empty
    configuration on startup; it is left in place for recovery.
- Turning a scope's Ambience switch back on now re-reads every condition before
    re-applying, so scenes reflect the current state rather than the state
    cached while the switch was off.
- Re-enabling a scope no longer runs its winning scene's actions twice.
- Undo/redo can no longer restore a scene into a category that has since been
    deleted; such scenes move to General.
- Saving a scene no longer resets the idle re-apply timer of every other scope.
- People conditions that apply to everyone now notice persons added to or
    removed from Home Assistant without a restart.
- Time-of-day conditions keep working at high latitudes on days when dawn or
    dusk does not occur; only the endpoints that need the missing anchor are
    unavailable.
- Scene ordering and shadowing for sun-anchored times with a clamp no longer
    depend on the Home Assistant time zone.
- Time ranges that cross the daylight-saving switch hour now behave as
    configured.
- A malformed condition in one scene no longer prevents the other scenes in its
    category from being evaluated.
- Editing scenes in a stale browser tab can no longer silently disable a scope
    that was enabled elsewhere.
- A scope paused after its floor or house was paused keeps its own resume time
    when the parent resumes.
- A scope that was paused when Home Assistant stopped abruptly now still resumes
    automatically.
- Scenes anchored to a time before sunrise or sunset no longer re-evaluate a
    second time at the sunrise/sunset itself.
- Disabled scenes no longer run their script or template conditions.
- A 'nobody home' condition no longer matches when Home Assistant has no
    persons at all.
- A scene whose trigger entity vanished and later reappears is applied again
    instead of being treated as already applied.
- Lux conditions accept any numeric sensor you pick, not only sensors declaring
    an illuminance device class.
- Disabling a scope's Ambience switch entity in Home Assistant now pauses that
    scope instead of leaving it always on.

## [1.2.0] - 2026-09-04

### Added

- **French (fr) translation.** Ambience is now available in French — the config
    flow, repair issues, service names, and the whole panel UI. It joins
    English, Spanish, and European Portuguese.

## [1.1.0] - 2026-08-04

The **AI-assisted authoring** release. You can now build and fix Ambience scenes
with an AI — describe what you want in plain English and review a preview before
anything is saved. This section highlights what 1.1.0 adds over 1.0.0; the
per-version entries below record how it got here.

### Highlights

- **Author scenes with an AI.** A local MCP server (`ambience-mcp`) lets an AI
    assistant work with your running Home Assistant directly, and an **AI** tab
    in the panel (now shown by default) takes a downloaded bundle for AI clients
    without MCP. Both redact your private data first and preview every change
    before it is saved.
- **A robust MCP server.** It agrees a protocol with Ambience on connect, serves
    the authoring guide live and section by section, heals itself after a Home
    Assistant restart, and runs on mcp 2.0.
- **European Portuguese (pt).** Ambience is now translated for Portugal, in
    addition to English and Spanish.
- **Sun-relative times in Simulate.** The "When" control now offers
    sunrise/sunset offsets, so you can preview a scene at, say, "30 minutes
    before sunset".

## [1.1.0-rc.7] - 2026-08-04

### Changed

- The AI authoring tab in the Ambience panel is now shown by default. The
    **Enable the AI authoring tab** option has been removed — the tab is always
    available (you still review and confirm every AI suggestion before anything
    is saved).

### Fixed

- The `ambience-mcp` MCP server now runs on **mcp 2.0**. mcp 2.0 removed the
    bundled FastMCP the server was built on, so a fresh `uvx ambience-mcp`
    (which always resolves the newest `mcp`) failed to start with *"No module
    named 'mcp.server.fastmcp'"*. The server now targets mcp 2.0's `MCPServer`,
    and pins `mcp<3` so a future major release cannot break installs the same
    way.

## [1.1.0-rc.6] - 2026-07-17

### Changed

- The MCP server setup instructions now use `ambience-mcp@latest`, which checks
    for the newest release every time the server starts (a sub-second check) —
    so updates now arrive on their own whenever your AI assistant restarts.
    Without `@latest`, `uvx` reuses its cached install indefinitely, so the
    first version you installed was the version you kept. The *"upgrade
    ambience-mcp"* message now simply says to restart your MCP client, instead
    of walking you through cleaning the `uv` cache.

## [1.1.0-rc.5] - 2026-07-15

### Added

- Large sections of the AI scene-authoring guide are now served in parts over
    MCP. A section that would exceed the result budget is split at its headings
    (never inside a code example) and returned page by page, so no part of the
    guide can ever be too big for the AI to read — it just follows the notice
    and fetches the next part.
- Two new scene-authoring cookbook recipes: *Re-arm a self-clearing helper*
    (keep a helper set while its conditions still hold, by subscribing a scene
    to its own target) and *Fail-safe off* (turn an appliance off on its own
    run-time, so a dead presence sensor can't leave it running).

### Fixed

- Asking the AI for the large "Condition cookbook" section of the authoring
    guide over MCP no longer fails with *"result too large"*. Tool results were
    being serialised twice on the wire, which doubled their measured size and
    pushed the biggest guide section over the budget; results are now sent once,
    halving the payload so the section fits.

## [1.1.0-rc.4] - 2026-07-13

### Added

- The MCP server and Ambience now agree on a **protocol** at connect time, so an
    incompatible pair says so instead of half-working. Every tool call fails
    with a message naming which side to upgrade — and never asks you to install
    an older `ambience-mcp`, which `uvx` could not do anyway. The check rides on
    a tiny handshake rather than inside the authoring context, so it arrives
    even on a house whose context is too large to return: the failure that
    prompted this could not report itself, because its own warning was inside
    the payload being rejected.
- The MCP server ships an adapter for every protocol it supports, so the latest
    release still talks to older Ambience installs — which is what makes
    pointing one MCP server at two installs on different Ambience versions work.

### Fixed

- Asking the AI something while Home Assistant is still starting up no longer
    latches a permanent, wrong *"Update Ambience"* on a perfectly current
    Ambience. Ambience registers its websocket commands when it finishes setting
    up, which is well after Home Assistant starts accepting connections — so for
    a few seconds after every restart the handshake gets "no such command",
    which is indistinguishable from a genuinely old Ambience. That verdict is no
    longer cached: the next tool call re-asks on the same connection, so the
    moment Ambience is up the server heals itself, with no reconnect and no
    MCP-server restart. (A genuinely old Ambience still gets the "update
    Ambience" message on every call, which is still the fix.)
- A save you ask the AI to apply no longer needlessly burns its confirmation
    when the MCP server has to reconnect to Home Assistant first. If the
    connection had to be re-established — Home Assistant restarted, or was still
    coming up — the save was refused as *"it may already have been applied"*,
    even though nothing had been sent to Home Assistant at all: the connection
    itself had not finished opening. The confirmation is single-use, so you then
    had to preview the change and confirm it all over again. Such a save is now
    simply retried on the fresh connection. (A save that really did reach Home
    Assistant and only lost its reply is still never re-sent — it could be
    applied twice.)
- The "upgrade `ambience-mcp`" message now also tells you to remove any version
    **pin** from your MCP config. Without that, the rest of the advice (clean
    the cache, restart) is a no-op for anyone who pinned a version — the pin
    reinstalls the same old build, and every tool call keeps failing.
- Testing an Ambience **pre-release** now works with the MCP server. `uvx`
    installs pre-releases only when asked, so once a final `ambience-mcp` is
    published it would keep reinstalling that one for a beta tester — who would
    be told to upgrade, do exactly as asked, and get the same build back, for
    ever. When your Ambience is a pre-release, the "upgrade `ambience-mcp`"
    message now says so and gives you the config that can actually reach it
    (`uvx --prerelease=allow ambience-mcp`); a final Ambience is never told to
    allow pre-releases. The release gate matches: it checks a pre-release
    Ambience against the pre-release `ambience-mcp` channel, and a final one
    against the final channel.
- The AI's dry-run preview is now redacted like traces already were: who is home
    (by name) and security action params (lock PINs, alarm codes) no longer
    leave the home in `ambience_dry_run` results. Redaction is now the backend's
    DEFAULT — `ambience/dry_run` redacts unless a caller explicitly passes
    `redact: false` — so even a cached, pre-upgrade `ambience-mcp` (which never
    sends the flag at all) gets a redacted result with no action needed. A build
    too old to understand the `redact` key at all still gets a visible notice
    instead of a silent leak.
- `list_traces` and the diagnostics download now redact two more kinds of
    predicate detail, the same widened set `ambience_dry_run` above respects:
    `unavailable` (the friendly names of currently-down entities, which can
    include a `device_tracker`) and `occupancy` (which rooms are occupied right
    now). Previously only `people` and `template` details were blanked.
- A write that only changes scene evaluation order (`priority`/`pinned`) no
    longer previews as "no changes" — the diff shows it, and resubmitting scenes
    without their stored order fields adds a note saying order will be
    re-derived.
- A scene with no category is now blocked at preview (the backend used to
    silently move it to "General" after the diff was approved), and re-declaring
    an existing category in `new_categories` now shows the overwrite in the
    preview.
- A non-string `category` on an unnamed scene is now a clean validation error
    instead of an opaque save failure. It was already checked for named scenes;
    an unnamed one skipped the check and could reach the store with a category
    value that isn't hashable. `ambience_preview_write` no longer swallows that
    clean error either: its diff used the category as a lookup key, so an
    unhashable value crashed the preview with a raw `TypeError` before the error
    could be reported.
- A failed `ambience_apply_write` no longer burns its confirm token: "try again"
    now works instead of answering "bad confirm_token".
- Cancelling (or erroring) a tool call during Home Assistant's startup window
    can no longer permanently wedge the MCP server; an incompatibility verdict
    also re-checks itself, so following "Update Ambience and restart Home
    Assistant" actually clears it.
- An HA endpoint that accepts the websocket connection but never sends a frame
    (a half-configured reverse proxy) no longer hangs every MCP tool call
    forever: the auth handshake now times out and reconnects, the same way an
    unresponsive command already did.
- Reloading or disabling the Ambience integration mid-session now gets an
    actionable "Ambience is reloading" message instead of a raw
    `unknown_command`.
- The release gate now checks the published `ambience-mcp` actually speaks the
    backend's protocol (membership, not just "not newer").

### Changed

- The AI guide response no longer carries `ambience_ai_bundle`, and the MCP
    context no longer carries `ambience_ai_context`. Compatibility is the
    handshake's job now. The **downloadable AI bundle still carries
    `ambience_ai_bundle`** — the paste-flow skill gates on it, and there is no
    handshake with a human.

## [1.1.0-rc.3] - 2026-07-12

### Added

- The MCP server can now work with houses of any size. `ambience_get_context`
    returns an entity **summary** (counts by domain, area and device class)
    instead of every entity, and a new `ambience_find_entities` tool searches
    and pages the catalog. Previously a house with ~1,500 entities produced a
    ~90k-token context that the AI client rejected outright.
- Every MCP tool result is now bounded, so none can be rejected for size. When a
    result does not fit, it says so and says how to get the rest — it is never
    silently cut. Rewriting a large scope still works: `ambience_preview_write`
    summarises its diff (every changed scene still listed, by name and by which
    fields changed) rather than dumping every scene body.

### Changed

- Scene-evaluation traces sent to the MCP server are now redacted, as the
    downloadable AI bundle's already were. A trace can carry presence zone names
    and the parameters of dispatched actions, including alarm codes and lock
    PINs. The Home Assistant panel's own trace view is unchanged.

- `ambience-mcp` now requires an Ambience that serves `ambience/ai_context`
    (this release or newer); it will tell you to upgrade if not.

- The **Download AI bundle** flow is untouched: the downloaded bundle still
    carries the full entity catalog, because an AI you paste it into has no
    tools to look entities up with.

## [1.1.0-rc.2] - 2026-07-11

### Added

- **The AI bundle now records which floor each area is on.** Every entry in
    `catalog.areas` carries a `floor_id` (or `null` when the area is on no
    floor). This is the only link between an area and a floor, so without it an
    AI asked to author scenes for a floor could not work out which areas — and
    so which entities — that floor actually contains.

### Changed

- **The MCP server now serves the authoring guide section by section.**
    `ambience_get_guide` called with no argument returns the list of section
    names; call it again with `section=<name>` to read one. The guide is roughly
    25k tokens and exceeded the maximum size of a single tool result, so an AI
    asking for it got an error instead of a guide and could end up authoring
    without ever having read it.

    The `have_version` **argument** is gone. It invited an AI to pass a version it
    had read from the *bundle* and so claim it already held a guide it had never
    fetched — which returned `{unchanged: true}` with no text, leaving it to
    author blind. The server now remembers the guide itself, keyed on the
    install's version, and asks for the text only when that version changes. The
    guide is ~109KB and only changes when you upgrade Ambience, so it is fetched
    once per session rather than once per section — which matters when Home
    Assistant is reached over the internet rather than a LAN.

### Fixed

- **The MCP server can read the guide from an Ambience it did not ship with.**
    The server is installed separately from the integration, so a newer server
    routinely meets an older install — which assembles the guide with two
    headings per section. Split naively, every section an AI is told to read
    came back **empty**, so it would fetch the guide, receive nothing, and
    author blind. The server now reads both layouts.
- **The first MCP tool call after a Home Assistant restart no longer fails.**
    Restarting Home Assistant closes the websocket, and the MCP server only
    discovered this when it next tried to use it — so the next tool call always
    failed with `websocket command failed: received 1000 (OK)` and only the one
    after it reconnected. The server now reconnects and retries that call. A
    write that had already reached Home Assistant is deliberately **not**
    retried, since it may have been applied and only its reply lost.
- **The assembled AI guide no longer emits two headings per section.** Each
    section began with both the assembler's title and the source document's own,
    which read as an empty section to anything splitting the guide on its
    headings.
- **Documented that writing scenes over MCP replaces the whole scope.** Import
    blocks merge by default, but `ambience_apply_write` stores exactly the scene
    list it is given — so any scene left out is deleted. The guide now spells
    out the difference and tells an AI to read the scope first and check the
    preview's `removed` list.
- **Clarified when a presence "blocker" scene is actually needed.** The guide
    presented the no-op blocker as the fix for any `for:`-gated vacancy rule; in
    fact it is only needed when the occupancy test has been hoisted out of the
    scenes below it. The common "lights on when someone enters, off five minutes
    after everyone leaves" needs two scenes, not three, and the guide now shows
    that form.

## [1.1.0-rc.1] - 2026-07-10

### Added

- **Import blocks can now set a category's scene order.** An AI-authored import
    block may give its scenes explicit `priority` numbers (higher = evaluated
    earlier) to force an evaluation order — for example floating a broad
    override or "blocker" scene above the more-specific scenes that would
    otherwise win. Previously the order was derived automatically and the only
    way to override it was to pin scenes by hand in the Scopes view after
    importing. On save Ambience keeps the pin **only** where your order
    genuinely overrides the natural one and quietly drops the rest, so the
    stored configuration stays clean while the imported order is preserved
    exactly.
- **Portuguese (Portugal) translation.** Ambience is now available in European
    Portuguese (`pt`) — the config flow, repair issues, service names, and the
    whole panel UI. Locale resolution is now region-aware (exact locale → base
    language → English), so a future Brazilian catalogue can be added without
    either variant collapsing into the other. Until then, Brazilian Portuguese
    (`pt-BR`) users see the European translation as a graceful fallback and a
    banner inviting them to contribute a dedicated Brazilian translation.
- **Sun-relative times in the Simulate screen.** The "When" control now offers a
    **Sun** mode alongside the clock: pick a solar anchor (dawn, sunrise, noon,
    sunset, dusk, or midnight) with an optional ± offset in minutes, and
    Ambience shows the resolved wall-clock time and simulates at that instant.
    This makes it easy to test scenes keyed off sun events — e.g. "30 minutes
    before sunset" — without having to work out when sunset actually falls on
    the chosen date.
- The per-category **Simulate** tool now keeps a running history instead of
    replacing the previous result. Each click is added to the list and carries
    the previous run's outcome forward, so a sequence of runs reproduces what
    Ambience does live — a scene that wins again shows as *unchanged* (its
    actions are **not** re-applied) rather than re-acting, exactly as the real
    debounce would. A **Clear** button resets the history.
- **A local MCP server for authoring and diagnosing scenes live.** `mcp-server/`
    lets Claude author and diagnose Ambience scenes live, directly against a
    running Home Assistant, without the download/upload AI-bundle dance. Install
    it with `uvx ambience-mcp` and add it to your Claude client; it does nothing
    until you do. If your Ambience is older than the server supports it refuses
    writes with the version to update to, rather than failing cryptically. See
    `mcp-server/README.md`.
- **The MCP server serves the authoring guide live from your install.** The
    schema + cookbook guide is fetched from your running Ambience over the
    websocket, so it always matches your version with nothing separate to
    install or keep in sync; the transfer is skipped when your version hasn't
    changed. If the server is older than your Ambience it says so, and scenes
    are presented by relative rank (1…N per category) rather than the internal
    priority number.

### Fixed

- In the **Simulate** screen, an entity that is currently *unavailable* (e.g. a
    remote whose hub is off the network) now shows **Unavailable** as its state
    and offers it as a choice, instead of displaying a normal state while
    silently simulating it as unavailable. Previously that mismatch made any
    attribute you set on it (such as a remote's *current activity*) quietly have
    no effect — the entity read as unobservable, so scenes that depend on it
    never matched — until you changed the state control by hand. Pick a real
    state to simulate the entity as available.

- People conditions now resolve correctly for anyone tracked by a **non-GPS
    presence scanner** (router, `ping`, `nmap`, UniFi, many Bluetooth setups).
    Home Assistant only fills a person's `in_zones` attribute from GPS
    coordinates, so a scanner-tracked person who is *home* reports an empty
    `in_zones` — which Ambience was reading as "in no zone", seeing them as
    away. As a result "someone home" scenes never fired for these households,
    and — more seriously — "nobody home" scenes could fire while someone was
    actually home. Ambience now falls back to the person's `state` whenever
    `in_zones` is empty, so home/away and zone matches are correct again.

## [1.0.0] - 2026-07-01

The first stable release of Ambience — a **condition-based scene engine** for
Home Assistant. You describe the scenes for a room ("Movie time", "Room empty")
along with the conditions under which each should apply, and Ambience watches
your home and applies the best-matching scene automatically. This section is a
snapshot of what Ambience offers at 1.0; the per-version entries below record
how it got here.

### Highlights

- **Conditions, not triggers.** Instead of wiring up "when someone enters the
    room…" automations, you describe the conditions that define each scene.
    Ambience re-evaluates the current context whenever anything relevant changes
    and applies the single best-matching scene — so a room lands in the right
    state even when nothing just "happened".
- **A rich condition palette.** Build scenes from occupancy, people (who is home
    and where, with duration gates), time of day, sun position, light level
    (lux), weather, and day of week, plus arbitrary entity state — the last with
    full AND/OR grouping, parentheses, and negation. Power users can drop to a
    script or template condition, and an "unavailable" condition guards on an
    entity being unknown or missing.
- **Actions, not just target states.** You choose which actions apply a scene,
    so you control *how* devices get there — including smooth fades via the
    companion [Fado Light Fader](https://github.com/clintongormley/ha-fado)
    integration. Expose only the actions and fields you care about; light,
    switch, and safe cover actions are seeded out of the box.
- **Scopes, categories, and a single winner.** Scenes belong to a scope (House,
    Floor, or Area) and a category (e.g. lights vs. blinds). Exactly one scene
    wins per scope-and-category group, ranked by priority and specificity, so
    two rules can never clash over the same device.
- **Auto-derived triggers.** Ambience reads your conditions and installs the
    Home Assistant triggers needed to keep scenes current — you never wire
    triggers by hand.
- **Per-scope switches that cascade.** Every scope gets its own pause/resume
    switch; the House and Floor switches cascade down to the areas beneath them,
    and each can pause for a set number of minutes and then auto-resume. Add
    them to a dashboard or expose them to a voice assistant ("turn off
    Ambience").
- **A visual editor built to be read.** Scenes render in a compact,
    human-friendly format that's easy to compare side by side. The panel adds
    undo/redo (shared across browser tabs), optional scene descriptions, live
    indicators showing which scene currently matches, and inline help links —
    and works on mobile.
- **Debuggable and testable.** A tracer explains why the winning scene won and
    why the others didn't; a simulator lets you change the time, weather, or any
    condition to test your rules; and the editor flags unreachable scenes and
    ordering problems before they bite. Config health surfaces missing or
    disabled entities as Repairs issues, and scene activity is written to the
    Home Assistant logbook per scope.
- **Privacy-conscious diagnostics.** A one-click diagnostics download captures
    what's needed to debug a scene while scrubbing presence data, location, and
    secrets such as alarm and lock codes — safe to paste into a GitHub issue.
- **Installable via HACS, and translatable** — English and Spanish today, with
    an in-panel nudge to contribute your own language.

### Fixed

- Entity names in scene condition summaries — and in the simulator and
    auto-triggers lists — now fall back to the entity's registered name (from
    the entity or its device) when it has no live state, matching what the
    entity picker shows. Previously they leaked the raw entity id (for example
    `remote.cine` instead of **Cine**) whenever the entity was unavailable or
    not yet loaded.

## [1.0.0-rc.1] - 2026-06-30

### Added

- After you update Ambience, the panel now notices when your browser is still
    running the previous version from its cache and shows a banner with a
    **Reload** button to pick up the new one — avoiding the confusing errors a
    stale panel can cause after an upgrade.

### Fixed

- The diagnostics dump downloaded from a category's ⋮ menu now names the file
    after the category's display name (e.g. `ambience-area-kitchen-lights.json`)
    instead of its internal id. Previously a renamed category — such as the
    built-in **General** renamed to **Lights** — kept its original id and so
    downloaded as `…-general.json`.

## [0.31.0] - 2026-06-29

### Added

- A banner now nudges you to request a translation when your Home Assistant
    language isn't one Ambience ships yet. It opens a prefilled GitHub issue,
    and dismissing it is remembered per language (region variants such as pt-BR
    are treated separately), so you're never nagged twice for the same language.
- Documentation help links throughout the panel: each settings tab, condition,
    and the "Apply on every match" toggle now shows a small **(?)** help icon —
    where it has explanatory text the popover ends with a "Read more" link to
    the matching online documentation page, and where it doesn't the (?) opens
    that page directly in a new tab.
- A new **AI** tab in Settings (**beta**, off by default — turn it on in the
    integration's options: Settings → Devices & services → Ambience → Configure)
    lets you build and fix scenes by describing what you want to an AI.
    *Download AI bundle* exports a snapshot of your areas, entities, exposed
    actions and current config (presence/location data redacted) to hand to an
    AI; upload the config file it returns back into the same tab to preview and
    import it (new or updated scenes, with any new category created for you).
    Imports go through the normal save path, so they're undoable. A matching
    knowledge pack — a Claude skill, a Claude Code plugin, and a portable guide
    — teaches any AI the Ambience schema and how to read a diagnostic, and stays
    in sync with the integration automatically on each release.

### Changed

- Consolidated the WebSocket scope handling internally (one save dispatcher, a
    shared scope-selector schema, and a single "scope not found" error contract
    across the get / save / enable commands). The only user-visible effect:
    opening an area or floor that no longer exists now shows the same "Unknown
    area/floor" message as trying to save it did.
- **Download diagnostics** has moved out of the Traces viewer into each
    category's **⋮** menu, alongside Run / View traces / Simulate /
    Auto-triggers. It still downloads the same diagnostics bundle scoped to that
    one (scope, category).
- Removed the "Set up an action to get started" banner. New installs now seed
    default actions, so the prompt no longer applied.
- Scene-update activity is now logged to the Home Assistant logbook against each
    scope's switch, e.g. *Lounge Ambience 'Lights/Daytime Cloudy'*, so you can
    filter the logbook by area (for area-scoped switches) to see only the
    activity relevant to that space. The devices the scene changes are
    attributed to it — each shows *triggered by 'Lights/Daytime Cloudy' (Lounge
    Ambience)*. The `sensor.ambience_scene_updates` sensor has been removed —
    anything referencing it (dashboards, automations, logbook filters) must be
    updated.
- Per-scope pause switches are now always created for every enabled scope. The
    **Scope-level pause switch** toggle in the Advanced settings has been
    removed. Installs that previously had the toggle off will see new switch
    entities and devices appear after upgrading. The pause-and-auto-resume
    behaviour of those switches is unchanged.

### Fixed

- The optional "set up Workday & Weather" hint and the "install Fado Light
    Fader" notice now reappear after you delete and recreate the Ambience
    integration. Previously, dismissing either one hid it for good in that
    browser — even on a brand-new install — because the dismissal wasn't tied to
    the install. Each dismissal is now remembered per install, so a fresh setup
    starts with a clean slate.
- When a scene is skipped because its scope's pause switch is off, the trace
    timeline now says *"Skipped — the scope's pause switch is off."* It
    previously referred to a non-existent "category switch".
- A negated group in a **state condition** (`NOT (… AND …)`) no longer loses its
    negation when you change the group's AND/OR operator — that previously
    dropped the NOT silently and inverted the condition's meaning.
- A **category** add/edit that the server rejects now rolls back in the Settings
    panel instead of continuing to show the rejected change as if it had saved.
- Scene **shadowing / ordering hints** for `occupancy` and `people` duration
    gates are now correct for the "held for less than" mode, and no longer
    relate two predicates that use different duration modes — either could
    surface a spurious "this scene can never win" warning or mis-order the scene
    list.
- Clearing every sensor from an **occupancy** or **lux** condition now removes
    the condition, instead of leaving behind a no-op "any sensor" row.
- The **lux** range min/max inputs now reject fractional values inline ("Bounds
    must be whole numbers.") instead of letting them through to a generic save
    error from the backend.
- A **people** condition whose `who` is a present-but-empty list (`who: []`) is
    now rejected on save and on import / AI authoring, matching the editor —
    previously it slipped through and silently ran as "all persons". Omit `who`
    entirely to mean all tracked persons.

### Removed

- `sensor.ambience_scene_updates` — replaced by per-scope logbook entries on
    each scope's pause switch (see above).
- The **Scope-level pause switch** setting — scope switches are now always on.

### Security

- The **diagnostics download** and the **AI bundle** now scrub more before they
    leave Home Assistant — both are meant to be safe to paste into a GitHub
    issue or an AI chat. Newly redacted: alarm/lock codes and other secrets in
    scene action parameters; sensitive exposed-action defaults (push tokens,
    message bodies, recipients); the rendered detail of a `state` condition that
    targets a person or device-tracker; the zone label of a multi-person "for
    duration" gate; and a person/device-tracker **entity id referenced directly
    by a scene's conditions** in the exported config (e.g. a `state` rule that
    tests where someone is, or an `unavailable` rule on a device-tracker) —
    previously the bare entity id slipped through the config dump even though
    its trace detail was already scrubbed.
- The trace **debug log** now records only the *names* of a scene action's
    parameters, never their values, so secrets such as alarm/lock codes or push
    tokens can't leak into a log that gets pasted into a bug report. (Debug
    logging is off by default; the full values remain available via the
    admin-only trace view.)

## [0.30.0] - 2026-06-26

### Changed

- Scene actions are once again targeted by picking specific entities, scoped to
    the scene's area or floor. The entity/device/area/floor/label target picker
    added in 0.29.0 has been removed — Home Assistant's native target picker
    could not be limited to the scene's scope, which made it confusing to know
    what an action would actually affect. Any action saved with the newer target
    format is converted back to a plain entity list automatically the next time
    the integration loads.
- The Unavailable condition now has the highest precedence of all conditions —
    above Script and Template. When two scenes are otherwise equally specific,
    the one that guards on an entity being unavailable, unknown, or missing now
    sorts first and wins, because whether an entity is observable at all is the
    most fundamental fact a scene can match on.

### Fixed

- Ambience's built-in turn-on/turn-off and safe-cover services no longer log a
    Home Assistant deprecation warning ("The deprecated argument hass was passed
    to async_extract_entity_ids"). This also keeps those services working on
    Home Assistant 2026.10, which removes the deprecated call.

## [0.29.0] - 2026-06-26

### Added

- The safe cover actions — Open cover, Close cover, Set cover position, and Set
    cover tilt — are now seeded as default actions on new installs, so covers
    work in scenes out of the box.
- The Actions settings page now shows a dismissible recommendation to install
    the Fado Light Fader integration (smooth light fading with automatic
    brightness restoration) when it isn't already installed.
- The Lux condition now has an "is / is not" choice, so a scene can match when
    your light sensors are *not* in a chosen range — for example, blocking a
    scene until the room is no longer bright.

### Changed

- In the Lux and Occupancy conditions, the "Any of / All of" selector now sits
    above the sensor list (and only appears when more than one sensor is
    chosen), and their summaries read more naturally — e.g. "Any of (Lounge,
    Hall) is bright", "All of (Lounge, Hall) are detected", "Lounge is
    unavailable".
- The Advanced settings tab now has a clearer visual hierarchy. Section titles
    stand out from their fields, the two setting groups are more obviously
    separated, and the voice-assistant toggles are presented as a nested
    sub-section of the scope-level pause switch (their switches still line up
    with the fields above).

### Removed

- The admin-only `ambience.apply_scene` action — for calling Ambience from your
    own automations and scripts — has been removed. Automatic scene application
    (as conditions change) and the panel's Run / apply controls are unaffected;
    only the standalone service is gone.

### Fixed

- When overriding a built-in time-of-day period (e.g. "Dawn") or lux range, the
    name field now defaults to the range's current name instead of starting
    blank with only the "e.g. Wind down" placeholder. You can still rename it or
    clear it.

## [0.28.0] - 2026-06-25

### Added

- In the Entity State condition, each AND/OR group now has a "(…)" button that
    wraps all of that group's clauses in parentheses, so you can combine them
    with another clause under a different operator — for example turning "a AND
    b" into "(a AND b) OR c".

### Changed

- Condition summaries now prefix each entity with its area (e.g. "Kitchen ·
    Water pump Flow"), so clauses that reference similarly-named entities in
    different areas are no longer ambiguous. The area is omitted when the
    entity's name already contains it (e.g. an entity called "Zone Shower" in
    the "Shower" area stays "Zone Shower").
- In the Entity State condition, the buttons that add another comparison within
    the same condition now read "Add clause" instead of "Add condition", to
    avoid confusion with the main "Add condition" button that adds a new
    condition.
- A blocking scene whose condition is an OR now reads as "Block while … OR until
    …" instead of a hard-to-parse double negative. For example, a block that
    read "Block while NOT (Zone Shower is Clear for ≥5s) OR Water pump Flow > 5"
    now reads "Block while Water pump Flow > 5 OR until Zone Shower is Clear for
    ≥5s".

### Fixed

- In the Entity State condition, "Add clause" now works on a negated (NOT)
    group. Previously, clicking it while NOT was enabled did nothing until you
    turned NOT off.
- Config health now flags an entity referenced by a scene when that entity is
    disabled (e.g. its device was disabled) rather than deleted. A disabled
    entity stays in the entity registry but has no state, so it can never
    satisfy a condition; it is now reported as missing in both the scene problem
    flag and the Repairs issue, instead of being silently treated as present.

## [0.27.0] - 2026-06-24

### Changed

- In the Simulate panel, an entity attribute that has a known set of values
    (such as a remote's current activity) is now editable via a dropdown of
    those values — matching the scene editor — instead of a free-text field.

### Fixed

- The state value dropdown (in the scene editor and the simulator) now offers
    both On and Off for remote, automation, script, siren, humidifier, update
    and calendar entities, instead of only the entity's current state.
- On phones the Simulate panel no longer squashes the entity name into a narrow
    column or scrolls sideways — each row's controls now wrap onto their own
    line.
- Deleting the Ambience integration now also removes its stored data (scenes,
    scopes, switch and condition settings). Previously this data was kept on
    disk, so removing and re-adding the integration silently restored all your
    old settings instead of starting fresh. A reload or Home Assistant restart
    still preserves your data as before — only an explicit delete clears it.
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
    memory. Use the Undo and Redo buttons at the top of the panel — or Ctrl/⌘+Z
    and Ctrl/⌘+Shift+Z — to step back and forward through add, edit, delete,
    reorder, unpin and enable/disable changes. A caption beside the buttons
    always names the next change. The history is shared across browser tabs
    (which refresh automatically when you change scenes elsewhere) and clears
    when Home Assistant restarts.

## [0.25.0] - 2026-06-22

### Added

- Live scene indicator: each scene in the panel now shows a small dot for its
    live state — a green dot on the scene that currently matches, and a hollow
    dot on a scene whose actions are still applied but no longer match. It
    updates automatically; tap a dot for an explanation.

### Fixed

- Long scene conditions and scope names now wrap inside the card on narrow and
    mobile screens, instead of overflowing and pushing the toggle and menu off
    the right edge.

## [0.24.0] - 2026-06-21

### Fixed

- Scene updates sensor is now filterable in the Home Assistant logbook.
