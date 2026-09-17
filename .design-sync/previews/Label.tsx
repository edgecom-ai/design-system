// Label preview — the form label paired with the controls it names.
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function WithInput() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="lbl-site">Site name</Label>
      <Input id="lbl-site" defaultValue="Northridge Distribution Center" />
    </div>
  )
}

export function Required() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="lbl-tariff">
        Tariff code <span className="text-destructive">*</span>
      </Label>
      <Input id="lbl-tariff" placeholder="e.g. TOU-8-B" required />
    </div>
  )
}

export function WithCheckbox() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="lbl-ack" defaultChecked />
      <Label htmlFor="lbl-ack">Acknowledge alarms automatically after 15 minutes</Label>
    </div>
  )
}

export function WithSwitch() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="lbl-dr" defaultChecked />
      <Label htmlFor="lbl-dr">Enrolled in demand response</Label>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="lbl-serial">Meter serial</Label>
      <Input id="lbl-serial" defaultValue="MTR-0091-4471" disabled className="peer" />
    </div>
  )
}
