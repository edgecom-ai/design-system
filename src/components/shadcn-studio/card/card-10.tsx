import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabs = [
  {
    name: 'Overview',
    value: 'overview',
    content:
      'Site-wide totals at a glance: 12,480 kWh consumed this month, a 480 kW peak demand, and 3.2 tCO₂e in emissions across all commodities.'
  },
  {
    name: 'Electricity',
    value: 'electricity',
    content:
      'Electricity load is tracking 4% below baseline. Main Building draws the most, with a 480 kW peak recorded on Jun 18 at 2:45 PM.'
  },
  {
    name: 'Alarms',
    value: 'alarms',
    content:
      'Two active alarms: a peak-demand threshold exceeded on Warehouse B and a meter offline at the Chiller Plant. Acknowledge or route them to a technician.'
  }
]

const CardWithTabsDemo = () => {
  return (
    <Card className='w-max'>
      <CardContent>
        <Tabs defaultValue={tabs[0].value} className='w-full max-w-sm'>
          <TabsList variant='line' className='w-full rounded-none border-b p-0'>
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='border-0 group-data-[orientation=horizontal]/tabs:after:-bottom-[0.5px]'
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <p className='text-muted-foreground p-4 text-sm'>{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default CardWithTabsDemo
