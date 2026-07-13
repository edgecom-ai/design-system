"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const charts = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

const commodityRamps = [
  { name: "Electricity", key: "electricity" },
  { name: "Water", key: "water" },
  { name: "Gas", key: "gas" },
  { name: "Temperature", key: "temperature" },
  { name: "Emissions", key: "emissions" },
]

const rampSteps = ["100", "300", "500", "700", "900"]

// Categorical: one hue per commodity (chart-1…5), normalized consumption index.
const categoricalData = [
  { month: "Feb", electricity: 62, water: 41, gas: 74, temperature: 33, emissions: 58 },
  { month: "Mar", electricity: 58, water: 44, gas: 68, temperature: 38, emissions: 55 },
  { month: "Apr", electricity: 65, water: 48, gas: 52, temperature: 45, emissions: 60 },
  { month: "May", electricity: 72, water: 56, gas: 40, temperature: 58, emissions: 66 },
  { month: "Jun", electricity: 84, water: 63, gas: 34, temperature: 71, emissions: 78 },
  { month: "Jul", electricity: 91, water: 68, gas: 31, temperature: 80, emissions: 85 },
]

const categoricalConfig = {
  electricity: { label: "Electricity", color: "var(--chart-water-900)" },
  water: { label: "Water", color: "var(--chart-water-700)" },
  gas: { label: "Gas", color: "var(--chart-water-500)" },
  temperature: { label: "Temperature", color: "var(--chart-water-300)" },
  emissions: { label: "Emissions", color: "var(--chart-water-100)" },
} satisfies ChartConfig

// Sequential: one commodity's tint ramp (100 → 900) across sub-metered zones.
const tintData = [
  { month: "Feb", z1: 118, z2: 96, z3: 82, z4: 61, z5: 38 },
  { month: "Mar", z1: 124, z2: 101, z3: 78, z4: 64, z5: 41 },
  { month: "Apr", z1: 132, z2: 108, z3: 85, z4: 70, z5: 44 },
  { month: "May", z1: 145, z2: 118, z3: 92, z4: 76, z5: 49 },
  { month: "Jun", z1: 162, z2: 131, z3: 104, z4: 84, z5: 55 },
  { month: "Jul", z1: 174, z2: 140, z3: 111, z4: 90, z5: 58 },
]

const tintConfig = {
  z1: { label: "Main Building", color: "var(--chart-water-100)" },
  z2: { label: "Warehouse B", color: "var(--chart-water-300)" },
  z3: { label: "Chiller Plant", color: "var(--chart-water-500)" },
  z4: { label: "Data Center", color: "var(--chart-water-700)" },
  z5: { label: "HQ – Bay Street", color: "var(--chart-water-900)" },
} satisfies ChartConfig

export function ChartRampDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Categorical — one hue per commodity (chart-1…5)
        </span>
        <div className="grid max-w-md grid-cols-5 gap-3">
          {charts.map((c, i) => (
            <div key={c} className="flex flex-col gap-1.5">
              <div className="h-16 rounded-lg" style={{ background: `var(--${c})` }} />
              <span className="text-xs text-muted-foreground">
                {c}
                <span className="block text-[11px] opacity-70">
                  {commodityRamps[i].name}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Tint ramps — sequential shades per commodity (100 → 900, 500 = base)
        </span>
        <div className="flex flex-col gap-2">
          {commodityRamps.map((c) => (
            <div
              key={c.key}
              className="grid grid-cols-[6.5rem_repeat(5,1fr)] items-center gap-2"
            >
              <span className="text-xs font-medium">{c.name}</span>
              {rampSteps.map((step) => (
                <div
                  key={step}
                  className="h-10 rounded-md"
                  style={{ background: `var(--chart-${c.key}-${step})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t pt-6">
        <span className="text-xs font-medium text-muted-foreground">
          In charts — the same ramps applied to live graphs
        </span>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium">
              Blue ramp — consumption index by commodity
            </span>
            <ChartContainer config={categoricalConfig} className="h-[240px] w-full">
              <LineChart accessibilityLayer data={categoricalData} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(categoricalConfig).map((key) => (
                  <Line
                    key={key}
                    dataKey={key}
                    type="monotone"
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium">
              Blue tint ramp — consumption by sub-metered site
            </span>
            <ChartContainer config={tintConfig} className="h-[240px] w-full">
              <BarChart accessibilityLayer data={tintData} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(tintConfig).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="site"
                    fill={`var(--color-${key})`}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
