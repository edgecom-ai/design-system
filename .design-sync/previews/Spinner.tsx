// Spinner preview — the docs demo, a size sweep, and the spinner in its
// natural homes: a loading button and an inline "refreshing" status line.
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export { SpinnerDemo as Default } from "@/components/demo/spinner-demo"

export function Sizes() {
  return (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  )
}

export function InButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Spinner />
        Saving tariff…
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        Exporting CSV
      </Button>
      <Button variant="ghost" size="icon" disabled aria-label="Refreshing">
        <Spinner />
      </Button>
    </div>
  )
}

export function InlineStatus() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Spinner className="size-3.5" />
        Fetching intervals for Northridge Distribution Center…
      </span>
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Spinner className="size-3.5 text-primary" />
        Recalculating peak demand (3 of 12 meters)
      </span>
    </div>
  )
}
