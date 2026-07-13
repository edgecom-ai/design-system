'use client'

import { useMemo, useState } from 'react'

import { format } from 'date-fns'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

import { cn } from '@/lib/utils'
import { TrendingUpIcon } from "lucide-react"

const curtailmentData = [
  { timestamp: new Date('2025-01-01').getTime(), dispatched: 45, delivered: 35 },
  { timestamp: new Date('2025-01-15').getTime(), dispatched: 52, delivered: 38 },
  { timestamp: new Date('2025-02-01').getTime(), dispatched: 58, delivered: 42 },
  { timestamp: new Date('2025-02-15').getTime(), dispatched: 55, delivered: 45 },
  { timestamp: new Date('2025-03-01').getTime(), dispatched: 62, delivered: 48 },
  { timestamp: new Date('2025-03-15').getTime(), dispatched: 68, delivered: 52 },
  { timestamp: new Date('2025-04-01').getTime(), dispatched: 72, delivered: 58 },
  { timestamp: new Date('2025-04-15').getTime(), dispatched: 78, delivered: 62 },
  { timestamp: new Date('2025-05-01').getTime(), dispatched: 75, delivered: 65 },
  { timestamp: new Date('2025-05-15').getTime(), dispatched: 82, delivered: 68 },
  { timestamp: new Date('2025-06-01').getTime(), dispatched: 88, delivered: 72 },
  { timestamp: new Date('2025-06-15').getTime(), dispatched: 92, delivered: 75 },
  { timestamp: new Date('2025-07-01').getTime(), dispatched: 85, delivered: 78 },
  { timestamp: new Date('2025-07-15').getTime(), dispatched: 90, delivered: 72 },
  { timestamp: new Date('2025-08-01').getTime(), dispatched: 95, delivered: 68 },
  { timestamp: new Date('2025-08-15').getTime(), dispatched: 102, delivered: 75 },
  { timestamp: new Date('2025-08-28').getTime(), dispatched: 105, delivered: 82 },
  { timestamp: new Date('2025-09-02').getTime(), dispatched: 112, delivered: 88 },
  { timestamp: new Date('2025-09-07').getTime(), dispatched: 108, delivered: 92 },
  { timestamp: new Date('2025-09-12').getTime(), dispatched: 115, delivered: 85 },
  { timestamp: new Date('2025-09-17').getTime(), dispatched: 122, delivered: 78 },
  { timestamp: new Date('2025-09-21').getTime(), dispatched: 128, delivered: 82 },
  { timestamp: new Date('2025-09-22').getTime(), dispatched: 135, delivered: 88 },
  { timestamp: new Date('2025-09-23').getTime(), dispatched: 142, delivered: 95 },
  { timestamp: new Date('2025-09-24').getTime(), dispatched: 138, delivered: 102 },
  { timestamp: new Date('2025-09-25').getTime(), dispatched: 132, delivered: 98 },
  { timestamp: new Date('2025-09-26').getTime(), dispatched: 145, delivered: 105 },
  { timestamp: new Date('2025-09-27').getTime(), dispatched: 152, delivered: 112 }
]

const chartConfig = {
  dispatched: { label: 'Dispatched (MW)', color: 'var(--chart-water-700)' },
  delivered: { label: 'Delivered (MW)', color: 'var(--chart-water-300)' }
} satisfies ChartConfig

type TimeRange = '7d' | '30d' | 'max'

const DAY_MS = 24 * 60 * 60 * 1000
const NOW = new Date('2025-09-27').getTime()

const cutoffByRange: Record<TimeRange, number> = {
  '7d': NOW - 7 * DAY_MS,
  '30d': NOW - 30 * DAY_MS,
  max: 0
}

const RadioTimeRangeData = [
  { id: '7d', label: 'Last 7d' },
  { id: '30d', label: 'Last 30d' },
  { id: 'max', label: 'Max' }
]

const curtailmentSummary = [
  { label: 'Total Revenue', value: '$285,420.75', positive: true },
  { label: 'Missed Revenue', value: '$18,240.00', positive: false },
  { label: 'Total Curtailment', value: '1,284 MWh', positive: false },
  { label: 'Hours Curtailed', value: '342 h', positive: false },
  { label: 'Total Events', value: '28', positive: false },
  { label: 'Performance Factor', value: '+98.6%', positive: true }
]

const DemandResponsePerformance = ({ className }: { className?: string }) => {
  const [activeTab, setActiveTab] = useState<TimeRange>('7d')

  const chartData = useMemo(() => {
    const cutoff = cutoffByRange[activeTab]
    const dateFormat = 'MMM d'

    return curtailmentData
      .filter(d => d.timestamp >= cutoff)
      .map(d => ({ ...d, displayDate: format(d.timestamp, dateFormat) }))
  }, [activeTab])

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardDescription className='text-base'>Demand response performance</CardDescription>
        <CardTitle className='text-3xl font-bold'>$285,420.75</CardTitle>
        <p className='text-sm font-medium text-success'>
          +$12,840.50 (4.7%) <span className='text-muted-foreground font-normal'>Past 30 days</span>
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        <RadioGroup
          defaultValue='7d'
          onValueChange={v => setActiveTab(v as TimeRange)}
          className='bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center gap-0 rounded-lg p-1'
        >
          {RadioTimeRangeData.map(({ id, label }) => (
            <div key={id} className='relative h-full grow'>
              <RadioGroupItem value={id} id={id} className='peer sr-only absolute' />
              <Label
                htmlFor={id}
                className='ring-offset-background peer-focus-visible:ring-ring peer-data-checked:bg-background peer-data-checked:text-foreground inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md px-6 py-1 text-sm font-medium whitespace-nowrap transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none peer-disabled:pointer-events-none peer-disabled:opacity-50 peer-data-checked:shadow'
              >
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <LineChart data={chartData} margin={{ top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
            <XAxis
              dataKey='displayDate'
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              domain={[0, 160]}
              ticks={[0, 40, 80, 120, 160]}
              tickFormatter={v => `${v}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className='w-40' hideLabel />} />
            <Line
              dataKey='dispatched'
              type='monotone'
              stroke='var(--color-dispatched)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey='delivered'
              type='monotone'
              stroke='var(--color-delivered)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>

        <div>
          <h3 className='mb-4 text-base font-semibold'>Demand Response Summary</h3>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {curtailmentSummary.map((item, i) => (
              <div
                key={i}
                className='flex flex-col gap-1.5 rounded-lg border p-3 transition-all duration-300 ease-out hover:shadow-md'
              >
                <span className='text-muted-foreground text-sm font-medium'>{item.label}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-medium'>{item.value}</span>
                  {item.positive && (
                    <span className='flex size-6 items-center justify-center rounded-full bg-success/10 text-success'>
                      <TrendingUpIcon className='size-3.5' />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DemandResponsePerformance
