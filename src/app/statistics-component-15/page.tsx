import StatisticsUsageCard, {
  type StatisticsUsageCardProps
} from '@/components/shadcn-studio/blocks/statistics-usage-card'
import { ZapIcon, GaugeIcon, DatabaseIcon, BellIcon } from "lucide-react"

// Site resource-allocation meters
const usageData: StatisticsUsageCardProps[] = [
  {
    icon: (
      <GaugeIcon />
    ),
    title: 'Peak Demand Budget',
    current: 4200,
    max: 5000,
    unit: 'kW'
  },
  {
    icon: (
      <ZapIcon />
    ),
    title: 'Metered Points',
    current: 182,
    max: 250,
    unit: 'meters'
  },
  {
    icon: (
      <DatabaseIcon />
    ),
    title: 'Interval Data Storage',
    current: 42,
    max: 100,
    unit: 'GB'
  },
  {
    icon: (
      <BellIcon />
    ),
    title: 'Alarm Rules',
    current: 7,
    max: 10,
    unit: 'rules'
  }
]

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-4 sm:grid-cols-2'>
          {usageData.map(card => (
            <StatisticsUsageCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatisticsCardPreview
