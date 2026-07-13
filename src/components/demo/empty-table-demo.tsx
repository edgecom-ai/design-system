import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { InboxIcon, PlusIcon } from "lucide-react"

/**
 * Demonstrates the recommended pattern: a data component (here a table frame)
 * renders <Empty> as its zero-state, filling the slots with contextual copy.
 */
export function EmptyTableDemo() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/40 px-4 py-2 text-caption font-medium text-muted-foreground">
        <span>Sensor</span>
        <span>Site</span>
        <span className="text-right">Reading</span>
      </div>
      <Empty className="rounded-none border-0 md:p-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No readings in this range</EmptyTitle>
          <EmptyDescription>
            No sensor readings were recorded for the selected period. Import a
            file or widen the date range.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <PlusIcon />
            Import readings
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
