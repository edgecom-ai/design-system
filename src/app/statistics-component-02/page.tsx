import StatisticsCard, { type StatisticsCardProps } from '@/components/shadcn-studio/blocks/statistics-card-02'
import { ZapIcon, GaugeIcon, DollarSignIcon, LeafIcon } from "lucide-react"

// Energy KPI tiles
const StatisticsCardData: StatisticsCardProps[] = [
  {
    icon: (
      <ZapIcon className='size-3.5' />
    ),
    title: 'Energy Consumed',
    value: '1.24 GWh',
    changePercentage: -8
  },
  {
    icon: (
      <GaugeIcon className='size-3.5' />
    ),
    title: 'Peak Demand',
    value: '4.8 MW',
    changePercentage: 3.5
  },
  {
    icon: (
      <DollarSignIcon className='size-3.5' />
    ),
    title: 'Energy Cost',
    value: '$148,200',
    changePercentage: -12.5
  },
  {
    icon: (
      <LeafIcon className='size-3.5' />
    ),
    title: 'CO₂ Emissions',
    value: '312 t',
    changePercentage: -15
  }
]

const StatisticsCardPreview = () => {
  return (
    <div className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8'>
        {StatisticsCardData.map((card, index) => (
          <StatisticsCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            changePercentage={card.changePercentage}
          />
        ))}
      </div>
    </div>
  )
}

export default StatisticsCardPreview
