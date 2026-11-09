// The rail with nothing to show: the skeleton rail is held invisible under a
// centred message, so the card keeps the height the tiles would give it. An
// error state is the same holder with the error's message.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollRail, ScrollRailItem } from "@/components/ui/scroll-rail"
import { ForecastTileSkeleton, HeldRail, TILE, forecastDays } from "@/components/demo/scroll-rail-forecast"

export function ScrollRailEmptyDemo() {
  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle>14-day forecast</CardTitle>
        <CardDescription>Larkspur Ridge trailhead · daily high and UV index</CardDescription>
      </CardHeader>
      <CardContent>
        <HeldRail message="No forecast is published for the next 14 days.">
          <ScrollRail>
            {forecastDays.map((day) => (
              <ScrollRailItem key={day.date.getTime()} className={TILE}>
                <ForecastTileSkeleton />
              </ScrollRailItem>
            ))}
          </ScrollRail>
        </HeldRail>
      </CardContent>
    </Card>
  )
}
