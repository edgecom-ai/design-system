'use client'

import { useState, type ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { formatBytes, useFileUpload, type FileWithPreview } from '@/hooks/use-file-upload'

import { cn } from '@/lib/utils'
import { FileTextIcon, UploadIcon, XIcon, AlertCircleIcon, LinkIcon, CircleHelpIcon } from "lucide-react"

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  className?: string
}

type UploadProgress = {
  fileId: string
  progress: number
  completed: boolean
}

// Simulates file upload with realistic progress reporting and variable timing
const simulateUpload = (totalBytes: number, onProgress: (progress: number) => void, onComplete: () => void) => {
  let timeoutId: NodeJS.Timeout
  let uploadedBytes = 0
  let lastProgressReport = 0

  const simulateChunk = () => {
    const chunkSize = Math.floor(Math.random() * 300000) + 2000

    uploadedBytes = Math.min(totalBytes, uploadedBytes + chunkSize)

    const progressPercent = Math.floor((uploadedBytes / totalBytes) * 100)

    if (progressPercent > lastProgressReport) {
      lastProgressReport = progressPercent
      onProgress(progressPercent)
    }

    if (uploadedBytes < totalBytes) {
      const delay = Math.floor(Math.random() * 450) + 50

      const extraDelay = Math.random() < 0.05 ? 500 : 0

      timeoutId = setTimeout(simulateChunk, delay + extraDelay)
    } else {
      onComplete()
    }
  }

  timeoutId = setTimeout(simulateChunk, 100)

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

// Returns a file icon component for non-image files, or false for image files
const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileName = file.file instanceof File ? file.file.name : file.file.name
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const extension = fileName.split('.').pop()?.toLowerCase()

  const isImage = fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'svg'].includes(extension || '')

  return isImage ? (
    false
  ) : (
    <FileTextIcon className='size-5' />
  )
}

const FileUploadDialog = ({ defaultOpen = false, trigger, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])

  const handleFilesAdded = (addedFiles: FileWithPreview[]) => {
    const newProgressItems = addedFiles.map(file => ({
      fileId: file.id,
      progress: 0,
      completed: false
    }))

    setUploadProgress(prev => [...prev, ...newProgressItems])

    const cleanupFunctions: Array<() => void> = []

    addedFiles.forEach(file => {
      const fileSize = file.file instanceof File ? file.file.size : file.file.size

      const cleanup = simulateUpload(
        fileSize,

        progress => {
          setUploadProgress(prev => prev.map(item => (item.fileId === file.id ? { ...item, progress } : item)))
        },

        () => {
          setUploadProgress(prev => prev.map(item => (item.fileId === file.id ? { ...item, completed: true } : item)))
        }
      )

      cleanupFunctions.push(cleanup)
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }

  const handleFileRemoved = (fileId: string) => {
    setUploadProgress(prev => prev.filter(item => item.fileId !== fileId))
  }

  const maxSizeMB = 5
  const maxSize = maxSizeMB * 1024 * 1024
  const maxFiles = 6

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps }
  ] = useFileUpload({
    maxSize,
    multiple: true,
    maxFiles,
    onFilesAdded: handleFilesAdded
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} onClick={() => setOpen(true)} />
      <DialogContent
        className={cn(
          'flex max-h-[min(650px,80vh)] flex-col gap-0 p-0 sm:max-w-145 [&>[data-slot=dialog-close]>svg]:size-5',
          className
        )}
      >
        <ScrollArea className='flex max-h-full flex-col overflow-hidden'>
          <div className='flex flex-col gap-4 p-6'>
            <DialogHeader>
              <DialogTitle className='text-lg leading-7 font-semibold'>Import energy data</DialogTitle>
            </DialogHeader>

            <div className='flex flex-col gap-4'>
              <div
                role='button'
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || undefined}
                className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-50 flex-col items-center justify-center gap-4 overflow-hidden rounded-sm border border-dashed p-6 text-center has-[input:focus]:ring-[3px]'
              >
                <input {...getInputProps()} className='sr-only' aria-label='Upload meter data file' />
                <UploadIcon className='size-10 stroke-1' />
                <p className='font-medium'>Drag & drop meter data files or choose a file to import</p>
                <p className='text-muted-foreground text-sm'>
                  Interval readings, utility bills or consumption exports (CSV, XLSX) ∙ Max {maxFiles} files ∙ Up to{' '}
                  {maxSizeMB}MB each
                </p>
              </div>

              {files.length > 0 && (
                <div className='flex w-full flex-col gap-3'>
                  <div className='w-full space-y-2'>
                    {files.map(file => {
                      const fileProgress = uploadProgress.find(p => p.fileId === file.id)
                      const isUploading = fileProgress && !fileProgress.completed

                      return (
                        <div
                          key={file.id}
                          data-uploading={isUploading || undefined}
                          className='bg-muted flex flex-col gap-1 rounded-lg p-3 transition-opacity duration-300'
                        >
                          <div className='flex justify-between gap-2'>
                            <div className='flex items-center gap-3 overflow-hidden in-data-[uploading=true]:opacity-50'>
                              <div className='bg-accent aspect-square shrink-0 rounded'>
                                {getFileIcon(file) || (
                                  <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    className='size-10 rounded-[inherit] object-cover'
                                  />
                                )}
                              </div>
                              <div className='flex min-w-0 flex-col gap-0.5 max-sm:max-w-50'>
                                <p className='truncate font-medium'>
                                  {file.file instanceof File ? file.file.name : file.file.name}
                                </p>
                                <p className='text-muted-foreground text-sm'>
                                  {formatBytes(file.file instanceof File ? file.file.size : file.file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant='ghost'
                              className='size-6 hover:bg-transparent'
                              onClick={() => {
                                handleFileRemoved(file.id)
                                removeFile(file.id)
                              }}
                              aria-label='Remove file'
                            >
                              <XIcon aria-hidden='true' />
                            </Button>
                          </div>

                          {fileProgress &&
                            (() => {
                              const progress = fileProgress.progress || 0
                              const completed = fileProgress.completed || false

                              if (completed) return null

                              return (
                                <div className='mt-1 flex flex-col gap-2'>
                                  <span className='text-muted-foreground self-end text-sm'>{progress}%</span>
                                  <div className='bg-primary/10 h-2 w-full overflow-hidden rounded-full'>
                                    <div
                                      className='bg-primary h-full transition-all duration-300 ease-out'
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                </div>
                              )
                            })()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div className='text-destructive flex items-center gap-1 text-xs' role='alert'>
                  <AlertCircleIcon className='size-3 shrink-0' />
                  <span>{errors[0]}</span>
                </div>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <Separator className='flex-1' />
              <span>or</span>
              <Separator className='flex-1' />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='url'>Import from a data source URL</Label>
              <div className='relative'>
                <Input id='url' type='url' placeholder='Paste a meter data or utility bill file URL' />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
                  <LinkIcon className='size-4' />
                  <span className='sr-only'>Data source URL</span>
                </div>
              </div>
            </div>

            <div className='flex flex-row justify-between gap-4'>
              <a href='#' className='flex items-center gap-2'>
                <CircleHelpIcon className='size-4 shrink-0' />
                <span className='text-sm'>dataTrack™ import help</span>
              </a>
              <div className='flex items-center gap-4'>
                <DialogClose render={<Button variant='outline' size='lg' />}>Cancel</DialogClose>
                <Button size='lg'>Import to dataTrack™</Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FileUploadDialog
