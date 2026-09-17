// Empty preview — the docs site's three zero-states (first-run, no results,
// inside a table frame) plus the plain-media variant composed here.
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CloudOffIcon, RefreshCwIcon } from "lucide-react"

export { EmptyDemo as FirstRun } from "@/components/demo/empty-demo"
export { EmptySearchDemo as NoResults } from "@/components/demo/empty-search-demo"
export { EmptyTableDemo as InTable } from "@/components/demo/empty-table-demo"

export function PlainMedia() {
  return (
    <Empty className="w-full max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <CloudOffIcon className="size-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Gateway unreachable</EmptyTitle>
        <EmptyDescription>
          The Halverson Cold Storage gateway has not checked in since 06:20. Readings will
          backfill once it reconnects.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <RefreshCwIcon />
            Retry now
          </Button>
          <Button size="sm" variant="ghost">
            View gateway
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
