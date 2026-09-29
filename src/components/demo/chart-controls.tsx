"use client"

// The chart header control cluster from design.md → Charts & graphs, shared by
// every chart block: one metric selector, one date range (presets plus a
// compact range calendar), the statistical overlays, the smooth/step toggle,
// and the export menu. Each chart block composes the ones it needs, so the
// same job is always the same control, in the same place and size.

import * as React from "react"
import type { DateRange } from "react-day-picker"
import type { DefaultLegendContentProps } from "recharts"
import {
  CalendarIcon,
  ChartLineIcon,
  ChartNoAxesCombinedIcon,
  ChartSplineIcon,
  DownloadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChartLegendContent } from "@/components/ui/chart"
import { MonthRangePicker } from "@/components/ui/date-picker"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// A fixed "now" keeps every block's sample data — and every screenshot of it —
// identical from one visit to the next.
const SAMPLE_NOW = new Date(2026, 5, 15, 14, 45)

type Curve = "smooth" | "step"

// Recharts' curve names for the two interpolations the toggle offers.
const CURVE_TYPE = { smooth: "monotone", step: "stepAfter" } as const

type Overlays = { average: boolean; minMax: boolean; trend: boolean }

const DEFAULT_OVERLAYS: Overlays = { average: true, minMax: false, trend: false }

// A reference line is neutral, never a status or commodity hue. The period
// average is dashed; min and max mark single readings, so they read lighter.
const REFERENCE_STROKE = "var(--muted-foreground)"
const REFERENCE_DASH = { average: "6 4", minMax: "2 3", trend: "6 4" } as const

// Bar slot ratios from design.md's density table. Recharts applies
// `barCategoryGap` on each side of a bar, so 12.5% leaves the bar 75% of its
// slot, and 22.5% keeps a handful of bars at 55% — then `maxBarSize` caps them.
const BAR_CATEGORY_GAP = { few: "22.5%", normal: "12.5%" } as const

const EXPORT_ACTIONS = [
  { format: "png", label: "Download PNG" },
  { format: "svg", label: "Download SVG" },
  { format: "pdf", label: "Download PDF" },
  { format: "csv", label: "Download CSV" },
] as const

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

function formatNumber(value: number) {
  return numberFormat.format(value)
}

// Deterministic pseudo-random numbers (mulberry32), so sample data is stable.
function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function average(values: number[]) {
  return values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length
}

// Least-squares fit, returned as the fitted value at each index.
function linearTrend(values: number[]) {
  const n = values.length
  if (n < 2) return values
  const meanX = (n - 1) / 2
  const meanY = average(values)
  let numerator = 0
  let denominator = 0
  values.forEach((value, index) => {
    numerator += (index - meanX) * (value - meanY)
    denominator += (index - meanX) ** 2
  })
  const slope = numerator / denominator
  return values.map((_, index) => meanY + slope * (index - meanX))
}

function formatRange(range: DateRange) {
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  if (!range.from) return "No range selected"
  return range.to ? `${format(range.from)} – ${format(range.to)}` : format(range.from)
}

function ChartMetricToggle<Metric extends string>({
  label,
  metrics,
  value,
  onValueChange,
}: {
  label: string
  metrics: readonly { value: Metric; label: string }[]
  value: Metric
  onValueChange: (value: Metric) => void
}) {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        // Pressing the active item again clears the group; keep the metric.
        const [picked] = next
        if (picked !== undefined) onValueChange(picked as Metric)
      }}
    >
      {metrics.map((metric) => (
        <ToggleGroupItem key={metric.value} value={metric.value}>
          {metric.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function ChartRangePicker<Preset extends string>({
  label,
  presets,
  preset,
  onPresetChange,
  range,
  onRangeChange,
  granularity = "day",
}: {
  /** Names which range this is, for assistive tech. */
  label: string
  presets: readonly Preset[]
  /** Undefined once a custom range is picked — no preset describes it. */
  preset: Preset | undefined
  onPresetChange: (preset: Preset) => void
  range: DateRange
  onRangeChange: (range: { from: Date; to: Date }) => void
  /** `month` swaps the day calendar for the month-range picker, for monthly data. */
  granularity?: "day" | "month"
}) {
  const [open, setOpen] = React.useState(false)
  const [start, setStart] = React.useState<Date | undefined>()
  // A custom range wears the same neutral highlight as a pressed preset, so
  // exactly one control reads as active.
  const customClassName = cn(preset === undefined && "bg-accent text-accent-foreground")

  // First click picks the start, the second completes the range and closes.
  function handleSelect(_: DateRange | undefined, day: Date) {
    if (!start) {
      setStart(day)
      return
    }
    const [from, to] = day < start ? [day, start] : [start, day]
    onRangeChange({ from, to })
    setOpen(false)
  }

  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <ToggleGroup
        variant="outline"
        spacing={0}
        aria-label="Range presets"
        value={preset === undefined ? [] : [preset]}
        onValueChange={(next) => {
          const [picked] = next
          if (picked !== undefined) onPresetChange(picked as Preset)
        }}
      >
        {presets.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {granularity === "month" ? (
        <MonthRangePicker
          compact
          placeholder="Pick a month range"
          // Holds the first pick until the second completes the range.
          value={start ? { from: start } : range}
          onValueChange={(next) => {
            if (next.from && next.to) {
              setStart(undefined)
              onRangeChange({ from: next.from, to: next.to })
            } else {
              setStart(next.from)
            }
          }}
          className={customClassName}
        />
      ) : (
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (next) setStart(undefined)
          }}
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Pick a date range"
                      className={customClassName}
                    >
                      <CalendarIcon />
                    </Button>
                  }
                />
              }
            />
            {/* The icon has no room for the range, so the tooltip carries it. */}
            <TooltipContent className="tabular-nums">{formatRange(range)}</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={start ? { from: start, to: undefined } : range}
              onSelect={handleSelect}
              defaultMonth={range.to ?? SAMPLE_NOW}
              disabled={{ after: SAMPLE_NOW }}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

function ChartOverlaysMenu({
  overlays,
  onOverlaysChange,
  readouts,
  showTrend = false,
}: {
  overlays: Overlays
  onOverlaysChange: (overlays: Overlays) => void
  /** The value each overlay draws, shown beside its checkbox. */
  readouts?: Partial<Record<keyof Overlays, string>>
  showTrend?: boolean
}) {
  const items: { key: keyof Overlays; label: string }[] = [
    { key: "average", label: "Period average" },
    { key: "minMax", label: "Min / max" },
    ...(showTrend ? [{ key: "trend" as const, label: "Trend" }] : []),
  ]

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Statistical overlays">
                  <ChartNoAxesCombinedIcon />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Statistical overlays</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.key}
            checked={overlays[item.key]}
            onCheckedChange={(checked) =>
              onOverlaysChange({ ...overlays, [item.key]: checked })
            }
          >
            <span className="flex-1">{item.label}</span>
            {readouts?.[item.key] && (
              <span className="ml-4 text-muted-foreground tabular-nums">
                {readouts[item.key]}
              </span>
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ChartCurveToggle({
  curve,
  onCurveChange,
}: {
  curve: Curve
  onCurveChange: (curve: Curve) => void
}) {
  const items = [
    { value: "smooth" as const, label: "Smooth", Icon: ChartSplineIcon },
    { value: "step" as const, label: "Step", Icon: ChartLineIcon },
  ]

  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      aria-label="Interpolation"
      value={[curve]}
      onValueChange={(next) => {
        const [picked] = next
        if (picked !== undefined) onCurveChange(picked as Curve)
      }}
    >
      {items.map(({ value, label, Icon }) => (
        <Tooltip key={value}>
          <TooltipTrigger
            render={
              <ToggleGroupItem value={value} aria-label={label}>
                <Icon />
              </ToggleGroupItem>
            }
          />
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  )
}

function ChartExportMenu({ filename }: { filename: string }) {
  // A docs demo has nothing to save, so each action confirms what it would do.
  function exportAs(format: string) {
    toast.success("Chart exported", { description: `${filename}.${format}` })
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Export">
                  <DownloadIcon />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Export</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {EXPORT_ACTIONS.map((action) => (
          <DropdownMenuItem key={action.format} onClick={() => exportAs(action.format)}>
            {action.label}
          </DropdownMenuItem>
        ))}
        {/* Print acts on the chart in place rather than saving a file. */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toast.success("Sent to print", { description: `${filename} is ready to print.` })
          }
        >
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ReferenceKey = {
  key: string
  label: string
  value: string
  dash: string
}

// The chart legend, centered below the plot, with each drawn reference line
// labelled by its value — a period average reads in the legend, not on a chip.
function ChartLegendWithReferences({
  payload,
  references = [],
}: Pick<DefaultLegendContentProps, "payload"> & { references?: ReferenceKey[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3">
      {/* `contents` lets series and reference keys wrap as one row set. */}
      <ChartLegendContent payload={payload} className="contents" />
      {references.map((reference) => (
        <div key={reference.key} className="flex items-center gap-1.5">
          <svg aria-hidden className="h-2 w-4 shrink-0 overflow-visible">
            <line
              x1="0"
              x2="16"
              y1="4"
              y2="4"
              stroke={REFERENCE_STROKE}
              strokeWidth={1.5}
              strokeDasharray={reference.dash}
            />
          </svg>
          <span>{reference.label}</span>
          <span className="font-medium text-foreground tabular-nums">{reference.value}</span>
        </div>
      ))}
    </div>
  )
}

export {
  BAR_CATEGORY_GAP,
  CURVE_TYPE,
  DEFAULT_OVERLAYS,
  REFERENCE_DASH,
  REFERENCE_STROKE,
  SAMPLE_NOW,
  ChartCurveToggle,
  ChartExportMenu,
  ChartLegendWithReferences,
  ChartMetricToggle,
  ChartOverlaysMenu,
  ChartRangePicker,
  average,
  formatNumber,
  linearTrend,
  seededRandom,
}
export type { Curve, Overlays, ReferenceKey }
