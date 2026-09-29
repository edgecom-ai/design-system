"use client"

import { format } from "date-fns"
import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, XAxis, YAxis } from "recharts"

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
  ChartExportMenu,
  ChartLegendWithReferences,
  REFERENCE_DASH,
  REFERENCE_STROKE,
  SAMPLE_NOW,
  formatNumber,
  seededRandom,
} from "@/components/demo/chart-controls"

// The threshold the alarm is set at — the chart's one reference line.
const THRESHOLD_KW = 850

const MINUTE = 60_000
const STEP = 5 * MINUTE
const LEAD_IN = 90 * MINUTE

const chartConfig = {
  demand: { label: "Demand (kW)", color: "var(--chart-electricity-700)" },
} satisfies ChartConfig

// A midday demand peak on one incomer: it rises through the threshold, peaks,
// and settles back under it. The window runs from a lead-in before the alarm
// triggered to a tail after it cleared — the event sets it, not the reader.
function buildEvent() {
  const peakAt = new Date(SAMPLE_NOW)
  peakAt.setHours(12, 40, 0, 0)
  const start = peakAt.getTime() - 2.5 * 60 * MINUTE
  const end = peakAt.getTime() + 2 * 60 * MINUTE
  const rows: { time: number; demand: number }[] = []
  for (let time = start; time <= end; time += STEP) {
    const minutes = (time - peakAt.getTime()) / MINUTE
    const noise = seededRandom(time / STEP)() - 0.5
    rows.push({ time, demand: Math.round(640 + 330 * Math.exp(-((minutes / 52) ** 2)) + noise * 14) })
  }
  const triggered = rows.find((row) => row.demand > THRESHOLD_KW)!.time
  const cleared = rows.findLast((row) => row.demand > THRESHOLD_KW)!.time + STEP
  const peak = rows.reduce((best, row) => (row.demand > best.demand ? row : best))
  // Trim to the event's own window: the lead-in, the event, and a matching tail.
  const window = rows.filter((row) => row.time >= triggered - LEAD_IN && row.time <= cleared + LEAD_IN)
  return { rows: window, triggered, cleared, peak }
}

const event = buildEvent()
const durationMinutes = (event.cleared - event.triggered) / MINUTE

const facts = [
  { label: "Peak", value: `${formatNumber(event.peak.demand)} kW at ${format(event.peak.time, "HH:mm")}` },
  { label: "Over threshold by", value: `${formatNumber(event.peak.demand - THRESHOLD_KW)} kW` },
  { label: "Duration", value: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` },
]

export function ChartEventWindowDemo() {
  return (
    <Card className="@container/chart w-full">
      <CardHeader>
        <CardTitle>High demand alarm · Main incomer</CardTitle>
        <CardDescription>
          Triggered {format(event.triggered, "MMM d 'at' HH:mm")} · cleared{" "}
          {format(event.cleared, "HH:mm")}
        </CardDescription>
        {/* An event-window chart carries the export menu and nothing else. */}
        <CardAction>
          <ChartExportMenu filename="high-demand-alarm" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <LineChart accessibilityLayer data={event.rows} margin={{ top: 20, right: 8, left: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(time: number) => format(time, "HH:mm")}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              width={76}
              domain={[550, 1050]}
              ticks={[600, 700, 800, 900, 1000]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${formatNumber(value)} kW`}
            />
            <ReferenceArea
              x1={event.triggered}
              x2={event.cleared}
              fill="var(--muted-foreground)"
              fillOpacity={0.1}
              strokeOpacity={0}
              label={{
                value: "Alarm active",
                position: "insideTop",
                offset: -14,
                fill: "var(--muted-foreground)",
                fontSize: 12,
              }}
            />
            <ReferenceLine
              y={THRESHOLD_KW}
              stroke={REFERENCE_STROKE}
              strokeDasharray={REFERENCE_DASH.average}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => format(payload[0]?.payload.time ?? 0, "HH:mm")}
                />
              }
            />
            <ChartLegend
              content={
                <ChartLegendWithReferences
                  references={[
                    {
                      key: "threshold",
                      label: "Threshold",
                      value: `${formatNumber(THRESHOLD_KW)} kW`,
                      dash: REFERENCE_DASH.average,
                    },
                  ]}
                />
              }
            />
            <Line
              dataKey="demand"
              type="monotone"
              stroke="var(--color-demand)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
        <dl className="grid gap-3 border-t pt-4 @md/chart:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="text-caption text-muted-foreground">{fact.label}</dt>
              <dd className="text-body-sm font-medium tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
