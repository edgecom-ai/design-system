import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

const NativeSelectRequiredDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id} className='gap-1'>
        Report type <span className='text-destructive'>*</span>
      </Label>
      <NativeSelect id={id} required>
        <NativeSelectOption value='1'>Consumption</NativeSelectOption>
        <NativeSelectOption value='2'>Cost</NativeSelectOption>
        <NativeSelectOption value='3'>Emissions</NativeSelectOption>
        <NativeSelectOption value='4'>Peak demand</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

export default NativeSelectRequiredDemo
