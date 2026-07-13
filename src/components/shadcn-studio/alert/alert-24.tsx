import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlertIcon } from "lucide-react"

const AlertSoftWarningDemo = () => {
  return (
    <Alert variant='warning'>
      <CircleAlertIcon />
      <AlertTitle>Bill anomaly detected</AlertTitle>
      <AlertDescription>
        The latest utility bill for Calgary Plant 2 is 18% above expected cost. Review the charges before payment.
      </AlertDescription>
    </Alert>
  )
}

export default AlertSoftWarningDemo
