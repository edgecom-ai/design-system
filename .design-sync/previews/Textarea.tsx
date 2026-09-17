// Textarea preview — multi-line text. Docs demos for the labelled, required,
// invalid and with-action stories; composed cells for filled and disabled.
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export { TextareaNoteDemo as WithLabel } from "@/components/demo/textarea-note-demo"
export { default as Required } from "@/components/shadcn-studio/textarea/textarea-07"
export { default as Invalid } from "@/components/shadcn-studio/textarea/textarea-05"
export { default as WithButton } from "@/components/shadcn-studio/textarea/textarea-16"

export function Filled() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="ta-filled">Site access notes</Label>
      <Textarea
        id="ta-filled"
        defaultValue="Main switchroom is behind the loading dock; badge in at the security desk and ask for Bianca Ngan. Meter MTR-0091-4471 is on the mezzanine."
      />
      <p className="text-body-sm text-muted-foreground">Visible to every technician assigned to Northridge Distribution Center.</p>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="ta-disabled">Utility remarks</Label>
      <Textarea
        id="ta-disabled"
        disabled
        defaultValue="Interval data unavailable 03–05 Aug due to meter replacement."
      />
    </div>
  )
}
