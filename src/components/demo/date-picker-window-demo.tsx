"use client"

import { WindowRangePicker } from "@/components/ui/date-picker"

export function DatePickerWindowDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Default: a rolling 7-day window from the picked day. */}
      <WindowRangePicker
        defaultValue={new Date()}
        placeholder="Seven-day window"
      />
      {/* Longer window; days whose 14-day window runs past today are disabled. */}
      <WindowRangePicker
        windowLength={14}
        maxDate={new Date()}
        placeholder="Fourteen-day window"
      />
      {/* Compact, icon-only trigger — the range rides on the tooltip/aria-label. */}
      <WindowRangePicker compact defaultValue={new Date()} placeholder="Rolling window" />
    </div>
  )
}
