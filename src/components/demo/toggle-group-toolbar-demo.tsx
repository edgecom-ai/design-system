"use client"

import * as React from "react"
import {
  BoldIcon,
  CalendarIcon,
  DownloadIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// The two shapes a group takes. `connected` is the chart header's range
// presets: one strip, the same height as the toggle and the icon buttons
// beside it, and the default for an outline group. `spaced` is a formatting
// toolbar of ghost icon toggles, where the padded frame is what groups them.
export function ToggleGroupToolbarDemo() {
  const [compare, setCompare] = React.useState(false)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          connected — range presets beside a two-state toggle, all at <code>size=&quot;default&quot;</code>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle variant="outline" pressed={compare} onPressedChange={setCompare}>
            Previous week
          </Toggle>
          <ToggleGroup variant="outline" layout="connected" defaultValue={["today"]} aria-label="Range">
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="1d">1D</ToggleGroupItem>
            <ToggleGroupItem value="1w">1W</ToggleGroupItem>
            <ToggleGroupItem value="1m">1M</ToggleGroupItem>
          </ToggleGroup>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Pick a range" />}>
              <CalendarIcon />
            </TooltipTrigger>
            <TooltipContent>Pick a range</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Export" />}>
              <DownloadIcon />
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-caption text-muted-foreground">
          spaced — ghost icon toggles grouped by the frame
        </p>
        <ToggleGroup layout="spaced" multiple defaultValue={["bold"]} aria-label="Formatting">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
