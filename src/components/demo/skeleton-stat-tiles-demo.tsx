import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// A site dashboard's figures while they load. Each tile's label is fixed, so
// it renders; the figure and its change against yesterday wait as
// placeholders on the line boxes they will fill.
const tiles = ["Peak demand", "Energy today", "Cost to date", "Open alarms"]

export function SkeletonStatTilesDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
      <span className="sr-only">Loading site figures</span>
      {tiles.map((label) => (
        <Card key={label} size="sm">
          <CardContent className="flex flex-col gap-2">
            <span className="text-caption tracking-wide text-muted-foreground uppercase">{label}</span>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
