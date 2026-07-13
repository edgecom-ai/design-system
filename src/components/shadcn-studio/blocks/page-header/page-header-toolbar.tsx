'use client'

import { useState } from 'react'

import { CalendarIcon, ChevronDownIcon, DownloadIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shadcn-studio/blocks/page-header/page-header'

const tabs = ['Overview', 'Consumption', 'Cost', 'Emissions']

// The full pattern: breadcrumb + title + tabs + a right-aligned toolbar.
const PageHeaderToolbarDemo = () => {
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
      meta='Updated 2m ago'
      actions={
        <>
          <Button variant='outline' size='sm'>
            <CalendarIcon className='size-4' />
            June 1 – Today
            <ChevronDownIcon className='text-muted-foreground size-4' />
          </Button>
          <Button variant='outline' size='sm'>
            <DownloadIcon className='size-4' />
            Export
          </Button>
          <Button size='sm'>
            <PlusIcon className='size-4' />
            Connect Gateway
          </Button>
        </>
      }
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

export default PageHeaderToolbarDemo
