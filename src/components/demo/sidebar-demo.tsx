"use client"

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
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"
import { Gauge, Activity, FileText, Bell, Settings } from "lucide-react"

const items = [
  { title: "dataTrack™", icon: Gauge, active: true },
  { title: "pTrack®", icon: Activity },
  { title: "Reports", icon: FileText },
  { title: "Alarms", icon: Bell },
]

export function SidebarDemo() {
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
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active}>
                      <item.icon />
                      <span>{item.title}</span>
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
          Portfolio overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Toronto Distribution Center · 14 metered sites
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
