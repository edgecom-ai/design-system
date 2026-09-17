// Alert preview — variant sweep composed here; the closable / action stories
// re-export the docs site's own demos. WithProgress is composed here rather
// than re-exporting alert-07: AlertDescription is `grid justify-items-start`,
// which shrink-wraps a <Progress> to zero width unless it is given `w-full`,
// so the demo's bar is invisible (recorded in learnings).
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CheckCheckIcon,
  CircleAlertIcon,
  InfoIcon,
  TriangleAlertIcon,
  UploadIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"

export { default as Closable } from "@/components/shadcn-studio/alert/alert-03"
export { default as WithAction } from "@/components/shadcn-studio/alert/alert-13"

export function WithProgress() {
  return (
    <Alert>
      <UploadIcon />
      <AlertTitle>Generating Q2-Emissions-Report.pdf</AlertTitle>
      <AlertDescription>
        <p className="mb-2">Compiling 14 sites · 312 meters · 3 commodities.</p>
        <Progress value={62} className="w-full" aria-label="Report generation progress" />
        <div className="mt-2 flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="ghost" size="sm" disabled>
            Generate another
          </Button>
        </div>
      </AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-xs" aria-label="Close">
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  )
}

export function Variants() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert>
        <ZapIcon />
        <AlertTitle>Interval data refreshed</AlertTitle>
        <AlertDescription>Northridge Distribution Center now reports through 14:45.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Tariff change takes effect 1 October</AlertTitle>
        <AlertDescription>Peak window moves to 16:00–21:00 for all Ridgeway Utilities accounts.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCheckIcon />
        <AlertTitle>DR event completed</AlertTitle>
        <AlertDescription>Halverson Cold Storage shed 312 kW against a 280 kW commitment.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Approaching demand threshold</AlertTitle>
        <AlertDescription>Meter MTR-4471-0092 is at 94% of the 1,200 kW monthly peak.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Meter offline</AlertTitle>
        <AlertDescription>No intervals from Pinecrest Bottling Plant since 09:15. Last reading 418 kW.</AlertDescription>
      </Alert>
    </div>
  )
}
