// Popover preview — rendered OPEN, anchored to a real trigger. Non-modal
// detail and light forms; side axis swept (bottom default, right, top).
import { CalendarIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function EditSetpoint() {
  return (
    <div className="flex h-full items-start justify-center pt-8">
      <Popover open>
        <PopoverTrigger render={<Button variant="outline" />}>Demand limit: 1,200 kW</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Demand limit</PopoverTitle>
            <PopoverDescription>Alarms page the on-call operator above this value.</PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="mt-3">
            <Field>
              <FieldLabel htmlFor="pop-limit">Limit (kW)</FieldLabel>
              <Input id="pop-limit" type="number" defaultValue="1200" />
            </Field>
            <Field>
              <FieldLabel htmlFor="pop-buffer">Warning buffer (%)</FieldLabel>
              <Input id="pop-buffer" type="number" defaultValue="5" />
            </Field>
          </FieldGroup>
          <div className="mt-3 flex justify-end gap-2">
            <Button size="sm" variant="ghost">Cancel</Button>
            <Button size="sm">Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function FilterRight() {
  return (
    <div className="flex h-full items-center pl-8">
      <Popover open>
        <PopoverTrigger render={<Button variant="outline" />}>
          <SlidersHorizontalIcon /> Filters
        </PopoverTrigger>
        <PopoverContent side="right" align="start">
          <PopoverHeader>
            <PopoverTitle>Show alarms</PopoverTitle>
          </PopoverHeader>
          <div className="mt-3 flex flex-col gap-2.5">
            {["Demand threshold", "Meter offline", "Power factor", "Voltage sag"].map((l, i) => (
              <Label key={l} className="flex items-center gap-2.5 font-normal">
                <Checkbox defaultChecked={i < 2} /> {l}
              </Label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function InfoTop() {
  return (
    <div className="flex h-full items-end justify-center pb-8">
      <Popover open>
        <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
          <CalendarIcon /> Billing period
        </PopoverTrigger>
        <PopoverContent side="top">
          <PopoverHeader>
            <PopoverTitle>Current billing period</PopoverTitle>
            <PopoverDescription>
              1–30 Sep · 18 days elapsed · 41,280 kWh so far, tracking 8% under last period.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}
