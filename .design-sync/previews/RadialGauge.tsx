// RadialGauge preview — the gauge at its card and tile sizes, toned
// by the status the figure is judged against.
import { RadialGauge } from "@/components/ui/radial-gauge"

export { RadialGaugeDemo as Sizes } from "@/components/demo/radial-gauge-demo"

export function Tones() {
  return (
    <div className="flex items-end gap-6">
      <RadialGauge value={91} label="of target" className="text-success-emphasis" aria-label="91% of target, on target" />
      <RadialGauge value={64} label="of target" className="text-warning-emphasis" aria-label="64% of target, below target" />
      <RadialGauge value={38} label="received" aria-label="38% received" />
    </div>
  )
}

export function Tiles() {
  return (
    <div className="flex items-center gap-4">
      <RadialGauge size="tile" value={91} className="text-success-emphasis" aria-label="91%" />
      <RadialGauge size="tile" value={64} className="text-warning-emphasis" aria-label="64%" />
      <RadialGauge size="tile" value={38} aria-label="38%" />
    </div>
  )
}
