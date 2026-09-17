// InputGroup preview — an input with inline/block addons (icons, units,
// buttons). Docs demos for the common shapes; composed cells for the
// textarea-with-footer, disabled and invalid states.
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { GaugeIcon, SendIcon } from "lucide-react"

export { InputGroupDemo as IconUnitAndButton } from "@/components/demo/input-group-demo"
export { default as Password } from "@/components/shadcn-studio/input/input-26"

export function TextareaWithFooter() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="ig-note">Alarm note</Label>
      <InputGroup>
        <InputGroupTextarea
          id="ig-note"
          placeholder="What was found on site?"
          defaultValue="Chiller 2 compressor tripped at 14:32; reset by Bianca Ngan, demand back under 640 kW."
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>142 / 500</InputGroupText>
          <InputGroupButton className="ml-auto" variant="default">
            <SendIcon />
            Post
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="ig-peak">Contracted peak</Label>
      <InputGroup>
        <InputGroupAddon>
          <GaugeIcon />
        </InputGroupAddon>
        <InputGroupInput id="ig-peak" defaultValue="850" disabled />
        <InputGroupAddon align="inline-end">
          <InputGroupText>kW</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export function Invalid() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="ig-threshold">Demand threshold</Label>
      <InputGroup>
        <InputGroupInput id="ig-threshold" defaultValue="-120" aria-invalid />
        <InputGroupAddon align="inline-end">
          <InputGroupText>kW</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <p className="text-body-sm text-destructive">Threshold must be greater than 0 kW.</p>
    </div>
  )
}
