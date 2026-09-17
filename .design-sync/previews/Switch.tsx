// Switch preview — on/off toggles. The docs demo sweeps checked/unchecked/
// disabled; the size axis, the card and the list-group shapes follow.
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export { SwitchBasicDemo as States } from "@/components/demo/switch-basic-demo"

export function Sizes() {
  return (
    <div className="flex items-center gap-6">
      <Label className="gap-2">
        <Switch defaultChecked />
        Default
      </Label>
      <Label className="gap-2">
        <Switch size="sm" defaultChecked />
        Small
      </Label>
    </div>
  )
}

export function WithDescription() {
  return (
    <div className="flex w-full max-w-sm items-start justify-between gap-4">
      <div className="grid gap-1">
        <Label htmlFor="sw-dr">Demand-response enrolment</Label>
        <p className="text-body-sm text-muted-foreground">
          Let the aggregator curtail non-critical load at Northridge Distribution Center during events.
        </p>
      </div>
      <Switch id="sw-dr" defaultChecked />
    </div>
  )
}

export { default as Card } from "@/components/shadcn-studio/switch/switch-16"
export { default as ListGroup } from "@/components/shadcn-studio/switch/switch-18"
