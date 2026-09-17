// DropdownMenu preview — rendered OPEN under a real trigger. Actions on a
// row; checkbox/radio groups for view settings; a submenu held open.
import { ChevronDownIcon, DownloadIcon, PencilIcon, Trash2Icon, MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RowActions() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <DropdownMenu open>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>MTR-2041-0087</DropdownMenuLabel>
            <DropdownMenuItem><PencilIcon /> Edit meter<DropdownMenuShortcut>E</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem><DownloadIcon /> Export intervals</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Reassign site</DropdownMenuItem>
          <DropdownMenuItem variant="destructive"><Trash2Icon /> Remove meter</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ViewSettings() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <DropdownMenu open>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          View <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked>Peak demand</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Energy (kWh)</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Power factor</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Interval</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="15">
              <DropdownMenuRadioItem value="5">5 minutes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="15">15 minutes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="60">Hourly</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function WithSubmenu() {
  return (
    <div className="flex h-full items-start pt-6 pl-6">
      <DropdownMenu open>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Export <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-44">
          <DropdownMenuItem>Download CSV</DropdownMenuItem>
          <DropdownMenuItem>Download PDF report</DropdownMenuItem>
          <DropdownMenuSub open>
            <DropdownMenuSubTrigger>Schedule report</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Daily at 06:00</DropdownMenuItem>
              <DropdownMenuItem>Weekly on Monday</DropdownMenuItem>
              <DropdownMenuItem>Monthly on the 1st</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
