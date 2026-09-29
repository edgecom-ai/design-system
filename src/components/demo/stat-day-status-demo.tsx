"use client"

import * as React from "react"
import { CheckIcon, ClockIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type Tone = "onTrack" | "atRisk" | "packed" | "moved"

// Status by meaning: on track is success, a pickup at risk is caution, and a
// moved pickup is a neutral record rather than an error.
const toneBadge = {
  onTrack: { label: "On track", variant: "success" },
  atRisk: { label: "At risk", variant: "warning" },
  packed: { label: "Packed", variant: "success" },
  moved: { label: "Moved", variant: "secondary" },
} as const

const toneCopy: Record<Tone, { state: string; detail: string }> = {
  onTrack: {
    state: "18 orders so far",
    detail: "Orders placed before 22:00 join tomorrow's pickup.",
  },
  atRisk: {
    state: "42 orders to pack",
    detail: "Pack and label by 15:30 to make the courier's pickup.",
  },
  packed: {
    state: "Ready for pickup",
    detail: "Every parcel is labelled. The courier arrives at 16:00.",
  },
  moved: {
    state: "Moved to tomorrow",
    detail: "Customers get an updated delivery date by email.",
  },
}

function DayStatusCard({
  heading,
  date,
  tone,
  window,
  onConfirm,
  onPostpone,
}: {
  heading: string
  date: string
  tone: Tone
  window?: string
  onConfirm?: () => void
  onPostpone?: () => void
}) {
  const badge = toneBadge[tone]
  const copy = toneCopy[tone]

  return (
    <Card role="region" aria-label={heading}>
      <CardHeader className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-body-sm font-medium tracking-wide text-muted-foreground uppercase">
            {heading}
          </span>
          <span className="text-caption text-muted-foreground">{date}</span>
        </div>
        <Badge variant={badge.variant}>
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          {badge.label}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-title">{copy.state}</span>
        {window && (
          <span className="flex w-fit flex-wrap items-center gap-1.5 rounded-md border px-2 py-1 text-caption text-muted-foreground tabular-nums">
            <ClockIcon className="size-3.5" aria-hidden />
            {window}
          </span>
        )}
        <span className="text-body text-muted-foreground">{copy.detail}</span>
      </CardContent>
      {(onConfirm || onPostpone) && (
        <CardContent className="mt-auto flex flex-wrap gap-2">
          {onConfirm && (
            <Button className="flex-[1_1_9rem]" onClick={onConfirm}>
              <CheckIcon data-icon="inline-start" />
              Mark all packed
            </Button>
          )}
          {onPostpone && (
            <Button variant="outline" className="flex-[1_1_9rem]" onClick={onPostpone}>
              Move to tomorrow
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export function StatDayStatusDemo() {
  const [today, setToday] = React.useState<Tone>("atRisk")

  function confirm() {
    setToday("packed")
    toast.success("Orders packed", { description: "42 parcels are ready for the 16:00 pickup." })
  }

  function postpone() {
    setToday("moved")
    toast.warning("Pickup moved", { description: "Today's 42 orders ship with tomorrow's pickup." })
  }

  return (
    <div className="@container w-full">
      <div className="grid gap-4 @xl:grid-cols-2">
        <DayStatusCard
          heading="Today"
          date="Mon, Jun 15"
          tone={today}
          window="Courier pickup 16:00 · 42 parcels"
          onConfirm={today === "atRisk" || today === "moved" ? confirm : undefined}
          onPostpone={today === "atRisk" ? postpone : undefined}
        />
        <DayStatusCard heading="Tomorrow" date="Tue, Jun 16" tone="onTrack" />
      </div>
    </div>
  )
}
