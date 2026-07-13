import { Spinner } from "@/components/ui/spinner"

export function SpinnerDemo() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-6 text-primary" />
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-3.5" /> Loading data…
      </span>
    </div>
  )
}
