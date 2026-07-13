import { Button } from '@/components/ui/button'

import type { StepperType } from '@/components/shadcn-studio/blocks/form-layout-09/form-layout-09'

const WelcomeStep = ({ stepper, onReset }: { stepper: StepperType; onReset: () => void }) => {
  const handleReset = () => {
    onReset()
    stepper.reset()
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-start'>
        <h2 className='text-2xl font-semibold'>Welcome to Edgecom Energy! 🎉</h2>
        <p className='text-muted-foreground'>
          Your energy portal has been successfully created. Check your email for next steps on connecting your sites.
        </p>
      </div>
      <div className='flex justify-end'>
        <Button size='lg' onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export default WelcomeStep
