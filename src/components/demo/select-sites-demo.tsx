import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"

export function SelectSitesDemo() {
  return (
    <Select defaultValue="dc">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a site" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>East</SelectLabel>
          <SelectItem value="dc">Distribution Center</SelectItem>
          <SelectItem value="office">Regional Office</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>West</SelectLabel>
          <SelectItem value="plant-1">Plant 1</SelectItem>
          <SelectItem value="plant-3" disabled>
            Plant 3 (offline)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
