'use client'

import { useEffect, useId, useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { SearchIcon, LoaderCircleIcon } from "lucide-react"

const InputSearchLoaderDemo = () => {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const id = useId()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value

    setValue(nextValue)
    setIsLoading(Boolean(nextValue))
  }

  useEffect(() => {
    if (!value) {
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Label htmlFor={id}>Search</Label>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className='size-4' />
          <span className='sr-only'>Search</span>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type='search'
          placeholder='Search sites, meters, reports…'
          value={value}
          onChange={handleChange}
          className='[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
        />
        <InputGroupAddon align='inline-end' className='text-muted-foreground pointer-events-none'>
          {isLoading && (
            <>
              <LoaderCircleIcon className='size-4 animate-spin' />
              <span className='sr-only'>Loading...</span>
            </>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default InputSearchLoaderDemo
