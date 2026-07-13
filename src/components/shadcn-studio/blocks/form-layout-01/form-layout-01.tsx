import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

const FormLayout = () => {
  return (
    <form>
      <div className='mb-8 space-y-2'>
        <h2 className='text-xl font-semibold'>Personal Information</h2>
        <p className='text-muted-foreground'>
          Please provide your details to complete your energy manager profile. This helps us tailor Edgecom Energy to
          your sites.
        </p>
      </div>

      <FieldGroup className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-first-name'>First Name</FieldLabel>
          <Input id='multi-step-personal-info-first-name' placeholder='Priya' />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-last-name'>Last Name</FieldLabel>
          <Input id='multi-step-personal-info-last-name' placeholder='Sharma' />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-mobile'>Mobile</FieldLabel>
          <Input id='multi-step-personal-info-mobile' placeholder='+1 (555) 123-4567' />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-pincode'>Pincode</FieldLabel>
          <Input id='multi-step-personal-info-pincode' placeholder='Postal Code' />
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='multi-step-personal-info-address'>Address</FieldLabel>
          <Input id='multi-step-personal-info-address' placeholder='100 Bay Street' />
        </Field>

        <Field className='gap-2 sm:col-span-2'>
          <FieldLabel htmlFor='multi-step-personal-info-landmark'>Landmark</FieldLabel>
          <Input id='multi-step-personal-info-landmark' placeholder='Near Union Station, Toronto' />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-city'>City</FieldLabel>
          <Input id='multi-step-personal-info-city' placeholder='Toronto' />
        </Field>

        <Field className='gap-2'>
          <FieldLabel htmlFor='multi-step-personal-info-state'>Province</FieldLabel>
          <Input id='multi-step-personal-info-state' placeholder='ON' />
        </Field>
      </FieldGroup>

      <div className='mt-8 flex justify-end'>
        <Button type='submit'>Save Information</Button>
      </div>
    </form>
  )
}

export default FormLayout
