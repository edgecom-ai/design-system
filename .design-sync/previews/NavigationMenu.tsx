// NavigationMenu preview — rendered with one item OPEN via defaultValue.
// Top-level product navigation with a flyout of links.
import { ActivityIcon, BellIcon, FileTextIcon, GaugeIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const monitor = [
  { icon: GaugeIcon, title: "Live demand", desc: "Every site's load against its contract limit." },
  { icon: ActivityIcon, title: "Interval data", desc: "15-minute kWh and kW by meter." },
  { icon: BellIcon, title: "Alarms", desc: "Thresholds, offline meters, power-factor drift." },
]

export function FlyoutOpen() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <NavigationMenu defaultValue="monitor">
        <NavigationMenuList>
          <NavigationMenuItem value="monitor">
            <NavigationMenuTrigger>Monitor</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 gap-1 p-1">
                {monitor.map((m) => (
                  <li key={m.title}>
                    <NavigationMenuLink href="#" className="items-start">
                      <m.icon className="mt-0.5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{m.title}</div>
                        <p className="text-caption text-muted-foreground">{m.desc}</p>
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="reports">
            <NavigationMenuTrigger>Reports</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-72 gap-1 p-1">
                <li><NavigationMenuLink href="#"><FileTextIcon /> Monthly bill reconciliation</NavigationMenuLink></li>
                <li><NavigationMenuLink href="#"><FileTextIcon /> Peak demand summary</NavigationMenuLink></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Tariffs</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Settings</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export function LinksOnlyClosed() {
  return (
    <div className="flex h-full items-start justify-center pt-6">
      <NavigationMenu>
        <NavigationMenuList>
          {["Overview", "Sites", "Meters", "Alarms", "Reports"].map((l, i) => (
            <NavigationMenuItem key={l}>
              <NavigationMenuLink href="#" active={i === 0} className={navigationMenuTriggerStyle()}>{l}</NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
