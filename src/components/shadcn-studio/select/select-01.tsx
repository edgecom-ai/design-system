import { useId } from 'react'

import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

const NativeSelectDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Commodity</Label>
      <NativeSelect id={id}>
        <NativeSelectOption value='1'>Electricity</NativeSelectOption>
        <NativeSelectOption value='2'>Water</NativeSelectOption>
        <NativeSelectOption value='3'>Gas</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

export default NativeSelectDemo
