# Getting started

A **Scene** is a combination of the **Conditions** which allow the scene to
match, and the **Actions** which are applied when the scene matches. This guide
takes you through setting up scenes to control the lifecycle of the lights in a
lounge.

## Requirements

This example depends on the following entities being available in Home
Assistant:

- lights, including a light group called **Lounge Lights**
- an occupancy or presence sensor called **Lounge Presence**
- a weather integration
- a remote control to turn on the projector called **Cine**

## Planned Scenes

We want the lights in the lounge to support the following scenes:

| Conditions                                             | Device state                                |
| ------------------------------------------------------ | ------------------------------------------- |
| The room is vacant for at least 1 minute.              | Lights off                                  |
| The room is occupied during the nighttime              | Lights to 25%                               |
| The room is occupied during the day, when it is sunny  | Lights to 40%                               |
| The room is occupied during the day, when it is cloudy | Lights to 60%                               |
| The projector is on for movie time                     | Lights off, except side-table lights at 10% |

When you're ready, begin with
[Step 1: Scopes and categories](step-1-scopes-and-categories.md).
