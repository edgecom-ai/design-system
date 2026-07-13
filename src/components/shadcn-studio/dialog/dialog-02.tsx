import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { UploadIcon } from "lucide-react"

const AlertDialogWithIconDemo = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant='outline' />}>Alert Dialog (With Icon)</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='mb-4 flex size-9 items-center justify-center rounded-full bg-primary/10 sm:mx-0'>
            <UploadIcon className='size-4.5 text-primary' />
          </div>
          <AlertDialogTitle>New Update is Available</AlertDialogTitle>
          <AlertDialogDescription>
            A new release of dataTrack™ is available. Please update to the latest version to access the newest features.
          </AlertDialogDescription>
          <ol className='text-muted-foreground mt-4 flex list-decimal flex-col gap-2 pl-6 text-sm'>
            <li>New consumption widgets for daily/weekly kWh</li>
            <li>Faster demand-response event scheduling</li>
            <li>Emissions intensity (tCO₂e) tracking</li>
            <li>Improved bill anomaly detection</li>
            <li>Dark mode support</li>
          </ol>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Update Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogWithIconDemo
