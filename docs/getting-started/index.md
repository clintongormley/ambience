# Getting started

A **Scene** is a combination of the **Conditions** which allow the scene to
match, and the **Actions** which are applied when the scene matches. This guide
takes you through setting up scenes to control the lights and blinds in a
lounge.

## Requirements

This example depends on the following entities being available in Home
Assistant:

- lights, including a light group called **Lounge Lights**
- blinds
- an occupancy or presence sensor called **Lounge Presence**
- a weather integration
- a remote control to turn on the projector called **Cine**

## Scenes for lights

We want the lights in the lounge to support the following scenes:

| Conditions                                             | Device state                                     |
| ------------------------------------------------------ | ------------------------------------------------ |
| The room is vacant for more than 1 minute.             | Fade lights off                                  |
| The room is occupied during the nighttime              | Fade lights to 25%                               |
| The room is occupied during the day, when it is sunny  | Fade lights to 40%                               |
| The room is occupied during the day, when it is cloudy | Fade lights to 60%                               |
| The projector is on for movie time                     | Fade lights off, except side-table lights at 10% |

## Scenes for blinds

The blinds share some conditions with the lights but have their own lifecycle:

| Conditions                                     | Device state  |
| ---------------------------------------------- | ------------- |
| Between dusk and sunrise (but not before 8:00) | Blinds closed |
| Between sunrise (but not before 8:00) and dusk | Blinds open   |
| The projector is on for movie time             | Blinds closed |

When you're ready, begin with
[Step 1: Opening the panel](step-1-opening-the-panel.md).
