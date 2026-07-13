import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const TextareaWithButtonDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Report description</Label>
      <Textarea id={id} placeholder='Describe what this report covers' />
      <Button size='sm'>Save Report</Button>
    </div>
  )
}

export default TextareaWithButtonDemo
