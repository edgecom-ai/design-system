// Card preview — the docs site's alert card and tabbed card, plus the size
// sweep, a KPI stat grid and an alarm list composed here. (card-04/card-06
// skipped: remote hero images won't load in the capture, and card-06
// hardcodes a purple/pink gradient.)
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownRightIcon, ArrowUpRightIcon, MoreHorizontalIcon } from "lucide-react"

export { CardDemo as Default } from "@/components/demo/card-demo"
export { default as WithTabs } from "@/components/shadcn-studio/card/card-10"

export function Sizes() {
  return (
    <div className="flex w-full flex-wrap items-start gap-4">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Default size</CardTitle>
          <CardDescription>Standard padding for page-level cards.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Northridge Distribution Center · 12 meters · 1.24 MW peak this month.
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">Open site</Button>
        </CardFooter>
      </Card>
      <Card size="sm" className="w-72">
        <CardHeader>
          <CardTitle>Small size</CardTitle>
          <CardDescription>Tighter padding for dense grids and sidebars.</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Halverson Cold Storage · 4 meters · 318 kW peak this month.
        </CardContent>
        <CardFooter>
          <Button size="xs" variant="outline">Open site</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const stats = [
  { label: "Consumption", value: "12,480 kWh", delta: "-4.2%", good: true },
  { label: "Peak demand", value: "1,240 kW", delta: "+6.8%", good: false },
  { label: "Energy cost", value: "$18,920", delta: "-2.1%", good: true },
]

export function StatGrid() {
  return (
    <div className="grid w-full grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} size="sm">
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-heading tabular-nums">{s.value}</CardTitle>
            <CardAction>
              <Badge variant={s.good ? "success" : "warning"}>
                {s.good ? (
                  <ArrowDownRightIcon data-icon="inline-start" />
                ) : (
                  <ArrowUpRightIcon data-icon="inline-start" />
                )}
                {s.delta}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-muted-foreground">vs. previous 30 days</CardContent>
        </Card>
      ))}
    </div>
  )
}

const alarms: Array<{ title: string; variant: "destructive" | "warning" | "info"; label: string; time: string }> = [
  { title: "Peak demand exceeded", variant: "destructive", label: "Critical", time: "09:42" },
  { title: "Meter offline · MTR-4471-0092", variant: "warning", label: "Warning", time: "07:15" },
  { title: "Power factor below 0.9", variant: "info", label: "Notice", time: "Yesterday" },
]

export function WithHeaderAction() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Active alarms</CardTitle>
        <CardDescription>Pinecrest Bottling Plant · last 24 hours</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="ghost" aria-label="More">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alarms.map((a) => (
          <div key={a.title} className="flex items-center justify-between gap-3">
            <span>{a.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={a.variant}>{a.label}</Badge>
              <span className="text-caption text-muted-foreground tabular-nums">{a.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">View all alarms</Button>
      </CardFooter>
    </Card>
  )
}
