'use client'

import { useId } from 'react'

import { TagsInput } from '@/components/ui/tags-input'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'

const TagsInputDemo = () => {
  const id = useId()

  return (
    <Field className='w-full max-w-xs'>
      <FieldLabel htmlFor={id}>Tags</FieldLabel>
      <TagsInput inputId={id} defaultValue={['energy', 'monitoring']} placeholder='Add a tag…' />
      <FieldDescription>Press Enter or comma to add a tag, Backspace to remove the last.</FieldDescription>
    </Field>
  )
}

export default TagsInputDemo
