import { useId } from 'react'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const ontario = [
  { label: 'HQ – Bay Street', value: '1' },
  { label: 'Toronto Distribution Center', value: '2' },
  { label: 'Warehouse B', value: '3' }
]

const alberta = [
  { label: 'Calgary Plant 2', value: '4' },
  { label: 'Edmonton Chiller Plant', value: '5' },
  { label: 'Red Deer Data Center', value: '6' }
]

const quebec = [
  { label: 'Montreal Main Building', value: '7' },
  { label: 'Laval Substation', value: '8' },
  { label: 'Quebec City Depot', value: '9' }
]

const items = [{ label: 'Select site', value: null }, ...ontario, ...alberta, ...quebec]

const SelectWithOptionsGroupsDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Site</Label>
      <Select items={items} defaultValue='7'>
        <SelectTrigger id={id} className='w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ontario</SelectLabel>
            {ontario.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Alberta</SelectLabel>
            {alberta.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Quebec</SelectLabel>
            {quebec.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectWithOptionsGroupsDemo
