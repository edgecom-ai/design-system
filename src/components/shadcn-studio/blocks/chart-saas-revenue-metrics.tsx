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
  { timestamp: new Date('2026-02-01').getTime(), siteA: 60, siteB: 22, siteC: 40 },
  { timestamp: new Date('2026-02-02').getTime(), siteA: 50, siteB: 34, siteC: 42 },
  { timestamp: new Date('2026-02-03').getTime(), siteA: 52, siteB: 65, siteC: 38 },
  { timestamp: new Date('2026-02-04').getTime(), siteA: 54, siteB: 67, siteC: 36 },
  { timestamp: new Date('2026-02-05').getTime(), siteA: 70, siteB: 42, siteC: 56 },
  { timestamp: new Date('2026-02-06').getTime(), siteA: 72, siteB: 65, siteC: 58 },
  { timestamp: new Date('2026-02-07').getTime(), siteA: 68, siteB: 75, siteC: 52 },
  { timestamp: new Date('2026-02-08').getTime(), siteA: 45, siteB: 95, siteC: 70 },
  { timestamp: new Date('2026-02-09').getTime(), siteA: 58, siteB: 78, siteC: 72 },
  { timestamp: new Date('2026-02-10').getTime(), siteA: 85, siteB: 65, siteC: 105 },
  { timestamp: new Date('2026-02-11').getTime(), siteA: 88, siteB: 62, siteC: 75 },
  { timestamp: new Date('2026-02-12').getTime(), siteA: 100, siteB: 55, siteC: 80 },
  { timestamp: new Date('2026-02-13').getTime(), siteA: 75, siteB: 95, siteC: 62 },
  { timestamp: new Date('2026-02-14').getTime(), siteA: 118, siteB: 98, siteC: 55 },
  { timestamp: new Date('2026-02-15').getTime(), siteA: 110, siteB: 80, siteC: 60 },
  { timestamp: new Date('2026-02-16').getTime(), siteA: 108, siteB: 82, siteC: 70 },
  { timestamp: new Date('2026-02-17').getTime(), siteA: 102, siteB: 85, siteC: 75 },
  { timestamp: new Date('2026-02-18').getTime(), siteA: 88, siteB: 112, siteC: 62 },
  { timestamp: new Date('2026-02-19').getTime(), siteA: 118, siteB: 105, siteC: 98 },
  { timestamp: new Date('2026-02-20').getTime(), siteA: 125, siteB: 72, siteC: 95 },
  { timestamp: new Date('2026-02-21').getTime(), siteA: 130, siteB: 95, siteC: 100 },
  { timestamp: new Date('2026-02-22').getTime(), siteA: 98, siteB: 125, siteC: 82 },
  { timestamp: new Date('2026-02-23').getTime(), siteA: 110, siteB: 135, siteC: 65 },
  { timestamp: new Date('2026-02-24').getTime(), siteA: 140, siteB: 100, siteC: 118 },
  { timestamp: new Date('2026-02-25').getTime(), siteA: 135, siteB: 98, siteC: 120 },
  { timestamp: new Date('2026-02-26').getTime(), siteA: 115, siteB: 140, siteC: 100 },
  { timestamp: new Date('2026-02-27').getTime(), siteA: 145, siteB: 108, siteC: 130 },
  { timestamp: new Date('2026-02-28').getTime(), siteA: 148, siteB: 122, siteC: 135 }
]

const summaryData = [
  {
    name: 'Distribution Center',
    meters: 42,
    consumption: 2140,
    change: -3.2,
    savings: 4200,
    cost: 251400,
    bgColor: 'bg-chart-1'
  },
  {
    name: 'Plant 1',
    meters: 28,
    consumption: 1297,
    change: 1.8,
    savings: 1850,
    cost: 148300,
    bgColor: 'bg-chart-3'
  },
  {
    name: 'Regional Office',
    meters: 15,
    consumption: 467,
    change: -0.9,
    savings: 980,
    cost: 52600,
    bgColor: 'bg-chart-5'
  }
]

const chartConfig = {
  siteA: { label: 'Distribution Center', color: 'var(--chart-water-700)' },
  siteB: { label: 'Plant 1', color: 'var(--chart-water-500)' },
  siteC: { label: 'Regional Office', color: 'var(--chart-water-300)' }
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
              dataKey='siteA'
              type='monotone'
              stroke='var(--color-siteA)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey='siteB'
              type='monotone'
              stroke='var(--color-siteB)'
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              dataKey='siteC'
              type='monotone'
              stroke='var(--color-siteC)'
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
