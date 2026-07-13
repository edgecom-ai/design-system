import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ButtonLoadingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Loader2 data-icon="inline-start" className="animate-spin" />
        Saving…
      </Button>
      <Button variant="outline" disabled>
        <Loader2 data-icon="inline-start" className="animate-spin" />
        Loading
      </Button>
    </div>
  )
}
