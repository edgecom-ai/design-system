import MetricTrendCard, {
  type MetricTrendCardProps
} from '@/components/shadcn-studio/blocks/statistics-line-trends-card'

// Data

const orders = [
  { time: 'Mon', ThisWeek: 320, LastWeek: 260 },
  { time: 'Tue', ThisWeek: 410, LastWeek: 300 },
  { time: 'Wed', ThisWeek: 390, LastWeek: 340 },
  { time: 'Thu', ThisWeek: 480, LastWeek: 370 },
  { time: 'Fri', ThisWeek: 560, LastWeek: 420 },
  { time: 'Sat', ThisWeek: 610, LastWeek: 490 },
  { time: 'Sun', ThisWeek: 574, LastWeek: 455 }
]

const revenue = [
  { time: 'Mon', ThisWeek: 14200, LastWeek: 11800 },
  { time: 'Tue', ThisWeek: 18600, LastWeek: 13500 },
  { time: 'Wed', ThisWeek: 17300, LastWeek: 15200 },
  { time: 'Thu', ThisWeek: 21400, LastWeek: 16800 },
  { time: 'Fri', ThisWeek: 24900, LastWeek: 19300 },
  { time: 'Sat', ThisWeek: 27100, LastWeek: 21600 },
  { time: 'Sun', ThisWeek: 25840, LastWeek: 20470 }
]

const inventory = [
  { time: 'Mon', Inbound: 890, Outbound: 740 },
  { time: 'Tue', Inbound: 1020, Outbound: 860 },
  { time: 'Wed', Inbound: 960, Outbound: 920 },
  { time: 'Thu', Inbound: 1140, Outbound: 980 },
  { time: 'Fri', Inbound: 1280, Outbound: 1150 },
  { time: 'Sat', Inbound: 1350, Outbound: 1240 },
  { time: 'Sun', Inbound: 1310, Outbound: 1190 }
]

// Card Configs

const cards: MetricTrendCardProps[] = [
  {
    title: 'Orders',
    series: [
      { key: 'ThisWeek', label: 'This week', value: 574, color: 'var(--chart-1)' },
      { key: 'LastWeek', label: 'Last week', value: 455, color: 'var(--chart-2)' }
    ],
    data: orders
  },
  {
    title: 'Gross Revenue',
    series: [
      { key: 'ThisWeek', label: 'This week', value: 25840, color: 'var(--chart-3)' },
      { key: 'LastWeek', label: 'Last week', value: 20470, color: 'var(--chart-4)' }
    ],
    data: revenue
  },
  {
    title: 'Inventory Movement',
    series: [
      { key: 'Inbound', label: 'Inbound', value: 1310, color: 'var(--chart-2)' },
      { key: 'Outbound', label: 'Outbound', value: 1190, color: 'var(--chart-5)' }
    ],
    data: inventory
  }
]

const StatisticsCardPreview = () => (
  <div className='py-8 sm:py-16 lg:py-24'>
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {cards.map(card => (
          <MetricTrendCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  </div>
)

export default StatisticsCardPreview
