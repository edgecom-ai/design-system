import { Badge } from '@/components/ui/badge'

const BadgeCompletedDemo = () => {
  return (
    <Badge variant='success'>
      <span className='size-1.5 rounded-full bg-success' aria-hidden='true' />
      Online
    </Badge>
  )
}

export default BadgeCompletedDemo
