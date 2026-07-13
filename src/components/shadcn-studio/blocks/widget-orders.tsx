import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine
} from '@/components/ui/timeline'
import { EllipsisVerticalIcon, UserCheckIcon, MapPinIcon } from "lucide-react"

const listItems = ['Share', 'Update', 'Refresh']

const tabs = [
  {
    name: 'New',
    value: 'new',
    content: [
      {
        sender: 'DR Event #418',
        senderContent: 'Toronto Distribution Center, ON — 480 kW target',
        receiver: 'IESO Ontario',
        receiverContent: 'Curtailment window 4:00 PM – 7:00 PM'
      },
      {
        sender: 'DR Event #421',
        senderContent: 'Calgary Plant 2, AB — 320 kW target',
        receiver: 'AESO Alberta',
        receiverContent: 'Curtailment window 5:00 PM – 8:00 PM'
      }
    ]
  },
  {
    name: 'Pending',
    value: 'pending',
    content: [
      {
        sender: 'DR Event #402',
        senderContent: 'Dispatch notice sent to site operator',
        receiver: 'Warehouse B',
        receiverContent: 'Awaiting load-shed confirmation'
      },
      {
        sender: 'DR Event #405',
        senderContent: 'Dispatch notice sent to site operator',
        receiver: 'HQ – Bay Street',
        receiverContent: 'Load shed confirmed today at 12:30 PM'
      }
    ]
  },
  {
    name: 'Active',
    value: 'shipping',
    content: [
      {
        sender: 'DR Event #398',
        senderContent: 'Starts in 2 days from now (July 13, 2025)',
        receiver: 'Chiller Plant',
        receiverContent: '412 kW curtailed of 480 kW target'
      },
      {
        sender: 'DR Event #396',
        senderContent: 'July 11, 2025 (Settled at 12:30 PM)',
        receiver: 'Data Center East',
        receiverContent: 'July 11, 2025 (Settled at 12:30 PM)'
      }
    ]
  }
]

const OrdersCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>DR Events</span>
          <span className='text-muted-foreground text-sm'>75 Dispatches in progress</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
          >
            <EllipsisVerticalIcon
            />
            <span className='sr-only'>Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              {listItems.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <Tabs defaultValue='new' className='gap-4'>
        <TabsList variant='line' className='w-full gap-0 rounded-none border-b p-0'>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='border-0 group-data-horizontal/tabs:after:-bottom-[0.5px]'
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className='flex flex-col gap-4'>
            {tab.content?.map((item, index) => (
              <div key={index} className='flex flex-col gap-4 pr-6 pl-2'>
                <Timeline>
                  <TimelineItem status='done' className='gap-x-4'>
                    <TimelineDot status='custom' className='mb-1.25'>
                      <UserCheckIcon className='text-primary size-4' />
                    </TimelineDot>
                    <TimelineLine className='bg-[repeating-linear-gradient(0deg,var(--border),var(--border)_5px,var(--card)_6px,var(--card)_10px)]' />
                    <TimelineHeading className='text-sm font-normal'>Event</TimelineHeading>
                    <TimelineContent className='flex flex-col gap-0.5 pb-2'>
                      <span className='text-base font-medium'>{item.sender}</span>
                      <span className='text-muted-foreground text-sm'>{item.senderContent}</span>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem status='done' className='mt-2 gap-x-4'>
                    <TimelineDot status='custom'>
                      <MapPinIcon className='text-primary size-4' />
                    </TimelineDot>
                    <TimelineHeading className='text-sm font-normal'>Site</TimelineHeading>
                    <TimelineContent className='mt-0.5 flex flex-col gap-0.5 pb-0'>
                      <span className='text-base font-medium'>{item.receiver}</span>
                      <span className='text-muted-foreground text-sm'>{item.receiverContent}</span>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
                {index !== tab.content.length - 1 && (
                  <div className='pl-4'>
                    <Separator />
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

export default OrdersCard
