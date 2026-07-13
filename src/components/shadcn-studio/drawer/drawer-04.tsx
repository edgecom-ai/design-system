import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DRAWER_SIDES = [
  { label: 'top', direction: 'up' },
  { label: 'right', direction: 'right' },
  { label: 'bottom', direction: 'down' },
  { label: 'left', direction: 'left' }
] as const

const DrawerWithSides = () => {
  return (
    <div className='flex flex-wrap gap-2'>
      {DRAWER_SIDES.map(({ label, direction }) => (
        <Drawer key={label} swipeDirection={direction}>
          <DrawerTrigger render={<Button variant='outline' className='capitalize' />}>{label}</DrawerTrigger>
          <DrawerContent className='data-[swipe-direction=down]:max-h-[50vh] data-[swipe-direction=up]:max-h-[50vh]'>
            <DrawerHeader>
              <DrawerTitle>Edit Site</DrawerTitle>
              <DrawerDescription>
                Update this site&apos;s details here. Click save when you&apos;re done.
              </DrawerDescription>
            </DrawerHeader>
            <div className='grid flex-1 auto-rows-min gap-6 px-4'>
              <div className='grid gap-3'>
                <Label htmlFor='drawer-demo-name'>Site name</Label>
                <Input id='drawer-demo-name' defaultValue='HQ – Bay Street' />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='drawer-demo-username'>Site code</Label>
                <Input id='drawer-demo-username' defaultValue='HQ-BAY-01' />
              </div>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose render={<Button variant='outline' />}>Cancel</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}

export default DrawerWithSides
