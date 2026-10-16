import { RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const commodities = [
  { label: "All commodities", value: "all" },
  { label: "Electricity", value: "electricity" },
  { label: "Water", value: "water" },
  { label: "Gas", value: "gas" },
]

function Toolbar({ surface }: { surface: "default" | "page" }) {
  return (
    <div className="flex items-center gap-2">
      <Select items={commodities} defaultValue="all">
        <SelectTrigger surface={surface} aria-label="Commodity" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {commodities.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon" aria-label="Reset filters" />}
        >
          <RotateCcwIcon />
        </TooltipTrigger>
        <TooltipContent>Reset filters</TooltipContent>
      </Tooltip>
    </div>
  )
}

// A filter select and an outline button straight on a muted panel — the
// shell's content area. `default` rests clear and has no face here; `page`
// rests and hovers like the button, so the row reads as one surface.
export function SelectPageSurfaceDemo() {
  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            default — the trigger rests clear, so the panel shows through
          </p>
          <Toolbar surface="default" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            page — the trigger rests and hovers like the outline button
          </p>
          <Toolbar surface="page" />
        </div>
      </div>
    </TooltipProvider>
  )
}
