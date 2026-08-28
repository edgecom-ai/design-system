"use client"

import * as React from "react"

import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select-listbox"

const devices: MultiSelectOption[] = [
  { id: "m-01", label: "Main ST-M-01", meta: "1,117 kW", swatch: "var(--chart-water-500)" },
  { id: "c-02", label: "Compressor ST-C-02", meta: "508 kW", swatch: "var(--chart-electricity-500)" },
  { id: "pl-04", label: "Production line ST-PL-04", meta: "412 kW", swatch: "var(--chart-temperature-500)" },
  { id: "ch-01", label: "Chiller ST-CH-01", meta: "336 kW", swatch: "var(--chart-gas-500)" },
  { id: "b-01", label: "Boiler ST-B-01", meta: "184 kW", swatch: "var(--chart-emissions-500)" },
  { id: "l-01", label: "Lighting ST-L-01", meta: "112 kW", swatch: "var(--chart-water-700)" },
]

function Field({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{caption}</span>
      {children}
    </div>
  )
}

export function MultiSelectDemo() {
  const [staticLabel, setStaticLabel] = React.useState<string[]>(["c-02"])
  const [withCount, setWithCount] = React.useState<string[]>(["c-02"])

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Field caption="Static label (default)">
        <MultiSelect
          options={devices}
          value={staticLabel}
          onChange={setStaticLabel}
          placeholder="Select device data"
          itemNoun="devices"
        />
      </Field>
      <Field caption="Count summary (showCount)">
        <MultiSelect
          options={devices}
          value={withCount}
          onChange={setWithCount}
          placeholder="Select device data"
          itemNoun="devices"
          showCount
        />
      </Field>
    </div>
  )
}
