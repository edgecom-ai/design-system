'use client'

import { Label, Pie, PieChart } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Lead chart data
const leadChartData = [
  { month: 'january', sales: 340, fill: 'var(--color-january)' },
  { month: 'february', sales: 200, fill: 'var(--color-february)' },
  { month: 'march', sales: 200, fill: 'var(--color-march)' }
]

const leadChartConfig = {
  sales: {
    label: 'Events'
  },
  january: {
    label: 'January',
    color: 'color-mix(in oklab, var(--primary) 60%, transparent)'
  },
  february: {
    label: 'February',
    color: 'var(--primary)'
  },
  march: {
    label: 'March',
    color: 'color-mix(in oklab, var(--primary) 20%, transparent)'
  }
} satisfies ChartConfig

const StatisticsCardData = {
  title: 'DR events triggered',
  amount: '4,350',
  changePercentage: 18.2,
  children: (
    <>
      <ChartContainer config={leadChartConfig} className='mx-auto aspect-square h-37.5'>
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={leadChartData}
            dataKey='sales'
            nameKey='month'
            innerRadius='62%'
            strokeWidth={2}
            outerRadius='90%'
            paddingAngle={3}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-xl font-medium'>
                        $23K
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  )
}

const StatisticsLeadCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardContent className='flex justify-between gap-6 max-sm:flex-col sm:items-center'>
        <div className='flex h-full flex-col justify-between gap-6 md:shrink-0'>
          <div className='flex flex-col gap-1'>
            <span className='text-base font-semibold'>{StatisticsCardData.title}</span>
            <span className='text-muted-foreground text-sm'>Weekly Report</span>
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-semibold'>{StatisticsCardData.amount}</span>
            <span className='text-primary text-sm'>
              {StatisticsCardData.changePercentage > 0 ? '+' : '-'}
              {StatisticsCardData.changePercentage}%
            </span>
          </div>
        </div>
        <div className='h-37.5 min-w-0 grow sm:pl-6'>{StatisticsCardData.children}</div>
      </CardContent>
    </Card>
  )
}

export default StatisticsLeadCard
