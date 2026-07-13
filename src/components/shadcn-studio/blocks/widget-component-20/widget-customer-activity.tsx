import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import CustomerActivityDialog from './dialog-customer-activity'
import { EllipsisVerticalIcon } from "lucide-react"

const listItems = ['Export', 'Filter', 'Refresh']

export type Stats = {
  className: string
  label: string
  value: string
  change: number
  changeType: string
}

type Props = {
  title: string
  activeCustomers: number
  churnedCustomers: number
  progressValue: number
  className?: string
}

const customerData = [
  {
    id: 4821,
    name: 'Toronto Distribution Center',
    lastSeen: '20/02/2026 14:32'
  },
  {
    id: 3047,
    name: 'Calgary Plant 2',
    lastSeen: '20/02/2026 11:15'
  },
  {
    id: 5193,
    name: 'HQ – Bay Street',
    lastSeen: '19/02/2026 22:48'
  },
  {
    id: 2876,
    name: 'Warehouse B',
    lastSeen: '19/02/2026 18:03'
  },
  {
    id: 6614,
    name: 'Chiller Plant',
    lastSeen: '19/02/2026 15:21'
  },
  {
    id: 7732,
    name: 'Data Center East',
    lastSeen: '18/02/2026 20:57'
  },
  {
    id: 1109,
    name: 'Main Building',
    lastSeen: '18/02/2026 09:34'
  },
  {
    id: 9023,
    name: 'Edmonton Substation',
    lastSeen: '17/02/2026 23:11'
  },
  {
    id: 3358,
    name: 'Ottawa Office',
    lastSeen: '17/02/2026 16:44'
  },
  {
    id: 8145,
    name: 'Montreal Cold Storage',
    lastSeen: '16/02/2026 13:02'
  },
  {
    id: 2201,
    name: 'Hamilton Steel Mill',
    lastSeen: '16/02/2026 10:28'
  },
  {
    id: 5567,
    name: 'Winnipeg Depot',
    lastSeen: '15/02/2026 19:55'
  },
  {
    id: 4490,
    name: 'Vancouver Port Terminal',
    lastSeen: '15/02/2026 08:17'
  },
  {
    id: 7781,
    name: 'Halifax Water Plant',
    lastSeen: '14/02/2026 21:33'
  },
  {
    id: 3312,
    name: 'London Assembly Plant',
    lastSeen: '14/02/2026 11:50'
  },
  {
    id: 6698,
    name: 'Regina Grain Elevator',
    lastSeen: '13/02/2026 17:06'
  },
  {
    id: 1023,
    name: 'Quebec City Depot',
    lastSeen: '13/02/2026 09:41'
  },
  {
    id: 8874,
    name: 'Saskatoon Warehouse',
    lastSeen: '12/02/2026 22:14'
  },
  {
    id: 2539,
    name: 'Kitchener Data Hall',
    lastSeen: '12/02/2026 14:29'
  },
  {
    id: 7405,
    name: 'Windsor Auto Plant',
    lastSeen: '11/02/2026 18:53'
  },
  {
    id: 4167,
    name: 'Mississauga Logistics',
    lastSeen: '11/02/2026 07:37'
  },
  {
    id: 5981,
    name: 'Burnaby Campus',
    lastSeen: '10/02/2026 20:02'
  },
  {
    id: 3744,
    name: 'Red Deer Refinery',
    lastSeen: '10/02/2026 12:44'
  },
  {
    id: 8260,
    name: 'Guelph Manufacturing',
    lastSeen: '09/02/2026 16:18'
  },
  {
    id: 1655,
    name: 'Laval Distribution',
    lastSeen: '09/02/2026 09:05'
  },
  {
    id: 6037,
    name: 'Brampton Depot',
    lastSeen: '08/02/2026 21:30'
  },
  {
    id: 2918,
    name: 'Markham Office Tower',
    lastSeen: '08/02/2026 14:47'
  }
]

const CustomerActivityCard = ({ title, activeCustomers, churnedCustomers, progressValue, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader className='flex items-center justify-between'>
        <span className='text-lg font-semibold'>{title}</span>
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
      <CardContent className='flex flex-1 flex-col justify-between gap-4'>
        <div className='space-y-3'>
          <Progress value={progressValue} className='**:data-[slot=progress-track]:h-2' />
          <div className='flex justify-between'>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-1'>
                <span className='bg-primary size-3 rounded-xs' />
                <span className='text-sm font-medium'>Online</span>
              </div>
              <div>
                <span className='font-semibold'>{activeCustomers}</span>
                <span className='text-muted-foreground'> ({progressValue}%)</span>
              </div>
            </div>
            <div className='flex flex-col items-end gap-0.5'>
              <div className='flex items-center justify-end gap-1'>
                <span className='bg-primary/20 size-3 rounded-xs' />
                <span className='text-sm font-medium'>Offline</span>
              </div>
              <div>
                <span className='font-semibold'>{churnedCustomers}</span>
                <span className='text-muted-foreground'> ({100 - progressValue}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className='relative'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='text-muted-foreground uppercase' colSpan={2}>
                  Site
                </TableHead>
                <TableHead className='text-muted-foreground text-right uppercase'>Last reading</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.slice(0, 5).map(customer => (
                <TableRow key={customer.id}>
                  <TableCell colSpan={2} className='font-medium'>
                    {customer.name}
                  </TableCell>
                  <TableCell className='text-right'>{customer.lastSeen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='from-card absolute bottom-0 z-1 h-30 w-full bg-linear-to-t from-25% to-transparent' />
          <CustomerActivityDialog
            customerData={customerData}
            trigger={<Button variant='outline'>See More</Button>}
            className='absolute bottom-0 left-1/2 z-2 -translate-x-1/2'
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default CustomerActivityCard
