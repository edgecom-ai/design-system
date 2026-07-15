import type { ReactElement } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { SettingsIcon, XIcon, LinkIcon } from "lucide-react"

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const NotificationDropdown = ({ trigger, defaultOpen, align = 'end' }: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent className='w-full max-w-xs sm:max-w-122' align={align || 'end'}>
        <Tabs defaultValue='inbox' className='gap-0'>
          <DropdownMenuGroup>
            <DropdownMenuLabel className='flex flex-col pb-0'>
              <div className='flex items-center justify-between gap-6 pb-2.5'>
                <span className='text-muted-foreground text-sm font-normal uppercase'>Notifications</span>
                <Badge variant='secondary' className='bg-primary/10 text-primary font-normal'>
                  8 New
                </Badge>
              </div>
              <div className='-mb-0.5 flex items-center justify-between gap-4'>
                <TabsList variant='line'>
                  <TabsTrigger value='inbox' className='group-data-[orientation=horizontal]/tabs:after:-bottom-1'>
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value='general' className='group-data-[orientation=horizontal]/tabs:after:-bottom-1'>
                    General
                  </TabsTrigger>
                </TabsList>
                <a href='#'>
                  <SettingsIcon className='text-foreground size-5' />
                </a>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className='mt-0 h-0.5' />

          <TabsContent value='inbox'>
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-19.png' />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Peak demand alert — Toronto Distribution Center</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>12 Minutes ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>480 kW</span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png' />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Meter offline — Calgary Plant 2</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>27 Minutes ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>No data for 30 min</span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png' />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>DR event starts in 30 min — confirm participation</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>2 hours ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>IESO Ontario program</span>
                </div>
                <div className='mt-3 flex items-center gap-4'>
                  <Button variant='secondary' size='sm'>
                    Decline
                  </Button>
                  <Button className='text-primary-foreground!' size='sm'>
                    Accept
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png' />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Bill anomaly detected — HQ Bay Street</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>6 hours ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>+18% vs baseline</span>
                </div>
                <div className='mt-3 flex items-center gap-1.5'>
                  <LinkIcon className='text-foreground' />
                  <span className='text-sm'>View bill report</span>
                </div>
              </div>
            </DropdownMenuItem>
          </TabsContent>

          <TabsContent value='general'>
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png' />
                <AvatarFallback>FC</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Threshold exceeded on Main Building</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>39 Minutes ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>Gas usage</span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png' />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Monthly M&V report ready</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>3 hours ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>Reports</span>
                </div>
                <div className='mt-3 flex items-center gap-1.5'>
                  <LinkIcon className='text-foreground' />
                  <span className='text-sm'>Open report</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png' />
                <AvatarFallback>HL</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>Emissions target on track — Q1</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>5 hours ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>3.2 tCO₂e saved</span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <XIcon className='text-foreground size-3.5' />
                <div className='bg-primary size-1.5 rounded-full' />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='items-start gap-3 px-2 py-3 text-base not-data-[variant=destructive]:focus:**:text-[revert-rule]'>
              <Avatar className='size-9.5'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png' />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
              <div className='flex w-full flex-col items-start'>
                <span className='text-base font-medium'>New DR program invitation — AESO Alberta</span>
                <div className='flex items-center gap-2.5'>
                  <span className='text-muted-foreground text-sm'>8 hours ago</span>
                  <div className='bg-primary/30 size-1.5 rounded-full' />
                  <span className='text-muted-foreground text-sm'>Enrollment request</span>
                </div>
                <div className='mt-3 flex items-center gap-4'>
                  <Button variant='secondary' size='sm'>
                    Decline
                  </Button>
                  <Button className='text-primary-foreground!' size='sm'>
                    Accept
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
