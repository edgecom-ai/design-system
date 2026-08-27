"use client"

import { MonthRangePicker } from "@/components/ui/date-picker"

export function DatePickerMonthRangeDemo() {
  return (
    <MonthRangePicker
      defaultValue={{ from: new Date(2025, 1, 1), to: new Date(2025, 6, 1) }}
    />
  )
}
