"use client"

import * as React from "react"
import { format, isAfter, isWeekend, startOfDay } from "date-fns"

import { Calendar, CalendarDayButton } from "@/components/ui/calendar"

const RATE_PER_KWH = 0.142

// A stand-in for the site's daily meter totals: weekdays run the production
// lines, weekends idle them, and the day number nudges each total so the month
// doesn't read as a pattern.
function dailyUse(day: Date) {
  const nudge = ((day.getDate() * 37 + day.getMonth() * 11) % 23) / 23
  return Math.round(isWeekend(day) ? 520 + nudge * 180 : 1180 + nudge * 460)
}

const costOf = (kwh: number) => Math.round(kwh * RATE_PER_KWH)

// A day that has a reading shows its cost under the date; future days have none.
function CostDayButton({ children, day, modifiers, ...props }: React.ComponentProps<typeof CalendarDayButton>) {
  const hasReading = !isAfter(day.date, startOfDay(new Date()))
  return (
    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
      {children}
      {hasReading && <span className="tabular-nums">${costOf(dailyUse(day.date))}</span>}
    </CalendarDayButton>
  )
}

export function CalendarDailyCostDemo() {
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const [day, setDay] = React.useState<Date | undefined>(today)
  const kwh = day ? dailyUse(day) : null

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={day}
        onSelect={setDay}
        showOutsideDays={false}
        disabled={{ after: today }}
        className="rounded-lg border [--cell-size:--spacing(9)] sm:[--cell-size:--spacing(11)]"
        components={{ DayButton: CostDayButton }}
      />
      <p className="text-caption text-muted-foreground tabular-nums" aria-live="polite">
        {day && kwh !== null
          ? `${format(day, "EEE, MMM d")} · ${kwh.toLocaleString()} kWh · $${costOf(kwh)}`
          : "Pick a day to see its usage"}
      </p>
    </div>
  )
}
