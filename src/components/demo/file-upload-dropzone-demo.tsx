"use client"

import * as React from "react"

import { FileDropZone } from "@/components/demo/file-drop-zone"

const ACCEPT = ".csv,text/csv"

// A small in-memory CSV so the "chosen" state renders without a real upload.
const sampleFile = () =>
  new File(["sku,name,price\nTB-001,Linen tote bag,24.00\n".repeat(900)], "summer-products.csv", {
    type: "text/csv",
  })

function State({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-caption text-muted-foreground">{caption}</span>
      {children}
    </div>
  )
}

export function FileUploadDropzoneDemo() {
  const [file, setFile] = React.useState<File>()
  const [chosen, setChosen] = React.useState<File | undefined>(sampleFile)

  return (
    <div className="@container w-full">
      <div className="grid gap-6 @3xl:grid-cols-3">
        <State caption="Empty — drop or choose a file">
          <FileDropZone
            accept={ACCEPT}
            title="Drop a CSV file here"
            description="One file at a time, up to 10 MB"
            file={file}
            onSelect={setFile}
            onClear={() => setFile(undefined)}
          />
        </State>
        <State caption="File chosen">
          <FileDropZone
            accept={ACCEPT}
            title="Drop a CSV file here"
            description="One file at a time, up to 10 MB"
            file={chosen}
            onSelect={setChosen}
            onClear={() => setChosen(undefined)}
          />
        </State>
        <State caption="Rejected — the caller's own message">
          <FileDropZone
            accept={ACCEPT}
            title="Drop a CSV file here"
            description="One file at a time, up to 10 MB"
            file={undefined}
            error="That file has no rows. A CSV needs a header row and at least one line of data."
            onSelect={() => {}}
            onClear={() => {}}
          />
        </State>
      </div>
    </div>
  )
}
