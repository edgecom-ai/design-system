import {
  DollarSignIcon,
  ReceiptIcon,
  RotateCcwIcon,
  ShoppingBagIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

// One figure per tile, labelled above and iconed on the right. Only the
// figures a reader acts on carry a tone: the headline revenue takes the single
// brand highlight, and on-time delivery reads as success.
const tiles = [
  { label: "Revenue", value: "$48,210", Icon: DollarSignIcon, tone: "text-primary-emphasis" },
  { label: "Refunds", value: "$3,140", Icon: RotateCcwIcon },
  { label: "Orders", value: "1,284", Icon: ShoppingBagIcon },
  { label: "Average order", value: "$37.55", Icon: ReceiptIcon },
  { label: "Returning customers", value: "42", unit: "%", Icon: UsersIcon },
  { label: "Delivered on time", value: "96", unit: "%", Icon: TruckIcon, tone: "text-success-emphasis" },
]

export function StatMetricTilesDemo() {
  return (
    <div className="@container w-full">
      <div className="grid auto-rows-fr grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3">
        {tiles.map(({ label, value, unit, Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex min-h-22 flex-1 flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-caption tracking-wide text-muted-foreground uppercase">
                  {label}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
              </div>
              <p className="flex flex-wrap items-baseline gap-1 text-heading tabular-nums">
                <span className={tone}>{value}</span>
                {unit && <span className="text-caption text-muted-foreground">{unit}</span>}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
