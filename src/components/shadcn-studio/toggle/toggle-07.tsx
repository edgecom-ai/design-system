'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { PowerIcon } from "lucide-react"

const ToggleIconPattern = () => {
  const [isPowerOff, setIsPowerOff] = useState(false)

  return (
    <div className='flex items-center justify-center'>
      <Toggle
        variant='outline'
        aria-label='power toggle'
        onClick={() => setIsPowerOff(!isPowerOff)}
        className={cn(
          isPowerOff
            ? 'border-success text-success! hover:bg-success/10 focus-visible:border-success focus-visible:ring-success/20'
            : 'border-destructive text-destructive! hover:bg-destructive/10 focus-visible:border-destructive focus-visible:ring-destructive/20'
        )}
      >
        {isPowerOff ? (
          <PowerIcon
          />
        ) : (
          <PowerIcon
          />
        )}
      </Toggle>
    </div>
  )
}

export default ToggleIconPattern
