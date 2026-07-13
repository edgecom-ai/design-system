"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-52 w-full max-w-md rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="flex h-full flex-col gap-1 p-4">
          <span className="text-caption text-muted-foreground">Sites</span>
          <span className="text-sm font-medium">Substation A</span>
          <span className="text-sm text-muted-foreground">Substation B</span>
          <span className="text-sm text-muted-foreground">Substation C</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full flex-col gap-1 p-4">
          <span className="text-caption text-muted-foreground">
            Substation A · detail
          </span>
          <span className="text-2xl font-semibold tabular">1.24 MW</span>
          <span className="text-sm text-muted-foreground">
            Peak demand over the last 30 days.
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
