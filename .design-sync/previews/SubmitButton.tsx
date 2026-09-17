// TanStack form fields preview — TextField / TextareaField / SelectField /
// CheckboxField / SubmitButton only render inside a `useAppForm` form, so each
// of those cards shows the same two forms: the docs block and a settings form
// validated on mount so the inline error state is visible statically.
import { useEffect } from "react"
import { z } from "zod"

import { FieldGroup } from "@/components/ui/field"
import { SelectItem } from "@/components/ui/select"
import { useAppForm } from "@/components/ui/tanstack-form"

export { default as ValidatedInviteForm } from "@/components/shadcn-studio/blocks/form-validated/form-validated"

const schema = z.object({
  siteName: z.string().min(2, "Enter at least 2 characters."),
  contactEmail: z.string().email("Enter a valid email address."),
  tariff: z.string().min(1, "Select a tariff."),
  notes: z.string().max(200, "Keep notes under 200 characters."),
  alarms: z.boolean().refine((v) => v === true, { message: "Alarm delivery must be enabled for a live site." }),
})

export function SiteSettingsWithErrors() {
  const form = useAppForm({
    defaultValues: {
      siteName: "Northridge Distribution Center",
      contactEmail: "operations@northridge",
      tariff: "",
      notes: "Peak window 13:00–17:00. Chiller plant is the first load to shed.",
      alarms: false,
    },
    validators: { onMount: schema, onChange: schema },
    onSubmit: () => {},
  })

  // FieldError only shows once a field is touched; touch the invalid ones so
  // the error state is visible in a static capture.
  useEffect(() => {
    for (const name of ["contactEmail", "tariff", "alarms"] as const) {
      form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }))
    }
  }, [form])

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.AppField name="siteName">
          {(field) => <field.TextField label="Site name" description="Shown on dashboards and in alarm emails." />}
        </form.AppField>
        <form.AppField name="contactEmail">
          {(field) => <field.TextField label="Operations contact" type="email" placeholder="ops@example.com" />}
        </form.AppField>
        <form.AppField name="tariff">
          {(field) => (
            <field.SelectField label="Tariff" placeholder="Select a tariff">
              <SelectItem value="tou-a">Time-of-use A</SelectItem>
              <SelectItem value="tou-b">Time-of-use B</SelectItem>
              <SelectItem value="flat">Flat rate</SelectItem>
            </field.SelectField>
          )}
        </form.AppField>
        <form.AppField name="notes">
          {(field) => <field.TextareaField label="Operator notes" description="Visible to everyone with access to this site." />}
        </form.AppField>
        <form.AppField name="alarms">
          {(field) => <field.CheckboxField label="Deliver threshold alarms to the operations contact" />}
        </form.AppField>
      </FieldGroup>
      <div className="mt-6 flex justify-end">
        <form.AppForm>
          <form.SubmitButton>Save site</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
