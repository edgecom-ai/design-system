'use client'

import { useId, useState } from 'react'

import { TagsInput } from '@/components/ui/tags-input'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const MAX = 5

const TagsInputEmailsDemo = () => {
  const id = useId()
  const [emails, setEmails] = useState<string[]>(['ops@edgecom.ai'])

  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor={id}>Report recipients</FieldLabel>
      <TagsInput
        inputId={id}
        value={emails}
        onValueChange={setEmails}
        validate={isEmail}
        max={MAX}
        placeholder={emails.length >= MAX ? 'Recipient limit reached' : 'name@company.com'}
      />
      <FieldDescription>
        {emails.length}/{MAX} recipients — paste a comma-separated list, or type one at a time. Invalid addresses are
        rejected.
      </FieldDescription>
    </Field>
  )
}

export default TagsInputEmailsDemo
