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

const east = [
  { label: 'HQ – Main Campus', value: '1' },
  { label: 'Distribution Center', value: '2' },
  { label: 'Warehouse B', value: '3' }
]

const west = [
  { label: 'Plant 2', value: '4' },
  { label: 'Chiller Plant', value: '5' },
  { label: 'Data Center West', value: '6' }
]

const central = [
  { label: 'Main Building', value: '7' },
  { label: 'Substation B', value: '8' },
  { label: 'Depot A', value: '9' }
]

const items = [{ label: 'Select site', value: null }, ...east, ...west, ...central]

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
            <SelectLabel>East</SelectLabel>
            {east.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>West</SelectLabel>
            {west.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Central</SelectLabel>
            {central.map(item => (
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
