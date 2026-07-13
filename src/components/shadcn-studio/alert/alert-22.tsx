import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlertIcon } from "lucide-react"

const AlertSoftInfoDemo = () => {
  return (
    <Alert variant='info'>
      <CircleAlertIcon />
      <AlertTitle>DR event scheduled for tomorrow</AlertTitle>
      <AlertDescription>
        A demand-response event is scheduled for 2:00-6:00 PM. Review your curtailment target ahead of time.
      </AlertDescription>
    </Alert>
  )
}

export default AlertSoftInfoDemo
