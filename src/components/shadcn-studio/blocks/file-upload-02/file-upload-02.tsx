'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { formatBytes, useFileUpload, type FileWithPreview } from '@/hooks/use-file-upload'
import { FileTextIcon, UploadIcon, XIcon, AlertCircleIcon } from "lucide-react"

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

const users = [
  {
    id: null,
    name: 'Select energy manager'
  },
  {
    id: '1',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png',
    fallback: 'PS',
    name: 'Priya Sharma'
  },
  {
    id: '2',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png',
    fallback: 'ML',
    name: 'Marcus Lee'
  },
  {
    id: '3',
    src: 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png',
    fallback: 'TC',
    name: 'Tiana Curtis'
  }
]

function FileUpload() {
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
    <Card className='w-full max-w-lg'>
      <CardHeader>
        <CardTitle className='font-semibold'>Create a new site</CardTitle>
        <CardDescription>Drag and drop meter data files to set up a new site.</CardDescription>
      </CardHeader>
      <CardContent className='flex justify-between gap-2'>
        <div className='w-full max-w-xs space-y-2'>
          <Label htmlFor='studio-name'>Site Name</Label>
          <Input id='studio-name' type='text' className='max-sm:placeholder:text-sm' placeholder='Toronto Distribution Center' />
        </div>
        <div className='w-full max-w-xs space-y-2'>
          <Label htmlFor='user-select'>Site Manager</Label>
          <Select items={users.map(u => ({ label: u.name, value: u.id }))} defaultValue='1'>
            <SelectTrigger id='user-select' className='mb-0 w-full pl-2'>
              <SelectValue>
                {(value: string) => {
                  const user = users.find(u => u.id === value)

                  return user && user.src ? (
                    <span className='flex items-center gap-1.5'>
                      <Avatar className='size-5'>
                        <AvatarImage src={user.src} alt={user.name} className='rounded-full' />
                        <AvatarFallback className='text-xs'>{user.fallback}</AvatarFallback>
                      </Avatar>
                      <span className='truncate'>{user.name}</span>
                    </span>
                  ) : null
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='pl-1.5'>Select manager</SelectLabel>
                {users.slice(1).map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    <Avatar className='size-5'>
                      <AvatarImage src={item.src} alt={item.name} className='rounded-full' />
                      <AvatarFallback className='text-xs'>{item.fallback}</AvatarFallback>
                    </Avatar>
                    <span className='truncate'>{item.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardContent className='flex flex-col gap-4'>
        <div
          role='button'
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          data-files={files.length > 0 || undefined}
          className='border-input has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 flex min-h-50 flex-col items-center justify-center gap-4 overflow-hidden rounded-sm border border-dashed p-6 text-center has-[input:focus]:ring-[3px]'
        >
          <input {...getInputProps()} className='sr-only' aria-label='Upload image file' />
          <UploadIcon className='size-10 stroke-1' />
          <p className='font-medium'>Drag & Drop or Choose file to upload</p>
          <p className='text-muted-foreground text-sm'>
            Max {maxFiles} files ∙ Up to {maxSizeMB}MB
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
      </CardContent>
      <CardContent className='flex justify-end gap-2 max-sm:justify-center'>
        <Button className='max-sm:flex-1' variant='outline'>
          Cancel
        </Button>
        <Button className='max-sm:flex-1' type='submit'>
          Upload
        </Button>
      </CardContent>
    </Card>
  )
}

export default FileUpload
