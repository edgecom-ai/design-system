// NativeSelect preview — the browser's own <select> in Edgecom clothing.
// Use it in dense forms and settings where a custom listbox is overkill.
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"

function SiteOptions() {
  return (
    <>
      <NativeSelectOption value="">Choose a site</NativeSelectOption>
      <NativeSelectOptGroup label="East">
        <NativeSelectOption value="ndc">Northridge Distribution Center</NativeSelectOption>
        <NativeSelectOption value="hpo">Harbor Point Regional Office</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="West">
        <NativeSelectOption value="wp1">Westfield Plant 1</NativeSelectOption>
        <NativeSelectOption value="wp3" disabled>Westfield Plant 3 (offline)</NativeSelectOption>
      </NativeSelectOptGroup>
    </>
  )
}

export function WithLabelAndGroups() {
  return (
    <div className="w-72 space-y-1.5">
      <Label htmlFor="ns-site">Site</Label>
      <NativeSelect id="ns-site" defaultValue="ndc" className="w-full">
        <SiteOptions />
      </NativeSelect>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="ns-default">Default</Label>
        <NativeSelect id="ns-default" defaultValue="15">
          <NativeSelectOption value="15">15-minute intervals</NativeSelectOption>
          <NativeSelectOption value="60">Hourly</NativeSelectOption>
          <NativeSelectOption value="1440">Daily</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ns-sm">Small</Label>
        <NativeSelect id="ns-sm" size="sm" defaultValue="60">
          <NativeSelectOption value="15">15-minute intervals</NativeSelectOption>
          <NativeSelectOption value="60">Hourly</NativeSelectOption>
          <NativeSelectOption value="1440">Daily</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  )
}

export function Placeholder() {
  return (
    <div className="w-72 space-y-1.5">
      <Label htmlFor="ns-placeholder">Tariff</Label>
      <NativeSelect id="ns-placeholder" defaultValue="" className="w-full">
        <NativeSelectOption value="" disabled>Select a tariff</NativeSelectOption>
        <NativeSelectOption value="tou">Time-of-use</NativeSelectOption>
        <NativeSelectOption value="flat">Flat rate</NativeSelectOption>
        <NativeSelectOption value="demand">Demand charge</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

export function DisabledAndInvalid() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="ns-disabled">Disabled</Label>
        <NativeSelect id="ns-disabled" disabled defaultValue="kwh">
          <NativeSelectOption value="kwh">kWh</NativeSelectOption>
          <NativeSelectOption value="kw">kW</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ns-invalid">Invalid</Label>
        <NativeSelect id="ns-invalid" aria-invalid defaultValue="">
          <NativeSelectOption value="">Choose a unit</NativeSelectOption>
          <NativeSelectOption value="kwh">kWh</NativeSelectOption>
          <NativeSelectOption value="kw">kW</NativeSelectOption>
        </NativeSelect>
        <p className="text-body-sm text-destructive">A unit is required.</p>
      </div>
    </div>
  )
}
