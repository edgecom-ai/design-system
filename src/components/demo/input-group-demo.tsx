import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
} from "@/components/ui/input-group"
import { SearchIcon, ZapIcon } from "lucide-react"

export function InputGroupDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Leading icon */}
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search meters…" />
      </InputGroup>

      {/* Leading icon + trailing unit */}
      <InputGroup>
        <InputGroupAddon>
          <ZapIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="0" defaultValue="1,284" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>kWh</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      {/* Trailing action button */}
      <InputGroup>
        <InputGroupInput placeholder="Enter meter ID" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Apply</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
