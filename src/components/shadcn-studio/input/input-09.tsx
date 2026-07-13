import { useId } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const InputStartHelperTextDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Work email</Label>
      <Input id={id} type='email' placeholder='name@edgecom.ai' />
      <p className='text-muted-foreground text-xs'>We&apos;ll only use this to send peak demand alerts.</p>
    </div>
  )
}

export default InputStartHelperTextDemo
