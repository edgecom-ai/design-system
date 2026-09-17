// DatePicker preview — button trigger + calendar popover (single day, month
// range, rolling window). None of the pickers expose an `open` prop, so the
// open cells click their trigger after mount to show the popover.
import * as React from "react"
import { DatePicker, MonthRangePicker, WindowRangePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

// Relative to the real clock so the calendar opens on the month that holds the value
// (the capture harness pins the clock; fixed dates open on the wrong month).
const today = new Date()
today.setHours(0, 0, 0, 0)
const daysAgo = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n)
const monthsAgo = (n: number) => new Date(today.getFullYear(), today.getMonth() - n, 1)

function OpenAfterMount({ children, selector = "button" }: { children: React.ReactNode; selector?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>(selector)?.click()
  }, [selector])
  return <div ref={ref} className="min-h-96">{children}</div>
}

export function OpenSingleDay() {
  return (
    <OpenAfterMount>
      <div className="space-y-1.5">
        <Label>Report date</Label>
        <DatePicker defaultValue={today} />
      </div>
    </OpenAfterMount>
  )
}

export function OpenMonthRange() {
  return (
    <OpenAfterMount selector="[data-slot=month-range-picker-trigger]">
      <div className="space-y-1.5">
        <Label>Billing period</Label>
        <MonthRangePicker defaultValue={{ from: monthsAgo(5), to: monthsAgo(0) }} />
      </div>
    </OpenAfterMount>
  )
}

export function OpenRollingWindow() {
  return (
    <OpenAfterMount selector="[data-slot=window-range-picker-trigger]">
      <div className="space-y-1.5">
        <Label>Baseline window (7 days)</Label>
        <WindowRangePicker defaultValue={daysAgo(7)} maxDate={today} placeholder="Seven-day window" />
      </div>
    </OpenAfterMount>
  )
}

export function TriggersClosed() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <DatePicker placeholder="Pick a date" />
        <DatePicker defaultValue={today} />
        <DatePicker compact defaultValue={today} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <MonthRangePicker placeholder="Pick a month range" />
        <MonthRangePicker defaultValue={{ from: monthsAgo(5), to: monthsAgo(0) }} />
        <MonthRangePicker compact placeholder="Pick a month range" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <WindowRangePicker placeholder="Seven-day window" />
        <WindowRangePicker windowLength={14} defaultValue={daysAgo(14)} />
        <WindowRangePicker compact defaultValue={today} placeholder="Rolling window" />
      </div>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DatePicker defaultValue={today} disabled />
      <MonthRangePicker disabled placeholder="Pick a month range" />
      <WindowRangePicker compact disabled defaultValue={today} />
    </div>
  )
}
