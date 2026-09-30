import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DatePickerTimeDemo() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Peak event window</FieldLegend>
      <FieldGroup className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="event-window-start">Starts</FieldLabel>
          <Input id="event-window-start" type="time" defaultValue="14:00" />
        </Field>
        <Field>
          <FieldLabel htmlFor="event-window-end">Ends</FieldLabel>
          <Input id="event-window-end" type="time" defaultValue="19:00" />
        </Field>
      </FieldGroup>
      <FieldDescription>Site time. Load drops to the committed level for the whole window on event days.</FieldDescription>
    </FieldSet>
  )
}
