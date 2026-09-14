"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Every token is a role; a role that shares its hue with another aliases it,
// so the palette is defined once per hue. `alias` names the token a role
// resolves to.
type Role = { token: string; label: string; alias?: string }

const families: { name: string; note: string; roles: Role[] }[] = [
  {
    name: "Demand series",
    note: "The lines a demand plot draws: readings, the forecasts of them, and the site's own draw.",
    roles: [
      { token: "demand-live", label: "Live reading" },
      { token: "demand-hourly", label: "Hourly reading" },
      { token: "demand-projected", label: "Market projection", alias: "demand-hourly" },
      { token: "demand-forecast", label: "Platform forecast" },
      { token: "demand-short-forecast", label: "Short forecast" },
      { token: "demand-facility", label: "Facility draw" },
      { token: "demand-interval-1", label: "1-min interval", alias: "demand-short-forecast" },
      { token: "demand-interval-5", label: "5-min interval", alias: "peak-1" },
      { token: "demand-interval-15", label: "15-min interval", alias: "threshold-peak-to-date" },
    ],
  },
  {
    name: "Peak ranks",
    note: "One hue per rank, in the order operators know them. Rank is the identity, so the order never rotates.",
    roles: [
      { token: "peak-1", label: "Peak 1" },
      { token: "peak-2", label: "Peak 2" },
      { token: "peak-3", label: "Peak 3", alias: "demand-facility" },
      { token: "peak-4", label: "Peak 4" },
      { token: "peak-5", label: "Peak 5" },
      { token: "peak-6", label: "Peak 6" },
      { token: "peak-7", label: "Peak 7" },
    ],
  },
  {
    name: "Thresholds",
    note: "Horizontal lines the operator steers between. Not the neutral statistical overlays; these are read by colour.",
    roles: [
      { token: "threshold-peak-to-date", label: "Peak to date" },
      { token: "threshold-action", label: "Action required", alias: "peak-1" },
      { token: "threshold-projected", label: "Projected peak", alias: "demand-short-forecast" },
    ],
  },
  {
    name: "Peak windows",
    note: "Filled bands behind the lines, graded by rank. One red mixed toward the surface, so the softest band stays soft on a dark card.",
    roles: [
      { token: "window-high", label: "Ranks 1–2" },
      { token: "window-normal", label: "Rank 3" },
      { token: "window-low", label: "Rank 4+" },
    ],
  },
]

// A day of regional demand in MW: the hourly reading, the platform's forecast
// of it, and one site's own draw on a second axis, under the day's ranked
// peak lines and the window the top hours fall in.
const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`)
const hourlyMw = [
  14200, 13900, 13700, 13600, 13800, 14300, 15400, 16800, 17900, 18600, 19100, 19500,
  19800, 20100, 20400, 20600, 20500, 20200, 19600, 18700, 17600, 16500, 15400, 14600,
]
const demandData = hours.map((hour, i) => ({
  hour,
  hourly: hourlyMw[i],
  forecast: i < 14 ? null : Math.round(hourlyMw[i] * (1 + (i - 14) * 0.004)),
  facility: +(2.4 + Math.sin((i - 6) / 4) * 1.1 + (i > 12 && i < 18 ? 0.6 : 0)).toFixed(2),
}))

const demandConfig = {
  hourly: { label: "Hourly reading", color: "var(--chart-demand-hourly)" },
  forecast: { label: "Platform forecast", color: "var(--chart-demand-forecast)" },
  facility: { label: "Facility draw", color: "var(--chart-demand-facility)" },
} satisfies ChartConfig

const peakLines = [
  { rank: 1, value: 21750 },
  { rank: 2, value: 21150 },
  { rank: 4, value: 20250 },
]

export function ChartDemandPaletteDemo() {
  return (
    <div className="flex flex-col gap-8">
      {families.map((family) => (
        <div key={family.name} className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">{family.name}</span>
            <span className="max-w-2xl text-caption font-normal text-muted-foreground/80">
              {family.note}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] gap-3">
            {family.roles.map((role) => (
              <div key={role.token} className="flex min-w-0 flex-col gap-1.5">
                {family.name === "Peak windows" ? (
                  <div
                    className="h-12 rounded-md border border-border/40"
                    style={{ background: `var(--chart-${role.token})` }}
                    aria-hidden
                  />
                ) : (
                  <div
                    className="flex h-12 items-center rounded-md border border-border/40 bg-card px-2"
                    aria-hidden
                  >
                    <div
                      className="h-0.5 w-full rounded-full"
                      style={{ background: `var(--chart-${role.token})` }}
                    />
                  </div>
                )}
                <span className="text-xs font-medium">{role.label}</span>
                <span className="font-mono text-[11px] break-all text-muted-foreground">
                  chart-{role.token}
                </span>
                {role.alias && (
                  <span className="text-[11px] break-all text-muted-foreground/70">
                    = chart-{role.alias}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 border-t pt-6">
        <span className="text-xs font-medium text-muted-foreground">
          In a demand plot — series, peak lines, and a peak window together
        </span>
        <ChartContainer config={demandConfig} className="h-[280px] w-full">
          <LineChart accessibilityLayer data={demandData} margin={{ left: 4, right: 8, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
            <YAxis
              yAxisId="mw"
              width={44}
              tickLine={false}
              axisLine={false}
              domain={[13000, 22000]}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <YAxis yAxisId="site" orientation="right" hide domain={[0, 6]} />
            <ReferenceArea
              yAxisId="mw"
              x1="13:00"
              x2="17:00"
              fill="var(--chart-window-high)"
              fillOpacity={0.18}
              strokeOpacity={0}
            />
            {peakLines.map((p) => (
              <ReferenceLine
                key={p.rank}
                yAxisId="mw"
                y={p.value}
                stroke={`var(--chart-peak-${p.rank})`}
                strokeWidth={1.5}
                label={{
                  value: `Peak ${p.rank}`,
                  position: "insideTopRight",
                  fill: `var(--chart-peak-${p.rank})`,
                  fontSize: 11,
                }}
              />
            ))}
            <ReferenceLine
              yAxisId="mw"
              y={20600}
              stroke="var(--chart-threshold-peak-to-date)"
              strokeWidth={2}
              label={{
                value: "Peak to date",
                position: "insideTopLeft",
                fill: "var(--chart-threshold-peak-to-date)",
                fontSize: 11,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              yAxisId="mw"
              dataKey="hourly"
              type="monotone"
              stroke="var(--color-hourly)"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              yAxisId="mw"
              dataKey="forecast"
              type="monotone"
              stroke="var(--color-forecast)"
              strokeWidth={1.75}
              strokeDasharray="6 4"
              dot={false}
              connectNulls={false}
            />
            <Line
              yAxisId="site"
              dataKey="facility"
              type="monotone"
              stroke="var(--color-facility)"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
