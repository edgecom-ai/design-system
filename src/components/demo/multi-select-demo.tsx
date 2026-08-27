"use client"

import * as React from "react"

import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select-listbox"

const devices: MultiSelectOption[] = [
  { id: "m-01", label: "Main ON-M-01", meta: "1,117 kW", swatch: "var(--chart-water-500)" },
  { id: "c-02", label: "Compressor ON-C-02", meta: "508 kW", swatch: "var(--chart-electricity-500)" },
  { id: "pl-04", label: "Production line ON-PL-04", meta: "412 kW", swatch: "var(--chart-temperature-500)" },
  { id: "ch-01", label: "Chiller ON-CH-01", meta: "336 kW", swatch: "var(--chart-gas-500)" },
  { id: "b-01", label: "Boiler ON-B-01", meta: "184 kW", swatch: "var(--chart-emissions-500)" },
  { id: "l-01", label: "Lighting ON-L-01", meta: "112 kW", swatch: "var(--chart-water-700)" },
]

const allIds = devices.map((d) => d.id)

function Field({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{caption}</span>
      {children}
    </div>
  )
}

export function MultiSelectDemo() {
  const [empty, setEmpty] = React.useState<string[]>([])
  const [partial, setPartial] = React.useState<string[]>(["c-02"])
  const [all, setAll] = React.useState<string[]>(allIds)

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Field caption="Empty">
        <MultiSelect
          options={devices}
          value={empty}
          onChange={setEmpty}
          placeholder="Add devices"
          itemNoun="devices"
        />
      </Field>
      <Field caption="Partial">
        <MultiSelect
          options={devices}
          value={partial}
          onChange={setPartial}
          placeholder="Add devices"
          itemNoun="devices"
        />
      </Field>
      <Field caption="All selected">
        <MultiSelect
          options={devices}
          value={all}
          onChange={setAll}
          placeholder="Add devices"
          itemNoun="devices"
        />
      </Field>
    </div>
  )
}
