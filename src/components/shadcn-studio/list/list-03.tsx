import { Separator } from '@/components/ui/separator'

const ItemsList = () => {
  return (
    <div className='w-full max-w-sm space-y-2'>
      <dl className='flex items-center justify-between'>
        <dt>Consumption</dt>
        <dd className='text-muted-foreground'>12,480 kWh</dd>
      </dl>
      <Separator />
      <dl className='flex items-center justify-between'>
        <dt>Peak Demand</dt>
        <dd className='text-muted-foreground'>480 kW</dd>
      </dl>
      <Separator />
      <dl className='flex items-center justify-between'>
        <dt>Emissions</dt>
        <dd className='text-muted-foreground'>3.2 tCO₂e</dd>
      </dl>
    </div>
  )
}

export default ItemsList
