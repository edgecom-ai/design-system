"use client"

import * as React from "react"
import {
  addMonths,
  differenceInCalendarDays,
  format,
  setDate,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// The fictional utility's billing cycle closes on the 14th, so a billing
// period runs from the 15th to the 14th of the next month.
const CYCLE_START_DAY = 15

function billingPeriodContaining(day: Date): DateRange {
  const start = day.getDate() >= CYCLE_START_DAY ? setDate(day, CYCLE_START_DAY) : setDate(subMonths(day, 1), CYCLE_START_DAY)
  return { from: start, to: subDays(addMonths(start, 1), 1) }
}

function presetsFor(today: Date) {
  const current = billingPeriodContaining(today)
  const previous = billingPeriodContaining(subDays(current.from!, 1))
  return [
    { id: "billing-current", label: "This billing period", range: { from: current.from, to: today } },
    { id: "billing-previous", label: "Last billing period", range: previous },
    { id: "last-7", label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
    { id: "last-30", label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
    { id: "month", label: "Month to date", range: { from: startOfMonth(today), to: today } },
    { id: "quarter", label: "Quarter to date", range: { from: startOfQuarter(today), to: today } },
    { id: "year", label: "Year to date", range: { from: startOfYear(today), to: today } },
  ] satisfies { id: string; label: string; range: DateRange }[]
}

function describe(range: DateRange | undefined) {
  if (!range?.from) return "Pick a start and an end day"
  const to = range.to ?? range.from
  const days = differenceInCalendarDays(to, range.from) + 1
  return `${format(range.from, "MMM d")} – ${format(to, "MMM d, yyyy")} · ${days} ${days === 1 ? "day" : "days"}`
}

export function CalendarBillingPresetsDemo() {
  const today = React.useMemo(() => new Date(), [])
  const presets = React.useMemo(() => presetsFor(today), [today])
  const [range, setRange] = React.useState<DateRange | undefined>(presets[0].range)
  const [month, setMonth] = React.useState(today)
  const [active, setActive] = React.useState<string | null>(presets[0].id)

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Reporting period</CardTitle>
        <CardDescription className="tabular-nums">{describe(range)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-row flex-wrap gap-1 sm:w-40 sm:flex-col sm:flex-nowrap" role="group" aria-label="Presets">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              variant="ghost"
              size="sm"
              aria-pressed={active === preset.id}
              className="justify-start aria-pressed:bg-accent aria-pressed:text-accent-foreground"
              onClick={() => {
                setRange(preset.range)
                setMonth(preset.range.to ?? today)
                setActive(preset.id)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={range}
          onSelect={(next) => {
            setRange(next)
            setActive(null)
          }}
          month={month}
          onMonthChange={setMonth}
          disabled={{ after: today }}
          className="p-0"
        />
      </CardContent>
    </Card>
  )
}
