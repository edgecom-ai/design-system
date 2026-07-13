import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { Switch } from '@/components/ui/switch'

const SwitchCardDemo = () => {
  const id = useId()

  return (
    <div className='border-input has-data-checked:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
      <Switch id={id} size='sm' className='order-1' aria-describedby={`${id}-description`} />
      <div className='flex grow gap-3'>
        <Logo variant='mark' label='Edgecom Energy' className='h-5 w-auto' />
        <div className='grid grow gap-2'>
          <Label htmlFor={id}>Auto-export monthly report</Label>
          <p id={`${id}-description`} className='text-muted-foreground text-xs'>
            Send consumption, cost and emissions to your inbox.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SwitchCardDemo
