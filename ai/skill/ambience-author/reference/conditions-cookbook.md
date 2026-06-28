# Conditions cookbook

This is the most important file for **authoring**. It maps plain-English intent
to the exact predicate JSON, for every built-in condition. Read this when
you turn a user's words into a scene's `when` map.

How to use it:

- Each condition has a short shape reminder, then **intent → predicate** rows.
- A condition key that is **absent**, or whose value is **`null`**, is a
  **wildcard** (matches anything). Only add a condition when it constrains.
- A scene matches when **every** listed condition matches (logical AND). To "OR"
  two situations, write **two scenes**.
- For exhaustive field types / defaults / validation, see the generated
  [condition-reference.generated.md](condition-reference.generated.md). For the
  scene/`when` overview, see [schema.md](schema.md).
- Always use the **real entity ids, zone ids, sensor ids and category ids from
  the user's AI bundle** — the examples below use placeholder ids.

A note on **`for` durations** (used by `state`, `people`, `occupancy`): the
duration is `{ h, m, s }` (each a non-negative int; omit a component for 0). It
gates how long the condition's *test* has been continuously true. The optional
`for_mode` is `"at_least"` (default — held **≥** the duration) or `"less_than"`
(held **<** the duration). Omit `for`/`for_mode` for an instant test.

---

## state — entity state & attributes

The most general condition: a boolean expression tree over entity states (or
attributes), with optional `for`.

**Shape.** A predicate is one node of a tree:

```jsonc
// atom — a single test
{ "kind": "is" | "is_not" | ">" | ">=" | "<" | "<=",
  "entity_id": "light.kitchen",
  "attribute": "color_temp",     // optional; compare this attribute instead of the state
  "states": ["on"],              // membership list for is/is_not; a single numeric string for >,>=,<,<=
  "for": { "m": 5 },             // optional duration
  "for_mode": "at_least" }       // optional; "at_least" (default) | "less_than"

// group — combine children
{ "kind": "and" | "or", "items": [ <node>, <node>, ... ] }

// negation — invert one child
{ "kind": "not", "item": <node> }
```

- For `is` / `is_not`, `states` is a list of state **strings**; the test is set
  membership. (`is_not` = not in the set.)
- For `>` `>=` `<` `<=`, `states` is **exactly one** value, a **number written as
  a string** (e.g. `["21"]`), compared numerically against the state (or
  attribute) parsed as a float.
- An unavailable/unknown/absent entity makes its atom **unobservable**, which
  never matches and never inverts under `not` (so `not(light is on)` will not
  fire while the light is unavailable).

**Intent → predicate**

