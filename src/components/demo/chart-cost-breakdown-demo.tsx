"use client"

import * as React from "react"
import { addMonths, differenceInCalendarMonths, format, min, startOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"

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
  seededRandom,
} from "@/components/demo/chart-controls"

// Bill line items tag no commodity, so they take distinct categorical hues —
// led by the miscellaneous ramp, and with no red, so no segment reads as an
// error. A single consumption series tags electricity.
const charges = [
  { key: "energy", label: "Energy charges", color: "var(--chart-misc-500)" },
  { key: "delivery", label: "Delivery", color: "var(--chart-water-500)" },
  { key: "demand", label: "Demand charges", color: "var(--chart-electricity-500)" },
  { key: "fees", label: "Taxes & fees", color: "var(--chart-temperature-500)" },
] as const

type ChargeKey = (typeof charges)[number]["key"]

const costConfig = Object.fromEntries(
  charges.map((charge) => [charge.key, { label: charge.label, color: charge.color }])
) satisfies ChartConfig

const consumptionConfig = {
  kwh: { label: "Consumption (kWh)", color: "var(--chart-electricity-500)" },
} satisfies ChartConfig

const metrics = [
  { value: "cost", label: "Cost" },
  { value: "consumption", label: "Consumption" },
] as const

type Metric = (typeof metrics)[number]["value"]

const presets = ["6M", "1Y"] as const
type Preset = (typeof presets)[number]

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })

// Statements close at month end, so the latest is last month's.
const LATEST_STATEMENT = startOfMonth(addMonths(SAMPLE_NOW, -1))

function rangeForPreset(preset: Preset): { from: Date; to: Date } {
  const months = { "6M": 6, "1Y": 12 }[preset]
  return { from: addMonths(LATEST_STATEMENT, -(months - 1)), to: LATEST_STATEMENT }
}

// One statement per month: usage peaks in summer, and demand charges follow
// the month's peak kW rather than its energy.
function statement(month: Date) {
  const random = seededRandom(month.getFullYear() * 12 + month.getMonth())
  const summer = Math.max(0, Math.sin(((month.getMonth() - 3) / 6) * Math.PI))
  const kwh = Math.round(212_000 * (1 + 0.28 * summer) * (0.95 + random() * 0.1))
  const peakKw = 980 * (1 + 0.35 * summer) * (0.95 + random() * 0.1)
  const energy = kwh * 0.084
  const delivery = kwh * 0.031
  const demand = peakKw * 12.4
  const fees = (energy + delivery + demand) * 0.13
  return {
    label: format(month, "MMM yy"),
    kwh,
    energy: Math.round(energy),
    delivery: Math.round(delivery),
    demand: Math.round(demand),
    fees: Math.round(fees),
  }
}

export function ChartCostBreakdownDemo() {
  const [metric, setMetric] = React.useState<Metric>("cost")
  const [preset, setPreset] = React.useState<Preset | undefined>("1Y")
  const [range, setRange] = React.useState<DateRange>(() => rangeForPreset("1Y"))
  const [overlays, setOverlays] = React.useState<Overlays>(DEFAULT_OVERLAYS)

  const rows = React.useMemo(() => {
    const from = startOfMonth(range.from ?? LATEST_STATEMENT)
    // No statement exists past the latest one, whatever month is picked.
    const to = min([startOfMonth(range.to ?? from), LATEST_STATEMENT])
    const months = Math.max(1, differenceInCalendarMonths(to, from) + 1)
    return Array.from({ length: months }, (_, index) => statement(addMonths(from, index)))
  }, [range])

  const isCost = metric === "cost"
  const totals = rows.map((row) =>
    isCost ? charges.reduce((sum, charge) => sum + row[charge.key as ChargeKey], 0) : row.kwh
  )
  const stats = { average: average(totals), min: Math.min(...totals), max: Math.max(...totals) }
  const withUnit = (value: number) => (isCost ? `$${formatNumber(value)}` : `${formatNumber(value)} kWh`)

  const references: ReferenceKey[] = [
    ...(overlays.average
      ? [{ key: "average", label: isCost ? "Average bill" : "Average month", value: withUnit(stats.average), dash: REFERENCE_DASH.average }]
      : []),
    ...(overlays.minMax
      ? [
          { key: "min", label: "Min", value: withUnit(stats.min), dash: REFERENCE_DASH.minMax },
          { key: "max", label: "Max", value: withUnit(stats.max), dash: REFERENCE_DASH.minMax },
        ]
      : []),
  ]

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @3xl/chart:flex-row @3xl/chart:items-start @3xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Bill breakdown</CardTitle>
          <CardDescription>
            {isCost ? "Charges by statement" : "Billed consumption by statement"} ·{" "}
            {rows.length} {rows.length === 1 ? "month" : "months"}
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <ChartMetricToggle label="Metric" metrics={metrics} value={metric} onValueChange={setMetric} />
          <ChartRangePicker
            label="Bill breakdown range"
            granularity="month"
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
            readouts={{
              average: withUnit(stats.average),
              minMax: `${compact.format(stats.min)}–${compact.format(stats.max)}`,
            }}
          />
          <ChartExportMenu filename={`bill-${metric}`} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={isCost ? costConfig : consumptionConfig} className="h-80 w-full">
          <BarChart
            accessibilityLayer
            data={rows}
            margin={{ top: 8, right: 8, left: 4 }}
            barCategoryGap={rows.length <= 8 ? BAR_CATEGORY_GAP.few : BAR_CATEGORY_GAP.normal}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => (isCost ? `$${compact.format(value)}` : compact.format(value))}
            />
            <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
            <ChartLegend itemSorter={null} content={<ChartLegendWithReferences references={references} />} />
            {isCost ? (
              charges.map((charge, index) => (
                <Bar
                  key={charge.key}
                  dataKey={charge.key}
                  stackId="bill"
                  fill={`var(--color-${charge.key})`}
                  // Only the topmost segment of a stack is rounded.
                  radius={index === charges.length - 1 ? [4, 4, 0, 0] : 0}
                  maxBarSize={48}
                  isAnimationActive={false}
                />
              ))
            ) : (
              <Bar dataKey="kwh" fill="var(--color-kwh)" radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive={false} />
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
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
