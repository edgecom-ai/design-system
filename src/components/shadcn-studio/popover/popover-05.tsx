import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InfoIcon } from "lucide-react"

const PopoverAboutDemo = () => {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant='outline' size='icon' />}>
        <InfoIcon
        />
        <span className='sr-only'>About dataTrack</span>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-1.5 text-center'>
            <div className='text-lg font-semibold'>About dataTrack</div>
            <p className='text-muted-foreground text-sm'>
              Track energy consumption, cost, and emissions across all your sites and meters in one place.
            </p>
          </div>
          <Button
            size='sm'
            nativeButton={false}
            render={
              <a href='#'>Learn More</a>
            }
          ></Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverAboutDemo
