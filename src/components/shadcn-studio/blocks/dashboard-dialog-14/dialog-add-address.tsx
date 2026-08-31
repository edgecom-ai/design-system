'use client'

import { useState, type ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import { cn } from '@/lib/utils'
import { HouseIcon, BuildingIcon } from "lucide-react"

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  className?: string
}

const regions = [
  {
    value: null,
    label: 'Select market / region'
  },
  {
    value: 'region-east',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/india.png'
            alt={`East region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>East</span>
        </span>
      </>
    )
  },
  {
    value: 'region-west',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/china.png'
            alt={`West region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>West</span>
        </span>
      </>
    )
  },
  {
    value: 'region-coastal',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/monaco.png'
            alt={`Coastal region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Coastal</span>
        </span>
      </>
    )
  },
  {
    value: 'region-central',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/serbia.png'
            alt={`Central region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Central</span>
        </span>
      </>
    )
  },
  {
    value: 'region-inland',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/romania.png'
            alt={`Inland region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Inland</span>
        </span>
      </>
    )
  },
  {
    value: 'region-north',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/mayotte.png'
            alt={`North region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>North</span>
        </span>
      </>
    )
  },
  {
    value: 'region-south',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/iraq.png'
            alt={`South region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>South</span>
        </span>
      </>
    )
  },
  {
    value: 'region-southeast',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/syria.png'
            alt={`Southeast region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Southeast</span>
        </span>
      </>
    )
  },
  {
    value: 'region-northeast',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/korea.png'
            alt={`Northeast region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Northeast</span>
        </span>
      </>
    )
  },
  {
    value: 'region-metro',
    label: (
      <>
        <span className='flex items-center gap-2'>
          <img
            src='https://cdn.shadcnstudio.com/ss-assets/flags/zimbabwe.png'
            alt={`Metro region`}
            className='h-4 w-5 shrink-0'
          />
          <span className='truncate'>Metro</span>
        </span>
      </>
    )
  }
]

const AddAddressDialog = ({ defaultOpen = false, trigger, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} onClick={() => setOpen(true)} />
      <DialogContent
        className={cn(
          'flex flex-col gap-0 p-0 max-sm:max-h-[min(650px,80vh)] sm:max-w-145 [&>[data-slot=dialog-close]>svg]:size-5',
          className
        )}
      >
        <ScrollArea className='flex max-h-full flex-col overflow-hidden'>
          <div className='flex flex-col gap-4 p-6'>
            <DialogHeader className='items-center'>
              <DialogTitle className='text-lg leading-7 font-semibold'>Add site</DialogTitle>
              <DialogDescription>Register a new site to track energy in dataTrack™</DialogDescription>
            </DialogHeader>

            <div className='grid gap-x-6 gap-y-4 md:grid-cols-2'>
              <RadioGroup className='gap-6 sm:grid-cols-2 md:col-span-2' defaultValue='commercial'>
                <div className='border-input has-data-checked:border-primary/50 relative flex w-full flex-col items-center gap-4 rounded-md border p-3 outline-none'>
                  <RadioGroupItem value='commercial' id='home-address' className='order-1' aria-label='site-type-commercial' />
                  <HouseIcon className='size-8 stroke-1' />
                  <div className='flex grow flex-col items-center gap-2 text-center'>
                    <Label htmlFor='home-address' className='text-base after:absolute after:inset-0'>
                      Commercial
                    </Label>
                    <p className='text-muted-foreground text-sm'>Offices, retail & mixed-use</p>
                  </div>
                </div>
                <div className='border-input has-data-checked:border-primary/50 relative flex w-full flex-col items-center gap-4 rounded-md border p-3 outline-none'>
                  <RadioGroupItem value='industrial' id='office-address' className='order-1' aria-label='site-type-industrial' />
                  <BuildingIcon className='size-8 stroke-1' />
                  <div className='flex grow flex-col items-center gap-2 text-center'>
                    <Label htmlFor='office-address' className='text-base after:absolute after:inset-0'>
                      Industrial
                    </Label>
                    <p className='text-muted-foreground text-sm'>Plants, warehouses & facilities</p>
                  </div>
                </div>
              </RadioGroup>

              <div className='space-y-2'>
                <Label htmlFor='first-name'>Site name</Label>
                <Input id='first-name' type='text' placeholder='Downtown Plant' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='last-name'>Site ID</Label>
                <Input id='last-name' type='text' placeholder='SITE-001' />
              </div>

              <div className='flex flex-col gap-2 md:col-span-2'>
                <Label htmlFor='market-region'>Market / region</Label>
                <Select items={regions}>
                  <SelectTrigger id='market-region' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='max-h-100 p-1'>
                    {regions.slice(1).map(region => (
                      <SelectItem key={region.value} value={region.value} className='*:items-center'>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address-line-1'>Street address</Label>
                <Input id='address-line-1' type='text' placeholder='123 Industrial Ave' />
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='address-line-2'>Unit / building</Label>
                <Input id='address-line-2' type='text' placeholder='Building B' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='landmark'>Meter ID</Label>
                <Input id='landmark' type='text' placeholder='MTR-4521' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='city'>City</Label>
                <Input id='city' type='text' placeholder='Toronto' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='state'>Utility provider</Label>
                <Input id='state' type='text' placeholder='North Grid Utility' />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='zip-code'>Postal code</Label>
                <Input id='zip-code' type='number' placeholder='90001' />
              </div>

              <div className='flex items-center gap-2'>
                <Switch id='billing-address' />
                <Label htmlFor='billing-address'>Enable pTrack® peak tracking?</Label>
              </div>
            </div>

            <div className='flex justify-end gap-4 sm:flex-row'>
              <Button size='lg'>Add site</Button>
              <DialogClose render={<Button size='lg' className='bg-primary/10 text-primary hover:bg-primary/20' />}>
                Cancel
              </DialogClose>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default AddAddressDialog
