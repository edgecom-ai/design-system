'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UploadIcon, XIcon } from "lucide-react"

const AlertFileUploadDemo = () => {
  const [isActive, setIsActive] = useState(true)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isActive) return null

  return (
    <Alert>
      <UploadIcon
      />
      <AlertTitle>Generating your &apos;Q2-Emissions-Report.pdf&apos;</AlertTitle>
      <AlertDescription>
        <p className='mb-2!'>Please wait while we compile your emissions report.</p>
        <Progress
          value={progress}
          className='**:data-[slot=progress-indicator]:bg-info *:data-[slot=progress-track]:h-1.5 *:data-[slot=progress-track]:bg-info/20'
          aria-label='Upload Progress'
        />
        <div className='mt-2 flex items-center gap-3'>
          <Button variant='ghost' size='sm' className='cursor-pointer'>
            Cancel
          </Button>
          <Button
            variant='ghost'
            size='sm'
            disabled
            className='cursor-pointer text-info hover:bg-info/10 hover:text-info'
          >
            Generate another
          </Button>
        </div>
      </AlertDescription>
      <AlertAction>
        <button className='cursor-pointer' onClick={() => setIsActive(false)}>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </button>
      </AlertAction>
    </Alert>
  )
}

export default AlertFileUploadDemo
