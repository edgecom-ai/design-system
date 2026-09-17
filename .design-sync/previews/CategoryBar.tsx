// CategoryBar preview — a stacked proportion bar with an optional marker.
import { CategoryBar } from "@/components/ui/category-bar"

export { CategoryBarDemo as WithMarker } from "@/components/demo/category-bar-demo"

export function LoadBreakdown() {
  return (
    <div className="flex w-full max-w-md flex-col gap-1">
      <span className="text-body-sm font-medium">Northridge Distribution Center — load by end use (kW)</span>
      <CategoryBar
        className="w-full"
        values={[320, 180, 140, 60]}
        colors={["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"]}
        marker={{ value: 550 }}
      />
    </div>
  )
}

export function WithoutLabels() {
  return (
    <CategoryBar
      className="w-full max-w-md"
      values={[55, 30, 15]}
      colors={["bg-success", "bg-warning", "bg-destructive"]}
      showLabels={false}
    />
  )
}

export function SingleColourFallback() {
  return (
    <CategoryBar
      className="w-full max-w-md"
      values={[40, 35, 25]}
      colors={["bg-primary"]}
    />
  )
}
