import { Toggle } from '@/components/ui/toggle'
import Heart from '@/assets/svg/heart'
import { ThumbsUp, StarIcon, ArrowBigUpIcon } from "lucide-react"

const ToggleFilledIcon = () => {
  return (
    <div className='flex items-center gap-2'>
      <Toggle aria-label='Toggle heart' variant='outline' className='group/toggle'>
        <Heart className='group-data-[pressed]/toggle:fill-destructive group-data-[pressed]/toggle:stroke-destructive group-data-[pressed]/toggle:text-destructive' />
      </Toggle>
      <Toggle aria-label='Toggle thumbs up' variant='outline' className='group/toggle'>
        <ThumbsUp className='group-data-[pressed]/toggle:fill-info group-data-[pressed]/toggle:stroke-info group-data-[pressed]/toggle:text-info' />
      </Toggle>
      <Toggle aria-label='Toggle star' variant='outline' className='group/toggle'>
        <StarIcon className='group-data-[pressed]/toggle:fill-warning group-data-[pressed]/toggle:stroke-warning group-data-[pressed]/toggle:text-warning' />
      </Toggle>
      <Toggle aria-label='Toggle arrow up' variant='outline' className='group/toggle'>
        <ArrowBigUpIcon className='group-data-[pressed]/toggle:fill-success group-data-[pressed]/toggle:stroke-success group-data-[pressed]/toggle:text-success' />
      </Toggle>
    </div>
  )
}

export default ToggleFilledIcon
