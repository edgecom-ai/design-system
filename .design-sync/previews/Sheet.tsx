// Sheet preview — rendered OPEN. Side panels for longer forms and detail
// views. The `side` axis is swept: right (default), left, bottom, top.
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function RightEditMeter() {
  return (
    <Sheet open>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit meter</SheetTitle>
          <SheetDescription>MTR-2041-0087 · Chiller plant incomer</SheetDescription>
        </SheetHeader>
        <FieldGroup className="px-4">
          <Field>
            <FieldLabel htmlFor="sh-label">Label</FieldLabel>
            <Input id="sh-label" defaultValue="Chiller plant — incomer" />
            <FieldDescription>Shown in tables and alarms instead of the serial.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="sh-ct">CT ratio</FieldLabel>
            <Input id="sh-ct" defaultValue="800:5" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sh-interval">Interval (minutes)</FieldLabel>
            <Input id="sh-interval" type="number" defaultValue="15" />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const sites = [
  { name: "Northridge Distribution Center", meters: 14, checked: true },
  { name: "Harbor Point Cold Storage", meters: 9, checked: true },
  { name: "Kestrel Ridge Data Hall", meters: 22, checked: false },
  { name: "Old Mill Bakery", meters: 3, checked: false },
]

export function LeftSiteFilter() {
  return (
    <Sheet open>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter sites</SheetTitle>
          <SheetDescription>Charts and tables show only the selected sites.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4">
          {sites.map((s) => (
            <Label key={s.name} className="flex items-center gap-3 font-normal">
              <Checkbox defaultChecked={s.checked} />
              <span className="flex-1">{s.name}</span>
              <Badge variant="secondary">{s.meters} meters</Badge>
            </Label>
          ))}
        </div>
        <SheetFooter>
          <Button>Apply</Button>
          <Button variant="ghost">Clear all</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function BottomAlarmDetail() {
  return (
    <Sheet open>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Demand threshold exceeded</SheetTitle>
          <SheetDescription>
            Harbor Point Cold Storage · 14:32 · 1,284 kW against a 1,200 kW contract limit
          </SheetDescription>
        </SheetHeader>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 text-body-sm sm:grid-cols-4">
          <div><dt className="text-muted-foreground">Peak</dt><dd className="font-medium">1,284 kW</dd></div>
          <div><dt className="text-muted-foreground">Duration</dt><dd className="font-medium">23 min</dd></div>
          <div><dt className="text-muted-foreground">Est. penalty</dt><dd className="font-medium">$1,140</dd></div>
          <div><dt className="text-muted-foreground">Assigned to</dt><dd className="font-medium">Bianca Ngan</dd></div>
        </dl>
        <SheetFooter className="sm:flex-row sm:justify-end">
          <Button variant="outline">View interval data</Button>
          <Button>Acknowledge</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function TopNotice() {
  return (
    <Sheet open>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Scheduled maintenance</SheetTitle>
          <SheetDescription>
            Interval data ingestion pauses Sunday 02:00–03:00. Readings backfill automatically afterwards.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="sm:flex-row sm:justify-end">
          <Button variant="outline">Remind me later</Button>
          <Button>Got it</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
