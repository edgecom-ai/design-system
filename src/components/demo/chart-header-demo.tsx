"use client"

// The canonical chart card (design.md → Charts & graphs → The chart header):
// the title and its "Last updated" line in the CardHeader; in the CardAction,
// the primary action, the two-state overlay Toggle, the connected range
// presets with the compact range calendar, and the export menu — every
// control at `size="default"`. Below, the axis caption above the plot, the
// time-zone line under it, the legend centred, then the threshold strip.

import * as React from "react"
import { format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Toggle } from "@/components/ui/toggle"
import {
  ChartExportMenu,
  ChartLegendWithReferences,
  ChartRangePicker,
  REFERENCE_DASH,
  REFERENCE_STROKE,
  type ReferenceKey,
  SAMPLE_NOW,
  formatNumber,
  seededRandom,
} from "@/components/demo/chart-controls"

const presets = ["Today", "1D", "1W", "1M"] as const
type Preset = (typeof presets)[number]

const PLAN_LIMIT = 1200

// One day of hourly sessions, with last week's curve running a little under it.
const random = seededRandom(11)
const rows = Array.from({ length: 24 }, (_, hour) => {
  const daytime = Math.sin(((hour - 5) / 24) * Math.PI) ** 2
  const sessions = Math.round(520 + 640 * daytime + (random() - 0.5) * 60)
  return { hour, sessions, previous: Math.round(sessions * 0.96 - 20) }
})

const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-misc-700)" },
  previous: { label: "Previous week", color: "var(--chart-misc-300)" },
} satisfies ChartConfig

const references: ReferenceKey[] = [
  { key: "limit", label: "Plan limit", value: formatNumber(PLAN_LIMIT), dash: REFERENCE_DASH.average },
]

function rangeFor(preset: Preset): DateRange {
  const to = SAMPLE_NOW
  const days = { Today: 0, "1D": 1, "1W": 6, "1M": 30 }[preset]
  return { from: subDays(to, days), to }
}

export function ChartHeaderDemo() {
  const [preset, setPreset] = React.useState<Preset | undefined>("Today")
  const [range, setRange] = React.useState<DateRange>(() => rangeFor("Today"))
  const [compare, setCompare] = React.useState(false)

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @4xl/chart:flex-row @4xl/chart:items-start @4xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Last updated {format(SAMPLE_NOW, "h:mm a")}</CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <Button>
            <Share2Icon data-icon="inline-start" />
            Share
          </Button>
          <Toggle variant="outline" pressed={compare} onPressedChange={setCompare}>
            Previous week
          </Toggle>
          <ChartRangePicker
            label="Active sessions range"
            presets={presets}
            preset={preset}
            onPresetChange={(next) => {
              setPreset(next)
              setRange(rangeFor(next))
            }}
            range={range}
            onRangeChange={(next) => {
              setPreset(undefined)
              setRange(next)
            }}
          />
          <ChartExportMenu filename="active-sessions" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/* The axis caption sits above the plot, not rotated along the axis. */}
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <span>Sessions</span>
          <span>Hourly · {format(range.from ?? SAMPLE_NOW, "MMM d")}</span>
        </div>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart accessibilityLayer data={rows} margin={{ top: 8, right: 8, left: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[0, 6, 12, 18, 23]}
              tickFormatter={hourLabel}
            />
            <YAxis
              width={56}
              tickLine={false}
              axisLine={false}
              domain={[0, 1400]}
              tickFormatter={(value: number) => formatNumber(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => hourLabel(payload[0]?.payload.hour ?? 0)}
                />
              }
            />
            <ChartLegend itemSorter={null} content={<ChartLegendWithReferences references={references} />} />
            <ReferenceLine y={PLAN_LIMIT} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.average} />
            <Area
              dataKey="sessions"
              type="monotone"
              stroke="var(--color-sessions)"
              fill="var(--color-sessions)"
              fillOpacity={0.12}
              strokeWidth={2}
              isAnimationActive={false}
            />
            {compare && (
              <Area
                dataKey="previous"
                type="monotone"
                stroke="var(--color-previous)"
                fill="none"
                strokeWidth={2}
                strokeDasharray="6 4"
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ChartContainer>
        {/* The time-zone line reads under the plot, before the legend's row. */}
        <p className="text-center text-caption text-muted-foreground">
          Times in UTC
        </p>
        {/* The threshold strip: what the dashed line and the window mean. */}
        <dl className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t pt-3 text-caption">
          <div className="flex items-center gap-1.5">
            <dt className="text-muted-foreground">Plan limit</dt>
            <dd className="font-medium tabular-nums">{formatNumber(PLAN_LIMIT)} sessions</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-muted-foreground">Busiest hours</dt>
            <dd className="font-medium tabular-nums">16:00–21:00</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-muted-foreground">Projected high</dt>
            <dd className="font-medium tabular-nums">1,140 at 17:00</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
