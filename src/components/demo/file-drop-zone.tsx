"use client"

// The drop zone shared by the file-upload blocks: a dashed target with a
// "Choose file" button while empty, a file row once something is picked, and
// an inline error underneath. A dropped file is checked against `accept` —
// the picker filters by it, but a drag bypasses the picker.

import * as React from "react"
import { CircleAlertIcon, FileTextIcon, UploadIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function isAccepted(accept: string, file: File) {
  return accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .some((entry) =>
      entry.startsWith(".") ? file.name.toLowerCase().endsWith(entry) : file.type.toLowerCase() === entry
    )
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot + 1).toUpperCase()
}

function FileDropZone({
  accept,
  title,
  description,
  file,
  error,
  onSelect,
  onClear,
  className,
}: {
  accept: string
  title: string
  description: string
  file: File | undefined
  /** The caller's own message — what counts as invalid is theirs to decide. */
  error?: string
  onSelect: (file: File) => void
  onClear: () => void
  className?: string
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [rejected, setRejected] = React.useState(false)
  const message = rejected ? "That file type isn't accepted here." : error

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    const dropped = event.dataTransfer.files.item(0)
    if (!dropped) return
    const usable = isAccepted(accept, dropped)
    setRejected(!usable)
    if (usable) onSelect(dropped)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {file === undefined ? (
        <div
          className={cn(
            "flex min-h-50 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
            dragging ? "border-primary bg-primary-subtle" : "border-input"
          )}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setDragging(false)
          }}
          onDrop={handleDrop}
        >
          <UploadIcon className="size-10 stroke-1 text-muted-foreground" aria-hidden />
          <span className="text-body-sm font-medium">{title}</span>
          <span className="text-body text-muted-foreground">{description}</span>
          <Button variant="outline" className="mt-1" onClick={() => input.current?.click()}>
            Choose file
          </Button>
          {/* The button is the keyboard stop; the input only opens the picker. */}
          <input
            ref={input}
            type="file"
            accept={accept}
            tabIndex={-1}
            aria-hidden
            className="sr-only"
            onChange={(event) => {
              const picked = event.target.files?.item(0)
              if (picked) {
                setRejected(false)
                onSelect(picked)
              }
              // Let the same file be picked again after it's removed.
              event.target.value = ""
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-card text-muted-foreground">
            <FileTextIcon className="size-4.5" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-body-sm font-medium">{file.name}</span>
            <span className="text-caption text-muted-foreground tabular-nums">
              {Math.max(1, Math.round(file.size / 1024)).toLocaleString("en-US")} KB — {extensionOf(file.name)}
            </span>
          </span>
          <Button
            variant="ghost-destructive"
            size="icon"
            className="ml-auto"
            aria-label="Remove file"
            onClick={() => {
              setRejected(false)
              onClear()
            }}
          >
            <XIcon />
          </Button>
        </div>
      )}
      {message && (
        <p role="alert" className="flex items-start gap-1.5 text-body text-destructive-emphasis">
          <CircleAlertIcon className="mt-1 size-3.5 shrink-0" aria-hidden />
          {message}
        </p>
      )}
    </div>
  )
}

export { FileDropZone }
