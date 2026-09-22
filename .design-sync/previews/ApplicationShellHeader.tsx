// ApplicationShellHeader preview — the top bar on its own: rail toggle, a page
// label, then the actions cluster. Over a SidebarProvider, which the rail
// toggle reads.
import {
  ApplicationShellActions,
  ApplicationShellBuildingSwitcher,
  ApplicationShellHeader,
  ApplicationShellSearch,
  ApplicationShellThemeToggle,
} from "@/components/ui/application-shell"
import { SidebarProvider } from "@/components/ui/sidebar"

const buildings = ["Harbourline Cold Storage", "Kestrel Park Distribution Centre", "Meridian Tower"]

export function WithBuildingSwitcher() {
  return (
    <SidebarProvider className="min-h-0 w-full rounded-xl border border-border">
      <ApplicationShellHeader className="w-full rounded-xl">
        <span className="text-body-sm text-muted-foreground">Portfolio overview</span>
        <ApplicationShellActions>
          <ApplicationShellBuildingSwitcher buildings={buildings} />
          <ApplicationShellThemeToggle />
        </ApplicationShellActions>
      </ApplicationShellHeader>
    </SidebarProvider>
  )
}

export function WithSearch() {
  return (
    <SidebarProvider className="min-h-0 w-full rounded-xl border border-border">
      <ApplicationShellHeader className="w-full rounded-xl">
        <ApplicationShellSearch className="flex" />
        <ApplicationShellActions>
          <ApplicationShellThemeToggle />
        </ApplicationShellActions>
      </ApplicationShellHeader>
    </SidebarProvider>
  )
}
