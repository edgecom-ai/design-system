"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import {
  BellIcon,
  CalendarIcon,
  HelpCircleIcon,
  InfoIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const sensorTypes = [
  { label: "Electricity", value: "electricity", unit: "kW" },
  { label: "Water", value: "water", unit: "m³/h" },
  { label: "Gas", value: "gas", unit: "m³/h" },
  { label: "Temperature", value: "temperature", unit: "°C" },
  { label: "Indoor air quality", value: "iaq", unit: "ppm" },
]

const sensors = [
  "Main Building — Incomer",
  "Manufacturing Plant — Feeder 1",
  "Distribution Center — HVAC",
  "Head Office — Rooftop Meter",
]

const aggregateMethods = ["Real-time", "Hourly", "Daily", "Weekly", "Monthly"]

const priorities = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]

const days = [
  { label: "S", full: "Sunday" },
  { label: "M", full: "Monday" },
  { label: "T", full: "Tuesday" },
  { label: "W", full: "Wednesday" },
  { label: "T", full: "Thursday" },
  { label: "F", full: "Friday" },
  { label: "S", full: "Saturday" },
]

function HelpHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="More information"
            className="text-muted-foreground/70 hover:text-foreground transition-colors"
          />
        }
      >
        <HelpCircleIcon className="size-3.5" />
      </TooltipTrigger>
      <TooltipContent className="max-w-56">{text}</TooltipContent>
    </Tooltip>
  )
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        {action}
      </div>
      {children}
    </div>
  )
}

