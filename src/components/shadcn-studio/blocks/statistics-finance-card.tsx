import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { TrendingUpIcon, MinusIcon, TrendingDownIcon, ShieldAlertIcon, ChevronRightIcon } from "lucide-react"

// Types

export type StatisticsFinanceCardProps = {
  region: string
  value: string
  goalsAchieved: number
  goalsTotal: number
  status: 'within' | 'observe' | 'critical' | 'review'
  className?: string
}

// Status Config

const statusConfig = {
  within: {
    label: 'On Track',
    icon: (
      <TrendingUpIcon
      />
    ),
    iconBg: 'bg-success',
    iconFg: 'text-white',
    textColor: 'text-success'
  },
  observe: {
    label: 'Monitoring',
    icon: (
      <MinusIcon
      />
    ),
    iconBg: 'bg-warning',
    iconFg: 'text-warning-foreground',
    textColor: 'text-warning-emphasis dark:text-warning'
  },
  critical: {
    label: 'At Risk',
    icon: (
      <TrendingDownIcon
      />
    ),
    iconBg: 'bg-destructive',
    iconFg: 'text-white',
    textColor: 'text-destructive'
  },
  review: {
    label: 'Under Review',
    icon: (
      <ShieldAlertIcon
      />
    ),
    iconBg: 'bg-info',
    iconFg: 'text-white',
    textColor: 'text-info'
  }
}

// Component

const StatisticsFinanceCard = ({
  region,
  value,
  status,
  className
}: StatisticsFinanceCardProps) => {
  const cfg = statusConfig[status]

  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription>{region}</CardDescription>
        <CardTitle className='text-2xl font-semibold tracking-tight'>{value}</CardTitle>
      </CardHeader>

      <CardContent>
        <button className='bg-muted/60 hover:bg-muted flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors'>
          <span
            className={cn(
              cfg.iconBg,
              cfg.iconFg,
              'flex size-8 shrink-0 items-center justify-center rounded-lg [&>svg]:size-4'
            )}
          >
            {cfg.icon}
          </span>

          <span className={cn('flex-1 text-left text-xs font-medium', cfg.textColor)}>
            {cfg.label}
          </span>

          <ChevronRightIcon className='text-muted-foreground size-4 shrink-0' />
        </button>
      </CardContent>
    </Card>
  )
}

export default StatisticsFinanceCard
