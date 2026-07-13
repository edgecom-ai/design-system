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
    <Select defaultValue="toronto">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a site" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ontario</SelectLabel>
          <SelectItem value="toronto">Toronto DC</SelectItem>
          <SelectItem value="ottawa">Ottawa Office</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Alberta</SelectLabel>
          <SelectItem value="calgary">Calgary Plant</SelectItem>
          <SelectItem value="edmonton" disabled>
            Edmonton (offline)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
