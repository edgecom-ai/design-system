// ToggleGroup preview — exclusive and multi-select groups. Docs demos for
// the size sweep and the icon layout; composed cells for the padded (default
// spacing) shape, multi-select and disabled.
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export { default as Sizes } from "@/components/shadcn-studio/toggle-group/toggle-group-03"
export { default as ConnectedIcons } from "@/components/shadcn-studio/toggle-group/toggle-group-08"

export function PaddedRange() {
  return (
    <ToggleGroup defaultValue={["7d"]}>
      <ToggleGroupItem value="1d">Today</ToggleGroupItem>
      <ToggleGroupItem value="7d">7D</ToggleGroupItem>
      <ToggleGroupItem value="30d">30D</ToggleGroupItem>
      <ToggleGroupItem value="12m">12M</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function MultipleSelection() {
  return (
    <ToggleGroup variant="outline" spacing={0} multiple defaultValue={["electricity", "gas"]}>
      <ToggleGroupItem value="electricity">Electricity</ToggleGroupItem>
      <ToggleGroupItem value="gas">Gas</ToggleGroupItem>
      <ToggleGroupItem value="water">Water</ToggleGroupItem>
      <ToggleGroupItem value="steam">Steam</ToggleGroupItem>
    </ToggleGroup>
  )
}

export function Disabled() {
  return (
    <ToggleGroup variant="outline" spacing={0} defaultValue={["kwh"]} disabled>
      <ToggleGroupItem value="kwh">kWh</ToggleGroupItem>
      <ToggleGroupItem value="kw">kW</ToggleGroupItem>
      <ToggleGroupItem value="cost">Cost</ToggleGroupItem>
    </ToggleGroup>
  )
}
