"use client"

import * as React from "react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
]

const weekStarts = [
  { value: "monday", label: "Monday" },
  { value: "sunday", label: "Sunday" },
  { value: "saturday", label: "Saturday" },
]

const timeZones = [
  "(UTC−08:00) Pacific Time",
  "(UTC−07:00) Mountain Time",
  "(UTC−06:00) Central Time",
  "(UTC−05:00) Eastern Time",
  "(UTC−04:00) Atlantic Time",
  "(UTC−03:30) Newfoundland Time",
  "(UTC+00:00) Coordinated Universal Time",
  "(UTC+01:00) Central European Time",
]

// One control per card, each applied the moment it changes — so each change
// confirms with a toast, and the controls share one width.
function PreferenceCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  )
}

function PreferenceSelect({
  id,
  label,
  items,
  defaultValue,
  onChange,
}: {
  id: string
  label: string
  items: { value: string; label: string }[]
  defaultValue: string
  onChange: (label: string) => void
}) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Select
        items={items}
        defaultValue={defaultValue}
        onValueChange={(next) => onChange(items.find((item) => item.value === next)?.label ?? "")}
      >
        <SelectTrigger id={id} className="w-full sm:max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}

export function SettingsPreferencesDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <PreferenceCard title="Language" description="Menus, emails and notifications use this language.">
        <PreferenceSelect
          id="display-language"
          label="Language"
          items={languages}
          defaultValue="en"
          onChange={(label) => toast.success("Language updated", { description: `The app now shows ${label}.` })}
        />
      </PreferenceCard>
      <PreferenceCard title="First day of the week" description="Calendars and weekly summaries start on this day.">
        <PreferenceSelect
          id="week-start"
          label="Week starts on"
          items={weekStarts}
          defaultValue="monday"
          onChange={(label) => toast.success("Week start updated", { description: `Weeks now start on ${label}.` })}
        />
      </PreferenceCard>
      <PreferenceCard title="Time zone" description="Due dates and reminders are shown in this zone.">
        <Label htmlFor="time-zone">Time zone</Label>
        <Combobox
          items={timeZones}
          defaultValue={timeZones[3]}
          onValueChange={(next) => next && toast.success("Time zone updated", { description: next })}
        >
          <ComboboxInput id="time-zone" placeholder="Search time zones" className="w-full sm:max-w-xs" />
          <ComboboxContent>
            <ComboboxEmpty>No time zone matches that search.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </PreferenceCard>
    </div>
  )
}
