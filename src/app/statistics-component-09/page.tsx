import StatisticsOverviewCard from '@/components/shadcn-studio/blocks/statistics-overview-card'
import StatisticsSessionsCard from '@/components/shadcn-studio/blocks/statistics-sessions-card'
import StatisticsTotalGrowthCard from '@/components/shadcn-studio/blocks/statistics-total-growth-card'
import StatisticsTotalProfitCard from '@/components/shadcn-studio/blocks/statistics-total-profit-card'
import StatisticsTotalRevenueCard from '@/components/shadcn-studio/blocks/statistics-total-revenue-card'
import StatisticsTotalSalesCard from '@/components/shadcn-studio/blocks/statistics-total-sales-card'

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8'>
        <StatisticsTotalRevenueCard />
        <StatisticsSessionsCard />
        <StatisticsTotalSalesCard />
        <StatisticsOverviewCard />
        <StatisticsTotalGrowthCard />
        <StatisticsTotalProfitCard />
      </div>
    </div>
  )
}

export default StatisticsCardPreview
