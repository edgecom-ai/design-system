"use client"

import * as React from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import MultipleSelector, { type Option } from "@/components/ui/multi-select"

// The site manager is always notified, so that option is `fixed`: its chip has
// no remove button, and neither Backspace nor Clear all takes it out.
const recipients: Option[] = [
  { value: "site-manager", label: "Site manager", fixed: true },
  { value: "energy-desk", label: "Energy desk" },
  { value: "maintenance", label: "Maintenance on-call" },
  { value: "facilities", label: "Facilities team" },
  { value: "finance", label: "Finance" },
]

export function MultiSelectFixedDemo() {
  const id = React.useId()
  const [selected, setSelected] = React.useState<Option[]>([recipients[0], recipients[1]])

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor={id}>Notify when a peak alarm fires</FieldLabel>
      <MultipleSelector
        value={selected}
        onChange={setSelected}
        defaultOptions={recipients}
        placeholder="Add a recipient"
        hidePlaceholderWhenSelected
        inputProps={{ id }}
        commandProps={{ label: "Alarm recipients" }}
        emptyIndicator={<p className="text-center text-body-sm">No matching recipients</p>}
        className="w-full"
      />
      <FieldDescription>The site manager is always notified, so they can&apos;t be removed.</FieldDescription>
    </Field>
  )
}
