// Toggle preview — a two-state button. Variant × pressed swept statically,
// then sizes, text+icon, and disabled. The docs demo shows the toolbar use.
import { Toggle } from "@/components/ui/toggle"
import { BellIcon, BellOffIcon, Bold, Italic, PinIcon, Underline } from "lucide-react"

export { ToggleFormattingDemo as FormattingToolbar } from "@/components/demo/toggle-formatting-demo"

export function VariantsAndPressed() {
  return (
    <div className="flex flex-col gap-3 text-body-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="w-14" />
        <span className="w-8 text-center">Off</span>
        <span className="w-8 text-center">On</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-14">default</span>
        <Toggle aria-label="Pin site">
          <PinIcon />
        </Toggle>
        <Toggle aria-label="Pin site" defaultPressed>
          <PinIcon />
        </Toggle>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-14">outline</span>
        <Toggle variant="outline" aria-label="Pin site">
          <PinIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="Pin site" defaultPressed>
          <PinIcon />
        </Toggle>
      </div>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" size="sm" defaultPressed>
        <Bold />
        Small
      </Toggle>
      <Toggle variant="outline" size="default" defaultPressed>
        <Italic />
        Default
      </Toggle>
      <Toggle variant="outline" size="lg" defaultPressed>
        <Underline />
        Large
      </Toggle>
    </div>
  )
}

export function WithText() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" defaultPressed aria-label="Alarms on">
        <BellIcon />
        Alarms on
      </Toggle>
      <Toggle variant="outline" aria-label="Alarms muted">
        <BellOffIcon />
        Muted
      </Toggle>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" disabled aria-label="Pin site (disabled)">
        <PinIcon />
        Pin
      </Toggle>
      <Toggle variant="outline" disabled defaultPressed aria-label="Pinned (disabled)">
        <PinIcon />
        Pinned
      </Toggle>
    </div>
  )
}
