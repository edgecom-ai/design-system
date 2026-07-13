import { Label } from '@/components/ui/label'
import type { Option } from '@/components/ui/multi-select'
import MultipleSelector from '@/components/ui/multi-select'

const categories: Option[] = [
  {
    value: 'electricity',
    label: 'Electricity'
  },
  {
    value: 'water',
    label: 'Water'
  },
  {
    value: 'gas',
    label: 'Gas'
  },
  {
    value: 'iaq',
    label: 'IAQ',
    disable: true
  },
  {
    value: 'temperature',
    label: 'Temperature'
  },
  {
    value: 'emissions',
    label: 'Emissions'
  },
  {
    value: 'peak-demand',
    label: 'Peak demand'
  },
  {
    value: 'load',
    label: 'Load'
  },
  {
    value: 'consumption',
    label: 'Consumption'
  },
  {
    value: 'cost',
    label: 'Cost'
  },
  {
    value: 'power-factor',
    label: 'Power factor',
    disable: true
  },
  {
    value: 'baseline',
    label: 'Baseline'
  },
  {
    value: 'savings',
    label: 'Savings'
  },
  {
    value: 'intensity',
    label: 'Energy intensity'
  },
  {
    value: 'thd',
    label: 'THD'
  },
  {
    value: 'demand-response',
    label: 'Demand response'
  }
]

const MultipleSelectWithPlaceholderDemo = () => {
  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label>Multiselect with placeholder and clear</Label>
      <MultipleSelector
        commandProps={{
          label: 'Select commodities'
        }}
        defaultOptions={categories}
        placeholder='Select commodities'
        emptyIndicator={<p className='text-center text-sm'>No results found</p>}
        className='w-full'
      />
    </div>
  )
}

export default MultipleSelectWithPlaceholderDemo
