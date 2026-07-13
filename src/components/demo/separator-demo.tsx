import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="w-full sm:max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Toronto DC</h4>
        <p className="text-sm text-muted-foreground">Main Incomer · 1,284 kWh today</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Electricity</span>
        <Separator orientation="vertical" />
        <span>Water</span>
        <Separator orientation="vertical" />
        <span>Gas</span>
      </div>
    </div>
  )
}
