"use client"

import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Member = { email: string; role: string; lastActive: string; joined: string; active: boolean; access: string[] }

const members: Member[] = [
  { email: "maya.okafor@example.com", role: "Admin", lastActive: "Today", joined: "Mar 3, 2025", active: true, access: ["website", "catalog", "survey"] },
  { email: "lin.ferreira@example.com", role: "Member", lastActive: "Yesterday", joined: "Nov 18, 2025", active: true, access: ["app"] },
  { email: "sam.delacroix@example.com", role: "Guest", lastActive: "Apr 2", joined: "Jan 9, 2024", active: false, access: [] },
]

const roles = ["Admin", "Member", "Guest"].map((role) => ({ value: role, label: role }))

const projectGroups = [
  {
    name: "Marketing",
    projects: [
      { id: "website", name: "Website refresh" },
      { id: "catalog", name: "Spring catalog" },
      { id: "survey", name: "Customer survey" },
      { id: "holiday", name: "Holiday campaign" },
    ],
  },
  {
    name: "Product",
    projects: [
      { id: "app", name: "Mobile app" },
      { id: "help", name: "Help center" },
      { id: "pricing", name: "Pricing page" },
    ],
  },
]

function SectionHeading({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-body-sm font-medium">{title}</h3>
      {meta && <span className="text-caption text-muted-foreground">{meta}</span>}
    </div>
  )
}

// Reads like an input of the same height, so a read-only field lines up with
// the editable ones beside it.
function ReadOnlyValue({ value }: { value: string }) {
  return <span className="flex h-8 items-center text-body-sm text-muted-foreground">{value}</span>
}

// A longer edit, so a sheet — wider than the 420px default because the access
// section needs two columns. Closing with unsaved access asks first; removing
// the member goes through an alert dialog.
function MemberSheet({
  member,
  open,
  onClose,
}: {
  member: Member | undefined
  open: boolean
  onClose: () => void
}) {
  const [role, setRole] = React.useState(member?.role ?? "Member")
  const [saved, setSaved] = React.useState<string[]>(member?.access ?? [])
  const [access, setAccess] = React.useState<string[]>(member?.access ?? [])
  const [confirmClose, setConfirmClose] = React.useState(false)
  const [confirmRemove, setConfirmRemove] = React.useState(false)

  const changes =
    access.filter((id) => !saved.includes(id)).length + saved.filter((id) => !access.includes(id)).length
  const dirty = changes > 0
  const toggle = (id: string, checked: boolean) =>
    setAccess((previous) => (checked ? [...previous, id] : previous.filter((item) => item !== id)))

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (next) return
          if (dirty) setConfirmClose(true)
          else onClose()
        }}
      >
        <SheetContent className="gap-0 [--sheet-width:40rem]">
          <SheetHeader className="border-b">
            <SheetTitle className="flex flex-wrap items-center gap-2 break-all">
              {member?.email}
              {member && !member.active && <Badge variant="outline">Inactive</Badge>}
            </SheetTitle>
            <SheetDescription>{role}</SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
            <section className="flex flex-col gap-3">
              <SectionHeading title="Details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="member-role">Role</FieldLabel>
                  <Select
                    items={roles}
                    value={role}
                    onValueChange={(next) => {
                      if (!next) return
                      setRole(next)
                      toast.success("Role changed", { description: `${member?.email} is now ${next}.` })
                    }}
                  >
                    <SelectTrigger id="member-role" size="sm" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Last active</FieldLabel>
                  <ReadOnlyValue value={member?.lastActive ?? "—"} />
                </Field>
                <Field>
                  <FieldLabel>Joined</FieldLabel>
                  <ReadOnlyValue value={member?.joined ?? "—"} />
                </Field>
              </div>
            </section>
            <section className="flex flex-col gap-3">
              <SectionHeading title="Project access" meta={`${access.length} selected`} />
              <div className="grid gap-4 sm:grid-cols-2">
                {projectGroups.map((group) => {
                  const ids = group.projects.map((project) => project.id)
                  const all = ids.every((id) => access.includes(id))
                  return (
                    <div key={group.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-caption tracking-wide text-muted-foreground uppercase">{group.name}</span>
                        <Button
                          variant="link"
                          size="xs"
                          onClick={() =>
                            setAccess((previous) =>
                              all ? previous.filter((id) => !ids.includes(id)) : [...new Set([...previous, ...ids])]
                            )
                          }
                        >
                          {all ? "Clear" : "Select all"}
                        </Button>
                      </div>
                      {group.projects.map((project) => (
                        <Label
                          key={project.id}
                          className="flex min-h-7 cursor-pointer items-center gap-2 rounded-md px-1.5 font-normal hover:bg-muted"
                        >
                          <Checkbox
                            checked={access.includes(project.id)}
                            onCheckedChange={(checked) => toggle(project.id, checked === true)}
                          />
                          {project.name}
                        </Label>
                      ))}
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-3">
                <span className="text-body-sm text-muted-foreground">
                  {dirty ? `${changes} unsaved ${changes === 1 ? "change" : "changes"}` : "Access is saved"}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={!dirty} onClick={() => setAccess(saved)}>
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    disabled={!dirty}
                    onClick={() => {
                      setSaved(access)
                      toast.success("Access saved", {
                        description: `${access.length} projects for ${member?.email}.`,
                      })
                    }}
                  >
                    Save access
                  </Button>
                </div>
              </div>
            </section>
          </div>
          <SheetFooter className="flex-row justify-end border-t">
            <Button variant="destructive-subtle" onClick={() => setConfirmRemove(true)}>
              Remove from workspace
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved access changes?</AlertDialogTitle>
            <AlertDialogDescription>
              The project access you changed for {member?.email} hasn&apos;t been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmClose(false)
                onClose()
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlertIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove {member?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              They lose access to every project in this workspace straight away. Tasks assigned to them stay,
              unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep member</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmRemove(false)
                toast.success("Member removed", { description: `${member?.email} no longer has access.` })
                onClose()
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function MemberDetailSheetDemo() {
  const [selected, setSelected] = React.useState<Member>()
  const [open, setOpen] = React.useState(false)
  const [sheetKey, setSheetKey] = React.useState(0)

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {members.map((member) => (
            <li key={member.email} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
              <span className="flex min-w-0 flex-col items-start">
                <Button
                  variant="link"
                  className="h-auto truncate p-0"
                  onClick={() => {
                    setSelected(member)
                    setSheetKey((key) => key + 1)
                    setOpen(true)
                  }}
                >
                  {member.email}
                </Button>
                <span className="text-caption text-muted-foreground">{member.role}</span>
              </span>
              {!member.active && <Badge variant="outline">Inactive</Badge>}
            </li>
          ))}
        </ul>
      </CardContent>
      {/* Re-keyed on every open, so each starts from that member's saved state. */}
      <MemberSheet key={sheetKey} member={selected} open={open} onClose={() => setOpen(false)} />
    </Card>
  )
}
