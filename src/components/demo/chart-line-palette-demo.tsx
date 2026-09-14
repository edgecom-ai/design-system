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

// The palette is named by colour on purpose: which hue a series takes is a
// product's own convention, so the token carries no meaning of its own.
// `alias` names the hue a peak rank resolves to.
type Swatch = { token: string; label: string; alias?: string }

const families: { name: string; note: string; swatches: Swatch[] }[] = [
  {
    name: "Line palette",
    note: "Twelve plot-line hues, each tuned to 3:1 on card in both themes. A product maps its series onto them in one place and takes each line by hue.",
    swatches: [
      { token: "line-teal", label: "Teal" },
      { token: "line-green", label: "Green" },
      { token: "line-brown", label: "Brown" },
      { token: "line-orange", label: "Orange" },
      { token: "line-red", label: "Red" },
      { token: "line-magenta", label: "Magenta" },
      { token: "line-sky", label: "Sky" },
      { token: "line-yellow", label: "Yellow" },
      { token: "line-lime", label: "Lime" },
      { token: "line-wine", label: "Wine" },
      { token: "line-olive", label: "Olive" },
      { token: "line-steel", label: "Steel" },
    ],
  },
  {
    name: "Peak ranks",
    note: "One hue per rank, in the order operators know them. Rank is the identity, so the order never rotates.",
    swatches: [
      { token: "peak-1", label: "Peak 1", alias: "line-magenta" },
      { token: "peak-2", label: "Peak 2", alias: "line-sky" },
      { token: "peak-3", label: "Peak 3", alias: "line-red" },
      { token: "peak-4", label: "Peak 4", alias: "line-yellow" },
      { token: "peak-5", label: "Peak 5", alias: "line-lime" },
      { token: "peak-6", label: "Peak 6", alias: "line-wine" },
      { token: "peak-7", label: "Peak 7", alias: "line-olive" },
    ],
  },
  {
    name: "Peak windows",
    note: "Filled bands behind the lines, graded by rank. One red mixed toward the surface, so the softest band stays soft on a dark card.",
    swatches: [
      { token: "window-high", label: "Ranks 1–2" },
      { token: "window-normal", label: "Rank 3" },
      { token: "window-low", label: "Rank 4+" },
    ],
  },
]

// A day of regional demand in MW: two readings of it, a dashed estimate, and
// one site's own draw on a second axis, under ranked peak lines and the
// window the top hours fall in.
const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`)
const hourlyMw = [
  14200, 13900, 13700, 13600, 13800, 14300, 15400, 16800, 17900, 18600, 19100, 19500,
  19800, 20100, 20400, 20600, 20500, 20200, 19600, 18700, 17600, 16500, 15400, 14600,
]
const demandData = hours.map((hour, i) => ({
  hour,
  regional: hourlyMw[i],
  estimate: i < 14 ? null : Math.round(hourlyMw[i] * (1 + (i - 14) * 0.004)),
  site: +(2.4 + Math.sin((i - 6) / 4) * 1.1 + (i > 12 && i < 18 ? 0.6 : 0)).toFixed(2),
}))

const demandConfig = {
  regional: { label: "Regional demand", color: "var(--chart-line-green)" },
  estimate: { label: "Estimate", color: "var(--chart-line-brown)" },
  site: { label: "Site draw", color: "var(--chart-line-red)" },
} satisfies ChartConfig

const peakLines = [
  { rank: 1, value: 21750 },
  { rank: 2, value: 21150 },
  { rank: 4, value: 20250 },
]

export function ChartLinePaletteDemo() {
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3">
            {family.swatches.map((swatch) => (
              <div key={swatch.token} className="flex min-w-0 flex-col gap-1.5">
                {family.name === "Peak windows" ? (
                  <div
                    className="h-12 rounded-md border border-border/40"
                    style={{ background: `var(--chart-${swatch.token})` }}
                    aria-hidden
                  />
                ) : (
                  <div
                    className="flex h-12 items-center rounded-md border border-border/40 bg-card px-2"
                    aria-hidden
                  >
                    <div
                      className="h-0.5 w-full rounded-full"
                      style={{ background: `var(--chart-${swatch.token})` }}
                    />
                  </div>
                )}
                <span className="text-xs font-medium">{swatch.label}</span>
                <span className="font-mono text-[11px] break-all text-muted-foreground">
                  chart-{swatch.token}
                </span>
                {swatch.alias && (
                  <span className="text-[11px] break-all text-muted-foreground/70">
                    = chart-{swatch.alias}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 border-t pt-6">
        <span className="text-xs font-medium text-muted-foreground">
          In a plot — line hues, peak lines, a steel reference line, and a window band together
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
              stroke="var(--chart-line-steel)"
              strokeWidth={2}
              label={{
                value: "Reference",
                position: "insideTopLeft",
                fill: "var(--chart-line-steel)",
                fontSize: 11,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              yAxisId="mw"
              dataKey="regional"
              type="monotone"
              stroke="var(--color-regional)"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              yAxisId="mw"
              dataKey="estimate"
              type="monotone"
              stroke="var(--color-estimate)"
              strokeWidth={1.75}
              strokeDasharray="6 4"
              dot={false}
              connectNulls={false}
            />
            <Line
              yAxisId="site"
              dataKey="site"
              type="monotone"
              stroke="var(--color-site)"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
