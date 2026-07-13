'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { format } from 'date-fns'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { cn } from '@/lib/utils'

const consumptionData = [
  { timestamp: new Date('2026-02-01').getTime(), toronto: 60, calgary: 22, ottawa: 40 },
  { timestamp: new Date('2026-02-02').getTime(), toronto: 50, calgary: 34, ottawa: 42 },
  { timestamp: new Date('2026-02-03').getTime(), toronto: 52, calgary: 65, ottawa: 38 },
  { timestamp: new Date('2026-02-04').getTime(), toronto: 54, calgary: 67, ottawa: 36 },
  { timestamp: new Date('2026-02-05').getTime(), toronto: 70, calgary: 42, ottawa: 56 },
  { timestamp: new Date('2026-02-06').getTime(), toronto: 72, calgary: 65, ottawa: 58 },
  { timestamp: new Date('2026-02-07').getTime(), toronto: 68, calgary: 75, ottawa: 52 },
  { timestamp: new Date('2026-02-08').getTime(), toronto: 45, calgary: 95, ottawa: 70 },
  { timestamp: new Date('2026-02-09').getTime(), toronto: 58, calgary: 78, ottawa: 72 },
  { timestamp: new Date('2026-02-10').getTime(), toronto: 85, calgary: 65, ottawa: 105 },
  { timestamp: new Date('2026-02-11').getTime(), toronto: 88, calgary: 62, ottawa: 75 },
  { timestamp: new Date('2026-02-12').getTime(), toronto: 100, calgary: 55, ottawa: 80 },
  { timestamp: new Date('2026-02-13').getTime(), toronto: 75, calgary: 95, ottawa: 62 },
  { timestamp: new Date('2026-02-14').getTime(), toronto: 118, calgary: 98, ottawa: 55 },
  { timestamp: new Date('2026-02-15').getTime(), toronto: 110, calgary: 80, ottawa: 60 },
  { timestamp: new Date('2026-02-16').getTime(), toronto: 108, calgary: 82, ottawa: 70 },
  { timestamp: new Date('2026-02-17').getTime(), toronto: 102, calgary: 85, ottawa: 75 },
  { timestamp: new Date('2026-02-18').getTime(), toronto: 88, calgary: 112, ottawa: 62 },
  { timestamp: new Date('2026-02-19').getTime(), toronto: 118, calgary: 105, ottawa: 98 },
  { timestamp: new Date('2026-02-20').getTime(), toronto: 125, calgary: 72, ottawa: 95 },
  { timestamp: new Date('2026-02-21').getTime(), toronto: 130, calgary: 95, ottawa: 100 },
  { timestamp: new Date('2026-02-22').getTime(), toronto: 98, calgary: 125, ottawa: 82 },
  { timestamp: new Date('2026-02-23').getTime(), toronto: 110, calgary: 135, ottawa: 65 },
  { timestamp: new Date('2026-02-24').getTime(), toronto: 140, calgary: 100, ottawa: 118 },
  { timestamp: new Date('2026-02-25').getTime(), toronto: 135, calgary: 98, ottawa: 120 },
  { timestamp: new Date('2026-02-26').getTime(), toronto: 115, calgary: 140, ottawa: 100 },
  { timestamp: new Date('2026-02-27').getTime(), toronto: 145, calgary: 108, ottawa: 130 },
  { timestamp: new Date('2026-02-28').getTime(), toronto: 148, calgary: 122, ottawa: 135 }
]

const summaryData = [
  {
    name: 'Toronto DC',
    meters: 42,
    consumption: 2140,
    change: -3.2,
    savings: 4200,
    cost: 251400,
    bgColor: 'bg-chart-1'
  },
  {
    name: 'Calgary Plant',
    meters: 28,
    consumption: 1297,
    change: 1.8,
    savings: 1850,
    cost: 148300,
    bgColor: 'bg-chart-3'
  },
  {
    name: 'Ottawa Office',
    meters: 15,
    consumption: 467,
    change: -0.9,
    savings: 980,
    cost: 52600,
    bgColor: 'bg-chart-5'
  }
]

const chartConfig = {
  toronto: { label: 'Toronto DC', color: 'var(--chart-water-700)' },
  calgary: { label: 'Calgary Plant', color: 'var(--chart-water-500)' },
  ottawa: { label: 'Ottawa Office', color: 'var(--chart-water-300)' }
} satisfies ChartConfig

const EnergyConsumptionMetrics = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription className='text-base'>Energy consumption</CardDescription>
        <CardTitle className='text-3xl font-bold'>3,904 MWh</CardTitle>
        <p className='text-sm font-medium text-success'>
          -201 MWh (4.9%) <span className='text-muted-foreground font-normal'> vs last month</span>
        </p>
      </CardHeader>

      <CardContent className='space-y-8'>
        <ChartContainer config={chartConfig} className='h-64 w-full'>
          <LineChart data={consumptionData} margin={{ top: 8, bottom: 0, left: -10, right: 15 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
            <XAxis
              dataKey={d => format(d.timestamp, 'MMM d')}
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              minTickGap={15}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              domain={[0, 150]}
              ticks={[0, 30, 60, 90, 120, 150]}
              tickFormatter={v => `${v}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)' }}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className='w-40' hideLabel />} />
            <Line
              dataKey='toronto'
              type='monotone'
              stroke='var(--color-toronto)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey='calgary'
              type='monotone'
              stroke='var(--color-calgary)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey='ottawa'
              type='monotone'
              stroke='var(--color-ottawa)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <ChartLegend
              verticalAlign='top'
              content={<ChartLegendContent />}
              className='justify-end max-sm:mb-4 max-sm:ml-3 max-sm:flex-col max-sm:items-start'
            />
          </LineChart>
        </ChartContainer>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='pl-6'>Site</TableHead>
              <TableHead className='text-center'>Meters</TableHead>
              <TableHead className='text-center'>Consumption (MWh)</TableHead>
              <TableHead className='text-center'>Change</TableHead>
              <TableHead className='text-center'>Savings</TableHead>
              <TableHead className='text-end'>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((item, index) => (
              <TableRow key={index} className='border-none'>
                <TableCell className='flex items-center gap-2'>
                  <span className={cn(item.bgColor, 'h-6 w-1 rounded-sm')} />
                  <span className='text-sm font-medium'>{item.name}</span>
                </TableCell>
                <TableCell className='text-center'>{item.meters.toLocaleString()}</TableCell>
                <TableCell className='text-center'>{item.consumption.toLocaleString()}</TableCell>
                <TableCell
                  className={cn('text-center', item.change <= 0 ? 'text-success' : 'text-destructive')}
                >
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </TableCell>
                <TableCell className='text-center text-success'>
                  +${item.savings.toLocaleString('en-US')}
                </TableCell>
                <TableCell className='text-end'>
                  ${item.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default EnergyConsumptionMetrics
