# Getting started

This walkthrough sets up lighting automation for one room and adds scenes one at a time. Each step introduces exactly one new idea. By the end you will understand how scenes work, why their order matters, and how Ambience picks which one to apply — without needing to read the Concepts pages first.

The room used throughout is a living room, but the approach is the same for any area.

---

## Opening the panel

Open the Ambience panel from the Home Assistant sidebar. The panel lists every scope in your home: a **House** row at the top, then one row per floor (prefixed "Floor: "), then one row per area (prefixed "Area: "). Each row shows a summary — "not configured" until you add scenes — and a toggle switch that lets you pause Ambience for that scope.

Find your living room in the list. Click its row header to expand it.

!!! info "📷 Screenshot"
    The main panel with the "Area: Living room" row expanded, showing an empty scene list and the "+ Add scene" button.

---

## Layer 1 — empty room: turn the lights off

The simplest possible scene: when nobody is in the room, switch the lights off.

1. Click **+ Add scene** inside the living room row. The scene editor opens as a side panel.
2. Click the name field (it shows "New scene") and type a name — for example, **Empty**.
3. Under the **When** heading, click **+ Add condition…** and choose **People**. A condition row appears, pre-set to "Everybody is at Home". Click the row to open it and change the mode to **Nobody** (and set the location to the living-room zone if you have one, or leave it as "Home" to cover the whole house).
4. Under the **Actions** heading, click **+ Add action…** and choose your light-off service (for example "Turn off light"). Select the living-room lights as the target.
5. Click **Save scene**.

Ambience now monitors the People condition. Whenever nobody is in the configured location, this scene applies and the lights go off.

!!! info "📷 Screenshot"
    The scene editor with the People condition open, the mode set to "Nobody" and the location set to the living-room zone.

---

## Layer 2 — someone home in the evening: warm, low light

Add a second scene for occupied evenings.

1. Click **+ Add scene** again and name it **Evening**.
2. Add a **People** condition — this time leave it on **Everybody** or switch it to **Anybody** (someone is present).
3. Add a **Time of day** condition. Click the row and select the **Evening** period. Evening runs from sunset to dusk; if you also want to cover late nights, add **Nighttime** (dusk until dawn) to the same condition — you can select multiple periods.
4. Add a light action set to a warm, dim brightness (for example 20 % at 2700 K).
5. Click **Save scene**.

### How scenes are tried

Your living room now has two scenes. Ambience works through them from the top of the list to the bottom. The first scene whose conditions all pass is the one that applies — the remaining scenes are skipped.

Order therefore matters. "Empty" should sit above "Evening" so that the lights-off instruction wins whenever the room is empty, regardless of the time.

If Ambience put "Evening" first and found someone was home in the evening, it would apply "Evening" — and never even check "Empty". With "Empty" first, an empty room is caught immediately.

Drag the rows to reorder them if needed.

!!! info "📷 Screenshot"
    The living room scope showing two scenes: "Empty" at the top, "Evening" below it. The scene list shows each scene's condition summary.

---

## Layer 3 — daytime: brighter, and brighter still when it is overcast

During the day you probably want more light. When the sky is dull you want even more. Two scenes handle this, sitting one above the other.

**Scene: Sunny day**

1. Click **+ Add scene** and name it **Sunny day**.
2. Add a **People** condition — someone present.
3. Add a **Time of day** condition and select **Daytime** (dawn until sunset).
4. Add a **Weather** condition. Open the condition and pick a group that represents good weather (for example **Sunny**), or add a numeric threshold (such as humidity or temperature) if you prefer.
5. Add a light action at a moderate daytime brightness (for example 70 %).
6. Click **Save scene**.

**Scene: Dull day**

1. Click **+ Add scene** and name it **Dull day**.
2. Add the same **People** and **Time of day** (Daytime) conditions.
3. Add a **Weather** condition set to overcast or low-light conditions.
4. Add a light action at a higher brightness (for example 90 %) to compensate.
5. Click **Save scene**.

Place both of these below "Empty" but above "Evening" in the list. Because the first match wins, only one of the two daytime scenes will apply at any moment — whichever one's weather condition passes first. If neither daytime scene matches (because it is not daytime), Ambience moves on to "Evening".

!!! info "📷 Screenshot"
    The scene editor with a Weather condition open, showing the condition groups (Sunny, Dim, Dark, Wet, Windy).

---

## Layer 4 — projector on: film mode

Sometimes you want a scene that overrides everything else. When the projector is running, close the blinds, dim the main lights, and leave the side lights on low.

1. Click **+ Add scene** and name it **Film**.
2. Add an **Entity state** condition. Select your projector or media player entity and set the expected state (for example, `playing` or `on`).
3. Add multiple actions:
    - Close the blinds (a cover service).
    - Dim the main lights (for example 5 % brightness).
    - Set the side lights to a low warm level (for example 10 % at 2200 K).
4. Click **Save scene**.
5. Drag the **Film** scene to the very top of the list.

Because Film sits first, Ambience checks it before anything else. The moment the projector turns on, Film wins and all three actions run together. When the projector stops, Film's condition no longer passes, and Ambience falls through to whichever other scene matches the current time and occupancy.

!!! info "📷 Screenshot"
    The scene editor for "Film" showing three action rows: one for the blind, one for the main lights, one for the side lights.

---

## What you now have

One room. Several scenes. Tried from the top of the list downward. The first one whose conditions all pass is applied automatically.

```
Film          ← projector on → dim lights, close blinds, low side light
Empty         ← nobody home  → lights off
Dull day      ← daytime, overcast, someone home → 90 % brightness
Sunny day     ← daytime, sunny, someone home    → 70 % brightness
Evening       ← evening or night, someone home  → warm, dim light
```

Ambience re-evaluates this list whenever any of the tracked inputs change — occupancy, time of day, weather, or entity state. You do not need automations, helpers, or `input_boolean` flags. Each scene is self-contained: name, conditions (the "when"), actions (the "then").

To learn exactly how scenes, categories, and the resolution order fit together, see [Scenes & resolution](concepts/scenes-and-resolution.md). To understand why a particular scene was (or was not) applied, see [Tips & testing](tips-and-testing.md), which covers the trace viewer that shows Ambience's decision for every evaluation.
