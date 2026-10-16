import { DownloadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function Toolbar({ surface }: { surface: "default" | "page" }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        surface={surface}
        placeholder="Search meters"
        aria-label="Search meters"
        className="w-56"
      />
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

// A search field and an outline button straight on a muted panel — the
// shell's content area. `default` rests clear and has no face here; `page`
// takes the button's, so the row reads as one surface.
export function InputPageSurfaceDemo() {
  return (
    <TooltipProvider>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            default — the field rests clear, so the panel shows through
          </p>
          <Toolbar surface="default" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-caption text-muted-foreground">
            page — the field takes the outline button&apos;s face
          </p>
          <Toolbar surface="page" />
        </div>
      </div>
    </TooltipProvider>
  )
}
