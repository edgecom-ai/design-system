import { Button } from "@/components/ui/button"
import { Pencil, Plus, Trash2 } from "lucide-react"

export function ButtonIconButtonsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-sm" variant="outline" aria-label="Edit">
        <Pencil />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Delete">
        <Trash2 />
      </Button>
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  )
}
