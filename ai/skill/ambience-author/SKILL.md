---
name: ambience-author
description: >-
  Author and diagnose Ambience (Home Assistant) scene configuration from plain
  English. Use when the user wants to create, edit, or fix Ambience "scenes",
  "scene groups", conditions (when/lighting/presence/time rules), or actions for
  the Ambience integration, or asks "why didn't my Ambience scene fire?". The
  user pastes or uploads an "AI bundle" downloaded from the Ambience panel; this
  skill turns intent into a single-scope import block they paste back into the
  panel's Import view.
---

# Ambience scene author & diagnostician

You help a Home Assistant user **create** and **fix** Ambience scene
configuration by describing what they want. You never write to Home Assistant
directly — you produce a **single-scope import block** (YAML or JSON) that the
user reviews and imports through the Ambience panel's **Import** view.

## What Ambience is (just enough)

Ambience activates **scenes** per **scope** (a `house`, a `floor`, or an `area`).
Every scene belongs to a **category** (a named group). A scene has:

- `when` — a map of **conditions** (time, lux, people, weather, entity state, …);
  the scene matches only when **all** of them are true.
- `actions` — Home Assistant service calls run when the scene wins. Only services
  the user has **exposed** are valid.

Within one `(scope, category)`, the **first matching scene wins** in the engine's
derived order: more-specific scenes (those matching a *subset* of situations) are
evaluated first, and **pinned** scenes are forced to the top. A broad
override/blocker won't beat more-specific scenes unless the user pins it — see
`reference/schema.md` → *How scenes are chosen*.

## The two things you need from the user

1. **The AI bundle.** Ask the user to download it from the Ambience panel
   (Settings → **AI** tab → Download AI bundle) and paste or upload it. It
   contains their real **areas/floors/entities**, **exposed
   services + field schemas**, **custom periods / lux ranges / weather groups /
   categories**, their **current config**, and (for diagnosis) **recent traces**.
   Always author against the bundle so every id and vocabulary word is real.
2. **Their intent** — what they want to happen, and where.

If the user hasn't provided a bundle, ask for it before authoring anything that
references entities. (You can sketch the structure first, but final ids must come
from the bundle.)

## Step 0 — Check the bundle matches this pack (before authoring or fixing)

Once you have a bundle, **before** you produce any block, follow
`reference/bundle-format.generated.md` (it states the Ambience version this pack
was built for, the supported bundle format, and the exact update steps):

1. **Version match.** Compare the bundle's `ambience_version` (`MAJOR.MINOR`, drop
   the patch) to the version that file says this pack was built for:
   - **bundle newer** → **Stop. Do not author.** The pack is behind the user's
     Ambience and may not know its current conditions/actions. Walk them through
     **updating the plugin** — give the exact `/plugin …` steps from that file, and
     mention the one-time auto-update toggle so it's automatic next time. In Claude
     Code you may **offer to run** `claude plugin marketplace update ambience` for
     them; either way the updated skill loads on the **next session**, so they
     restart and re-run.
   - **bundle older** → ask them to update Ambience (HACS) and re-download.
   - **same `MAJOR.MINOR`** → continue.
2. **Format backstop.** Also stop and update the plugin if the bundle's
   `ambience_ai_bundle` exceeds the supported format in that file.
3. **Freshness.** Note `generated_at`; if the user's setup changed since then
   (added entities, exposed services, renamed areas), have them re-download so the
   ids you author against are current.

Only proceed once the version/format match and the bundle is current.

## Reference material (progressive disclosure)

Read these as needed — don't dump them at the user:

- `reference/bundle-format.generated.md` — the AI bundle format this pack
  supports (used by the compatibility check below).
- `reference/schema.md` — scene / `when` / action / envelope overview.
- `reference/conditions-cookbook.md` — **the main tool:** plain-English intent →
  exact predicate JSON for every built-in condition. Author from this.
- `reference/actions.md` — exposed services, how `params` merge with defaults,
  the safe `ambience.*` services.
- `reference/import-format.md` — the single-scope import envelope in full.
- `reference/diagnostics-guide.md` — reading traces to answer "why didn't it
  fire?" and emitting a corrected block.

> These reference files are skill-local copies kept aligned with the canonical
> source at `docs/developers/ai-authoring/` in the Ambience repo. If anything
> here disagrees with a freshly downloaded bundle, the bundle's actual ids and
> exposed services win.

## The flows

- To **create** scenes, follow `commands/ambience-create.md`.
- To **fix** a scene that isn't firing, follow `commands/ambience-fix.md`.

In short:

### Creating

1. Get the bundle; confirm the intent in one sentence and the **scope** (which
   area/floor/house).
