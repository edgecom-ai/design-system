import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const RadioGroupDemo = () => {
  return (
    <RadioGroup defaultValue='day'>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='day' id='day' />
        <Label htmlFor='day'>Day</Label>
      </div>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='week' id='week' />
        <Label htmlFor='week'>Week</Label>
      </div>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='month' id='month' />
        <Label htmlFor='month'>Month</Label>
      </div>
    </RadioGroup>
  )
}

export default RadioGroupDemo
