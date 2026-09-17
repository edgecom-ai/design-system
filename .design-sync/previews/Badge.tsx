// Badge preview — the docs site's semantic and commodity sweeps, plus the
// quiet variants and icon / dot compositions.
import { Badge } from "@/components/ui/badge"
import { BellRingIcon, MapPinIcon, WifiOffIcon, XIcon } from "lucide-react"

export { BadgeVariantsDemo as Variants } from "@/components/demo/badge-variants"
export { BadgeCommoditiesDemo as Commodities } from "@/components/demo/badge-commodities"

export function Quiet() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  )
}

export function WithStatusDot() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        Online
      </Badge>
      <Badge variant="warning">
        <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
        DR Active
      </Badge>
      <Badge variant="destructive">
        <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
        Offline
      </Badge>
    </div>
  )
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <MapPinIcon data-icon="inline-start" />
        Northridge DC
      </Badge>
      <Badge variant="info">
        <BellRingIcon data-icon="inline-start" />
        3 alarms
      </Badge>
      <Badge variant="destructive">
        <WifiOffIcon data-icon="inline-start" />
        No signal
      </Badge>
      <Badge variant="outline">
        Tariff: TOU-8
        <XIcon data-icon="inline-end" />
      </Badge>
    </div>
  )
}
