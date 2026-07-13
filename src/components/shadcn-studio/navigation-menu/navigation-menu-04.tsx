import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { BookOpenIcon, SparklesIcon, CodeIcon, ZapIcon, PaletteIcon, SettingsIcon } from "lucide-react"

const sections = [
  {
    title: 'Products',
    items: [
      {
        icon: (
          <BookOpenIcon
          />
        ),
        label: 'dataTrack',
        description: 'Consumption, cost, and emissions tracking',
        href: '#'
      },
      {
        icon: (
          <SparklesIcon
          />
        ),
        label: 'pTrack',
        description: 'Peak-demand and production monitoring',
        href: '#'
      }
    ]
  },
  {
    title: 'Operations',
    items: [
      {
        icon: (
          <CodeIcon
          />
        ),
        label: 'Reports',
        description: 'Generate and export M&V reports',
        href: '#'
      },
      {
        icon: (
          <ZapIcon
          />
        ),
        label: 'Demand Response',
        description: 'Schedule and track DR events',
        href: '#'
      }
    ]
  },
  {
    title: 'Configuration',
    items: [
      {
        icon: (
          <PaletteIcon
          />
        ),
        label: 'Utilities',
        description: 'Manage utility connections and tariffs',
        href: '#'
      },
      {
        icon: (
          <SettingsIcon
          />
        ),
        label: 'Settings',
        description: 'Thresholds, alarms, and preferences',
        href: '#'
      }
    ]
  }
]

const NavigationMenuExploreDemo = () => (
  <div className='flex items-center justify-center'>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='[&>svg]:size-4'>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className='w-80 p-2'>
              <div className='space-y-4'>
                {sections.map(section => (
                  <div key={section.title}>
                    <h4 className='mb-2 text-sm font-medium'>{section.title}</h4>
                    <div className='space-y-1'>
                      {section.items.map(item => (
                        <NavigationMenuLink
                          render={<Link href={item.href} />}
                          key={item.label}
                          className='flex items-start gap-2 *:[svg]:mt-1 *:[svg]:size-4'
                        >
                          {item.icon}
                          <div>
                            <p className='font-medium'>{item.label}</p>
                            <p className='text-muted-foreground'>{item.description}</p>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)

export default NavigationMenuExploreDemo
