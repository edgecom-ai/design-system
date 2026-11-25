"use client"

import { useState } from "react"
import { TriangleAlertIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const ENDPOINT =
  "https://hooks.example.com/ingest/v1/8d6ce95cb00066c3a41f7be2905d13c7e8f2"

export function AlertDialogLongIdentifierDemo() {
  const [open, setOpen] = useState(false)

  function remove() {
    setOpen(false)
    toast.success("Webhook removed", {
      description: "Alarm events are no longer delivered to that endpoint.",
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="outline">Remove webhook</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlertIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove this webhook?</AlertDialogTitle>
          <AlertDialogDescription>
            Alarm events stop being delivered immediately, and events raised
            while it is removed are not replayed.
            {/* An identifier gets its own monospace line: it wraps where it
                has to instead of dragging the sentence around it. */}
            <span className="mt-2 block font-mono text-body-sm text-foreground">
              {ENDPOINT}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep webhook</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={remove}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
