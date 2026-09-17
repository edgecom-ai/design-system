// Field preview — label, description and inline error on real inputs.
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export { FieldDemo as LabelDescriptionError } from "@/components/demo/field-demo"

export function FieldSetWithLegend() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Alarm delivery</FieldLegend>
      <FieldDescription>Where dataTrack™ sends threshold alarms for this site.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fs-email">Notification email</FieldLabel>
          <Input id="fs-email" type="email" defaultValue="operations@northridge-utilities.example" />
        </Field>
        <Field>
          <FieldLabel htmlFor="fs-note">Escalation note</FieldLabel>
          <Textarea id="fs-note" placeholder="Who to call if the alarm is not acknowledged within 15 minutes" />
          <FieldDescription>Included in every alarm email.</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="fs-ack" defaultChecked />
          <FieldLabel htmlFor="fs-ack">Require acknowledgement</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}

export function Disabled() {
  return (
    <Field className="w-full max-w-sm" data-disabled>
      <FieldLabel htmlFor="fd-meter">Meter serial</FieldLabel>
      <Input id="fd-meter" defaultValue="MTR-0091-4471" disabled />
      <FieldDescription>Assigned by the utility; cannot be edited here.</FieldDescription>
    </Field>
  )
}
