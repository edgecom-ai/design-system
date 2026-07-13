import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { PaletteIcon, TypeIcon, BoxIcon, PaintbrushIcon, CodeIcon, EyeIcon } from "lucide-react"

const features = [
  {
    icon: (
      <PaletteIcon
      />
    ),
    label: 'Consumption',
    description: 'Track kWh, GJ, and m³ usage across every site and meter',
    badge: { label: 'New', variant: 'default' as const },
    href: '#'
  },
  {
    icon: (
      <TypeIcon
      />
    ),
    label: 'Peak Demand',
    description: 'Monitor kW peaks and get alerts before demand thresholds',
    badge: { label: 'Beta', variant: 'secondary' as const },
    href: '#'
  },
  {
    icon: (
      <BoxIcon
      />
    ),
    label: 'Emissions',
    description: 'Report GHG emissions in tCO₂e toward your net-zero targets',
    badge: { label: 'Pro', variant: 'outline' as const },
    href: '#'
  },
  {
    icon: (
      <PaintbrushIcon
      />
    ),
    label: 'Demand Response',
    description: 'Schedule DR events and track curtailment in real time',
    badge: { label: 'Preview', variant: 'outline' as const },
    href: '#'
  },
  {
    icon: (
      <CodeIcon
      />
    ),
    label: 'Reports',
    description: 'Generate and export M&V and cost-savings reports',
    badge: { label: 'New', variant: 'default' as const },
    href: '#'
  },
  {
    icon: (
      <EyeIcon
      />
    ),
    label: 'Alarms',
    description: 'Set thresholds and catch anomalies before they escalate',
    badge: { label: 'Beta', variant: 'secondary' as const },
    href: '#'
  }
]

const NavigationMenuFeatureDemo = () => (
  <div className='flex items-center justify-center'>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='[&>svg]:size-4'>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-100 space-y-1 p-1'>
              {features.map(feature => (
                <NavigationMenuLink
                  render={<Link href={feature.href} />}
                  key={feature.label}
                  className='flex items-start gap-2 *:[svg]:mt-1 *:[svg]:size-5'
                >
                  {feature.icon}
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>{feature.label}</span>
                      <Badge variant={feature.badge.variant}>{feature.badge.label}</Badge>
                    </div>
                    <span className='text-muted-foreground'>{feature.description}</span>
                  </div>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)

export default NavigationMenuFeatureDemo
