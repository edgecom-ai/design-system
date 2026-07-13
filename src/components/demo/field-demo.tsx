import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function FieldDemo() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="field-site">Site name</FieldLabel>
        <Input id="field-site" defaultValue="Toronto Distribution Center" />
        <FieldDescription>
          Shown across dataTrack™ dashboards and reports.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="field-demand">Demand threshold (kW)</FieldLabel>
        <Input id="field-demand" defaultValue="twelve hundred" aria-invalid />
        <FieldError>Enter a numeric kW value.</FieldError>
      </Field>
    </FieldGroup>
  )
}
