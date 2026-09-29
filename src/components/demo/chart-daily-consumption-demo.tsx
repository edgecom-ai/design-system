"use client"

import * as React from "react"
import { addDays, differenceInCalendarDays, format, startOfDay, startOfWeek } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BAR_CATEGORY_GAP,
  ChartExportMenu,
  ChartLegendWithReferences,
  ChartMetricToggle,
  ChartOverlaysMenu,
  ChartRangePicker,
  DEFAULT_OVERLAYS,
  type Overlays,
  REFERENCE_DASH,
  REFERENCE_STROKE,
  type ReferenceKey,
  SAMPLE_NOW,
  average,
  formatNumber,
  linearTrend,
  seededRandom,
} from "@/components/demo/chart-controls"

// Consumption tags electricity. Cost and emissions are derived from it: cost
// tags no commodity, so it takes the miscellaneous ramp; emissions has its own.
const metrics = [
  { value: "consumption", label: "Consumption", unit: "kWh", color: "var(--chart-electricity-500)" },
  { value: "cost", label: "Cost", unit: "$", color: "var(--chart-misc-500)" },
  { value: "emissions", label: "Emissions", unit: "kg CO₂e", color: "var(--chart-emissions-500)" },
] as const

type Metric = (typeof metrics)[number]["value"]

const presets = ["1W", "1M", "3M"] as const
type Preset = (typeof presets)[number]

// Past this many bars a daily chart stops shrinking and buckets by week.
const MAX_DAILY_BARS = 60

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })

function rangeForPreset(preset: Preset): { from: Date; to: Date } {
  const to = addDays(startOfDay(SAMPLE_NOW), -1)
  const days = { "1W": 7, "1M": 30, "3M": 91 }[preset]
  return { from: addDays(to, -(days - 1)), to }
}

// A plant that runs weekdays and idles at weekends, drifting up into summer.
function dailyKwh(day: Date) {
  const weekend = day.getDay() === 0 || day.getDay() === 6
  const season = 1 + 0.12 * Math.sin(((day.getMonth() - 3) / 12) * 2 * Math.PI)
  const noise = seededRandom(Math.floor(day.getTime() / 86_400_000))()
  return (weekend ? 5200 : 9800) * season * (0.92 + noise * 0.16)
}

function valueFor(metric: Metric, kwh: number) {
  if (metric === "cost") return kwh * 0.142
  if (metric === "emissions") return kwh * 0.118
  return kwh
}

function buildBars(range: { from: Date; to: Date }, metric: Metric) {
  const days = differenceInCalendarDays(range.to, range.from) + 1
  const daily = Array.from({ length: days }, (_, index) => {
    const day = addDays(range.from, index)
    return { day, value: valueFor(metric, dailyKwh(day)) }
  })
  if (days <= MAX_DAILY_BARS) {
    return {
      weekly: false,
      rows: daily.map(({ day, value }) => ({ key: day.getTime(), label: format(day, "MMM d"), value: Math.round(value) })),
    }
  }
  const weeks = new Map<number, number>()
  for (const { day, value } of daily) {
    const week = startOfWeek(day, { weekStartsOn: 1 }).getTime()
    weeks.set(week, (weeks.get(week) ?? 0) + value)
  }
  return {
    weekly: true,
    rows: [...weeks].map(([week, value]) => ({
      key: week,
      label: `Wk of ${format(week, "MMM d")}`,
      value: Math.round(value),
    })),
  }
}

export function ChartDailyConsumptionDemo() {
  const [metric, setMetric] = React.useState<Metric>("consumption")
  const [preset, setPreset] = React.useState<Preset | undefined>("1M")
  const [range, setRange] = React.useState<DateRange>(() => rangeForPreset("1M"))
  const [overlays, setOverlays] = React.useState<Overlays>(DEFAULT_OVERLAYS)

  const active = metrics.find((item) => item.value === metric) ?? metrics[0]
  const { rows, weekly } = React.useMemo(
    () => buildBars({ from: range.from ?? SAMPLE_NOW, to: range.to ?? range.from ?? SAMPLE_NOW }, metric),
    [range, metric]
  )

  const values = rows.map((row) => row.value)
  const stats = { average: average(values), min: Math.min(...values), max: Math.max(...values) }
  const trend = linearTrend(values)
  const slope = trend.length > 1 ? (trend.at(-1)! - trend[0]) / (trend.length - 1) : 0
  const data = rows.map((row, index) => ({ ...row, trend: Math.round(trend[index]) }))

  const withUnit = (value: number) =>
    active.unit === "$" ? `$${formatNumber(value)}` : `${formatNumber(value)} ${active.unit}`
  const perBar = weekly ? "week" : "day"

  const references: ReferenceKey[] = [
    ...(overlays.average
      ? [{ key: "average", label: "Period average", value: withUnit(stats.average), dash: REFERENCE_DASH.average }]
      : []),
    ...(overlays.minMax
      ? [
          { key: "min", label: "Min", value: withUnit(stats.min), dash: REFERENCE_DASH.minMax },
          { key: "max", label: "Max", value: withUnit(stats.max), dash: REFERENCE_DASH.minMax },
        ]
      : []),
    ...(overlays.trend
      ? [{ key: "trend", label: "Trend", value: `${slope >= 0 ? "+" : "−"}${withUnit(Math.abs(slope))} / ${perBar}`, dash: REFERENCE_DASH.trend }]
      : []),
  ]

  const chartConfig = {
    value: { label: `${active.label} (${active.unit})`, color: active.color },
  } satisfies ChartConfig

  // Bar sizing follows the density table in design.md: few bars are capped,
  // dense bars get a smaller corner so rounding doesn't eat the bar.
  const dense = rows.length > 30

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @3xl/chart:flex-row @3xl/chart:items-start @3xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Daily consumption</CardTitle>
          <CardDescription>
            {weekly ? "Weekly totals" : "Daily totals"}
            {range.to ? ` through ${format(range.to, "MMM d")}` : ""}
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <ChartMetricToggle
            label="Metric"
            metrics={metrics}
            value={metric}
            onValueChange={setMetric}
          />
          <ChartRangePicker
            label="Daily consumption range"
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
          <ChartOverlaysMenu
            overlays={overlays}
            onOverlaysChange={setOverlays}
            showTrend
            readouts={{
              average: withUnit(stats.average),
              minMax: `${compact.format(stats.min)}–${compact.format(stats.max)}`,
            }}
          />
          <ChartExportMenu filename={`daily-${metric}`} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{ top: 8, right: 8, left: 4 }}
            barCategoryGap={rows.length <= 8 ? BAR_CATEGORY_GAP.few : BAR_CATEGORY_GAP.normal}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                active.unit === "$" ? `$${compact.format(value)}` : compact.format(value)
              }
            />
            <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendWithReferences references={references} />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={dense ? [2, 2, 0, 0] : [4, 4, 0, 0]}
              maxBarSize={48}
              isAnimationActive={false}
            />
            {overlays.trend && (
              <Line
                dataKey="trend"
                type="linear"
                stroke={REFERENCE_STROKE}
                strokeWidth={1.5}
                strokeDasharray={REFERENCE_DASH.trend}
                dot={false}
                activeDot={false}
                legendType="none"
                tooltipType="none"
                isAnimationActive={false}
              />
            )}
            {overlays.average && (
              <ReferenceLine y={stats.average} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.average} />
            )}
            {overlays.minMax && (
              <>
                <ReferenceLine y={stats.min} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.minMax} />
                <ReferenceLine y={stats.max} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.minMax} />
              </>
            )}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
