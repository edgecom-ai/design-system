import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

// Progress toward the month's sales goal. Sales tag no commodity, so the ring
// and its legend dot take the miscellaneous ramp; the goal stays neutral.
const achieved = 41_020
const goal = 50_000
const percent = Math.round((achieved / goal) * 100)
const money = (value: number) => `$${value.toLocaleString("en-US")}`

const legend = [
  { label: "Achieved", value: money(achieved), swatch: "bg-chart-misc-500" },
  { label: "Goal", value: money(goal), swatch: "bg-muted-foreground/30" },
]

const details = [
  { label: "Best day", value: "$3,410 on Jun 6" },
  { label: "Days left", value: "15" },
]

export function StatPerformanceDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-caption tracking-wide text-muted-foreground uppercase">
          Monthly goal
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex items-center gap-5">
          <CircularProgress
            value={percent}
            size={112}
            strokeWidth={11}
            className="text-chart-misc-500"
            progressBgClassName="text-current opacity-15"
            showLabel
            labelClassName="flex-col gap-0.5"
            renderLabel={(value) => (
              <>
                <span className="text-title text-foreground tabular-nums">{value}%</span>
                <span className="text-caption text-muted-foreground">of goal</span>
              </>
            )}
            role="img"
            aria-label={`${percent}% of the ${money(goal)} monthly goal`}
          />
          <div className="flex flex-col gap-3">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={cn("size-2.5 shrink-0 rounded-full", item.swatch)} aria-hidden />
                <div className="flex flex-col">
                  <span className="text-body-sm font-medium tabular-nums">{item.value}</span>
                  <span className="text-caption text-muted-foreground">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <dl className="flex flex-col gap-2 border-t pt-3">
          {details.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3 text-body-sm">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium tabular-nums">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
