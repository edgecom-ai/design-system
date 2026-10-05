"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { MonthRangePicker } from "@/components/ui/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const formatDay = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" })

function DayRangePicker({
  disallowSame,
  placeholder,
}: {
  disallowSame: "day" | "month"
  placeholder: string
}) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange | undefined>()

  const label = range?.from
    ? `${formatDay(range.from)} – ${range.to ? formatDay(range.to) : "…"}`
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!range?.from}
            className="w-56 justify-start font-normal data-[empty=true]:text-muted-foreground"
          >
            <CalendarIcon data-icon="inline-start" />
            {label}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          disallowSame={disallowSame}
          selected={range}
          onSelect={(next) => {
            setRange(next)
            if (next?.from && next.to) setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export function DatePickerDisallowSameDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* A baseline needs two days or more: the start day alone is never a range. */}
      <DayRangePicker disallowSame="day" placeholder="Pick a baseline period" />
      {/* Spans a billing cutover: the rest of the start's month is disabled. */}
      <DayRangePicker disallowSame="month" placeholder="Pick a cross-month period" />
      {/* Year over year: once a start month is picked, the rest of its year is disabled. */}
      <MonthRangePicker disallowSame="year" placeholder="Pick a year-over-year range" />
    </div>
  )
}
