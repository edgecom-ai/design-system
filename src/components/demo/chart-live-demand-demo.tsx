"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
import { ActivityIcon } from "lucide-react"

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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select-listbox"
import {
  CURVE_TYPE,
  ChartCurveToggle,
  ChartExportMenu,
  ChartLegendWithReferences,
  ChartOverlaysMenu,
  ChartRangePicker,
  type Curve,
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

// Five submeters on one site. Each series is a categorical line, so it takes a
// ramp step that clears 3:1 on card in both themes — a 2px line needs the
// darker steps where a bar can take the 500 fill.
const devices = [
  { id: "main", label: "Main incomer", base: 620, swing: 380, color: "var(--chart-water-500)" },
  { id: "chiller", label: "Chiller 1", base: 180, swing: 210, color: "var(--chart-electricity-700)" },
  { id: "compressor", label: "Air compressor", base: 140, swing: 60, color: "var(--chart-temperature-700)" },
  { id: "line-a", label: "Production line A", base: 90, swing: 150, color: "var(--chart-misc-500)" },
  { id: "hvac", label: "Rooftop HVAC", base: 60, swing: 90, color: "var(--chart-gas-500)" },
] as const

type DeviceId = (typeof devices)[number]["id"]

const chartConfig = Object.fromEntries(
  devices.map((device) => [device.id, { label: device.label, color: device.color }])
) satisfies ChartConfig

const presets = ["Today", "1D", "1W", "1M"] as const
type Preset = (typeof presets)[number]

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function rangeForPreset(preset: Preset): { from: Date; to: Date } {
  const to = SAMPLE_NOW
  if (preset === "Today") {
    const from = new Date(to)
    from.setHours(0, 0, 0, 0)
    return { from, to }
  }
  const days = { "1D": 1, "1W": 7, "1M": 30 }[preset]
  return { from: new Date(to.getTime() - days * DAY), to }
}

// Coarser steps for longer ranges keep the point count readable.
function stepFor(span: number) {
  if (span <= 2 * DAY) return 15 * MINUTE
  if (span <= 14 * DAY) return HOUR
  return 4 * HOUR
}

// Ticks pinned to round local times, one step coarser as the range widens, so
// the axis never lands on odd minutes or repeats a date.
function ticksFor(from: number, to: number) {
  const span = to - from
  const interval =
    span <= 1.1 * DAY ? 3 * HOUR : span <= 2 * DAY ? 6 * HOUR : span <= 14 * DAY ? DAY : 7 * DAY
  const first = new Date(from)
  const hours = interval / HOUR
  first.setHours(interval >= DAY ? 0 : Math.floor(first.getHours() / hours) * hours, 0, 0, 0)
  const ticks: number[] = []
  for (let tick = first.getTime(); tick <= to; tick += interval) {
    if (tick >= from) ticks.push(tick)
  }
  return ticks
}

// A working-day load profile: low overnight, ramping from 06:00, peaking in the
// afternoon, lighter at weekends. Noise is keyed to the timestamp, so a reading
// is the same whichever range it is drawn in.
function reading(deviceIndex: number, time: number) {
  const device = devices[deviceIndex]
  const date = new Date(time)
  const hour = date.getHours() + date.getMinutes() / 60
  const weekend = date.getDay() === 0 || date.getDay() === 6
  const shape = Math.max(0, Math.sin(((hour - 6) / 14) * Math.PI))
  const noise = seededRandom(Math.floor(time / (15 * MINUTE)) * 31 + deviceIndex)()
  const load = device.base + device.swing * shape * (weekend ? 0.45 : 1)
  return Math.round(load * (0.94 + noise * 0.12))
}

function buildSeries(range: { from: Date; to: Date }) {
  const from = range.from.getTime()
  const to = Math.min(range.to.getTime(), SAMPLE_NOW.getTime())
  const step = stepFor(to - from)
  const rows: Array<{ time: number } & Record<DeviceId, number>> = []
  for (let time = Math.ceil(from / step) * step; time <= to; time += step) {
    const row = { time } as { time: number } & Record<DeviceId, number>
    devices.forEach((device, index) => {
      row[device.id] = reading(index, time)
    })
    rows.push(row)
  }
  return { rows, step }
}

export function ChartLiveDemandDemo() {
  const [selected, setSelected] = React.useState<string[]>(["main", "chiller", "compressor"])
  const [preset, setPreset] = React.useState<Preset | undefined>("Today")
  const [range, setRange] = React.useState<DateRange>(() => rangeForPreset("Today"))
  const [overlays, setOverlays] = React.useState<Overlays>(DEFAULT_OVERLAYS)
  const [curve, setCurve] = React.useState<Curve>("smooth")

  const { rows, step } = React.useMemo(
    () => buildSeries({ from: range.from ?? SAMPLE_NOW, to: range.to ?? SAMPLE_NOW }),
    [range]
  )
  const first = rows[0]?.time ?? 0
  const last = rows.at(-1)?.time ?? 0
  const span = last - first
  const plotted = devices.filter((device) => selected.includes(device.id))

  // Overlays describe every value on the plot, so they move with the selection.
  const values = plotted.flatMap((device) => rows.map((row) => row[device.id]))
  const stats = values.length
    ? { average: average(values), min: Math.min(...values), max: Math.max(...values) }
    : undefined

  const latest = rows.at(-1)
  const options: MultiSelectOption[] = devices.map((device) => ({
    id: device.id,
    label: device.label,
    meta: latest ? `${formatNumber(latest[device.id])} kW` : undefined,
    swatch: device.color,
  }))

  const references: ReferenceKey[] = stats
    ? [
        ...(overlays.average
          ? [{ key: "average", label: "Period average", value: `${formatNumber(stats.average)} kW`, dash: REFERENCE_DASH.average }]
          : []),
        ...(overlays.minMax
          ? [
              { key: "min", label: "Min", value: `${formatNumber(stats.min)} kW`, dash: REFERENCE_DASH.minMax },
              { key: "max", label: "Max", value: `${formatNumber(stats.max)} kW`, dash: REFERENCE_DASH.minMax },
            ]
          : []),
      ]
    : []

  const timeTick = (time: number) => format(time, span <= 2 * DAY ? "HH:mm" : "MMM d")
  const stepLabel = step === 15 * MINUTE ? "15-minute" : step === HOUR ? "Hourly" : "4-hour"

  return (
    <Card className="@container/chart w-full">
      <CardHeader className="flex flex-col gap-4 @4xl/chart:flex-row @4xl/chart:items-start @4xl/chart:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Power demand</CardTitle>
          <CardDescription>
            {stepLabel} readings · updated {format(SAMPLE_NOW, "h:mm a")}
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap items-center gap-2">
          <MultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            placeholder="Select device data"
            itemNoun="devices"
            showCount
          />
          <ChartRangePicker
            label="Power demand range"
            presets={presets}
            preset={preset}
            onPresetChange={(next) => {
              setPreset(next)
              setRange(rangeForPreset(next))
            }}
            range={range}
            onRangeChange={(next) => {
              const to = new Date(next.to)
              to.setHours(23, 59, 59, 999)
              setPreset(undefined)
              setRange({ from: next.from, to })
            }}
          />
          <ChartOverlaysMenu
            overlays={overlays}
            onOverlaysChange={setOverlays}
            readouts={
              stats && {
                average: `${formatNumber(stats.average)} kW`,
                minMax: `${formatNumber(stats.min)}–${formatNumber(stats.max)} kW`,
              }
            }
          />
          <ChartCurveToggle curve={curve} onCurveChange={setCurve} />
          <ChartExportMenu filename="power-demand" />
        </CardAction>
      </CardHeader>
      <CardContent>
        {plotted.length === 0 ? (
          <Empty className="h-80 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ActivityIcon />
              </EmptyMedia>
              <EmptyTitle>No devices selected</EmptyTitle>
              <EmptyDescription>
                Choose one or more devices from Select device data to plot their demand.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <LineChart accessibilityLayer data={rows} margin={{ top: 8, right: 8, left: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                ticks={ticksFor(first, last)}
                tickFormatter={timeTick}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                width={76}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${formatNumber(value)} kW`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) =>
                      format(payload[0]?.payload.time ?? 0, "EEE, MMM d · HH:mm")
                    }
                  />
                }
              />
              <ChartLegend itemSorter={null} content={<ChartLegendWithReferences references={references} />} />
              {stats && overlays.average && (
                <ReferenceLine
                  y={stats.average}
                  stroke={REFERENCE_STROKE}
                  strokeDasharray={REFERENCE_DASH.average}
                />
              )}
              {stats && overlays.minMax && (
                <>
                  <ReferenceLine y={stats.min} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.minMax} />
                  <ReferenceLine y={stats.max} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.minMax} />
                </>
              )}
              {plotted.map((device) => (
                <Line
                  key={device.id}
                  dataKey={device.id}
                  type={CURVE_TYPE[curve]}
                  stroke={`var(--color-${device.id})`}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
