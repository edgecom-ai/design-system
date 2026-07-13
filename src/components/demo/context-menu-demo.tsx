"use client"

import * as React from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuDemo() {
  const [showGrid, setShowGrid] = React.useState(true)
  const [range, setRange] = React.useState("30d")

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground select-none">
        Right-click this panel
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuLabel>Meter panel</ContextMenuLabel>
          <ContextMenuItem>
            Open reading
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Export as</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>CSV</ContextMenuItem>
              <ContextMenuItem>XLSX</ContextMenuItem>
              <ContextMenuItem>PDF report</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={setShowGrid}
        >
          Show grid lines
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={range} onValueChange={setRange}>
          <ContextMenuLabel>Time range</ContextMenuLabel>
          <ContextMenuRadioItem value="24h">Last 24 hours</ContextMenuRadioItem>
          <ContextMenuRadioItem value="7d">Last 7 days</ContextMenuRadioItem>
          <ContextMenuRadioItem value="30d">Last 30 days</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
