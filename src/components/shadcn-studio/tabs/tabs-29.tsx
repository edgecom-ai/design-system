import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    name: 'Gas',
    value: 'surprise',
    content: (
      <>
        Monitor <span className='text-foreground font-semibold'>gas</span> usage in GJ, spot anomalies and compare
        against your baseline period.
      </>
    )
  }
]

const AnimatedUnderlineTabsDemo = () => {
  return (
    <div className='w-full max-w-md'>
      <Tabs defaultValue='explore' className='gap-4'>
        <TabsList variant='line' className='bg-background w-full justify-start gap-4 border-b p-0'>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='flex-none px-1 pb-2.5 data-active:text-primary'
            >
              {tab.name}
            </TabsTrigger>
          ))}

          <TabsIndicator className='bg-primary' />
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className='text-muted-foreground text-sm'>{tab.content}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default AnimatedUnderlineTabsDemo
