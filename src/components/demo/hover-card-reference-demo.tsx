"use client"

import { GaugeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardReferenceDemo() {
  return (
    <p className="max-w-prose text-body-sm">
      The overnight baseline for Cold Storage Facility is drawn from meter{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button variant="link" size="sm" className="h-auto p-0">
              MTR-4821
            </Button>
          }
        />
        <HoverCardContent>
          <div className="flex items-start gap-2.5">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <GaugeIcon className="size-4" />
            </span>
            <div>
              <p className="font-medium">MTR-4821</p>
              <p className="text-muted-foreground">
                Main incomer, Cold Storage Facility. Fifteen-minute interval
                data since March.
              </p>
              <Badge variant="electricity" className="mt-2">
                Electricity
              </Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      rather than the site total, so defrost cycles don&apos;t inflate it.
    </p>
  )
}
