import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SwitchBasicDemo() {
  return (
    <div className="flex items-center gap-6">
      <Label className="gap-2">
        <Switch defaultChecked />
        Email alerts
      </Label>
      <Label className="gap-2">
        <Switch />
        SMS alerts
      </Label>
      <Label className="gap-2 opacity-50">
        <Switch disabled />
        Push (disabled)
      </Label>
    </div>
  )
}
