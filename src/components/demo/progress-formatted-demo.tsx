import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

// The value beside each bar is formatted for what it measures. With no
// `format` it reads as a percentage of 100; give the bar a `max` and a
// `format` and it reads as the measure itself — the peak in kW against the
// contracted demand, dollars against the month's budget. A unit Intl has no
// name for (kW) goes in the label.
export function ProgressFormattedDemo() {
  return (
    <div className="flex w-full flex-col gap-4 sm:max-w-sm">
      <Progress value={72}>
        <ProgressLabel>Interval data backfill</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress
        value={1240}
        max={1800}
        format={{ maximumFractionDigits: 0 }}
      >
        <ProgressLabel>Peak demand against contract (kW)</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress
        value={6120}
        max={9000}
        format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
      >
        <ProgressLabel>Monthly budget used</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
