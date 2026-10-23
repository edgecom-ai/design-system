import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function Toolbar({ surface }: { surface: "default" | "page" }) {
  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        variant="outline"
        spacing={0}
        surface={surface}
        defaultValue={["hourly"]}
        aria-label="Interval"
      >
        <ToggleGroupItem value="15min">15 min</ToggleGroupItem>
        <ToggleGroupItem value="hourly">Hourly</ToggleGroupItem>
        <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
      </ToggleGroup>
      <Toggle variant="outline" surface={surface} aria-label="Compare to last period">
        Compare
      </Toggle>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon" aria-label="Export CSV" />}
        >
          <DownloadIcon />
        </TooltipTrigger>
        <TooltipContent>Export CSV</TooltipContent>
      </Tooltip>
    </div>
  )
}

// An interval toggle group, an outline toggle and an outline button straight
// on a muted panel — the shell's content area. `default` rests clear and has
// no face here; `page` takes the button's, so the row reads as one surface.
export function TogglePageSurfaceDemo() {
  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            default — the toggles rest clear, so the panel shows through
          </p>
          <Toolbar surface="default" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            page — the toggles rest and hover like the outline button
          </p>
          <Toolbar surface="page" />
        </div>
      </div>
    </TooltipProvider>
  )
}
