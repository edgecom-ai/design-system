'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Types

type TrendSeries = {
  key: string
  label: string
  value: number
  color: string
}

export type MetricTrendCardProps = {
  title: string
  series: [TrendSeries, TrendSeries]
  data: Record<string, string | number>[]
  className?: string
}

// Component

const MetricTrendCard = ({ title, series, data, className }: MetricTrendCardProps) => {
  const chartConfig: ChartConfig = Object.fromEntries(series.map(s => [s.key, { label: s.label, color: s.color }]))

  return (
    <Card className={className}>
      <CardHeader className='grid-rows-none'>
        <CardTitle className='font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex gap-6 max-sm:flex-col sm:items-center'>
        <div className='flex gap-4 max-sm:justify-between sm:flex-col'>
          {series.map((data, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='h-9 w-1 rounded-sm' style={{ backgroundColor: data.color }} />
              <div>
                <p className='text-muted-foreground text-xs'>{data.label}</p>
                <p className='text-2xl font-semibold'>{data.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <ChartContainer config={chartConfig} className='h-28 min-w-0 flex-1'>
          <LineChart data={data} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
            <XAxis
              dataKey='time'
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              tickMargin={6}
              interval='preserveStartEnd'
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            {series.map(s => (
              <Line
                key={s.key}
                dataKey={s.key}
                type='monotone'
                stroke={`var(--color-${s.key})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MetricTrendCard
