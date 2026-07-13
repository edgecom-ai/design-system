import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup } from "@/components/ui/toggle-group"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"

export function ToggleFormattingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1">
        <Toggle variant="outline" defaultPressed aria-label="Bold">
          <Bold />
        </Toggle>
        <Toggle variant="outline" aria-label="Italic">
          <Italic />
        </Toggle>
        <Toggle variant="outline" aria-label="Underline">
          <Underline />
        </Toggle>
      </div>
      <ToggleGroup defaultValue={["left"]}>
        <Toggle value="left" aria-label="Align left">
          <AlignLeft />
        </Toggle>
        <Toggle value="center" aria-label="Align center">
          <AlignCenter />
        </Toggle>
        <Toggle value="right" aria-label="Align right">
          <AlignRight />
        </Toggle>
      </ToggleGroup>
    </div>
  )
}
