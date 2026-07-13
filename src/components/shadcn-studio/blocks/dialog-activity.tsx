import type { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ImageIcon } from "lucide-react"

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
}

const ActivityDialog = ({ defaultOpen = false, trigger }: Props) => {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={trigger} />
      <SheetContent className='gap-0 sm:data-[side=right]:max-w-md [&>button]:top-2 [&>button>svg]:size-5'>
        <SheetHeader className='border-b py-2.25'>
          <SheetTitle className='text-lg leading-6'>Activity</SheetTitle>
          <SheetDescription hidden />
        </SheetHeader>

        <div className='overflow-y-auto'>
          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className='flex w-full flex-col items-start gap-2.5'>
              <div className='text-muted-foreground flex flex-col items-start text-sm'>
                <p>
                  <span className='text-foreground font-semibold'>Joe Lincoln</span> mentioned you on the Toronto DC peak alert
                </p>
                <p>18 mins ago</p>
              </div>
              <div className='bg-muted flex flex-col gap-4 rounded-md border px-4 py-2.5'>
                <p className='text-sm font-medium'>
                  Demand hit 480 kW at 4:15 PM — can you confirm the load-shed before the next DR window?
                </p>
                <InputGroup className='bg-card'>
                  <InputGroupInput placeholder='Reply' />
                  <InputGroupAddon align='inline-end'>
                    <ImageIcon className='text-muted-foreground size-4' />
                    <span className='sr-only'>Email</span>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>

          <Separator />

          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png' />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className='flex w-full flex-col items-start gap-2.5'>
              <div className='text-muted-foreground flex flex-col items-start text-sm'>
                <p>
                  <span className='text-foreground font-semibold'>Jane Perez</span> shared a utility bill for review
                </p>
                <p>39 mins ago</p>
              </div>
              <div className='bg-muted flex items-center gap-1 rounded-md px-1.5 py-1'>
                <img
                  src='https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-14.png'
                  alt='utility-bill.pdf'
                  className='h-5'
                />
                <span className='text-sm font-medium'>utility-bill.pdf</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png' />
              <AvatarFallback>TH</AvatarFallback>
            </Avatar>
            <div className='flex w-full flex-col items-start gap-2.5'>
              <div className='text-muted-foreground flex flex-col items-start text-sm'>
                <p>
                  <span className='text-foreground font-semibold'>Tyler Hero</span> wants to view your energy report
                </p>
                <p>1 hour ago</p>
              </div>
              <div className='bg-muted flex w-full items-center gap-4 rounded-md border px-4 py-2.5'>
                <img
                  src='https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/dashboard-dialog/image-13.png'
                  alt='Q1-consumption-report.xlsx'
                  className='size-8 rounded-sm'
                />
                <span className='text-sm font-medium'>Q1-consumption-report.xlsx</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <div className='text-muted-foreground flex flex-col items-start text-sm'>
              <p>
                <span className='text-foreground font-semibold'>Denial</span> invites you to review the new baseline model
              </p>
              <p>3 hours ago</p>
            </div>
          </div>

          <Separator />

          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png' />
              <AvatarFallback>LA</AvatarFallback>
            </Avatar>
            <div className='flex w-full flex-col items-start gap-2.5'>
              <div className='text-muted-foreground flex flex-col items-start text-sm'>
                <p>
                  <span className='text-foreground font-semibold'>Leslie Alexander</span> added tags to Warehouse B alarm
                </p>
                <p>8 hours ago</p>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <Badge className='bg-primary/10 text-primary rounded-sm font-normal'>Electricity</Badge>
                <Badge className='rounded-sm bg-info/10 font-normal text-info'>
                  Anomaly
                </Badge>
                <Badge className='rounded-sm bg-warning/10 font-normal text-warning-emphasis dark:text-warning'>
                  Threshold
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className='flex gap-4 px-4 py-3'>
            <Avatar>
              <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png' />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className='text-muted-foreground flex flex-col items-start text-sm'>
              <p>
                <span className='text-foreground font-semibold'>Miya</span> invites you to review a meter reading
              </p>
              <p>10 hours ago</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ActivityDialog
