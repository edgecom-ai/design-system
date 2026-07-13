"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableVerticalDemo() {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-52 w-full max-w-md rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={45}>
        <div className="flex h-full flex-col gap-1 p-4">
          <span className="text-caption text-muted-foreground">Live load</span>
          <span className="text-2xl font-semibold tabular">982 kW</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55}>
        <div className="flex h-full flex-col gap-1 p-4">
          <span className="text-caption text-muted-foreground">Notes</span>
          <span className="text-sm text-muted-foreground">
            Drag the handle to resize the panels vertically.
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
