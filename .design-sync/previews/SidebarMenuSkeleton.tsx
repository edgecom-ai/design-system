// Sidebar navigation in its loading state — skeleton rows where menu items will land.
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function LoadingNavigation() {
  return (
    <SidebarProvider className="min-h-0 h-[360px] w-full overflow-hidden rounded-xl border border-border">
      <Sidebar collapsible="none" className="h-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarMenu>
              {Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-6 text-body-sm text-muted-foreground">Loading sites…</SidebarInset>
    </SidebarProvider>
  )
}
