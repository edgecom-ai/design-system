"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  compact = false,
  disabled,
  className,
}: {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Render the trigger as an icon-only button instead of the full field. */
  compact?: boolean
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const selected = value ?? internal

  function handleSelect(date: Date | undefined) {
    if (value === undefined) setInternal(date)
    onValueChange?.(date)
    if (date) setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          compact ? (
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              aria-label={placeholder}
              className={className}
            >
              <CalendarIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={disabled}
              data-empty={!selected}
              className={cn(
                "w-56 justify-start font-normal data-[empty=true]:text-muted-foreground",
                className
              )}
            >
              <CalendarIcon data-icon="inline-start" />
              {selected
                ? selected.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : placeholder}
            </Button>
          )
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} autoFocus />
      </PopoverContent>
    </Popover>
  )
}

// A month-granularity range picker: pick a start month, then an end month
// (across years via the year nav). Each bound is the first day of its month.
// react-day-picker has no month-range mode, so this is a bespoke month grid
// styled to match the day pickers — endpoints use `primary`, the in-between
// months use the neutral `accent` highlight.
type MonthRange = { from?: Date; to?: Date }

const monthOrd = (d: Date) => d.getFullYear() * 12 + d.getMonth()

function MonthRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a month range",
  compact = false,
  disabled,
  className,
}: {
  value?: MonthRange
  defaultValue?: MonthRange
  onValueChange?: (range: MonthRange) => void
  placeholder?: string
  /** Render the trigger as an icon-only button instead of the full field. */
  compact?: boolean
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState<MonthRange | undefined>(
    defaultValue
  )
  const range = value ?? internal
  const from = range?.from
  const to = range?.to

  const [year, setYear] = React.useState(
    () => (range?.to ?? range?.from ?? new Date()).getFullYear()
  )

  function commit(next: MonthRange) {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  // First click starts a new range; the second completes it (ordered) and
  // closes; a click while a full range is selected starts over.
  function handleSelect(month: Date) {
    if (!from || to) {
      commit({ from: month, to: undefined })
    } else {
      const ordered =
        monthOrd(month) < monthOrd(from)
          ? { from: month, to: from }
          : { from, to: month }
      commit(ordered)
      setOpen(false)
    }
  }

  const fmtMonth = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short" })
  const label =
    from && to
      ? from.getFullYear() === to.getFullYear()
        ? `${fmtMonth(from)} – ${fmtMonth(to)} ${to.getFullYear()}`
        : `${fmtMonth(from)} ${from.getFullYear()} – ${fmtMonth(to)} ${to.getFullYear()}`
      : from
        ? `${fmtMonth(from)} ${from.getFullYear()} – …`
        : placeholder

  const months = Array.from({ length: 12 }, (_, m) => new Date(year, m, 1))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          compact ? (
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              data-slot="month-range-picker-trigger"
              aria-label={placeholder}
              className={className}
            >
              <CalendarIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={disabled}
              data-slot="month-range-picker-trigger"
              data-empty={!from}
              className={cn(
                "w-56 justify-start font-normal data-[empty=true]:text-muted-foreground",
                className
              )}
            >
              <CalendarIcon data-icon="inline-start" />
              {label}
            </Button>
          )
        }
      />
      <PopoverContent data-slot="month-range-picker" align="start" className="w-64 p-3">
        <div className="flex items-center justify-between pb-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous year"
            onClick={() => setYear((y) => y - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm font-medium tabular-nums">{year}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next year"
            onClick={() => setYear((y) => y + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <div data-slot="month-range-picker-grid" className="grid grid-cols-3 gap-1">
          {months.map((month) => {
            const o = monthOrd(month)
            const isEndpoint =
              (from && o === monthOrd(from)) || (to && o === monthOrd(to))
            const inRange = from && to && o > monthOrd(from) && o < monthOrd(to)
            return (
              <Button
                key={o}
                type="button"
                variant="ghost"
                data-selected={isEndpoint || undefined}
                data-in-range={inRange || undefined}
                onClick={() => handleSelect(month)}
                className={cn(
                  "h-9 rounded-md font-normal",
                  inRange && "bg-accent text-accent-foreground",
                  isEndpoint &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {fmtMonth(month)}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, MonthRangePicker }
export type { MonthRange }
