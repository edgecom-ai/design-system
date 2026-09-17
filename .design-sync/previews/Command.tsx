// Command preview — a cmdk palette: search input over grouped, shortcut-
// annotated items. The inline palette is the primary card; the dialog
// variant renders OPEN.
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Activity, Bell, Building2, FileText, Gauge, Settings, Zap } from "lucide-react"

export { CommandDemo as InlinePalette } from "@/components/demo/command-demo"

export function DialogOpen() {
  return (
    <CommandDialog open title="Search" description="Jump to a site, meter or action">
      <CommandInput placeholder="Search sites, meters, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Sites">
          <CommandItem><Building2 /><span>Northridge Distribution Center</span></CommandItem>
          <CommandItem><Building2 /><span>Harbor Point Regional Office</span></CommandItem>
          <CommandItem><Building2 /><span>Westfield Plant 1</span></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem><Bell /><span>Create alarm</span><CommandShortcut>⌘A</CommandShortcut></CommandItem>
          <CommandItem><FileText /><span>New report</span><CommandShortcut>⌘R</CommandShortcut></CommandItem>
          <CommandItem><Settings /><span>Settings</span><CommandShortcut>⌘,</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export function EmptyResults() {
  return (
    <Command className="w-full max-w-sm rounded-lg border border-border" value="" filter={() => 0}>
      <CommandInput placeholder="Search sites, meters, actions…" value="chiller plant 9" />
      <CommandList>
        <CommandEmpty>No results for “chiller plant 9”.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem><Gauge /><span>Overview</span></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function DisabledItems() {
  return (
    <Command className="w-full max-w-sm rounded-lg border border-border">
      <CommandInput placeholder="Run an action…" />
      <CommandList>
        <CommandGroup heading="Demand response">
          <CommandItem><Zap /><span>Start curtailment event</span><CommandShortcut>⌘E</CommandShortcut></CommandItem>
          <CommandItem disabled><Activity /><span>End curtailment event</span></CommandItem>
          <CommandItem disabled><Bell /><span>Notify enrolled sites</span></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
