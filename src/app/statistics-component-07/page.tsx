import StatisticsIncomeCard from '@/components/shadcn-studio/blocks/statistics-income-card'
import StatisticsExpenseCard from '@/components/shadcn-studio/blocks/statistics-expense-card'

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 xl:grid-cols-3'>
        <StatisticsIncomeCard />
        <StatisticsExpenseCard />
      </div>
    </div>
  )
}

export default StatisticsCardPreview
