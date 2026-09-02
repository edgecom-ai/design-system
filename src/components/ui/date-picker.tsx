"use client"

import * as React from "react"
import { getDefaultClassNames, type DayButton } from "react-day-picker"
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

// A rolling-window picker: the user picks a start day and the control selects a
// fixed-length window running forward from it (default 7 days). Unlike a
// calendar-week range it is *not* week-aligned — hovering a Wednesday previews
// Wed–Tue, not Sun–Sat. Hovering (or keyboard-focusing) any enabled day previews
// the whole window it would select in the neutral `accent` tone (nothing is
// committed yet); the committed window uses `primary` on its two endpoints and
// `muted` between, matching the day-range variant. `maxDate` disables any day
// whose window would run past it (disabled by window *end*, not the day itself).
type WindowRange = { start: Date; end: Date }

const addDays = (date: Date, n: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const dayStart = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isLastOfMonth = (d: Date) => d.getMonth() !== addDays(d, 1).getMonth()

const within = (day: Date, start: Date, end: Date) => {
  const t = dayStart(day).getTime()
  return t >= dayStart(start).getTime() && t <= dayStart(end).getTime()
}

const WindowBandContext = React.createContext<{
  committed?: WindowRange
  preview?: WindowRange
} | null>(null)

// Custom day button that paints the committed and preview window bands. The band
// wraps across grid rows: outer corners round at each row edge (Sunday, Saturday,
// first/last of the month) so a window spanning two rows reads as a continuous
// band rather than two floating pills.
function WindowDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const bands = React.useContext(WindowBandContext)

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const date = day.date

  // Committed wins over preview where the two overlap.
  let band: "committed" | "preview" | null = null
  let start: Date | undefined
  let end: Date | undefined
  if (bands?.committed && within(date, bands.committed.start, bands.committed.end)) {
    band = "committed"
    start = bands.committed.start
    end = bands.committed.end
  } else if (bands?.preview && within(date, bands.preview.start, bands.preview.end)) {
    band = "preview"
    start = bands.preview.start
    end = bands.preview.end
  }

  const inBand = band !== null
  const isStart = inBand && isSameDay(date, start!)
  const isEnd = inBand && isSameDay(date, end!)
  const dow = date.getDay()
  const roundLeft = inBand && (isStart || dow === 0 || date.getDate() === 1)
  const roundRight = inBand && (isEnd || dow === 6 || isLastOfMonth(date))

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={date.toLocaleDateString()}
      data-window-endpoint={
        band === "committed" && (isStart || isEnd) ? true : undefined
      }
      data-window-middle={
        band === "committed" && !isStart && !isEnd ? true : undefined
      }
      data-window-preview={band === "preview" ? true : undefined}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50",
        "data-[window-endpoint=true]:bg-primary data-[window-endpoint=true]:text-primary-foreground data-[window-endpoint=true]:hover:bg-primary data-[window-endpoint=true]:hover:text-primary-foreground",
        "data-[window-middle=true]:bg-range-band data-[window-middle=true]:text-foreground data-[window-middle=true]:hover:bg-range-band data-[window-middle=true]:hover:text-foreground",
        "data-[window-preview=true]:bg-accent data-[window-preview=true]:text-accent-foreground data-[window-preview=true]:hover:bg-accent data-[window-preview=true]:hover:text-accent-foreground",
        inBand && (roundLeft ? "rounded-l-(--cell-radius)" : "rounded-l-none"),
        inBand && (roundRight ? "rounded-r-(--cell-radius)" : "rounded-r-none"),
        "dark:hover:text-foreground [&>span]:text-caption [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

function WindowRangePicker({
  value,
  defaultValue,
  onValueChange,
  windowLength = 7,
  maxDate,
  minDate,
  placeholder = "Pick a window",
  compact = false,
  disabled,
  className,
}: {
  /** The window start date (controlled). */
  value?: Date
  defaultValue?: Date
  /** Emits the start date plus the computed `{ start, end }` window. */
  onValueChange?: (start: Date, range: WindowRange) => void
  /** Length of the rolling window in days. */
  windowLength?: number
  /** Disable any day whose window would extend past this date. */
  maxDate?: Date
  /** Disable any day before this date. */
  minDate?: Date
  placeholder?: string
  /** Render the trigger as an icon-only button instead of the full field. */
  compact?: boolean
  disabled?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const [active, setActive] = React.useState<Date | undefined>(undefined)
  const start = value ?? internal

  const windowEnd = React.useCallback(
    (date: Date) => addDays(date, windowLength - 1),
    [windowLength]
  )

  const isDayDisabled = React.useCallback(
    (date: Date) => {
      if (maxDate && dayStart(windowEnd(date)).getTime() > dayStart(maxDate).getTime())
        return true
      if (minDate && dayStart(date).getTime() < dayStart(minDate).getTime())
        return true
      return false
    },
    [maxDate, minDate, windowEnd]
  )

  const committed: WindowRange | undefined = start
    ? { start, end: windowEnd(start) }
    : undefined
  const preview: WindowRange | undefined = active
    ? { start: active, end: windowEnd(active) }
    : undefined

  function commit(date: Date) {
    if (value === undefined) setInternal(date)
    onValueChange?.(date, { start: date, end: windowEnd(date) })
    setActive(undefined)
    setOpen(false)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setActive(undefined)
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  const label = committed
    ? `${fmt(committed.start)} – ${fmt(committed.end)}`
    : placeholder

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          compact ? (
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              data-slot="window-range-picker-trigger"
              aria-label={label}
              title={label}
              className={className}
            >
              <CalendarIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={disabled}
              data-slot="window-range-picker-trigger"
              data-empty={!committed}
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
      <PopoverContent data-slot="window-range-picker" align="start" className="w-auto p-0">
        <WindowBandContext.Provider value={{ committed, preview }}>
          <Calendar
            mode="single"
            selected={start}
            onSelect={(date) => date && commit(date)}
            disabled={isDayDisabled}
            onDayMouseEnter={(date, m) => {
              if (!m.disabled) setActive(date)
            }}
            onDayMouseLeave={() => setActive(undefined)}
            onDayFocus={(date, m) => {
              if (!m.disabled) setActive(date)
            }}
            onDayBlur={() => setActive(undefined)}
            components={{ DayButton: WindowDayButton }}
            autoFocus
          />
        </WindowBandContext.Provider>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, MonthRangePicker, WindowRangePicker }
export type { MonthRange, WindowRange }
