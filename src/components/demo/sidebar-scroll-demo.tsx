"use client"

import {
  Activity,
  Bell,
  CalendarClock,
  FileText,
  Gauge,
  LineChart,
  MapPin,
  Receipt,
  Settings,
  Upload,
  Users,
  Zap,
} from "lucide-react"

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
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const groups = [
  {
    label: "Monitoring",
    items: [
      { title: "Overview", icon: Gauge },
      { title: "Meters", icon: Activity },
      { title: "Sites", icon: MapPin },
      { title: "Demand", icon: Zap },
      { title: "Forecasts", icon: LineChart },
    ],
  },
  {
    label: "Records",
    items: [
      { title: "Reports", icon: FileText },
      { title: "Invoices", icon: Receipt },
      { title: "Schedules", icon: CalendarClock },
      { title: "Alarms", icon: Bell },
      { title: "Uploads", icon: Upload },
      { title: "Team", icon: Users },
    ],
  },
]

export function SidebarScrollDemo() {
  return (
    // A deliberately short frame: the menu is taller than the rail, so the
    // body scrolls — collapsed or expanded — while header and footer stay put.
    <SidebarProvider
      defaultOpen={false}
      className="relative h-[280px] min-h-0 w-full overflow-hidden rounded-xl border border-border [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full"
    >
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
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(({ title, icon: Icon }, i) => (
                    <SidebarMenuItem key={title}>
                      <SidebarMenuButton
                        tooltip={title}
                        isActive={group.label === "Monitoring" && i === 0}
                      >
                        <Icon />
                        <span>{title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
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
          Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Eleven destinations in a rail with room for five.
        </p>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          Scroll the rail to reach the rest. The header and
          <span className="font-medium text-foreground"> Settings </span>
          stay in place, and it scrolls the same way expanded.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
