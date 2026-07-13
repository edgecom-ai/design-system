import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from '@/components/ui/motion-tabs'

const tabs = [
  {
    name: 'Overview',
    value: 'explore',
    content: (
      <>
        Your <span className='text-foreground font-semibold'>site summary</span> across all commodities, including
        consumption, cost and emissions trends at a glance.
      </>
    )
  },
  {
    name: 'Electricity',
    value: 'favorites',
    content: (
      <>
        Track <span className='text-foreground font-semibold'>electricity</span> consumption, peak demand and power
        factor down to the interval level for each meter.
      </>
    )
  },
  {
    name: 'Water',
    value: 'surprise',
    content: (
      <>
        Monitor <span className='text-foreground font-semibold'>water</span> usage in m³, spot anomalies and compare
        against your baseline period.
      </>
    )
  }
]

const AnimatedTabsDemo = () => {
  return (
    <div className='w-full max-w-md'>
      <Tabs defaultValue='explore' className='gap-4'>
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContents className='bg-background mx-1 -mt-2 mb-1 h-full rounded-sm'>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <p className='text-muted-foreground text-sm'>{tab.content}</p>
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>
    </div>
  )
}

export default AnimatedTabsDemo
