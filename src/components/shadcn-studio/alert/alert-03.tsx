'use client'

import { useState } from 'react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlertIcon, XIcon } from "lucide-react"

const AlertClosableDemo = () => {
  const [isActive, setIsActive] = useState(true)

  if (!isActive) return null

  return (
    <Alert>
      <CircleAlertIcon
      />
      <AlertTitle>Peak demand alert</AlertTitle>
      <AlertDescription>3 sites are approaching their demand threshold. Tap to review.</AlertDescription>
      <AlertAction>
        <button className='cursor-pointer' onClick={() => setIsActive(false)}>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </button>
      </AlertAction>
    </Alert>
  )
}

export default AlertClosableDemo
