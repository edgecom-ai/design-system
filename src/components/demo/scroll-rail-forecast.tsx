// Shared by the scroll-rail demos: the tile a day of the forecast renders as,
// its skeleton, and the holder that keeps the card's height while a message
// stands in for the tiles. Sample data only — a fictional trailhead.
import * as React from "react"
import { addDays, format } from "date-fns"

import { Card, CardContent } from "@/components/ui/card"
import { RadialGauge } from "@/components/ui/radial-gauge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// The first day of the sample, fixed so the rail renders the same everywhere.
const SAMPLE_TODAY = new Date(2026, 10, 9)

// The UV index tops out at 11: anything at or past it is extreme.
const UV_EXTREME = 11

// Daily high in °C and UV index for the next two weeks.
const FORECAST: Array<[high: number, uv: number]> = [
  [21, 5], [23, 6], [19, 4], [25, 8], [29, 11], [27, 9], [16, 2],
  [15, 2], [22, 5], [24, 7], [28, 11], [26, 8], [20, 4], [18, 3],
]

export const forecastDays = FORECAST.map(([high, uv], index) => ({
  date: addDays(SAMPLE_TODAY, index),
  high,
  uv,
}))

export type ForecastDay = (typeof forecastDays)[number]

// A tile's width: wide enough for the figure, its gauge and the caption, and
// one the rail pages by.
export const TILE = "w-44"

// A rail stop is cornered at `lg`, inside the host card's `xl`.
export const TILE_CARD = "h-full rounded-lg"

export function ForecastTile({ day, isToday }: { day: ForecastDay; isToday: boolean }) {
  // Extreme UV is the one state a tile flags, with the destructive tint and
  // the emphasis text, and the gauge toned to match since it is judged
  // against that ceiling.
  const extreme = day.uv >= UV_EXTREME
  return (
    <Card size="sm" className={cn(TILE_CARD, extreme && "bg-destructive-subtle ring-destructive/30")}>
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 flex-col gap-px">
            <span className={cn("text-body-sm font-semibold", extreme && "text-destructive-emphasis")}>
              {isToday ? "Today" : format(day.date, "EEE")}
            </span>
            <span className="text-caption text-muted-foreground">{format(day.date, "MMM d")}</span>
            <span className="flex items-baseline gap-1">
              <span className="text-body-lg font-semibold tabular-nums">{day.high}°</span>
              <span className="text-caption text-muted-foreground">C</span>
            </span>
          </div>
          <RadialGauge
            size="tile"
            value={Math.min(Math.round((day.uv / UV_EXTREME) * 100), 100)}
            aria-label={`UV index ${day.uv} of ${UV_EXTREME}`}
            className={cn(extreme && "text-destructive-emphasis")}
          />
        </div>
        <span className="text-caption whitespace-nowrap text-muted-foreground tabular-nums">
          {extreme ? `Extreme UV, index ${day.uv}` : `UV index ${day.uv}`}
        </span>
      </CardContent>
    </Card>
  )
}

// The placeholder is the shape of the answer: the same slots, on the line
// boxes the tile's text will fill.
export function ForecastTileSkeleton() {
  return (
    <Card size="sm" className={TILE_CARD}>
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 flex-col gap-px">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="size-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}

// Empty and error keep the card at the height the tiles give it: the rail is
// held invisible under a centred message, so the layout never jumps when the
// answer arrives, or doesn't.
export function HeldRail({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <div className="relative" role="status">
      <div className="invisible" aria-hidden="true">
        {children}
      </div>
      <p className="absolute inset-0 flex items-center justify-center text-body text-muted-foreground">{message}</p>
    </div>
  )
}
