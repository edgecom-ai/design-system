import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const SliderMultiThumbDemo = () => {
  return (
    <div className='flex w-full max-w-xs flex-col gap-10'>
      {/* Range Slider Section */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium'>Consumption band (kWh)</Label>
        <Slider defaultValue={[25, 60]} max={100} step={1} />
      </div>

      {/* Multi-Thumb Slider Section */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium'>Demand alert thresholds</Label>
        <Slider defaultValue={[20, 50, 80]} max={100} step={1} />
      </div>
    </div>
  )
}

export default SliderMultiThumbDemo
