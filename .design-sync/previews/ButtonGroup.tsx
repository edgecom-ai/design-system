// ButtonGroup preview — orientation sweep, a text-prefixed input group, a
// split button, and the docs site's ghost nav demo.
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import {
  AlignJustifyIcon,
  ChevronDownIcon,
  LayoutGridIcon,
  MapIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

export { default as GhostNav } from "@/components/shadcn-studio/button-group/button-group-12"

export function Horizontal() {
  return (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
      <Button variant="outline">Year</Button>
    </ButtonGroup>
  )
}

export function Vertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}

export function WithText() {
  return (
    <ButtonGroup className="w-full max-w-sm">
      <ButtonGroupText>
        <SearchIcon />
      </ButtonGroupText>
      <Input placeholder="Search meters, sites, alarms…" />
      <Button variant="outline">Search</Button>
    </ButtonGroup>
  )
}

export function SplitAndIcons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonGroup>
        <Button>Export report</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More export options">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="List view">
          <AlignJustifyIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Grid view">
          <LayoutGridIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Map view">
          <MapIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}
