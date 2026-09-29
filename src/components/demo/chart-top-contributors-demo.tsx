"use client"

import * as React from "react"
import { addMonths, format, startOfMonth } from "date-fns"
import { Bar, BarChart, XAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BAR_CATEGORY_GAP,
  ChartExportMenu,
  ChartMetricToggle,
  SAMPLE_NOW,
  formatNumber,
  seededRandom,
} from "@/components/demo/chart-controls"

const metrics = [
  { value: "consumption", label: "Consumption", unit: "kWh", color: "var(--chart-electricity-500)" },
  { value: "cost", label: "Cost", unit: "$", color: "var(--chart-misc-500)" },
  { value: "emissions", label: "Emissions", unit: "kg CO₂e", color: "var(--chart-emissions-500)" },
] as const

type Metric = (typeof metrics)[number]["value"]

const devices = [
  { id: "chiller-1", name: "Chiller 1", base: 41_000 },
  { id: "compressor", name: "Air compressor", base: 33_500 },
  { id: "line-a", name: "Production line A", base: 28_200 },
  { id: "hvac", name: "Rooftop HVAC", base: 17_900 },
  { id: "lighting", name: "Lighting panel 2", base: 9_400 },
]

const MONTHS = 6
const LATEST_MONTH = startOfMonth(addMonths(SAMPLE_NOW, -1))

function valueFor(metric: Metric, kwh: number) {
  if (metric === "cost") return kwh * 0.142
  if (metric === "emissions") return kwh * 0.118
  return kwh
}

// Each device's trailing months, with its share of every month's combined
// total — the ranking reads the latest month's share.
function rankContributors(metric: Metric) {
  const months = Array.from({ length: MONTHS }, (_, index) =>
    addMonths(LATEST_MONTH, index - MONTHS + 1)
  )
  const series = devices.map((device, deviceIndex) => {
    const random = seededRandom(deviceIndex * 97 + 7)
    return {
      ...device,
      points: months.map((month) => {
        const summer = Math.max(0, Math.sin(((month.getMonth() - 3) / 6) * Math.PI))
        const cooling = device.id === "chiller-1" || device.id === "hvac" ? 0.6 : 0.1
        const kwh = device.base * (1 + cooling * summer) * (0.9 + random() * 0.2)
        return { month: format(month, "MMM"), value: Math.round(valueFor(metric, kwh)) }
      }),
    }
  })
  const totals = months.map((_, index) =>
    series.reduce((sum, device) => sum + device.points[index].value, 0)
  )
  return series
    .map((device) => ({
      ...device,
      points: device.points.map((point, index) => ({
        ...point,
        share: (point.value / totals[index]) * 100,
      })),
    }))
    .map((device) => ({ ...device, latest: device.points[MONTHS - 1] }))
    .sort((a, b) => b.latest.share - a.latest.share)
}

export function ChartTopContributorsDemo() {
  const [metric, setMetric] = React.useState<Metric>("consumption")

  const active = metrics.find((item) => item.value === metric) ?? metrics[0]
  const contributors = React.useMemo(() => rankContributors(metric), [metric])
  const withUnit = (value: number) =>
    active.unit === "$" ? `$${formatNumber(value)}` : `${formatNumber(value)} ${active.unit}`

  const chartConfig = {
    value: { label: `${active.label} (${active.unit})`, color: active.color },
  } satisfies ChartConfig

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @xl/chart:flex-row @xl/chart:items-start @xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Top contributors</CardTitle>
          <CardDescription>
            Ranked by share of {format(LATEST_MONTH, "MMMM")} · last {MONTHS} months
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <ChartMetricToggle label="Metric" metrics={metrics} value={metric} onValueChange={setMetric} />
          <ChartExportMenu filename={`top-contributors-${metric}`} />
        </CardAction>
      </CardHeader>
      {/* A long list scrolls in place instead of stretching the card. */}
      <CardContent className="max-h-96 overflow-y-auto">
        <ul className="flex flex-col gap-4">
          {contributors.map((device) => (
            <li key={device.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm font-medium">{device.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-caption text-muted-foreground tabular-nums">
                    {device.latest.share.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className="tabular-nums">
                    {withUnit(device.latest.value)}
                  </Badge>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="aspect-auto h-20 w-full">
                <BarChart
                  accessibilityLayer
                  data={device.points}
                  margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                  barCategoryGap={BAR_CATEGORY_GAP.few}
                >
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={4} />
                  <ChartTooltip
                    cursor={{ fillOpacity: 0.5 }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) =>
                          `${payload[0]?.payload.month} · ${payload[0]?.payload.share.toFixed(1)}% of total`
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ChartContainer>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
