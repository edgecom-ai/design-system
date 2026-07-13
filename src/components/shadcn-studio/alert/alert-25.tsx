import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlertIcon } from "lucide-react"

const AlertSoftDestructiveDemo = () => {
  return (
    <Alert variant='destructive'>
      <TriangleAlertIcon />
      <AlertTitle>Meter offline</AlertTitle>
      <AlertDescription>
        The main electricity meter at Warehouse B has stopped reporting. Check the gateway connection.
      </AlertDescription>
    </Alert>
  )
}

export default AlertSoftDestructiveDemo
