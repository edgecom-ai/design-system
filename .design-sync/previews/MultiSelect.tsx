// MultiSelect (listbox) preview — trigger + popover listbox with checkboxes,
// count summary, swatches and readings. The popover has no `open` prop, so
// the open cells click the trigger after mount.
import * as React from "react"
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select-listbox"

export { MultiSelectDemo as StaticAndCountLabels } from "@/components/demo/multi-select-demo"

const devices: MultiSelectOption[] = [
  { id: "m-01", label: "Main incomer ST-M-01", meta: "1,117 kW", swatch: "var(--chart-water-500)" },
  { id: "c-02", label: "Compressor ST-C-02", meta: "508 kW", swatch: "var(--chart-electricity-500)" },
  { id: "pl-04", label: "Production line ST-PL-04", meta: "412 kW", swatch: "var(--chart-temperature-500)" },
  { id: "ch-01", label: "Chiller ST-CH-01", meta: "336 kW", swatch: "var(--chart-gas-500)" },
  { id: "b-01", label: "Boiler ST-B-01", meta: "184 kW", swatch: "var(--chart-emissions-500)" },
  { id: "l-01", label: "Lighting ST-L-01", meta: "112 kW", swatch: "var(--chart-water-700)" },
]

function OpenAfterMount({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("[data-slot=multi-select-trigger]")?.click()
  }, [])
  return <div ref={ref} className="min-h-80">{children}</div>
}

export function OpenListbox() {
  const [value, setValue] = React.useState<string[]>(["c-02", "ch-01"])
  return (
    <OpenAfterMount>
      <MultiSelect
        options={devices}
        value={value}
        onChange={setValue}
        placeholder="Select device data"
        itemNoun="devices"
        showCount
        align="start"
      />
    </OpenAfterMount>
  )
}

export function OpenMinimal() {
  const [value, setValue] = React.useState<string[]>(["m-01"])
  return (
    <OpenAfterMount>
      <MultiSelect
        options={devices.map(({ id, label }) => ({ id, label }))}
        value={value}
        onChange={setValue}
        placeholder="Select devices"
        itemNoun="devices"
        showSearch={false}
        showFooterActions={false}
        align="start"
      />
    </OpenAfterMount>
  )
}

export function CountStates() {
  const [none, setNone] = React.useState<string[]>([])
  const [some, setSome] = React.useState<string[]>(["m-01", "c-02"])
  const [all, setAll] = React.useState<string[]>(devices.map((d) => d.id))
  return (
    <div className="flex flex-wrap items-start gap-4">
      <MultiSelect options={devices} value={none} onChange={setNone} placeholder="Select devices" itemNoun="devices" showCount />
      <MultiSelect options={devices} value={some} onChange={setSome} placeholder="Select devices" itemNoun="devices" showCount />
      <MultiSelect options={devices} value={all} onChange={setAll} placeholder="Select devices" itemNoun="devices" showCount />
    </div>
  )
}

export function Disabled() {
  return (
    <MultiSelect options={devices} value={["m-01"]} onChange={() => {}} placeholder="Select devices" itemNoun="devices" showCount disabled />
  )
}
