// Calendar preview — react-day-picker in Edgecom clothing: single, range,
// multi-month, dropdown captions, disabled days and custom day content.
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"

const sept = new Date(2026, 8, 16)

export { default as RangeTwoMonths } from "@/components/shadcn-studio/calendar/calendar-04"
export { default as WithEventList } from "@/components/shadcn-studio/calendar/calendar-11"
export { default as DailyCostPerDay } from "@/components/shadcn-studio/calendar/calendar-25"

export function SingleSelected() {
  const [date, setDate] = React.useState<Date | undefined>(sept)
  return (
    <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={sept} className="rounded-lg border" />
  )
}

export function RangeWithDisabledFuture() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 14) })
  return (
    <div>
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        defaultMonth={sept}
        disabled={{ after: sept }}
        className="rounded-lg border"
      />
      <p className="mt-3 text-center text-caption text-muted-foreground">Days after today are disabled — no future intervals to report.</p>
    </div>
  )
}

export function DropdownCaption() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2024, 2, 5))
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      startMonth={new Date(2018, 0)}
      endMonth={new Date(2026, 11)}
      selected={date}
      onSelect={setDate}
      defaultMonth={date}
      className="rounded-lg border"
    />
  )
}

export function MultipleDays() {
  const [days, setDays] = React.useState<Date[] | undefined>([new Date(2026, 8, 3), new Date(2026, 8, 9), new Date(2026, 8, 22)])
  return (
    <div>
      <Calendar mode="multiple" selected={days} onSelect={setDays} defaultMonth={sept} className="rounded-lg border" />
      <p className="mt-3 text-center text-caption text-muted-foreground">Demand-response event days</p>
    </div>
  )
}
