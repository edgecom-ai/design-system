// Timeline preview — vertical event history with dot statuses.
import { ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
  TimelineTag,
} from "@/components/ui/timeline"

export { TimelineDemo as EventHistory } from "@/components/demo/timeline-demo"

export function DotStatuses() {
  return (
    <Timeline className="w-full max-w-md">
      <TimelineItem status="done" className="gap-x-3">
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineHeading>Alarm raised — demand over 950 kW</TimelineHeading>
        <TimelineContent className="pb-6">
          <span className="text-body-sm text-muted-foreground">Chiller plant incomer · 14:02</span>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done" className="gap-x-3">
        <TimelineDot status="error" />
        <TimelineLine done />
        <TimelineHeading>Auto-curtailment failed</TimelineHeading>
        <TimelineContent className="pb-6">
          <span className="text-body-sm text-muted-foreground">BMS did not acknowledge the setpoint · 14:04</span>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done" className="gap-x-3">
        <TimelineDot status="current" />
        <TimelineLine />
        <TimelineHeading>Operator acknowledged</TimelineHeading>
        <TimelineContent className="pb-6">
          <span className="text-body-sm text-muted-foreground">Bianca Ngan · manual load shed in progress</span>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem className="gap-x-3">
        <TimelineDot status="custom">
          <ZapIcon className="size-4 text-warning" />
        </TimelineDot>
        <TimelineHeading variant="secondary">Alarm cleared</TimelineHeading>
        <TimelineContent className="pb-0">
          <span className="text-body-sm text-muted-foreground">Pending</span>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}

const tagged = [
  { time: "08:00", heading: "Interval data received", detail: "96 intervals · 0 gaps", done: true },
  { time: "09:15", heading: "Baseline recomputed", detail: "14-day rolling average · 612 kW", done: true },
  { time: "11:40", heading: "Tariff period change", detail: "Off-peak → mid-peak", done: false },
]

export function WithTimestamps() {
  return (
    <Timeline positions="center" className="w-full max-w-lg">
      {tagged.map((e, i) => (
        <TimelineItem key={e.heading} status={e.done ? "done" : "default"} className="gap-x-3">
          <TimelineTag side="left">
            <Badge variant="outline" className="tabular-nums">{e.time}</Badge>
          </TimelineTag>
          <TimelineDot status={e.done ? "done" : "current"} />
          {i < tagged.length - 1 && <TimelineLine done={e.done} />}
          <TimelineHeading side="right">{e.heading}</TimelineHeading>
          <TimelineContent side="right" className="pb-6">
            <span className="text-body-sm text-muted-foreground">{e.detail}</span>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
