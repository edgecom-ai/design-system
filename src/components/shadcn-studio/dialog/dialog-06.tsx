import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeftIcon } from "lucide-react"

const DialogStickyFooterDemo = () => {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant='outline' />}>Sticky Footer Dialog</DialogTrigger>
      <DialogContent className='flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md'>
        <DialogHeader className='contents space-y-0 text-left'>
          <ScrollArea className='flex flex-col overflow-hidden'>
            <DialogTitle className='px-6 pt-6'>Meter Details</DialogTitle>
            <DialogDescription render={<div className='p-6' />}>
              <div className='[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold'>
                <div className='space-y-1'>
                  <p>
                    <strong>Meter Name:</strong> Main Building – Utility Feed
                  </p>
                  <p>
                    The Main Building utility feed is the primary electricity meter for HQ – Bay Street, capturing
                    interval consumption and demand for the whole facility.
                  </p>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Specifications:</strong>
                  </p>
                  <ul>
                    <li>Commodity: Electricity</li>
                    <li>Interval: 15 minutes</li>
                    <li>Peak demand: 480 kW</li>
                    <li>Rated capacity: 750 kVA</li>
                    <li>Voltage: 600 V, 3-phase</li>
                    <li>Utility: Toronto Hydro</li>
                  </ul>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Tracked Metrics:</strong>
                  </p>
                  <ul>
                    <li>Real-time load and peak demand alerts</li>
                    <li>Daily, weekly, and monthly kWh consumption</li>
                    <li>Power factor and THD monitoring</li>
                    <li>Cost and emissions intensity</li>
                    <li>Baseline vs. actual variance</li>
                  </ul>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Monthly Cost:</strong>
                  </p>
                  <p>$8,420 / mo (based on trailing 12-month average)</p>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Notes:</strong>
                  </p>
                  <p>
                    &rdquo;Peak demand has trended down 6% since load-shifting was enabled on the chillers.&rdquo; -
                    Priya S.
                  </p>
                  <p>
                    &rdquo;Interval data has been clean and gap-free for the last two billing cycles.&rdquo; - Marcus L.
                  </p>
                  <p>
                    &rdquo;This meter drives most of our demand-response savings for the site.&rdquo; - Emma W.
                  </p>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Data Retention:</strong>
                  </p>
                  <p>
                    Interval data is retained for the life of the site. Deleting the meter permanently removes its
                    historical consumption records.
                  </p>
                </div>
                <div className='space-y-1'>
                  <p>
                    <strong>Verification:</strong>
                  </p>
                  <p>
                    Readings are validated against utility bills each cycle as part of M&V. Contact your analyst to flag
                    any discrepancies.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className='m-0 px-6 sm:justify-end'>
          <DialogClose render={<Button variant='outline' />}>
            <ChevronLeftIcon
            />
            Back
          </DialogClose>
          <Button type='button'>Read More</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogStickyFooterDemo
