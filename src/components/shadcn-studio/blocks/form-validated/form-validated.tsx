'use client'

import { useState } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/ui/tanstack-form'
import { FieldGroup } from '@/components/ui/field'
import { SelectItem } from '@/components/ui/select'

// Form state, validation, and submission are owned by TanStack Form.
// The schema below is any Standard Schema — zod plugs straight into
// `validators`, and its issues surface inline through the design-system
// FieldError primitive.
const schema = z.object({
  fullName: z.string().min(2, 'Enter at least 2 characters.'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  role: z.string().min(1, 'Select a role.'),
  note: z.string().max(200, 'Keep your note under 200 characters.'),
  agree: z.boolean().refine((value) => value === true, {
    message: 'You must confirm access to continue.'
  })
})

const FormValidated = () => {
  const [submitted, setSubmitted] = useState<string | null>(null)

  const form = useAppForm({
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      note: '',
      agree: false
    },
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      setSubmitted(`Invitation sent to ${value.email}.`)
    }
  })

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className='mb-8 space-y-2'>
        <h2 className='text-xl font-semibold'>Invite a teammate</h2>
        <p className='text-muted-foreground'>
          Send an invitation to give a colleague access to your energy data. Fields are validated inline as you type.
        </p>
      </div>

      <FieldGroup>
        <form.AppField name='fullName'>
          {field => <field.TextField label='Full name' placeholder='Jane Cooper' />}
        </form.AppField>

        <form.AppField name='email'>
          {field => <field.TextField label='Email' type='email' placeholder='jane@company.com' />}
        </form.AppField>

        <form.AppField name='role'>
          {field => (
            <field.SelectField label='Role' placeholder='Select a role'>
              <SelectItem value='viewer'>Viewer</SelectItem>
              <SelectItem value='editor'>Editor</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
            </field.SelectField>
          )}
        </form.AppField>

        <form.AppField name='note'>
          {field => (
            <field.TextareaField
              label='Note (optional)'
              placeholder='Add a personal message…'
              description='Shown in the invitation email.'
            />
          )}
        </form.AppField>

        <form.AppField name='agree'>
          {field => (
            <field.CheckboxField label='I confirm this person should have access to our energy data.' />
          )}
        </form.AppField>
      </FieldGroup>

      {submitted ? (
        <p className='mt-4 text-sm font-medium text-success-emphasis'>{submitted}</p>
      ) : null}

      <div className='mt-8 flex justify-end'>
        <form.AppForm>
          <form.SubmitButton>Send invitation</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}

export default FormValidated