export function CreateAlarmDialogDemo() {
  const [name, setName] = useState("")
  const [sensorType, setSensorType] = useState("electricity")
  const [sensor, setSensor] = useState(sensors[0])
  const [aggregate, setAggregate] = useState("Daily")
  const [range, setRange] = useState<DateRange | undefined>()
  const [dateOpen, setDateOpen] = useState(false)
  const [activeDays, setActiveDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ])
  const [priority, setPriority] = useState("medium")
  const [lower, setLower] = useState("500")
  const [upper, setUpper] = useState("1000")
  const [trigger, setTrigger] = useState("ongoing")
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(true)

  const unit =
    sensorTypes.find((s) => s.value === sensorType)?.unit ?? "kW"

  const toggleDay = (index: number) =>
    setActiveDays((prev) =>
      prev.includes(index)
        ? prev.filter((d) => d !== index)
        : [...prev, index].sort((a, b) => a - b)
    )

  const activeDaysText = useMemo(() => {
    if (activeDays.length === 7) return "every day"
    if (activeDays.length === 0) return "no days selected"
    const names = activeDays.map((d) => days[d].full)
    if (names.length === 1) return `on ${names[0]}s`
    return `on ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
  }, [activeDays])

  const channels = [email && "Email", sms && "SMS"].filter(Boolean)

  const summary = `Alert when the ${aggregate.toLowerCase()} value of ${
    sensor
  } falls below ${lower || "—"} ${unit} or rises above ${
    upper || "—"
  } ${unit}, ${activeDaysText}. ${
    trigger === "ongoing"
      ? "Re-trigger while the condition holds"
      : "Trigger once, then resolve"
  }.${
    channels.length ? ` Notify via ${channels.join(" and ")}.` : ""
  }`

  return (
    <TooltipProvider>
      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Create alarm</Button>}
        />
        <DialogContent
          className="flex max-h-[min(880px,92vh)] flex-col gap-0 overflow-y-auto p-0 max-sm:max-h-[min(650px,85vh)] sm:max-w-lg"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b px-6 py-4 pr-12">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
              <BellIcon className="size-4.5" />
            </span>
            <div className="space-y-0.5">
              <DialogTitle className="text-base leading-5 font-semibold">
                Create new alarm
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                Set up your custom alarm settings.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6">
              {/* Alarm name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="alarm-name">Alarm name</Label>
                <Input
                  id="alarm-name"
                  placeholder="Enter your alarm name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Source */}
              <SectionCard title="Source">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sensor-type">Sensor type</Label>
                    <Select
                      value={sensorType}
                      onValueChange={(v) => v && setSensorType(v)}
                    >
                      <SelectTrigger id="sensor-type" className="w-full">
                        <SelectValue placeholder="Select sensor type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensorTypes.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="sensor">Sensor</Label>
                    <Select
                      value={sensor}
                      onValueChange={(v) => v && setSensor(v)}
                    >
                      <SelectTrigger id="sensor" className="w-full">
                        <SelectValue placeholder="Select sensor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensors.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Current value:{" "}
                  <span className="text-foreground font-medium">
                    1,234.4 {unit}
                  </span>
                </p>
              </SectionCard>

              {/* Conditions */}
              <SectionCard title="Conditions">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="aggregate" className="gap-1.5">
                    Aggregate method
                    <HelpHint text="How raw readings are rolled up before the alarm is evaluated." />
                  </Label>
                  <Select
                    value={aggregate}
                    onValueChange={(v) => v && setAggregate(v)}
                  >
                    <SelectTrigger id="aggregate" className="w-full">
                      <SelectValue placeholder="Select aggregate method" />
                    </SelectTrigger>
                    <SelectContent>
                      {aggregateMethods.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lower" className="gap-1.5">
                      Lower bound ({unit})
                      <HelpHint text="Trigger the alarm when the value falls below this threshold." />
                    </Label>
                    <Input
                      id="lower"
                      inputMode="decimal"
                      value={lower}
                      onChange={(e) => setLower(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="upper" className="gap-1.5">
                      Upper bound ({unit})
                      <HelpHint text="Trigger the alarm when the value rises above this threshold." />
                    </Label>
                    <Input
                      id="upper"
                      inputMode="decimal"
                      value={upper}
                      onChange={(e) => setUpper(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="priority" className="gap-1.5">
                    Priority
                    <HelpHint text="Controls how prominently the alarm surfaces and how it escalates." />
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(v) => v && setPriority(v)}
                  >
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Select alarm priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SectionCard>

              {/* Schedule */}
              <SectionCard title="Schedule">
                <div className="flex flex-col gap-2">
                  <Label className="gap-1.5">
                    Alarm schedule
                    <HelpHint text="The window during which this alarm is evaluated." />
                  </Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 font-normal"
                        />
                      }
                    >
                      <CalendarIcon className="text-muted-foreground" />
                      {range?.from ? (
                        range.to ? (
                          <span>
                            {range.from.toLocaleDateString()} —{" "}
                            {range.to.toLocaleDateString()}
                          </span>
                        ) : (
                          <span>{range.from.toLocaleDateString()}</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          Start date — End date
                        </span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        numberOfMonths={1}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="gap-1.5">
                    Active days
                    <HelpHint text="Days of the week the alarm is allowed to fire." />
                  </Label>
                  <div className="flex items-center justify-between gap-1">
                    {days.map((day, index) => {
                      const selected = activeDays.includes(index)
                      return (
                        <button
                          key={index}
                          type="button"
                          aria-pressed={selected}
                          aria-label={day.full}
                          onClick={() => toggleDay(index)}
                          className={cn(
                            "flex size-9 items-center justify-center rounded-full border text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </SectionCard>

              {/* Trigger & notifications */}
              <SectionCard title="Trigger & notifications">
                <div className="flex flex-col gap-2">
                  <Label>Trigger options</Label>
                  <RadioGroup
                    value={trigger}
                    onValueChange={(v) => v && setTrigger(v as string)}
                    className="grid-cols-2"
                  >
                    <Label
                      htmlFor="trigger-ongoing"
                      className="flex items-center gap-2.5 rounded-lg border border-input px-3 py-2.5 font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <RadioGroupItem value="ongoing" id="trigger-ongoing" />
                      Ongoing
                    </Label>
                    <Label
                      htmlFor="trigger-once"
                      className="flex items-center gap-2.5 rounded-lg border border-input px-3 py-2.5 font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <RadioGroupItem value="once" id="trigger-once" />
                      Trigger once
                    </Label>
                  </RadioGroup>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Notification options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Label
                      htmlFor="notify-email"
                      className="flex items-center gap-2.5 rounded-lg border border-input px-3 py-2.5 font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <Checkbox
                        id="notify-email"
                        checked={email}
                        onCheckedChange={(v) => setEmail(v === true)}
                      />
                      Email
                    </Label>
                    <Label
                      htmlFor="notify-sms"
                      className="flex items-center gap-2.5 rounded-lg border border-input px-3 py-2.5 font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <Checkbox
                        id="notify-sms"
                        checked={sms}
                        onCheckedChange={(v) => setSms(v === true)}
                      />
                      SMS
                    </Label>
                  </div>
                </div>
              </SectionCard>

              {/* Summary */}
              <div className="bg-muted/50 flex gap-3 rounded-xl border border-border p-4">
                <InfoIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Alarm summary</p>
                  <p className="text-muted-foreground text-sm">{summary}</p>
                </div>
              </div>
          </div>
          {/* Footer */}
          <div className="bg-background sticky bottom-0 z-10 flex shrink-0 items-center justify-between gap-4 border-t px-6 py-4">
            <Badge variant="secondary" className="capitalize">
              {priority} priority
            </Badge>
            <div className="flex items-center gap-2">
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button />}>Create alarm</DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
