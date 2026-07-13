import ServiceHealthCard, { type HealthMetric } from '@/components/shadcn-studio/blocks/statistics-metrics-health-card'

const metrics: HealthMetric[] = [
  {
    label: 'API Uptime',
    detail: '1,194/1,198 hrs',
    percentage: 99.7
  },
  {
    label: 'SLA Compliance',
    detail: '654/749 tickets',
    percentage: 87.3
  },
  {
    label: 'Disk Utilisation',
    detail: '3.07/5.0 TB',
    percentage: 61.4
  }
]

const StatisticsCardPreview = () => (
  <div className='py-8 sm:py-16 lg:py-24'>
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <ServiceHealthCard metrics={metrics} className='mx-auto max-w-3xl' />
    </div>
  </div>
)

export default StatisticsCardPreview
