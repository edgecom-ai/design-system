"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// The month's best sellers. Picking a product selects its row — on a page, it
// would open that product's sales on the charts beside it.
const topByMonth: Record<string, { product: string; category: string; units: number; revenue: number; returns: number }[]> = {
  "June 2026": [
    { product: "Linen tote bag", category: "Bags", units: 412, revenue: 9_888, returns: 6 },
    { product: "Ceramic pour-over", category: "Kitchen", units: 356, revenue: 12_460, returns: 11 },
    { product: "Wool throw", category: "Home", units: 298, revenue: 17_582, returns: 4 },
    { product: "Enamel mug", category: "Kitchen", units: 274, revenue: 4_384, returns: 2 },
    { product: "Canvas apron", category: "Kitchen", units: 231, revenue: 6_468, returns: 0 },
  ],
  "May 2026": [
    { product: "Wool throw", category: "Home", units: 344, revenue: 20_296, returns: 7 },
    { product: "Linen tote bag", category: "Bags", units: 318, revenue: 7_632, returns: 3 },
    { product: "Beeswax candle", category: "Home", units: 290, revenue: 5_220, returns: 1 },
    { product: "Ceramic pour-over", category: "Kitchen", units: 262, revenue: 9_170, returns: 9 },
    { product: "Enamel mug", category: "Kitchen", units: 240, revenue: 3_840, returns: 0 },
  ],
}

const months = Object.keys(topByMonth).map((month) => ({ value: month, label: month }))

// Edge cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"
const number = new Intl.NumberFormat("en-US")

export function WidgetTopProductsDemo() {
  const [month, setMonth] = React.useState(months[0].value)
  const [selected, setSelected] = React.useState<string>()
  const rows = topByMonth[month]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Top 5 products</CardTitle>
        <CardAction>
          <Select
            items={months}
            value={month}
            onValueChange={(next) => {
              if (!next) return
              setMonth(next)
              setSelected(undefined)
            }}
          >
            <SelectTrigger aria-label="Month" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={edge}>Product</TableHead>
              <TableHead className={edge}>Category</TableHead>
              <TableHead className={cn(edge, "text-right")}>Units sold</TableHead>
              <TableHead className={cn(edge, "text-right")}>Revenue ($)</TableHead>
              <TableHead className={cn(edge, "text-right")}>Returns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.product} data-state={selected === row.product ? "selected" : undefined}>
                <TableCell className={edge}>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    aria-pressed={selected === row.product}
                    onClick={() => setSelected(row.product)}
                  >
                    {row.product}
                  </Button>
                </TableCell>
                <TableCell className={cn(edge, "text-muted-foreground")}>{row.category}</TableCell>
                <TableCell className={cn(edge, "text-right tabular-nums")}>{number.format(row.units)}</TableCell>
                <TableCell className={cn(edge, "text-right tabular-nums")}>{number.format(row.revenue)}</TableCell>
                <TableCell className={cn(edge, "text-right tabular-nums")}>
                  {row.returns === 0 ? "—" : number.format(row.returns)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
