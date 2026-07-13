import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const InputAddOnsDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Utility portal URL</Label>
      <ButtonGroup>
        <Button variant='outline'>https://</Button>
        <Input id={id} placeholder='portal.utility' />
        <Button variant='outline'>.com</Button>
      </ButtonGroup>
    </div>
  )
}

export default InputAddOnsDemo
