"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const stats = [
  { label: "Consumption", value: "89.4 MWh" },
  { label: "Peak demand", value: "412 kW" },
  { label: "vs August", value: "+6.2%" },
]

export function HoverCardStatsDemo() {
  return (
    <p className="text-body-sm text-muted-foreground">
      Highest consumer this month:{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="link" size="sm" className="h-auto p-0">
              Plant 3, Riverside
            </Button>
          }
        />
        <HoverCardContent className="w-auto">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-medium">Plant 3, Riverside</p>
              <p className="text-caption text-muted-foreground">September to date</p>
            </div>
            <Badge variant="electricity">Electricity</Badge>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <dt className="text-caption whitespace-nowrap text-muted-foreground">{stat.label}</dt>
                <dd className="font-medium whitespace-nowrap tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </HoverCardContent>
      </HoverCard>
    </p>
  )
}
