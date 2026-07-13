'use client'

import { useId } from 'react'

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList
} from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'

const items = [
  {
    value: 'Commodities',
    items: ['Electricity', 'Water', 'Gas']
  },
  {
    value: 'Sites',
    items: ['Main Building', 'Warehouse B', 'Chiller Plant']
  },
  {
    value: 'Reports',
    items: ['Consumption', 'Cost Savings', 'Emissions']
  }
]

const ComboboxOptionGroupDemo = () => {
  const id = useId()

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Combobox option group</Label>
      <Combobox id={id} items={items}>
        <ComboboxInput placeholder='Select a data source' />
        <ComboboxContent>
          <ComboboxEmpty>No data sources found.</ComboboxEmpty>
          <ComboboxList>
            {group => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {item => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export default ComboboxOptionGroupDemo
