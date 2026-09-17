// Select preview — single-value pick from a short, known list. Rendered OPEN
// first so the card shows the listbox, not just a trigger.
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const sites = [
  { label: "Choose a site", value: null },
  { label: "Northridge Distribution Center", value: "ndc" },
  { label: "Harbor Point Regional Office", value: "hpo" },
  { label: "Westfield Plant 1", value: "wp1" },
  { label: "Westfield Plant 3 (offline)", value: "wp3" },
  { label: "Cedar Valley Cold Storage", value: "cvc" },
]

export function OpenGroupedSites() {
  return (
    <div className="w-72">
      <Label htmlFor="sel-open" className="mb-1.5 block">Site</Label>
      <Select items={sites} defaultValue="ndc" open>
        <SelectTrigger id="sel-open" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>East</SelectLabel>
            <SelectItem value="ndc">Northridge Distribution Center</SelectItem>
            <SelectItem value="hpo">Harbor Point Regional Office</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>West</SelectLabel>
            <SelectItem value="wp1">Westfield Plant 1</SelectItem>
            <SelectItem value="wp3" disabled>Westfield Plant 3 (offline)</SelectItem>
            <SelectItem value="cvc">Cedar Valley Cold Storage</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

// Closed grouped select. The docs demo (select-sites-demo) omits `items`, so
// Base UI renders the raw value ("dc") until the popup has opened once — a
// Works around a docs-site demo bug; here the items are supplied.
const siteItems = [
  { label: "Northridge Distribution Center", value: "dc" },
  { label: "Harbor Point Regional Office", value: "office" },
  { label: "Westfield Plant 1", value: "plant-1" },
  { label: "Cedar Valley Cold Storage", value: "cold-storage" },
]
export function GroupedClosed() {
  return (
    <Select items={siteItems} defaultValue="dc">
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>East</SelectLabel>
          <SelectItem value="dc">Northridge Distribution Center</SelectItem>
          <SelectItem value="office">Harbor Point Regional Office</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>West</SelectLabel>
          <SelectItem value="plant-1">Westfield Plant 1</SelectItem>
          <SelectItem value="cold-storage">Cedar Valley Cold Storage</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
export { SelectCommodityPlaceholderDemo as Placeholder } from "@/components/demo/select-commodity-placeholder-demo"

const commodities = [
  { label: "Electricity", value: "electricity" },
  { label: "Water", value: "water" },
  { label: "Gas", value: "gas" },
]

function Commodity({ size, disabled, invalid, id }: { size?: "sm" | "default"; disabled?: boolean; invalid?: boolean; id: string }) {
  return (
    <Select items={commodities} defaultValue="electricity" disabled={disabled}>
      <SelectTrigger id={id} size={size} className="w-48" aria-invalid={invalid || undefined}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {commodities.map((c) => (
          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="sel-default">Default</Label>
        <Commodity id="sel-default" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sel-sm">Small</Label>
        <Commodity id="sel-sm" size="sm" />
      </div>
    </div>
  )
}

export function DisabledAndInvalid() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="sel-disabled">Disabled</Label>
        <Commodity id="sel-disabled" disabled />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sel-invalid">Invalid</Label>
        <Commodity id="sel-invalid" invalid />
        <p className="text-body-sm text-destructive">Choose the commodity this meter records.</p>
      </div>
    </div>
  )
}
