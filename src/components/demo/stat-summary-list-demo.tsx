import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Short label/value lists for a side column: each row a muted label and a
// medium figure, the figures lined up on the right.
const cards = [
  {
    title: "This week",
    rows: [
      { label: "New customers", value: "86" },
      { label: "Average basket", value: "$37.55" },
      { label: "Refund rate", value: "1.8%" },
    ],
  },
  {
    title: "Shipping",
    rows: [
      { label: "Orders shipped", value: "1,142" },
      { label: "On-time delivery", value: "96%" },
      { label: "Average delivery", value: "2.4 days" },
    ],
  },
]

export function StatSummaryListDemo() {
  return (
    <div className="@container w-full">
      <div className="grid gap-4 @xl:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="flex flex-col gap-2.5">
                {card.rows.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3 text-body-sm">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="font-medium tabular-nums">{row.value}</dd>
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
