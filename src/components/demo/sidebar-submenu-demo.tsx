"use client"

import * as React from "react"
import { Gauge, Activity, FileText, Bell, Settings, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubmenu,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const subPages = ["Energy", "Bill", "Production"]
const leaves = [
  { title: "pTrack®", icon: Activity },
  { title: "Reports", icon: FileText },
  { title: "Alarms", icon: Bell },
]

export function SidebarSubmenuDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider className="relative h-[420px] min-h-0 w-full overflow-hidden rounded-xl border border-border [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full">
      {/* collapsible="icon" collapses the rail to icons; hovering dataTrack™ then
          shows its subpages in an off-rail flyout instead of a tooltip. */}
      <Sidebar collapsible="icon" className="h-full">
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center px-1 group-data-[collapsible=icon]:hidden">
              <Logo className="h-6 w-auto" />
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Parent with subpages: inline collapsible when expanded,
                    off-rail hover flyout when collapsed. */}
                <SidebarMenuItem>
                  <SidebarMenuSubmenu
                    label="dataTrack™"
                    open={open}
                    onOpenChange={setOpen}
                    trigger={
                      <SidebarMenuButton isActive>
                        <Gauge />
                        <span>dataTrack™</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto transition-transform",
                            open && "rotate-90"
                          )}
                        />
                      </SidebarMenuButton>
                    }
                  >
                    {subPages.map((page, i) => (
                      <SidebarMenuSubItem key={page}>
                        <SidebarMenuSubButton isActive={i === 0}>
                          <span>{page}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSubmenu>
                </SidebarMenuItem>

                {/* Leaf items keep the icon tooltip when collapsed. */}
                {leaves.map(({ title, icon: Icon }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton tooltip={title}>
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Energy
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          dataTrack™ · Distribution Center
        </p>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          Toggle the rail with the header button. When collapsed, hover
          <span className="font-medium text-foreground"> dataTrack™ </span>
          to open its subpages in an off-rail flyout; leaf items show a tooltip.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
