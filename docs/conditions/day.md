# Day

Checks whether today's date matches — or does not match — a set of calendar
criteria: the day of the week, a day of the month, a specific annual date, a
date range, whether today is a workday or a holiday, and more.

## How you set it up

The Day condition editor has two sections: **Include** and **Exclude**. A scene
matches on a given day if that day is covered by at least one Include entry (or
if the Include list is empty, which means "every day") and is not covered by any
Exclude entry.

Use the **+ Add include item** and **+ Add exclude item** dropdowns to build up
your list. Each item has a kind, chosen from the options below.

### Day of the week

Pick **Weekday** and tick the days you want to match: Monday through Sunday. You
can select as many as you like. This is the simplest option — for example, tick
Monday through Friday to cover all working weekdays (without reference to public
holidays).

### Day of the month

Pick **Day of month** and type a spec into the text field. A spec is a
comma-separated list of single day numbers and inclusive ranges, for example:

- `1` — the first of the month only
- `1, 15` — the 1st and 15th
- `1-10` — the 1st through the 10th
- `1-5, 20-25` — two separate ranges

Days run from 1 to 31. If a month has fewer days than the upper end of a range,
the extra days simply never occur and the entry never matches in that month.

### A specific date (every year)

Pick **Date** and choose a month and a day. The condition matches on that
month/day combination in any year, so you can target, say, 25 December without
specifying a year. February 29 is accepted — it only matches in leap years.

### A date range (every year)

Pick **Date range** and set a From month/day and a To month/day. The condition
matches any date falling within that range, inclusive of both endpoints, in any
year. Ranges can wrap the year boundary: a range from 20 December to 5 January
matches from 20 Dec through to 5 Jan the following calendar year.

### The last day of the month

Pick **Last day of month**. This matches the 28th, 29th, 30th, or 31st,
depending on the month, so it works correctly in February and in months with 30
days.

### Workday

Pick **Workday**. This matches on days when the workday sensor reports "on" —
typically weekdays excluding public holidays, according to whatever country and
configuration you have set up in the
[Workday integration](https://www.home-assistant.io/integrations/workday/).

This kind requires a workday sensor to be configured in **Settings →
Conditions**. See the [Settings reference](../settings-reference.md) for how to
set one up. If no sensor is configured, the option is shown in the dropdown but
is disabled.

### Holiday (non-workday)

Pick **Holiday**. This is the complement of Workday: it matches on days when the
workday sensor reports "off". That includes weekends and any public holidays
recognised by the Workday integration.

This kind also requires a workday sensor to be configured in **Settings →
Conditions** (see the [Settings reference](../settings-reference.md)).

### First workday of the month

Pick **First workday of month**. This matches on the first day in the current
month that the workday calendar records as a working day. It is useful for
triggering things like a start-of-month report or reminder.

This kind requires a workday calendar (not just a sensor) to be configured in
**Settings → Conditions**. The calendar gives Ambience visibility of the full
month so it can identify the first workday reliably. See the
[Settings reference](../settings-reference.md).

### Last workday of the month

Pick **Last workday of month**. This matches on the last working day of the
current month, again derived from the workday calendar.

This kind also requires a workday calendar to be configured in **Settings →
Conditions** (see the [Settings reference](../settings-reference.md)).

## Example

Suppose you want a scene that turns on a "Focus" lighting preset every weekday
morning, but not on public holidays when you are unlikely to be working. You
could set it up as follows:

- Add a **Weekday** include item and tick Monday, Tuesday, Wednesday, Thursday,
    and Friday.
- Add a **Holiday** exclude item.

The scene then matches every weekday except on public holidays recognised by
your Workday integration. You might pair this with a Time of day condition to
restrict it to, say, 09:00–17:00.

!!! info "📷 Screenshot"

    The Day condition editor showing an Include section with one Weekday item
    (Monday through Friday ticked) and an Exclude section with one Holiday item.
