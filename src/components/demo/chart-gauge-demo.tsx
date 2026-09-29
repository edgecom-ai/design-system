import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

// A gauge reads one figure against its ceiling. The ring takes a status tone
// only because the figure is judged against a target — met is success, short
// of it is caution — and a badge says the same thing in words.
const gauges = [
  {
    title: "Demand reduction",
    description: "Last curtailment event · 14:00–17:00",
    value: 86,
    caption: "of target",
    status: { label: "Below target", variant: "warning", tone: "text-warning-emphasis" },
    facts: [
      { label: "Target", value: "400 kW" },
      { label: "Achieved", value: "344 kW" },
      { label: "Baseline", value: "1,210 kW" },
    ],
  },
  {
    title: "Data completeness",
    description: "Expected 15-minute readings received · last 7 days",
    value: 98,
    caption: "received",
    status: { label: "On target", variant: "success", tone: "text-success-emphasis" },
    facts: [
      { label: "Expected", value: "20,160" },
      { label: "Received", value: "19,757" },
      { label: "Gaps", value: "3" },
    ],
  },
] as const

export function ChartGaugeDemo() {
  return (
    // Two gauges side by side once their container has room for both rings.
    <div className="@container w-full">
      <div className="grid gap-4 @2xl:grid-cols-2">
        {gauges.map((gauge) => (
          <Card key={gauge.title}>
            <CardHeader>
              <CardTitle>{gauge.title}</CardTitle>
              <CardDescription>{gauge.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <CircularProgress
                value={gauge.value}
                size={176}
                strokeWidth={16}
                className={gauge.status.tone}
                progressBgClassName="text-current opacity-15"
                showLabel
                labelClassName="flex-col gap-0.5"
                renderLabel={(value) => (
                  <>
                    <span className="text-display text-foreground tabular-nums">{value}%</span>
                    <span className="text-caption text-muted-foreground">{gauge.caption}</span>
                  </>
                )}
                role="img"
                aria-label={`${gauge.title}: ${gauge.value}% — ${gauge.status.label.toLowerCase()}`}
              />
              <Badge variant={gauge.status.variant}>{gauge.status.label}</Badge>
              <dl className="grid w-full grid-cols-3 gap-3 border-t pt-4 text-center">
                {gauge.facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-0.5">
                    <dt className="text-caption text-muted-foreground">{fact.label}</dt>
                    <dd className="text-body-sm font-medium tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
