"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

// A week of weather, each day with its chance of rain. A likely-rain day is
// information worth noticing, so it takes the info tone — on the gauge, the
// day label and a tinted tile — and says so in words beside the colour.
const forecast = [
  { day: "Today", date: "Jun 15", high: 24, low: 15, rain: 78 },
  { day: "Tue", date: "Jun 16", high: 22, low: 14, rain: 54 },
  { day: "Wed", date: "Jun 17", high: 25, low: 16, rain: 31 },
  { day: "Thu", date: "Jun 18", high: 19, low: 13, rain: 83 },
  { day: "Fri", date: "Jun 19", high: 23, low: 14, rain: 42 },
  { day: "Sat", date: "Jun 20", high: 27, low: 17, rain: 8 },
  { day: "Sun", date: "Jun 21", high: 28, low: 18, rain: 5 },
]

const LIKELY = 70
const POSSIBLE = 40

function rainTone(chance: number) {
  if (chance >= POSSIBLE) return "text-info-emphasis"
  return "text-muted-foreground"
}

// Shows the scroll hint only while the rail is wider than its box.
function useIsScrollable(ref: React.RefObject<HTMLElement | null>) {
  const [scrollable, setScrollable] = React.useState(false)
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setScrollable(element.scrollWidth > element.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return scrollable
}

export function StatForecastStripDemo() {
  const rail = React.useRef<HTMLUListElement>(null)
  const scrollable = useIsScrollable(rail)

  return (
    <section aria-labelledby="forecast-heading" className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="forecast-heading" className="text-body-lg font-medium">
          7-day forecast
        </h3>
        {scrollable && (
          <span className="flex items-center gap-1 text-caption text-muted-foreground">
            Scroll for more
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </span>
        )}
      </div>
      {/* The rail scrolls inside itself; the page never scrolls sideways. */}
      <ul ref={rail} className="-m-0.5 flex snap-x gap-3 overflow-x-auto p-0.5 pb-2.5">
        {forecast.map((item) => {
          const likely = item.rain >= LIKELY
          return (
            <li key={item.date} className="w-46 flex-none snap-start">
              <Card size="sm" className={cn("h-full rounded-lg", likely && "bg-info-subtle ring-info/40")}>
                <CardContent className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex min-w-0 flex-col gap-px">
                      <span className={cn("text-body-sm font-medium", likely && "text-info-subtle-foreground")}>
                        {item.day}
                      </span>
                      <span className="text-caption text-muted-foreground">{item.date}</span>
                      <span className="flex items-baseline gap-1">
                        <span className="text-body-lg font-medium tabular-nums">{item.high}°</span>
                        <span className="text-caption text-muted-foreground tabular-nums">/ {item.low}°</span>
                      </span>
                    </div>
                    <CircularProgress
                      value={item.rain}
                      size={56}
                      strokeWidth={6}
                      className={rainTone(item.rain)}
                      progressBgClassName="text-current opacity-15"
                      showLabel
                      labelClassName="text-caption text-foreground tabular-nums"
                      role="img"
                      aria-label={`Chance of rain ${item.rain}%`}
                    />
                  </div>
                  <span className="text-caption whitespace-nowrap text-muted-foreground">
                    {likely ? <span className="text-info-subtle-foreground">Rain likely</span> : "Chance of rain"}
                  </span>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
