// RadioGroup preview — one-of-many selection. Docs demos for the vertical,
// horizontal and card stories; a composed cell for the disabled item.
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export { default as Vertical } from "@/components/shadcn-studio/radio-group/radio-group-01"
export { default as Horizontal } from "@/components/shadcn-studio/radio-group/radio-group-02"
export { default as CardOptions } from "@/components/shadcn-studio/radio-group/radio-group-11"
export { default as CardOptionsVertical } from "@/components/shadcn-studio/radio-group/radio-group-13"

export function WithDisabledItem() {
  return (
    <RadioGroup defaultValue="15">
      <Label className="font-semibold">Interval resolution</Label>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="15" id="rg-15" />
        <Label htmlFor="rg-15">15 minutes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="60" id="rg-60" />
        <Label htmlFor="rg-60">Hourly</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="5" id="rg-5" disabled />
        <Label htmlFor="rg-5" className="text-muted-foreground">
          5 minutes — not supported by this meter
        </Label>
      </div>
    </RadioGroup>
  )
}
