import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCheckIcon } from "lucide-react"

const AlertSoftSuccessDemo = () => {
  return (
    <Alert variant='success'>
      <CheckCheckIcon />
      <AlertTitle>Report ready to download</AlertTitle>
      <AlertDescription>
        Your Q2 emissions report has been generated and is now available in the Download Panel.
      </AlertDescription>
    </Alert>
  )
}

export default AlertSoftSuccessDemo
