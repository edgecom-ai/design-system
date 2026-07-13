'use client'

import { useState, type ComponentType } from 'react'
import {
  UserIcon,
  BellIcon,
  LanguagesIcon,
  ShieldCheckIcon,
  UsersIcon,
  ShieldIcon,
  BoxesIcon,
  RadioTowerIcon,
  Grid2x2Icon,
  DatabaseIcon,
  ReceiptIcon,
  type LucideProps
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import AccountSettings from '@/components/shadcn-studio/blocks/settings-shell/account-settings'
import SecuritySettings from '@/components/shadcn-studio/blocks/settings-shell/security-settings'

type NavItem = {
  id: string
  label: string
  icon: ComponentType<LucideProps>
  panel?: ComponentType
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const PlaceholderPanel = ({ title }: { title: string }) => (
  <div className='flex flex-col gap-6'>
    <div>
      <h2 className='text-xl font-semibold'>{title}</h2>
      <p className='text-muted-foreground text-sm'>Configure your {title.toLowerCase()} settings.</p>
    </div>
    <div className='border-border text-muted-foreground flex h-48 items-center justify-center rounded-xl border border-dashed text-sm'>
      {title} settings go here.
    </div>
  </div>
)

const groups: NavGroup[] = [
  {
    label: 'User Settings',
    items: [
      { id: 'personal', label: 'Personal Information', icon: UserIcon },
      { id: 'notifications', label: 'Notification Preferences', icon: BellIcon },
      { id: 'language', label: 'Language', icon: LanguagesIcon },
      { id: 'security', label: 'Security', icon: ShieldCheckIcon, panel: SecuritySettings }
    ]
  },
  {
    label: 'Organizational Settings',
    items: [
      { id: 'organization', label: 'Organization', icon: UsersIcon, panel: AccountSettings },
      { id: 'permissions', label: 'Permissions', icon: ShieldIcon },
      { id: 'products', label: 'Products', icon: BoxesIcon },
      { id: 'sensors', label: 'Sensors', icon: RadioTowerIcon },
      { id: 'grouping', label: 'Grouping', icon: Grid2x2Icon },
      { id: 'data-integrations', label: 'Data Integrations', icon: DatabaseIcon },
      { id: 'energy-rates', label: 'Energy Rates', icon: ReceiptIcon }
    ]
  }
]

const allItems = groups.flatMap(group => group.items)

const SettingsContent = () => {
  const [activeId, setActiveId] = useState('organization')

  const active = allItems.find(item => item.id === activeId) ?? allItems[0]
  const Panel = active.panel

  return (
    <div className='flex min-h-[40rem] w-full overflow-hidden rounded-xl border'>
      <Sidebar collapsible='none' className='h-auto self-stretch border-r'>
        <SidebarContent>
          {groups.map(group => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => {
                    const Icon = item.icon

                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton isActive={item.id === activeId} onClick={() => setActiveId(item.id)}>
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>

      <div className='bg-background min-w-0 flex-1 overflow-y-auto p-6 lg:p-8'>
        {Panel ? <Panel /> : <PlaceholderPanel title={active.label} />}
      </div>
    </div>
  )
}

export default SettingsContent
