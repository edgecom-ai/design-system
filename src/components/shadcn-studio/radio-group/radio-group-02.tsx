import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const RadioGroupHorizontalDemo = () => {
  return (
    <RadioGroup defaultValue='electricity' className='flex items-center gap-4'>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='electricity' id='electricity' />
        <Label htmlFor='electricity'>Electricity</Label>
      </div>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='water' id='water' />
        <Label htmlFor='water'>Water</Label>
      </div>
      <div className='flex items-center gap-2'>
        <RadioGroupItem value='gas' id='gas' />
        <Label htmlFor='gas'>Gas</Label>
      </div>
    </RadioGroup>
  )
}

export default RadioGroupHorizontalDemo
