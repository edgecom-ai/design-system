'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { LoaderCircleIcon } from "lucide-react"

const ButtonPromiseDemo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<undefined | string>(undefined)

  const handleClick = async () => {
    setIsLoading(true)
    setStatus(undefined)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStatus(Math.random() > 0.5 ? 'Scheduled!' : 'Failed!')
    } catch (error) {
      setStatus('Failed!')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant='link'
      onClick={handleClick}
      disabled={isLoading}
      className={cn('cursor-pointer hover:no-underline', {
        'text-success': status === 'Scheduled!',
        'text-destructive': status === 'Failed!'
      })}
    >
      {isLoading ? (
        <>
          <LoaderCircleIcon className='animate-spin' />
          Loading
        </>
      ) : status ? (
        status
      ) : (
        'Schedule DR'
      )}
    </Button>
  )
}

export default ButtonPromiseDemo
