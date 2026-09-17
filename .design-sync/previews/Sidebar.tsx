// Sidebar preview — the docs site's own compositions (each wraps its own
// SidebarProvider), plus a collapsed icon rail via a controlled provider.
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Activity, Bell, FileText, Gauge, Settings } from "lucide-react"

export { SidebarDemo as Default } from "@/components/demo/sidebar-demo"
export { SidebarSubmenuDemo as WithSubmenu } from "@/components/demo/sidebar-submenu-demo"

const items = [
  { title: "dataTrack™", icon: Gauge, active: true },
  { title: "pTrack®", icon: Activity },
  { title: "Reports", icon: FileText },
  { title: "Alarms", icon: Bell },
]

export function CollapsedIconRail() {
  return (
    <SidebarProvider
      open={false}
      className="relative h-[420px] min-h-0 w-full overflow-hidden rounded-xl border border-border [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full"
    >
      <Sidebar collapsible="icon" className="h-full">
        <SidebarHeader>
          <div className="flex items-center justify-center">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
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
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Portfolio overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rail collapsed to icons — labels move to tooltips.
        </p>
      </SidebarInset>
    </SidebarProvider>
  )
}
