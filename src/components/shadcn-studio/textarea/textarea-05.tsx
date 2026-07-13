import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const TextareaInvalidDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Anomaly notes</Label>
      <Textarea aria-invalid placeholder='Describe the anomaly on this meter' id={id} />
      <p className='text-destructive text-xs'>Please add notes before saving this anomaly.</p>
    </div>
  )
}

export default TextareaInvalidDemo
