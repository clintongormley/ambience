# Introduction

![Ambience](assets/logo-light.svg)

Ambience is a **condition-based scene engine** for Home Assistant. You describe scenes for a room (_"Room is empty"_,
_"Movie time"_), along with the conditions under which each scene should apply (_"Projector is turned on"_, _"Person in
room"_, _"Daytime"_, _"Cloudy weather"_). Ambience watches your home and applies the best-matching scene automatically.

## The problems with Scenes

Home Assistant already has a concept called Scenes.

- They describe the desired state of the devices in the room, not how those devices should reach that state.
- They are verbose, difficult to read, and it's difficult to compare one with another.

## The problems with Automations

Automations are powerful, flexible, configurable, and generic. You can do anything with them but, most of the time, you
just want to do a few things easily.

- They are verbose and difficult to read.
- They are difficult to compare with each other.
- They are trigger-based: _"When a person enters the room, then turn the lights on."_ But what happens if the person is
  already inside the room? How do you apply the correct scene based on the **current conditions**?
- You can disable them, but when you re-enable them the room doesn't automatically update to the current desired state.

## What Ambience does differently

Ambience changes the way to think about scene management.

### Conditions, actions, and auto-triggers

Instead of defining the events that trigger a change of scene — _somebody enters the living room_, or _somebody turns
on the projector_ — think about the **conditions** that define the scene, and the state that the devices in that scene
should attain:

| Conditions                                             | Device state                                    |
| ------------------------------------------------------ | ----------------------------------------------- |
| The room is vacant                                     | Lights off                                      |
| The room is occupied during the evening or nighttime   | Lights at 25%                                   |
| The room is occupied during the day, when it is sunny  | Lights at 40%                                   |
| The room is occupied during the day, when it is cloudy | Lights at 60%                                   |
| Movie time                                             | All lights off, except side-table lights at 10% |

These conditions are automatically sorted by **priority** and **specificity**, and they are used to **auto-derive
triggers**. When one of these triggers fires, the conditions are reassessed, the highest priority matching scene wins,
and the winning scene is applied by calling the specified **actions**.

### Scopes and categories

A **scene** (a named set of conditions and actions) belongs to a **scope** (i.e. the whole **House**, a **Floor**, or an
**Area** or room). While conditions can reference entities anywhere in the house, actions are limited to devices in the
specified scope. This is to make them simpler to manage and specify.

On top of that, different **categories** of devices are subject to different lifecycles. The lights from our previous
example follow different conditions than would window blinds, although some of those conditions might overlap:

| Conditions                                     | Device state  |
| ---------------------------------------------- | ------------- |
| Between dusk and sunrise (but not before 8:00) | Blinds closed |
| Between sunrise (but not before 8:00) and dusk | Blinds open   |
| Movie time                                     | Blinds closed |

Only scenes belonging to the **same scope and category** are compared with each other in order to choose a single
winning scene.

### Actions

Home Assistant Scenes allow you to specify the state that you want devices to achieve. In Ambience you specify which
**actions** to call to apply the new state. That means you can control how entities achieve the desired state.

For instance, many lights don't support the `transition` parameter provided in HA Scenes. Instead you can use the
[Fado Light Fader](https://github.com/clintongormley/ha-fado) custom integration that provides smooth light fading for
brightness, colours, and colour temperatures, and support for native transitions where available.

To make scene configuration simpler, you expose just the actions that you need, with just the fields that matter to you.

### Readable, traceable, and testable

Scenes are described using human-friendly language with a compact format, which makes them easy to understand and to
compare with each other.

Extensive debug logging is available, along with the ability to trace the decisions made for each scope and
category to understand why a particular scene won, and what actions were applied. You can even use the simulator to
change the current conditions (e.g. time or weather) to see if your conditions are working as you expected.

Ready to try it? Start with [Getting started](getting-started.md).
