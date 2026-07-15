import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineHeading,
  TimelineContent,
} from "@/components/ui/timeline"

const events: {
  dot: "done" | "current" | "default"
  heading: string
  detail: string
}[] = [
  { dot: "done", heading: "Meter provisioned", detail: "Toronto DC · main electricity meter online" },
  { dot: "done", heading: "Baseline established", detail: "14-day interval baseline computed" },
  { dot: "current", heading: "DR event dispatched", detail: "IESO Ontario · 480 kW curtailment target" },
  { dot: "default", heading: "Settlement pending", detail: "Awaiting IESO performance report" },
]

export function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-md">
      {events.map((e, i) => (
        <TimelineItem
          key={e.heading}
          status={e.dot === "default" ? "default" : "done"}
          className="gap-x-3"
        >
          <TimelineDot status={e.dot} />
          {i < events.length - 1 && <TimelineLine />}
          <TimelineHeading className="text-sm font-medium">
            {e.heading}
          </TimelineHeading>
          <TimelineContent className="pb-6">
            <span className="text-sm text-muted-foreground">{e.detail}</span>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
