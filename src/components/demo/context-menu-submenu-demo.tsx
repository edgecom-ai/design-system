"use client"

import { ArrowRightLeftIcon, BellOffIcon, ChartLineIcon, CopyIcon, GaugeIcon } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuSubmenuDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 text-card-foreground select-none">
          <span className="flex items-center gap-2 text-body-sm font-medium">
            <GaugeIcon className="size-4 text-muted-foreground" />
            Chiller 2
          </span>
          <span className="text-heading tabular-nums">184 kW</span>
          <span className="text-caption text-muted-foreground">MTR-2207 · Plant 3, Riverside</span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <ChartLineIcon />
              Open reading
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <ArrowRightLeftIcon />
                Compare with
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Chiller 1</ContextMenuItem>
                <ContextMenuItem>Chiller 3</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Site total</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <BellOffIcon />
                Mute alarms
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>For 1 hour</ContextMenuItem>
                <ContextMenuItem>Until tomorrow</ContextMenuItem>
                <ContextMenuItem>For a week</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <CopyIcon />
            Copy meter ID
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-caption text-muted-foreground">Right-click the tile, or long-press it on a touch screen.</p>
    </div>
  )
}
