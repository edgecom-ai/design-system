import { PhoneInput } from '@/components/ui/phone-input'
import { Label } from '@/components/ui/label'

const PhoneInputWithLabel = () => {
  return (
    <div className='space-y-2'>
      <Label htmlFor='phone'>Alert contact number</Label>
      <PhoneInput id='phone' placeholder='Enter alert contact number' />
    </div>
  )
}

export default PhoneInputWithLabel
