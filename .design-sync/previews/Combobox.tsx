// Combobox preview — searchable single/multi pick from a longer list.
// Rendered OPEN first so the card shows the popup, not just the input.
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

const grouped = [
  { value: "Commodities", items: ["Electricity", "Water", "Gas", "Steam"] },
  { value: "Sites", items: ["Northridge Distribution Center", "Harbor Point Regional Office", "Westfield Plant 1"] },
  { value: "Reports", items: ["Consumption", "Cost savings", "Emissions"] },
]

export function OpenGrouped() {
  return (
    <div className="w-80 space-y-1.5">
      <Label htmlFor="cb-open">Data source</Label>
      <Combobox id="cb-open" items={grouped} open defaultValue="Electricity">
        <ComboboxInput placeholder="Search sites, commodities, reports" className="w-full" />
        <ComboboxContent>
          <ComboboxEmpty>No data sources found.</ComboboxEmpty>
          <ComboboxList>
            {(group: { value: string; items: string[] }) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export { default as SingleClosed } from "@/components/shadcn-studio/combobox/combobox-01"
export { default as TriggerButtonWithAddAction } from "@/components/shadcn-studio/combobox/combobox-06"

const sites = [
  "Northridge Distribution Center",
  "Harbor Point Regional Office",
  "Westfield Plant 1",
  "Cedar Valley Cold Storage",
  "Ashgrove Data Hall",
  "Millbrook Pump Station",
]

export function MultipleChipsOpen() {
  const anchor = useComboboxAnchor()
  return (
    <div className="w-80 space-y-1.5">
      <Label htmlFor="cb-chips">Sites in report</Label>
      <Combobox multiple id="cb-chips" items={sites} defaultValue={[sites[0], sites[2]]} open>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((v) => (
                  <ComboboxChip key={v}>{v}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={values.length ? "" : "Add a site"} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No sites found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export function DisabledAndClearable() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-56 space-y-1.5">
        <Label htmlFor="cb-disabled">Disabled</Label>
        <Combobox id="cb-disabled" items={sites} defaultValue={sites[1]} disabled>
          <ComboboxInput disabled className="w-full" />
          <ComboboxContent>
            <ComboboxList>
              {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="w-56 space-y-1.5">
        <Label htmlFor="cb-clear">With clear button</Label>
        <Combobox id="cb-clear" items={sites} defaultValue={sites[3]}>
          <ComboboxInput showClear className="w-full" />
          <ComboboxContent>
            <ComboboxList>
              {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}
