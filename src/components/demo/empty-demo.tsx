import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { GaugeIcon, PlusIcon } from "lucide-react"

export function EmptyDemo() {
  return (
    <Empty className="w-full max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GaugeIcon />
        </EmptyMedia>
        <EmptyTitle>No sensors yet</EmptyTitle>
        <EmptyDescription>
          Connect your first sensor to start tracking consumption, cost, and
          emissions across your sites.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Add sensor
        </Button>
      </EmptyContent>
    </Empty>
  )
}
