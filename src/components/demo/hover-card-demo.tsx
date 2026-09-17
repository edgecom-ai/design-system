"use client"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const sites = [
  {
    name: "Distribution Center",
    load: "1.24 MW",
    peak: "1.61 MW",
    peakAt: "14:20",
    meters: 14,
    tariff: "Time-of-use, winter",
  },
  {
    name: "Manufacturing Plant",
    load: "982 kW",
    peak: "1.08 MW",
    peakAt: "09:05",
    meters: 9,
    tariff: "Demand, tier 2",
  },
]

export function HoverCardDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Site</TableHead>
          <TableHead className="text-right">Live load</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow key={site.name}>
            <TableCell>
              {/* The row keeps the primary value; the breakdown that would
                  otherwise need three more columns moves into the hover card. */}
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <Button variant="link" size="sm" className="h-auto p-0">
                      {site.name}
                    </Button>
                  }
                />
                <HoverCardContent align="start">
                  <p className="font-medium">{site.name}</p>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
                    <dt>Meters</dt>
                    <dd className="tabular text-right text-foreground">
                      {site.meters}
                    </dd>
                    <dt>Peak today</dt>
                    <dd className="tabular text-right text-foreground">
                      {site.peak}
                    </dd>
                    <dt>Peak at</dt>
                    <dd className="tabular text-right text-foreground">
                      {site.peakAt}
                    </dd>
                    <dt>Tariff</dt>
                    <dd className="text-right text-foreground">{site.tariff}</dd>
                  </dl>
                </HoverCardContent>
              </HoverCard>
            </TableCell>
            <TableCell className="tabular text-right">{site.load}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
