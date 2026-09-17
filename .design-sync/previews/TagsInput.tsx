// TagsInput preview — free-text chips (tags, recipients, meter IDs).
import { TagsInput } from "@/components/ui/tags-input"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

export { default as WithFieldLabel } from "@/components/shadcn-studio/tags-input/tags-input-01"
export { default as ValidatedRecipients } from "@/components/shadcn-studio/tags-input/tags-input-02"

export function ManyTagsWrapping() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="ti-meters">Meters in group</FieldLabel>
      <TagsInput
        inputId="ti-meters"
        defaultValue={["ST-M-01", "ST-C-02", "ST-PL-04", "ST-CH-01", "ST-B-01", "ST-L-01"]}
        placeholder="Add a meter ID…"
      />
      <FieldDescription>Chips wrap onto new rows; the field grows with them.</FieldDescription>
    </Field>
  )
}

export function EmptyPlaceholder() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="ti-empty">Alarm labels</FieldLabel>
      <TagsInput inputId="ti-empty" placeholder="e.g. peak, chiller, after-hours" />
    </Field>
  )
}

export function DisabledAndInvalid() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Field className="w-64">
        <FieldLabel htmlFor="ti-disabled">Disabled</FieldLabel>
        <TagsInput inputId="ti-disabled" defaultValue={["electricity", "gas"]} disabled />
      </Field>
      <Field className="w-64" data-invalid>
        <FieldLabel htmlFor="ti-invalid">Invalid</FieldLabel>
        <TagsInput inputId="ti-invalid" defaultValue={["ops@northridge.example", "not-an-email"]} aria-invalid />
        <FieldError>“not-an-email” is not a valid address.</FieldError>
      </Field>
    </div>
  )
}
