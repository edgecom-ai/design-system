// Slider preview — single, range and multi-thumb values plus a disabled
// state. Sliders take a value so the filled range is visible in the card.
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export { SliderBasicDemo as Basic } from "@/components/demo/slider-basic-demo"
export { default as RangeAndMultiThumb } from "@/components/shadcn-studio/slider/slider-02"
export { default as WithTicks } from "@/components/shadcn-studio/slider/slider-09"

export function WithValueLabel() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="sl-threshold">Demand alert threshold</Label>
        <span className="text-body-sm tabular-nums text-muted-foreground">640 kW</span>
      </div>
      <Slider id="sl-threshold" defaultValue={640} min={0} max={1000} step={10} />
      <div className="flex justify-between text-body-sm text-muted-foreground">
        <span>0 kW</span>
        <span>1,000 kW</span>
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <Label htmlFor="sl-locked">Contracted capacity (locked by tariff)</Label>
      <Slider id="sl-locked" defaultValue={850} max={1000} disabled />
    </div>
  )
}
