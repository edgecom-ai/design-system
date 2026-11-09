"use client"

// The tile rail as a card draws it: a fortnight of day tiles that snap and
// page by whole tiles, the pill scrollbar in the rail's foot, and paging
// arrows in the card's action slot — each shown only while tiles are off
// screen on its side. A day of extreme UV takes the destructive tint.
import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollRail, ScrollRailItem, useScrollRailEdges } from "@/components/ui/scroll-rail"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ForecastTile, TILE, forecastDays } from "@/components/demo/scroll-rail-forecast"

export function ScrollRailDemo() {
  // Held as state rather than in a ref, so the first measurement re-renders
  // the arrows that depend on it.
  const [rail, setRail] = React.useState<HTMLUListElement | null>(null)
  const { canScrollBack, canScrollForward } = useScrollRailEdges(rail, forecastDays.length)
  const page = (direction: -1 | 1) => rail?.scrollBy({ left: direction * rail.clientWidth })

  return (
    <TooltipProvider>
      <Card className="w-full min-w-0">
        <CardHeader>
          <CardTitle>14-day forecast</CardTitle>
          <CardDescription>Larkspur Ridge trailhead · daily high and UV index</CardDescription>
          {/* Each arrow only while there are tiles off screen its way, hung
              over the title's line so the tiles don't move as they come and go. */}
          <CardAction className="-my-0.5 flex gap-1">
            {canScrollBack ? (
              <Tooltip>
                <TooltipTrigger
                  render={<Button variant="outline" size="icon-sm" aria-label="Earlier days" onClick={() => page(-1)} />}
                >
                  <ArrowLeftIcon />
                </TooltipTrigger>
                <TooltipContent>Earlier days</TooltipContent>
              </Tooltip>
            ) : null}
            {canScrollForward ? (
              <Tooltip>
                <TooltipTrigger
                  render={<Button variant="outline" size="icon-sm" aria-label="Later days" onClick={() => page(1)} />}
                >
                  <ArrowRightIcon />
                </TooltipTrigger>
                <TooltipContent>Later days</TooltipContent>
              </Tooltip>
            ) : null}
          </CardAction>
        </CardHeader>
        <CardContent>
          <ScrollRail ref={setRail} aria-label="Daily forecast">
            {forecastDays.map((day, index) => (
              <ScrollRailItem key={day.date.getTime()} className={TILE}>
                <ForecastTile day={day} isToday={index === 0} />
              </ScrollRailItem>
            ))}
          </ScrollRail>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
