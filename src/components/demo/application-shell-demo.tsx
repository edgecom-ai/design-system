"use client"

import * as React from "react"
import {
  Activity,
  Bell,
  BellRing,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ApplicationShell,
  type ApplicationShellNavItem,
} from "@/components/ui/application-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const nav: ApplicationShellNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  {
    id: "datatrack",
    label: "dataTrack™",
    icon: Gauge,
    items: [
      { id: "datatrack-energy", label: "Energy" },
      { id: "datatrack-bill", label: "Bill" },
      { id: "datatrack-production", label: "Production" },
    ],
  },
  { id: "ptrack", label: "pTrack®", icon: Activity },
  { id: "assistant", label: "Assistant", icon: Sparkles },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "alarms", label: "Alarms", icon: BellRing, badge: 3 },
]

const footerNav: ApplicationShellNavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
]

const buildings = [
  "Harbourline Cold Storage",
  "Kestrel Park Distribution Centre",
  "Northgate Foods Plant",
  "Meridian Tower",
]

const stats = [
  { label: "Consumption", value: "1,284 MWh", delta: "+3.2% vs last month" },
  { label: "Peak demand", value: "4.12 MW", delta: "−1.1% vs forecast" },
  { label: "Cost to date", value: "$182,940", delta: "+5.7% vs budget" },
]

/**
 * The portal shell as an app uses it: the `application-shell` primitive fed
 * with the portal's navigation, the signed-in user, the building list and the
 * app's own top-bar action (notifications), around a page of content.
 *
 * `className` lets the docs preview embed what is otherwise a full-viewport
 * frame — an app renders it bare.
 */
export function ApplicationShellDemo({ className }: { className?: string }) {
  const [active, setActive] = React.useState("datatrack-energy")
  const [building, setBuilding] = React.useState(buildings[0])

  return (
    <ApplicationShell
      nav={nav}
      footerNav={footerNav}
      activeItem={active}
      onNavigate={(item) => setActive(item.id)}
      user={{ name: "Priya Sharma", email: "priya.sharma@example.com" }}
      userMenu={
        <>
          <DropdownMenuItem>
            <UserRound />
            My account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </>
      }
      buildings={buildings}
      building={building}
      onBuildingChange={setBuilding}
      search
      actions={
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
                <Bell />
                <span className="absolute top-1 right-1 block size-2 rounded-full bg-primary ring-2 ring-background" />
              </Button>
            }
          />
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      }
      className={cn(
        // Embedded in the docs: fill the preview box instead of the viewport.
        "relative size-full min-h-0 overflow-hidden [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-heading">Portfolio overview</h1>
        <p className="text-body text-muted-foreground">{building} · 14 metered sites</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle>
                <span className="text-title tabular-nums">{s.value}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-caption text-muted-foreground">{s.delta}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-3">
        <CardHeader>
          <CardTitle>Demand — last 24 hours</CardTitle>
          <CardAction>
            <Badge variant="outline">Live</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-end gap-1.5" aria-hidden="true">
            {[38, 44, 41, 52, 60, 57, 68, 74, 71, 82, 88, 79, 66, 59, 63, 70, 77, 84, 90, 86, 72, 61, 55, 49].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-chart-electricity-500"
                  style={{ height: `${h}%` }}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>
    </ApplicationShell>
  )
}
