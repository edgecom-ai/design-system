'use client'

import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shadcn-studio/blocks/page-header/page-header'

const tabs = ['Overview', 'Consumption', 'Cost', 'Emissions']

// Breadcrumb + title + a tab row for switching views within the page.
const PageHeaderTabsDemo = () => {
  const [tab, setTab] = useState('Overview')

  return (
    <PageHeader
      breadcrumb={[
        { label: 'Sites', href: '#' },
        {
          label: 'Downtown Plant',
          menu: [
            { label: 'Downtown Plant', href: '#' },
            { label: 'North Warehouse', href: '#' },
            { label: 'Harbor Facility', href: '#' }
          ]
        }
      ]}
      title='Meter 12'
      titleMenu={[
        { label: 'Meter 12', href: '#' },
        { label: 'Meter 13', href: '#' },
        { label: 'Meter 14', href: '#' }
      ]}
      description='Electricity submeter · 3-phase · 400A'
    >
      <Tabs value={tab} onValueChange={setTab} className='max-w-full'>
        <TabsList className='max-w-full overflow-x-auto overflow-y-hidden'>
          {tabs.map(t => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </PageHeader>
  )
}

export default PageHeaderTabsDemo