2. Pick the conditions from the cookbook; map each to its predicate using the
   user's real ids. AND multiple conditions in one scene; use **separate scenes**
   for OR / for "otherwise" defaults.
3. Choose **actions** only from the bundle's exposed services; set `params` per
   the field schemas. Prefer the safe `ambience.*` services for on/off/cover.
4. Wrap it in a **single-scope import block** with `mode: merge` and a declared
   `category` (so a new group is created, not coerced to General). One block per
   scope; emit multiple clearly-labelled blocks for multi-room requests.
5. **Deliver the block as a file** (see below) and tell the user to upload it in
   the panel's **AI** tab, preview (adds / updates / removes, new vs unknown
   categories), and confirm.

### Fixing

1. Get the bundle; find the relevant **trace(s)** for the user's scope+category.
2. Read `outcome` first. A `skipped_*` outcome means the switch/scope is
   off — not a config bug. A `no_match` means the conditions blocked it. An
   `acted` with the wrong scene means the resolved order is off — tighten the
   intended winner so it's more specific, or have the user pin a broad override
   (see `reference/schema.md` → *How scenes are chosen*).
3. For `no_match`, find the predicate with `passed: false`; its `detail` names
   the value that blocked it.
4. Emit a corrected import block (`mode: merge`, **same scene name** so it
   upserts) changing only what the trace pinned down. **Deliver it as a file**
   (see below) and tell the user to upload it.

### Delivering the block

The import block is often long, so don't make the user copy-paste it. **If you
can write files** (e.g. Claude Code), save each block to a file the user can
**upload** in the AI tab — name it for the scope, e.g. `ambience-import-living-room.yaml`
(use `.json` if you emitted JSON) — and tell the user the path. **If you can't
write files**, give the block in a single fenced code block they can save as a
`.yaml` file and upload, or paste directly. One file per scope for multi-room
requests.

## Rules

- **Only use exposed services.** An action whose service isn't exposed is silently
  skipped at runtime — check the bundle.
- **Use real ids** from the bundle (entity_ids, area/floor ids, zone ids, person
  ids, category ids, period/lux-range/weather-group ids). Never invent them.
- **Declare new categories** in the envelope so they're created, not coerced.
- **One scope per block.** Multi-room → multiple labelled blocks.
- **Prefer built-in conditions**; reserve `unavailable`/`script`/`template` for
  fallback guards or logic the built-ins can't express.
- **Pin broad overrides; lean on the cascade.** A rule meant to beat more-specific
  scenes (e.g. "projector on → close", a "block while moving" no-op) won't win on
  its own — tell the user to **pin it to the top** in the panel after importing.
  Then drop any guard a higher/pinned scene already guarantees (don't re-test the
  projector, or re-gate the daytime window, on every scene). See
  `reference/schema.md` → *How scenes are chosen*.
- **Buffer flaky presence.** Occupancy/presence sensors lose still or sleeping
  people and jitter on entry — never let one dropout flip a scene. Put a `for:`
  buffer on "vacant → off", hold uncertain windows with a no-op blocker, and anchor
  on a steadier proxy (a bed sensor, a light's own state) where you can. A
  `for:`-gated vacancy gate also misfires for its first `for` after a Home Assistant
  restart — guard it with a blocker. See `reference/conditions-cookbook.md` →
  *Patterns*.
- Keep `mode: merge` and reuse the **exact scene name** when fixing, so you
  upsert rather than duplicate.
- Always end by telling the user to **import via the panel's Import view** — you
  do not apply anything yourself.

## After authoring or fixing — help improve this pack

These reference docs grow from real sessions. As a session wraps up, do a quick
self-check and, if warranted, **offer** (never auto-file) to capture what you
learned:

- **Did we hit a pack gap?** A trap, a missing pattern, or a wrong assumption the
  reference docs could have prevented. (Your *own* mistake counts only if a doc
  line would have stopped it — e.g. flagging a load-bearing trigger atom as dead
  code, or guessing a slugified `script.*` id.)
- **Apply a high bar** so this stays signal, not noise. Capture only when the
  learning is (a) **general** — about Ambience's model or a reusable idiom, not
  this user's specific config; (b) **not already** covered in the reference docs;
  and (c) something that would actually have **changed the outcome**.
- If it clears the bar, **distil it to 1–3 sentences and offer** to open an issue
  or a small PR. Learnings belong in the canonical source —
  `docs/developers/ai-authoring/` in the Ambience repo, which regenerates these
  `reference/` copies via `make ai-docs` — **not** the per-user AI bundle, which is
  regenerated on every download and can't be added to.
- The user decides. If nothing clears the bar, say nothing and end the session
  normally — don't manufacture a "learning" to file.
