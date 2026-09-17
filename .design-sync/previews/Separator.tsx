// Separator preview — the docs demo (horizontal + vertical in one block), a
// vertical toolbar divider between button clusters, and a labelled section
// break composed here.
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DownloadIcon, FilterIcon, RefreshCwIcon, SlidersHorizontalIcon } from "lucide-react"

export { SeparatorDemo as Default } from "@/components/demo/separator-demo"

export function VerticalInToolbar() {
  return (
    <div className="flex h-8 items-center gap-2">
      <Button variant="ghost" size="sm">
        <FilterIcon />
        Filter
      </Button>
      <Button variant="ghost" size="sm">
        <SlidersHorizontalIcon />
        Columns
      </Button>
      <Separator orientation="vertical" className="mx-1" />
      <Button variant="ghost" size="sm">
        <RefreshCwIcon />
        Refresh
      </Button>
      <Button variant="ghost" size="sm">
        <DownloadIcon />
        Export
      </Button>
    </div>
  )
}

export function LabelledSection() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">Main incomer</span>
        <span className="tabular-nums">1,284 kWh today</span>
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-caption text-muted-foreground">Submeters</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex items-center justify-between">
        <span>Chiller plant</span>
        <span className="tabular-nums text-muted-foreground">612 kWh</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span>Rooftop solar</span>
        <span className="tabular-nums text-muted-foreground">-218 kWh</span>
      </div>
    </div>
  )
}
