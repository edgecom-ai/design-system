import StatisticsScoreCard, {
  type StatisticsScoreCardProps
} from '@/components/shadcn-studio/blocks/statistics-score-card'

//  Data
const scoreData: StatisticsScoreCardProps[] = [
  {
    label: 'Energy Efficiency',
    description: 'Based on consumption against baseline and load factor',
    score: 82
  },
  {
    label: 'Demand Target Adherence',
    description: 'Share of months staying under the peak-demand target',
    score: 61
  },
  {
    label: 'Power Quality',
    description: 'Consistency of voltage, THD, and power factor over time',
    score: 38
  },
  {
    label: 'Renewable Utilisation',
    description: 'Portion of load met by on-site generation',
    score: 55
  }
]

//  Preview

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Cards */}
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {scoreData.map(card => (
            <StatisticsScoreCard key={card.label} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatisticsCardPreview
