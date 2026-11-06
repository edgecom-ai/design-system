import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// The in-card table recipe (design.md → Layout → Tables): the card's content
// drops its horizontal padding, the header is a `strong` band, the edge cells
// sit on the card's content line, numbers are right-aligned tabular figures, a
// date that opens the day is a link button with no box of its own, and a
// footnote marker is a tooltip rather than a column.
const peaks = [
  { rank: 1, date: "Jul 18, 2026", at: "17:00", demand: "11,842 MW", site: "1,214 kW", note: "Provisional — the operator settles ranks after month end." },
  { rank: 2, date: "Jul 9, 2026", at: "16:00", demand: "11,610 MW", site: "1,188 kW" },
  { rank: 3, date: "Aug 2, 2026", at: "18:00", demand: "11,455 MW", site: "1,097 kW", note: "Site reading estimated from 15-minute intervals." },
  { rank: 4, date: "Jun 24, 2026", at: "17:00", demand: "11,302 MW", site: "1,142 kW" },
  { rank: 5, date: "Jul 30, 2026", at: "16:00", demand: "11,260 MW", site: "1,066 kW" },
]

// The first and last cells sit on the card's own content line.
const edge = "first:pl-(--card-spacing) last:pr-(--card-spacing)"

export function TableInCardDemo() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Coincident peaks</CardTitle>
        <CardDescription>Top five system peaks this season and the site&apos;s demand at each.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader variant="strong">
            <TableRow>
              <TableHead className={edge}>Rank</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hour ending</TableHead>
              <TableHead className="text-right">System demand</TableHead>
              <TableHead className={`text-right ${edge}`}>Site demand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peaks.map((peak) => (
              <TableRow key={peak.rank}>
                <TableCell className={`font-medium tabular-nums ${edge}`}>{peak.rank}</TableCell>
                <TableCell>
                  <Button variant="link" className="h-auto p-0">
                    {peak.date}
                  </Button>
                  {peak.note ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button variant="link" className="ml-0.5 h-auto p-0 align-super text-caption" aria-label="Footnote" />
                        }
                      >
                        *
                      </TooltipTrigger>
                      <TooltipContent>{peak.note}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </TableCell>
                <TableCell className="tabular-nums">{peak.at}</TableCell>
                <TableCell className="text-right tabular-nums">{peak.demand}</TableCell>
                <TableCell className={`text-right tabular-nums ${edge}`}>{peak.site}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
