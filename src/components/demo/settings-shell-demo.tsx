"use client"

import * as React from "react"
import {
  BellIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  KeyRoundIcon,
  PlugIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DatatableListCardDemo } from "@/components/demo/datatable-list-card-demo"
import { SettingsPreferencesDemo } from "@/components/demo/settings-preferences-demo"

const groups = [
  {
    label: "Account",
    sections: [
      { id: "profile", label: "Profile", description: "Your name, email and how teammates reach you.", Icon: UserRoundIcon },
      { id: "notifications", label: "Notifications", description: "Pick what you hear about, and where.", Icon: BellIcon },
      { id: "preferences", label: "Preferences", description: "Language, time zone and the first day of your week.", Icon: SlidersHorizontalIcon },
    ],
  },
  {
    label: "Workspace",
    sections: [
      { id: "general", label: "General", description: "The workspace name, logo and web address.", Icon: SettingsIcon },
      { id: "members", label: "Members", description: "Invite people and choose what each of them can do.", Icon: UsersIcon },
      { id: "projects", label: "Projects", description: "Create, rename and archive the projects in this workspace.", Icon: FolderKanbanIcon },
      { id: "billing", label: "Billing", description: "Your plan, invoices and payment method.", Icon: CreditCardIcon },
      { id: "integrations", label: "Integrations", description: "Connect the tools your team already uses.", Icon: PlugIcon },
      { id: "api-keys", label: "API keys", description: "Create and revoke keys for scripts and services.", Icon: KeyRoundIcon },
    ],
  },
]

const sections = groups.flatMap((group) => group.sections)

// The rail: labelled when the panel is wide, icons with tooltips when it's
// narrower, and a grouped select above the page when there's no room for it.
function SettingsNav({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <>
      <div className="border-b p-4 @2xl:hidden">
        <Select
          items={sections.map((section) => ({ value: section.id, label: section.label }))}
          value={active}
          onValueChange={(next) => next && onChange(next)}
        >
          <SelectTrigger aria-label="Settings section" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav
        aria-label="Settings"
        className="hidden w-12 shrink-0 overflow-y-auto border-r px-2 py-4 @2xl:block @3xl:w-60 @3xl:px-3"
      >
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1 py-2">
            <span className="flex h-8 items-center px-2 text-caption text-muted-foreground @max-3xl:sr-only">
              {group.label}
            </span>
            <ul className="flex flex-col gap-1">
              {group.sections.map(({ id, label, Icon }) => (
                <li key={id}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-current={active === id ? "page" : undefined}
                          onClick={() => onChange(id)}
                          className={cn(
                            "flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md text-body-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 @3xl:justify-start @3xl:px-2",
                            active === id && "bg-accent font-medium text-foreground"
                          )}
                        >
                          <Icon className="size-4 shrink-0" aria-hidden />
                          <span className="flex-1 truncate text-left @max-3xl:sr-only">{label}</span>
                        </button>
                      }
                    />
                    <TooltipContent side="right" className="@3xl:hidden">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  )
}

// Floats at the bottom of the scrolling pane while there is something to save.
function SaveBar({
  dirty,
  caption,
  onDiscard,
  onSave,
}: {
  dirty: boolean
  caption: React.ReactNode
  onDiscard: () => void
  onSave: () => void
}) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-4 shadow-md">
      {caption}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={!dirty} onClick={onDiscard}>
          Cancel
        </Button>
        <Button disabled={!dirty} onClick={onSave}>
          Update
        </Button>
      </div>
    </div>
  )
}

const baseline = {
  firstName: "Maya",
  lastName: "Okafor",
  email: "maya.okafor@example.com",
  title: "Design lead",
  phone: "(555) 010-0134",
}

function ProfileSection() {
  const [fields, setFields] = React.useState(baseline)
  const [saved, setSaved] = React.useState(baseline)
  const [tried, setTried] = React.useState(false)

  const dirty = (Object.keys(fields) as (keyof typeof fields)[]).some((key) => fields[key] !== saved[key])
  const emailError = !tried
    ? undefined
    : fields.email.trim() === ""
      ? "Email is required."
      : !/^\S+@\S+\.\S+$/.test(fields.email)
        ? "Enter an email address like name@example.com."
        : undefined
  const update = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFields((previous) => ({ ...previous, [key]: event.target.value }))

  function save() {
    setTried(true)
    if (fields.email.trim() === "" || !/^\S+@\S+\.\S+$/.test(fields.email)) return
    setSaved(fields)
    setTried(false)
    toast.success("Profile updated", { description: "Teammates see your new details right away." })
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
          <CardDescription>Shown to teammates on comments, tasks and invites.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
              <Input id="profile-first-name" value={fields.firstName} onChange={update("firstName")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
              <Input id="profile-last-name" value={fields.lastName} onChange={update("lastName")} />
            </Field>
          </div>
          <Field data-invalid={emailError ? true : undefined}>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input
              id="profile-email"
              type="email"
              value={fields.email}
              aria-invalid={emailError ? true : undefined}
              onChange={update("email")}
            />
            {emailError && <FieldError>{emailError}</FieldError>}
          </Field>
          <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="profile-title">Job title</FieldLabel>
              <Input id="profile-title" value={fields.title} onChange={update("title")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
              <Input id="profile-phone" type="tel" value={fields.phone} onChange={update("phone")} />
            </Field>
          </div>
        </CardContent>
      </Card>
      <SaveBar
        dirty={dirty}
        caption={<p className="text-body-sm text-muted-foreground">Changes apply to your account only.</p>}
        onDiscard={() => {
          setFields(saved)
          setTried(false)
        }}
        onSave={save}
      />
    </div>
  )
}

export function SettingsShellDemo() {
  const [active, setActive] = React.useState("profile")
  const section = sections.find((item) => item.id === active) ?? sections[0]

  return (
    <div className="@container w-full">
      <div className="flex h-144 flex-col overflow-hidden rounded-xl border bg-background @2xl:flex-row">
        <SettingsNav active={active} onChange={setActive} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-4 @2xl:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-title">{section.label}</h2>
            <p className="text-body text-muted-foreground">{section.description}</p>
          </div>
          {active === "profile" ? (
            <ProfileSection />
          ) : active === "preferences" ? (
            <SettingsPreferencesDemo />
          ) : active === "projects" ? (
            <DatatableListCardDemo />
          ) : (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SettingsIcon />
                </EmptyMedia>
                <EmptyTitle>{section.label}</EmptyTitle>
                <EmptyDescription>
                  This preview fills in Profile, Preferences and Projects only.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
    </div>
  )
}
