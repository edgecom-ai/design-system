import Link from 'next/link'

import { Trash2Icon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

const DangerZone = () => {
  return (
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
      {/* Vertical Tabs List */}
      <div className='flex flex-col space-y-1'>
        <h3 className='font-semibold'>Danger zone</h3>
        <p className='text-muted-foreground text-sm'>
          Manage your energy portal. Contact your Edgecom admin for more information{' '}
          <Link href='#' className='text-card-foreground font-medium hover:underline'>
            Learn more
          </Link>
        </p>
      </div>

      {/* Content */}
      <div className='space-y-6 lg:col-span-2'>
        <Card>
          <CardContent>
            <div className='flex justify-between gap-4 max-lg:flex-col lg:items-center'>
              <div className='space-y-1'>
                <h3 className='text-sm font-medium'>Leave portal</h3>
                <p className='text-muted-foreground text-sm'>
                  Revoke your access to this energy portal. Other members you have added will remain.
                </p>
              </div>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      variant='outline'
                      className='border-destructive! text-destructive! hover:bg-destructive/10! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full'
                    />
                  }
                >
                  <Trash2Icon />
                  Leave
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                  <DialogHeader className='space-y-2'>
                    <DialogTitle>Leave portal</DialogTitle>
                    <div className='text-muted-foreground text-sm'>
                      Revoke your access to this energy portal. Other members you have added will remain.
                    </div>
                  </DialogHeader>
                  <div className='flex flex-col-reverse gap-4 sm:flex-row sm:justify-end'>
                    <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
                    <DialogClose render={<Button variant='destructive' />}>Leave</DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <Card className='cursor-not-allowed opacity-60'>
          <CardContent>
            <div className='flex justify-between gap-4 max-lg:flex-col lg:items-center'>
              <div className='space-y-1'>
                <h3 className='text-sm font-medium'>Delete portal</h3>
                <p className='text-muted-foreground text-sm'>
                  Delete your energy portal permanently. This will remove all sites, meters, and data and cannot be
                  undone.
                </p>
              </div>
              <Button
                variant='outline'
                className='hover:bg-destructive/10! text-destructive! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 max-lg:w-full'
                disabled
              >
                <Trash2Icon />
                Delete portal
              </Button>
            </div>
            <Separator className='my-4' />
            <p className='text-muted-foreground text-sm'>
              You cannot delete the portal because you are not the Edgecom admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DangerZone
