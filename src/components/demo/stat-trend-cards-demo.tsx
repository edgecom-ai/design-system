"use client"

import { Bar, BarChart, ReferenceLine, XAxis } from "recharts"
import {
  MinusIcon,
  PackageIcon,
  StoreIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WarehouseIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BAR_CATEGORY_GAP,
  REFERENCE_DASH,
  REFERENCE_STROKE,
  average,
  formatNumber,
} from "@/components/demo/chart-controls"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

// Sales channels tag no commodity, so every card's bars take the
// miscellaneous ramp and the icon chip stays neutral.
const channels = [
  { key: "online", label: "Online store", Icon: StoreIcon, values: [812, 776, 843, 901, 968, 1_034] },
  { key: "marketplace", label: "Marketplace", Icon: PackageIcon, values: [402, 431, 418, 390, 377, 369] },
  { key: "wholesale", label: "Wholesale", Icon: WarehouseIcon, values: [64, 58, 71, 69, 83, 92] },
] as const

const chartConfig = {
  value: { label: "Orders", color: "var(--chart-misc-500)" },
} satisfies ChartConfig

// A trend is information, not a verdict — the badge stays `info` whichever
// way it points.
function TrendBadge({ percent }: { percent: number }) {
  const Icon = percent > 0 ? TrendingUpIcon : percent < 0 ? TrendingDownIcon : MinusIcon
  return (
    <Badge variant="info" className="gap-1 tabular-nums">
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{percent > 0 ? "Up" : percent < 0 ? "Down" : "Flat"}</span>
      {Math.abs(percent).toFixed(1)}%
    </Badge>
  )
}

export function StatTrendCardsDemo() {
  return (
    <div className="@container w-full">
      <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        {channels.map(({ key, label, Icon, values }) => {
          const latest = values.at(-1) ?? 0
          const previous = values.at(-2) ?? latest
          const mean = average([...values])
          const data = values.map((value, index) => ({ month: months[index], value }))

          return (
            <Card key={key}>
              <CardHeader className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-body-sm font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {label}
                </span>
                <TrendBadge percent={((latest - previous) / previous) * 100} />
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="flex items-baseline gap-1 text-heading tabular-nums">
                  {formatNumber(latest)}
                  <span className="text-body text-muted-foreground">orders</span>
                </p>
                <ChartContainer config={chartConfig} className="aspect-auto h-32 w-full">
                  <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
                    barCategoryGap={BAR_CATEGORY_GAP.few}
                  >
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={6} />
                    <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive={false} />
                    <ReferenceLine y={mean} stroke={REFERENCE_STROKE} strokeDasharray={REFERENCE_DASH.average} />
                  </BarChart>
                </ChartContainer>
                <div className="flex items-center justify-between gap-2 text-caption text-muted-foreground">
                  <span>Jan – Jun</span>
                  <span className="tabular-nums">6-mo avg {formatNumber(mean)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
