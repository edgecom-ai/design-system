'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CategoryBar } from '@/components/ui/category-bar'
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { EllipsisVerticalIcon } from "lucide-react"

const listItems = ['Export', 'Filter', 'Refresh']

type BudgetDataPoint = {
  month: string
  total: number
  electricity: number
  gas: number
  water: number
  steam: number
}

const budgetData: BudgetDataPoint[] = [
  { month: 'January', total: 42, electricity: 16, gas: 9.5, water: 8, steam: 8.5 },
  { month: 'February', total: 39, electricity: 14.8, gas: 8.8, water: 7.4, steam: 8 },
  { month: 'March', total: 45, electricity: 17.2, gas: 10.2, water: 8.8, steam: 9.3 },
  { month: 'April', total: 41, electricity: 15.5, gas: 9.2, water: 7.8, steam: 8.5 },
  { month: 'May', total: 48, electricity: 18.5, gas: 11, water: 9.2, steam: 9.3 },
  { month: 'June', total: 43.5, electricity: 16.5, gas: 9.8, water: 8.4, steam: 8.8 },
  { month: 'July', total: 51, electricity: 19.8, gas: 11.8, water: 9.8, steam: 9.6 },
  { month: 'August', total: 47, electricity: 17.8, gas: 10.8, water: 9, steam: 9.4 },
  { month: 'September', total: 39.5, electricity: 15, gas: 9, water: 7.6, steam: 7.9 },
  { month: 'October', total: 50, electricity: 19.2, gas: 11.5, water: 9.6, steam: 9.7 },
  { month: 'November', total: 54, electricity: 21, gas: 12.2, water: 10.4, steam: 10.4 },
  { month: 'December', total: 58, electricity: 22.8, gas: 13, water: 11.2, steam: 11 }
]

const budgetConfig = {
  total: {
    label: 'Total Cost',
    color: 'var(--chart-water-500)'
  }
} satisfies ChartConfig

type CategoryEntry = {
  name: string
  value: number
  fill: string
  bgColor: string
}

const getCategoryData = (data: BudgetDataPoint): CategoryEntry[] => [
  { name: 'Electricity', value: data.electricity, fill: 'var(--chart-water-900)', bgColor: 'bg-[var(--chart-water-900)]' },
  { name: 'Gas', value: data.gas, fill: 'var(--chart-water-700)', bgColor: 'bg-[var(--chart-water-700)]' },
  { name: 'Water', value: data.water, fill: 'var(--chart-water-500)', bgColor: 'bg-[var(--chart-water-500)]' },
  { name: 'Steam', value: data.steam, fill: 'var(--chart-water-300)', bgColor: 'bg-[var(--chart-water-300)]' }
]

const BudgetTooltip = ({ active, payload }: Partial<TooltipContentProps<number, string>>) => {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload as BudgetDataPoint | undefined

  if (!data) return null

  const categoryData = getCategoryData(data)
  const total = categoryData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className='bg-background border-border w-50 rounded-xl border p-3 shadow-lg sm:w-56'>
      <div className='mb-2.5 flex items-center justify-between gap-4'>
        <p className='text-muted-foreground text-sm'>{data.month.slice(0, 3)} 2026</p>
        <p className='text-foreground text-sm font-semibold'>${data.total}k</p>
      </div>
      <CategoryBar
        values={categoryData.map(d => d.value)}
        colors={categoryData.map(d => d.bgColor)}
        showLabels={false}
        className='mb-3 max-sm:hidden'
      />
      <div className='flex flex-col gap-1.5'>
        {categoryData.map(m => (
          <div key={m.name} className='flex items-center gap-1.5'>
            <span
              className='inline-block h-2 w-2 shrink-0 rounded-sm max-sm:hidden'
              style={{ backgroundColor: m.fill }}
            />
            <span className='text-muted-foreground text-xs'>{m.name}</span>
            <span className='text-foreground ml-auto pl-3 text-xs font-medium tabular-nums'>
              <span className='font-semibold'>${m.value}k</span>
              <span className='text-muted-foreground'> ({total > 0 ? ((m.value / total) * 100).toFixed(1) : 0}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const BudgetSpendAnalyticsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader className='flex justify-between border-b'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Energy Spend</span>
          <span className='text-muted-foreground text-sm'>Monthly cost by utility</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
          >
            <EllipsisVerticalIcon
            />
            <span className='sr-only'>Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-1'>
        <ChartContainer config={budgetConfig} className='max-h-85 min-h-60 w-full'>
          <BarChart
            accessibilityLayer
            data={budgetData}
            margin={{
              top: 20,
              left: -25
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray='4' stroke='var(--border)' />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              minTickGap={20}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              domain={[0, 68]}
              ticks={[0, 17, 34, 51, 68]}
              tickFormatter={value => `$${value}k`}
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <ChartTooltip defaultIndex={4} cursor={false} content={<BudgetTooltip />} />
            <Bar dataKey='total' fill='var(--color-total)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default BudgetSpendAnalyticsCard
