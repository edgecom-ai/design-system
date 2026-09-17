// Progress preview — linear determinate progress with optional label/value.
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export { ProgressLinearDemo as Linear } from "@/components/demo/progress-linear-demo"
export { default as Shapes } from "@/components/shadcn-studio/progress/progress-04"
export { default as Checklist } from "@/components/shadcn-studio/progress/progress-14"

export function WithLabelAndValue() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={72}>
        <ProgressLabel>Interval backfill — Northridge Distribution Center</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={38}>
        <ProgressLabel>Monthly budget used</ProgressLabel>
        <ProgressValue>{() => "3,420 / 9,000 kWh"}</ProgressValue>
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Baseline period configured</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
