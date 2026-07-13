'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from '@/components/ui/combobox'

const frameworks = ['Electricity', 'Water', 'Gas', 'IAQ', 'Temperature'] as const

const ComboboxDemo = () => {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder='Select a commodity' />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {item => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default ComboboxDemo
