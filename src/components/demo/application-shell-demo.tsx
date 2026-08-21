"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Gauge,
  Sparkles,
  FileText,
  BellRing,
  Settings,
  Search,
  Globe,
  Bell,
  Activity,
  Building2,
  ChevronRight,
  ChevronsUpDown,
  Moon,
  Sun,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
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
import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile"
import NotificationDropdown from "@/components/shadcn-studio/blocks/dropdown-notification"
import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language"

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "dataTrack™", icon: Gauge, active: true, sub: ["Energy", "Bill", "Production"] },
  { label: "pTrack®", icon: Activity },
  { label: "CoPilot", icon: Sparkles },
  { label: "Reports", icon: FileText },
  { label: "Alarms", icon: BellRing },
]

const stats = [
  { label: "Consumption", value: "1,284 MWh", delta: "+3.2% vs last month" },
  { label: "Peak demand", value: "4.12 MW", delta: "−1.1% vs forecast" },
  { label: "Cost to date", value: "$182,940", delta: "+5.7% vs budget" },
]

const buildings = [
  "Toronto Distribution Center",
  "Hamilton Manufacturing Plant",
  "Mississauga Cold Storage",
  "Ottawa Head Office",
]

/**
 * The full application shell — sidebar, top bar, and scrollable content, composed
 * from registry primitives and sized to fill its container. Self-contained (no
 * standalone route). The sidebar is the `sidebar` primitive with
 * `collapsible="icon"`, so the header toggle collapses it to a rail; a submenu
 * parent (dataTrack™) then opens its subpages in an off-rail hover flyout.
 *
 * Interactive bits: the rail toggle, a building/location switcher, a dark-mode
 * toggle (flips the real `.dark` class on <html>, as a consuming app would), and
 * the account menu docked in the sidebar footer. Language and notifications are
 * wired as placeholders for future support.
 */
export function ApplicationShellDemo() {
  const [dark, setDark] = React.useState(false)
  const [building, setBuilding] = React.useState(buildings[0])
  const [dtOpen, setDtOpen] = React.useState(true)

  // Mirror the current theme so the toggle icon stays right even if the theme
  // is changed elsewhere on the page.
  React.useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains("dark"))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  const toggleDark = () => document.documentElement.classList.toggle("dark")

  return (
    <SidebarProvider className="relative size-full min-h-0 overflow-hidden text-sm [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex h-8 items-center px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Logo className="h-6 w-auto group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map(({ label, icon: Icon, active, sub }) =>
                  sub ? (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuSubmenu
                        label={label}
                        open={dtOpen}
                        onOpenChange={setDtOpen}
                        trigger={
                          <SidebarMenuButton isActive={active}>
                            <Icon />
                            <span>{label}</span>
                            <ChevronRight
                              className={cn(
                                "ml-auto transition-transform",
                                dtOpen && "rotate-90"
                              )}
                            />
                          </SidebarMenuButton>
                        }
                      >
                        {sub.map((page, i) => (
                          <SidebarMenuSubItem key={page}>
                            <SidebarMenuSubButton isActive={i === 0}>
                              <span>{page}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSubmenu>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={active} tooltip={label}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* Footer: settings + the account menu, docked bottom-left */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ProfileDropdown
                align="start"
                trigger={
                  <SidebarMenuButton
                    tooltip="Priya Sharma"
                    className="h-auto py-1.5"
                  >
                    <Avatar size="sm" className="size-6">
                      <AvatarImage
                        src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                        alt="Priya Sharma"
                      />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-medium">
                        Priya Sharma
                      </span>
                      <span className="truncate text-[11px] text-sidebar-foreground/60">
                        priya.sharma@edgecom.ai
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-sidebar-foreground/60" />
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main column */}
      <SidebarInset className="min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger aria-label="Toggle navigation" />
          <InputGroup className="hidden max-w-xs sm:flex">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search sites, meters…" />
          </InputGroup>
          <div className="ml-auto flex items-center gap-1">
            {/* Building / location switcher — present on client-side screens */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="max-w-[200px] gap-2">
                    <Building2 className="size-4 shrink-0" />
                    <span className="truncate">{building}</span>
                    <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuRadioGroup
                  value={building}
                  onValueChange={(value) => setBuilding(value as string)}
                >
                  <DropdownMenuLabel>Switch building</DropdownMenuLabel>
                  {buildings.map((b) => (
                    <DropdownMenuRadioItem key={b} value={b}>
                      {b}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language & notifications — placeholders for future support */}
            <LanguageDropdown
              trigger={
                <Button variant="ghost" size="icon" aria-label="Language">
                  <Globe className="size-4" />
                </Button>
              }
            />
            <NotificationDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-1.5 top-1.5 block size-2 rounded-full bg-primary ring-2 ring-background" />
                </Button>
              }
            />

            {/* Dark-mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              aria-label="Toggle dark mode"
              aria-pressed={dark}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-muted/30 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Portfolio overview
            </h2>
            <p className="text-xs text-muted-foreground">
              {building} · 14 metered sites
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardHeader>
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <span className="text-xl font-semibold tracking-tight text-foreground">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.delta}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-3">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm">Demand — last 24 hours</CardTitle>
              <Badge variant="secondary">Live</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-end gap-1.5">
                {[38, 44, 41, 52, 60, 57, 68, 74, 71, 82, 88, 79, 66, 59, 63, 70, 77, 84, 90, 86, 72, 61, 55, 49].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/70"
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
