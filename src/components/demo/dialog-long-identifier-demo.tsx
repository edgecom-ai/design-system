"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LINK =
  "https://reports.example.com/shared/monthly/3f9a1c07d2b84e6fa5c0917be4d26a83"

export function DialogLongIdentifierDemo() {
  function copy() {
    void navigator.clipboard?.writeText(LINK)
    toast.success("Link copied")
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Share report</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share the monthly summary</DialogTitle>
          <DialogDescription>
            Anyone with this link can view the report until the end of next
            month. They can&apos;t edit it.
          </DialogDescription>
        </DialogHeader>
        {/* An identifier gets its own monospace line: it wraps where it has to
            instead of being cut off or pushing the dialog sideways. */}
        <p className="rounded-md bg-muted px-3 py-2 font-mono text-body-sm">
          {LINK}
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Done</Button>} />
          <Button onClick={copy}>Copy link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
