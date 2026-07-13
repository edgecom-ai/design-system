"use client"

import * as React from "react"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

/**
 * TanStack Form integration — OPTIONAL, OPT-IN.
 *
 * This is NOT a core primitive. The base `Field` primitives in
 * `@/components/ui/field` are intentionally form-library-agnostic (pure
 * layout/markup + a11y) and ship with no state-management dependency. Install
 * them and wire whatever your app uses — TanStack Form, React Hook Form,
 * Formik, or plain React state.
 *
 * This module is a separate registry item for teams that standardize on
 * `@tanstack/react-form`. It owns that dependency; the base field install
 * never pulls it in. It wires the agnostic Field primitives to TanStack Form
 * so state, validation, and submission live in the form library while
 * presentation stays on the design system.
 *
 * Define the styled field components once here, then bind them with
 * `useAppForm`:
 *
 * ```tsx
 * const form = useAppForm({
 *   defaultValues: { email: "" },
 *   validators: { onChange: schema }, // any Standard Schema (e.g. zod)
 *   onSubmit: ({ value }) => { ... },
 * })
 *
 * <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
 *   <form.AppField name="email">
 *     {(field) => <field.TextField label="Email" type="email" />}
 *   </form.AppField>
 *   <form.AppForm>
 *     <form.SubmitButton>Save</form.SubmitButton>
 *   </form.AppForm>
 * </form>
 * ```
 */

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

/**
 * Normalizes TanStack Form's `field.state.meta.errors` (which may contain
 * Standard Schema issue objects, plain strings, or `undefined`) into the
 * `{ message }[]` shape that `FieldError` expects.
 */
function normalizeErrors(
  errors: ReadonlyArray<unknown>
): Array<{ message?: string }> {
  return errors
    .filter((error): error is NonNullable<unknown> => error != null)
    .map((error) =>
      typeof error === "string"
        ? { message: error }
        : (error as { message?: string })
    )
}

type FieldMeta = {
  errors: Array<{ message?: string }>
  invalid: boolean
}

function useFieldMeta(meta: {
  errors: ReadonlyArray<unknown>
  isTouched: boolean
}): FieldMeta {
  const errors = normalizeErrors(meta.errors)
  return { errors, invalid: meta.isTouched && errors.length > 0 }
}

type FieldWrapperProps = {
  label?: React.ReactNode
  description?: React.ReactNode
}

function TextField({
  label,
  description,
  className,
  ...props
}: FieldWrapperProps & React.ComponentProps<typeof Input>) {
  const field = useFieldContext<string>()
  const { errors, invalid } = useFieldMeta(field.state.meta)

  return (
    <Field data-invalid={invalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        className={className}
        {...props}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError errors={errors} /> : null}
    </Field>
  )
}

function TextareaField({
  label,
  description,
  className,
  ...props
}: FieldWrapperProps & React.ComponentProps<typeof Textarea>) {
  const field = useFieldContext<string>()
  const { errors, invalid } = useFieldMeta(field.state.meta)

  return (
    <Field data-invalid={invalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        className={className}
        {...props}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError errors={errors} /> : null}
    </Field>
  )
}

function SelectField({
  label,
  description,
  placeholder,
  children,
  className,
  ...props
}: FieldWrapperProps & {
  placeholder?: string
  className?: string
} & Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange">) {
  const field = useFieldContext<string>()
  const { errors, invalid } = useFieldMeta(field.state.meta)

  return (
    <Field data-invalid={invalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Select
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(value as string)}
        {...props}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={invalid}
          onBlur={field.handleBlur}
          className={cn("w-full", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError errors={errors} /> : null}
    </Field>
  )
}

function CheckboxField({
  label,
  description,
  className,
  ...props
}: FieldWrapperProps & React.ComponentProps<typeof Checkbox>) {
  const field = useFieldContext<boolean>()
  const { errors, invalid } = useFieldMeta(field.state.meta)

  return (
    <Field orientation="horizontal" data-invalid={invalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        className={className}
        {...props}
      />
      <FieldContent>
        {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {invalid ? <FieldError errors={errors} /> : null}
      </FieldContent>
    </Field>
  )
}

function SubmitButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button type="submit" disabled={!canSubmit} {...props}>
          {isSubmitting ? "Submitting…" : children}
        </Button>
      )}
    </form.Subscribe>
  )
}

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
})

export {
  useAppForm,
  withForm,
  withFieldGroup,
  useFieldContext,
  useFormContext,
  // Field components — also usable standalone if wiring a raw TanStack field.
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  SubmitButton,
}
