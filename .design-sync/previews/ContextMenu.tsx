// ContextMenu preview — rendered OPEN over a right-clickable surface. The
// surface is a real trigger region so the menu has something to anchor to.
import { CopyIcon, PinIcon, Trash2Icon } from "lucide-react"

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

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 w-80 items-center justify-center rounded-lg border border-dashed border-border text-body-sm text-muted-foreground">
      {children}
    </div>
  )
}

export function ChartActions() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <ContextMenu open>
        <ContextMenuTrigger render={<Surface>Right-click the demand chart</Surface>} />
        <ContextMenuContent className="min-w-48">
          <ContextMenuGroup>
            <ContextMenuLabel>Demand · last 24 h</ContextMenuLabel>
            <ContextMenuItem><CopyIcon /> Copy as image<ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
            <ContextMenuItem><PinIcon /> Pin to dashboard</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub open>
            <ContextMenuSubTrigger>Compare with</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Yesterday</ContextMenuItem>
              <ContextMenuItem>Same day last week</ContextMenuItem>
              <ContextMenuItem>Contract limit</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive"><Trash2Icon /> Remove from view</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export function DisplayOptions() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <ContextMenu open>
        <ContextMenuTrigger render={<Surface>Right-click the site list</Surface>} />
        <ContextMenuContent className="min-w-48">
          <ContextMenuGroup>
            <ContextMenuLabel>Show</ContextMenuLabel>
            <ContextMenuCheckboxItem checked>Offline meters</ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Decommissioned sites</ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Sort by</ContextMenuLabel>
            <ContextMenuRadioGroup value="demand">
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="demand">Peak demand</ContextMenuRadioItem>
              <ContextMenuRadioItem value="alarms">Open alarms</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
