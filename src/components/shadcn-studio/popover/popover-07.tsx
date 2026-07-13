import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription
} from '@/components/ui/popover'
import { FileWarningIcon } from "lucide-react"

const PopoverDeleteFileDemo = () => {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant='outline' size='icon' />}>
        <FileWarningIcon
        />
        <span className='sr-only'>Delete Meter</span>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex aspect-square size-12 items-center justify-center rounded-full bg-destructive/10'>
            <FileWarningIcon className='text-destructive size-6' />
          </div>
          <PopoverHeader className='gap-2 text-center'>
            <PopoverTitle className='text-base font-semibold text-balance'>
              Are you sure you want to delete this meter?
            </PopoverTitle>
            <PopoverDescription>
              Deleting this meter will remove its historical consumption data and any linked alarms, so keep that in mind
              before continuing
            </PopoverDescription>
          </PopoverHeader>
          <div className='grid w-full grid-cols-2 gap-2'>
            <Button variant='secondary' size='sm'>
              Cancel
            </Button>
            <Button variant='destructive' size='sm'>
              Delete Meter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverDeleteFileDemo
