// ChartContainer preview — recharts wrapped in the DS chart config.
// The docs demos (chart-ramp-demo, chart-legacy-palette-demo) are swatch
// sheets several screens tall and animate on mount, so the card would clip
// them mid-draw; the same ramps are shown here as compact live charts with
// animation off.
// Recharts comes from the bundle: charts read their size from a React context, so a
// second copy inside the preview renders nothing.
import { Recharts } from "edgecom-design-system"
const { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, XAxis, YAxis } = Recharts

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const demand = [
  { hour: "00:00", actual: 412, forecast: 420 },
  { hour: "03:00", actual: 388, forecast: 395 },
  { hour: "06:00", actual: 540, forecast: 510 },
  { hour: "09:00", actual: 812, forecast: 790 },
  { hour: "12:00", actual: 934, forecast: 900 },
  { hour: "15:00", actual: 968, forecast: 945 },
  { hour: "18:00", actual: 855, forecast: 870 },
  { hour: "21:00", actual: 610, forecast: 640 },
]

const demandConfig = {
  actual: { label: "Actual demand (kW)", color: "var(--chart-electricity-700)" },
  forecast: { label: "Forecast (kW)", color: "var(--chart-electricity-300)" },
} satisfies ChartConfig

export function DemandArea() {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-body-sm font-medium">Northridge Distribution Center — demand today</span>
      <ChartContainer config={demandConfig} className="h-[240px] w-full">
        <AreaChart accessibilityLayer data={demand} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis width={40} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="forecast"
            type="monotone"
            stroke="var(--color-forecast)"
            fill="var(--color-forecast)"
            fillOpacity={0.15}
            strokeDasharray="4 4"
            isAnimationActive={false}
          />
          <Area
            dataKey="actual"
            type="monotone"
            stroke="var(--color-actual)"
            fill="var(--color-actual)"
            fillOpacity={0.25}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// Categorical: one commodity hue per series (chart-1…5).
const commodityData = [
  { month: "Feb", electricity: 62, water: 41, gas: 74, temperature: 33, emissions: 58 },
  { month: "Mar", electricity: 58, water: 44, gas: 68, temperature: 38, emissions: 55 },
  { month: "Apr", electricity: 65, water: 48, gas: 52, temperature: 45, emissions: 60 },
  { month: "May", electricity: 72, water: 56, gas: 40, temperature: 58, emissions: 66 },
  { month: "Jun", electricity: 84, water: 63, gas: 34, temperature: 71, emissions: 78 },
  { month: "Jul", electricity: 91, water: 68, gas: 31, temperature: 80, emissions: 85 },
]

const commodityConfig = {
  electricity: { label: "Electricity", color: "var(--chart-1)" },
  water: { label: "Water", color: "var(--chart-2)" },
  gas: { label: "Gas", color: "var(--chart-3)" },
  temperature: { label: "Temperature", color: "var(--chart-4)" },
  emissions: { label: "Emissions", color: "var(--chart-5)" },
} satisfies ChartConfig

export function CommodityLines() {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-body-sm font-medium">Consumption index by commodity — one hue per series</span>
      <ChartContainer config={commodityConfig} className="h-[240px] w-full">
        <LineChart accessibilityLayer data={commodityData} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(commodityConfig).map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}

// Sequential: one commodity's tint ramp (100 → 900) across sub-metered sites.
const siteData = [
  { month: "Feb", z1: 118, z2: 96, z3: 82, z4: 61, z5: 38 },
  { month: "Mar", z1: 124, z2: 101, z3: 78, z4: 64, z5: 41 },
  { month: "Apr", z1: 132, z2: 108, z3: 85, z4: 70, z5: 44 },
  { month: "May", z1: 145, z2: 118, z3: 92, z4: 76, z5: 49 },
  { month: "Jun", z1: 162, z2: 131, z3: 104, z4: 84, z5: 55 },
  { month: "Jul", z1: 174, z2: 140, z3: 111, z4: 90, z5: 58 },
]

const siteConfig = {
  z1: { label: "Main Building", color: "var(--chart-water-100)" },
  z2: { label: "Warehouse B", color: "var(--chart-water-300)" },
  z3: { label: "Chiller Plant", color: "var(--chart-water-500)" },
  z4: { label: "Data Center", color: "var(--chart-water-700)" },
  z5: { label: "HQ – Main Campus", color: "var(--chart-water-900)" },
} satisfies ChartConfig

export function StackedTintRamp() {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-body-sm font-medium">Water consumption by sub-metered site — tint ramp (100 → 900)</span>
      <ChartContainer config={siteConfig} className="h-[240px] w-full">
        <BarChart accessibilityLayer data={siteData} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(siteConfig).map((key) => (
            <Bar key={key} dataKey={key} stackId="site" fill={`var(--color-${key})`} isAnimationActive={false} />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

// Migration-only legacy hues: a ported regional-demand plot with ranked peak
// lines, a steel reference and a window band.
const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`)
const hourlyMw = [
  14200, 13900, 13700, 13600, 13800, 14300, 15400, 16800, 17900, 18600, 19100, 19500,
  19800, 20100, 20400, 20600, 20500, 20200, 19600, 18700, 17600, 16500, 15400, 14600,
]
const legacyData = hours.map((hour, i) => ({
  hour,
  regional: hourlyMw[i],
  estimate: i < 14 ? null : Math.round(hourlyMw[i] * (1 + (i - 14) * 0.004)),
}))

const legacyConfig = {
  regional: { label: "Regional demand", color: "var(--chart-legacy-line-green)" },
  estimate: { label: "Estimate", color: "var(--chart-legacy-line-brown)" },
} satisfies ChartConfig

const peakLines = [
  { rank: 1, value: 21750 },
  { rank: 2, value: 21150 },
  { rank: 4, value: 20250 },
]

export function LegacyPeakPlot() {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-body-sm font-medium">Ported plot — legacy hues, peak ranks and window band (MW)</span>
      <ChartContainer config={legacyConfig} className="h-[260px] w-full">
        <LineChart accessibilityLayer data={legacyData} margin={{ left: 4, right: 8, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
          <YAxis
            width={44}
            tickLine={false}
            axisLine={false}
            domain={[13000, 22000]}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          />
          <ReferenceArea x1="13:00" x2="17:00" fill="var(--chart-legacy-window-high)" fillOpacity={0.18} strokeOpacity={0} />
          {peakLines.map((p) => (
            <ReferenceLine
              key={p.rank}
              y={p.value}
              stroke={`var(--chart-legacy-peak-${p.rank})`}
              strokeWidth={1.5}
              label={{ value: `Peak ${p.rank}`, position: "insideTopRight", fill: `var(--chart-legacy-peak-${p.rank})`, fontSize: 11 }}
            />
          ))}
          <ReferenceLine
            y={20600}
            stroke="var(--chart-legacy-line-steel)"
            strokeWidth={2}
            label={{ value: "Reference", position: "insideTopLeft", fill: "var(--chart-legacy-line-steel)", fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="regional" type="monotone" stroke="var(--color-regional)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line
            dataKey="estimate"
            type="monotone"
            stroke="var(--color-estimate)"
            strokeWidth={1.75}
            strokeDasharray="6 4"
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
