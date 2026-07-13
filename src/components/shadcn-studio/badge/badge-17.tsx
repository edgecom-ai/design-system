import { Badge } from '@/components/ui/badge'

const BadgeBlockedDemo = () => {
  return (
    <Badge variant='destructive'>
      <span className='size-1.5 rounded-full bg-destructive' aria-hidden='true' />
      Alarm
    </Badge>
  )
}

export default BadgeBlockedDemo