| Intent | Predicate (value of `when.state`) |
|---|---|
| TV is on | `{ "kind": "is", "entity_id": "media_player.tv", "states": ["on", "playing"] }` |
| Front door is open | `{ "kind": "is", "entity_id": "binary_sensor.front_door", "states": ["on"] }` |
| Thermostat NOT in heat mode | `{ "kind": "is_not", "entity_id": "climate.hall", "states": ["heat"] }` |
| Media player is playing or paused | `{ "kind": "is", "entity_id": "media_player.lounge", "states": ["playing", "paused"] }` |
| Temperature above 24° | `{ "kind": ">", "entity_id": "sensor.living_temp", "states": ["24"] }` |
| Humidity at or below 40% | `{ "kind": "<=", "entity_id": "sensor.humidity", "states": ["40"] }` |
| Thermostat **target** temp ≥ 21° (an attribute) | `{ "kind": ">=", "entity_id": "climate.hall", "attribute": "temperature", "states": ["21"] }` |
| Light has been on for 5 minutes | `{ "kind": "is", "entity_id": "light.porch", "states": ["on"], "for": { "m": 5 } }` |
| Door open for **less than** 30 seconds | `{ "kind": "is", "entity_id": "binary_sensor.door", "states": ["on"], "for": { "s": 30 }, "for_mode": "less_than" }` |
| TV on **AND** it's a workday (state part only) | `{ "kind": "is", "entity_id": "media_player.tv", "states": ["on"] }` (put the workday test in `when.day`, not here) |
| Either bedroom light is on (OR) | `{ "kind": "or", "items": [ {"kind":"is","entity_id":"light.bed_l","states":["on"]}, {"kind":"is","entity_id":"light.bed_r","states":["on"]} ] }` |
| Heater on **and** window open | `{ "kind": "and", "items": [ {"kind":"is","entity_id":"switch.heater","states":["on"]}, {"kind":"is","entity_id":"binary_sensor.window","states":["on"]} ] }` |
| NOT (any kid's room occupied) | `{ "kind": "not", "item": {"kind":"or","items":[ {"kind":"is","entity_id":"binary_sensor.kid1","states":["on"]}, {"kind":"is","entity_id":"binary_sensor.kid2","states":["on"]} ]} }` |

> **AND / OR / NOT.** Prefer flat groups: `and`/`or` take an `items` list of two
> or more nodes; `not` wraps a single `item`. You can nest groups arbitrarily
> (`and` of `or`s, etc.). A single-child group is collapsed on save, so write at
> least two items per group. Cross-**condition** AND is automatic (every `when`
> key must pass) — only use a `state` `and`-group to combine multiple *entity*
> tests.

---

## people — who is (not) home / in a zone

**Shape.**

```jsonc
{
  "who": ["person.alice", "person.bob"], // optional; empty/absent = ALL tracked persons
  "quant": "any" | "everyone" | "nobody",// default "any"
  "where": "home" | "zone.work",         // the POSITIVE location; default "home"
  "negate": false,                       // optional; true = NOT at `where`
  "for": { "m": 10 },                    // optional duration
  "for_mode": "at_least"                 // optional
}
```

- `quant`: `any` (at least one), `everyone` (all of them), `nobody` (none of
  them).
- `where` is the location the quantifier is tested **at**. `negate: true` inverts
  the location test ("not at `where`").
- `where` is `"home"` or a `zone.*` entity id. `who` entries must be `person.*`
  ids.

**Intent → predicate**

| Intent | Predicate (value of `when.people`) |
|---|---|
| Somebody is home | `{ "quant": "any", "where": "home" }` |
| Everybody is home | `{ "quant": "everyone", "where": "home" }` |
| Nobody is home (house empty) | `{ "quant": "nobody", "where": "home" }` |
| Nobody home for 10 minutes | `{ "quant": "nobody", "where": "home", "for": { "m": 10 } }` |
| At least one person is away | `{ "quant": "any", "where": "home", "negate": true }` |
| Alice or Bob is at work | `{ "who": ["person.alice","person.bob"], "quant": "any", "where": "zone.work" }` |
| Alice is home | `{ "who": ["person.alice"], "quant": "everyone", "where": "home" }` |
| Everyone is out (nobody home) for 30 min | `{ "quant": "nobody", "where": "home", "for": { "m": 30 } }` |
| All tracked people are at school | `{ "quant": "everyone", "where": "zone.school" }` |

> "Nobody home" keeps counting its `for` while a person moves between two *away*
> zones — the test "not home" stays true. It only resets when someone actually
> arrives home.

---

## occupancy — presence / motion sensors

Like `people` but over `binary_sensor.*` (motion / occupancy / presence).

**Shape.**

```jsonc
{
  "sensors": ["binary_sensor.lounge_motion"], // empty/absent = match-anything (wildcard!)
  "occupied": true,                           // default true; false = vacant
  "quant": "any" | "all",                     // default "any"
  "for": { "m": 15 },                         // optional duration
  "negate": false                             // optional; inverts the whole match (incl. for)
}
```

- **`sensors` empty = wildcard** (matches anything). You must list sensors for
  the condition to constrain.
- `occupied: true` tests sensors are `on`; `false` tests they are `off` (vacant).
- `quant: any` = at least one sensor matches; `all` = every listed sensor
  matches.
- `negate` wraps the whole match — e.g. `negate` of "vacant for 20m".

**Intent → predicate**

| Intent | Predicate (value of `when.occupancy`) |
|---|---|
| Lounge is occupied | `{ "sensors": ["binary_sensor.lounge_motion"], "occupied": true }` |
| Lounge has been vacant for 15 min | `{ "sensors": ["binary_sensor.lounge_motion"], "occupied": false, "for": { "m": 15 } }` |
| Any of these motion sensors active | `{ "sensors": ["binary_sensor.hall","binary_sensor.stairs"], "occupied": true, "quant": "any" }` |
| All bedroom sensors vacant for 30 min | `{ "sensors": ["binary_sensor.bed1","binary_sensor.bed2"], "occupied": false, "quant": "all", "for": { "m": 30 } }` |
| Motion seen in the last 2 minutes (occupied < 2m) — use a `for`/`for_mode` pair | `{ "sensors": ["binary_sensor.hall"], "occupied": true, "for": { "m": 2 }, "for_mode": "less_than" }` |

---

## day — date / weekday / workday

**Shape.** An object with `include` and `exclude` lists of day-items. The day
matches when (no `include`, or any include item matches) **and** (no `exclude`
item matches).

```jsonc
{ "include": [ <day-item>, ... ], "exclude": [ <day-item>, ... ] }
```

**Day-item kinds:**

| kind | shape | meaning |
|---|---|---|
| `weekday` | `{ "kind": "weekday", "days": [0,1,2,3,4] }` | days are 0=Mon … 6=Sun |
| `day_of_month` | `{ "kind": "day_of_month", "days": "1-10, 15" }` | a string spec of days/ranges (1–31) |
| `date` | `{ "kind": "date", "month": 12, "day": 25 }` | a specific annual date |
| `date_range` | `{ "kind": "date_range", "from": {"month":12,"day":20}, "to": {"month":1,"day":5} }` | inclusive; wraps year-end |
| `last_day` | `{ "kind": "last_day" }` | the last day of the month |
| `workday` | `{ "kind": "workday" }` | needs the Workday sensor configured |
| `holiday` | `{ "kind": "holiday" }` | a non-workday (Workday sensor off) |
| `first_workday` | `{ "kind": "first_workday" }` | first workday of the month (needs Workday calendar) |
| `last_workday` | `{ "kind": "last_workday" }` | last workday of the month (needs Workday calendar) |

**Intent → predicate**

| Intent | Predicate (value of `when.day`) |
|---|---|
| Weekdays (Mon–Fri) | `{ "include": [ {"kind":"weekday","days":[0,1,2,3,4]} ] }` |
| Weekends | `{ "include": [ {"kind":"weekday","days":[5,6]} ] }` |
| Any workday | `{ "include": [ {"kind":"workday"} ] }` |
| Holidays / non-workdays | `{ "include": [ {"kind":"holiday"} ] }` |
| Christmas Day | `{ "include": [ {"kind":"date","month":12,"day":25} ] }` |
| The festive season (Dec 20 – Jan 5) | `{ "include": [ {"kind":"date_range","from":{"month":12,"day":20},"to":{"month":1,"day":5}} ] }` |
| First ten days of the month | `{ "include": [ {"kind":"day_of_month","days":"1-10"} ] }` |
| The last day of the month | `{ "include": [ {"kind":"last_day"} ] }` |
| Weekdays **except** public holidays | `{ "include": [ {"kind":"weekday","days":[0,1,2,3,4]} ], "exclude": [ {"kind":"holiday"} ] }` |
| Payday (last workday of the month) | `{ "include": [ {"kind":"last_workday"} ] }` |

> `workday`/`holiday` need the user's Workday **sensor** configured; `first_workday`/
> `last_workday` need a Workday **calendar**. If unconfigured, these items don't
> match (and the panel flags it). The AI bundle indicates whether they're set up.

---

## time_of_day — periods, clock ranges, sun-anchored ranges

**Shape.** One of:

```jsonc
{ "period": "evening" }                              // a named period id
{ "from": <endpoint>, "to": <endpoint> }             // an explicit range
[ { "period": "morning" }, { "from": ..., "to": ... } ] // a LIST = match if ANY item matches
```

Endpoints are either a clock time or a sun anchor:

```jsonc
{ "kind": "time", "hh": 22, "mm": 30 }               // local clock; hh 0–23, mm 0–59
{ "kind": "sun", "anchor": "sunset", "offset_min": -30,  // anchor + minutes offset
  "clamp": { "dir": "not_before", "hh": 18, "mm": 0 } }  // optional clamp to a clock time
```

- Sun `anchor` is one of `sunrise`, `sunset`, `noon`, `midnight`, `dawn`, `dusk`.
- `offset_min` shifts the anchor by N minutes (negative = earlier). Optional
  (default 0).
- `clamp` (optional) bounds a sun endpoint by a clock time: `not_before` =
  `max(anchor, time)`, `not_after` = `min(anchor, time)`.
- A `from`/`to` range where `to` is at or before `from` is an **overnight wrap**
  (e.g. 22:00 → 06:00 spans midnight).

**Built-in period ids:** `dawn`, `morning`, `afternoon`, `evening`, `nighttime`,
`daytime` (all sun-anchored — `evening` = sunset→dusk, `nighttime` =
sunset→sunrise, `daytime` = sunrise→sunset, etc.). Users may add custom periods;
check the AI bundle.

**Intent → predicate**

| Intent | Predicate (value of `when.time_of_day`) |
|---|---|
| In the evening | `[ { "period": "evening" } ]` |
| During the day | `[ { "period": "daytime" } ]` |
| At night | `[ { "period": "nighttime" } ]` |
| After sunset | `{ "from": {"kind":"sun","anchor":"sunset","offset_min":0}, "to": {"kind":"sun","anchor":"sunrise","offset_min":0} }` |
| 30 min before sunset until midnight | `{ "from": {"kind":"sun","anchor":"sunset","offset_min":-30}, "to": {"kind":"time","hh":0,"mm":0} }` |
| 22:00 to 06:00 (overnight) | `{ "from": {"kind":"time","hh":22,"mm":0}, "to": {"kind":"time","hh":6,"mm":0} }` |
| Sunset, but never before 18:00 | `{ "from": {"kind":"sun","anchor":"sunset","offset_min":0,"clamp":{"dir":"not_before","hh":18,"mm":0}}, "to": {"kind":"time","hh":23,"mm":59} }` |
| Morning **or** evening | `[ { "period": "morning" }, { "period": "evening" } ]` |
| 09:00–17:00 | `{ "from": {"kind":"time","hh":9,"mm":0}, "to": {"kind":"time","hh":17,"mm":0} }` |

> Tip: a single `{period}` or `{from,to}` object is valid on its own, but wrapping
> it in a one-element list (`[ {...} ]`) is also valid and makes "or another
> window" easy to extend.

---

## weather — condition group + numeric thresholds

**Shape.**

```jsonc
{
  "groups": ["dim", "dark"],                  // weather-condition group ids; empty = any condition
  "thresholds": [                             // every threshold must hold
    { "attribute": "temperature", "op": ">=", "value": 25 }
  ]
}
```

- `groups` are **group ids** (not raw HA weather states). The integration ships
  default groups: `sunny`, `dim`, `dark`, `wet`, `windy`. Users may edit these;
  check the AI bundle's weather groups for the real ids + which HA conditions
  each covers.
- `thresholds` compare numeric weather attributes. Allowed `attribute`:
  `temperature`, `apparent_temperature`, `humidity`, `wind_speed`, `pressure`.
  Allowed `op`: `<`, `<=`, `>`, `>=`. `value` is a number.
- Matches when the current condition is in one of the selected groups (or
  `groups` is empty) **and** every threshold holds. Needs the user's weather
  entity configured (check the bundle).

**Intent → predicate**

| Intent | Predicate (value of `when.weather`) |
|---|---|
| It's wet outside (rain/snow) | `{ "groups": ["wet"] }` |
| It's dark/gloomy weather | `{ "groups": ["dark"] }` |
| Sunny weather | `{ "groups": ["sunny"] }` |
| Hot (≥ 28°C), any condition | `{ "groups": [], "thresholds": [ {"attribute":"temperature","op":">=","value":28} ] }` |
| Windy AND gusty (wind > 30) | `{ "groups": ["windy"], "thresholds": [ {"attribute":"wind_speed","op":">","value":30} ] }` |
| Humid (humidity > 70%) | `{ "groups": [], "thresholds": [ {"attribute":"humidity","op":">","value":70} ] }` |

---

## sun — solar elevation & azimuth

**Shape.** At least one of `elevation` / `azimuth`.

```jsonc
{
  "elevation": { "min": -6, "max": 10 },     // degrees [-90, 90]; either bound optional
  "azimuth": {
    "sectors": ["E", "SE"],                  // 8-point compass: N,NE,E,SE,S,SW,W,NW
    "ranges":  [ { "from": 90, "to": 180 } ] // custom circular arcs [0,360); from>to wraps
  }
}
```

- `elevation` is the sun's height in degrees (negative = below horizon).
- `azimuth` matches if the sun is in **any** selected sector **or** custom range.

**Intent → predicate**

| Intent | Predicate (value of `when.sun`) |
|---|---|
| Sun is up (above horizon) | `{ "elevation": { "min": 0 } }` |
| Sun is below the horizon (it's dark out) | `{ "elevation": { "max": 0 } }` |
| Civil twilight (sun -6° to 0°) | `{ "elevation": { "min": -6, "max": 0 } }` |
| Low sun glare from the east | `{ "elevation": { "min": 0, "max": 15 }, "azimuth": { "sectors": ["E","SE"] } }` |
| Sun shining on the west windows | `{ "azimuth": { "sectors": ["W","SW"] } }` |
| Sun in a specific arc (90°–180°) | `{ "azimuth": { "ranges": [ {"from":90,"to":180} ] } }` |

> Prefer `time_of_day` sun anchors (sunrise/sunset) for "after sunset"-style
> intent. Use `sun` when you need the actual angle — e.g. blind automation that
> reacts to glare.

---

## lux — ambient light level

**Shape.**

```jsonc
{
  "sensors": ["sensor.living_lux"],   // illuminance sensors; empty/absent = wildcard!
  "range": "dark",                    // a named lux range id  (XOR the inline band below)
  "min": 10, "max": 50,               // inline half-open band [min, max) — use range OR min/max
  "quant": "any" | "all",             // default "any"
  "negate": false                     // optional; inverts the whole match
}
```

- **`sensors` empty = wildcard.** List at least one (illuminance) sensor to
  constrain.
- Use **either** a named `range` **or** an inline `min`/`max` band — not both.
- Built-in range ids: `dark` (<10), `dim` (10–50), `normal` (50–300), `bright`
  (300–1000), `very_bright` (≥1000) lx. Users may add custom ranges; check the
  bundle.
- `quant: any` = at least one sensor in band; `all` = every listed sensor.

**Intent → predicate**

| Intent | Predicate (value of `when.lux`) |
|---|---|
| It's dark in here | `{ "sensors": ["sensor.living_lux"], "range": "dark" }` |
| It's bright | `{ "sensors": ["sensor.living_lux"], "range": "bright" }` |
| Below 30 lux (inline band) | `{ "sensors": ["sensor.living_lux"], "max": 30 }` |
| Between 50 and 300 lux | `{ "sensors": ["sensor.living_lux"], "min": 50, "max": 300 }` |
| It's **not** dark | `{ "sensors": ["sensor.living_lux"], "range": "dark", "negate": true }` |
| All rooms dark (every sensor) | `{ "sensors": ["sensor.a_lux","sensor.b_lux"], "range": "dark", "quant": "all" }` |

---

## unavailable — guard when an entity is down (advanced)

Matches when **any** listed entity is `unavailable`, `unknown`, or **missing**.
Use it as a fallback guard: a scene that activates only when a sensor you depend
on has dropped out.

**Shape.**

```jsonc
{ "entities": ["sensor.outdoor_lux", "binary_sensor.motion"] }  // at least one; any domain
```

**Intent → predicate**

| Intent | Predicate (value of `when.unavailable`) |
|---|---|
| Fall back when the lux sensor is down | `{ "entities": ["sensor.outdoor_lux"] }` |
| Any of these critical sensors offline | `{ "entities": ["binary_sensor.motion","sensor.temp"] }` |

> Common pattern: pair a primary scene `when: { lux: {...} }` with a fallback
> scene `when: { unavailable: { entities: [<the lux sensor>] } }` so the room
> still does something sensible when the sensor drops out.

---

## script — call a HA script returning {match: bool} (advanced)

Delegates the test to a user-written HA script. The script must end by returning
a response dict containing `match: true|false` (via `stop:` + `response_variable:`).

**Shape.**

```jsonc
{
  "script": "script.is_movie_time",        // a "script.<name>" id
  "args": { "threshold": 3 },              // optional; passed to the script as variables
  "triggers": ["sensor.network_clients"]   // optional; entities to re-evaluate on
}
```

- `triggers` lists the entities whose changes should re-run the scene — the
  script body is opaque to Ambience, so it can't infer dependencies itself.
- Anything other than `{match: true}` (false, error, timeout, missing key) = no
  match.

**Intent → predicate**

| Intent | Predicate (value of `when.script`) |
|---|---|
| Match my custom "movie time" logic | `{ "script": "script.is_movie_time", "triggers": ["media_player.tv"] }` |
| Custom test with arguments | `{ "script": "script.guests_present", "args": { "min_devices": 2 }, "triggers": ["sensor.connected_devices"] }` |

---

## template — a Jinja template rendered to a bool (advanced)

The flexible escape hatch. A Jinja2 template rendered against HA state; the
result is coerced to a bool the way HA does (`true`/`yes`/`on`/`1`/`enable` and
nonzero numbers → match; everything else, incl. `unknown`/`none`/empty → no
match).

**Shape.**

```jsonc
{ "template": "{{ states('sensor.power') | float(0) > 3000 }}" }
```

**Intent → predicate**

| Intent | Predicate (value of `when.template`) |
|---|---|
| Power draw over 3 kW | `{ "template": "{{ states('sensor.power') \| float(0) > 3000 }}" }` |
| Average of two temps below 18° | `{ "template": "{{ ((states('sensor.t1')\|float + states('sensor.t2')\|float) / 2) < 18 }}" }` |
| More than 5 lights on | `{ "template": "{{ states.light \| selectattr('state','eq','on') \| list \| count > 5 }}" }` |

> Prefer a built-in condition where one fits — templates are opaque to Ambience's
> trigger engine (it watches the entities the template references, but broad
> templates that scan whole domains force conservative re-evaluation). Reach for
> `template` only when no built-in expresses the test.

---

## Combining conditions

Multiple `when` keys are ANDed. Example — "in the evening, when it's dark, and
someone is home":

```yaml
when:
  time_of_day: [{ period: evening }]
  lux: { sensors: [sensor.living_lux], range: dark }
  people: { quant: any, where: home }
```

To express an **OR across whole situations**, author two scenes. The engine
evaluates the more **specific** one first — the scene matching a *subset* of
situations — so a narrower scene beats a broader one, and a catch-all (empty
`when`, which matches everything) always sorts last. You do **not** control this
with list order. A broad rule that must beat more-specific scenes (an
override/blocker) instead needs the user to **pin** it to the top in the panel —
see `schema.md` → *How scenes are chosen*.

---

## Patterns

### Don't decide while a cover is moving (the "settle" blocker)

Covers (blinds, shades, garage doors) have **transitional** states — `opening`
and `closing` — between their final states `open` and `closed`. A scene group that
reacts to or controls a blind can otherwise fire **mid-movement** and fight the
cover (re-deciding off a half-open position, or interrupting a move). When a group
involves blinds, add a **no-op blocker at the top** that matches while *any* of its
covers is in transit, so the cascade stops there and the deciding scenes only run
once every blind has **settled** in its final position:

```yaml
- name: Wait for blinds to settle
  category: <the group's category>
  when:
    state:
      kind: or
      items:
        - { kind: is, entity_id: cover.living_room, states: [opening, closing] }
        - { kind: is, entity_id: cover.bedroom, states: [opening, closing] }
  actions: []        # no actions → matches but does nothing; the cascade stops here
```

- `actions: []` makes it a **pure blocker** — while it wins, nothing else in the
  group runs, so no decision is made until the move finishes.
- It must sit **above** the deciding scenes. A blocker is not more *specific* than
  them, so containment won't float it up on its own — have the user **pin** it to
  the top (Scopes view), per `schema.md` → *How scenes are chosen*.
- Once every listed cover reaches `open`/`closed`, the blocker stops matching and
  the scene below it that fits the settled situation wins.
