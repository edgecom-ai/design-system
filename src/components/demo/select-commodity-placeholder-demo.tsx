import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const commodities = [
  { label: "Electricity", value: "electricity" },
  { label: "Water", value: "water" },
  { label: "Gas", value: "gas" },
]

export function SelectCommodityPlaceholderDemo() {
  return (
    <Select items={commodities}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Please select a commodity" />
      </SelectTrigger>
      <SelectContent>
        {commodities.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
