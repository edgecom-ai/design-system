import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaNoteDemo() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="note">Note</Label>
      <Textarea id="note" placeholder="Add a note about this facility…" />
    </div>
  )
}
