// The rail while its tiles load: the same rail, with a skeleton at each
// tile's shape, so the card is already the height of the answer.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollRail, ScrollRailItem } from "@/components/ui/scroll-rail"
import { ForecastTileSkeleton, TILE, forecastDays } from "@/components/demo/scroll-rail-forecast"

export function ScrollRailLoadingDemo() {
  return (
    <Card className="w-full min-w-0" aria-busy="true">
      <CardHeader>
        <CardTitle>14-day forecast</CardTitle>
        <CardDescription>Larkspur Ridge trailhead · daily high and UV index</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="sr-only">Loading the forecast</span>
        <ScrollRail aria-hidden="true">
          {forecastDays.map((day) => (
            <ScrollRailItem key={day.date.getTime()} className={TILE}>
              <ForecastTileSkeleton />
            </ScrollRailItem>
          ))}
        </ScrollRail>
      </CardContent>
    </Card>
  )
}
