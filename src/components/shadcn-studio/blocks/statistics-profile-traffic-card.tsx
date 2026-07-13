'use client'

import { Bar, BarChart, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Profile traffic chart data
const profileTrafficChartData = [
  { index: '01', traffic: 150 },
  { index: '02', traffic: 250 },
  { index: '03', traffic: 190 },
  { index: '04', traffic: 290 },
  { index: '05', traffic: 220 },
  { index: '06', traffic: 350 },
  { index: '07', traffic: 250 }
]

const profileTrafficChartConfig = {
  traffic: {
    label: 'Peak Demand'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: '2.84 MW',
  description: 'Average Peak Demand',
  children: (
    <>
      <ChartContainer config={profileTrafficChartConfig} className='h-28.75 w-full'>
        <BarChart
          accessibilityLayer
          data={profileTrafficChartData}
          barSize={12}
          margin={{
            left: -20,
            right: -20
          }}
        >
          <XAxis
            dataKey='index'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={value => value.slice(0, 3)}
            tick={{ fontSize: 14, fill: 'var(--muted-foreground)' }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey='traffic' fill='var(--primary)' radius={12} />
        </BarChart>
      </ChartContainer>
    </>
  ),
  changePercentage: 15
}

const StatisticsProfileTrafficCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-2xl font-semibold'>{StatisticsCardData.title}</CardTitle>
          <Badge className='bg-primary/10 text-primary rounded-sm'>
            {StatisticsCardData.changePercentage > 0 ? '+' : '-'}
            {StatisticsCardData.changePercentage}%
          </Badge>
        </div>
        <CardDescription className='text-muted-foreground'>{StatisticsCardData.description}</CardDescription>
      </CardHeader>
      <CardContent>{StatisticsCardData.children}</CardContent>
    </Card>
  )
}

export default StatisticsProfileTrafficCard
