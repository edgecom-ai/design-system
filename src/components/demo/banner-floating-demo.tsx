import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function BannerFloatingDemo() {
  return (
    // In a real layout this wrapper is your page and the banner uses
    // `fixed inset-x-0 bottom-0`. Scoped here to `relative`/`absolute` so it
    // floats within the preview instead of over the whole viewport.
    <div className="relative h-64 w-full overflow-hidden rounded-lg border border-dashed border-border">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
        <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-primary px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pr-3.5 sm:pl-4">
          <p className="text-sm leading-6 text-primary-foreground">
            <strong className="font-semibold">DR event starts in 30 min</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline size-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            Reduce load at HQ – Bay Street to earn savings
          </p>
          <Button size="sm" variant="secondary">
            View event
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
