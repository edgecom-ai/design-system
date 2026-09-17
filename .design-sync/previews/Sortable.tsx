// Sortable preview — static render of reorderable lists (drag is skipped).
import { useState } from "react"
import { GripVerticalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Sortable, SortableItem, SortableItemHandle } from "@/components/ui/sortable"

export { default as CardList } from "@/components/shadcn-studio/sortable/sortable-01"
export { default as NotificationChannels } from "@/components/shadcn-studio/sortable/sortable-04"
export { default as Groups } from "@/components/shadcn-studio/sortable/sortable-03"

type Priority = { id: string; site: string; kw: string; rank: "P1" | "P2" | "P3" }

const defaultPriorities: Priority[] = [
  { id: "northridge", site: "Northridge Distribution Center", kw: "1,240 kW", rank: "P1" },
  { id: "eastfield", site: "Eastfield Cold Storage", kw: "860 kW", rank: "P1" },
  { id: "harbor", site: "Harbor Point Offices", kw: "310 kW", rank: "P2" },
  { id: "willow", site: "Willow Creek Plant", kw: "95 kW", rank: "P3" },
]

export function CurtailmentOrder() {
  const [items, setItems] = useState(defaultPriorities)
  return (
    <div className="w-full max-w-md">
      <p className="mb-3 text-body-sm text-muted-foreground">Sites are shed in this order during a demand-response event.</p>
      <Sortable value={items} onValueChange={setItems} getItemValue={(i) => i.id} strategy="vertical" className="flex flex-col gap-2">
        {items.map((item, index) => (
          <SortableItem key={item.id} value={item.id} disabled={item.rank === "P3"}>
            <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
              <SortableItemHandle className="text-muted-foreground">
                <GripVerticalIcon className="size-4" />
              </SortableItemHandle>
              <span className="w-5 text-body-sm tabular-nums text-muted-foreground">{index + 1}</span>
              <span className="flex-1 truncate text-body-sm font-medium">{item.site}</span>
              <span className="text-body-sm tabular-nums text-muted-foreground">{item.kw}</span>
              <Badge variant={item.rank === "P1" ? "destructive" : item.rank === "P2" ? "warning" : "outline"}>{item.rank}</Badge>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  )
}
