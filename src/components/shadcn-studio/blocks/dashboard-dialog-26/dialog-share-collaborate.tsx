'use client'

import { useState, useRef, type ReactElement } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon, ExternalLinkIcon, LinkIcon } from "lucide-react"

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  className?: string
}

const ShareCollaborateDialog = ({ defaultOpen = false, trigger, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const copyToClipboard = async () => {
    const val = inputRef.current?.value ?? ''

    if (!val) return

    try {
      await navigator.clipboard.writeText(val)

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // fallback for older browsers
      const textarea = document.createElement('textarea')

      textarea.value = val
      document.body.appendChild(textarea)
      textarea.select()

      try {
        document.execCommand('copy')

        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} onClick={() => setOpen(true)} />
      <DialogContent className={cn('sm:max-w-145 [&>[data-slot=dialog-close]>svg]:size-5', className)}>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>Share dataTrack™ report</DialogTitle>
          <DialogDescription>
            Invite teammates to view and collaborate on this dataTrack™ energy report. Set permissions to control access
            to consumption, cost, and emissions data.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-base max-sm:text-sm'>Allow collaborators to comment on report data</p>
          <Switch />
        </div>
        <div className='w-full space-y-2'>
          <div className='relative'>
            <Input
              id='copy'
              ref={inputRef}
              type='text'
              placeholder='Report share link'
              defaultValue='https://app.edgecom.ai/reports/datatrack/electricity-2026?share=true'
              className='pr-9'
            />
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckIcon
                />
              ) : (
                <CopyIcon
                />
              )}
              <span className='sr-only'>{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <DialogClose render={<Button variant='outline' className='md:flex-1 md:gap-1' />}>
            <ExternalLinkIcon className='size-4' />
            Preview report
          </DialogClose>
          <Button type='submit' className='md:flex-1 md:gap-1' onClick={copyToClipboard}>
            {copied ? (
              <CheckIcon
              />
            ) : (
              <LinkIcon
              />
            )}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareCollaborateDialog
