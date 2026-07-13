import StatisticsActivityCard from '@/components/shadcn-studio/blocks/statistics-activity-card'
import StatisticsLeadCard from '@/components/shadcn-studio/blocks/statistics-leads-card'
import StatisticsProfileTrafficCard from '@/components/shadcn-studio/blocks/statistics-profile-traffic-card'
import StatisticsRevenueCard from '@/components/shadcn-studio/blocks/statistics-revenue-card'

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8'>
        <StatisticsRevenueCard />
        <StatisticsLeadCard />
        <StatisticsActivityCard />
        <StatisticsProfileTrafficCard />
      </div>
    </div>
  )
}

export default StatisticsCardPreview
