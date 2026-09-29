"use client"

import * as React from "react"
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChartExportMenu,
  ChartMetricToggle,
  ChartRangePicker,
  SAMPLE_NOW,
  formatNumber,
  seededRandom,
} from "@/components/demo/chart-controls"

// An intensity scale takes one commodity's sequential ramp, never the
// categorical hues. Cost tags no commodity, so it takes the misc ramp.
const metrics = [
  { value: "consumption", label: "Consumption", unit: "kWh", ramp: "electricity" },
  { value: "cost", label: "Cost", unit: "$", ramp: "misc" },
  { value: "emissions", label: "Emissions", unit: "kg CO₂e", ramp: "emissions" },
] as const

type Metric = (typeof metrics)[number]["value"]

// Five bands per ramp, low → high. Light runs 100 → 900; dark runs the same
// steps the other way, so low readings sink toward the card and the peak is
// the brightest cell — the softest band never glares on a dark surface.
// Written out whole so Tailwind can see every class.
const BANDS = {
  electricity: [
    "bg-chart-electricity-100 dark:bg-chart-electricity-900",
    "bg-chart-electricity-300 dark:bg-chart-electricity-700",
    "bg-chart-electricity-500",
    "bg-chart-electricity-700 dark:bg-chart-electricity-300",
    "bg-chart-electricity-900 dark:bg-chart-electricity-100",
  ],
  misc: [
    "bg-chart-misc-100 dark:bg-chart-misc-900",
    "bg-chart-misc-300 dark:bg-chart-misc-700",
    "bg-chart-misc-500",
    "bg-chart-misc-700 dark:bg-chart-misc-300",
    "bg-chart-misc-900 dark:bg-chart-misc-100",
  ],
  emissions: [
    "bg-chart-emissions-100 dark:bg-chart-emissions-900",
    "bg-chart-emissions-300 dark:bg-chart-emissions-700",
    "bg-chart-emissions-500",
    "bg-chart-emissions-700 dark:bg-chart-emissions-300",
    "bg-chart-emissions-900 dark:bg-chart-emissions-100",
  ],
} as const

const presets = ["1W", "2W"] as const
type Preset = (typeof presets)[number]

// One row per day stays legible up to a month; a longer range keeps its last 31 days.
const MAX_ROWS = 31

const hours = Array.from({ length: 24 }, (_, hour) => hour)

function rangeForPreset(preset: Preset): { from: Date; to: Date } {
  const to = addDays(startOfDay(SAMPLE_NOW), -1)
  return { from: addDays(to, -({ "1W": 7, "2W": 14 }[preset] - 1)), to }
}

// Low overnight, a working-day plateau with an afternoon peak, light weekends.
function hourlyKwh(day: Date, hour: number) {
  const weekend = day.getDay() === 0 || day.getDay() === 6
  const shape = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI)) ** 1.4
  const noise = seededRandom(Math.floor(day.getTime() / 3_600_000) + hour)()
  return (210 + (weekend ? 380 : 1180) * shape) * (0.9 + noise * 0.2)
}

function valueFor(metric: Metric, kwh: number) {
  if (metric === "cost") return kwh * 0.142
  if (metric === "emissions") return kwh * 0.118
  return kwh
}

export function ChartHourlyHeatmapDemo() {
  const [metric, setMetric] = React.useState<Metric>("consumption")
  const [preset, setPreset] = React.useState<Preset | undefined>("1W")
  const [range, setRange] = React.useState<DateRange>(() => rangeForPreset("1W"))

  const active = metrics.find((item) => item.value === metric) ?? metrics[0]

  const days = React.useMemo(() => {
    const to = startOfDay(range.to ?? range.from ?? SAMPLE_NOW)
    const count = Math.min(MAX_ROWS, differenceInCalendarDays(to, range.from ?? to) + 1)
    return Array.from({ length: count }, (_, index) => addDays(to, index - count + 1))
  }, [range])

  const rows = days.map((day) => ({
    day,
    values: hours.map((hour) => valueFor(metric, hourlyKwh(day, hour))),
  }))
  const all = rows.flatMap((row) => row.values)
  const min = Math.min(...all)
  const max = Math.max(...all)
  const peak = rows
    .flatMap((row) => row.values.map((value, hour) => ({ day: row.day, hour, value })))
    .reduce((best, cell) => (cell.value > best.value ? cell : best))

  const withUnit = (value: number) =>
    active.unit === "$" ? `$${formatNumber(value)}` : `${formatNumber(value)} ${active.unit}`
  // Five equal bands between the range's own min and max.
  const bands = BANDS[active.ramp]
  const bandFor = (value: number) =>
    bands[Math.min(bands.length - 1, Math.floor(((value - min) / (max - min || 1)) * bands.length))]
  const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @3xl/chart:flex-row @3xl/chart:items-start @3xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Hourly consumption</CardTitle>
          <CardDescription>
            Peak {withUnit(peak.value)} on {format(peak.day, "EEE, MMM d")} at {hourLabel(peak.hour)}
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <ChartMetricToggle label="Metric" metrics={metrics} value={metric} onValueChange={setMetric} />
          <ChartRangePicker
            label="Hourly consumption range"
            presets={presets}
            preset={preset}
            onPresetChange={(next) => {
              setPreset(next)
              setRange(rangeForPreset(next))
            }}
            range={range}
            onRangeChange={(next) => {
              setPreset(undefined)
              setRange(next)
            }}
          />
          <ChartExportMenu filename={`hourly-${metric}`} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Wide content scrolls inside its own container, never the page. */}
        <div className="overflow-x-auto">
          <div
            role="img"
            aria-label={`${active.label} by hour, ${format(days[0], "MMM d")} to ${format(days.at(-1)!, "MMM d")}. Peak ${withUnit(peak.value)} on ${format(peak.day, "EEEE, MMM d")} at ${hourLabel(peak.hour)}.`}
            className="grid min-w-xl grid-cols-[auto_repeat(24,minmax(0,1fr))] gap-0.5 text-caption text-muted-foreground"
          >
            <span />
            {hours.map((hour) => (
              <span key={hour} className="text-center tabular-nums">
                {hour % 3 === 0 ? String(hour).padStart(2, "0") : ""}
              </span>
            ))}
            {rows.map((row) => (
              <React.Fragment key={row.day.getTime()}>
                <span className="self-center pr-2 whitespace-nowrap tabular-nums">
                  {format(row.day, "EEE d")}
                </span>
                {row.values.map((value, hour) => (
                  <Tooltip key={hour}>
                    <TooltipTrigger
                      render={
                        <span className={cn("h-6 rounded-xs", bandFor(value))} />
                      }
                    />
                    <TooltipContent>
                      <span className="flex flex-col whitespace-nowrap">
                        <span>
                          {format(row.day, "EEE, MMM d")} · {hourLabel(hour)}
                        </span>
                        <span className="font-medium tabular-nums">{withUnit(value)}</span>
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* The scale legend, centered like every chart legend. */}
        <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground">
          <span className="whitespace-nowrap tabular-nums">{withUnit(min)}</span>
          <div className="flex gap-0.5" aria-hidden>
            {bands.map((band) => (
              <span key={band} className={cn("h-2.5 w-8 rounded-xs", band)} />
            ))}
          </div>
          <span className="whitespace-nowrap tabular-nums">{withUnit(max)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
