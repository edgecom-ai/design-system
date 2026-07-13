import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react"

export function ButtonIconsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Download data-icon="inline-start" />
        Export
      </Button>
      <Button variant="secondary">
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button variant="outline">
        <Plus data-icon="inline-start" />
        Add widget
      </Button>
      <Button variant="destructive">
        <Trash2 data-icon="inline-start" />
        Delete
      </Button>
    </div>
  )
}
