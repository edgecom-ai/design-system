"use client"

import * as React from "react"
import { Gauge, Activity, FileText, Bell, Settings, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"

const subPages = ["Energy", "Bill", "Production"]

export function SidebarSubmenuDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarProvider className="h-[420px] min-h-0 w-full overflow-hidden rounded-xl border border-border">
      <Sidebar collapsible="none" className="h-full">
        <SidebarHeader>
          <div className="flex items-center px-2 py-1">
            <Logo className="h-6 w-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* dataTrack expands into its subpages */}
                <SidebarMenuItem>
                  <Collapsible open={open} onOpenChange={setOpen}>
                    <CollapsibleTrigger
                      render={
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
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subPages.map((page, i) => (
                          <SidebarMenuSubItem key={page}>
                            <SidebarMenuSubButton isActive={i === 0}>
                              <span>{page}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Activity />
                    <span>pTrack®</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileText />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Bell />
                    <span>Alarms</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
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
          dataTrack™ · Toronto Distribution Center
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
