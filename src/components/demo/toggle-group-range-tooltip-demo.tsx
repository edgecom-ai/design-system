"use client"

import * as React from "react"
import { format, subDays, subMonths, subYears } from "date-fns"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Quick range presets for a chart header. The label stays short; the tooltip
// spells out the dates each one covers.
function rangesFor(today: Date) {
  return [
    { value: "1d", label: "1D", name: "Today", from: today },
    { value: "1w", label: "1W", name: "Last week", from: subDays(today, 6) },
    { value: "1m", label: "1M", name: "Last month", from: subMonths(today, 1) },
    { value: "3m", label: "3M", name: "Last 3 months", from: subMonths(today, 3) },
    { value: "1y", label: "1Y", name: "Last year", from: subYears(today, 1) },
  ]
}

function span(from: Date, to: Date) {
  return from.getTime() === to.getTime() ? format(to, "MMM d, yyyy") : `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`
}

export function ToggleGroupRangeTooltipDemo() {
  const today = React.useMemo(() => new Date(), [])
  const ranges = React.useMemo(() => rangesFor(today), [today])
  const [value, setValue] = React.useState(["1m"])

  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      value={value}
      onValueChange={(next) => next.length && setValue(next)}
      aria-label="Date range"
    >
      {ranges.map((range) => (
        <Tooltip key={range.value}>
          <TooltipTrigger render={<ToggleGroupItem value={range.value} aria-label={range.name} />}>{range.label}</TooltipTrigger>
          <TooltipContent>{span(range.from, today)}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  )
}
