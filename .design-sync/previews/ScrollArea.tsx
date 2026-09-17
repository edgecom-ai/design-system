// ScrollArea preview — the docs site's vertical demo plus a horizontal strip.
import { ScrollArea } from "@/components/ui/scroll-area"

export { ScrollAreaDemo as Vertical } from "@/components/demo/scroll-area-demo"

const sites = [
  { name: "Northridge Distribution Center", kw: "1,480 kW" },
  { name: "Harbourview Cold Storage", kw: "612 kW" },
  { name: "Pinecrest Assembly Plant", kw: "944 kW" },
  { name: "Westgate Logistics Hub", kw: "738 kW" },
  { name: "Maple Ridge Head Office", kw: "210 kW" },
  { name: "Riverbend Manufacturing", kw: "1,102 kW" },
  { name: "Southgate Data Hall", kw: "1,860 kW" },
]

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="w-full max-w-md rounded-lg border border-border">
      <div className="flex w-max gap-3 p-3">
        {sites.map((s) => (
          <div key={s.name} className="flex w-44 shrink-0 flex-col gap-1 rounded-md bg-muted/50 p-3">
            <span className="truncate text-xs text-muted-foreground">{s.name}</span>
            <span className="text-lg font-semibold tabular">{s.kw}</span>
            <span className="text-xs text-muted-foreground">peak · last 30 days</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
