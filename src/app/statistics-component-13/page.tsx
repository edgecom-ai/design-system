import StatisticsFinanceCard, {
  type StatisticsFinanceCardProps
} from '@/components/shadcn-studio/blocks/statistics-finance-card'

//  Data
const financialData: StatisticsFinanceCardProps[] = [
  {
    region: 'Q1 Net Revenue',
    value: '$512,800',
    goalsAchieved: 6,
    goalsTotal: 6,
    status: 'within'
  },
  {
    region: 'Operational Costs',
    value: '$198,450',
    goalsAchieved: 3,
    goalsTotal: 6,
    status: 'observe'
  },
  {
    region: 'Outstanding Invoices',
    value: '$74,120',
    goalsAchieved: 1,
    goalsTotal: 6,
    status: 'critical'
  },
  {
    region: 'Annual Tax Provision',
    value: '$93,600',
    goalsAchieved: 2,
    goalsTotal: 6,
    status: 'review'
  }
]

//  Preview

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-4'>
        {financialData.map(card => (
          <StatisticsFinanceCard key={card.region} {...card} />
        ))}
      </div>
    </div>
  )
}

export default StatisticsCardPreview
