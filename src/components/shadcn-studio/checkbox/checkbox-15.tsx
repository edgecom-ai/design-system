'use client'

import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const items = ['Peak alerts', 'DR events', 'Bill anomalies']

const CheckboxTreeDemo = () => {
  const [selected, setSelected] = useState<string[]>(['Peak alerts', 'DR events'])

  // Derive the parent state from the children during render — no effect needed.
  const checked = selected.length === items.length
  const indeterminate = selected.length > 0 && selected.length < items.length

  const handleCheckedChange = (checked: boolean) => {
    setSelected(checked ? [...items] : [])
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Checkbox id='parent' checked={checked} indeterminate={indeterminate} onCheckedChange={handleCheckedChange} />
        <Label htmlFor='parent'>All notifications</Label>
      </div>
      <div className='flex flex-col gap-2 pl-6'>
        {items.map(label => (
          <div key={label} className='flex items-center gap-2'>
            <Checkbox
              id={label}
              checked={selected.includes(label)}
              onCheckedChange={checked =>
                setSelected(checked ? [...selected, label] : selected.filter(item => item !== label))
              }
            />
            <Label htmlFor={label}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckboxTreeDemo
