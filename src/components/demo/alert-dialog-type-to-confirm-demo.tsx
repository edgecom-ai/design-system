"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const SITE = "Manufacturing Plant"

export function AlertDialogTypeToConfirmDemo() {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  // The barrier for a high-impact action: the confirm stays disabled until the
  // resource has been named exactly, so it can't be cleared by reflex.
  const confirmed = typed.trim() === SITE

  function purge() {
    setOpen(false)
    setTyped("")
    toast.success("Site data purged", {
      description: `Eighteen months of readings for ${SITE} were deleted.`,
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setTyped("")
      }}
    >
      <AlertDialogTrigger
        render={<Button variant="destructive">Purge site data</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Purge all data for {SITE}?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes eighteen months of interval readings, every derived
            baseline, and the site&apos;s cost allocations. It can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="confirm-site">Type the site name to confirm</FieldLabel>
          <Input
            id="confirm-site"
            value={typed}
            placeholder={SITE}
            autoComplete="off"
            onChange={(event) => setTyped(event.target.value)}
          />
          <FieldDescription>Enter {SITE} exactly as shown.</FieldDescription>
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!confirmed}
            onClick={purge}
          >
            Purge data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
