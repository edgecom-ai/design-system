import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { TrendingUpIcon, MinusIcon, TrendingDownIcon, ShieldAlertIcon } from "lucide-react"

export type StatisticsCardProps = {
  value: string
  title: string
  status: 'within' | 'observe' | 'exceed' | 'unknown'
  className?: string
  range: string
  icon?: React.ReactNode
}

const statusConfig = {
  within: {
    color: 'bg-success/10 text-success',
    icon: (
      <TrendingUpIcon
      />
    ),
    label: 'On Track'
  },
  observe: {
    color: 'bg-warning/10 text-warning-emphasis dark:text-warning',
    icon: (
      <MinusIcon
      />
    ),
    label: 'Stable'
  },
  exceed: {
    color: 'bg-destructive/10 text-destructive',
    icon: (
      <TrendingDownIcon
      />
    ),
    label: 'At Risk'
  },
  unknown: {
    color: 'bg-info/10 text-info',
    icon: (
      <ShieldAlertIcon
      />
    ),
    label: 'Under Review'
  }
}

const StatisticsCard = ({ status, value, title, className, range, icon }: StatisticsCardProps) => {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-sm font-semibold'>{title}</CardTitle>
        {icon && (
          <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm [&>svg]:size-4.5'>
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className='flex flex-1 flex-col gap-3'>
        <p className='text-3xl font-semibold tracking-tight'>{value}</p>

        <div
          className={cn(
            statusConfig[status].color,
            'mt-auto flex w-fit max-w-full items-start gap-1.5 rounded-lg px-2 py-1 text-xs font-medium [&>svg]:size-3.5 [&>svg]:shrink-0'
          )}
        >
          {statusConfig[status].icon}
          <span className='min-w-0'>
            {statusConfig[status].label}: {range}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
