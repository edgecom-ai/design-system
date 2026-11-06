import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadialGauge } from "@/components/ui/radial-gauge"

// The gauge at its two sizes. The ring takes a status tone only because the
// figure is judged against a target, and the badge beside it says the same
// in words; a neutral reading sets no colour at all.
const tiles = [
  { label: "Northgate Foods Plant", value: 91, tone: "text-success-emphasis" },
  { label: "Harbourline Cold Storage", value: 64, tone: "text-warning-emphasis" },
  { label: "Meridian Tower", value: 38, tone: "" },
]

export function RadialGaugeDemo() {
  return (
    <div className="@container w-full">
      <div className="grid gap-4 @2xl:grid-cols-[auto_1fr]">
        <Card className="w-full @2xl:w-72">
          <CardHeader>
            <CardTitle>Demand reduction</CardTitle>
            <CardDescription>Last curtailment event · 14:00–17:00</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <RadialGauge
              value={86}
              label="of target"
              className="text-warning-emphasis"
              aria-label="Demand reduction: 86% of target, below target"
            />
            <Badge variant="warning">Below target</Badge>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Data completeness</CardTitle>
            <CardDescription>Expected 15-minute readings received · last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {tiles.map((tile) => (
              <div key={tile.label} className="flex items-center gap-3">
                <RadialGauge
                  size="tile"
                  value={tile.value}
                  className={tile.tone}
                  aria-label={`${tile.label}: ${tile.value}% received`}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-body-sm font-medium">{tile.label}</span>
                  <span className="text-caption text-muted-foreground">{tile.value}% of readings received</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
