"use client"

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Gauge, Activity, FileText, Building2, Bell, Settings } from "lucide-react"

export function CommandDemo() {
  return (
    <Command className="w-full max-w-sm rounded-lg border border-border">
      <CommandInput placeholder="Search sites, meters, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem>
            <Gauge />
            <span>dataTrack™ overview</span>
          </CommandItem>
          <CommandItem>
            <Activity />
            <span>pTrack® peaks</span>
          </CommandItem>
          <CommandItem>
            <FileText />
            <span>Reports</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            <Building2 />
            <span>Switch building</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Bell />
            <span>Create alarm</span>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
