import { Badge } from '@/components/ui/badge'

const BadgeInProgressDemo = () => {
  return (
    <Badge variant='warning'>
      <span className='size-1.5 rounded-full bg-warning' aria-hidden='true' />
      DR Active
    </Badge>
  )
}

export default BadgeInProgressDemo
