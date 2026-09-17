// A part: only truthful inside its parent RadioGroup.
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
export { default as InsideRadioGroup } from "@/components/shadcn-studio/radio-group/radio-group-01"

export function DisabledItem() {
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
