"use client"

import * as React from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import MultipleSelector, { type Option } from "@/components/ui/multi-select"

const sites: Option[] = [
  { value: "plant-3", label: "Plant 3, Riverside", region: "Ontario" },
  { value: "cold-storage", label: "Cold Storage Facility", region: "Ontario" },
  { value: "harbour-office", label: "Harbour Office", region: "Ontario" },
  { value: "northgate", label: "Northgate Distribution", region: "Alberta" },
  { value: "eastfield", label: "Eastfield Warehouse", region: "Alberta" },
  { value: "bayview", label: "Bayview Bottling", region: "British Columbia" },
  { value: "summit-lab", label: "Summit Test Lab", region: "British Columbia", disable: true },
]

export function MultiSelectPresetDemo() {
  const [selected, setSelected] = React.useState<Option[]>([sites[0], sites[1]])

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Sites in this report</FieldLabel>
      <MultipleSelector
        value={selected}
        onChange={setSelected}
        defaultOptions={sites}
        groupBy="region"
        placeholder="Add a site"
        hidePlaceholderWhenSelected
        commandProps={{ label: "Sites in this report" }}
        emptyIndicator={<p className="text-center text-body-sm">No matching sites</p>}
        className="w-full"
      />
      <FieldDescription>
        Summit Test Lab can&apos;t be added until its meters are commissioned.
      </FieldDescription>
    </Field>
  )
}
