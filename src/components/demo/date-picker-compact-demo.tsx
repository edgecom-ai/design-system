"use client"

import { DatePicker, MonthRangePicker } from "@/components/ui/date-picker"

export function DatePickerCompactDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DatePicker compact defaultValue={new Date()} placeholder="Pick a date" />
      <MonthRangePicker compact placeholder="Pick a month range" />
    </div>
  )
}
