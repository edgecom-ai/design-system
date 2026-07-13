import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const CheckboxCardDemo = () => {
  return (
    <div className='space-y-2'>
      <Label className='hover:bg-accent/50 flex items-start gap-2 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-primary/5 dark:has-aria-checked:border-primary dark:has-aria-checked:bg-primary/10'>
        <Checkbox defaultChecked />
        <div className='grid gap-1.5 font-normal'>
          <p className='text-sm leading-none font-medium'>Email peak alerts</p>
          <p className='text-muted-foreground text-sm'>Notify me when peak demand is exceeded.</p>
        </div>
      </Label>
      <Label className='hover:bg-accent/50 flex items-start gap-2 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-primary/5 dark:has-aria-checked:border-primary dark:has-aria-checked:bg-primary/10'>
        <Checkbox />
        <div className='grid gap-1.5 font-normal'>
          <p className='text-sm leading-none font-medium'>Auto-export monthly report</p>
          <p className='text-muted-foreground text-sm'>Send the report to my inbox each month</p>
        </div>
      </Label>
    </div>
  )
}

export default CheckboxCardDemo
