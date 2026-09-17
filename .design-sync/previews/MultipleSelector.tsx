// MultipleSelector preview — chip-style multi-select with a searchable
// dropdown (cmdk). The dropdown only opens on input focus, so one cell
// autofocuses the input to show it.
// Named import from the package: the module has only a default export, which the
// forced bundle shim cannot map by file name.
import { MultipleSelector } from "edgecom-design-system"
import type { Option } from "@/components/ui/multi-select"
import { Label } from "@/components/ui/label"

const commodities: Option[] = [
  { value: "electricity", label: "Electricity" },
  { value: "water", label: "Water" },
  { value: "gas", label: "Gas" },
  { value: "steam", label: "Steam" },
  { value: "iaq", label: "IAQ", disable: true },
  { value: "temperature", label: "Temperature" },
  { value: "emissions", label: "Emissions" },
]

const meters: Option[] = [
  { value: "m-01", label: "Main incomer ST-M-01", group: "Northridge Distribution Center" },
  { value: "c-02", label: "Compressor ST-C-02", group: "Northridge Distribution Center" },
  { value: "ch-01", label: "Chiller ST-CH-01", group: "Harbor Point Regional Office" },
  { value: "l-01", label: "Lighting ST-L-01", group: "Harbor Point Regional Office" },
  { value: "b-01", label: "Boiler ST-B-01", group: "Westfield Plant 1" },
]

export function WithPlaceholder() {
  return (
    <div className="w-full max-w-sm">
      <MultipleSelector
        defaultOptions={[
          { label: "Electricity", value: "electricity" },
          { label: "Water", value: "water" },
          { label: "Gas", value: "gas" },
        ]}
        placeholder="Select commodities"
        emptyIndicator={<p className="text-body-sm text-muted-foreground">No commodity matches.</p>}
      />
    </div>
  )
}

export function ChipsSelected() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label>Commodities</Label>
      <MultipleSelector
        commandProps={{ label: "Select commodities" }}
        value={[commodities[0], commodities[1], { value: "site", label: "Site total", fixed: true }]}
        defaultOptions={commodities}
        placeholder="Select commodities"
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-body-sm">No results found</p>}
        className="w-full"
      />
      <p className="text-body-sm text-muted-foreground">Fixed chips (Site total) have no remove button.</p>
    </div>
  )
}

export function OpenDropdownGrouped() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label>Meters</Label>
      <MultipleSelector
        commandProps={{ label: "Select meters" }}
        value={[meters[0]]}
        defaultOptions={meters}
        groupBy="group"
        placeholder="Search meters"
        hidePlaceholderWhenSelected
        inputProps={{ autoFocus: true }}
        emptyIndicator={<p className="text-center text-body-sm">No meters found</p>}
        className="w-full"
      />
    </div>
  )
}

export function Disabled() {
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label>Commodities</Label>
      <MultipleSelector
        commandProps={{ label: "Select commodities" }}
        value={[commodities[0], commodities[2]]}
        defaultOptions={commodities}
        placeholder="Select commodities"
        disabled
        className="w-full"
      />
      <p className="text-body-sm text-muted-foreground">Inherited from the parent site — edit there.</p>
    </div>
  )
}
