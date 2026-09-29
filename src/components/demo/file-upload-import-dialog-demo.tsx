"use client"

import * as React from "react"
import { UploadIcon } from "lucide-react"
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
import { FileDropZone } from "@/components/demo/file-drop-zone"

const MAX_BYTES = 10 * 1024 * 1024

// A short create action, so a dialog: the drop zone, the template on the
// left of the footer, and Cancel / Import on the right. Nothing is checked
// until Import is pressed, and a failure keeps the chosen file in place.
export function FileUploadImportDialogDemo() {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = React.useState<File>()
  const [tried, setTried] = React.useState(false)

  const error = !tried
    ? undefined
    : file === undefined
      ? "Choose a CSV file to import."
      : file.size > MAX_BYTES
        ? "That file is larger than 10 MB. Split it into smaller files and import each one."
        : undefined

  function reset() {
    setFile(undefined)
    setTried(false)
  }

  function submit() {
    setTried(true)
    if (file === undefined || file.size > MAX_BYTES) return
    toast.success("Import started", {
      description: `${file.name} is being added to your catalog.`,
    })
    setOpen(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <UploadIcon data-icon="inline-start" />
            Import products
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import products</DialogTitle>
          <DialogDescription>Upload a CSV with one product per row. Existing SKUs are updated.</DialogDescription>
        </DialogHeader>
        <FileDropZone
          accept=".csv,text/csv"
          title="Drag a file here"
          description="CSV — up to 10 MB"
          file={file}
          error={error}
          onSelect={setFile}
          onClear={() => setFile(undefined)}
        />
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={() =>
              toast.success("Template downloaded", { description: "product-import-template.csv" })
            }
          >
            Download template
          </Button>
          <span className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button onClick={submit}>Import</Button>
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
