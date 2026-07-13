import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export function EmptySearchDemo() {
  return (
    <Empty className="w-full max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No results for “substation-9”</EmptyTitle>
        <EmptyDescription>
          Try a different search term or clear the current filters to see all
          sensors.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Clear filters
        </Button>
      </EmptyContent>
    </Empty>
  )
}
