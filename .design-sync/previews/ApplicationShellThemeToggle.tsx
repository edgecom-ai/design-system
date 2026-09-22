// ApplicationShellThemeToggle preview — the toggle where it lives: the shell's
// top bar, beside the building switcher, over a SidebarProvider (the header's
// rail toggle reads it). Alone it is a 1.75rem icon button, too small to grade.
import {
  ApplicationShellActions,
  ApplicationShellBuildingSwitcher,
  ApplicationShellHeader,
  ApplicationShellThemeToggle,
} from "@/components/ui/application-shell"
import { SidebarProvider } from "@/components/ui/sidebar"

const buildings = ["Harbourline Cold Storage", "Kestrel Park Distribution Centre", "Meridian Tower"]

export function InTopBar() {
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
